import { expect, test } from "@playwright/test";

import {
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
  expectNoDocumentOverflow,
} from "./helpers/runtime.mjs";

const VIEWPORTS = Object.freeze([
  { name: "mobile", width: 390, height: 844, columns: 1 },
  { name: "tablet", width: 768, height: 1024, columns: 1 },
  { name: "desktop", width: 1440, height: 900, columns: 2 },
]);

test("O Lauren portrait remains proportioned and aligned responsively", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop");
  const diagnostics = collectRuntimeDiagnostics(page);

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/index.html", { waitUntil: "networkidle" });

    const section = page.locator("#about");
    const image = section.locator(
      '.about__visual > img[src="assets/img/about/lauren.jpg"]',
    );
    await section.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await image.evaluate((element) => element.decode());

    const metrics = await section.evaluate((aboutSection) => {
      const grid = aboutSection.querySelector(".about__grid");
      const visual = aboutSection.querySelector(".about__visual");
      const portrait = visual?.querySelector("img");
      const card = visual?.querySelector(".about__card");
      if (!grid || !visual || !portrait || !card) return null;

      const gridStyle = getComputedStyle(grid);
      const visualStyle = getComputedStyle(visual);
      const imageStyle = getComputedStyle(portrait);
      const rootStyle = getComputedStyle(document.documentElement);
      const visualBox = visual.getBoundingClientRect();
      const imageBox = portrait.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();

      return {
        borderRadius: imageStyle.borderRadius,
        cardTop: cardBox.top,
        cardWidth: cardBox.width,
        columnCount: gridStyle.gridTemplateColumns.split(/\s+/u).length,
        display: imageStyle.display,
        imageBottom: imageBox.bottom,
        imageHeight: imageBox.height,
        imageLeft: imageBox.left,
        imageRight: imageBox.right,
        imageWidth: imageBox.width,
        intrinsicHeight: portrait.naturalHeight,
        intrinsicWidth: portrait.naturalWidth,
        objectFit: imageStyle.objectFit,
        objectPosition: imageStyle.objectPosition,
        radiusToken: rootStyle.getPropertyValue("--radius-lg").trim(),
        rowGap: Number.parseFloat(visualStyle.rowGap),
        sourceHeight: portrait.getAttribute("height"),
        sourceWidth: portrait.getAttribute("width"),
        viewportWidth: document.documentElement.clientWidth,
        visualWidth: visualBox.width,
      };
    });

    expect(metrics, viewport.name).not.toBeNull();
    expect(metrics.columnCount, viewport.name).toBe(viewport.columns);
    expect(metrics.display).toBe("block");
    expect(metrics.borderRadius).toBe(metrics.radiusToken);
    expect(metrics.objectFit).toBe("contain");
    expect(metrics.objectPosition).toBe("50% 50%");
    expect(metrics.intrinsicWidth).toBe(420);
    expect(metrics.intrinsicHeight).toBe(480);
    expect(metrics.sourceWidth).toBe("420");
    expect(metrics.sourceHeight).toBe("480");
    expect(metrics.imageWidth).toBeLessThanOrEqual(420.5);
    expect(metrics.imageWidth).toBeGreaterThan(0);
    expect(metrics.imageWidth / metrics.imageHeight).toBeCloseTo(420 / 480, 2);
    expect(
      Math.abs(metrics.imageWidth - metrics.visualWidth),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(metrics.cardWidth - metrics.visualWidth),
    ).toBeLessThanOrEqual(1);
    expect(metrics.cardTop - metrics.imageBottom).toBeCloseTo(
      metrics.rowGap,
      1,
    );
    expect(metrics.imageLeft).toBeGreaterThanOrEqual(-0.5);
    expect(metrics.imageRight).toBeLessThanOrEqual(metrics.viewportWidth + 0.5);
    await expectNoDocumentOverflow(page);
  }

  expectCleanDiagnostics(diagnostics);
});
