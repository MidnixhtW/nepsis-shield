import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { APP_REMINDER_OPTIONS, getAppReminderPrefs, setAppReminder, type AppReminderKey } from "@/lib/appReminders";
import { nativeRemindersAvailable } from "@/lib/systemPrayerReminders";
import { showError } from "@/utils/toast";

// Settings: the reminders beyond the prayer times. Each is off until turned on; at most one of them comes in a day.
export function OtherReminders() {
  const native = nativeRemindersAvailable();
  const [prefs, setPrefs] = useState(getAppReminderPrefs);
  const [busy, setBusy] = useState<AppReminderKey | null>(null);

  async function change(key: AppReminderKey, on: boolean) {
    setBusy(key);
    setPrefs((current) => ({ ...current, [key]: on }));
    const result = await setAppReminder(key, on);
    setBusy(null);
    if (!result.ok && on) {
      setPrefs((current) => ({ ...current, [key]: false }));
      await setAppReminder(key, false);
      showError(
        result.reason === "permission-denied"
          ? "Notifications are turned off for Nepsis Shield. Allow them in your phone's settings."
          : "Couldn't set that reminder.",
      );
    }
  }

  return (
    <Card id="other-reminders" className="scroll-mt-24 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <h2 className="text-xl">Other reminders</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        For days that matter in the Church. At most one of these comes in a day, besides your prayer reminders.
      </p>
      <Separator className="my-4" />
      {native ? (
        <ul className="grid gap-4">
          {APP_REMINDER_OPTIONS.map((option) => (
            <li key={option.key} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Label htmlFor={`reminder-${option.key}`} className="text-base font-semibold">
                  {option.label}
                </Label>
                <p className="mt-0.5 text-sm text-muted-foreground">{option.hint}</p>
              </div>
              <Switch
                id={`reminder-${option.key}`}
                checked={prefs[option.key]}
                disabled={busy === option.key}
                onCheckedChange={(on) => void change(option.key, on)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          These reminders work in the Android app. On this device, the fast, memorial and name-day cards on Today can still
          add their dates to your calendar.
        </p>
      )}
    </Card>
  );
}
