# Konoha Card Collection — PWA Trading Card Battle

## Isi folder ini

```
konoha-card-game/
├── index.html        → struktur halaman
├── style.css          → semua tampilan/desain
├── app.js              → logic game (battle, koleksi, dsb)
├── cards-data.js  → ⭐ FILE YANG KAMU EDIT untuk nambah/ubah kartu
├── card-illustrations.js → generator ilustrasi SVG otomatis per kartu
├── manifest.json → info PWA (nama, ikon, warna)
├── sw.js                  → service worker (offline + auto-update)
└── icons/               → ikon app (placeholder, ganti nanti)
```

---

## 1. Cara menambahkan kartu baru / ganti gambar

Kamu **hanya perlu edit file `cards-data.js`**. Tidak perlu sentuh file lain.

### Upload gambar ke GitHub
1. Buat repo GitHub (public), misalnya `konoha-cards`
2. Buat folder `cards/` di repo itu
3. Upload gambar kartu kamu ke situ (contoh: `broco.png`, `taipan.png`)
4. Klik gambar itu di GitHub → tombol **"Raw"** → copy URL di address bar

URL raw biasanya berbentuk:
```
https://raw.githubusercontent.com/USERNAME/konoha-cards/main/cards/broco.png
```

### Tempel ke cards-data.js
Buka `cards-data.js`, cari kartu yang mau diisi gambarnya, isi field `image`:

```js
{
  id: "card001",
  name: "SANG BIROKRAT",
  tagline: "Tanda tangan dulu, baru mikir",
  rarity: "common",       // common | rare | epic | legendary
  power: 42,                    // 1-100
  faction: "Birokrasi",
  image: "https://raw.githubusercontent.com/USERNAME/konoha-cards/main/cards/broco.png"
}
```

### Menambah kartu baru sepenuhnya
Copy-paste blok `{ ... }` di atas, ganti `id` dengan yang unik (contoh `card013`), isi field lainnya.

**Tidak ada batas jumlah kartu** — tambah sebanyak yang kamu mau.

---

## 2. Cara deploy (supaya bisa diakses & di-install lewat Chrome)

PWA **wajib di-host lewat HTTPS** (tidak bisa langsung buka file dari HP). Opsi termudah, gratis:

### Opsi A — GitHub Pages (paling simpel, satu repo untuk semua)
1. Upload semua isi folder ini (`index.html`, `style.css`, dst) ke repo GitHub yang sama dengan gambar kartu kamu (atau repo terpisah, bebas)
2. Buka repo → **Settings → Pages**
3. Pilih branch `main`, folder `/ (root)` → Save
4. Tunggu 1-2 menit, GitHub kasih URL seperti:
   ```
   https://USERNAME.github.io/konoha-card-game/
   ```
5. Buka URL itu di **Chrome HP** → akan muncul opsi "Tambahkan ke layar Utama" / "Install app"

### Opsi B — Netlify / Vercel (drag & drop, juga gratis)
1. Buka netlify.com atau vercel.com, daftar
2. Drag folder ini ke area upload mereka
3. Dapat URL otomatis, langsung bisa diakses

---

## 3. Cara kerja auto-update (PENTING dibaca)

Kamu **tidak perlu menaikkan nomor versi manual** untuk update biasa (nambah kartu, ubah power, ubah teks, dll).

**Kenapa bisa begitu:**
Service worker (`sw.js`) diatur pakai strategi *network-first* untuk semua file inti app (`index.html`, `app.js`, `style.css`, `cards-data.js`). Artinya setiap kali user membuka app:
1. App otomatis mencoba ambil versi **terbaru** dari server dulu
2. Kalau berhasil (ada internet), versi terbaru itu yang dipakai & disimpan ulang ke cache
3. Kalau gagal (offline), baru pakai versi yang tersimpan di cache (biar app tetap jalan meski tanpa internet)

Jadi alurnya: **kamu push perubahan ke GitHub → user buka app → otomatis dapat versi terbaru.** Tidak ada tombol atau setting tambahan yang perlu kamu sentuh.

### Kapan kamu PERLU edit `sw.js`?
Hanya dalam 1 kasus: kalau update terasa "nyangkut" (jarang terjadi, biasanya karena browser cache internal yang keras kepala). Solusinya, buka `sw.js`, cari baris ini di paling atas:
```js
const BUILD_ID = "2026-09-23-01";
```
Ganti angka/teksnya (misal jadi `2026-09-24-01`), lalu push. Ini akan memaksa semua cache lama dibuang total.

---

## 4. Menjalankan/test secara lokal (di komputer, sebelum deploy)

Kalau kamu punya Python terinstall:
```bash
cd konoha-card-game
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

> Catatan: fitur "install PWA" biasanya butuh HTTPS asli, jadi untuk test instalasi ke HP, tetap perlu deploy dulu (lihat bagian 2).

---

## 5. Mengganti ikon app

File di folder `icons/` sekarang masih placeholder (kartu abstrak merah-kuning). Untuk ganti:
1. Siapkan gambar logo kamu, ukuran **512x512px** dan **192x192px**, format PNG
2. Ganti nama file jadi `icon-512.png`, `icon-192.png`, `icon-maskable-512.png` (boleh sama persis dengan yang 512)
3. Timpa file yang ada di folder `icons/`

**Tips untuk maskable icon:** biarkan ada ruang kosong/padding di sekeliling logo (sekitar 20% dari tepi), karena Android akan memotong bentuknya jadi lingkaran/rounded-square.

---

## 6. Battle system saat ini

- Battle pakai perbandingan **power** kartu kamu vs kartu musuh (musuh dipilih random dari seluruh database)
- Ada sedikit faktor acak (±10) supaya tidak selalu bisa ditebak dari angka power saja
- Menang → dapat 1 kartu random baru (kartu yang sudah kamu punya tidak akan dobel), dengan peluang berdasar rarity (diatur di `RARITY_WEIGHTS` dalam `cards-data.js`)
- Kalah → tidak dapat apa-apa, bisa coba lagi

Kalau nanti mau upgrade ke battle system turn-based (attack/defense bergantian), tinggal bilang — struktur kode sudah dipisah rapi jadi gampang dikembangkan.
