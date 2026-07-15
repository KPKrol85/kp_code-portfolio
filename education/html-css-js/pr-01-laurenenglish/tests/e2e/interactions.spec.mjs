import { expect, test } from "@playwright/test";

import {
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
} from "./helpers/runtime.mjs";

const homepageAnchorCases = Object.freeze([
  {
    destination: "/index.html#how",
    id: "how",
    sourcePath: "/uslugi.html",
    sourceSelector: '.nav__link[href="/index.html#how"]',
  },
  {
    destination: "/index.html#about",
    id: "about",
    sourcePath: "/uslugi.html",
    sourceSelector: '.nav__link[href="/index.html#about"]',
  },
  {
    destination: "/index.html#faq",
    id: "faq",
    sourcePath: "/index.html",
    sourceSelector: '.nav__link[href="/index.html#faq"]',
  },
  {
    destination: "/index.html#contact",
    id: "contact",
    sourcePath: "/uslugi.html",
    sourceSelector: '.hero__actions a[href="index.html#contact"]',
  },
]);

const expectAnchorToClearHeader = async (page, id) => {
  const geometry = await page.evaluate((targetId) => {
    const header = document.querySelector(".header");
    const target = document.getElementById(targetId);
    const heading = target?.querySelector(
      ".section__title, .card__title, h1, h2, h3",
    );
    if (!header || !target || !heading) return null;

    return {
      headerBottom: header.getBoundingClientRect().bottom,
      headerHeight: header.getBoundingClientRect().height,
      headingTop: heading.getBoundingClientRect().top,
      scrollMarginTop: Number.parseFloat(
        getComputedStyle(target).scrollMarginTop,
      ),
    };
  }, id);

  expect(geometry, `Missing geometry for #${id}`).not.toBeNull();
  expect(
    geometry.scrollMarginTop,
    `#${id} needs clearance beyond the sticky-header height`,
  ).toBeGreaterThan(geometry.headerHeight);
  expect(
    geometry.headingTop,
    `#${id} heading must clear the sticky header`,
  ).toBeGreaterThan(geometry.headerBottom);
};

test("desktop navigation exposes its links and theme action", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop");
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto("/index.html", { waitUntil: "networkidle" });

  const navigation = page.getByRole("navigation", {
    name: "Główna nawigacja",
  });
  await expect(navigation.getByRole("link", { name: "Usługi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Otwórz menu" })).toBeHidden();
  await expect(page.locator("[data-theme-toggle]:visible")).toHaveCount(1);
  expectCleanDiagnostics(diagnostics);
});

test("project anchor targets clear the sticky header", async ({ page }) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const {
    destination,
    id,
    sourcePath,
    sourceSelector,
  } of homepageAnchorCases) {
    await page.goto(sourcePath, { waitUntil: "networkidle" });
    const mobileToggle = page.locator(".nav__toggle");

    if (
      sourceSelector.includes("nav__link") &&
      (await mobileToggle.isVisible())
    ) {
      await mobileToggle.click();
    }

    await page.locator(sourceSelector).click();
    await expect
      .poll(() => {
        const url = new URL(page.url());
        return `${url.pathname}${url.hash}`;
      })
      .toBe(destination);
    await page.waitForLoadState("networkidle");
    await expectAnchorToClearHeader(page, id);
  }

  await page.goto("/index.html", { waitUntil: "networkidle" });
  await page.locator('.hero__actions a[href="/pakiety.html#pakiety"]').click();
  await expect(page).toHaveURL(/\/pakiety\.html#pakiety$/);
  await page.waitForLoadState("networkidle");
  await expectAnchorToClearHeader(page, "pakiety");

  await page.goto("/kontakt.html#formularz", { waitUntil: "networkidle" });
  await expectAnchorToClearHeader(page, "formularz");

  await page.goto("/index.html", { waitUntil: "networkidle" });
  await page.locator('.hero__actions a[href="#resources"]').click();
  await expect(page).toHaveURL(/\/index\.html#resources$/);
  await expectAnchorToClearHeader(page, "resources");

  expectCleanDiagnostics(diagnostics);
});

test("mobile drawer is inert when closed and contains keyboard focus when open", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-mobile");
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto("/index.html", { waitUntil: "networkidle" });

  const navigation = page.getByRole("navigation", {
    name: "Główna nawigacja",
  });
  const drawer = page.locator("[data-drawer]");
  const firstLink = drawer.locator('a[href="/uslugi.html"]');
  const toggle = page.locator(".nav__toggle");

  await expect(toggle).toHaveAccessibleName("Otwórz menu");
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  expect(await drawer.evaluate((element) => element.inert)).toBe(true);
  await expect(page.locator("[data-drawer-close]")).toHaveCount(0);
  await firstLink.evaluate((element) => element.focus());
  await expect(firstLink).not.toBeFocused();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(drawer).toHaveAttribute("aria-hidden", "false");
  expect(await drawer.evaluate((element) => element.inert)).toBe(false);

  const drawerCta = drawer.getByRole("link", { name: "Informacje o zapisach" });
  await expect(firstLink).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(drawerCta).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(firstLink).toBeFocused();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  await expect(toggle).toBeFocused();

  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Zamknij menu");

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  await expect(toggle).toBeFocused();

  await toggle.click();
  await drawerCta.click();
  await expect(page).toHaveURL(/\/index\.html#contact$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
  expectCleanDiagnostics(diagnostics);
});

test("accordion synchronizes expanded and hidden state", async ({ page }) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto("/index.html", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", {
    name: "Jak wygląda pierwsza lekcja?",
  });
  const panelId = await trigger.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  expectCleanDiagnostics(diagnostics);
});

test("resource tabs preserve manual keyboard activation", async ({ page }) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto("/index.html", { waitUntil: "networkidle" });

  const allTab = page.getByRole("tab", { name: "Wszystko" });
  const grammarTab = page.getByRole("tab", { name: "Gramatyka" });
  await expect(allTab).toHaveAttribute("aria-selected", "true");

  await allTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(grammarTab).toBeFocused();
  await expect(grammarTab).toHaveAttribute("aria-selected", "false");
  await page.keyboard.press("Enter");
  await expect(grammarTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: "Gramatyka" })).toBeVisible();
  await expect(page.getByRole("tabpanel", { name: "Wszystko" })).toBeHidden();
  expectCleanDiagnostics(diagnostics);
});
