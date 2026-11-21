const SHELL_CACHE = "quran-player-shell-v4";
const AUDIO_CACHE = "quran-audio-v1";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./assets/icon.svg"];

async function fetchAndCache(request, cacheKey = request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    // Bypass the browser HTTP cache so a deployed JS/CSS update is not masked
    // by an older response with a still-valid max-age header.
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok && response.type === "basic") {
      await cache.put(cacheKey, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(cacheKey);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.all(SHELL.map(async path => {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (!response.ok) throw new Error("Failed to precache " + path);
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("quran-player-shell-") && key !== SHELL_CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") {
      event.respondWith((async () => {
        try {
          const response = await fetch(request, { cache: "no-store" });
          if (response.ok) {
            const cache = await caches.open(SHELL_CACHE);
            await cache.put("./index.html", response.clone());
          }
          return response;
        } catch (_) {
          return (await caches.match("./index.html")) || Response.error();
        }
      })());
      return;
    }

    // Network-first for the application shell: users get current HTML, JS,
    // and CSS whenever online; cached assets remain an offline fallback.
    event.respondWith(fetchAndCache(request).catch(() => Response.error()));
    return;
  }

  if (request.destination === "audio") {
    event.respondWith((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const cached = await cache.match(request) || await cache.match(url.href);
      if (cached) return cached;
      return fetch(request);
    })());
  }
});
