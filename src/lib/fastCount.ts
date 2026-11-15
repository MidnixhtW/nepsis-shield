// "Keeping the fast together": the anonymous count at /api/fasts. This device sends only a random id
// (made here, tied to nothing) and which fast it is keeping. See the Privacy page.
import { Capacitor } from "@capacitor/core";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { SeasonInstance } from "@/lib/fastingSeasons";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

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

export function keptOnThisDevice(season: SeasonInstance) {
  const kept = getStoredItem<string[]>(KEPT_KEY) ?? [];
  return kept.includes(`${season.id}:${season.start.getFullYear()}`);
}

/** The count, or null when the service is off or unreachable (the line is then simply not shown). */
export async function getFastCount(season: SeasonInstance): Promise<number | null> {
  const { fast, year } = fastKey(season);
  try {
    const response = await fetch(`${apiBase()}/api/fasts?fast=${fast}&year=${year}`);
    if (!response.ok) return null;
    const data = (await response.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export async function keepFastTogether(season: SeasonInstance): Promise<number | null> {
  const { fast, year } = fastKey(season);
  try {
    const response = await fetch(`${apiBase()}/api/fasts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fast, year, deviceId: deviceId() }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { count?: number };
    const kept = getStoredItem<string[]>(KEPT_KEY) ?? [];
    setStoredItem(KEPT_KEY, [...kept.filter((item) => item !== `${fast}:${year}`), `${fast}:${year}`].slice(-12));
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}
