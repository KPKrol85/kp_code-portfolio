const CACHE_NAME = "performance-coach-v1";
const ASSETS = [
  "/performance-coach/",
  "/performance-coach/index.html",
  "/performance-coach/css/style.css",
  "/performance-coach/css/style.min.css",
  "/performance-coach/js/main.js",
  "/performance-coach/offline.html",
  "/performance-coach/manifest.webmanifest",
  "/performance-coach/assets/icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) =>
      response ||
      fetch(event.request).catch(() => caches.match("/performance-coach/offline.html"))
    )
  );
});
