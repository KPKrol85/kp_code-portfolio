const CACHE_NAME = "translogix-v1.01";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/services.html",
  "/fleet.html",
  "/pricing.html",
  "/contact.html",
  "/404.html",

  // CSS (prefer min)
  "/assets/css/style.min.css",
  "/assets/css/style.css",

  // JS
  "/assets/js/main.js",

  // Icons / PWA
  "/assets/icons/favicon.ico",
  "/assets/icons/favicon-96x96.png",
  "/assets/icons/favicon.svg",
  "/assets/icons/apple-touch-icon.png",
  "/assets/icons/site.webmanifest",

  // root misc (safe to cache lightly)
  "/robots.txt",
  "/sitemap.xml",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(PRECACHE_URLS);
      } catch (error) {
        console.error("Service worker install failed", error);
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return undefined;
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // HTML navigation: keep fresh, fallback to cached shell
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const url = new URL(request.url);

  // Static assets: SWR
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Root small files (robots/sitemap/manifest/404): SWR
  if (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml" || url.pathname === "/site.webmanifest" || url.pathname === "/404.html") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = (await cache.match(request)) || (await cache.match("/index.html")) || (await cache.match("/"));

    if (cachedResponse) return cachedResponse;

    // last resort: show 404 page if available
    const notFound = await cache.match("/404.html");
    if (notFound) return notFound;

    return Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cachedResponse) return cachedResponse;

  const networkResponse = await networkPromise;
  return networkResponse || Response.error();
}
