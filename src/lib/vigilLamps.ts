import { useEffect, useState } from "react";
import { format, subHours } from "date-fns";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

// A vigil lamp lit beside a name on the prayer list. It burns for the day and goes out at four in the morning, so a
// lamp lit at night still burns until morning. Nothing is counted or kept beyond today; stored only on this device.
export const LAMPS_KEY = "vigil-lamps:v1";
const CHANGE_EVENT = "nepsis:lamps-change";
const DAY_STARTS_AT_HOUR = 4;

type LampStore = { day: string; ids: string[] };

export function lampDay(now = new Date()) {
  return format(subHours(now, DAY_STARTS_AT_HOUR), "yyyy-MM-dd");
}

export function litLamps(now = new Date()): Set<string> {
  const stored = getStoredItem<LampStore>(LAMPS_KEY);
  if (!stored || stored.day !== lampDay(now) || !Array.isArray(stored.ids)) return new Set();
  return new Set(stored.ids);
}

export function toggleLamp(id: string, now = new Date()) {
  const lit = litLamps(now);
  if (lit.has(id)) lit.delete(id);
  else lit.add(id);
  setStoredItem(LAMPS_KEY, { day: lampDay(now), ids: [...lit] });
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Lights a lamp (leaving it lit if it already is), as when a prayer was offered for that name. */
export function lightLamp(id: string, now = new Date()) {
  if (!litLamps(now).has(id)) toggleLamp(id, now);
}

/** Today's lit lamps, kept current when a lamp is lit anywhere in the app. */
export function useLitLamps() {
  const [lit, setLit] = useState<Set<string>>(() => litLamps());
  useEffect(() => {
    const refresh = () => setLit(litLamps());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return lit;
}
