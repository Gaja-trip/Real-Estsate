const CACHE_PREFIX = "real-estate-civil-law-cbt-";
const LEGACY_CACHE_PREFIX = "real-estate-exam-app-";
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=4",
  "./app.js?v=4",
  "./manifest.webmanifest",
  "./public/icon.svg",
  "./public/data/civil-law-2021.js?v=4",
  "./public/data/civil-law-2022.js?v=4",
  "./public/data/civil-law-2023.js?v=4",
  "./public/data/civil-law-2024.js?v=4",
  "./public/data/civil-law-2025.js?v=4",
  "./public/pdfs/2021-question.pdf",
  "./public/pdfs/2021-answer.pdf",
  "./public/pdfs/2024-answer.pdf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              (key.startsWith(CACHE_PREFIX) || key.startsWith(LEGACY_CACHE_PREFIX)) &&
              key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
