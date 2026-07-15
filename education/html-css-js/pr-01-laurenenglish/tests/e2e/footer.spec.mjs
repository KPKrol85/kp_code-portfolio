import { expect, test } from "@playwright/test";

import {
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
  expectNoDocumentOverflow,
} from "./helpers/runtime.mjs";

const LEGAL_PATHS = Object.freeze([
  "/polityka-prywatnosci.html",
  "/regulamin.html",
  "/cookies.html",
]);

const SOCIAL_LINKS = Object.freeze([
  { label: "GitHub", href: "https://github.com/KPKrol85" },
  { label: "Facebook", href: "https://www.facebook.com/kpkrol85" },
  { label: "X", href: "https://x.com/KP_Code_85" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kp-code/" },
  { label: "Instagram", href: "https://www.instagram.com/kp_code_/" },
]);

const VIEWPORTS = Object.freeze([
  { name: "mobile", width: 390, height: 844, columns: 1 },
  { name: "tablet", width: 800, height: 900, columns: 2 },
  { name: "desktop", width: 1440, height: 900, columns: 4 },
]);

const getFooterContrastRatios = (page) =>
  page.evaluate(() => {
    const parseRgb = (value) =>
      value
        .match(/[\d.]+/gu)
        .slice(0, 3)
        .map(Number);
    const luminance = (value) => {
      const channels = parseRgb(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const contrast = (foreground, background) => {
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return (
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
      );
    };
    const samples = [
      [".footer__title", ".footer"],
      [".footer__list a", ".footer"],
      [".footer__social-link", ".footer"],
      [".footer__bottom p", ".footer__bottom"],
    ];

    return samples.map(([textSelector, backgroundSelector]) => {
      const text = document.querySelector(textSelector);
      const background = document.querySelector(backgroundSelector);
      if (!text || !background) return 0;
      return contrast(
        getComputedStyle(text).color,
        getComputedStyle(background).backgroundColor,
      );
    });
  });

test("shared footer exposes the approved responsive, legal, and social contract", async ({
  page,
  request,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);

  for (const path of LEGAL_PATHS) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/index.html", { waitUntil: "networkidle" });

    const footer = page.locator(".footer");
    await expect(footer.locator(".footer__column")).toHaveCount(4);
    await expect(footer.locator('a[href="tel:+48533537091"]')).toHaveText(
      "+48 533 537 091",
    );
    await expect(
      footer.locator('a[href="mailto:kontakt@kp-code.pl"]'),
    ).toHaveText("kontakt@kp-code.pl");
    await expect(footer.locator("address")).toHaveText(
      "ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Polska",
    );

    for (const path of LEGAL_PATHS) {
      await expect(footer.locator(`a[href="${path}"]`)).toHaveCount(1);
    }

    const socialLinks = await footer
      .locator(".footer__social-link")
      .evaluateAll((links) =>
        links.map((link) => ({
          ariaLabel: link.getAttribute("aria-label"),
          href: link.getAttribute("href"),
          rel: link.getAttribute("rel"),
          target: link.getAttribute("target"),
          text: link.textContent.trim(),
        })),
      );
    expect(socialLinks).toEqual(
      SOCIAL_LINKS.map(({ label, href }) => ({
        ariaLabel: `${label} – KP_Code Digital Studio (otwiera się w nowej karcie)`,
        href,
        rel: "noopener noreferrer",
        target: "_blank",
        text: label,
      })),
    );

    await expect(footer.locator(".footer__bottom p")).toHaveText(
      "© 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.",
    );
    const columnCount = await footer
      .locator(".footer__grid")
      .evaluate(
        (grid) =>
          getComputedStyle(grid).gridTemplateColumns.split(/\s+/u).length,
      );
    expect(columnCount, viewport.name).toBe(viewport.columns);

    for (const theme of ["light", "dark"]) {
      await page.locator("html").evaluate((element, nextTheme) => {
        element.dataset.theme = nextTheme;
      }, theme);
      const contrastRatios = await getFooterContrastRatios(page);
      expect(
        Math.min(...contrastRatios),
        `${viewport.name} ${theme} footer contrast`,
      ).toBeGreaterThanOrEqual(4.5);
    }

    await expectNoDocumentOverflow(page);
  }

  expectCleanDiagnostics(diagnostics);
});
