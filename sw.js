const CACHE="quran-player-shell-v1";
const SHELL=["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./assets/icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!=="quran-audio-v1").map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
 const url=new URL(e.request.url);
 if(url.origin===location.origin){e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match("./index.html"))));return}
 if(e.request.destination==="audio"){e.respondWith(caches.open("quran-audio-v1").then(c=>c.match(e.request).then(hit=>hit||fetch(e.request))))}
});
