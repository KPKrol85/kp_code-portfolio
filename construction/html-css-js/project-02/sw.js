/* ========== 00) SERVICE WORKER ========== */

self.addEventListener("install", () => {
  console.log("✅ Service Worker: installed");
});
self.addEventListener("activate", () => {
  console.log("✅ Service Worker: activated");
});
self.addEventListener("fetch", () => {
});
