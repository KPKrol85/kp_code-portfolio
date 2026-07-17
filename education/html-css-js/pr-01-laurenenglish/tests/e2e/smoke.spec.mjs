import { expect, test } from "@playwright/test";

import {
  FONT_PATHS,
  RUNTIME_CSS_PATHS,
  RUNTIME_JAVASCRIPT_PATHS,
} from "../../scripts/pwa-config.mjs";
import { SITE } from "../../scripts/site-config.mjs";
import {
  PRIMARY_PAGES,
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
} from "./helpers/runtime.mjs";

test.describe("generated production pages", () => {
  test("homepage and shared shell expose the approved Lauren English identity", async ({
    page,
  }) => {
    const diagnostics = collectRuntimeDiagnostics(page);
    await page.goto("/index.html", { waitUntil: "networkidle" });

    await expect(page.locator(".header__logo-text")).toHaveText(SITE.name);
    await expect(page.locator(".footer__brand-text")).toHaveText(SITE.name);
    await expect(page.locator(".hero__eyebrow")).toHaveText(
      "INDYWIDUALNE LEKCJE ANGIELSKIEGO",
    );
    await expect(page.locator(".hero__title")).toHaveText(
      "Lauren – English. Jasny plan nauki języka angielskiego.",
    );
    await expect(page.locator("body")).not.toContainText(/Clean English/u);
    expectCleanDiagnostics(diagnostics);
  });

  for (const publicPage of PRIMARY_PAGES) {
    test(`${publicPage.name} loads generated assets without runtime errors`, async ({
      page,
    }) => {
      const diagnostics = collectRuntimeDiagnostics(page);
      const assetStatuses = new Map();
      const assetContentTypes = new Map();

      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.hostname === "127.0.0.1" && url.port === "4173") {
          assetStatuses.set(url.pathname, response.status());
          assetContentTypes.set(
            url.pathname,
            response.headers()["content-type"] ?? "",
          );
        }
      });

      const response = await page.goto(publicPage.path, {
        waitUntil: "networkidle",
      });
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.locator(`img[src="${SITE.brandLogo.path}"]`),
      ).toHaveCount(2);
      await expect(page.locator(".header__logo-mark")).toHaveCount(0);

      await page.evaluate(() => document.fonts.ready.then(() => true));
      const fontResources = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((entry) => new URL(entry.name))
          .filter(({ pathname }) => /\.(?:woff2?|ttf|otf)$/i.test(pathname))
          .map(({ origin, pathname }) => ({ origin, pathname })),
      );

      for (const path of RUNTIME_CSS_PATHS) {
        expect(assetStatuses.get(path), path).toBe(200);
        expect(assetContentTypes.get(path), path).toContain("text/css");
      }
      for (const path of RUNTIME_JAVASCRIPT_PATHS) {
        expect(assetStatuses.get(path), path).toBe(200);
        expect(assetContentTypes.get(path), path).toMatch(/javascript/);
      }
      expect(assetStatuses.has("/assets/build/style.min.css")).toBe(false);
      expect(assetStatuses.has("/assets/build/main.min.js")).toBe(false);
      expect(assetStatuses.get(SITE.brandLogo.path)).toBe(200);
      expect(assetContentTypes.get(SITE.brandLogo.path)).toContain(
        "image/svg+xml",
      );
      expect(fontResources.map(({ pathname }) => pathname).sort()).toEqual(
        [...FONT_PATHS].sort(),
      );
      expect(new Set(fontResources.map(({ pathname }) => pathname)).size).toBe(
        FONT_PATHS.length,
      );
      for (const { origin, pathname } of fontResources) {
        expect(origin).toBe("http://127.0.0.1:4173");
        expect(assetStatuses.get(pathname)).toBe(200);
        expect(assetContentTypes.get(pathname)).toContain("font/woff2");
      }
      const runtimeResources = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((entry) => new URL(entry.name))
          .filter(
            ({ pathname }) =>
              pathname.startsWith("/css/") || pathname.startsWith("/js/"),
          )
          .map(({ origin, pathname }) => ({ origin, pathname })),
      );
      expect(runtimeResources.map(({ pathname }) => pathname).sort()).toEqual(
        [...RUNTIME_CSS_PATHS, ...RUNTIME_JAVASCRIPT_PATHS].sort(),
      );
      expect(
        runtimeResources.every(
          ({ origin }) => origin === "http://127.0.0.1:4173",
        ),
      ).toBe(true);
      expectCleanDiagnostics(diagnostics);
    });
  }
});
