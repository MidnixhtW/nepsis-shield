// Uses the plain Playwright test (not ./fixtures) because this test needs the quick-start dialog.
import { expect, test } from "@playwright/test";

test("setup accepts several needs and a rule version that can be changed later", async ({ page }) => {
  // Outside any fasting season, so Today shows the full rule card rather than its compact form.
  await page.clock.setFixedTime(new Date(2026, 9, 1, 10, 0));
  await page.goto("/today");
  const onboarding = page.getByRole("dialog");

  await onboarding.getByRole("button", { name: "Continue" }).click(); // welcome
  await onboarding.getByRole("button", { name: /Parchment/ }).click();
  await expect(page.locator("html")).toHaveClass(/parchment/);
  await onboarding.getByRole("button", { name: "Continue" }).click(); // theme
  await onboarding.getByRole("button", { name: "Continue" }).click(); // role
  await onboarding.getByRole("button", { name: /Old Calendar/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click(); // calendar

  const next = onboarding.getByRole("button", { name: "Continue" });
  await expect(next).toBeDisabled();
  await onboarding.getByRole("button", { name: /Confession preparation/ }).click();
  await onboarding.getByRole("button", { name: /Help with anger/ }).click();
  await expect(onboarding.getByText("2 of 3 chosen")).toBeVisible();
  await next.click();
  await onboarding.getByRole("button", { name: "Continue" }).click(); // rhythm

  await expect(onboarding.getByRole("heading", { name: "Rule for Honest Return" })).toBeVisible();
  await onboarding.getByRole("radio", { name: /Preparing for confession/ }).click();
  await expect(onboarding.getByText(/pray Psalm 50, go through an examen/)).toBeVisible();
  await expect(onboarding.getByText("Also: Help with anger")).toBeVisible();
  await onboarding.getByRole("button", { name: "Seal this Daily Rule" }).click();
  await expect(onboarding).toBeHidden();

  // Today shows the rule compactly; open it to see the whole rule.
  await page.getByRole("button", { name: "Show rule" }).click();
  await expect(page.getByRole("heading", { name: "Rule for Honest Return" })).toBeVisible();
  const changeVersion = page.getByRole("button", { name: /Preparing for confession · Change version/ });
  await expect(changeVersion).toBeVisible();
  await expect(page.getByText("Also: Help with anger")).toBeVisible();

  await changeVersion.click();
  await page.getByRole("radio", { name: /After confession/ }).click();
  await expect(page.getByText(/keep any counsel your priest gave/)).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Show rule" }).click();
  await expect(page.getByRole("button", { name: /After confession · Change version/ })).toBeVisible();
});
