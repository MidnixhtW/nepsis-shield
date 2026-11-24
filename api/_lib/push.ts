// Web push for prayer reminders and new-version alerts. Each phone or browser that turns notifications on is stored
// as one entry: its push address (from the browser's push service; no name, account or email), its time zone, and
// the times it chose. Nothing else. Entries expire after 120 days without the app being opened.
import type { Store } from "./store";

export const PUSH_HASH = "push:subs";
export const PUSH_TTL_SECONDS = 60 * 60 * 24 * 120;
/** The sender is asked to run every 15 minutes, but scheduled runs can be late, so a reminder goes out in the first
 * run within an hour after its time (and only once). */
export const SEND_WINDOW_MINUTES = 60;

export const REMINDER_KEYS = ["morning", "evening", "night", "scroll", "angelus"] as const;
export type ReminderKey = (typeof REMINDER_KEYS)[number];

export const REMINDER_TEXT: Record<ReminderKey, { title: string; body: string; url: string }> = {
  morning: { title: "Morning Prayer", body: "Offer the day to God before the noise begins.", url: "/pray?tab=daily&begin=morning" },
  evening: { title: "Evening Prayer", body: "Give thanks and look back on the day.", url: "/pray?tab=daily&begin=evening" },
  night: { title: "Night Prayer", body: "Into Thy hands, O Lord.", url: "/pray?tab=daily&begin=night" },
  scroll: { title: "Before you scroll", body: "One minute of prayer first. Then the phone can wait.", url: "/pray?tab=daily&begin=night" },
  angelus: { title: "The Angelus", body: "The Angel of the Lord declared unto Mary.", url: "/pray?tab=rosary" },
};

export type PushSubscriptionJSON = { endpoint: string; keys: { p256dh: string; auth: string } };

export type PushEntry = {
  subscription: PushSubscriptionJSON;
  timeZone: string;
  reminders: Partial<Record<ReminderKey, string>>;
  updates: boolean;
  /** The local date ("2026-11-24") each reminder last went out, so none is sent twice in a day. */
  sent: Partial<Record<ReminderKey, string>>;
  /** When the app last checked in. Entries not seen for PUSH_TTL_SECONDS are removed by the sender. */
  seenAt: number;
};

export class PushError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Only the browsers' real push services, so the server never posts to an address someone made up.
const PUSH_HOSTS = [/\.googleapis\.com$/, /\.mozilla\.com$/, /\.push\.apple\.com$/, /\.notify\.windows\.com$/, /^fcm\.googleapis\.com$/];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function entryId(endpoint: string) {
  const bytes = new TextEncoder().encode(endpoint);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

function validTimeZone(zone: unknown): zone is string {
  if (typeof zone !== "string" || zone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

export function parseSubscription(value: unknown): PushSubscriptionJSON {
  const sub = value as Partial<PushSubscriptionJSON> | null;
  if (!sub || typeof sub.endpoint !== "string" || sub.endpoint.length > 1000) throw new PushError(400, "Missing push address.");
  let url: URL;
  try {
    url = new URL(sub.endpoint);
  } catch {
    throw new PushError(400, "Bad push address.");
  }
  if (url.protocol !== "https:" || !PUSH_HOSTS.some((host) => host.test(url.hostname))) throw new PushError(400, "Unknown push service.");
  const keys = sub.keys;
  if (!keys || typeof keys.p256dh !== "string" || typeof keys.auth !== "string" || keys.p256dh.length > 200 || keys.auth.length > 100) {
    throw new PushError(400, "Missing push keys.");
  }
  return { endpoint: sub.endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
}

export function parseReminders(value: unknown): Partial<Record<ReminderKey, string>> {
  const out: Partial<Record<ReminderKey, string>> = {};
  if (!value || typeof value !== "object") return out;
  for (const key of REMINDER_KEYS) {
    const time = (value as Record<string, unknown>)[key];
    if (typeof time === "string" && TIME.test(time)) out[key] = time;
  }
  return out;
}

export async function saveEntry(store: Store, body: { subscription?: unknown; timeZone?: unknown; reminders?: unknown; updates?: unknown }) {
  const subscription = parseSubscription(body.subscription);
  if (!validTimeZone(body.timeZone)) throw new PushError(400, "Bad time zone.");
  const id = await entryId(subscription.endpoint);
  const previous = await store.hgetall(PUSH_HASH).then((all) => all[id]);
  const sent = previous ? ((JSON.parse(previous) as PushEntry).sent ?? {}) : {};
  const entry: PushEntry = {
    subscription,
    timeZone: body.timeZone,
    reminders: parseReminders(body.reminders),
    updates: body.updates !== false,
    sent,
    seenAt: Date.now(),
  };
  await store.hset(PUSH_HASH, id, JSON.stringify(entry), PUSH_TTL_SECONDS);
  return { ok: true };
}

export async function removeEntry(store: Store, body: { endpoint?: unknown }) {
  if (typeof body.endpoint !== "string") throw new PushError(400, "Missing push address.");
  await store.hdel(PUSH_HASH, await entryId(body.endpoint));
  return { ok: true };
}

/** The local date and minutes past midnight in a time zone. */
export function localClock(now: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function dayBefore(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const prev = new Date(Date.UTC(y, m - 1, d - 1));
  return prev.toISOString().slice(0, 10);
}

/** The reminders due now, each with the local date it belongs to: its time came within the window (a 23:50 reminder
 * sent at 00:10 still belongs to the day before) and it has not gone out for that date yet. */
export function dueReminders(entry: PushEntry, now: Date): Array<{ key: ReminderKey; date: string }> {
  const clock = localClock(now, entry.timeZone);
  const due: Array<{ key: ReminderKey; date: string }> = [];
  for (const key of REMINDER_KEYS) {
    const time = entry.reminders[key];
    if (!time) continue;
    const [h, m] = time.split(":").map(Number);
    let late = clock.minutes - (h * 60 + m);
    let date = clock.date;
    if (late < 0) {
      late += 24 * 60;
      date = dayBefore(clock.date);
    }
    if (late < SEND_WINDOW_MINUTES && entry.sent[key] !== date) due.push({ key, date });
  }
  return due;
}
