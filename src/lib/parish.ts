// Keeping the fasts with a parish: a random code made on this phone, shared as a link with the parish's name. The
// server only ever sees the code (to count who keeps each fast with it); the name stays in the link and on devices.
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

export const PARISH_KEY = "parish:v1";
export const PARISH_CHANGED_EVENT = "nepsis:parish-changed";

export type Parish = { code: string; name: string };

const CODE = /^[a-z0-9]{8,12}$/;

export function getParish(): Parish | null {
  const saved = getStoredItem<Parish>(PARISH_KEY);
  return saved && CODE.test(saved.code) && typeof saved.name === "string" && saved.name.trim() ? saved : null;
}

export function setParish(parish: Parish | null) {
  setStoredItem(PARISH_KEY, parish);
  window.dispatchEvent(new Event(PARISH_CHANGED_EVENT));
}

export function newParishCode() {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(10)), (byte) => alphabet[byte % alphabet.length]).join("");
}

export function parishLink(parish: Parish) {
  const params = new URLSearchParams({ parish: parish.code, parishName: parish.name });
  return `${PUBLIC_SITE_URL}/today?${params.toString()}`;
}

/** A parish from a shared link's query string, or null. */
export function parishFromSearch(search: string): Parish | null {
  const params = new URLSearchParams(search);
  const code = params.get("parish") ?? "";
  const name = (params.get("parishName") ?? "").trim().slice(0, 60);
  return CODE.test(code) && name ? { code, name } : null;
}
