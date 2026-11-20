// "Keeping the fast together": an anonymous count of people keeping each fast with the app.
// Each device sends a random id (made on the device, tied to nothing) once per fast; only the count is shown.
// The ids expire with the fast, so nothing is kept for long.
// A parish (or any group) can keep a fast together under a random code made on a phone and shared as a link; the
// server sees only the code, never the parish's name, and the code's own count expires with the fast too.
import { GroupError } from "./groups.js";
import type { Store } from "./store";

const DAY = 86_400;
const FAST_TTL = 120 * DAY;
export const FAST_IDS = ["great-lent", "holy-week", "apostles-fast", "dormition-fast", "nativity-fast"] as const;
export type FastId = (typeof FAST_IDS)[number];

const countKey = (fast: FastId, year: number) => `f:${fast}:${year}`;
const parishKey = (fast: FastId, year: number, parish: string) => `f:${fast}:${year}:p:${parish}`;

/** A parish code: 8 to 12 lowercase letters and digits, or none. */
function checkParish(parish: unknown): string | null {
  if (parish === undefined || parish === null || parish === "") return null;
  if (typeof parish !== "string" || !/^[a-z0-9]{8,12}$/.test(parish)) throw new GroupError(400, "Unknown parish code.");
  return parish;
}

function checkFast(fast: unknown): FastId {
  if (typeof fast !== "string" || !(FAST_IDS as readonly string[]).includes(fast)) throw new GroupError(400, "Unknown fast.");
  return fast as FastId;
}

function checkYear(year: unknown, now = Date.now()): number {
  const value = typeof year === "string" ? Number(year) : year;
  const thisYear = new Date(now).getUTCFullYear();
  if (typeof value !== "number" || !Number.isInteger(value) || Math.abs(value - thisYear) > 1) throw new GroupError(400, "Unknown year.");
  return value;
}

function checkDevice(deviceId: unknown): string {
  if (typeof deviceId !== "string" || !/^[0-9a-f]{32}$/.test(deviceId)) throw new GroupError(400, "Missing device id.");
  return deviceId;
}

export async function fastCount(store: Store, input: { fast: unknown; year: unknown; parish?: unknown }, now = Date.now()) {
  const fast = checkFast(input.fast);
  const year = checkYear(input.year, now);
  const parish = checkParish(input.parish);
  return {
    fast,
    year,
    count: await store.hlen(countKey(fast, year)),
    ...(parish ? { parishCount: await store.hlen(parishKey(fast, year, parish)) } : {}),
  };
}

/** Adds this device to the fast's count. Sending again from the same device changes nothing. */
export async function keepFast(
  store: Store,
  input: { fast: unknown; year: unknown; deviceId: unknown; parish?: unknown },
  now = Date.now(),
) {
  const fast = checkFast(input.fast);
  const year = checkYear(input.year, now);
  const deviceId = checkDevice(input.deviceId);
  const parish = checkParish(input.parish);
  await store.hset(countKey(fast, year), deviceId, "1", FAST_TTL);
  if (parish) await store.hset(parishKey(fast, year, parish), deviceId, "1", FAST_TTL);
  return {
    fast,
    year,
    count: await store.hlen(countKey(fast, year)),
    ...(parish ? { parishCount: await store.hlen(parishKey(fast, year, parish)) } : {}),
  };
}
