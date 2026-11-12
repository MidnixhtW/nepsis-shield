// Where today stands in the Church year and in the day itself, for the Pray now card and full-screen prayer.
// The season colors match the Church Year theme (src/styles/themes/seasonal.css) but are used in every theme.
import { format } from "date-fns";
import { currentSeason, type ChurchCalendar } from "@/lib/fastingSeasons";
import { liturgicalSeason, type LiturgicalSeason } from "@/lib/liturgicalSeason";

/** The liturgical color of each season, as an HSL triplet. */
export const SEASON_COLOR: Record<LiturgicalSeason, string> = {
  ordinary: "42 62% 56%", // icon gold
  lent: "272 38% 58%", // violet
  pascha: "356 70% 56%", // paschal crimson
  pentecost: "145 42% 44%", // green
  theotokos: "208 70% 54%", // blue
  "nativity-fast": "348 52% 50%", // wine red
  nativity: "44 80% 54%", // bright gold
};

const FEAST_PHRASE: Partial<Record<LiturgicalSeason, string>> = {
  pascha: "in the Paschal season",
  pentecost: "in the week of Pentecost",
  theotokos: "a feast of the Theotokos",
  nativity: "in the feast of the Nativity",
};

/**
 * The season in a few words: "In the Nativity Fast", "In Great Lent", "A feast of the Theotokos". The fasts come first,
 * then feast seasons; ordinary days have none. `sentence` adds the date, for places that do not show it already.
 */
export function dayInTheChurch(day: Date, calendar: ChurchCalendar) {
  const season = liturgicalSeason(day, calendar);
  const fast = currentSeason(day, calendar)?.season;
  const phrase =
    fast && fast.id !== "paschal" ? `in ${fast.id === "great-lent" || fast.id === "holy-week" ? "" : "the "}${fast.name}` : FEAST_PHRASE[season];
  const date = format(day, "EEEE, MMMM d");
  return {
    season,
    color: SEASON_COLOR[season],
    label: phrase ? phrase.charAt(0).toUpperCase() + phrase.slice(1) : null,
    sentence: phrase ? `${date}, ${phrase}.` : `${date}.`,
  };
}

export type SkyPhase = "dawn" | "day" | "dusk" | "night";

/** The part of the day by the clock: dawn 4 to 9, day 9 to 16, dusk 16 to 20, night otherwise. */
export function skyPhase(now: Date): SkyPhase {
  const hour = now.getHours();
  if (hour >= 4 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 16) return "day";
  if (hour >= 16 && hour < 20) return "dusk";
  return "night";
}

/** A soft light from above for each part of the day; kept faint so it reads on light and dark themes alike. */
export const SKY_GRADIENT: Record<SkyPhase, string> = {
  dawn: "radial-gradient(120% 80% at 50% -10%, hsl(18 85% 62% / 0.22), hsl(330 45% 55% / 0.08) 45%, transparent 75%)",
  day: "radial-gradient(120% 80% at 50% -10%, hsl(45 90% 65% / 0.18), hsl(200 60% 60% / 0.06) 50%, transparent 75%)",
  dusk: "radial-gradient(120% 80% at 50% -10%, hsl(28 90% 55% / 0.22), hsl(280 40% 45% / 0.12) 50%, transparent 78%)",
  night: "radial-gradient(120% 80% at 50% -10%, hsl(228 55% 45% / 0.26), hsl(250 40% 30% / 0.10) 50%, transparent 78%)",
};
