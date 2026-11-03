import { getStoredItem, removeStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { PatronSaint } from "@/lib/nameDay";

export const PATRON_SAINT_KEY = "patron-saint:v1";
export const PATRON_SAINT_CHANGED_EVENT = "nepsis:patron-saint-changed";

export function getPatronSaint() {
  return getStoredItem<PatronSaint>(PATRON_SAINT_KEY);
}

export function setPatronSaint(patron: PatronSaint | null) {
  if (patron) setStoredItem(PATRON_SAINT_KEY, patron);
  else removeStoredItem(PATRON_SAINT_KEY);
  window.dispatchEvent(new Event(PATRON_SAINT_CHANGED_EVENT));
}
