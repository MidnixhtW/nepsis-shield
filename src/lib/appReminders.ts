// Reminders beyond the prayer times, each for something that is really happening: a great feast, the feast a fast
// led to, the eve of Sunday's Liturgy, the lamps for the names on the prayer list. Each is off until turned on, and
// the phone gets at most one of them a day, besides the prayer reminders the person chose. Android app only: they are
// local notifications, planned 30 days ahead on the phone and rolled forward each time the app opens.
import { getCommemorations } from "@/lib/commemorations";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { FEAST_AFTER_FAST, addDays, dateOnly, recentlyEndedFast, type ChurchCalendar } from "@/lib/fastingSeasons";
import { greatFeast } from "@/lib/greatFeasts";
import { feastGreeting } from "@/lib/feastGreetings";
import { getSettings } from "@/lib/settings";
import { ensurePermission, getLocalNotifications } from "@/lib/systemPrayerReminders";

export type AppReminderKey = "fastFeast" | "feasts" | "liturgy" | "lamps";
export type AppReminderPrefs = Record<AppReminderKey, boolean>;

export const APP_REMINDERS_KEY = "app-reminders:v1";
const JOURNEYS_KEY = "fasting-journeys:v1";
const DAYS_AHEAD = 30;
const FIRST_ID = 7300;

export const APP_REMINDER_OPTIONS: Array<{ key: AppReminderKey; label: string; hint: string }> = [
  { key: "feasts", label: "Great feasts", hint: "The morning of Pascha and the Twelve Great Feasts, at 8:00." },
  { key: "fastFeast", label: "When a fast ends", hint: "On its feast, with the days you kept, at 8:00." },
  { key: "liturgy", label: "Saturday before Liturgy", hint: "A reminder to prepare for Communion, Saturday at 19:00." },
  { key: "lamps", label: "Lamps for your names", hint: "Each evening at 20:30, if your prayer list has names." },
];

// Highest first: on a day with more than one, only the first that is on is sent.
const PRIORITY: AppReminderKey[] = ["fastFeast", "feasts", "liturgy", "lamps"];

const AT: Record<AppReminderKey, [number, number]> = {
  fastFeast: [8, 0],
  feasts: [8, 0],
  liturgy: [19, 0],
  lamps: [20, 30],
};

export function getAppReminderPrefs(): AppReminderPrefs {
  const saved = getStoredItem<Partial<AppReminderPrefs>>(APP_REMINDERS_KEY) ?? {};
  return { fastFeast: !!saved.fastFeast, feasts: !!saved.feasts, liturgy: !!saved.liturgy, lamps: !!saved.lamps };
}

type Planned = { key: AppReminderKey; at: Date; title: string; body: string; to: string };

function at(day: Date, key: AppReminderKey) {
  const [hours, minutes] = AT[key];
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
}

function candidates(day: Date, calendar: ChurchCalendar, names: number): Partial<Record<AppReminderKey, Omit<Planned, "key" | "at">>> {
  const out: Partial<Record<AppReminderKey, Omit<Planned, "key" | "at">>> = {};
  const ended = recentlyEndedFast(day, calendar, 1);
  if (ended) {
    const kept = (getStoredItem<Record<string, number[]>>(JOURNEYS_KEY) ?? {})[ended.season.key]?.length ?? 0;
    const greeting = feastGreeting(day, calendar);
    out.fastFeast = {
      title: greeting ? `${greeting.greeting} ${greeting.response}` : FEAST_AFTER_FAST[ended.season.id] ?? ended.season.name,
      body: kept ? `The ${ended.season.name} is complete. You kept ${kept} of its ${ended.season.length} days.` : `The ${ended.season.name} is complete.`,
      to: "/today",
    };
  }
  const feast = greatFeast(day, calendar);
  if (feast) out.feasts = { title: feast, body: "Today is a great feast of the Church.", to: "/today" };
  if (day.getDay() === 6) {
    out.liturgy = {
      title: "Tomorrow is the Divine Liturgy",
      body: "Prepare for Holy Communion. The prayers before Communion are in the app.",
      to: "/pray?tab=communion",
    };
  }
  if (names > 0) {
    out.lamps = {
      title: "Light a lamp",
      body: `For the ${names === 1 ? "name" : `${names} names`} you carry in prayer.`,
      to: "/pray?tab=names",
    };
  }
  return out;
}

/** The next 30 days of reminders for the switches that are on: at most one a day, highest priority first. */
export function planAppReminders(from: Date, prefs: AppReminderPrefs, calendar: ChurchCalendar): Planned[] {
  const list = getCommemorations();
  const names = list.living.length + list.departed.length;
  const plan: Planned[] = [];
  for (let index = 0; index < DAYS_AHEAD; index += 1) {
    const day = addDays(dateOnly(from), index);
    const options = candidates(day, calendar, names);
    const key = PRIORITY.find((item) => prefs[item] && options[item]);
    if (!key) continue;
    const when = at(day, key);
    if (when.getTime() <= from.getTime()) continue;
    plan.push({ key, at: when, ...options[key]! });
  }
  return plan;
}

const ALL_IDS = Array.from({ length: DAYS_AHEAD }, (_, index) => ({ id: FIRST_ID + index }));

async function schedule(prefs: AppReminderPrefs, askPermission: boolean) {
  const plugin = await getLocalNotifications();
  if (!plugin) return { ok: false as const, reason: "not-native" as const };
  if (askPermission) {
    if (!(await ensurePermission(plugin))) return { ok: false as const, reason: "permission-denied" as const };
  } else if ((await plugin.checkPermissions()).display !== "granted") {
    return { ok: false as const, reason: "permission-denied" as const };
  }
  await plugin.cancel({ notifications: ALL_IDS });
  const plan = planAppReminders(new Date(), prefs, getSettings().calendarMode);
  if (plan.length) {
    await plugin.schedule({
      notifications: plan.map((item, index) => ({
        id: FIRST_ID + index,
        title: item.title,
        body: item.body,
        extra: { to: item.to },
        schedule: { at: item.at },
      })),
    });
  }
  return { ok: true as const };
}

/** Saves a switch and re-plans the next 30 days. Asks for notification permission when a switch is turned on. */
export async function setAppReminder(key: AppReminderKey, on: boolean) {
  const prefs = { ...getAppReminderPrefs(), [key]: on };
  setStoredItem(APP_REMINDERS_KEY, prefs);
  try {
    return await schedule(prefs, on);
  } catch {
    return { ok: false as const, reason: "failed" as const };
  }
}

/** Rolls the 30 days forward when the app opens. Never asks for permission. */
export async function refreshAppReminders() {
  const prefs = getAppReminderPrefs();
  if (!Object.values(prefs).some(Boolean)) return;
  try {
    await schedule(prefs, false);
  } catch {
    // The reminders already planned stay as they were.
  }
}
