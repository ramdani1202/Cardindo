/* ==========================================================
   KONOHA CARD COLLECTION — APP LOGIC
   ========================================================== */

const STORAGE_KEY = "konoha_owned_cards_v1";

let ownedCardIds = loadOwnedCards();
let selectedCardId = null;
let currentFilter = "all";

// ---------------- PERSISTENCE ----------------
function loadOwnedCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Kartu pertama diberikan gratis biar user langsung bisa battle
      const starter = [CARD_DATABASE[0].id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [CARD_DATABASE[0].id];
  }
}

function saveOwnedCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedCardIds));
}

function isOwned(cardId) {
  return ownedCardIds.includes(cardId);
}

// ---------------- HELPERS ----------------
function getCard(id) {
  return CARD_DATABASE.find(c => c.id === id);
}

function placeholderGradient(card) {
  // Warna deterministik dari id supaya konsisten tiap render
  const colors = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  return `linear-gradient(150deg, ${colors.bg}, ${colors.glow})`;
}

function cardVisualStyle(card) {
  if (card.image && card.image.trim() !== "") {
    return `background-image: url('${card.image}'); background-size: cover; background-position: center;`;
  }
  return `background: ${placeholderGradient(card)};`;
}

// ---------------- RENDER: TOP STATS ----------------
function renderStats() {
  document.getElementById("statOwned").textContent = ownedCardIds.length;
  document.getElementById("statTotal").textContent = CARD_DATABASE.length;
}

// ---------------- RENDER: DECK PICKER (battle view) ----------------
function renderDeckPicker() {
  const wrap = document.getElementById("deckScroll");
  wrap.innerHTML = "";

  const owned = CARD_DATABASE.filter(c => isOwned(c.id));

  owned.forEach(card => {
    const el = document.createElement("button");
    el.className = "mini-card" + (card.id === selectedCardId ? " selected" : "");
    el.style.cssText = cardVisualStyle(card);
    el.innerHTML = `
      <div class="mini-card-name">${card.name}</div>
      <div class="mini-card-power">PWR ${card.power}</div>
    `;
    el.addEventListener("click", () => selectCard(card.id));
    wrap.appendChild(el);
  });
}

function selectCard(cardId) {
  selectedCardId = cardId;
  const card = getCard(cardId);

  const slot = document.getElementById("playerCardSlot");
  slot.innerHTML = renderFullCard(card);

  document.getElementById("btnBattle").disabled = false;
  document.getElementById("btnBattle").textContent = "Mulai Battle";

  renderDeckPicker();
}

function renderFullCard(card) {
  const colors = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  return `
    <div class="full-card" style="${cardVisualStyle(card)}">
      <div class="full-card-top">
        <span class="full-card-rarity" style="background:${colors.bg}">${colors.label}</span>
        <span class="full-card-power">${card.power}</span>
      </div>
      <div class="full-card-bottom">
        <div class="full-card-name">${card.name}</div>
        <div class="full-card-tagline">${card.tagline}</div>
      </div>
    </div>
  `;
}

// ---------------- BATTLE LOGIC ----------------
function pickEnemyCard() {
  // Musuh dipilih random dari seluruh database (termasuk yang belum dimiliki)
  const idx = Math.floor(Math.random() * CARD_DATABASE.length);
  return CARD_DATABASE[idx];
}

function weightedRandomCard(excludeIds) {
  const pool = CARD_DATABASE.filter(c => !excludeIds.includes(c.id));
  if (pool.length === 0) return null;

  const weighted = [];
  pool.forEach(card => {
    const weight = RARITY_WEIGHTS[card.rarity] || 10;
    weighted.push({ card, weight });
  });

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const w of weighted) {
    rand -= w.weight;
    if (rand <= 0) return w.card;
  }
  return weighted[weighted.length - 1].card;
}

function runBattle() {
  if (!selectedCardId) return;

  const playerCard = getCard(selectedCardId);
  const enemyCard = pickEnemyCard();

  const enemySlot = document.getElementById("enemyCardSlot");
  enemySlot.innerHTML = renderFullCard(enemyCard);

  document.getElementById("btnBattle").disabled = true;
  document.getElementById("btnBattle").textContent = "Battle berlangsung...";

  // Sedikit delay biar terasa ada "proses battle"
  setTimeout(() => {
    // Power + sedikit random factor biar tidak selalu prediktif
    const playerRoll = playerCard.power + (Math.random() * 20 - 10);
    const enemyRoll = enemyCard.power + (Math.random() * 20 - 10);
    const won = playerRoll >= enemyRoll;

    showBattleResult(won);
  }, 900);
}

function showBattleResult(won) {
  const modal = document.getElementById("battleModal");
  const icon = document.getElementById("modalIcon");
  const title = document.getElementById("modalTitle");
  const subtitle = document.getElementById("modalSubtitle");
  const rewardWrap = document.getElementById("rewardCardWrap");

  rewardWrap.innerHTML = "";

  if (won) {
    icon.textContent = "🏆";
    title.textContent = "Menang!";

    const newCard = weightedRandomCard(ownedCardIds);

    if (newCard) {
      ownedCardIds.push(newCard.id);
      saveOwnedCards();
      subtitle.textContent = "Kartu baru terbuka";
      rewardWrap.innerHTML = renderFullCard(newCard);
    } else {
      subtitle.textContent = "Semua kartu sudah kamu punya!";
    }
  } else {
    icon.textContent = "💥";
    title.textContent = "Kalah";
    subtitle.textContent = "Coba lagi dengan kartu lain";
  }

  modal.classList.add("show");

  renderStats();
  renderDeckPicker();
  renderCollectionGrid();
}

function closeBattleModal() {
  document.getElementById("battleModal").classList.remove("show");

  // Reset arena untuk battle berikutnya
  document.getElementById("enemyCardSlot").innerHTML = `<div class="card-empty">?</div>`;
  document.getElementById("btnBattle").disabled = !selectedCardId;
  document.getElementById("btnBattle").textContent = selectedCardId ? "Mulai Battle" : "Pilih kartu dulu";
}

// ---------------- RENDER: COLLECTION GRID ----------------
function renderCollectionGrid() {
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";

  let list = CARD_DATABASE;
  if (currentFilter !== "all") {
    list = list.filter(c => c.rarity === currentFilter);
  }

  list.forEach(card => {
    const owned = isOwned(card.id);
    const el = document.createElement("div");
    el.className = "mini-card" + (owned ? "" : " mini-card-locked");
    el.style.cssText = owned ? cardVisualStyle(card) : `background: ${placeholderGradient(card)};`;
    el.innerHTML = `
      <div class="mini-card-name">${owned ? card.name : "???"}</div>
      <div class="mini-card-power">${owned ? "PWR " + card.power : RARITY_COLORS[card.rarity].label}</div>
    `;
    grid.appendChild(el);
  });

  const total = CARD_DATABASE.length;
  const ownedCount = ownedCardIds.length;
  const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressText").textContent = `${ownedCount} dari ${total} kartu terkumpul`;
}

// ---------------- NAVIGATION ----------------
function switchView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById("view-" + viewName).classList.add("active");
  document.querySelector(`.tab-btn[data-view="${viewName}"]`).classList.add("active");

  if (viewName === "collection") renderCollectionGrid();
}

// ---------------- EVENT LISTENERS ----------------
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

document.getElementById("btnBattle").addEventListener("click", runBattle);
document.getElementById("modalCloseBtn").addEventListener("click", closeBattleModal);

document.querySelectorAll(".filter-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentFilter = chip.dataset.filter;
    renderCollectionGrid();
  });
});

// ---------------- INIT ----------------
function init() {
  document.getElementById("statTotal").textContent = CARD_DATABASE.length;
  renderStats();
  renderDeckPicker();
  renderCollectionGrid();
}

init();

// ==========================================================
// PWA: SERVICE WORKER REGISTRATION + AUTO-UPDATE
// ==========================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => {

      // Cek update setiap kali app dibuka/aktif kembali
      reg.update();

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update();
      });

      // Ketika service worker baru ditemukan & siap dipakai
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // Ada versi baru siap pakai -> minta dia langsung aktif
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch(err => console.warn("SW registration failed:", err));

    // Saat service worker baru sudah mengambil alih, reload otomatis
    let refreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshed) return;
      refreshed = true;
      window.location.reload();
    });
  });
}
