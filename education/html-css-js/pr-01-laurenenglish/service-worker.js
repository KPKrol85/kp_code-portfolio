const CACHE_PREFIX = "clean-english-v";
const CACHE_REVISION = "1.0.0-f3eec03b648f";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_REVISION}`;
const OFFLINE_PATH = "/offline.html";
const PRECACHE_PATHS = [
  "/index.html",
  "/uslugi.html",
  "/pakiety.html",
  "/materialy.html",
  "/postepy.html",
  "/offline.html",
  "/assets/build/style.min.css",
  "/assets/build/main.min.js",
  "/assets/fonts/inter-400.woff2",
  "/assets/fonts/inter-600.woff2",
  "/assets/fonts/inter-700.woff2",
  "/assets/fonts/literata-700.woff2",
  "/assets/favicon/web-app-manifest-192x192.png",
  "/assets/favicon/web-app-manifest-512x512.png",
  "/assets/pwa/shortcuts/packages-192.png",
  "/assets/pwa/shortcuts/materials-192.png",
  "/assets/pwa/shortcuts/progress-192.png",
  "/assets/img/logo/logo.svg",
  "/assets/img/hero/hero-01.jpg",
  "/assets/img/about/lauren.jpg",
  "/site.webmanifest",
];
const PRIMARY_DOCUMENT_PATHS = [
  "/index.html",
  "/uslugi.html",
  "/pakiety.html",
  "/materialy.html",
  "/postepy.html",
];

const primaryDocuments = new Set(PRIMARY_DOCUMENT_PATHS);
const staticPrecachePaths = new Set(
  PRECACHE_PATHS.filter(
    (path) => path !== OFFLINE_PATH && !primaryDocuments.has(path),
  ),
);

const normalizePathname = (pathname) =>
  pathname === "/" ? "/index.html" : pathname;

const getRequestUrl = (request) => {
  try {
    return new URL(request.url);
  } catch {
    return null;
  }
};

const isIntendedSameOriginGet = (request) => {
  const url = getRequestUrl(request);
  return (
    request.method === "GET" &&
    url !== null &&
    ["http:", "https:"].includes(url.protocol) &&
    url.origin === self.location.origin
  );
};

const isCacheableResponse = (request, response) =>
  isIntendedSameOriginGet(request) &&
  response instanceof Response &&
  response.ok &&
  response.status === 200 &&
  response.type === "basic" &&
  !response.redirected &&
  !response.headers.has("Content-Range");

const currentCache = () => caches.open(CACHE_NAME);

const handleNavigation = async (request) => {
  const requestUrl = getRequestUrl(request);
  const normalizedPath = normalizePathname(requestUrl.pathname);
  const isPrimaryDocument = primaryDocuments.has(normalizedPath);

  try {
    const response = await fetch(request);
    const isHtml = response.headers
      .get("Content-Type")
      ?.toLowerCase()
      .includes("text/html");

    if (isPrimaryDocument && isHtml && isCacheableResponse(request, response)) {
      const cache = await currentCache();
      await cache.put(normalizedPath, response.clone());
    }

    return response;
  } catch {
    const cache = await currentCache();
    const cachedPrimary = isPrimaryDocument
      ? await cache.match(normalizedPath)
      : null;
    return (
      cachedPrimary ??
      (await cache.match(OFFLINE_PATH)) ??
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
};

const handleStaticAsset = async (request, normalizedPath) => {
  const cache = await currentCache();
  const cached = await cache.match(normalizedPath);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheableResponse(request, response)) {
    await cache.put(normalizedPath, response.clone());
  }
  return response;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await currentCache();
        await cache.addAll(PRECACHE_PATHS);
        await self.skipWaiting();
      } catch (error) {
        await caches.delete(CACHE_NAME);
        throw error;
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME,
          )
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isIntendedSameOriginGet(request)) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  const requestUrl = getRequestUrl(request);
  const normalizedPath = normalizePathname(requestUrl.pathname);
  if (staticPrecachePaths.has(normalizedPath)) {
    event.respondWith(handleStaticAsset(request, normalizedPath));
  }
});
