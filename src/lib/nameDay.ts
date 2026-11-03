// Name day: the feast of your patron saint, given as a church date (e.g. St. Nicholas, December 6)
// and observed on the matching civil day for the chosen calendar. Kept free of app imports for testing.
import { addDays, churchDate, dateOnly, fixedDate, type ChurchCalendar } from "./fastingSeasons";

export type PatronSaint = { name: string; month: number; day: number };

function isValid(patron: PatronSaint | null | undefined): patron is PatronSaint {
  return !!patron && !!patron.name?.trim() && patron.month >= 1 && patron.month <= 12 && patron.day >= 1 && patron.day <= 31;
}

/** "today" on the name day itself, "eve" the day before, otherwise null. */
export function nameDayStatus(patron: PatronSaint | null | undefined, today: Date, calendar: ChurchCalendar) {
  if (!isValid(patron)) return null;
  const matches = (day: Date) => {
    const church = churchDate(day, calendar);
    return church.getMonth() + 1 === patron.month && church.getDate() === patron.day;
  };
  if (matches(today)) return "today";
  if (matches(addDays(today, 1))) return "eve";
  return null;
}

/** The next civil date of the name day, on or after `from`. */
export function nextNameDay(patron: PatronSaint, from: Date, calendar: ChurchCalendar) {
  const start = dateOnly(from);
  // Old Calendar dates late in December land in January, so check last year's feast too.
  for (const year of [start.getFullYear() - 1, start.getFullYear(), start.getFullYear() + 1]) {
    const date = fixedDate(year, patron.month, patron.day, calendar);
    if (date >= start) return date;
  }
  return fixedDate(start.getFullYear() + 1, patron.month, patron.day, calendar);
}
