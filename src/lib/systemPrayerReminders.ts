import { Capacitor } from "@capacitor/core";

export type SystemReminderResult =
  | { ok: true; native: true }
  | { ok: false; native: false; reason: "not-native" | "plugin-missing" | "permission-denied" | "failed" };

type LocalNotificationsPlugin = {
  checkPermissions: () => Promise<{ display: string }>;
  requestPermissions: () => Promise<{ display: string }>;
  cancel: (opts: { notifications: Array<{ id: number }> }) => Promise<void>;
  schedule: (opts: {
    notifications: Array<{
      id: number;
      title: string;
      body: string;
      schedule: { at: Date; every: "day" };
      smallIcon?: string;
    }>;
  }) => Promise<void>;
};

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
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const pluginPackage = "@capacitor/local-notifications";
    const mod = await import(/* @vite-ignore */ pluginPackage);
    return mod.LocalNotifications as LocalNotificationsPlugin;
  } catch {
    return null;
  }
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
          body: "Open Ortho Companion and keep your prayer rule.",
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
