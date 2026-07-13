import { expect, test } from "@playwright/test";

import {
  clearRuntimeState,
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
  expectThemeControls,
  getVisibleThemeToggle,
} from "./helpers/runtime.mjs";

test("isolated context starts with light theme and no stale browser state", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await clearRuntimeState(page);
  await page.reload({ waitUntil: "networkidle" });

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeControls(page, false);
  const state = await page.evaluate(async () => ({
    theme: localStorage.getItem("theme"),
    sessionKeys: sessionStorage.length,
    cacheNames: "caches" in window ? await caches.keys() : [],
    registrations:
      "serviceWorker" in navigator
        ? (await navigator.serviceWorker.getRegistrations()).length
        : 0,
  }));
  expect(state).toEqual({
    theme: null,
    sessionKeys: 0,
    cacheNames: [],
    registrations: 0,
  });
  expectCleanDiagnostics(diagnostics);
});

test("theme controls synchronize and persisted theme restores", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await clearRuntimeState(page);
  await page.reload({ waitUntil: "networkidle" });

  let visibleToggle = await getVisibleThemeToggle(page);
  await visibleToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectThemeControls(page, true);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectThemeControls(page, true);

  visibleToggle = await getVisibleThemeToggle(page);
  await visibleToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeControls(page, false);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
    "light",
  );
  expectCleanDiagnostics(diagnostics);
});
