/* ===== Service Worker — SolidCraft ===== */

const CACHE_NAME = "SolidCraft_v.1.5";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/css/style.min.css",
  "/js/script.min.js",
  "/assets/img/favicon/favicon.ico",
  "/assets/img/favicon/favicon.svg",
  "/assets/img/favicon/favicon-96x96.png",
  "/assets/img/favicon/apple-touch-icon.png",
  "/assets/img/favicon/web-app-manifest-192x192.png",
  "/assets/img/favicon/web-app-manifest-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("construction-01-") && k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() =>
          caches.match(req).then((res) => res || caches.match("/index.html")),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
        return res;
      });
    }),
  );
});
