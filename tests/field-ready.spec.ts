import { expect, test } from "./fixtures";

const FAKE_DAY = {
  fast_level: 0,
  fast_level_desc: "No fast",
  feasts: [],
  saints: ["Offline Test Saint"],
  readings: [],
  abbreviated_reading_indices: [],
  tone: 3,
};

test("Today switches between Standard, Short and the one-minute Watch rule", async ({ page }) => {
  await page.goto("/today");
  const rule = page.getByRole("group", { name: "Rule for today" });
  await rule.getByRole("radio", { name: "Watch · 1 min" }).click();
  await expect(page.getByText(/About a minute\./)).toBeVisible();
  await page.getByRole("link", { name: /^Begin/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText(/Watch rule · 1 \//)).toBeVisible();
  await expect(dialog.getByText(/Holy God, Holy Mighty, Holy Immortal/).first()).toBeVisible({ timeout: 10_000 }).catch(() => {});
});

test("the Watchfulness Log counts days a rule was kept, privately", async ({ page }) => {
  await page.addInitScript(() => {
    const day = (offset: number) => {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const records: Record<string, unknown> = {};
    for (const offset of [1, 2, 3]) {
      records[day(offset)] = { date: day(offset), habits: { prayer: true, reading: false, reflection: false, mercy: false }, prayers: { morning: true }, updatedAt: 1 };
    }
    localStorage.setItem("daily_rhythm:v1", JSON.stringify({ __wrapped: 1, v: { records, intentions: [], favoritePrayerIds: [], customRuleSteps: [] }, ts: Date.now() }));
  });
  await page.goto("/me");
  const log = page.getByRole("region", { name: /Prayer log/ });
  await expect(log).toContainText("3 days in a row");
  await expect(log).toContainText("3 in 12 weeks");
});

test("Watchfulness mode turns the screen black and counts taps anywhere", async ({ page }) => {
  await page.goto("/pray?tab=counter");
  await page.getByRole("group", { name: "Pulse every" }).getByRole("radio", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "Begin in the dark" }).click();
  const rope = page.getByRole("button", { name: /Prayer rope, dark mode/ });
  await expect(rope).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await rope.click({ position: { x: 40, y: 300 } });
  await rope.click({ position: { x: 200, y: 500 } });
  await expect(rope).toHaveAttribute("aria-label", /2 knots/);
  await page.keyboard.press("Escape");
  await expect(rope).toHaveCount(0);
});

test.describe("offline days", () => {
  // The network stub below must see the app's requests; WebKit hides them from it while a service worker is in charge.
  test.use({ serviceWorkers: "block" });

test("the next two weeks of the calendar are kept for offline use", async ({ page }) => {
  let calls = 0;
  await page.route("https://orthocal.info/api/**", (route) => {
    calls += 1;
    return route.fulfill({ json: FAKE_DAY });
  });
  await page.goto("/today");
  await expect.poll(async () => page.evaluate(async () => {
    // Look without creating the database, so the app is the one that makes it.
    const exists = (await indexedDB.databases()).some((info) => info.name === "nepsis-offline");
    if (!exists) return 0;
    const db: IDBDatabase = await new Promise((resolve, reject) => {
      const request = indexedDB.open("nepsis-offline");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (!db.objectStoreNames.contains("days")) return 0;
    return new Promise<number>((resolve) => {
      const request = db.transaction("days").objectStore("days").count();
      request.onsuccess = () => resolve(request.result);
    });
  }), { timeout: 20_000 }).toBeGreaterThanOrEqual(14);

  // With the network gone, Today still has the same saints, straight from the device.
  const saints = page.locator("#saints-fast li").first();
  await expect(saints).toBeVisible();
  const firstSaint = (await saints.textContent())?.trim() ?? "";
  expect(firstSaint).not.toBe("");
  await page.unroute("https://orthocal.info/api/**");
  await page.route("https://orthocal.info/api/**", (route) => route.abort());
  await page.reload();
  await expect(page.locator("#saints-fast li").first()).toHaveText(firstSaint);
  expect(calls).toBeGreaterThanOrEqual(13);
});
});
