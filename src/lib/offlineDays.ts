// Zero-signal days: a rolling window of the Church calendar (saints, fasting, tone and the day's readings, all in one
// orthocal.info response per day) kept in IndexedDB, so Today and the readings open instantly with no connection.
// The window is refilled whenever the app is open and online, and by the service worker's periodic sync where the
// browser allows it (an installed app in Chrome or Edge). The service worker shares this database: see public/sw.js.
import { format } from "date-fns";
import type { CalendarMode } from "@/lib/settings";

export const OFFLINE_DAYS = 14;
const DB_NAME = "nepsis-offline";
const DB_VERSION = 1;
const DAYS = "days";
const META = "meta";
// A day is refetched after this long, so late corrections from orthocal still arrive.
const REFRESH_AFTER_MS = 1000 * 60 * 60 * 24 * 3;

export type OfflineDay<T = unknown> = { key: string; mode: CalendarMode; date: string; savedAt: number; day: T };

export function offlineDayKey(mode: CalendarMode, date: Date) {
  return `${mode}:${format(date, "yyyy-MM-dd")}`;
}

export function orthocalDayUrl(mode: CalendarMode, date: Date) {
  return `https://orthocal.info/api/${mode}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is not available"));
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DAYS)) db.createObjectStore(DAYS, { keyPath: "key" });
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

function run<T>(store: string, mode: IDBTransactionMode, action: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = action(db.transaction(store, mode).objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export async function readOfflineDay<T>(mode: CalendarMode, date: Date): Promise<OfflineDay<T> | undefined> {
  try {
    return await run<OfflineDay<T> | undefined>(DAYS, "readonly", (s) => s.get(offlineDayKey(mode, date)));
  } catch {
    return undefined;
  }
}

export async function saveOfflineDay<T>(mode: CalendarMode, date: Date, day: T) {
  const record: OfflineDay<T> = { key: offlineDayKey(mode, date), mode, date: format(date, "yyyy-MM-dd"), savedAt: Date.now(), day };
  try {
    await run(DAYS, "readwrite", (s) => s.put(record));
  } catch {
    // Storage may be blocked (private mode) or full; the app still works online.
  }
}

async function allOfflineDays(): Promise<OfflineDay[]> {
  try {
    return await run<OfflineDay[]>(DAYS, "readonly", (s) => s.getAll());
  } catch {
    return [];
  }
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

let filling: Promise<number> | null = null;

/**
 * Makes sure the next OFFLINE_DAYS days (today included) are stored, fetching only what is missing or old, and
 * drops days that have passed. Returns how many days are ready offline.
 */
export function fillOfflineWindow(mode: CalendarMode, now = new Date()): Promise<number> {
  filling ??= (async () => {
    try {
      await run(META, "readwrite", (s) => s.put(mode, "calendarMode")).catch(() => {});
      const stored = new Map((await allOfflineDays()).map((record) => [record.key, record]));
      let ready = 0;
      for (let offset = 0; offset < OFFLINE_DAYS; offset += 1) {
        const date = addDays(now, offset);
        const existing = stored.get(offlineDayKey(mode, date));
        if (existing && Date.now() - existing.savedAt < REFRESH_AFTER_MS) {
          ready += 1;
          continue;
        }
        if (typeof navigator !== "undefined" && navigator.onLine === false) {
          if (existing) ready += 1;
          continue;
        }
        try {
          const response = await fetch(orthocalDayUrl(mode, date), { referrerPolicy: "no-referrer", signal: AbortSignal.timeout(15000) });
          if (!response.ok) throw new Error(String(response.status));
          await saveOfflineDay(mode, date, await response.json());
          ready += 1;
        } catch {
          if (existing) ready += 1;
        }
      }
      const yesterday = format(addDays(now, -1), "yyyy-MM-dd");
      const old = [...stored.values()].filter((record) => record.date < yesterday);
      await Promise.all(old.map((record) => run(DAYS, "readwrite", (s) => s.delete(record.key)).catch(() => {})));
      return ready;
    } finally {
      filling = null;
    }
  })();
  return filling;
}

/** How many of the coming days are stored for this calendar. */
export async function offlineDaysReady(mode: CalendarMode, now = new Date()) {
  const keys = new Set((await allOfflineDays()).map((record) => record.key));
  let ready = 0;
  for (let offset = 0; offset < OFFLINE_DAYS; offset += 1) if (keys.has(offlineDayKey(mode, addDays(now, offset)))) ready += 1;
  return ready;
}

/** Ask the service worker to refill the window in the background, where the browser supports periodic sync. */
export async function registerBackgroundRefill() {
  try {
    const registration = await navigator.serviceWorker?.ready;
    const periodic = (registration as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, options: { minInterval: number }) => Promise<void> };
    })?.periodicSync;
    if (!periodic) return false;
    await periodic.register("offline-days", { minInterval: 1000 * 60 * 60 * 12 });
    return true;
  } catch {
    return false;
  }
}
