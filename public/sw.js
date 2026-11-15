const CACHE_NAME = "nepsis-shield-pwa-v14";
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

// Zero-signal days: refill the next 14 days of the Church calendar in the background (Chrome and Edge, installed app).
// Shares the "nepsis-offline" IndexedDB database with src/lib/offlineDays.ts; keep the two in step.
const OFFLINE_DAYS = 14;
const REFRESH_AFTER_MS = 1000 * 60 * 60 * 24 * 3;

function openOfflineDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("nepsis-offline", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("days")) db.createObjectStore("days", { keyPath: "key" });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idb(db, store, mode, action) {
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(store, mode).objectStore(store));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dateKey(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

async function refillOfflineDays() {
  const db = await openOfflineDb();
  const mode = (await idb(db, "meta", "readonly", (s) => s.get("calendarMode"))) || "gregorian";
  for (let offset = 0; offset < OFFLINE_DAYS; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const key = `${mode}:${dateKey(date)}`;
    const existing = await idb(db, "days", "readonly", (s) => s.get(key));
    if (existing && Date.now() - existing.savedAt < REFRESH_AFTER_MS) continue;
    try {
      const url = `https://orthocal.info/api/${mode}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`;
      const response = await fetch(url, { referrerPolicy: "no-referrer" });
      if (!response.ok) continue;
      const day = await response.json();
      await idb(db, "days", "readwrite", (s) => s.put({ key, mode, date: dateKey(date), savedAt: Date.now(), day }));
    } catch {
      // Try again at the next sync.
    }
  }
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "offline-days") event.waitUntil(refillOfflineDays());
});
