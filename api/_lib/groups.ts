// Prayer groups: a private link, first names only, prayer requests that fade after 30 days,
// and who has prayed today. No accounts and no email. A group with no activity for 90 days is deleted.
import type { Store } from "./store";

const DAY = 86_400;
export const GROUP_TTL = 90 * DAY;
export const INTENTION_DAYS = 30;
const PRAYED_TTL = 3 * DAY;
export const LIMITS = { groupName: 60, memberName: 40, text: 280, intentions: 50 };

export type GroupMeta = { name: string; created: number; adminHash: string };
export type Intention = { id: string; memberId: string; by: string; text: string; created: number };
export type GroupView = {
  id: string;
  name: string;
  created: number;
  intentions: { id: string; by: string; text: string; created: number; mine: boolean }[];
  prayedToday: string[];
  youPrayedToday: boolean;
};

export class GroupError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const metaKey = (id: string) => `g:${id}`;
const intentionsKey = (id: string) => `g:${id}:i`;
const prayedKey = (id: string, date: string) => `g:${id}:p:${date}`;

/** Removes control characters and extra spaces, and enforces a length limit. */
export function cleanText(value: unknown, max: number, label: string) {
  if (typeof value !== "string") throw new GroupError(400, `${label} is missing.`);
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) throw new GroupError(400, `${label} is empty.`);
  if (text.length > max) throw new GroupError(400, `${label} is longer than ${max} characters.`);
  return text;
}

export function randomId(bytes = 16) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(data, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function checkId(id: unknown): string {
  if (typeof id !== "string" || !/^[0-9a-f]{32}$/.test(id)) throw new GroupError(404, "This group was not found.");
  return id;
}

function checkMember(memberId: unknown): string {
  if (typeof memberId !== "string" || !/^[0-9a-f]{32}$/.test(memberId)) throw new GroupError(400, "Missing member id.");
  return memberId;
}

/** The person's local date, accepted only if it is within a day of the server's date. */
export function checkDate(date: unknown, now = Date.now()): string {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new GroupError(400, "Missing date.");
  const t = Date.parse(`${date}T12:00:00Z`);
  if (!Number.isFinite(t) || Math.abs(t - now) > 1.6 * DAY * 1000) throw new GroupError(400, "That date is not today.");
  return date;
}

async function loadMeta(store: Store, id: string): Promise<GroupMeta> {
  const raw = await store.get(metaKey(id));
  if (!raw) throw new GroupError(404, "This group was not found. It may have been closed, or left unused for 90 days.");
  return JSON.parse(raw) as GroupMeta;
}

async function touch(store: Store, id: string, meta: GroupMeta) {
  await store.set(metaKey(id), JSON.stringify(meta), GROUP_TTL);
  await store.expire(intentionsKey(id), GROUP_TTL);
}

export async function createGroup(store: Store, input: { name: unknown }, now = Date.now()) {
  const name = cleanText(input.name, LIMITS.groupName, "The group name");
  const id = randomId();
  const adminKey = randomId();
  const meta: GroupMeta = { name, created: now, adminHash: await sha256(adminKey) };
  await store.set(metaKey(id), JSON.stringify(meta), GROUP_TTL);
  return { id, name, adminKey };
}

export async function viewGroup(store: Store, input: { id: unknown; memberId?: unknown; date: unknown }, now = Date.now()): Promise<GroupView> {
  const id = checkId(input.id);
  const date = checkDate(input.date, now);
  const meta = await loadMeta(store, id);
  const memberId = typeof input.memberId === "string" ? input.memberId : "";
  const all = Object.values(await store.hgetall(intentionsKey(id))).map((raw) => JSON.parse(raw) as Intention);
  const cutoff = now - INTENTION_DAYS * DAY * 1000;
  const stale = all.filter((item) => item.created < cutoff);
  for (const item of stale) await store.hdel(intentionsKey(id), item.id);
  const prayed = await store.hgetall(prayedKey(id, date));
  return {
    id,
    name: meta.name,
    created: meta.created,
    intentions: all
      .filter((item) => item.created >= cutoff)
      .sort((a, b) => b.created - a.created)
      .map((item) => ({ id: item.id, by: item.by, text: item.text, created: item.created, mine: item.memberId === memberId })),
    prayedToday: Object.values(prayed).sort((a, b) => a.localeCompare(b)),
    youPrayedToday: Boolean(memberId && prayed[memberId]),
  };
}

export async function addIntention(store: Store, input: { id: unknown; memberId: unknown; memberName: unknown; text: unknown }, now = Date.now()) {
  const id = checkId(input.id);
  const memberId = checkMember(input.memberId);
  const by = cleanText(input.memberName, LIMITS.memberName, "Your name");
  const text = cleanText(input.text, LIMITS.text, "The prayer request");
  const meta = await loadMeta(store, id);
  const existing = await store.hgetall(intentionsKey(id));
  if (Object.keys(existing).length >= LIMITS.intentions) {
    throw new GroupError(409, "This group already has 50 prayer requests. Remove some that have been answered first.");
  }
  const intention: Intention = { id: randomId(8), memberId, by, text, created: now };
  await store.hset(intentionsKey(id), intention.id, JSON.stringify(intention), GROUP_TTL);
  await touch(store, id, meta);
  return { id: intention.id };
}

export async function removeIntention(store: Store, input: { id: unknown; intentionId: unknown; memberId?: unknown; adminKey?: unknown }) {
  const id = checkId(input.id);
  const meta = await loadMeta(store, id);
  if (typeof input.intentionId !== "string") throw new GroupError(400, "Missing prayer request.");
  const raw = (await store.hgetall(intentionsKey(id)))[input.intentionId];
  if (!raw) return { removed: false };
  const intention = JSON.parse(raw) as Intention;
  const isAuthor = typeof input.memberId === "string" && input.memberId === intention.memberId;
  const isAdmin = typeof input.adminKey === "string" && (await sha256(input.adminKey)) === meta.adminHash;
  if (!isAuthor && !isAdmin) throw new GroupError(403, "Only the person who added this request, or the group's creator, can remove it.");
  await store.hdel(intentionsKey(id), intention.id);
  return { removed: true };
}

export async function markPrayed(store: Store, input: { id: unknown; memberId: unknown; memberName: unknown; date: unknown }, now = Date.now()) {
  const id = checkId(input.id);
  const memberId = checkMember(input.memberId);
  const name = cleanText(input.memberName, LIMITS.memberName, "Your name");
  const date = checkDate(input.date, now);
  const meta = await loadMeta(store, id);
  await store.hset(prayedKey(id, date), memberId, name, PRAYED_TTL);
  await touch(store, id, meta);
  return { prayed: true };
}

export async function closeGroup(store: Store, input: { id: unknown; adminKey: unknown }) {
  const id = checkId(input.id);
  const meta = await loadMeta(store, id);
  if (typeof input.adminKey !== "string" || (await sha256(input.adminKey)) !== meta.adminHash) {
    throw new GroupError(403, "Only the group's creator can close it.");
  }
  await store.del(metaKey(id), intentionsKey(id));
  return { closed: true };
}
