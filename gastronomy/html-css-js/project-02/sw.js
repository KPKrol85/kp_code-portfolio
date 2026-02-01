const CACHE_NAME = "atelierno02-v1.0.0";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/about.html",
  "/menu.html",
  "/gallery.html",
  "/cookies.html",
  "/polityka-prywatnosci.html",
  "/regulamin.html",
  "/css/style.min.css",
  "/css/style.css",
  "/css/base/tokens.css",
  "/css/base/reset.css",
  "/css/base/typography.css",
  "/css/base/globals.css",
  "/css/layout/layout.css",
  "/css/layout/grid.css",
  "/css/components/header.css",
  "/css/components/nav.css",
  "/css/components/buttons.css",
  "/css/components/cards.css",
  "/css/components/forms.css",
  "/css/components/sections.css",
  "/css/components/footer.css",
  "/css/components/modal.css",
  "/css/components/lightbox.css",
  "/css/pages/home.css",
  "/css/pages/about.css",
  "/css/pages/menu.css",
  "/css/pages/gallery.css",
  "/css/pages/legal.css",
  "/css/utilities/helpers.css",
  "/css/utilities/states.css",
  "/css/utilities/animations.css",
  "/js/script.min.js",
  "/data/menu.json",
  "/manifest.webmanifest",
  "/assets/icons/fav-icon/web-app-manifest-192x192.png",
  "/assets/icons/fav-icon/web-app-manifest-512x512.png",
  "/assets/img-optimized/logo/logo/logo-light-mode.svg",
  "/assets/img-optimized/hero/hero-768x614.avif",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req, { ignoreSearch: true });
          if (cached) return cached;

          const offline = await cache.match("/offline.html");
          return offline || new Response("Offline", { status: 503, statusText: "Offline" });
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      });
    }),
  );
});
