import type { AppSettings, Jurisdiction } from "@/lib/settings";
import { addDays, dateOnly, daysBetween, fixedDate, orthodoxPascha, type ChurchCalendar } from "@/lib/fastingSeasons";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

// How the person prays. One answer sets the jurisdiction, the Western Rite switch and the calendar, so the
// labels, fasting wording and church links across the app all follow it.
export type Tradition = "orthodox" | "western-rite" | "melkite" | "byzantine-catholic";

export const TRADITION_CHOSEN_KEY = "nepsis:tradition-chosen";

const ORTHODOX_JURISDICTIONS: Jurisdiction[] = ["oca", "goarch", "antiochian", "rocor"];

export function getTradition(settings: Pick<AppSettings, "jurisdiction" | "westernRite">): Tradition {
  if (settings.jurisdiction === "melkite") return "melkite";
  if (settings.jurisdiction === "ruthenian") return "byzantine-catholic";
  return settings.westernRite ? "western-rite" : "orthodox";
}

export function isEasternCatholic(tradition: Tradition) {
  return tradition === "melkite" || tradition === "byzantine-catholic";
}

export function traditionPatch(tradition: Tradition, current: AppSettings): Partial<AppSettings> {
  const orthodoxJurisdiction = ORTHODOX_JURISDICTIONS.includes(current.jurisdiction) ? current.jurisdiction : "oca";
  switch (tradition) {
    case "orthodox":
      return { jurisdiction: orthodoxJurisdiction, westernRite: false };
    case "western-rite":
      // Western Rite parishes are in the Antiochian Archdiocese and ROCOR.
      return {
        jurisdiction: current.jurisdiction === "rocor" ? "rocor" : "antiochian",
        westernRite: true,
      };
    case "melkite":
      return { jurisdiction: "melkite", westernRite: false, calendarMode: "gregorian" };
    case "byzantine-catholic":
      return { jurisdiction: "ruthenian", westernRite: false, calendarMode: "gregorian" };
  }
}

export function traditionChosen(settings: AppSettings) {
  if (getStoredItem<boolean>(TRADITION_CHOSEN_KEY)) return true;
  // Someone who already set a jurisdiction or the Western Rite in Settings has answered the question.
  return settings.jurisdiction !== "oca" || settings.westernRite;
}

export function markTraditionChosen() {
  setStoredItem(TRADITION_CHOSEN_KEY, true);
}

export const TRADITION_OPTIONS: Array<{ id: Tradition; title: string; description: string }> = [
  { id: "orthodox", title: "Orthodox", description: "OCA, Greek, Antiochian, Russian and other Orthodox parishes." },
  { id: "western-rite", title: "Western Rite Orthodox", description: "Orthodox parishes that pray the Mass and the Western office." },
  { id: "melkite", title: "Melkite Greek Catholic", description: "The Byzantine liturgy, in communion with Rome." },
  { id: "byzantine-catholic", title: "Byzantine Catholic", description: "Ruthenian and other Byzantine Catholic parishes." },
];

/** The closing line under the day's fast, in the words each church would use. */
export function fastingAdvice(tradition: Tradition) {
  return isEasternCatholic(tradition)
    ? "This is the traditional rule. Your eparchy may ask less, so follow your pastor."
    : "Adapt fasting with your priest for health and duty needs.";
}

export type LibraryLink = { label: string; url: string; hint: string };

export function libraryFor(tradition: Tradition): { title: string; intro: string; links: LibraryLink[] } {
  switch (tradition) {
    case "western-rite":
      return {
        title: "Library",
        intro: "The Western Rite in the Orthodox Church, and the wider Orthodox library.",
        links: [
          { label: "The Orthodox West", url: "https://www.orthodoxwest.com/", hint: "Antiochian Western Rite Vicariate" },
          { label: "Antiochian Archdiocese", url: "https://www.antiochian.org/", hint: "Articles, news and parishes" },
          { label: "Questions and answers", url: "https://www.oca.org/questions", hint: "Orthodox Church in America" },
        ],
      };
    case "melkite":
      return {
        title: "Library",
        intro: "Your eparchy first, then the shared Byzantine library.",
        links: [
          { label: "Melkite Eparchy of Newton", url: "https://melkite.org/", hint: "Melkite Greek Catholic Church in the U.S." },
          { label: "Byzantine prayers", url: "https://www.oca.org/orthodoxy/prayers", hint: "Shared Byzantine prayer texts (OCA)" },
        ],
      };
    case "byzantine-catholic":
      return {
        title: "Library",
        intro: "Your metropolia first, then the shared Byzantine library.",
        links: [
          { label: "Archeparchy of Pittsburgh", url: "https://www.archpitt.org/", hint: "Byzantine Catholic Metropolitan Church" },
          { label: "Byzantine prayers", url: "https://www.oca.org/orthodoxy/prayers", hint: "Shared Byzantine prayer texts (OCA)" },
        ],
      };
    default:
      return {
        title: "Library",
        intro: "Articles from the Orthodox Church in America.",
        links: [
          { label: "Questions and answers", url: "https://www.oca.org/questions", hint: "Short answers from OCA priests" },
          { label: "Prayers", url: "https://www.oca.org/orthodoxy/prayers", hint: "Prayer texts" },
          { label: "The Orthodox Faith", url: "https://www.oca.org/orthodoxy/the-orthodox-faith", hint: "Fr. Thomas Hopko's four volumes" },
          { label: "Daily readings", url: "https://www.oca.org/readings", hint: "Scripture for every day" },
        ],
      };
  }
}

// The Western Church year, as Western Rite Orthodox parishes keep it: the fixed feasts on the chosen calendar and the
// moveable ones from Orthodox Pascha.
export type WesternSeason = { name: string; week?: number };

function adventSunday(year: number, calendar: ChurchCalendar) {
  const christmas = fixedDate(year, 12, 25, calendar);
  const back = christmas.getDay() === 0 ? 28 : christmas.getDay() + 21;
  return addDays(christmas, -back);
}

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"];

export function westernSeason(day: Date, calendar: ChurchCalendar): WesternSeason {
  const today = dateOnly(day);
  const year = today.getFullYear();
  const advent = adventSunday(year, calendar);
  const christmas = fixedDate(year, 12, 25, calendar);
  // On the Old Calendar, Christmas falls on January 7, so early January can still be Advent.
  const lastChristmas = fixedDate(year - 1, 12, 25, calendar);
  const epiphany = fixedDate(year, 1, 6, calendar);
  const pascha = orthodoxPascha(year);
  const p = daysBetween(pascha, today);

  if (today < lastChristmas) {
    const lastAdvent = adventSunday(year - 1, calendar);
    return { name: "Advent", week: Math.floor(daysBetween(lastAdvent, today) / 7) + 1 };
  }
  if (today < epiphany || today >= christmas) return { name: "Christmastide" };
  if (today >= advent) return { name: "Advent", week: Math.floor(daysBetween(advent, today) / 7) + 1 };
  if (p < -63) return { name: "Epiphanytide" };
  if (p < -46) return { name: "Pre-Lent" };
  if (p < -14) return { name: "Lent", week: Math.floor((p + 46) / 7) + 1 };
  if (p < -7) return { name: "Passiontide" };
  if (p < 0) return { name: "Holy Week" };
  if (p < 39) return { name: "Eastertide" };
  if (p < 49) return { name: "Ascensiontide" };
  if (p < 56) return { name: "Whitsuntide" };
  return { name: "Trinitytide" };
}

export function westernSeasonLine(day: Date, calendar: ChurchCalendar) {
  const season = westernSeason(day, calendar);
  if (season.week && season.week <= ORDINALS.length) return `${season.name}, ${ORDINALS[season.week - 1]} week`;
  return season.name;
}
