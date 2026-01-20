const STATIC_CACHE = "dv-static-v1.0.03";
const DATA_CACHE = "dv-data-v1.0.03";

const APP_SHELL_URLS = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles/tokens.css",
  "./styles/base.css",
  "./styles/layout.css",
  "./styles/components.css",
  "./styles/themes.css",
  "./js/utils/safe-storage.js",
  "./js/theme-init.js",
  "./js/app.js",
  "./site.webmanifest",
  "./assets/og/og-dv-1200x630.png",
  "./assets/favicon/favicon.ico",
  "./assets/favicon/favicon-96x96.png",
  "./assets/favicon/favicon.svg",
  "./assets/favicon/apple-touch-icon.png",
  "./assets/favicon/web-app-manifest-192x192.png",
  "./assets/favicon/web-app-manifest-512x512.png",
  "./assets/fonts/space-grotesk-latin.woff2",
  "./assets/fonts/space-grotesk-latin-ext.woff2",
];

const toAbsoluteUrl = (path) => new URL(path, self.location);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(
          APP_SHELL_URLS.map((url) => new Request(toAbsoluteUrl(url), { cache: "reload" }))
        )
      )
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DATA_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const isStaticAsset = (request) => {
  if (request.destination) {
    return ["style", "script", "image", "font"].includes(request.destination);
  }
  return /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(request.url);
};

const isJsonRequest = (request) =>
  request.headers.get("accept")?.includes("application/json") || /\.json$/i.test(request.url);

const isNavigationRequest = (request) =>
  request.mode === "navigate" ||
  (request.headers.get("accept")?.includes("text/html") && request.method === "GET");

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, response.clone());
  return response;
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(DATA_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => new Response("", { status: 504 }));

  return cached || fetchPromise;
};

const networkFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return cache.match("./offline.html");
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isJsonRequest(request) && !request.headers.get("authorization")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }
});
