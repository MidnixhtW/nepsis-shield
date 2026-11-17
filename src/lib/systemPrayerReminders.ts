import { Capacitor } from "@capacitor/core";
import { LocalNotifications, type LocalNotificationsPlugin } from "@capacitor/local-notifications";
import { buildWidgetDays } from "@/lib/widgetSnapshot";
import { getSettings } from "@/lib/settings";

export type SystemReminderResult =
  | { ok: true; native: true }
  | { ok: false; native: false; reason: "not-native" | "plugin-missing" | "permission-denied" | "failed" };

const REMINDER_IDS = {
  morning: 7101,
  evening: 7102,
  night: 7103,
  scroll: 7104,
} as const;

// What each daily reminder says, and where tapping it opens.
const REMINDER_TEXT: Record<keyof typeof REMINDER_IDS, { title: string; body: string; to: string }> = {
  morning: { title: "Morning Prayer", body: "Offer the day to God before the noise begins.", to: "/pray?tab=daily&begin=morning" },
  evening: { title: "Evening Prayer", body: "Give thanks and look back on the day.", to: "/pray?tab=daily&begin=evening" },
  night: { title: "Night Prayer", body: "Into Thy hands, O Lord.", to: "/pray?tab=daily&begin=night" },
  scroll: { title: "Before you scroll", body: "One minute of prayer first. Then the phone can wait.", to: "/pray?tab=daily&begin=night" },
};

export type PrayerReminderKey = keyof typeof REMINDER_IDS;

// The next two weeks of reminders are scheduled one by one, each naming its day ("Nativity Fast, day 5 of 40",
// "Christ is born! Glorify Him!"), from the same on-device calendar the widget uses. After them the plain daily
// reminder takes over, so nothing goes quiet if the app is not opened; each app open rolls the two weeks forward.
const NAMED_DAYS = 14;
const PLAIN_HEADLINE = "Watch and pray";

function namedDayIds(key: PrayerReminderKey) {
  return Array.from({ length: NAMED_DAYS }, (_, index) => REMINDER_IDS[key] * 100 + index);
}

function atTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

// "Nativity Fast · Day 5 of 40" reads as "Nativity Fast, day 5 of 40."; a greeting keeps its own "!".
function sentence(headline: string) {
  const text = headline.replace(/ · Day /g, ", day ").replace(/ · /g, ", ");
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function reminderNotifications(key: PrayerReminderKey, time: string) {
  const text = REMINDER_TEXT[key];
  const now = Date.now();
  const days = buildWidgetDays(new Date(), getSettings().calendarMode);
  const named = days
    .map((day, index) => ({
      id: namedDayIds(key)[index],
      title: text.title,
      body: day.headline && day.headline !== PLAIN_HEADLINE ? `${sentence(day.headline)} ${text.body}` : text.body,
      extra: { to: text.to },
      schedule: { at: atTime(day.date, time) },
    }))
    .filter((notification) => notification.schedule.at.getTime() > now);
  // The plain repeating reminder starts the day after the last named one.
  const plainStart = atTime(days[days.length - 1].date, time);
  plainStart.setDate(plainStart.getDate() + 1);
  const plain = {
    id: REMINDER_IDS[key],
    title: text.title,
    body: text.body,
    extra: { to: text.to },
    schedule: { at: plainStart, every: "day" as const },
  };
  return [...named, plain];
}

/** True in the installed Android app, where reminders are real notifications. In a browser they are calendar files. */
export function nativeRemindersAvailable() {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable("LocalNotifications");
}

async function getLocalNotifications(): Promise<LocalNotificationsPlugin | null> {
  if (!nativeRemindersAvailable()) return null;
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
  time,
}: {
  key: PrayerReminderKey;
  /** Kept for callers; the reminder's own wording comes from REMINDER_TEXT. */
  label?: string;
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

    await plugin.cancel({ notifications: [REMINDER_IDS[key], ...namedDayIds(key)].map((id) => ({ id })) });
    await plugin.schedule({ notifications: reminderNotifications(key, time) });

    return { ok: true, native: true };
  } catch {
    return { ok: false, native: false, reason: "failed" };
  }
}

/** Re-schedules every daily reminder that is on, so the next two weeks always name their days. Android app only. */
export async function refreshPrayerReminders() {
  const plugin = await getLocalNotifications();
  if (!plugin) return;
  // Never ask for permission here: if it was taken away, leave things as they are.
  if ((await plugin.checkPermissions()).display !== "granted") return;
  const scheduled = await getScheduledPrayerReminders();
  for (const [key, value] of Object.entries(scheduled) as Array<[PrayerReminderKey, { time?: string }]>) {
    if (value.time) await scheduleSystemPrayerReminder({ key, time: value.time });
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
    await plugin.cancel({ notifications: [REMINDER_IDS[key], ...namedDayIds(key)].map((id) => ({ id })) });
    return { ok: true, native: true };
  } catch {
    return { ok: false, native: false, reason: "failed" };
  }
}

// Each group of one-off reminders has its own id range, so groups never replace each other
// or the daily prayer reminders.
const ONE_OFF_REMINDER_IDS = {
  fasts: Array.from({ length: 12 }, (_, index) => 7201 + index),
  memorials: Array.from({ length: 30 }, (_, index) => 7301 + index),
  nameday: Array.from({ length: 2 }, (_, index) => 7401 + index),
} as const;
export type OneOffReminderGroup = keyof typeof ONE_OFF_REMINDER_IDS;

/** One-off notifications (e.g. the evening before each fast). Replaces that group's earlier set. */
export async function scheduleSeasonReminders(
  reminders: Array<{ title: string; body: string; at: Date }>,
  group: OneOffReminderGroup = "fasts",
): Promise<SystemReminderResult> {
  const SEASON_REMINDER_IDS = ONE_OFF_REMINDER_IDS[group];
  const plugin = await getLocalNotifications();
  if (!plugin) {
    return { ok: false, native: false, reason: Capacitor.isNativePlatform() ? "plugin-missing" : "not-native" };
  }
  try {
    const allowed = await ensurePermission(plugin);
    if (!allowed) return { ok: false, native: false, reason: "permission-denied" };
    await plugin.cancel({ notifications: SEASON_REMINDER_IDS.map((id) => ({ id })) });
    const future = reminders.filter((reminder) => reminder.at.getTime() > Date.now()).slice(0, SEASON_REMINDER_IDS.length);
    if (future.length) {
      await plugin.schedule({
        notifications: future.map((reminder, index) => ({
          id: SEASON_REMINDER_IDS[index],
          title: reminder.title,
          body: reminder.body,
          schedule: { at: reminder.at },
        })),
      });
    }
    return { ok: true, native: true };
  } catch {
    return { ok: false, native: false, reason: "failed" };
  }
}

export function isNativeReminderUnavailable(result: SystemReminderResult) {
  return "reason" in result && (result.reason === "not-native" || result.reason === "plugin-missing");
}

/** In the app, tapping a reminder opens the page it names (its `extra.to`). Returns a function to stop listening. */
export function onReminderTap(open: (to: string) => void) {
  if (!nativeRemindersAvailable()) return () => {};
  const handle = LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
    const to = (event.notification.extra as { to?: unknown } | undefined)?.to;
    if (typeof to === "string" && to.startsWith("/")) open(to);
  });
  return () => {
    void handle.then((listener) => listener.remove());
  };
}
