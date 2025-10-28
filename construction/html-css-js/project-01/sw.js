/* ===== Service Worker — construction-01 ===== */
const CACHE_NAME = "construction-01-v3";

/* Kluczowe zasoby (MINIFIED) */
const ASSETS = [
  "/", // Netlify root -> index.html
  "/index.html",
  "/manifest.webmanifest",

  // MIN CSS/JS
  "/css/style.min.css",
  "/js/script.min.js",

  // Ikony PWA (Twój standard)
  "/assets/icons/fav-icon/favicon.ico",
  "/assets/icons/fav-icon/favicon.svg",
  "/assets/icons/fav-icon/favicon-96x96.png",
  "/assets/icons/fav-icon/apple-touch-icon.png",
  "/assets/icons/fav-icon/web-app-manifest-192x192.png",
  "/assets/icons/fav-icon/web-app-manifest-512x512.png",
];

/* Install: pre-cache */
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

/* Activate: cleanup */
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("construction-01-") && k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

/* Fetch strategy:
   - HTML: network-first + offline fallback
   - Inne: cache-first + update to cache */
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
        .catch(() => caches.match(req).then((res) => res || caches.match("/index.html")))
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
    })
  );
});
