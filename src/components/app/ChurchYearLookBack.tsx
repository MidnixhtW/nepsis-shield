import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCommemorations } from "@/lib/commemorations";
import { prayerDaysBetween } from "@/lib/dailyHabits";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { churchDate, fixedDate, type ChurchCalendar } from "@/lib/fastingSeasons";

const JOURNEYS_KEY = "fasting-journeys:v1";
const HIDDEN_KEY = "church-year-look-back:hidden";
const SHOWN_DAYS = 7;

/** Days marked kept in fasts that began in the church year, from the saved journeys ("nativity-fast-2025-11-15"). */
function fastDaysKept(from: Date, to: Date) {
  const journeys = getStoredItem<Record<string, number[]>>(JOURNEYS_KEY) ?? {};
  let total = 0;
  for (const [key, days] of Object.entries(journeys)) {
    const started = key.match(/(\d{4})-(\d{2})-(\d{2})$/);
    if (!started || !Array.isArray(days)) continue;
    const start = new Date(Number(started[1]), Number(started[2]) - 1, Number(started[3]));
    if (start >= from && start < to) total += days.length;
  }
  return total;
}

// For the first week of the Church New Year (the Indiction, September 1): a private look back over the year just
// ended. Only what was kept is named, nothing is scored, and nothing leaves the device.
export function ChurchYearLookBack({ today, calendar }: { today: Date; calendar: ChurchCalendar }) {
  const church = churchDate(today, calendar);
  const inFirstWeek = church.getMonth() === 8 && church.getDate() <= SHOWN_DAYS;
  const yearStart = fixedDate(church.getFullYear(), 9, 1, calendar);
  const hiddenFor = getStoredItem<string>(HIDDEN_KEY);
  const [hidden, setHidden] = useState(() => hiddenFor === String(church.getFullYear()));

  const totals = useMemo(() => {
    if (!inFirstWeek) return null;
    const lastYearStart = fixedDate(church.getFullYear() - 1, 9, 1, calendar);
    return {
      prayer: prayerDaysBetween(lastYearStart, yearStart),
      fastDays: fastDaysKept(lastYearStart, yearStart),
      names: (() => {
        const list = getCommemorations();
        return list.living.length + list.departed.length;
      })(),
    };
    // The year changes only with the church year itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inFirstWeek, church.getFullYear(), calendar]);

  if (!inFirstWeek || hidden || !totals) return null;
  const { prayer, fastDays, names } = totals;
  if (!prayer.days && !fastDays && !names) return null;

  const lines: string[] = [];
  if (prayer.days) {
    const parts = [
      prayer.morning ? `morning prayers ${prayer.morning} times` : "",
      prayer.evening ? `evening prayers ${prayer.evening}` : "",
      prayer.night ? `night prayers ${prayer.night}` : "",
    ].filter(Boolean);
    lines.push(`You prayed on ${prayer.days} ${prayer.days === 1 ? "day" : "days"}${parts.length ? `: ${parts.join(", ")}` : ""}.`);
  }
  if (fastDays) lines.push(`You kept ${fastDays} ${fastDays === 1 ? "day" : "days"} of the fasts.`);
  if (names) lines.push(`You carried ${names} ${names === 1 ? "name" : "names"} in prayer.`);

  function hide() {
    setStoredItem(HIDDEN_KEY, String(church.getFullYear()));
    setHidden(true);
  }

  return (
    <Card className="candlelight-card rounded-[2rem] border p-5 sm:p-7" aria-labelledby="church-year-title">
      <p className="text-sm text-muted-foreground">The Indiction, the beginning of the Church year</p>
      <h2 id="church-year-title" className="mt-1 text-3xl">
        Thou blessest the crown of the year with Thy goodness
      </h2>
      <div className="scripture-text mt-4 grid gap-2 text-lg">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Kept only on this device.</p>
      <Button type="button" variant="ghost" size="sm" className="mt-2 rounded-full" onClick={hide}>
        Put away
      </Button>
    </Card>
  );
}
