// "Keeping the fast together" count rules, run in Node against the in-memory store.
import { expect, test } from "@playwright/test";
import { fastCount, keepFast } from "../api/_lib/fasts";
import { GroupError } from "../api/_lib/groups";
import { memoryStore } from "../api/_lib/store";

const NOW = Date.UTC(2026, 10, 20, 12);
const ANNA = "a".repeat(32);
const PETER = "b".repeat(32);

test("each device counts once per fast", async () => {
  const store = memoryStore();
  expect(await fastCount(store, { fast: "nativity-fast", year: 2026 }, NOW)).toMatchObject({ count: 0 });
  await keepFast(store, { fast: "nativity-fast", year: 2026, deviceId: ANNA }, NOW);
  await keepFast(store, { fast: "nativity-fast", year: 2026, deviceId: ANNA }, NOW);
  const result = await keepFast(store, { fast: "nativity-fast", year: "2026", deviceId: PETER }, NOW);
  expect(result.count).toBe(2);
  expect((await fastCount(store, { fast: "great-lent", year: 2026 }, NOW)).count).toBe(0);
});

test("unknown fasts, far-off years and bad device ids are refused", async () => {
  const store = memoryStore();
  await expect(keepFast(store, { fast: "pizza", year: 2026, deviceId: ANNA }, NOW)).rejects.toThrow(GroupError);
  await expect(keepFast(store, { fast: "nativity-fast", year: 2031, deviceId: ANNA }, NOW)).rejects.toThrow(GroupError);
  await expect(keepFast(store, { fast: "nativity-fast", year: 2026, deviceId: "me" }, NOW)).rejects.toThrow(GroupError);
});
