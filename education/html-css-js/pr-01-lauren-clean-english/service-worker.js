const BUILD_VERSION = '1.0.1';
const CACHE_NAME = `clean-english-v${BUILD_VERSION}`;
const OFFLINE_URL = '/offline.html';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/uslugi.html',
  '/pakiety.html',
  '/materialy.html',
  '/postepy.html',
  '/thank-you.html',
  '/offline.html',
  '/404.html',
  '/assets/build/main.min.js',
  '/assets/build/style.min.css',
  '/assets/img/hero-illustration.svg',
  '/assets/img/about-portrait.svg',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.mode === 'navigate') {
    // Network-first keeps HTML fresh; fallback to cache/offline when unavailable.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  const isSameOrigin = new URL(request.url).origin === self.location.origin;
  const isStaticAsset =
    isSameOrigin &&
    ['style', 'script', 'image', 'font'].includes(request.destination);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            return response;
          })
      )
    );
  }
});
