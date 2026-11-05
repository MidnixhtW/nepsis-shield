import { useEffect, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

// The last few places opened in the app, for "Recently opened" on the Me tab. Kept on this device.
export const RECENT_KEY = "recent-places:v1";
const CHANGE_EVENT = "nepsis:recent-change";
const MAX_RECENT = 6;

export type RecentPlace = { to: string; label: string; area: string; at: number };

// Today, Me and the Pray and Learn starting screens are home screens, not places someone goes back to.
const SKIP = new Set(["/today", "/me", "/pray", "/learn"]);

/** The destination that best matches a URL: same path, and every one of its parameters present. */
export function matchDestination(pathname: string, search: string): Destination | undefined {
  const params = new URLSearchParams(search);
  let best: Destination | undefined;
  let bestScore = -1;
  for (const destination of DESTINATIONS) {
    const [path, query = ""] = destination.to.split("?");
    if (path !== pathname) continue;
    const wanted = [...new URLSearchParams(query).entries()];
    if (!wanted.every(([key, value]) => params.get(key) === value)) continue;
    if (wanted.length > bestScore) {
      best = destination;
      bestScore = wanted.length;
    }
  }
  return best;
}

function isRecent(value: unknown): value is RecentPlace {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.to === "string" && item.to.startsWith("/") && typeof item.label === "string" && typeof item.area === "string" && typeof item.at === "number";
}

export function getRecentPlaces(): RecentPlace[] {
  const saved = getStoredItem<unknown>(RECENT_KEY);
  return Array.isArray(saved) ? saved.filter(isRecent).slice(0, MAX_RECENT) : [];
}

export function recordVisit(pathname: string, search: string) {
  // A ?begin= link is removed as soon as the prayer opens; count the page it lands on, once.
  if (new URLSearchParams(search).has("begin")) return;
  const destination = matchDestination(pathname, search);
  if (!destination || SKIP.has(destination.to)) return;
  const list = getRecentPlaces().filter((item) => item.to !== destination.to);
  setStoredItem(RECENT_KEY, [{ to: destination.to, label: destination.label, area: destination.area, at: Date.now() }, ...list].slice(0, MAX_RECENT));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useRecentPlaces() {
  const [list, setList] = useState<RecentPlace[]>(getRecentPlaces);
  useEffect(() => {
    const refresh = () => setList(getRecentPlaces());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return list;
}
