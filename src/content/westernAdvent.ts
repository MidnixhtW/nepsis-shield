// Western Advent: the four Sundays before Christmas, as kept in Western Rite parishes and by Catholics. The collects are
// the old Roman ones for each Sunday, from the Gregorian Sacramentary (before the Schism), in traditional English.

export type AdventWeek = { candle: "violet" | "rose"; theme: string; collect: string };

export const ADVENT_WEEKS: AdventWeek[] = [
  {
    candle: "violet",
    theme: "Watch: He is coming",
    collect:
      "Stir up thy power, we beseech thee, O Lord, and come: that from the dangers which threaten us through our sins we may be rescued by thy protection and saved by thy deliverance. Who livest and reignest, world without end. Amen.",
  },
  {
    candle: "violet",
    theme: "Prepare the way of the Lord",
    collect:
      "Stir up our hearts, O Lord, to make ready the ways of thine only-begotten Son: that through his coming we may be worthy to serve thee with purified minds. Who liveth and reigneth with thee, world without end. Amen.",
  },
  {
    candle: "rose",
    theme: "Rejoice: the Lord is near (Gaudete)",
    collect:
      "Incline thine ear to our prayers, we beseech thee, O Lord, and enlighten the darkness of our minds by the grace of thy visitation. Who livest and reignest, world without end. Amen.",
  },
  {
    candle: "violet",
    theme: "Behold, a virgin shall conceive",
    collect:
      "Stir up thy power, we beseech thee, O Lord, and come, and succour us with great might: that by the help of thy grace, what our sins hinder may be hastened by thy merciful forgiveness. Who livest and reignest, world without end. Amen.",
  },
];

/** The first Sunday of Advent: the fourth Sunday before Christmas Day. */
export function adventStart(year: number) {
  const christmas = new Date(year, 11, 25);
  const back = christmas.getDay() === 0 ? 7 : christmas.getDay();
  return new Date(year, 11, 25 - back - 21);
}

/** Which week of Advent a day falls in (1 to 4), or null outside Advent (Christmas Eve is the last day). */
export function adventWeek(day: Date): number | null {
  const start = adventStart(day.getFullYear());
  const date = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const christmas = new Date(day.getFullYear(), 11, 25);
  if (date < start || date >= christmas) return null;
  return Math.min(4, Math.floor((date.getTime() - start.getTime()) / (7 * 86_400_000)) + 1);
}
