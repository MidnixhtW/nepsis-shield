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
  nativeRemindersAvailable,
  scheduleSystemPrayerReminder,
} from "@/lib/systemPrayerReminders";
import { showError, showSuccess } from "@/utils/toast";

type PrayerTime = "morning" | "evening" | "night" | "scroll";
type ReminderPrefs = Record<PrayerTime, { enabled: boolean; time: string }>;

// Same storage key the Daily Prayer Flow used, so existing reminder choices carry over.
const REMINDER_PREFS_KEY = "daily_prayer_flow:reminders";

// Off until the person turns one on, so a switch that looks on always means a reminder is set.
const DEFAULT_REMINDERS: ReminderPrefs = {
  morning: { enabled: false, time: "07:00" },
  evening: { enabled: false, time: "18:00" },
  night: { enabled: false, time: "21:30" },
  scroll: { enabled: false, time: "22:30" },
};

const prayerLabels: Record<PrayerTime, string> = {
  morning: "Morning prayer",
  evening: "Evening prayer",
  night: "Night prayer",
  scroll: "Before you scroll",
};

const prayerHints: Partial<Record<PrayerTime, string>> = {
  scroll: "At the time you usually pick up your phone at night: one minute of prayer first.",
};

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function makeReminderDate(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hours || 0, minutes || 0, 0, 0);
  if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  return { start, end };
}

function displayTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const at = new Date();
  at.setHours(hours || 0, minutes || 0, 0, 0);
  return at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function PrayerReminders() {
  const native = nativeRemindersAvailable();
  const [reminders, setReminders] = useState<ReminderPrefs>(DEFAULT_REMINDERS);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState<PrayerTime | null>(null);
  const [downloaded, setDownloaded] = useState<Partial<Record<PrayerTime, string>>>({});
  const reminderStatus = usePrayerReminderStatus();

  useEffect(() => {
    const savedReminders = getStoredItem<Partial<ReminderPrefs>>(REMINDER_PREFS_KEY);
    if (savedReminders) {
      setReminders({
        morning: { ...DEFAULT_REMINDERS.morning, ...savedReminders.morning },
        evening: { ...DEFAULT_REMINDERS.evening, ...savedReminders.evening },
        night: { ...DEFAULT_REMINDERS.night, ...savedReminders.night },
        scroll: { ...DEFAULT_REMINDERS.scroll, ...savedReminders.scroll },
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredItem(REMINDER_PREFS_KEY, reminders);
  }, [hydrated, reminders]);

  function savePref(key: PrayerTime, patch: Partial<ReminderPrefs[PrayerTime]>) {
    setReminders((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  // In the app the switch shows what is really scheduled; in a browser it shows the saved choice.
  function isOn(key: PrayerTime) {
    return native ? Boolean(reminderStatus.scheduled[key]) : reminders[key].enabled;
  }

  async function schedule(key: PrayerTime, time: string, quiet = false) {
    const label = prayerLabels[key];
    const result = await scheduleSystemPrayerReminder({ key, label, time });
    if (result.ok) {
      savePref(key, { enabled: true, time });
      await reminderStatus.refresh();
      if (!quiet) showSuccess(`${label} reminder set for ${displayTime(time)} every day.`);
      return;
    }
    if ("reason" in result && result.reason === "permission-denied") {
      showError("Notifications are turned off for Nepsis Shield. Turn them on in your phone's settings, then try again.");
      return;
    }
    showError("Couldn't set the reminder. Please try again.");
  }

  async function toggle(key: PrayerTime, checked: boolean) {
    if (!native) {
      savePref(key, { enabled: checked });
      return;
    }
    setBusy(key);
    try {
      if (checked) {
        await schedule(key, reminders[key].time);
      } else {
        const result = await cancelSystemPrayerReminder(key);
        if (!result.ok) {
          showError("Couldn't turn the reminder off. Please try again.");
          return;
        }
        savePref(key, { enabled: false });
        await reminderStatus.refresh();
      }
    } catch {
      showError("Couldn't change the reminder. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function changeTime(key: PrayerTime, time: string) {
    if (!TIME_PATTERN.test(time)) return;
    savePref(key, { time });
    // A reminder that is already on moves to the new time straight away.
    if (native && reminderStatus.scheduled[key]) {
      try {
        await schedule(key, time, true);
      } catch {
        showError("Couldn't move the reminder to the new time.");
      }
    }
  }

  function addToCalendar(key: PrayerTime) {
    const reminder = reminders[key];
    const { start, end } = makeReminderDate(reminder.time);
    const label = prayerLabels[key];
    const ics = createSimpleIcs({
      title: `${label} (Nepsis Shield)`,
      description: key === "scroll" ? "One minute of prayer before the phone." : `Open Nepsis Shield and pray the ${label.toLowerCase()}s.`,
      start,
      end,
      dailyReminder: true,
    });
    downloadTextFile(`${key}-prayer-reminder.ics`, ics, "text/calendar");
    setDownloaded((previous) => ({ ...previous, [key]: reminder.time }));
  }

  function statusLine(key: PrayerTime) {
    const reminder = reminders[key];
    if (native) {
      if (reminderStatus.checking && !reminderStatus.scheduled[key]) return "Checking…";
      return reminderStatus.scheduled[key] ? `Every day at ${displayTime(reminder.time)}` : "Off";
    }
    if (!reminder.enabled) return "Off";
    if (downloaded[key] === reminder.time) return "Open the downloaded file to add it to your calendar";
    return "Tap Add to calendar to get the reminder";
  }

  return (
    <Card id="prayer-reminders" className="scroll-mt-24 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Prayer reminders</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {native
              ? "A gentle notification at the time you choose, every day."
              : "In a browser, reminders go in your calendar app. Turn one on, then add it to your calendar. The Android app sends them as notifications."}
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
                aria-label={`${prayerLabels[key]} reminder`}
                checked={isOn(key)}
                disabled={busy !== null}
                onCheckedChange={(checked) => void toggle(key, checked)}
              />
              <div>
                <p className="text-sm font-semibold">{prayerLabels[key]}</p>
                {prayerHints[key] ? <p className="text-xs text-muted-foreground">{prayerHints[key]}</p> : null}
                <p role="status" className="text-xs text-muted-foreground">{statusLine(key)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <input
                type="time"
                value={reminders[key].time}
                disabled={busy !== null}
                onChange={(event) => void changeTime(key, event.target.value)}
                className="h-10 rounded-2xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${prayerLabels[key]} reminder time`}
              />
              {!native && reminders[key].enabled ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-border/60"
                  onClick={() => addToCalendar(key)}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
