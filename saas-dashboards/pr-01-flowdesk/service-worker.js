const CACHE_NAME = 'flowdesk-v2';
const OFFLINE_URL = '/offline.html';

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/css/tokens.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/views.css',
  '/js/main.js',
  '/js/core/router.js',
  '/js/core/store.js',
  '/js/core/auth.js',
  '/js/core/dom.js',
  '/js/data/seed.js',
  '/js/views/loginView.js',
  '/js/views/dashboardView.js',
  '/js/views/clientsView.js',
  '/js/views/projectsView.js',
  '/js/views/calendarView.js',
  '/js/views/settingsView.js',
  '/js/views/notFoundView.js',
  '/js/components/sidebar.js',
  '/js/components/topbar.js',
  '/js/components/modal.js',
  '/js/components/drawer.js',
  '/js/components/toast.js',
  '/js/components/table.js',
  '/js/components/formControls.js',
  '/js/utils/format.js',
  '/js/utils/validators.js',
  '/js/utils/storage.js',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg',
  '/assets/fonts/inter-400.woff2',
  '/assets/fonts/inter-500.woff2',
  '/assets/fonts/inter-600.woff2',
  '/assets/fonts/inter-700.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
