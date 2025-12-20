/* === Service worker - construction-02 ===*/

const CACHE_NAME = "construction-02-v1.03";
const ASSETS = ["./", "./index.html", "./offline.html", "./css/style.min.css", "./js/script.min.js", "./assets/img/favicon/favicon-96x96.png", "./assets/img/og/og-1200x630.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const dest = req.destination;
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("./offline.html")) || (await caches.match("./index.html")))
    );
    return;
  }
  if (dest === "style" || dest === "script") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          const fetchPromise = fetch(req)
            .then((net) => {
              if (net && net.status === 200) cache.put(req, net.clone());
              return net;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }
  if (dest === "image") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((net) => {
              if (net && net.status === 200) cache.put(req, net.clone());
              return net;
            })
            .catch(() => cached);
        })
      )
    );
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
