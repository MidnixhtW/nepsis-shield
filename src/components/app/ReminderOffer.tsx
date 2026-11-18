import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { turnOnPrayerReminder } from "@/lib/prayerReminderPrefs";
import { getScheduledPrayerReminders, nativeRemindersAvailable } from "@/lib/systemPrayerReminders";
import { showError, showSuccess } from "@/utils/toast";

const DISMISSED_KEY = "reminder-offer:dismissed";

// Once, in the Android app, for someone with no prayer reminder yet: one tap for morning prayers at a time they
// choose. "No thanks" puts it away for good; Settings has every reminder.
export function ReminderOffer() {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState("07:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!nativeRemindersAvailable() || getStoredItem<boolean>(DISMISSED_KEY)) return;
    let alive = true;
    void getScheduledPrayerReminders()
      .then((scheduled) => {
        if (alive && !Object.values(scheduled).some(Boolean)) setShow(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!show) return null;

  function putAway() {
    setStoredItem(DISMISSED_KEY, true);
    setShow(false);
  }

  async function turnOn() {
    setBusy(true);
    const result = await turnOnPrayerReminder("morning", time);
    setBusy(false);
    if (result.ok) {
      showSuccess(`Morning prayer reminder set for ${time}.`);
      putAway();
      return;
    }
    showError(
      "reason" in result && result.reason === "permission-denied"
        ? "Notifications are turned off for Nepsis Shield. Allow them in your phone's settings."
        : "Couldn't set the reminder.",
    );
  }

  return (
    <Card className="rounded-[1.5rem] border p-4 sm:p-5" role="region" aria-label="Morning prayer reminder">
      <div className="flex items-start gap-3">
        <Bell aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">A reminder for morning prayers?</p>
          <p className="mt-0.5 text-sm text-muted-foreground">One notification a day, at the time you choose. Change it any time in Settings.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <input
          type="time"
          value={time}
          aria-label="Reminder time"
          onChange={(event) => setTime(event.target.value || time)}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        />
        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={putAway}>
          No thanks
        </Button>
        <Button type="button" size="sm" className="rounded-full" disabled={busy} onClick={() => void turnOn()}>
          Turn on
        </Button>
      </div>
    </Card>
  );
}
