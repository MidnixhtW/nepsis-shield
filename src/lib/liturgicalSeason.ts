// Which liturgical color season a day falls in, for the Church Year theme.
// Kept free of app imports so it can be tested directly.
import { churchDate, daysBetween, orthodoxPascha, type ChurchCalendar } from "./fastingSeasons";

export type LiturgicalSeason = "ordinary" | "lent" | "pascha" | "pentecost" | "theotokos" | "nativity-fast" | "nativity";

export function liturgicalSeason(day: Date, calendar: ChurchCalendar): LiturgicalSeason {
  const church = churchDate(day, calendar);
  const month = church.getMonth() + 1;
  const date = church.getDate();

  // The Annunciation keeps its blue even when it falls in Lent.
  if (month === 3 && date === 25) return "theotokos";

  const fromPascha = daysBetween(orthodoxPascha(day.getFullYear()), day);
  if (fromPascha >= -48 && fromPascha < 0) return "lent";
  if (fromPascha >= 0 && fromPascha < 49) return "pascha";
  if (fromPascha >= 49 && fromPascha <= 56) return "pentecost";

  if ((month === 12 && date >= 25) || (month === 1 && date <= 14)) return "nativity";
  // The Entry of the Theotokos (Nov 21) falls inside the Nativity Fast and keeps its own color.
  if (month === 11 && date === 21) return "theotokos";
  if ((month === 11 && date >= 15) || month === 12) return "nativity-fast";
  // The Dormition Fast through the Leave-taking of the Dormition, and the Nativity of the Theotokos.
  if (month === 8 && date <= 23) return "theotokos";
  if (month === 9 && date >= 8 && date <= 12) return "theotokos";
  return "ordinary";
}

export const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  ordinary: "Ordinary time",
  lent: "Great Lent",
  pascha: "Pascha",
  pentecost: "Pentecost",
  theotokos: "Feast of the Theotokos",
  "nativity-fast": "Nativity Fast",
  nativity: "Nativity and Theophany",
};
