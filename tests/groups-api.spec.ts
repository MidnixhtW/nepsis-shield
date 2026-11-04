// Prayer-group rules, run in Node against the in-memory store.
import { expect, test } from "@playwright/test";
import { GroupError, addIntention, checkDate, closeGroup, createGroup, markPrayed, removeIntention, viewGroup } from "../api/_lib/groups";
import { memoryStore } from "../api/_lib/store";

const NOW = Date.UTC(2026, 10, 4, 15);
const TODAY = "2026-11-04";
const ANNA = "a".repeat(32);
const PETER = "b".repeat(32);

async function setup() {
  const store = memoryStore();
  const group = await createGroup(store, { name: "  St. Nicholas   parish  " }, NOW);
  return { store, group };
}

test("a new group is empty and keeps a tidy name", async () => {
  const { store, group } = await setup();
  expect(group.id).toMatch(/^[0-9a-f]{32}$/);
  const view = await viewGroup(store, { id: group.id, date: TODAY, memberId: ANNA }, NOW);
  expect(view).toMatchObject({ name: "St. Nicholas parish", intentions: [], prayedToday: [], youPrayedToday: false });
});

test("members add requests, see which are theirs, and mark that they prayed", async () => {
  const { store, group } = await setup();
  await addIntention(store, { id: group.id, memberId: ANNA, memberName: "Anna", text: "For my mother's surgery" }, NOW);
  await addIntention(store, { id: group.id, memberId: PETER, memberName: "Peter", text: "For peace in our home" }, NOW + 1000);
  await markPrayed(store, { id: group.id, memberId: PETER, memberName: "Peter", date: TODAY }, NOW);
  const view = await viewGroup(store, { id: group.id, date: TODAY, memberId: ANNA }, NOW);
  expect(view.intentions.map((item) => [item.by, item.mine])).toEqual([["Peter", false], ["Anna", true]]);
  expect(view.prayedToday).toEqual(["Peter"]);
  expect(view.youPrayedToday).toBe(false);
});

test("only the author or the creator can remove a request", async () => {
  const { store, group } = await setup();
  const { id: intentionId } = await addIntention(store, { id: group.id, memberId: ANNA, memberName: "Anna", text: "For travel mercies" }, NOW);
  await expect(removeIntention(store, { id: group.id, intentionId, memberId: PETER })).rejects.toThrow(GroupError);
  expect(await removeIntention(store, { id: group.id, intentionId, adminKey: group.adminKey })).toEqual({ removed: true });
});

test("requests fade after 30 days", async () => {
  const { store, group } = await setup();
  await addIntention(store, { id: group.id, memberId: ANNA, memberName: "Anna", text: "An old request" }, NOW);
  const later = NOW + 31 * 86_400_000;
  const view = await viewGroup(store, { id: group.id, date: "2026-12-05", memberId: ANNA }, later);
  expect(view.intentions).toEqual([]);
});

test("input is checked: lengths, empty text, unknown groups and dates far from today", async () => {
  const { store, group } = await setup();
  await expect(addIntention(store, { id: group.id, memberId: ANNA, memberName: "Anna", text: "x".repeat(281) }, NOW)).rejects.toThrow("longer than 280");
  await expect(addIntention(store, { id: group.id, memberId: ANNA, memberName: "   ", text: "Hello" }, NOW)).rejects.toThrow("empty");
  await expect(viewGroup(store, { id: "c".repeat(32), date: TODAY }, NOW)).rejects.toThrow("not found");
  expect(() => checkDate("2026-11-10", NOW)).toThrow("not today");
  expect(checkDate("2026-11-05", NOW)).toBe("2026-11-05"); // already tomorrow in some time zones
});

test("only the creator can close a group", async () => {
  const { store, group } = await setup();
  await expect(closeGroup(store, { id: group.id, adminKey: "wrong" })).rejects.toThrow("Only the group's creator");
  await closeGroup(store, { id: group.id, adminKey: group.adminKey });
  await expect(viewGroup(store, { id: group.id, date: TODAY }, NOW)).rejects.toThrow("not found");
});
