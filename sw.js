/* ==========================================================
   SERVICE WORKER — Konoha Card Collection
   ==========================================================
   TUJUAN: App tetap bisa dibuka offline, TAPI kalau ada koneksi
   internet dan kamu baru saja update kode di GitHub/hosting,
   user yang sudah install akan otomatis dapat versi terbaru
   tanpa perlu kamu naikkan nomor versi manual.

   CARA KERJA:
   - Nama cache pakai timestamp saat file ini pertama dieksekusi
     oleh browser sebagai worker baru (bukan yang kamu set manual).
   - Untuk file penting (html/js/css), strategi "network-first":
     coba ambil versi terbaru dari server dulu; kalau berhasil,
     simpan ke cache & pakai itu. Kalau offline, baru fallback ke cache.
   - Untuk gambar kartu (dari GitHub), strategi "cache-first" supaya
     hemat kuota & tetap muncul walau offline, tapi tetap dicek ulang
     di background.
   - Browser otomatis mengecek file sw.js ini tiap kali app dibuka;
     kalau ISI file ini berubah (byte berbeda), browser akan anggap
     ini "service worker baru" dan proses update berjalan otomatis.
   ========================================================== */

const BUILD_ID = "2026-09-23-01"; // <-- ganti string ini tiap kamu deploy perubahan (lihat README)
const CACHE_NAME = "konoha-cache-" + BUILD_ID;

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./cards-data.js",
  "./card-illustrations.js",
  "./manifest.json"
];

// ---------------- INSTALL ----------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  // Jangan skipWaiting otomatis di sini — kita tunggu sinyal dari app.js
  // supaya update terjadi dengan mulus (dan bisa trigger reload terkontrol)
});

// ---------------- ACTIVATE ----------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ---------------- MESSAGE (dari app.js, untuk aktivasi cepat) ----------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ---------------- FETCH ----------------
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  const isAppShellFile =
    url.origin === self.location.origin &&
    (req.mode === "navigate" ||
      APP_SHELL.some(path => url.pathname.endsWith(path.replace("./", "/"))) ||
      url.pathname.endsWith(".html") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css"));

  if (isAppShellFile) {
    // NETWORK-FIRST: selalu coba ambil versi terbaru dulu
    event.respondWith(
      fetch(req)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // CACHE-FIRST untuk aset lain (gambar kartu dari GitHub, dsb)
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
