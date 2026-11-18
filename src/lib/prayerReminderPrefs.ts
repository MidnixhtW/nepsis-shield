// The saved prayer-reminder choices, shared by Settings, first-time setup and the offer on Today, so a reminder turned
// on in one place shows as on in the others.
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { scheduleSystemPrayerReminder, type PrayerReminderKey } from "@/lib/systemPrayerReminders";

// Same storage key the Daily Prayer Flow used, so existing reminder choices carry over.
export const REMINDER_PREFS_KEY = "daily_prayer_flow:reminders";

type SavedReminders = Partial<Record<PrayerReminderKey, { enabled: boolean; time: string }>>;

/** Schedules a daily prayer reminder in the Android app and saves it as on. Asks for notification permission. */
export async function turnOnPrayerReminder(key: PrayerReminderKey, time: string) {
  const result = await scheduleSystemPrayerReminder({ key, time });
  if (result.ok) {
    const saved = getStoredItem<SavedReminders>(REMINDER_PREFS_KEY) ?? {};
    setStoredItem(REMINDER_PREFS_KEY, { ...saved, [key]: { enabled: true, time } });
  }
  return result;
}
