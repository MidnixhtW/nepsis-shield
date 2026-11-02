import { Capacitor } from "@capacitor/core";
import { LocalNotifications, type LocalNotificationsPlugin } from "@capacitor/local-notifications";

export type SystemReminderResult =
  | { ok: true; native: true }
  | { ok: false; native: false; reason: "not-native" | "plugin-missing" | "permission-denied" | "failed" };

const REMINDER_IDS = {
  morning: 7101,
  evening: 7102,
  night: 7103,
} as const;

export type PrayerReminderKey = keyof typeof REMINDER_IDS;

function nextReminderDate(time: string) {
  const [rawHours, rawMinutes] = time.split(":").map(Number);
  const hours = Number.isFinite(rawHours) ? rawHours : 0;
  const minutes = Number.isFinite(rawMinutes) ? rawMinutes : 0;
  const at = new Date();
  at.setHours(hours, minutes, 0, 0);
  if (at.getTime() <= Date.now()) at.setDate(at.getDate() + 1);
  return at;
}

async function getLocalNotifications(): Promise<LocalNotificationsPlugin | null> {
  if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable("LocalNotifications")) return null;
  return LocalNotifications;
}

export type ScheduledPrayerReminders = Partial<Record<PrayerReminderKey, { time?: string }>>;

export async function getScheduledPrayerReminders(): Promise<ScheduledPrayerReminders> {
  if (!await getLocalNotifications()) return {};
  const { notifications } = await LocalNotifications.getPending();
  const result: ScheduledPrayerReminders = {};
  for (const key of Object.keys(REMINDER_IDS) as PrayerReminderKey[]) {
    const notification = notifications.find((item) => item.id === REMINDER_IDS[key]);
    if (!notification) continue;
    const at = notification.schedule?.at ? new Date(notification.schedule.at) : undefined;
    result[key] = { time: at && Number.isFinite(at.getTime()) ? `${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}` : undefined };
  }
  return result;
}

async function ensurePermission(plugin: LocalNotificationsPlugin) {
  const current = await plugin.checkPermissions();
  if (current.display === "granted") return true;

  const requested = await plugin.requestPermissions();
  return requested.display === "granted";
}

export async function scheduleSystemPrayerReminder({
  key,
  label,
  time,
}: {
  key: PrayerReminderKey;
  label: string;
  time: string;
}): Promise<SystemReminderResult> {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { ok: false, native: false, reason: "failed" };
  const plugin = await getLocalNotifications();
  if (!plugin) {
    return {
      ok: false,
      native: false,
      reason: Capacitor.isNativePlatform() ? "plugin-missing" : "not-native",
    };
  }

  try {
    const allowed = await ensurePermission(plugin);
    if (!allowed) return { ok: false, native: false, reason: "permission-denied" };

    const id = REMINDER_IDS[key];
    await plugin.cancel({ notifications: [{ id }] });
    await plugin.schedule({
      notifications: [
        {
          id,
          title: `${label} Prayer`,
          body: "Open Nepsis Shield and keep your prayer rule.",
          schedule: {
            at: nextReminderDate(time),
            every: "day",
          },
        },
      ],
    });

    return { ok: true, native: true };
  } catch {
    return { ok: false, native: false, reason: "failed" };
  }
}

export async function cancelSystemPrayerReminder(key: PrayerReminderKey): Promise<SystemReminderResult> {
  const plugin = await getLocalNotifications();
  if (!plugin) {
    return {
      ok: false,
      native: false,
      reason: Capacitor.isNativePlatform() ? "plugin-missing" : "not-native",
    };
  }

  try {
    await plugin.cancel({ notifications: [{ id: REMINDER_IDS[key] }] });
    return { ok: true, native: true };
  } catch {
    return { ok: false, native: false, reason: "failed" };
  }
}

export function isNativeReminderUnavailable(result: SystemReminderResult) {
  return "reason" in result && (result.reason === "not-native" || result.reason === "plugin-missing");
}
