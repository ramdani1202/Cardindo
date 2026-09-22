/*
  ============================================================
  KONOHA CARD COLLECTION — DATA KARTU
  ============================================================
  INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT UNTUK NAMBAH/GANTI KARTU.

  CARA PAKAI GAMBAR DARI GITHUB:
  1. Buat repo GitHub (boleh public), contoh: "konoha-cards"
  2. Buat folder "cards" di dalam repo itu, upload gambar kartu ke situ
     (format nama bebas, disarankan huruf kecil tanpa spasi, contoh: broco.png)
  3. Buka file gambar itu di GitHub, klik tombol "Raw"
  4. Copy URL yang muncul di address bar, bentuknya seperti:
     https://raw.githubusercontent.com/USERNAME/konoha-cards/main/cards/broco.png
  5. Tempel URL itu ke field "image" di bawah, untuk kartu yang sesuai.

  Kalau field "image" dikosongkan (""), game otomatis pakai gambar
  placeholder warna-warni supaya tetap bisa dites sebelum gambar asli siap.

  RARITY yang valid: "common", "rare", "epic", "legendary"
  (mempengaruhi warna border, efek glow, dan peluang muncul di reward)

  POWER: angka 1-100, dipakai untuk battle (lebih tinggi = lebih kuat)
  ============================================================
*/

const CARD_DATABASE = [
  {
    id: "card001",
    name: "SANG BIROKRAT",
    tagline: "Tanda tangan dulu, baru mikir",
    rarity: "common",
    power: 42,
    faction: "Birokrasi",
    color: "#5B8DEF", // warna solid background kartu ini
    image: "" // <-- tempel link raw GitHub di sini
  },
  {
    id: "card002",
    name: "TAIPAN BETON",
    tagline: "Bangun mall di atas sawah",
    rarity: "rare",
    power: 58,
    faction: "Konglomerat",
    color: "#2D9CDB",
    image: ""
  },
  {
    id: "card003",
    name: "MENTERI BAYANGAN",
    tagline: "Nggak kelihatan, tapi berkuasa",
    rarity: "epic",
    power: 71,
    faction: "Birokrasi",
    color: "#6C5DD3",
    image: ""
  },
  {
    id: "card004",
    name: "BOS ORMAS",
    tagline: "Preman berdasi",
    rarity: "rare",
    power: 55,
    faction: "Jalanan",
    color: "#EB5757",
    image: ""
  },
  {
    id: "card005",
    name: "RAJA SAWIT",
    tagline: "Hutan jadi duit",
    rarity: "epic",
    power: 68,
    faction: "Konglomerat",
    color: "#219653",
    image: ""
  },
  {
    id: "card006",
    name: "JURU BICARA",
    tagline: "Pandai membolak-balik kata",
    rarity: "common",
    power: 38,
    faction: "Birokrasi",
    color: "#F2994A",
    image: ""
  },
  {
    id: "card007",
    name: "CUKONG SENYAP",
    tagline: "Namanya nggak pernah muncul",
    rarity: "legendary",
    power: 88,
    faction: "Konglomerat",
    color: "#1E1B2E",
    image: ""
  },
  {
    id: "card008",
    name: "ANGGOTA DEWAN",
    tagline: "Studi banding ke luar negeri",
    rarity: "common",
    power: 40,
    faction: "Birokrasi",
    color: "#56CCF2",
    image: ""
  },
  {
    id: "card009",
    name: "MAKELAR PROYEK",
    tagline: "Potongan di atas potongan",
    rarity: "rare",
    power: 52,
    faction: "Jalanan",
    color: "#BB6BD9",
    image: ""
  },
  {
    id: "card010",
    name: "PENGUASA MEDIA",
    tagline: "Narasi ada di tangan saya",
    rarity: "epic",
    power: 74,
    faction: "Konglomerat",
    color: "#EB5757",
    image: ""
  },
  {
    id: "card011",
    name: "DIRJEN KERTAS",
    tagline: "Semua butuh stempel saya",
    rarity: "common",
    power: 36,
    faction: "Birokrasi",
    color: "#F2C94C",
    image: ""
  },
  {
    id: "card012",
    name: "BOS TAMBANG",
    tagline: "Gunung jadi lubang",
    rarity: "legendary",
    power: 90,
    faction: "Konglomerat",
    color: "#4B3FA8",
    image: ""
  }
];

// Peluang kemunculan kartu berdasarkan rarity saat reward dibuka
// (Total tidak harus 100, ini bobot relatif)
const RARITY_WEIGHTS = {
  common: 55,
  rare: 28,
  epic: 13,
  legendary: 4
};

const RARITY_COLORS = {
  common: { bg: "#4a5568", glow: "#718096", label: "Common" },
  rare: { bg: "#2b6cb0", glow: "#4299e1", label: "Rare" },
  epic: { bg: "#6b21a8", glow: "#a855f7", label: "Epic" },
  legendary: { bg: "#b45309", glow: "#fbbf24", label: "Legendary" }
};
