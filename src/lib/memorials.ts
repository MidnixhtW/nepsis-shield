// Memorial days for the departed, counted the way the Church does: the day of repose is the
// first day, so the 3rd, 9th, and 40th days fall 2, 8, and 39 days after it. Also the general
// Saturdays of Souls, which move with Pascha. Kept free of app imports so it can be tested directly.
import { addDays, dateOnly, daysBetween, orthodoxPascha } from "./fastingSeasons";

export type Memorial = { date: Date; label: string; name?: string };

/** Parses a stored "YYYY-MM-DD" repose date as a local calendar day. */
export function parseDay(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Memorials for one departed person that fall between `from` and `from + withinDays` (inclusive). */
export function memorialsFor(name: string, reposed: string | undefined, from: Date, withinDays: number): Memorial[] {
  const repose = parseDay(reposed);
  if (!repose) return [];
  const start = dateOnly(from);
  const end = addDays(start, withinDays);
  const inRange = (date: Date) => date >= start && date <= end;

  const result: Memorial[] = [
    { date: addDays(repose, 2), label: "3rd day" },
    { date: addDays(repose, 8), label: "9th day" },
    { date: addDays(repose, 39), label: "40th day" },
  ]
    .filter((memorial) => inRange(memorial.date))
    .map((memorial) => ({ ...memorial, name }));

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    const years = year - repose.getFullYear();
    if (years < 1) continue;
    const anniversary = new Date(year, repose.getMonth(), repose.getDate());
    if (inRange(anniversary)) result.push({ date: anniversary, label: years === 1 ? "1 year" : `${years} years`, name });
  }
  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** The general Saturdays of Souls between `from` and `from + withinDays`. */
export function soulSaturdays(from: Date, withinDays: number): Memorial[] {
  const start = dateOnly(from);
  const end = addDays(start, withinDays);
  const result: Memorial[] = [];
  for (let year = start.getFullYear() - 1; year <= end.getFullYear() + 1; year++) {
    const pascha = orthodoxPascha(year);
    const days: Array<[number, string]> = [
      [-57, "Meatfare Saturday of Souls"],
      [-36, "Second Saturday of Lent: Saturday of Souls"],
      [-29, "Third Saturday of Lent: Saturday of Souls"],
      [-22, "Fourth Saturday of Lent: Saturday of Souls"],
      [48, "Saturday of Souls before Pentecost"],
    ];
    for (const [offset, label] of days) {
      const date = addDays(pascha, offset);
      if (date >= start && date <= end) result.push({ date, label });
    }
  }
  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** The next personal memorial for someone, within a year, if any. */
export function nextMemorial(name: string, reposed: string | undefined, from: Date) {
  return memorialsFor(name, reposed, from, 366)[0] ?? null;
}

export function daysUntil(from: Date, date: Date) {
  return daysBetween(from, date);
}
