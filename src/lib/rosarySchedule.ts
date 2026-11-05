import { useEffect, useState } from "react";
import type { MysterySetId } from "@/content/rosary";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { addDays, dateOnly, orthodoxPascha } from "@/lib/fastingSeasons";

// Which mysteries belong to which day. "traditional" is the older fifteen-mystery week; "luminous" is the week used
// since 2002, with the Luminous Mysteries on Thursday.
export type RosaryPattern = "traditional" | "luminous";

export const ROSARY_PATTERN_KEY = "rosary:pattern";
const CHANGE_EVENT = "nepsis:rosary-pattern-change";

export function getRosaryPattern(): RosaryPattern {
  return getStoredItem<unknown>(ROSARY_PATTERN_KEY) === "luminous" ? "luminous" : "traditional";
}

export function useRosaryPattern(): [RosaryPattern, (pattern: RosaryPattern) => void] {
  const [pattern, setLocal] = useState<RosaryPattern>(getRosaryPattern);
  useEffect(() => {
    const refresh = () => setLocal(getRosaryPattern());
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, []);
  function save(next: RosaryPattern) {
    setStoredItem(ROSARY_PATTERN_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return [pattern, save];
}

/** Sundays in the traditional week follow the season: Joyful in Advent, Sorrowful in Lent (by the Orthodox Pascha). */
function traditionalSunday(date: Date): MysterySetId {
  const today = dateOnly(date);
  const pascha = orthodoxPascha(today.getFullYear());
  if (today >= addDays(pascha, -46) && today < pascha) return "sorrowful";
  const christmas = new Date(today.getFullYear(), 11, 25);
  const adventStart = addDays(christmas, -(christmas.getDay() || 7) - 21);
  if (today >= adventStart && today < christmas) return "joyful";
  return "glorious";
}

const WEEK: Record<RosaryPattern, MysterySetId[]> = {
  //            Sun        Mon       Tue          Wed         Thu         Fri          Sat
  traditional: ["glorious", "joyful", "sorrowful", "glorious", "joyful", "sorrowful", "glorious"],
  luminous: ["glorious", "joyful", "sorrowful", "glorious", "luminous", "sorrowful", "joyful"],
};

export function mysterySetForDay(date: Date, pattern: RosaryPattern): MysterySetId {
  const day = date.getDay();
  if (day === 0 && pattern === "traditional") return traditionalSunday(date);
  return WEEK[pattern][day];
}

/** The days a set is prayed on, in words. */
export function mysteryDays(setId: MysterySetId, pattern: RosaryPattern): string {
  if (pattern === "luminous") {
    return { joyful: "Monday and Saturday", luminous: "Thursday", sorrowful: "Tuesday and Friday", glorious: "Wednesday and Sunday" }[setId];
  }
  return {
    joyful: "Monday and Thursday, and Sundays in Advent",
    luminous: "no fixed day in the traditional week",
    sorrowful: "Tuesday and Friday, and Sundays in Lent",
    glorious: "Wednesday and Saturday, and other Sundays",
  }[setId];
}

/** Today's date as a key, to notice when the day changes. */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
