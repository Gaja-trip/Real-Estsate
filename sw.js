const CACHE_PREFIX = "real-estate-civil-law-cbt-";
const LEGACY_CACHE_PREFIX = "real-estate-exam-app-";
const CACHE_NAME = `${CACHE_PREFIX}v5`;
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=5",
  "./app.js?v=5",
  "./manifest.webmanifest",
  "./public/icon.svg",
  "./public/data/civil-law-2005-extra.js?v=5",
  "./public/data/civil-law-2005.js?v=5",
  "./public/data/civil-law-2006.js?v=5",
  "./public/data/civil-law-2007.js?v=5",
  "./public/data/civil-law-2008.js?v=5",
  "./public/data/civil-law-2009.js?v=5",
  "./public/data/civil-law-2010.js?v=5",
  "./public/data/civil-law-2011.js?v=5",
  "./public/data/civil-law-2012.js?v=5",
  "./public/data/civil-law-2013.js?v=5",
  "./public/data/civil-law-2014.js?v=5",
  "./public/data/civil-law-2015.js?v=5",
  "./public/data/civil-law-2016.js?v=5",
  "./public/data/civil-law-2017.js?v=5",
  "./public/data/civil-law-2018.js?v=5",
  "./public/data/civil-law-2019.js?v=5",
  "./public/data/civil-law-2020.js?v=5",
  "./public/data/civil-law-2021.js?v=5",
  "./public/data/civil-law-2022.js?v=5",
  "./public/data/civil-law-2023.js?v=5",
  "./public/data/civil-law-2024.js?v=5",
  "./public/data/civil-law-2025.js?v=5",
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
