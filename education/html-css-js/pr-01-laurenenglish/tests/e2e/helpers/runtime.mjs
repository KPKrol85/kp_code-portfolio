import { expect } from "@playwright/test";

import { INDEXABLE_PAGES } from "../../../scripts/site-config.mjs";

export const PRIMARY_PAGES = Object.freeze(
  INDEXABLE_PAGES.map((page) => ({
    path: page.runtimePath,
    name: page.title,
  })),
);

const isLocalUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "127.0.0.1" && parsed.port === "4173";
  } catch {
    return false;
  }
};

export const collectRuntimeDiagnostics = (page) => {
  const diagnostics = {
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
    httpErrors: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    diagnostics.pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    if (isLocalUrl(request.url())) {
      diagnostics.requestFailures.push(
        `${request.failure()?.errorText ?? "unknown"} ${request.url()}`,
      );
    }
  });
  page.on("response", (response) => {
    if (isLocalUrl(response.url()) && response.status() >= 400) {
      diagnostics.httpErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return diagnostics;
};

export const expectCleanDiagnostics = (diagnostics) => {
  const entries = Object.entries(diagnostics).flatMap(([type, messages]) =>
    messages.map((message) => `${type}: ${message}`),
  );
  expect(entries, entries.join("\n")).toEqual([]);
};

export const clearRuntimeState = async (page) => {
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    if ("caches" in window) {
      await Promise.all(
        (await caches.keys()).map((name) => caches.delete(name)),
      );
    }
    if ("serviceWorker" in navigator) {
      await Promise.all(
        (await navigator.serviceWorker.getRegistrations()).map((registration) =>
          registration.unregister(),
        ),
      );
    }
  });
};

export const getVisibleThemeToggle = async (page) => {
  const mobileNavigationToggle = page.getByRole("button", {
    name: "Otwórz menu",
  });
  if (await mobileNavigationToggle.isVisible()) {
    await mobileNavigationToggle.click();
    const mobileThemeToggle = page.locator(".nav__theme");
    await expect(mobileThemeToggle).toBeVisible();
    return mobileThemeToggle;
  }
  const desktopThemeToggle = page.locator(
    ".header__actions [data-theme-toggle]",
  );
  await expect(desktopThemeToggle).toBeVisible();
  return desktopThemeToggle;
};

export const expectThemeControls = async (page, pressed) => {
  const controls = page.locator("[data-theme-toggle]");
  await expect(controls).toHaveCount(2);
  expect(
    await controls.evaluateAll(
      (elements, expected) =>
        elements.every(
          (element) => element.getAttribute("aria-pressed") === expected,
        ),
      String(pressed),
    ),
  ).toBe(true);
};

export const expectNoDocumentOverflow = async (page) => {
  const metrics = await page.evaluate(async () => {
    const startX = scrollX;
    const startY = scrollY;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
    );
    const overflowElements = [...document.querySelectorAll("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          className:
            typeof element.className === "string" ? element.className : "",
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          tagName: element.tagName,
        };
      })
      .filter(
        ({ left, right }) =>
          left < -0.5 || right > document.documentElement.clientWidth + 0.5,
      )
      .slice(0, 12);
    scrollTo({ left: documentWidth, top: startY, behavior: "instant" });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const reachableX = scrollX;
    scrollTo({ left: startX, top: startY, behavior: "instant" });
    return {
      documentWidth,
      overflowElements,
      reachableX,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
  expect(metrics.documentWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(
    metrics.viewportWidth,
  );
  expect(metrics.reachableX, JSON.stringify(metrics)).toBeLessThanOrEqual(0.5);
};

export const expectFocusDoesNotMoveViewport = async (page) => {
  const shifted = await page.evaluate(async () => {
    const selectors =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const candidates = [...document.querySelectorAll(selectors)].filter(
      (element) =>
        element instanceof HTMLElement &&
        element.offsetParent !== null &&
        !element.closest("[inert]"),
    );
    const results = [];
    for (const element of candidates) {
      scrollTo({ left: 0, top: scrollY, behavior: "instant" });
      element.focus({ preventScroll: false });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (Math.abs(scrollX) > 0.5) {
        results.push({
          label:
            element.getAttribute("aria-label") ||
            element.textContent?.trim().slice(0, 60) ||
            element.tagName,
          scrollX,
        });
      }
    }
    scrollTo({ left: 0, top: 0, behavior: "instant" });
    return results;
  });
  expect(shifted).toEqual([]);
};

export const expectElementsContained = async (locator) => {
  const boxes = await locator.evaluateAll((elements) =>
    elements
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          viewportWidth: document.documentElement.clientWidth,
        };
      }),
  );

  for (const box of boxes) {
    expect(box.width).toBeGreaterThan(0);
    expect(box.left).toBeGreaterThanOrEqual(-0.5);
    expect(box.right).toBeLessThanOrEqual(box.viewportWidth + 0.5);
  }
};
