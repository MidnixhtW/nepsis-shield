import { expect, test } from "./fixtures";

const LEARN_KEY = "learn-by-heart:v1";
const OLD_CREED_KEY = "orthodox-app:nicene-creed-progress:v1";
const JESUS_PRAYER = ["Lord", "Jesus", "Christ,", "Son", "of", "God,", "have", "mercy", "on", "me,", "a", "sinner."];

test("a prayer is learned in four steps: read, fade, first letters, tap in order", async ({ page }) => {
  await page.goto("/learn?tab=byheart", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Learn by heart." })).toBeVisible();
  await page.getByRole("link", { name: /^The Jesus Prayer/ }).click();
  await expect(page).toHaveURL(/prayer=jesus-prayer/);

  await page.getByRole("button", { name: "I've read it" }).click();
  // Fade: peeking hides "I said it" until the text is hidden again.
  await expect(page.getByText("Say the whole section aloud, filling in the missing words.")).toBeVisible();
  await page.getByRole("button", { name: "Show me" }).click();
  await expect(page.getByRole("button", { name: "I said it" })).toBeDisabled();
  await page.getByRole("button", { name: "Hide it again" }).click();
  await page.getByRole("button", { name: "I said it" }).click();
  // First letters.
  await expect(page.getByText("L J C, S o G, h m o m, a s.")).toBeVisible();
  await page.getByRole("button", { name: "I said it" }).click();

  // Tap in order, with one slip, which is allowed.
  const words = page.getByRole("group", { name: "Words to tap" });
  await words.getByRole("button", { name: "sinner.", exact: true }).click();
  await expect(page.getByText("Not that one. What comes next?")).toBeVisible();
  for (const word of JESUS_PRAYER) await words.getByRole("button", { name: word, exact: true }).click();
  await expect(page.getByText(/Learned\. You know this section\. It comes back for review tomorrow\./)).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByText("1 / 1", { exact: true })).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.v, LEARN_KEY);
  expect(stored["jesus-prayer"]["0"]).toMatchObject({ learned: true, step: 0 });
});

test("the old Creed address keeps earlier Creed progress, and starting over needs a confirmation", async ({ page }) => {
  await page.addInitScript(([key, value]) => {
    if (sessionStorage.getItem("test:creed-seeded")) return;
    localStorage.setItem(key, value);
    sessionStorage.setItem("test:creed-seeded", "1");
  }, [OLD_CREED_KEY, JSON.stringify({ completedLines: [0, 2], bestQuiz: 75 })] as const);
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "The Creed", level: 2 })).toBeVisible();
  await expect(page.getByText("2 / 6", { exact: true })).toBeVisible();
  // Opens on the first section not yet known.
  await expect(page.getByText("Section 2 of 6")).toBeVisible();

  await page.getByRole("button", { name: "Start this prayer over" }).click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "Keep progress" }).click();
  await expect(page.getByText("2 / 6", { exact: true })).toBeVisible();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Start this prayer over" }).click();
  await dialog.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByText("0 / 6", { exact: true })).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByText("0 / 6", { exact: true })).toBeVisible();
});

test("a learned section due for review shows on Today and is reviewed by tapping it in order", async ({ page }) => {
  await page.addInitScript((key) => {
    if (sessionStorage.getItem("test:review-seeded")) return;
    const yesterday = new Date(Date.now() - 86_400_000);
    const due = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    localStorage.setItem(key, JSON.stringify({ __wrapped: 1, ts: Date.now(), v: { "jesus-prayer": { 0: { level: 4, learned: true, step: 0, due } } } }));
    sessionStorage.setItem("test:review-seeded", "1");
  }, LEARN_KEY);
  await page.goto("/today", { waitUntil: "domcontentloaded" });
  const card = page.getByRole("region", { name: "Review today" });
  await expect(card).toContainText("1 section");
  await card.getByRole("link", { name: "Review" }).click();

  await expect(page.getByText("Review 1 of 1")).toBeVisible();
  const words = page.getByRole("group", { name: "Words to tap" });
  for (const word of JESUS_PRAYER) await words.getByRole("button", { name: word, exact: true }).click();
  await expect(page.getByText("Remembered. It comes back later next time.")).toBeVisible();
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page.getByRole("heading", { name: "Review done." })).toBeVisible();

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.v, LEARN_KEY);
  expect(stored["jesus-prayer"]["0"].step).toBe(1);
  await page.goto("/today", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Review today" })).toHaveCount(0);
});

test("Family links a longer child prayer to Learn by heart", async ({ page }) => {
  await page.goto("/pray?tab=family", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Prayers to learn" }).click();
  await page.getByRole("link", { name: "Practice it by heart" }).first().click();
  await expect(page.getByRole("heading", { name: "Blessing before meals", level: 2 })).toBeVisible();
});
