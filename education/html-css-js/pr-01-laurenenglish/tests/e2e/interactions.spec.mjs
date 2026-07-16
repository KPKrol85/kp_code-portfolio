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
    sourcePath: "/uslugi.html",
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

const expectCompactHomepageAnchorFocus = async (page, id) => {
  const target = page.locator(`#${id}`);
  const heading = target.locator(".section__title").first();

  await expect
    .poll(() =>
      heading.evaluate((element) => document.activeElement === element),
    )
    .toBe(true);
  await expect(heading).toHaveAttribute("tabindex", "-1");
  await expect(heading).toHaveAttribute("data-anchor-focus-target", "");
  await expect(target).not.toHaveAttribute("tabindex", "-1");

  const focusState = await heading.evaluate((element) => {
    const targetSection = element.closest("section");
    const headingStyle = getComputedStyle(element);

    return {
      focusVisible: element.matches(":focus-visible"),
      headingWidth: element.getBoundingClientRect().width,
      outlineStyle: headingStyle.outlineStyle,
      outlineWidth: Number.parseFloat(headingStyle.outlineWidth),
      targetWidth: targetSection?.getBoundingClientRect().width ?? 0,
    };
  });

  expect(focusState.focusVisible).toBe(true);
  expect(focusState.outlineStyle).not.toBe("none");
  expect(focusState.outlineWidth).toBeGreaterThan(0);
  expect(focusState.headingWidth).toBeLessThan(focusState.targetWidth);
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

test("package navigation opens the hero while package CTAs target the cards", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop");
  const diagnostics = collectRuntimeDiagnostics(page);
  const packageHeading = page.getByRole("heading", {
    level: 1,
    name: "Wybierz plan pracy, który daje spokój.",
  });

  await page.goto("/index.html", { waitUntil: "networkidle" });
  const packageNavigationLink = page
    .getByRole("navigation", { name: "Główna nawigacja" })
    .getByRole("link", { name: "Pakiety", exact: true });
  await expect(packageNavigationLink).toHaveAttribute("href", "/pakiety.html");
  await packageNavigationLink.click();
  await expect(page).toHaveURL(/\/pakiety\.html$/);
  await expect(packageHeading).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.goto("/index.html", { waitUntil: "networkidle" });
  const packageCta = page.locator(
    '.hero__actions a[href="/pakiety.html#pakiety"]',
  );
  await expect(packageCta).toHaveText("Zobacz pakiety");
  await packageCta.click();
  await expect(page).toHaveURL(/\/pakiety\.html#pakiety$/);
  await page.waitForLoadState("networkidle");
  await expectAnchorToClearHeader(page, "pakiety");

  await page
    .getByRole("navigation", { name: "Główna nawigacja" })
    .getByRole("link", { name: "Pakiety", exact: true })
    .click();
  await expect(page).toHaveURL(/\/pakiety\.html$/);
  await expect(packageHeading).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
    await expectCompactHomepageAnchorFocus(page, id);
  }

  await page.goto("/uslugi.html", { waitUntil: "networkidle" });
  const mobileToggle = page.locator(".nav__toggle");
  if (await mobileToggle.isVisible()) await mobileToggle.click();
  const aboutLink = page.locator('.nav__link[href="/index.html#about"]');
  await aboutLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/index\.html#about$/);
  await page.waitForLoadState("networkidle");
  await expectCompactHomepageAnchorFocus(page, "about");

  await page.goto("/uslugi.html", { waitUntil: "networkidle" });
  await page.goto("/index.html#faq", { waitUntil: "networkidle" });
  await expectCompactHomepageAnchorFocus(page, "faq");
  const lightOutlineColor = await page
    .locator("#faq .section__title")
    .evaluate((element) => getComputedStyle(element).outlineColor);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
  });
  await expectCompactHomepageAnchorFocus(page, "faq");
  const darkOutlineColor = await page
    .locator("#faq .section__title")
    .evaluate((element) => getComputedStyle(element).outlineColor);
  expect(darkOutlineColor).not.toBe(lightOutlineColor);

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

test("accordion preserves state and interactive corner geometry", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto("/index.html", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", {
    name: "Jak wygląda pierwsza lekcja?",
  });
  const panelId = await trigger.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);

  const readGeometry = () =>
    trigger.evaluate((element) => {
      const item = element.closest(".accordion__item");
      if (!item) return null;

      const itemRect = item.getBoundingClientRect();
      const triggerRect = element.getBoundingClientRect();
      const itemStyle = getComputedStyle(item);
      const triggerStyle = getComputedStyle(element);

      return {
        focusVisible: element.matches(":focus-visible"),
        hoverBackground: triggerStyle.backgroundColor,
        itemRadii: [
          itemStyle.borderTopLeftRadius,
          itemStyle.borderTopRightRadius,
          itemStyle.borderBottomRightRadius,
          itemStyle.borderBottomLeftRadius,
        ],
        outlineStyle: triggerStyle.outlineStyle,
        outlineWidth: Number.parseFloat(triggerStyle.outlineWidth),
        triggerInsideItem:
          triggerRect.left >= itemRect.left &&
          triggerRect.right <= itemRect.right,
        triggerRadii: [
          triggerStyle.borderTopLeftRadius,
          triggerStyle.borderTopRightRadius,
          triggerStyle.borderBottomRightRadius,
          triggerStyle.borderBottomLeftRadius,
        ],
      };
    });

  for (const theme of ["light", "dark"]) {
    await page.locator("html").evaluate((element, nextTheme) => {
      element.dataset.theme = nextTheme;
    }, theme);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await trigger.hover();

    const closedGeometry = await readGeometry();
    expect(closedGeometry).not.toBeNull();
    expect(closedGeometry.triggerInsideItem).toBe(true);
    expect(closedGeometry.triggerRadii).toEqual(closedGeometry.itemRadii);
    expect(closedGeometry.hoverBackground).not.toBe("rgba(0, 0, 0, 0)");

    await trigger.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");

    const closedFocus = await readGeometry();
    expect(closedFocus.focusVisible).toBe(true);
    expect(closedFocus.outlineStyle).not.toBe("none");
    expect(closedFocus.outlineWidth).toBeGreaterThan(0);

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await trigger.hover();

    const openGeometry = await readGeometry();
    expect(openGeometry).not.toBeNull();
    expect(openGeometry.triggerInsideItem).toBe(true);
    expect(openGeometry.triggerRadii).toEqual([
      openGeometry.itemRadii[0],
      openGeometry.itemRadii[1],
      "0px",
      "0px",
    ]);
    expect(openGeometry.itemRadii[2]).not.toBe("0px");
    expect(openGeometry.itemRadii[3]).not.toBe("0px");
    expect(openGeometry.hoverBackground).not.toBe("rgba(0, 0, 0, 0)");

    await trigger.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");

    const openFocus = await readGeometry();
    expect(openFocus.focusVisible).toBe(true);
    expect(openFocus.outlineStyle).not.toBe("none");
    expect(openFocus.outlineWidth).toBeGreaterThan(0);

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }

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
