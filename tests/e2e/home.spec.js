import { test, expect } from "@playwright/test";

test("home page renders wanderwall hero", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Wander through events/i,
    }),
  ).toBeVisible();
});
