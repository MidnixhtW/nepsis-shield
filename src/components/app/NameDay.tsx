import { useEffect, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { BellRing, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/useSettings";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { addDays } from "@/lib/fastingSeasons";
import { createAllDayEventsIcs, downloadTextFile } from "@/lib/ics";
import { nameDayStatus, nextNameDay, type PatronSaint } from "@/lib/nameDay";
import { PATRON_SAINT_CHANGED_EVENT, getPatronSaint, setPatronSaint } from "@/lib/patronSaint";
import { isNativeReminderUnavailable, scheduleSeasonReminders } from "@/lib/systemPrayerReminders";
import { showError, showSuccess } from "@/utils/toast";

/** True once native name-day reminders are on, so Today can roll them forward each year. */
const NATIVE_KEY = "nameday:native-reminders";

function nameDayReminder(patron: PatronSaint, calendar: "gregorian" | "julian") {
  const date = nextNameDay(patron, new Date(), calendar);
  const at = addDays(date, -1);
  at.setHours(19, 0, 0, 0);
  return { date, reminder: { title: `Tomorrow is your name day: ${patron.name}`, body: `Holy ${patron.name}, pray to God for me.`, at } };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function usePatronSaint() {
  const [patron, setPatron] = useState<PatronSaint | null>(getPatronSaint);
  useEffect(() => {
    const refresh = () => setPatron(getPatronSaint());
    window.addEventListener(PATRON_SAINT_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PATRON_SAINT_CHANGED_EVENT, refresh);
  }, []);
  return patron;
}

function livesLink(name: string) {
  return `https://www.oca.org/saints/lives?search=${encodeURIComponent(name)}`;
}

/** Settings card: choose your patron saint and their feast (a church date). */
export function PatronSaintSettings() {
  const patron = usePatronSaint();
  const { settings } = useSettings();
  const [name, setName] = useState(patron?.name ?? "");
  const [month, setMonth] = useState(patron?.month ?? 1);
  const [day, setDay] = useState(patron?.day ?? 1);

  function save(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 60);
    if (!trimmed) return;
    setPatronSaint({ name: trimmed, month, day: Math.min(Math.max(day, 1), 31) });
    showSuccess(`${trimmed} saved as your patron saint.`);
  }

  async function remind() {
    if (!patron) return;
    const { date, reminder } = nameDayReminder(patron, settings.calendarMode);
    const result = await scheduleSeasonReminders([reminder], "nameday");
    if (result.ok) {
      setStoredItem(NATIVE_KEY, true);
      showSuccess("You'll be reminded the evening before your name day.");
      return;
    }
    if (isNativeReminderUnavailable(result)) {
      downloadTextFile(
        "name-day.ics",
        createAllDayEventsIcs([{ uid: "name-day", title: `Name day: ${patron.name}`, description: `Holy ${patron.name}, pray to God for me.`, date, yearly: true }]),
        "text/calendar",
      );
      showSuccess("Calendar file downloaded. Open it to add your name day every year.");
      return;
    }
    showError("Couldn't set the name-day reminder.");
  }

  return (
    <Card id="patron-saint" className="scroll-mt-24 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight">Your patron saint</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The saint whose name you bear. On their feast day, your name day, Today greets you and asks their prayers. Enter the date as it appears in the Church calendar; the app adjusts it for the Old Calendar.
      </p>
      <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-[2fr_1.4fr_0.8fr_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="patron-name">Saint</Label>
          <Input id="patron-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. St. Nicholas" maxLength={60} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="patron-month">Feast month</Label>
          <select
            id="patron-month"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {MONTHS.map((label, index) => (
              <option key={label} value={index + 1}>{label}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="patron-day">Day</Label>
          <Input id="patron-day" type="number" min={1} max={31} value={day} onChange={(event) => setDay(Number(event.target.value))} />
        </div>
        <Button type="submit" className="rounded-xl" disabled={!name.trim()}>Save</Button>
      </form>
      {patron ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            Next name day: <span className="font-semibold text-foreground">{format(nextNameDay(patron, new Date(), settings.calendarMode), "EEEE, MMMM d, yyyy")}</span>
          </span>
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => void remind()}>
            <BellRing className="mr-2 h-4 w-4" /> Remind me
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground"
            onClick={() => {
              setPatronSaint(null);
              setName("");
            }}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

/** Today card on the eve of and on your name day. */
export function NameDayCard({ today }: { today: Date }) {
  const patron = usePatronSaint();
  const { settings } = useSettings();
  const status = nameDayStatus(patron, today, settings.calendarMode);
  // After a name day passes, schedule next year's reminder (Android only).
  useEffect(() => {
    if (patron && getStoredItem<boolean>(NATIVE_KEY) === true) {
      void scheduleSeasonReminders([nameDayReminder(patron, settings.calendarMode).reminder], "nameday");
    }
  }, [patron, settings.calendarMode, today]);
  if (!patron || !status) return null;

  return (
    <Card className="candlelight-card rounded-[1.5rem] border p-5" role="region" aria-label="Your name day">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        <Sparkles aria-hidden className="h-3.5 w-3.5" /> {status === "today" ? "Your name day" : "Tomorrow is your name day"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{patron.name}</h2>
      <p className="scripture-text mt-2 text-[1.05rem]">Holy {patron.name.replace(/^St\.?\s+/i, "")}, pray to God for me.</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {status === "today"
          ? "Many years! A good day to go to the Divine Liturgy or Vespers, and to read the life of your patron."
          : "Prepare to keep the feast: read the life of your patron and plan to attend the services."}
      </p>
      <Button asChild variant="outline" size="sm" className="mt-3 rounded-full">
        <a href={livesLink(patron.name)} target="_blank" rel="noopener noreferrer">
          Read their life <ExternalLink aria-hidden className="ml-2 h-3.5 w-3.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Button>
    </Card>
  );
}
