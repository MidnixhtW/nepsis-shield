import { dayIcon } from "@/lib/dayIcon";
import type { ChurchCalendar } from "@/lib/fastingSeasons";

// Today already shows the day's icon at the top. When an hour's picture would be that same icon (the Theotokos through
// the Nativity Fast, the Pantocrator on ordinary days), the hour shows a second icon instead, everywhere it appears:
// Pray's lead card, the Morning, Evening and Night cards, and the head of the prayer itself.
const DAY_IMAGE_FOR_TILE: Record<string, string> = {
  pantocrator: "spas-vsederzhitel",
  theotokos: "vladimirskaya",
  lamentation: "lamentation-icon",
  ladder: "the-ladder-of-divine-ascent",
};
const ALTERNATE: Record<string, string> = { pantocrator: "transfiguration", theotokos: "annunciation", lamentation: "ladder", ladder: "transfiguration" };

export function artAvoidingToday(art: string, now: Date, calendar: ChurchCalendar) {
  const match = DAY_IMAGE_FOR_TILE[art];
  if (!match || !dayIcon(now, calendar).imageUrl.includes(match)) return art;
  return ALTERNATE[art] ?? art;
}
