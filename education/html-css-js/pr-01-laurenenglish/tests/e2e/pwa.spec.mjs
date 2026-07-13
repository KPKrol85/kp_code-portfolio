import { expect, test } from "@playwright/test";

import { createServiceWorkerBuild } from "../../scripts/build-service-worker.mjs";
import {
  BRAND_LOGO_PATH,
  CACHE_PREFIX,
  CRITICAL_ASSET_BUDGET,
  FONT_PATHS,
  HERO_IMAGE_PATH,
  MANIFEST_ICON_PATHS,
  MANIFEST_PATH,
  MANIFEST_SCREENSHOT_PATHS,
  OFFLINE_PATH,
  PRECACHE_PATHS,
  PRIMARY_DOCUMENT_PATHS,
  SHORTCUT_ICON_PATHS,
} from "../../scripts/pwa-config.mjs";
import {
  collectRuntimeDiagnostics,
  expectCleanDiagnostics,
  getVisibleThemeToggle,
} from "./helpers/runtime.mjs";

test.use({ serviceWorkers: "allow" });

const { cacheName: CURRENT_CACHE_NAME } = await createServiceWorkerBuild();
const OLD_PROJECT_CACHE = `${CACHE_PREFIX}0.9.0-obsolete`;
const UNRELATED_CACHE = "unrelated-application-sentinel";

const registerAndControl = async (page) => {
  const registrationState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      { scope: "/" },
    );
    const readyRegistration = await navigator.serviceWorker.ready;
    return {
      activeState: readyRegistration.active?.state ?? null,
      scope: registration.scope,
      scriptUrl: readyRegistration.active?.scriptURL ?? null,
    };
  });

  expect(registrationState).toEqual({
    activeState: expect.stringMatching(/^(?:activating|activated)$/),
    scope: "http://127.0.0.1:4173/",
    scriptUrl: "http://127.0.0.1:4173/service-worker.js",
  });

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration("/");
        return registration?.active?.state ?? null;
      }),
    )
    .toBe("activated");

  await page.goto("/index.html", { waitUntil: "networkidle" });
  if (
    !(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
  ) {
    await page.reload({ waitUntil: "networkidle" });
  }

  await expect
    .poll(() =>
      page.evaluate(() => ({
        controlled: Boolean(navigator.serviceWorker.controller),
        state: navigator.serviceWorker.controller?.state ?? null,
      })),
    )
    .toEqual({ controlled: true, state: "activated" });
};

const cleanPwaState = async (page, context) => {
  await context.setOffline(false).catch(() => {});
  if (page.isClosed()) return;
  await page
    .evaluate(async () => {
      await Promise.all(
        (await navigator.serviceWorker.getRegistrations()).map((registration) =>
          registration.unregister(),
        ),
      );
      await Promise.all(
        (await caches.keys()).map((cacheName) => caches.delete(cacheName)),
      );
    })
    .catch(() => {});
};

const getCurrentCachePaths = (page) =>
  page.evaluate(async (cacheName) => {
    const cache = await caches.open(cacheName);
    return (await cache.keys())
      .map((request) => new URL(request.url).pathname)
      .sort();
  }, CURRENT_CACHE_NAME);

const getImageResults = (page, assets) =>
  page.evaluate(async (imageAssets) => {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () =>
          resolve({
            height: image.naturalHeight,
            path: src,
            width: image.naturalWidth,
          }),
        );
        image.addEventListener("error", reject);
        image.src = src;
      });

    return Promise.all(
      imageAssets.map(async ({ src }) => {
        const response = await fetch(src);
        return {
          ...(await loadImage(src)),
          contentType: response.headers.get("Content-Type"),
          status: response.status,
        };
      }),
    );
  }, assets);

test.afterEach(async ({ page, context }) => {
  await cleanPwaState(page, context);
});

test("installs, controls the page, validates install metadata, and preserves unrelated caches", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  const manifestResponse = await page.goto(MANIFEST_PATH, {
    waitUntil: "domcontentloaded",
  });
  expect(manifestResponse?.status()).toBe(200);
  expect(await page.evaluate(() => window.isSecureContext)).toBe(true);

  await page.evaluate(
    async ([oldProjectCache, currentCache, unrelatedCache]) => {
      await Promise.all([
        caches.open(oldProjectCache),
        caches.open(currentCache),
        caches.open(unrelatedCache),
      ]);
    },
    [OLD_PROJECT_CACHE, CURRENT_CACHE_NAME, UNRELATED_CACHE],
  );

  await registerAndControl(page);

  const cacheNames = await page.evaluate(() => caches.keys());
  expect(cacheNames).toContain(CURRENT_CACHE_NAME);
  expect(cacheNames).not.toContain(OLD_PROJECT_CACHE);
  expect(cacheNames).toContain(UNRELATED_CACHE);
  expect(
    cacheNames.filter((cacheName) => cacheName.startsWith(CACHE_PREFIX)),
  ).toEqual([CURRENT_CACHE_NAME]);
  expect(await getCurrentCachePaths(page)).toEqual([...PRECACHE_PATHS].sort());

  const manifestResult = await page.evaluate(async (manifestPath) => {
    const response = await fetch(manifestPath);
    return {
      contentType: response.headers.get("Content-Type"),
      manifest: await response.json(),
      status: response.status,
    };
  }, MANIFEST_PATH);
  expect(manifestResult.status).toBe(200);
  expect(manifestResult.contentType).toContain("application/manifest+json");
  expect(manifestResult.manifest).toMatchObject({
    name: "Lauren – Clean English",
    short_name: "Clean English",
    id: "/",
    start_url: "/index.html",
    scope: "/",
    display: "standalone",
    lang: "pl",
  });
  expect(manifestResult.manifest.shortcuts).toHaveLength(3);
  expect(
    manifestResult.manifest.shortcuts.map(
      ({ name, short_name: shortName, url }) => ({ name, shortName, url }),
    ),
  ).toEqual([
    {
      name: "Pakiety nauki",
      shortName: "Pakiety",
      url: "/pakiety.html",
    },
    {
      name: "Materiały do nauki",
      shortName: "Materiały",
      url: "/materialy.html",
    },
    {
      name: "Dziennik postępów",
      shortName: "Postępy",
      url: "/postepy.html",
    },
  ]);
  expect(manifestResult.manifest.screenshots).toHaveLength(2);

  const shortcutStatuses = await page.evaluate(
    async (shortcuts) =>
      Promise.all(
        shortcuts.map(async ({ url }) => ({
          status: (await fetch(url)).status,
          url,
        })),
      ),
    manifestResult.manifest.shortcuts,
  );
  expect(shortcutStatuses).toEqual([
    { status: 200, url: "/pakiety.html" },
    { status: 200, url: "/materialy.html" },
    { status: 200, url: "/postepy.html" },
  ]);

  const manifestAssets = [
    ...manifestResult.manifest.icons,
    ...manifestResult.manifest.shortcuts.flatMap(({ icons }) => icons),
    ...manifestResult.manifest.screenshots,
  ];
  expect(manifestResult.manifest.icons.map(({ src }) => src)).toEqual([
    ...MANIFEST_ICON_PATHS,
  ]);
  expect(
    manifestResult.manifest.shortcuts.flatMap(({ icons }) =>
      icons.map(({ src }) => src),
    ),
  ).toEqual([...SHORTCUT_ICON_PATHS]);
  expect(manifestResult.manifest.screenshots.map(({ src }) => src)).toEqual([
    ...MANIFEST_SCREENSHOT_PATHS,
  ]);
  const imageResults = await getImageResults(page, manifestAssets);
  for (const asset of manifestAssets) {
    const [width, height] = asset.sizes.split("x").map(Number);
    expect(imageResults.find(({ path }) => path === asset.src)).toMatchObject({
      contentType: expect.stringContaining(asset.type),
      height,
      path: asset.src,
      status: 200,
      width,
    });
  }
  expectCleanDiagnostics(diagnostics);
});

test("keeps online routing real and never stores failed or partial responses", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto(MANIFEST_PATH, { waitUntil: "domcontentloaded" });
  await registerAndControl(page);

  for (const path of PRIMARY_DOCUMENT_PATHS) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
  }

  const unknownPath = "/pwa-online-unknown-route";
  const unknownResponse = await page.goto(unknownPath, {
    waitUntil: "domcontentloaded",
  });
  expect(unknownResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");

  const failedAssetPath = "/assets/pwa/shortcuts/not-a-real-icon.png";
  const failedAssetStatus = await page.evaluate(async (path) => {
    const response = await fetch(path);
    return response.status;
  }, failedAssetPath);
  expect(failedAssetStatus).toBe(404);

  const postStatus = await page.evaluate(async () => {
    const response = await fetch("/pwa-post-probe", { method: "POST" });
    return response.status;
  });
  expect(postStatus).toBeGreaterThanOrEqual(400);

  const partialPath = MANIFEST_ICON_PATHS[0];
  const partialResult = await page.evaluate(
    async ({ cacheName, path }) => {
      const cache = await caches.open(cacheName);
      await cache.delete(path);
      const partialResponse = await fetch(`${path}?range-probe=1`, {
        headers: { Range: "bytes=0-15" },
      });
      const cachedAfterPartial = Boolean(await cache.match(path));
      const validResponse = await fetch(`${path}?range-probe=2`);
      const cachedAfterValid = Boolean(await cache.match(path));
      return {
        cachedAfterPartial,
        cachedAfterValid,
        partialStatus: partialResponse.status,
        validStatus: validResponse.status,
      };
    },
    { cacheName: CURRENT_CACHE_NAME, path: partialPath },
  );
  expect(partialResult).toEqual({
    cachedAfterPartial: false,
    cachedAfterValid: true,
    partialStatus: 206,
    validStatus: 200,
  });

  const cacheProbe = await page.evaluate(
    async ({ cacheName, failedAssetPath, unknownPath }) => {
      const cache = await caches.open(cacheName);
      const beforeDataFetch = (await cache.keys()).length;
      await fetch("data:text/plain,pwa-unsupported-scheme");
      return {
        dataSchemeChangedCache: (await cache.keys()).length !== beforeDataFetch,
        failedAssetCached: Boolean(await cache.match(failedAssetPath)),
        unknownRouteCached: Boolean(await cache.match(unknownPath)),
      };
    },
    { cacheName: CURRENT_CACHE_NAME, failedAssetPath, unknownPath },
  );
  expect(cacheProbe).toEqual({
    dataSchemeChangedCache: false,
    failedAssetCached: false,
    unknownRouteCached: false,
  });
  expect(diagnostics.consoleErrors).toHaveLength(3);
  for (const message of diagnostics.consoleErrors) {
    expect(message).toBe(
      "Failed to load resource: the server responded with a status of 404 (Not Found)",
    );
  }
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.requestFailures).toEqual([]);
  expect(diagnostics.httpErrors).toEqual(
    expect.arrayContaining([
      expect.stringContaining(`404 http://127.0.0.1:4173${unknownPath}`),
      expect.stringContaining(`404 http://127.0.0.1:4173${failedAssetPath}`),
    ]),
  );
});

test("serves exact primary documents offline and uses offline.html for unknown navigation", async ({
  page,
  context,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto(MANIFEST_PATH, { waitUntil: "domcontentloaded" });
  await registerAndControl(page);
  await context.setOffline(true);

  for (const path of PRIMARY_DOCUMENT_PATHS) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
      "Jesteś offline",
    );
  }

  const fallbackResponse = await page.goto("/pwa-offline-unknown-route", {
    waitUntil: "domcontentloaded",
  });
  expect(fallbackResponse?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Jesteś offline",
  );
  expect(await page.locator('link[rel="canonical"]').count()).toBe(0);
  expect(await page.title()).toBe("Offline | Lauren – Clean English");

  await context.setOffline(false);
  expectCleanDiagnostics(diagnostics);
});

test("meets the critical request budget without duplicate or source asset requests", async ({
  page,
}) => {
  const diagnostics = collectRuntimeDiagnostics(page);
  await page.goto(MANIFEST_PATH, { waitUntil: "domcontentloaded" });
  await registerAndControl(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  const getCriticalResources = () =>
    page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => new URL(entry.name).pathname),
    );
  const resourcePaths = await getCriticalResources();
  const countPath = (path) =>
    resourcePaths.filter((resourcePath) => resourcePath === path).length;

  expect(countPath("/assets/build/style.min.css")).toBe(
    CRITICAL_ASSET_BUDGET.productionCssRequests,
  );
  expect(countPath("/assets/build/main.min.js")).toBe(
    CRITICAL_ASSET_BUDGET.productionJavaScriptRequests,
  );
  expect(countPath(HERO_IMAGE_PATH)).toBe(
    CRITICAL_ASSET_BUDGET.heroImageRequests,
  );
  expect(countPath(BRAND_LOGO_PATH)).toBe(
    CRITICAL_ASSET_BUDGET.brandLogoRequests,
  );
  const requestedFonts = resourcePaths
    .filter((path) => path.startsWith("/assets/fonts/"))
    .sort();
  expect(requestedFonts).toEqual([...FONT_PATHS].sort());
  expect(requestedFonts).toHaveLength(
    CRITICAL_ASSET_BUDGET.initialFontRequests,
  );
  expect(resourcePaths.some((path) => path.startsWith("/css/"))).toBe(false);
  expect(resourcePaths.some((path) => path.startsWith("/js/"))).toBe(false);

  const hero = page.locator(".hero__image");
  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  await expect(hero).toHaveAttribute("width", "1600");
  await expect(hero).toHaveAttribute("height", "1200");
  expect(
    await hero.evaluate((image) => ({
      complete: image.complete,
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
    })),
  ).toEqual({ complete: true, naturalHeight: 1200, naturalWidth: 1600 });

  const themeToggle = await getVisibleThemeToggle(page);
  await themeToggle.click();
  await page.evaluate(() => document.fonts.ready.then(() => true));
  expect(
    (await getCriticalResources())
      .filter((path) => path.startsWith("/assets/fonts/"))
      .sort(),
  ).toEqual([...FONT_PATHS].sort());

  const cachePathsBeforeQueries = await getCurrentCachePaths(page);
  await page.evaluate(async (path) => {
    await Promise.all(
      Array.from({ length: 8 }, (_, index) => fetch(`${path}?v=${index}`)),
    );
  }, HERO_IMAGE_PATH);
  expect(await getCurrentCachePaths(page)).toEqual(cachePathsBeforeQueries);
  expectCleanDiagnostics(diagnostics);
});
