const CACHE_NAME = "studio-noir-v1";
const ASSETS = [
  "/studio-noir/",
  "/studio-noir/index.html",
  "/studio-noir/offline.html",
  "/studio-noir/css/style.css",
  "/studio-noir/css/style.min.css",
  "/studio-noir/css/tokens.css",
  "/studio-noir/css/base.css",
  "/studio-noir/css/layout.css",
  "/studio-noir/css/components.css",
  "/studio-noir/css/sections.css",
  "/studio-noir/js/main.js",
  "/studio-noir/js/reveal.js",
  "/studio-noir/js/header.js",
  "/studio-noir/js/nav.js",
  "/studio-noir/js/lightbox.js",
  "/studio-noir/js/booking.js",
  "/studio-noir/js/theme.js",
  "/studio-noir/assets/img/hero-editorial.svg",
  "/studio-noir/assets/icons/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match("/studio-noir/offline.html"));
    })
  );
});
