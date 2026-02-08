import { expect, test } from "@playwright/test";

test.describe("Active Life smoke tests", () => {
  test("mobile menu modal opens, traps focus, closes and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.locator("[data-nav-toggle]");
    const modal = page.locator("[data-mobile-nav]");
    const closeButton = page.locator("[data-nav-close]");

    await toggle.focus();
    await toggle.click();

    await expect(modal).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(page.locator("[data-mobile-nav] a[href]").last()).toBeFocused();

    await closeButton.click();

    await expect(modal).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("schedule filters update results count", async ({ page }) => {
    await page.goto("/");

    const count = page.locator("#schedule-results-count");
    const yogaFilter = page.locator(".schedule__filters button[data-filter='yoga']");
    const allFilter = page.locator(".schedule__filters button[data-filter='all']");

    await expect(count).toHaveText(/Wyniki:\s*6/);

    await yogaFilter.click();
    await expect(count).toHaveText(/Wyniki:\s*2/);
    await expect(page.locator(".schedule-card:not([hidden])")).toHaveCount(2);

    await allFilter.click();
    await expect(count).toHaveText(/Wyniki:\s*6/);
  });

  test("offline/network-fail fallback keeps a readable page after initial visit", async ({
    context,
    page
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/ActiveLife/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
