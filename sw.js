const SHELL_CACHE = "quran-player-shell-v3";
const AUDIO_CACHE = "quran-audio-v1";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./assets/icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL);
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
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put("./index.html", response.clone()).catch(() => {});
          }
          return response;
        } catch (_) {
          return (await caches.match("./index.html")) || Response.error();
        }
      })());
      return;
    }

    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return Response.error();
      }
    })());
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
