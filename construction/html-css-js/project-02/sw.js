/* ================================================== */
/* ===== 00) SERVICE WORKER — KP_Code Standard ===== */
/* ================================================== */

/* Version history:
   v1 — Initial release with basic offline cache
   v2 — TBD (update when assets or manifest change)
*/

const CACHE_NAME = "kp_code_v3";
const ASSETS = ["./", "./index.html", "./css/style.css", "./js/script.js", "./assets/img/favicon/favicon-96x96.png", "./assets/img/og/og-1200x630.jpg"];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ Service Worker: Caching core assets");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    })
  );
  console.log("✅ Service Worker: Activated and old cache cleared");
  console.log("🚀 KP_Code PWA active — version 1.0.0");
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
