import { expect, test } from "@playwright/test";

import { PROJECT_DISCLOSURE } from "../../scripts/site-config.mjs";
import {
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
} from "./helpers/runtime.mjs";

const EMPTY_STORAGE_STATE = { cookies: [], origins: [] };

test.describe("project disclosure modal", () => {
  test.use({ storageState: EMPTY_STORAGE_STATE });

  test("opens once on eligible pages with an accessible, non-dismissible modal", async ({
    page,
  }) => {
    const diagnostics = collectRuntimeDiagnostics(page);
    await page.goto("/index.html", { waitUntil: "networkidle" });

    const dialog = page.getByRole("dialog", {
      name: "Informacja o projekcie",
    });
    const dismissButton = dialog.getByRole("button", {
      name: "Przejdź do strony",
    });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute(
      "aria-describedby",
      "project-disclosure-description project-disclosure-context",
    );
    await expect(dialog).toContainText(
      "Serwis Lauren English został przygotowany przez KP_Code Digital Studio jako projekt koncepcyjny prezentujący profesjonalną stronę internetową dla nauczycielki języka angielskiego.",
    );
    await expect(dialog).toContainText(
      "Strona nie jest obecnie aktywną ofertą handlową ani systemem sprzedaży usług i materiałów.",
    );

    for (const [name, href] of [
      ["REGULAMIN", "/regulamin.html"],
      ["POLITYKA PRYWATNOŚCI", "/polityka-prywatnosci.html"],
      ["COOKIES", "/cookies.html"],
    ]) {
      await expect(dialog.getByRole("link", { name })).toHaveAttribute(
        "href",
        href,
      );
    }

    const initialState = await dialog.evaluate((element) => ({
      activeElementIsInside: element.contains(document.activeElement),
      rootIsLocked: document.documentElement.classList.contains(
        "has-project-disclosure",
      ),
      rootOverflow: getComputedStyle(document.documentElement).overflow,
    }));
    expect(initialState).toEqual({
      activeElementIsInside: true,
      rootIsLocked: true,
      rootOverflow: "hidden",
    });

    const backgroundFocusWasPrevented = await page
      .locator(".header__logo")
      .evaluate((element) => {
        element.focus();
        return element !== document.activeElement;
      });
    expect(backgroundFocusWasPrevented).toBe(true);

    const initialScrollPosition = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBe(initialScrollPosition);

    await dismissButton.focus();
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();

    const viewport = page.viewportSize();
    await page.mouse.click(4, (viewport?.height ?? 844) - 4);
    await expect(dialog).toBeVisible();

    const themeColors = [];
    for (const theme of ["light", "dark"]) {
      await page.locator("html").evaluate((root, nextTheme) => {
        root.dataset.theme = nextTheme;
      }, theme);
      themeColors.push(
        await dialog.evaluate((element) => {
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, color: style.color };
        }),
      );
    }
    expect(themeColors[0]).not.toEqual(themeColors[1]);

    const geometry = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        left: rect.left,
        right: rect.right,
        viewportWidth: document.documentElement.clientWidth,
      };
    });
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.left).toBeGreaterThanOrEqual(-0.5);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

    await dismissButton.click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("html")).not.toHaveClass(
      /has-project-disclosure/,
    );
    expect(
      await page.evaluate(
        (storageKey) => localStorage.getItem(storageKey),
        PROJECT_DISCLOSURE.storageKey,
      ),
    ).toBe(PROJECT_DISCLOSURE.version);

    await page.reload({ waitUntil: "networkidle" });
    await expect(dialog).toBeHidden();
    expectCleanDiagnostics(diagnostics);
  });

  test("reopens when the stored dismissal has an earlier version", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ storageKey }) => {
        localStorage.setItem(storageKey, "previous-version");
      },
      { storageKey: PROJECT_DISCLOSURE.storageKey },
    );
    await page.goto("/pakiety.html", { waitUntil: "networkidle" });
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("opening a legal document does not store dismissal", async ({
    page,
  }) => {
    await page.goto("/index.html");

    const dialog = page.getByRole("dialog", {
      name: "Informacja o projekcie",
    });
    await dialog.getByRole("link", { name: "REGULAMIN" }).click();

    await expect(page).toHaveURL(/\/regulamin\.html$/u);
    await expect(page.getByRole("main")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) => localStorage.getItem(storageKey),
          PROJECT_DISCLOSURE.storageKey,
        ),
      )
      .toBeNull();
  });

  test("remains dismissible when Web Storage is blocked", async ({ page }) => {
    const diagnostics = collectRuntimeDiagnostics(page);
    await page.addInitScript(() => {
      const blocked = () => {
        throw new DOMException("Storage blocked", "SecurityError");
      };
      Object.defineProperty(Storage.prototype, "getItem", {
        configurable: true,
        value: blocked,
      });
      Object.defineProperty(Storage.prototype, "setItem", {
        configurable: true,
        value: blocked,
      });
    });
    await page.goto("/index.html", { waitUntil: "networkidle" });

    const dialog = page.getByRole("dialog", {
      name: "Informacja o projekcie",
    });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Przejdź do strony" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("main")).toBeVisible();
    expectCleanDiagnostics(diagnostics);
  });

  test("does not auto-open on legal or utility pages", async ({ page }) => {
    for (const path of [
      "/regulamin.html",
      "/polityka-prywatnosci.html",
      "/cookies.html",
      "/404.html",
      "/offline.html",
      "/thank-you.html",
    ]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const dialog = page.locator("[data-project-disclosure]");
      if (await dialog.count()) {
        await expect(dialog).toBeHidden();
      }
      await expect(page.getByRole("main")).toBeVisible();
    }
  });
});
