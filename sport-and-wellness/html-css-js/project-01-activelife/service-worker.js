const CACHE_VERSION = "v3";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const HTML_CACHE = `html-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/css/style.min.css",
  "/js/app.min.js",
  "/assets/img/hero-gradient.svg",
  "/assets/img/spa-zone.svg",
  "/assets/img/tennis-zone.svg",
  "/assets/icons/icon-192.svg",
  "/assets/icons/icon-512.svg"
];

const OFFLINE_HTML_FALLBACKS = ["/offline.html", "/index.html", "/"];
const NAVIGATION_TIMEOUT_MS = 4000;

const isCacheableResponse = (response) =>
  Boolean(response) &&
  response.ok === true &&
  response.type === "basic" &&
  response.redirected !== true;

const isStaticRequest = (request) => {
  const destination = request.destination;

  return (
    destination === "style" ||
    destination === "script" ||
    destination === "image" ||
    destination === "font" ||
    destination === "manifest" ||
    destination === "worker" ||
    destination === "favicon"
  );
};

const safeCachePut = async (cacheName, request, response) => {
  if (!isCacheableResponse(response)) {
    return;
  }

  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch (_error) {
    // Intentionally ignored: cache write failures should not break responses.
  }
};

const fetchWithTimeout = async (request, timeoutMs) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("network-timeout")), timeoutMs);
  });

  try {
    return await Promise.race([fetch(request), timeoutPromise]);
  } catch (error) {
    throw error;
  }
};

const findOfflineHtmlFallback = async () => {
  try {
    const htmlCache = await caches.open(HTML_CACHE);

    for (const fallbackUrl of OFFLINE_HTML_FALLBACKS) {
      const fallback = await htmlCache.match(fallbackUrl);
      if (fallback) {
        return fallback;
      }
    }

    const staticCache = await caches.open(STATIC_CACHE);
    for (const fallbackUrl of OFFLINE_HTML_FALLBACKS) {
      const fallback = await staticCache.match(fallbackUrl);
      if (fallback) {
        return fallback;
      }
    }
  } catch (_error) {
    // Intentionally ignored: return generic fallback below.
  }

  return new Response("Offline", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

const handleNavigationRequest = async (request) => {
  try {
    const networkResponse = await fetchWithTimeout(request, NAVIGATION_TIMEOUT_MS);
    await safeCachePut(HTML_CACHE, request, networkResponse);
    return networkResponse;
  } catch (_error) {
    try {
      const htmlCache = await caches.open(HTML_CACHE);
      const cachedPage = await htmlCache.match(request);
      if (cachedPage) {
        return cachedPage;
      }
    } catch (_cacheReadError) {
      // Intentionally ignored.
    }

    return findOfflineHtmlFallback();
  }
};

const handleStaticRequest = async (event) => {
  const request = event.request;

  let cachedResponse;
  try {
    const staticCache = await caches.open(STATIC_CACHE);
    cachedResponse = await staticCache.match(request);
  } catch (_error) {
    cachedResponse = undefined;
  }

  const revalidatePromise = (async () => {
    try {
      const networkResponse = await fetch(request);
      await safeCachePut(STATIC_CACHE, request, networkResponse);
      return networkResponse;
    } catch (_error) {
      return undefined;
    }
  })();

  event.waitUntil(revalidatePromise.catch(() => undefined));

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await revalidatePromise;
  if (networkResponse) {
    return networkResponse;
  }

  if (request.destination === "image") {
    return new Response("", { status: 204 });
  }

  return new Response("", { status: 503 });
};

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(PRECACHE_ASSETS);

      const htmlCache = await caches.open(HTML_CACHE);
      await htmlCache.addAll(["/", "/index.html", "/offline.html"]);
    } catch (_error) {
      // Intentionally ignored: install should not crash from a single precache failure.
    }
  })());

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      const allowedCaches = new Set([STATIC_CACHE, HTML_CACHE]);

      await Promise.all(
        keys
          .filter((key) => !allowedCaches.has(key))
          .map((key) => caches.delete(key))
      );
    } catch (_error) {
      // Intentionally ignored.
    }
  })());

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  if (request.headers.has("range")) {
    return;
  }

  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch (_error) {
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isNavigation = request.mode === "navigate" || request.destination === "document";

  if (isNavigation) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (isStaticRequest(request)) {
    event.respondWith(handleStaticRequest(event));
    return;
  }

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      await safeCachePut(STATIC_CACHE, request, response);
      return response;
    } catch (_error) {
      try {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
      } catch (_cacheError) {
        // Intentionally ignored.
      }

      return new Response("", { status: 503 });
    }
  })());
});
