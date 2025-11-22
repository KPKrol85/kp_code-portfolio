const VERSION = "kp_code_v1.00.06";

const STATIC_CACHE = `${VERSION}_static`;
const HTML_CACHE = `${VERSION}_html`;

const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = ["/", "/index.html", "/css/style.css", "/js/script.js", "/site.webmanifest", OFFLINE_URL];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, HTML_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  }
});

function isStaticAsset(request) {
  const url = new URL(request.url);
  return ["style", "script", "image", "font"].includes(request.destination) || STATIC_ASSETS.includes(url.pathname);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(HTML_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || caches.match(OFFLINE_URL);
  }
}
