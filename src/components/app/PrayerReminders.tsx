import { useEffect, useState } from "react";
import { Bell, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePrayerReminderStatus } from "@/hooks/usePrayerReminderStatus";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import {
  cancelSystemPrayerReminder,
  isNativeReminderUnavailable,
  scheduleSystemPrayerReminder,
} from "@/lib/systemPrayerReminders";
import { showError, showSuccess } from "@/utils/toast";

type PrayerTime = "morning" | "evening" | "night";
type ReminderPrefs = Record<PrayerTime, { enabled: boolean; time: string }>;

// Same storage key the Daily Prayer Flow used, so existing reminder choices carry over.
const REMINDER_PREFS_KEY = "daily_prayer_flow:reminders";

const DEFAULT_REMINDERS: ReminderPrefs = {
  morning: { enabled: true, time: "07:00" },
  evening: { enabled: true, time: "18:00" },
  night: { enabled: false, time: "21:30" },
};

const prayerLabels: Record<PrayerTime, string> = {
  morning: "Morning",
  evening: "Evening",
  night: "Night",
};

function makeReminderDate(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hours || 0, minutes || 0, 0, 0);
  if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  return { start, end };
}

export function PrayerReminders() {
  const [reminders, setReminders] = useState<ReminderPrefs>(DEFAULT_REMINDERS);
  const [hydrated, setHydrated] = useState(false);
  const [reminderBusy, setReminderBusy] = useState<PrayerTime | null>(null);
  const [downloaded, setDownloaded] = useState<Partial<Record<PrayerTime, string>>>({});
  const reminderStatus = usePrayerReminderStatus();

  useEffect(() => {
    const savedReminders = getStoredItem<Partial<ReminderPrefs>>(REMINDER_PREFS_KEY);
    if (savedReminders) {
      setReminders({
        morning: { ...DEFAULT_REMINDERS.morning, ...savedReminders.morning },
        evening: { ...DEFAULT_REMINDERS.evening, ...savedReminders.evening },
        night: { ...DEFAULT_REMINDERS.night, ...savedReminders.night },
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredItem(REMINDER_PREFS_KEY, reminders);
  }, [hydrated, reminders]);

  async function updateReminder(nextTime: PrayerTime, patch: Partial<ReminderPrefs[PrayerTime]>) {
    if (patch.time !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(patch.time)) return;
    if (patch.enabled === false) {
      setReminderBusy(nextTime);
      try {
        const result = await cancelSystemPrayerReminder(nextTime);
        if (!result.ok && !isNativeReminderUnavailable(result)) {
          showError("Could not cancel the native reminder. It may still be scheduled.");
          return;
        }
        await reminderStatus.refresh();
      } catch {
        showError("Could not cancel the native reminder. It may still be scheduled.");
        return;
      } finally {
        setReminderBusy(null);
      }
    }
    setReminders((prev) => ({ ...prev, [nextTime]: { ...prev[nextTime], ...patch } }));
  }

  function downloadCalendarReminder(nextTime: PrayerTime) {
    const reminder = reminders[nextTime];
    const { start, end } = makeReminderDate(reminder.time);
    const label = prayerLabels[nextTime];
    const ics = createSimpleIcs({
      title: `${label} Prayer (Nepsis Shield)`,
      description: `Open Nepsis Shield and pray the ${label.toLowerCase()} rule. This daily calendar reminder is created locally from your reminder preference.`,
      start,
      end,
      dailyReminder: true,
    });
    downloadTextFile(`${nextTime}-prayer-reminder.ics`, ics, "text/calendar");
    setDownloaded((previous) => ({ ...previous, [nextTime]: reminder.time }));
  }

  async function syncReminderToSystem(nextTime: PrayerTime) {
    setReminderBusy(nextTime);
    try {
      const reminder = reminders[nextTime];
      const label = prayerLabels[nextTime];
      const result = await scheduleSystemPrayerReminder({
        key: nextTime,
        label,
        time: reminder.time,
      });

      if (result.ok) {
        await reminderStatus.refresh();
        showSuccess(`${label} prayer reminder scheduled daily at ${reminder.time}.`);
        return;
      }

      if ("reason" in result && result.reason === "permission-denied") {
        showError("Notification permission was denied. Enable notifications for Nepsis Shield in system settings.");
        return;
      }

      if (isNativeReminderUnavailable(result)) {
        downloadCalendarReminder(nextTime);
        showSuccess(`${label} calendar file downloaded. Import it into your calendar to activate the daily reminder.`);
        return;
      }

      showError("Couldn't add the system reminder.");
    } catch {
      showError("Couldn't add the system reminder.");
    } finally {
      setReminderBusy(null);
    }
  }

  return (
    <Card id="prayer-reminders" className="scroll-mt-24 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Prayer reminders</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Turning a preference on does not schedule it: select Sync to schedule native notifications. In a browser, Sync downloads a daily calendar file; import it and check alerts in your calendar app. Turn a preference off to cancel its native reminder. Imported calendar events must be removed in your calendar app.
          </p>
        </div>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3">
        {(Object.keys(prayerLabels) as PrayerTime[]).map((key) => (
          <div key={key} className="grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <Switch
                aria-label={`${prayerLabels[key]} reminder preference`}
                checked={reminders[key].enabled || Boolean(reminderStatus.scheduled[key])}
                disabled={reminderBusy !== null || reminderStatus.checking}
                onCheckedChange={(checked) => void updateReminder(key, { enabled: checked })}
              />
              <div>
                <p className="text-sm font-semibold">{prayerLabels[key]} prayer</p>
                <p role="status" className="text-xs text-muted-foreground">
                  {reminderStatus.checking ? "Checking native schedule…" : reminderStatus.error ? "Native schedule could not be verified" : reminderStatus.scheduled[key] ? `Native reminder scheduled${reminderStatus.scheduled[key]?.time ? ` at ${reminderStatus.scheduled[key]?.time}` : ""}${reminderStatus.scheduled[key]?.time !== reminders[key].time ? " · Sync to apply this preferred time" : ""}` : downloaded[key] ? `Calendar file downloaded for ${downloaded[key]} · import required, schedule unconfirmed` : reminders[key].enabled ? "Preference on · not scheduled yet" : "Preference off · no native reminder scheduled"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <input
                type="time"
                value={reminders[key].time}
                disabled={reminderBusy !== null}
                onChange={(event) => void updateReminder(key, { time: event.target.value })}
                className="h-10 rounded-2xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${prayerLabels[key]} reminder time`}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60"
                aria-label={`Sync ${prayerLabels[key].toLowerCase()} prayer reminder`}
                onClick={() => void syncReminderToSystem(key)}
                disabled={(!reminders[key].enabled && !reminderStatus.scheduled[key]) || reminderBusy !== null}
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> {reminderBusy === key ? "Updating…" : "Sync"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
