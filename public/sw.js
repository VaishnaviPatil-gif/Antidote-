/*
 * Antidote+ service worker — offline-first shell caching.
 *
 * A snakebite happens where signal is worst, so the app must open and run after
 * the first visit even fully offline. Strategy:
 *   - App shell (navigations): network-first, fall back to the cached index so
 *     a deep link still boots the SPA offline.
 *   - Same-origin static assets (JS/CSS/icons): stale-while-revalidate — instant
 *     from cache, refreshed in the background when online.
 *   - Cross-origin (map tiles, routing API): passed straight through, never
 *     cached, so we don't bloat storage with opaque responses.
 *
 * Registered ONLY on the web build (never inside the Capacitor WebView) and only
 * in production — see src/main.jsx.
 */

const CACHE = "antidote-shell-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Cross-origin (OSM tiles, OSRM, backend API): let the network handle it.
  if (!sameOrigin) return;

  // App-shell navigations → network-first with cached index fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html").then((r) => r || caches.match("/")))
    );
    return;
  }

  // Static assets → stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
