import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { BellRing, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMMEMORATIONS_CHANGED_EVENT, getCommemorations } from "@/lib/commemorations";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { addDays } from "@/lib/fastingSeasons";
import { createAllDayEventsIcs, downloadTextFile } from "@/lib/ics";
import { daysUntil, memorialsFor, soulSaturdays, type Memorial } from "@/lib/memorials";
import { isNativeReminderUnavailable, scheduleSeasonReminders } from "@/lib/systemPrayerReminders";
import { showError, showSuccess } from "@/utils/toast";

/** Show the card when a memorial is this close. */
const SOON_DAYS = 7;
const NATIVE_KEY = "memorials:native-reminders";

function upcoming(today: Date, withinDays: number) {
  const { departed } = getCommemorations();
  if (!departed.length) return [];
  const personal = departed.flatMap((entry) => memorialsFor(entry.name, entry.reposed, today, withinDays));
  return [...personal, ...soulSaturdays(today, withinDays)].sort((a, b) => a.date.getTime() - b.date.getTime());
}

function memorialTitle(memorial: Memorial) {
  return memorial.name ? `${memorial.label} for ${memorial.name}` : memorial.label;
}

function reminderList(today: Date) {
  return upcoming(today, 365).map((memorial) => {
    const at = addDays(memorial.date, -1);
    at.setHours(19, 0, 0, 0);
    return {
      memorial,
      title: `Tomorrow: ${memorialTitle(memorial)}`,
      body: "Remember the departed in prayer. Ask your priest about a memorial service.",
      at,
    };
  });
}

function relativeDay(today: Date, date: Date) {
  const days = daysUntil(today, date);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return format(date, "EEEE, MMM d");
}

// Upcoming memorial days (3rd, 9th, 40th, anniversaries, Saturdays of Souls) for names on the departed list.
export function MemorialsCard({ today }: { today: Date }) {
  const [version, setVersion] = useState(0);
  const [nativeOn, setNativeOn] = useState(() => getStoredItem<boolean>(NATIVE_KEY) === true);
  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
  }, []);
  // Native reminders roll forward each time Today opens.
  useEffect(() => {
    if (nativeOn) void scheduleSeasonReminders(reminderList(today), "memorials");
  }, [nativeOn, today, version]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const soon = useMemo(() => upcoming(today, SOON_DAYS), [today, version]);
  if (!soon.length) return null;

  async function remind() {
    const reminders = reminderList(today);
    const result = await scheduleSeasonReminders(reminders, "memorials");
    if (result.ok) {
      setStoredItem(NATIVE_KEY, true);
      setNativeOn(true);
      showSuccess("You'll be reminded the evening before each memorial day.");
      return;
    }
    if (isNativeReminderUnavailable(result)) {
      const ics = createAllDayEventsIcs(
        reminders.map(({ memorial }) => ({
          uid: `memorial-${memorial.label}-${memorial.name ?? "souls"}-${format(memorial.date, "yyyyMMdd")}`.replace(/\s+/g, "-"),
          title: memorialTitle(memorial),
          description: "Remember the departed in prayer. Ask your priest about a memorial service.",
          date: memorial.date,
        })),
      );
      downloadTextFile("memorial-days.ics", ics, "text/calendar");
      showSuccess("Calendar file downloaded. Open it to add the memorial days.");
      return;
    }
    showError("Couldn't set memorial reminders.");
  }

  return (
    <Card className="rounded-[1.5rem] border p-5" role="region" aria-label="Remembering the departed">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        <Flame aria-hidden className="h-3.5 w-3.5" /> Remembering the departed
      </p>
      <ul className="mt-3 grid gap-2">
        {soon.map((memorial) => (
          <li key={`${memorialTitle(memorial)}-${memorial.date.toISOString()}`} className="text-sm">
            <span className="font-semibold">{relativeDay(today, memorial.date)}</span>
            <span className="text-muted-foreground"> · {memorialTitle(memorial)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Pray for them by name: “Give rest, O Lord, to the soul of Thy servant.” Ask your priest about a memorial service, and bring kolyva if your parish keeps the custom.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/pray?tab=names">Open names</Link>
        </Button>
        {nativeOn ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <BellRing className="h-3.5 w-3.5 text-accent" /> Memorial reminders are on
          </span>
        ) : (
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => void remind()}>
            <BellRing className="mr-2 h-4 w-4" /> Remind me of memorial days
          </Button>
        )}
      </div>
    </Card>
  );
}
