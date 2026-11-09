// Service worker sederhana: jaringan dulu, cadangan dari cache jika offline. PDF/Supabase tidak di-cache.
const CACHE = "afu-v8";
const SHELL = ["./", "index.html", "css/style.css", "js/common.js", "js/app.js", "js/tryout.js", "js/assistant.js", "js/config.js", "assets/logo.png", "assets/mascot-wave.webp", "assets/mascot-face.webp"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match("index.html"))));
});
