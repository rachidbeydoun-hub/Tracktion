// TRACKTION — Service Worker v3
// ═══════════════════════════════════════
// ADD NEW PAGES HERE — one line per page
// ═══════════════════════════════════════
const PAGES = [
  '/Tracktion/',
  '/Tracktion/welcome.html',
  '/Tracktion/signup.html',
  '/Tracktion/baseline.html',
  '/Tracktion/index.html',
  '/Tracktion/log.html',
  '/Tracktion/history.html',
  '/Tracktion/profile.html',
  '/Tracktion/settings.html',
  '/Tracktion/manifest.json',
];

const CACHE = 'tracktion-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first → cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request)
        .then(cached => cached || caches.match('/Tracktion/index.html'))
      )
  );
});
