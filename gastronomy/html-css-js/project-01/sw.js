/* ambre-v1.0.0 */
const APP_VERSION = "ambre-v1.0.0";

const CACHE_PAGES = `pages-${APP_VERSION}`;
const CACHE_STATIC = `static-${APP_VERSION}`;
const CACHE_MEDIA = `media-${APP_VERSION}`;
const CORE_FALLBACK = "/404.html";

const PRECACHE = ["/", "/index.html", "/menu.html", "/galeria.html", "/cookies.html", "/polityka-prywatnosci.html", "/manifest.webmanifest", CORE_FALLBACK];

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
      if ("navigationPreload" in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {}
      }
      const keep = new Set([CACHE_PAGES, CACHE_STATIC, CACHE_MEDIA]);
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
    })()
  );
  self.clients.claim();
});

async function putSafe(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch {}
  return response;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;

  if (req.mode === "navigate") {
    e.respondWith(
      (async () => {
        try {
          const preload = await e.preloadResponse;
          const net = preload || (await fetch(req, { credentials: "same-origin" }));
          return putSafe(CACHE_PAGES, req, net);
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match(CORE_FALLBACK);
        }
      })()
    );
    return;
  }

  const dest = req.destination;

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

  if (dest === "image" || dest === "font") {
    e.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req, { credentials: "same-origin" });
          return putSafe(CACHE_MEDIA, req, res);
        } catch {
          return Response.error();
        }
      })()
    );
    return;
  }

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

self.addEventListener("message", (e) => {
  if (e?.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
