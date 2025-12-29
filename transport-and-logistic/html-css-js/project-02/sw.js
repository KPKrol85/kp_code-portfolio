const CACHE_NAME = "fleetops-v1.05";

const SHELL_URLS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

function isStaticAsset(pathname) {
  if (pathname.startsWith("/assets/")) return true;

  const lower = pathname.toLowerCase();
  return lower.endsWith(".css") || lower.endsWith(".js") || lower.endsWith(".png") || lower.endsWith(".svg") || lower.endsWith(".ico") || lower.endsWith(".webp") || lower.endsWith(".woff2");
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) return response;
      throw new Error("Network error");
    })
    .catch(() => caches.match("/index.html"));
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request)
      .then((response) => {
        if (response && response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
          return response;
        }
        return cached || response;
      })
      .catch(() => cached);

    return cached || fetchPromise;
  });
}
