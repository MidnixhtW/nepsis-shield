import { useEffect, useState } from "react";
import type { ResponderMode } from "@/lib/responderMode";

// The Church's daily cycle of services, mapped to the clock hours they traditionally fall near.
// Times vary by parish and monastery; this is a gentle reminder, not a service schedule.
const hours: Array<{ from: number; name: string }> = [
  { from: 0, name: "Midnight Office" },
  { from: 4, name: "Matins" },
  { from: 6, name: "First Hour" },
  { from: 9, name: "Third Hour" },
  { from: 12, name: "Sixth Hour" },
  { from: 15, name: "Ninth Hour" },
  { from: 18, name: "Vespers" },
  { from: 21, name: "Compline" },
];

export function prayerHourName(date: Date) {
  const hour = date.getHours();
  return [...hours].reverse().find((entry) => hour >= entry.from)!.name;
}

/** Roles used to 24-hour time see "0600" instead of "6:00 AM". */
const TWENTY_FOUR_HOUR_ROLES: ResponderMode[] = ["military", "law", "fire", "ems", "dispatch", "custody"];

export function usesTwentyFourHourTime(role: ResponderMode) {
  return TWENTY_FOUR_HOUR_ROLES.includes(role);
}

/** Current time, refreshed each minute, for clock-based labels. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
