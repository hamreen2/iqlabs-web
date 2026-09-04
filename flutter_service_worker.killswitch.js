// One-time kill switch for a previously-installed Flutter web service worker.
//
// Deploy this ONCE in place of the normal generated flutter_service_worker.js.
// Any browser that already has the OLD service worker installed will, per
// normal browser behavior, eventually re-fetch this file from the network to
// check for updates (on next navigation / within ~24h). Since the bytes
// differ, the browser installs THIS worker, which immediately wipes every
// cache, unregisters itself, and force-reloads any open tabs - after which
// that browser has no service worker left and always loads the real,
// current site directly from network, with zero customer action needed.
//
// Not needed for a NEW visitor - they never get a service worker at all,
// since the app is now built with --pwa-strategy=none.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});
