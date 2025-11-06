/* ===== KP_Code – Service Worker (cache-first for static, network-first for HTML) ===== */

// 🔹 Zmieniaj wersję przy każdej większej publikacji, by wymusić odświeżenie cache
const CACHE_NAME = "kp_code_v0.08.00";

// 🔹 Zasoby do zbuforowania (realne ścieżki z projektu)
const FILES_TO_CACHE = [
  "/", // start_url
  "/index.html",
  "/about.html",
  "/menu.html",
  "/gallery.html",
  "/cookies.html",
  "/polityka-prywatnosci.html",

  // CSS/JS – wersje minifikowane
  "/css/style.min.css",
  "/js/script.min.js",

  // PWA / favicony / manifest
  "/manifest.webmanifest",
  "/assets/icons/fav-icon/apple-touch-icon.png",
  "/assets/icons/fav-icon/favicon-16x16.png",
  "/assets/icons/fav-icon/favicon-32x32.png",
  "/assets/icons/fav-icon/favicon-96x96.png",
  "/assets/icons/fav-icon/web-app-manifest-192x192.png",
  "/assets/icons/fav-icon/web-app-manifest-512x512.png",

  // Logo (wersja light, jak w schema i manifest)
  "/assets/img/logo/logo-light-mode.svg",

  // LCP hero image
  "/assets/img/hero/hero-768x614.avif",

  // (opcjonalnie) offline fallback
  "/offline.html",
];

// Instalacja Service Workera
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

// Aktywacja i czyszczenie starego cache
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Obsługa żądań
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 🔸 Network-first dla stron HTML (aktualność treści)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req, { ignoreSearch: true });
          if (cached) return cached;
          const offline = await cache.match("/offline.html");
          return offline || new Response("Offline", { status: 503, statusText: "Offline" });
        })
    );
    return;
  }

  // 🔸 Cache-first dla zasobów statycznych (CSS, JS, IMG, FAVICON)
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
    })
  );
});
