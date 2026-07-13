import { INDEXABLE_PAGES, SITE } from "./site-config.mjs";

export const CACHE_PREFIX = "clean-english-v";
export const OFFLINE_PATH = "/offline.html";
export const MANIFEST_PATH = SITE.manifest.path;

export const PRIMARY_DOCUMENT_PATHS = Object.freeze(
  INDEXABLE_PAGES.map(({ file }) => `/${file}`),
);

export const FONT_ASSETS = Object.freeze(
  [
    {
      family: "Inter",
      path: "/assets/fonts/inter-400.woff2",
      style: "normal",
      weight: 400,
    },
    {
      family: "Inter",
      path: "/assets/fonts/inter-600.woff2",
      style: "normal",
      weight: 600,
    },
    {
      family: "Inter",
      path: "/assets/fonts/inter-700.woff2",
      style: "normal",
      weight: 700,
    },
    {
      family: "Literata",
      path: SITE.headingFont.path,
      style: "normal",
      weight: 700,
    },
  ].map(Object.freeze),
);

export const FONT_PATHS = Object.freeze(FONT_ASSETS.map(({ path }) => path));

export const MANIFEST_ICON_PATHS = Object.freeze([
  "/assets/favicon/web-app-manifest-192x192.png",
  "/assets/favicon/web-app-manifest-512x512.png",
]);

export const SHORTCUT_ICON_PATHS = Object.freeze([
  "/assets/pwa/shortcuts/packages-192.png",
  "/assets/pwa/shortcuts/materials-192.png",
  "/assets/pwa/shortcuts/progress-192.png",
]);

export const MANIFEST_SCREENSHOT_PATHS = Object.freeze([
  "/assets/pwa/screenshots/home-desktop-1280x720.png",
  "/assets/pwa/screenshots/home-mobile-720x1280.png",
]);

export const HERO_IMAGE_PATH = "/assets/img/hero/hero-01.jpg";
export const BRAND_LOGO_PATH = SITE.brandLogo.path;
export const OFFLINE_PAGE_IMAGE_PATHS = Object.freeze([
  HERO_IMAGE_PATH,
  "/assets/img/about/lauren.jpg",
]);

export const PRECACHE_PATHS = Object.freeze([
  ...PRIMARY_DOCUMENT_PATHS,
  OFFLINE_PATH,
  "/assets/build/style.min.css",
  "/assets/build/main.min.js",
  ...FONT_PATHS,
  ...MANIFEST_ICON_PATHS,
  ...SHORTCUT_ICON_PATHS,
  BRAND_LOGO_PATH,
  ...OFFLINE_PAGE_IMAGE_PATHS,
  MANIFEST_PATH,
]);

export const CRITICAL_ASSET_BUDGET = Object.freeze({
  productionCssRequests: 1,
  productionJavaScriptRequests: 1,
  initialFontRequests: FONT_PATHS.length,
  preloadedFontRequests: 1,
  brandLogoRequests: 1,
  heroImageRequests: 1,
  maximumHeroImageBytes: 1_100_000,
  maximumInitialFontBytes: 185_000,
});

export const normalizePublicPath = (path) => {
  const url = new URL(path, "https://pwa.local");
  return url.pathname === "/" ? "/index.html" : url.pathname;
};
