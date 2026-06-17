/* Service worker · Simulador de Recría */
const CACHE = "recria-v3";
const SHELL = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  const isDoc = req.mode === "navigate" || url.pathname.endsWith("index.html") || url.pathname.endsWith("/");
  // Documento principal y precios.json: RED PRIMERO (siempre lo último), cae a cache sin internet.
  if (isDoc || url.pathname.endsWith("precios.json")) {
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  // Resto (íconos, manifest): cache primero.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
