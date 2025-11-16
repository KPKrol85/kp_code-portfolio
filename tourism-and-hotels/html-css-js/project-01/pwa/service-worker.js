/* Service Worker – KP_Code_ Website Demo for Tourism & Hotels */

const VERSION = "kp_code_v1.0.8";
const STATIC_CACHE = `th-static-${VERSION}`;
const HTML_CACHE = `th-html-${VERSION}`;
const STATIC_ASSETS = [
  "index.html",
  "gallery.html",
  "css/style.css",
  "js/script.js",
  "js/features/nav.js",
  "js/features/theme.js",
  "js/features/reveal.js",
  "js/features/gallery-filters.js",
  "js/features/lightbox.js",
  "js/features/form.js",
  "js/features/tabs.js",
  "js/features/aria-current.js",
  "site.webmanifest",
  "offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![STATIC_CACHE, HTML_CACHE].includes(k)).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Network-first for HTML; Cache-first for static assets
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // HTML pages
  if (req.mode === "navigate" || (req.method === "GET" && req.headers.get("accept")?.includes("text/html"))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(HTML_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match("offline.html");
        })
    );
    return;
  }

  // Static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const url = new URL(req.url);
          if (url.origin === location.origin) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
