// "Keeping the fast together": the anonymous count at /api/fasts. This device sends only a random id
// (made here, tied to nothing) and which fast it is keeping. See the Privacy page.
import { Capacitor } from "@capacitor/core";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { SeasonInstance } from "@/lib/fastingSeasons";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";
import { getParish } from "@/lib/parish";

const DEVICE_KEY = "fast-count:device";
const KEPT_KEY = "fast-count:kept";

export const COUNTED_FASTS = ["great-lent", "holy-week", "apostles-fast", "dormition-fast", "nativity-fast"];

function apiBase() {
  return Capacitor.isNativePlatform() ? PUBLIC_SITE_URL : "";
}

function deviceId() {
  const saved = getStoredItem<string>(DEVICE_KEY);
  if (saved && /^[0-9a-f]{32}$/.test(saved)) return saved;
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  setStoredItem(DEVICE_KEY, id);
  return id;
}

function fastKey(season: SeasonInstance) {
  return { fast: season.id, year: season.start.getFullYear() };
}

// What this device has joined: "nativity-fast:2026", plus "nativity-fast:2026:<parish code>" once with a parish.
function keptKey(fast: string, year: number) {
  const parish = getParish();
  return parish ? `${fast}:${year}:${parish.code}` : `${fast}:${year}`;
}

/** True once this device is counted for the fast (and for its parish, when it has one). */
export function keptOnThisDevice(season: SeasonInstance) {
  const kept = getStoredItem<string[]>(KEPT_KEY) ?? [];
  return kept.includes(keptKey(season.id, season.start.getFullYear()));
}

export type FastCounts = { count: number; parishCount?: number };

function readCounts(data: { count?: unknown; parishCount?: unknown }): FastCounts | null {
  if (typeof data.count !== "number") return null;
  return typeof data.parishCount === "number" ? { count: data.count, parishCount: data.parishCount } : { count: data.count };
}

/** The counts (with this device's parish, if it has one), or null when the service is off or unreachable. */
export async function getFastCount(season: SeasonInstance): Promise<FastCounts | null> {
  const { fast, year } = fastKey(season);
  const parish = getParish();
  try {
    const query = new URLSearchParams({ fast, year: String(year), ...(parish ? { parish: parish.code } : {}) });
    const response = await fetch(`${apiBase()}/api/fasts?${query.toString()}`);
    if (!response.ok) return null;
    return readCounts((await response.json()) as { count?: unknown; parishCount?: unknown });
  } catch {
    return null;
  }
}

export async function keepFastTogether(season: SeasonInstance): Promise<FastCounts | null> {
  const { fast, year } = fastKey(season);
  const parish = getParish();
  try {
    const response = await fetch(`${apiBase()}/api/fasts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fast, year, deviceId: deviceId(), ...(parish ? { parish: parish.code } : {}) }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { count?: unknown; parishCount?: unknown };
    const kept = getStoredItem<string[]>(KEPT_KEY) ?? [];
    const keys = [`${fast}:${year}`, keptKey(fast, year)];
    setStoredItem(KEPT_KEY, [...kept.filter((item) => !keys.includes(item)), ...new Set(keys)].slice(-24));
    return readCounts(data);
  } catch {
    return null;
  }
}
