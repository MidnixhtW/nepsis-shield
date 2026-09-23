import { expect, test } from "@playwright/test";

test("production deployment renders the application", async ({ page }) => {
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.url()}: ${request.failure()?.errorText ?? "request failed"}`);
  });

  await page.goto("https://ortho-companion.vercel.app/", { waitUntil: "load" });

  await expect(pageErrors, pageErrors.join("\n")).toEqual([]);
  await expect(
    page.locator("#root"),
    `The production root stayed empty. Failed requests:\n${failedRequests.join("\n")}`,
  ).not.toBeEmpty();
  await expect(page.locator("#main-content")).toBeVisible();
});
