const CACHE_NAME = 'finova-cache-v1';
const CORE_ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'logo.jpg',
  'manifest.webmanifest',
  'Goal/goals.html',
  'Goal/goals.js'
].map((path) => new URL(path, self.registration.scope).toString());

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Network-first for navigation, cache-first for others
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(new URL('index.html', self.registration.scope).toString()))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});
