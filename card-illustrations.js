/* ==========================================================
   KONOHA CARD COLLECTION — SVG CHARACTER GENERATOR
   ==========================================================
   Menghasilkan ilustrasi karakter SVG sederhana bergaya flat
   (mirip referensi: bentuk geometris bold, mata besar, warna
   solid) secara otomatis dari "id" kartu — supaya tiap kartu
   punya tampilan unik & konsisten tanpa perlu gambar asli dulu.

   Begitu kamu isi field "image" di cards-data.js dengan URL
   gambar asli, ilustrasi SVG ini otomatis digantikan gambar itu.
   ========================================================== */

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Palet bentuk kepala/badan karakter (silhouette sederhana ala referensi)
const BODY_SHAPES = ["blob", "square", "dome", "diamond"];

function generateCardSVG(card) {
  const seed = hashSeed(card.id);
  const rand = seededRandom(seed);

  const bodyShape = BODY_SHAPES[Math.floor(rand() * BODY_SHAPES.length)];
  const faceColor = "#1E1B2E";
  const skinTone = pickSkinTone(rand);
  const eyeCount = rand() > 0.85 ? 1 : 2;
  const hasAccessory = rand() > 0.5;
  const accessoryType = ["cap", "tie", "glasses", "none"][Math.floor(rand() * 4)];

  const bodyPath = getBodyShape(bodyShape);
  const decorations = generateDecorations(rand, seed);

  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.55">${decorations}</g>
      <g transform="translate(100 108)">
        ${bodyPath(skinTone)}
        ${generateEyes(eyeCount, faceColor)}
        ${hasAccessory ? generateAccessory(accessoryType, rand) : ""}
      </g>
    </svg>
  `;
}

function pickSkinTone(rand) {
  const tones = ["#FFFFFF", "#FFE8D6", "#F5F3EE", "#FFD9E8", "#E8F4FF"];
  return tones[Math.floor(rand() * tones.length)];
}

function getBodyShape(shape) {
  const shapes = {
    blob: (fill) => `
      <path d="M-48,-10 C-50,-55 -25,-72 0,-72 C25,-72 50,-55 48,-10
               C50,25 32,58 0,58 C-32,58 -50,25 -48,-10 Z"
            fill="${fill}" stroke="${'#1E1B2E'}" stroke-width="5" stroke-linejoin="round"/>
    `,
    square: (fill) => `
      <rect x="-46" y="-58" width="92" height="108" rx="18"
            fill="${fill}" stroke="#1E1B2E" stroke-width="5"/>
    `,
    dome: (fill) => `
      <path d="M-50,20 C-50,-38 -28,-70 0,-70 C28,-70 50,-38 50,20
               C50,48 28,58 0,58 C-28,58 -50,48 -50,20 Z"
            fill="${fill}" stroke="#1E1B2E" stroke-width="5" stroke-linejoin="round"/>
    `,
    diamond: (fill) => `
      <path d="M0,-72 L52,-6 L38,54 L-38,54 L-52,-6 Z"
            fill="${fill}" stroke="#1E1B2E" stroke-width="5" stroke-linejoin="round"/>
    `
  };
  return shapes[shape] || shapes.blob;
}

function generateEyes(count, color) {
  if (count === 1) {
    return `
      <circle cx="0" cy="-8" r="19" fill="white" stroke="${color}" stroke-width="4"/>
      <circle cx="4" cy="-6" r="8" fill="${color}"/>
      <circle cx="7" cy="-9" r="2.5" fill="white"/>
    `;
  }
  return `
    <circle cx="-20" cy="-8" r="13" fill="white" stroke="${color}" stroke-width="4"/>
    <circle cx="-17" cy="-6" r="5.5" fill="${color}"/>
    <circle cx="20" cy="-8" r="13" fill="white" stroke="${color}" stroke-width="4"/>
    <circle cx="23" cy="-6" r="5.5" fill="${color}"/>
    <path d="M-14,22 Q0,32 14,22" stroke="${color}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  `;
}

function generateAccessory(type, rand) {
  const accessories = {
    cap: `<path d="M-40,-58 Q0,-85 40,-58 L46,-42 L-46,-42 Z" fill="#1E1B2E"/>
          <rect x="-46" y="-46" width="92" height="10" rx="5" fill="#1E1B2E"/>`,
    tie: `<path d="M-8,55 L8,55 L14,75 L0,95 L-14,75 Z" fill="#F5A623" stroke="#1E1B2E" stroke-width="3"/>`,
    glasses: `<rect x="-34" y="-18" width="26" height="20" rx="6" fill="none" stroke="#1E1B2E" stroke-width="4.5"/>
              <rect x="8" y="-18" width="26" height="20" rx="6" fill="none" stroke="#1E1B2E" stroke-width="4.5"/>
              <line x1="-8" y1="-9" x2="8" y2="-9" stroke="#1E1B2E" stroke-width="4.5"/>`,
    none: ""
  };
  return accessories[type] || "";
}

function generateDecorations(rand, seed) {
  const shapes = [];
  const count = 4 + Math.floor(rand() * 3);
  const positions = [
    [-75, -75], [75, -75], [-80, 40], [80, 40], [-75, 90], [75, 90], [0, -95]
  ];

  for (let i = 0; i < count; i++) {
    const [x, y] = positions[i % positions.length];
    const type = Math.floor(rand() * 4);
    const size = 6 + rand() * 8;

    if (type === 0) {
      shapes.push(`<circle cx="${x}" cy="${y}" r="${size / 2}" fill="white"/>`);
    } else if (type === 1) {
      shapes.push(`<rect x="${x - size/2}" y="${y - size/2}" width="${size}" height="${size}" fill="white" transform="rotate(45 ${x} ${y})"/>`);
    } else if (type === 2) {
      shapes.push(`<path d="M${x},${y-size/2} L${x+size/2},${y+size/2} L${x-size/2},${y+size/2} Z" fill="white"/>`);
    } else {
      shapes.push(`<path d="M${x-size/2},${y} L${x+size/2},${y} M${x},${y-size/2} L${x},${y+size/2}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`);
    }
  }
  return shapes.join("");
}
