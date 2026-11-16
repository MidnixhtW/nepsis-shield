import { expect, test } from "./fixtures";

// The app's service worker would take over /api/guide, and WebKit then skips the routes below.
test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nepsis-shield:philokalia-guide-unlocked", "true"));
});

test("the hidden guide shows the patron shelf, with a patron's feast day", async ({ page }) => {
  // 8 November 2026: the Synaxis of the Archangel Michael.
  await page.clock.install({ time: new Date(2026, 10, 8, 9, 0) });
  await page.goto("/philokalia");
  await page.getByRole("tab", { name: "Patrons" }).click();
  await expect(page.getByRole("heading", { name: "Feast of your patron" })).toBeVisible();
  await expect(page.getByText("His feast is today").first()).toBeVisible();
  for (const name of ["St Augustine of Hippo", "St Romanos the Melodist", "St George the Greatmartyr"]) {
    await expect(page.getByRole("button", { name: new RegExp(name) })).toBeVisible();
  }
  await page.getByRole("button", { name: /St Augustine of Hippo/ }).click();
  await expect(page.getByText(/our heart is restless, until it repose in Thee/)).toBeVisible();
});

test("with an access code, questions go to the server and its answer is shown", async ({ page }) => {
  const sent: Array<{ code: string; messages: Array<{ role: string; content: string }> }> = [];
  await page.route("**/api/guide", async (route) => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ text: "Nepsis is watchfulness over the heart." }) });
  });
  await page.goto("/philokalia");
  await page.getByLabel("Guide access code").fill("watch-and-pray");
  await page.getByRole("button", { name: "Connect" }).click();
  await expect(page.getByRole("heading", { name: "Guide connected" })).toBeVisible();

  await page.getByPlaceholder(/Ask about prayer/).fill("What is nepsis?");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.getByText("Nepsis is watchfulness over the heart.")).toBeVisible();
  expect(sent[0].code).toBe("watch-and-pray");
  expect(sent[0].messages).toEqual([{ role: "user", content: "What is nepsis?" }]);
});

test("a wrong code is forgotten and the built-in notes answer instead", async ({ page }) => {
  await page.route("**/api/guide", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "That access code is not right." }) }),
  );
  await page.addInitScript(() => localStorage.setItem("nepsis-shield:guide-access-code", "nope"));
  await page.goto("/philokalia");
  await page.getByPlaceholder(/Ask about prayer/).fill("How do I prepare for confession?");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.getByText(/That access code is not right\. From the built-in notes instead/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Connect the guide" })).toBeVisible();
});
