// The Twelve Great Feasts and Pascha, by civil date on either calendar.
// Kept free of app imports so it can be tested directly.
import { addDays, dateOnly, fixedDate, orthodoxPascha, type ChurchCalendar } from "./fastingSeasons";

/** The Twelve Great Feasts and Pascha that fall on this civil day, or null. */
export function greatFeast(day: Date, calendar: ChurchCalendar): string | null {
  const today = dateOnly(day);
  const year = today.getFullYear();
  const pascha = orthodoxPascha(year);
  const moveable: Array<[Date, string]> = [
    [addDays(pascha, -7), "The Entry of the Lord into Jerusalem"],
    [pascha, "Pascha, the Resurrection of Christ"],
    [addDays(pascha, 39), "The Ascension of the Lord"],
    [addDays(pascha, 49), "Pentecost"],
  ];
  // Fixed feasts by church date; on the Old Calendar the civil date is 13 days later (fixedDate handles it).
  const fixed: Array<[number, number, string]> = [
    [1, 6, "Theophany"],
    [2, 2, "The Meeting of the Lord"],
    [3, 25, "The Annunciation"],
    [8, 6, "The Transfiguration"],
    [8, 15, "The Dormition of the Theotokos"],
    [9, 8, "The Nativity of the Theotokos"],
    [9, 14, "The Exaltation of the Cross"],
    [11, 21, "The Entry of the Theotokos into the Temple"],
    [12, 25, "The Nativity of Christ"],
  ];
  for (const [date, name] of moveable) if (date.getTime() === today.getTime()) return name;
  // A church date late in the year can fall in the next civil year on the Old Calendar, so check both.
  for (const churchYear of [year - 1, year]) {
    for (const [month, date, name] of fixed) {
      if (fixedDate(churchYear, month, date, calendar).getTime() === today.getTime()) return name;
    }
  }
  return null;
}

