// Prayer groups on this device: which groups you belong to, under which first name, and the calls
// to the small group service at /api/groups. Nothing else about you leaves the device.
import { Capacitor } from "@capacitor/core";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { isoDate } from "@/lib/fastingSeasons";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

export const GROUPS_KEY = "prayer-groups:v1";
export const GROUPS_CHANGED_EVENT = "prayer-groups:changed";

export type SavedGroup = { id: string; name: string; memberId: string; memberName: string; adminKey?: string; joined: number };

export type GroupView = {
  id: string;
  name: string;
  created: number;
  intentions: { id: string; by: string; text: string; created: number; mine: boolean }[];
  prayedToday: string[];
  youPrayedToday: boolean;
};

export class GroupServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** The website calls its own server; the Android app calls the website. */
function apiBase() {
  return Capacitor.isNativePlatform() ? PUBLIC_SITE_URL : "";
}

export function inviteLink(id: string) {
  return `${PUBLIC_SITE_URL}/pray?tab=groups&join=${id}`;
}

function newMemberId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getSavedGroups(): SavedGroup[] {
  const list = getStoredItem<SavedGroup[]>(GROUPS_KEY);
  return Array.isArray(list) ? list : [];
}

function saveGroups(list: SavedGroup[]) {
  setStoredItem(GROUPS_KEY, list);
  window.dispatchEvent(new Event(GROUPS_CHANGED_EVENT));
}

export function forgetGroup(id: string) {
  saveGroups(getSavedGroups().filter((group) => group.id !== id));
}

async function call<T>(method: "GET" | "POST", query: string, body?: unknown, memberId?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/api/groups${query}`, {
      method,
      headers: { "Content-Type": "application/json", ...(memberId ? { "x-member-id": memberId } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new GroupServiceError(0, "You seem to be offline. Prayer groups need a connection.");
  }
  const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
  const data = (isJson ? await response.json().catch(() => null) : null) as ({ error?: string } & Record<string, unknown>) | null;
  if (!response.ok || !data) {
    throw new GroupServiceError(response.status, data?.error ?? "Prayer groups are not available right now. Please try again later.");
  }
  return data as T;
}

export async function createGroup(name: string, memberName: string) {
  const created = await call<{ id: string; name: string; adminKey: string }>("POST", "", { action: "create", name });
  const saved: SavedGroup = { id: created.id, name: created.name, memberId: newMemberId(), memberName: memberName.trim(), adminKey: created.adminKey, joined: Date.now() };
  saveGroups([saved, ...getSavedGroups()]);
  return saved;
}

export function fetchGroup(id: string, memberId?: string) {
  return call<GroupView>("GET", `?id=${encodeURIComponent(id)}&date=${isoDate(new Date())}`, undefined, memberId);
}

/** Checks the group exists, then remembers it on this device. */
export async function joinGroup(id: string, memberName: string) {
  const existing = getSavedGroups().find((group) => group.id === id);
  if (existing) return existing;
  const view = await fetchGroup(id);
  const saved: SavedGroup = { id, name: view.name, memberId: newMemberId(), memberName: memberName.trim(), joined: Date.now() };
  saveGroups([saved, ...getSavedGroups()]);
  return saved;
}

export function addRequest(group: SavedGroup, text: string) {
  return call("POST", "", { action: "intention", id: group.id, memberId: group.memberId, memberName: group.memberName, text });
}

export function removeRequest(group: SavedGroup, intentionId: string) {
  return call("POST", "", { action: "remove", id: group.id, intentionId, memberId: group.memberId, adminKey: group.adminKey });
}

export function markPrayed(group: SavedGroup) {
  return call("POST", "", { action: "prayed", id: group.id, memberId: group.memberId, memberName: group.memberName, date: isoDate(new Date()) });
}

export async function closeGroup(group: SavedGroup) {
  await call("POST", "", { action: "close", id: group.id, adminKey: group.adminKey });
  forgetGroup(group.id);
}
