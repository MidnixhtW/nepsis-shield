const CACHE_NAME = "nepsis-shield-pwa-v12";
const APP_SHELL = [
  "/",
  "/today",
  "/pray?tab=daily",
  "/pray?tab=sleep",
  "/read?read=daily",
  "/learn?tab=welcome",
  "/learn?tab=path",
  "/learn?tab=challenges",
  "/learn?tab=creed",
  "/field-manual",
  "/settings",
  "/saints",
  "/download",
  "/release-notes",
  "/about",
  "/privacy",
  "/manifest.webmanifest",
  "/military-orthodox-cross.svg",
  "/icons/icon-192.png",
  "/icons/apple-touch-icon.png",
  "/favicon.ico",
  "/offline.html"
];

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Live data (prayer groups) must never be cached or served stale.
  if (url.pathname.startsWith("/api/")) return;
  // Recorded prayers stream with range requests, which the cache below does not handle; let the browser fetch them.
  if (url.pathname.startsWith("/audio/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("/today") || caches.match("/offline.html");
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
