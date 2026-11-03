import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

/** Names of the living and departed to remember in prayer. Stored only on this device. */
export const COMMEMORATIONS_KEY = "commemorations:v1";
export const COMMEMORATIONS_CHANGED_EVENT = "nepsis:commemorations-changed";

/** `reposed` is the date of repose ("YYYY-MM-DD"), used for the 3rd, 9th, and 40th days and anniversaries. */
export type CommemorationEntry = { id: string; name: string; note?: string; reposed?: string };
export type Commemorations = { living: CommemorationEntry[]; departed: CommemorationEntry[] };

export function getCommemorations(): Commemorations {
  const stored = getStoredItem<Commemorations>(COMMEMORATIONS_KEY);
  return {
    living: Array.isArray(stored?.living) ? stored.living : [],
    departed: Array.isArray(stored?.departed) ? stored.departed : [],
  };
}

export function setCommemorations(next: Commemorations) {
  setStoredItem(COMMEMORATIONS_KEY, next);
  window.dispatchEvent(new Event(COMMEMORATIONS_CHANGED_EVENT));
}

/** Joins names the way they are read aloud: "John, Mary, and Anna". */
export function joinNames(entries: CommemorationEntry[]) {
  const names = entries.map((entry) => entry.name);
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/** The "Remember, O Lord" prayer step for the daily prayer flow, or null when the list is empty. */
export function commemorationStep(list: Commemorations) {
  if (!list.living.length && !list.departed.length) return null;
  const body: string[] = [];
  if (list.living.length) {
    body.push(`Save, O Lord, and have mercy on Thy servants ${joinNames(list.living)}. Grant them health and salvation, and guide them in all things.`);
  }
  if (list.departed.length) {
    body.push(
      `Give rest, O Lord, to the souls of Thy departed servants ${joinNames(list.departed)}, and forgive them every sin, voluntary and involuntary. Grant them Thy Kingdom, and make their memory eternal.`,
    );
  }
  return { title: "Remember, O Lord", body };
}
