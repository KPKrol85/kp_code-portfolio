/* ===== KP_Code – Basic Service Worker ===== */

// Nazwa cache
const CACHE_NAME = "kp_code_v0.05.00";

// Pliki do zbuforowania
const FILES_TO_CACHE = ["/", "/index.html", "/css/style.min.css", "/js/script.min.js", "/assets/img/hero/hero-02-480x410.webp", "/assets/img/logo/logo-light-mode-80.svg"];

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

// Obsługa żądań (tryb cache-first)
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
