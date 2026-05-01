import { defineConfig } from "vite";

const CACHE_VERSION = process.env.npm_package_version ?? "0.1.0";
const PUBLIC_ASSETS = [
  "manifest.webmanifest",
  "favicon.svg",
  "apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
];

function createServiceWorkerSource(precacheUrls) {
  return `const CACHE_NAME = "kanji-deck-${CACHE_VERSION}";
const APP_SHELL_URL = new URL("./index.html", self.registration.scope).href;
const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((cacheKey) => cacheKey !== CACHE_NAME)
          .map((cacheKey) => caches.delete(cacheKey))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          return (
            (await caches.match(request)) ||
            (await caches.match(APP_SHELL_URL))
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        return cachedResponse || Response.error();
      }
    })()
  );
});
`;
}

function kanjiDeckPwaPlugin() {
  return {
    name: "kanji-deck-pwa",
    apply: "build",
    generateBundle(_options, bundle) {
      const precacheUrls = [
        "./",
        "./index.html",
        ...PUBLIC_ASSETS.map((fileName) => `./${fileName}`),
      ];

      for (const fileName of Object.keys(bundle)) {
        if (fileName === "sw.js") {
          continue;
        }

        precacheUrls.push(`./${fileName}`);
      }

      const uniquePrecacheUrls = [...new Set(precacheUrls)].sort();

      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: createServiceWorkerSource(uniquePrecacheUrls),
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [kanjiDeckPwaPlugin()],
});
