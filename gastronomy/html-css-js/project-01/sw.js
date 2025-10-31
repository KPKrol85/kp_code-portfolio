/* sw.js — gastronomy-01 */
const APP_VERSION = "v2.0.0-2025-10-31";

const CACHE_PAGES = `pages-${APP_VERSION}`;
const CACHE_STATIC = `static-${APP_VERSION}`;
const CACHE_MEDIA = `media-${APP_VERSION}`;
const CORE_FALLBACK = "/404.html"; // offline fallback

// Pliki krytyczne do wstępnego cache
const PRECACHE = [
  "/", // shell
  "/index.html",
  "/menu.html",
  "/galeria.html",
  "/cookies.html",
  "/polityka-prywatnosci.html",
  "/manifest.webmanifest",
  CORE_FALLBACK,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const c1 = await caches.open(CACHE_PAGES);
      await c1.addAll(PRECACHE);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      // Navigation Preload dla szybszego fetch, jeśli dostępne
      if ("navigationPreload" in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {}
      }
      // Usuń stare cache
      const keep = new Set([CACHE_PAGES, CACHE_STATIC, CACHE_MEDIA]);
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
    })()
  );
  self.clients.claim();
});

// Helpery cache
async function putSafe(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch {}
  return response;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // 1) Nawigacje (HTML) — network-first z fallbackami
  if (req.mode === "navigate") {
    e.respondWith(
      (async () => {
        try {
          const preload = await e.preloadResponse;
          const net = preload || (await fetch(req, { credentials: "same-origin" }));
          return putSafe(CACHE_PAGES, req, net);
        } catch {
          // sieć niedostępna → cache lub fallback
          const cached = await caches.match(req);
          return cached || caches.match(CORE_FALLBACK);
        }
      })()
    );
    return;
  }

  const dest = req.destination;

  // 2) CSS/JS/Worker — stale-while-revalidate
  if (dest === "style" || dest === "script" || dest === "worker") {
    e.respondWith(
      (async () => {
        const cacheMatch = await caches.match(req);
        const fetchPromise = fetch(req)
          .then((res) => putSafe(CACHE_STATIC, req, res))
          .catch(() => null);
        return cacheMatch || fetchPromise || fetch(req);
      })()
    );
    return;
  }

  // 3) Obrazy i fonty — cache-first
  if (dest === "image" || dest === "font") {
    e.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req, { credentials: "same-origin" });
          return putSafe(CACHE_MEDIA, req, res);
        } catch {
          // brak sieci i brak w cache → nic nie rób, przeglądarka pokaże własny placeholder
          return Response.error();
        }
      })()
    );
    return;
  }

  // 4) Inne żądania — passthrough z łagodnym cache static
  if (req.url.includes("/assets/") || req.url.includes("/css/") || req.url.includes("/js/")) {
    e.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          return putSafe(CACHE_STATIC, req, res);
        } catch {
          return Response.error();
        }
      })()
    );
  }
});

// Manualne odświeżenie SW z aplikacji: postMessage({type:"SKIP_WAITING"})
self.addEventListener("message", (e) => {
  if (e?.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
