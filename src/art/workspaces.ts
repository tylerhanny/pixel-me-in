/** Original workspace art. Hard pixel edges, quiet scenery, bright playable silhouettes. */
type Ctx = CanvasRenderingContext2D;
const ink = '#171c2a';
function r(c: Ctx, color: string, x: number, y: number, w: number, h: number) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function poly(c: Ctx, color: string, points: number[][]) {
  c.fillStyle = color;
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
}
function disc(c: Ctx, color: string, x: number, y: number, radius: number) {
  for (let dy = -radius; dy <= radius; dy++) {
    const half = Math.floor(Math.sqrt(radius * radius - dy * dy));
    r(c, color, x - half, y + dy, half * 2 + 1, 1);
  }
}
function panel(
  c: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  face: string,
  light: string,
  shade: string,
) {
  r(c, ink, x, y, w, h);
  r(c, face, x + 2, y + 2, w - 4, h - 4);
  r(c, light, x + 2, y + 2, w - 4, 2);
  r(c, light, x + 2, y + 4, 2, h - 6);
  r(c, shade, x + w - 4, y + 4, 2, h - 6);
  r(c, shade, x + 4, y + h - 4, w - 8, 2);
}

export function deskFar(c: Ctx) {
  // Warm wall panels and a moonlit window recede behind the amber task lamp.
  r(c, '#3b2c37', 0, 0, 512, 180);
  for (let x = 0; x < 512; x += 128) {
    r(c, '#48343e', x, 0, 2, 180);
    r(c, '#302632', x + 3, 0, 1, 180);
  }
  panel(c, 14, 14, 112, 118, '#2c354e', '#66515a', '#211e2d');
  r(c, '#202c46', 21, 21, 98, 102);
  for (let x = 24; x < 117; x += 15) {
    const h = 18 + ((x * 7) % 29);
    r(c, '#34405a', x, 119 - h, 12, h);
    r(c, '#8b7d70', x + 3, 123 - h, 2, 2);
  }
  disc(c, '#b7b4a5', 96, 39, 9);
  disc(c, '#202c46', 100, 35, 8);
  r(c, '#51434b', 20, 72, 100, 4);
  r(c, '#51434b', 68, 20, 4, 106);
  r(c, '#7f625e', 12, 132, 117, 5);
  // Large monitor, bevels, inset screen, quiet editor panes and a memory readout.
  r(c, '#29222e', 152, 160, 274, 8);
  panel(c, 146, 18, 278, 138, '#383d4b', '#777b7c', '#242b38');
  r(c, '#111d2d', 154, 26, 262, 118);
  r(c, '#24374a', 156, 28, 258, 13);
  for (let x = 161; x < 177; x += 6) r(c, '#6a8a94', x, 32, 3, 3);
  r(c, '#3e5d6d', 188, 32, 80, 3);
  r(c, '#192838', 156, 43, 44, 98);
  for (let i = 0; i < 9; i++) {
    r(c, '#3b5366', 162, 49 + i * 9, 3, 3);
    r(c, '#344958', 170, 49 + i * 9, 20 + (i % 3) * 3, 2);
  }
  for (let i = 0; i < 10; i++) {
    const x = 211 + (i % 3) * 9,
      y = 49 + i * 7;
    r(c, ['#638d94', '#b49c77', '#7f8ba2'][i % 3], x, y, 24 + ((i * 17) % 66), 2);
    r(c, '#415a6c', x + 31 + ((i * 17) % 66), y, 19, 2);
  }
  r(c, '#1c3141', 208, 124, 194, 12);
  r(c, '#b69261', 212, 128, 118, 4);
  r(c, '#537c83', 334, 128, 62, 4);
  poly(c, '#283b4c', [
    [392, 43],
    [412, 43],
    [412, 118],
    [372, 118],
  ]);
  r(c, '#788485', 281, 149, 9, 2);
  r(c, '#444650', 274, 156, 23, 15);
  panel(c, 250, 171, 70, 7, '#55505a', '#85807c', '#302d39');
  // A pinned circuit sketch gives scale without posing as a collectible.
  panel(c, 447, 35, 49, 63, '#aa977d', '#ceba93', '#80685f');
  r(c, '#796e65', 453, 44, 34, 2);
  r(c, '#796e65', 458, 52, 22, 20);
  r(c, '#aa977d', 461, 55, 16, 14);
  r(c, '#796e65', 468, 72, 2, 13);
  for (let x = 455; x < 488; x += 7) r(c, '#796e65', x, 88, 4, 2);
  r(c, '#bc8d63', 468, 36, 6, 3);
  r(c, '#332832', 0, 178, 512, 2);
}

export function deskMid(c: Ctx) {
  // Keyboard: staggered keycaps and sculpted front edge.
  r(c, '#241f2b', 6, 174, 178, 6);
  poly(c, ink, [
    [16, 141],
    [167, 141],
    [182, 173],
    [4, 173],
  ]);
  poly(c, '#4b4b59', [
    [18, 143],
    [165, 143],
    [175, 168],
    [10, 168],
  ]);
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 14; col++) {
      const x = 20 + col * 10 - row * 2,
        y = 146 + row * 6;
      r(c, '#282c3c', x, y, 8, 5);
      r(c, '#8a8390', x, y, 7, 3);
      r(c, '#c6b9ae', x + 2, y + 1, 2, 1);
    }
  r(c, '#89818b', 49, 164, 62, 3);
  r(c, '#9a6e59', 12, 171, 158, 1);
  // Stacked notebooks, visible page edges; subdued behind the running lane.
  panel(c, 210, 157, 61, 17, '#8a654e', '#b5926b', '#573e3b');
  r(c, '#b5a18a', 215, 160, 51, 8);
  for (let y = 162; y < 169; y += 3) r(c, '#82796e', 218, y, 46, 1);
  panel(c, 218, 143, 47, 14, '#42666b', '#6e9692', '#293d4c');
  r(c, '#c2b29b', 225, 147, 35, 5);
  // Lamp: articulated metal arm, shaded hood and a quiet pool of warm light.
  poly(c, 'rgba(211,156,86,.12)', [
    [373, 78],
    [397, 78],
    [446, 176],
    [300, 176],
  ]);
  for (let i = 0; i < 40; i++) r(c, '#8d8178', 346 - i * 0.35, 158 - i, 4, 2);
  for (let i = 0; i < 40; i++) r(c, '#8d8178', 332 + i, 119 - i, 4, 2);
  disc(c, ink, 333, 119, 6);
  disc(c, '#a79783', 333, 119, 3);
  panel(c, 328, 164, 40, 10, '#625a5c', '#a2917e', '#383342');
  poly(c, ink, [
    [365, 66],
    [391, 66],
    [402, 84],
    [355, 84],
  ]);
  poly(c, '#8b7464', [
    [369, 68],
    [388, 68],
    [397, 80],
    [360, 80],
  ]);
  r(c, '#e6bb79', 359, 82, 40, 3);
  // Mouse with a coiled cord and highlight, not on the collision lane.
  for (let i = 0; i < 50; i++)
    r(c, '#48414c', 430 + i, 150 + Math.round(Math.sin(i / 8) * 5), 2, 2);
  disc(c, ink, 458, 163, 14);
  disc(c, '#736c79', 458, 162, 11);
  r(c, '#a99d9b', 453, 153, 4, 4);
  r(c, '#423d4c', 458, 150, 1, 13);
}

export function deskGround(c: Ctx, w: number) {
  r(c, '#725044', 0, 0, w, 60);
  r(c, '#dec29a', 0, 0, w, 2);
  r(c, '#b78a64', 0, 2, w, 7);
  r(c, '#956b50', 0, 9, w, 13);
  r(c, '#513a36', 0, 22, w, 5);
  r(c, '#392d31', 0, 27, w, 33);
  for (let x = 0; x < w; x += 42) {
    r(c, '#77513f', x, 14, 25, 1);
    r(c, '#bc946c', x + 9, 5, 22, 1);
  }
  r(c, '#67504a', 0, 29, w, 2);
  r(c, '#44353a', 0, 52, w, 8);
}

export function dataFar(c: Ctx) {
  r(c, '#101e30', 0, 0, 512, 180);
  for (let x = 0; x < 512; x += 128) {
    r(c, '#203044', x, 0, 5, 180);
    r(c, '#2e4357', x, 0, 1, 180);
    panel(c, x + 13, 16, 102, 164, '#1b3044', '#2c4154', '#0d192b');
    for (let y = 24; y < 172; y += 17) {
      panel(c, x + 19, y, 88, 14, '#223448', '#30465a', '#17283c');
      r(c, '#142437', x + 24, y + 5, 48, 4);
      for (let v = 0; v < 6; v++) r(c, '#2a3d51', x + 26 + v * 7, y + 5, 2, 4);
      r(c, '#446270', x + 88, y + 4, 3, 2);
      r(c, '#334c60', x + 94, y + 4, 3, 2);
      r(c, '#3b5266', x + 79, y + 8, 18, 1);
    }
    r(c, '#405f73', x + 49, 7, 27, 3);
  }
}

export function dataMid(c: Ctx) {
  r(c, '#152a3e', 0, 22, 512, 13);
  r(c, '#3c5569', 0, 23, 512, 2);
  r(c, '#253e51', 0, 27, 512, 5);
  for (let x = 0; x < 512; x += 64) {
    r(c, '#486174', x, 22, 3, 13);
    r(c, '#112234', x + 3, 22, 2, 13);
  }
  for (const x of [28, 292]) {
    r(c, '#101b2c', x + 8, 174, 112, 6);
    poly(c, '#132539', [
      [x + 92, 51],
      [x + 110, 62],
      [x + 110, 174],
      [x + 92, 174],
    ]);
    panel(c, x, 49, 96, 125, '#284155', '#405d70', '#142b40');
    r(c, '#172c40', x + 7, 57, 82, 109);
    for (let y = 62; y < 160; y += 22) {
      panel(c, x + 11, y, 73, 18, '#2a4054', '#385368', '#21384d');
      // Quiet rack vents; reserve the circular fan silhouette for the floor hazard.
      for (let row = 0; row < 3; row++) r(c, '#1c3043', x + 18, y + 5 + row * 3, 42, 1);
      r(c, '#456677', x + 71, y + 6, 2, 2);
      r(c, '#203648', x + 63, y + 12, 15, 2);
    }
    r(c, '#496a7b', x + 4, 57, 1, 108);
    r(c, '#375569', x + 88, 57, 1, 108);
  }
  r(c, '#183043', 0, 175, 512, 5);
  r(c, '#375569', 0, 175, 512, 1);
}

export function dataGround(c: Ctx, w: number) {
  r(c, '#263c50', 0, 0, w, 60);
  r(c, '#a3c3c7', 0, 0, w, 2);
  r(c, '#4c727e', 0, 2, w, 9);
  r(c, '#182c40', 0, 11, w, 3);
  r(c, '#345363', 0, 14, w, 15);
  r(c, '#142639', 0, 29, w, 31);
  for (let x = 0; x < w; x += 32) {
    r(c, '#1e374b', x, 3, 2, 25);
    r(c, '#71909a', x + 5, 5, 18, 1);
    for (let y = 18; y < 26; y += 3) r(c, '#172d40', x + 5, y, 20, 1);
  }
  r(c, '#425f70', 0, 31, w, 2);
  r(c, '#1c3144', 0, 52, w, 8);
}

export function mug(c: Ctx) {
  // Thick ceramic rim, handle, shadow and a printed lightning emblem.
  r(c, ink, 25, 12, 9, 17);
  r(c, '#dca97b', 28, 14, 4, 12);
  r(c, '#382c33', 28, 17, 3, 7);
  panel(c, 3, 7, 24, 29, '#e5c69d', '#fff0c6', '#b98059');
  r(c, '#fff0c6', 5, 6, 20, 3);
  r(c, '#6e473b', 7, 8, 16, 3);
  r(c, '#a77451', 8, 9, 13, 1);
  r(c, '#f7deba', 6, 13, 3, 16);
  r(c, '#c18d66', 22, 13, 2, 18);
  poly(c, '#326b72', [
    [15, 14],
    [21, 14],
    [17, 21],
    [21, 21],
    [12, 30],
    [14, 23],
    [10, 23],
  ]);
  r(c, '#c3b6a0', 10, 1, 2, 3);
  r(c, '#c3b6a0', 18, 2, 2, 3);
  r(c, ink, 5, 35, 20, 1);
}

export function headset(c: Ctx) {
  r(c, '#a2a0a3', 23, 0, 2, 11);
  r(c, ink, 10, 9, 28, 5);
  r(c, '#a98c76', 12, 10, 24, 2);
  r(c, ink, 6, 12, 7, 20);
  r(c, ink, 35, 12, 7, 20);
  r(c, '#697283', 8, 14, 3, 15);
  r(c, '#697283', 37, 14, 3, 15);
  for (const x of [2, 32]) {
    panel(c, x, 24, 14, 20, '#466879', '#a5ced0', '#263b50');
    r(c, '#e7b76e', x + 3, 27, 8, 3);
    r(c, '#1e3044', x + 4, 32, 7, 7);
    r(c, '#6d8e9b', x + 5, 33, 1, 5);
  }
  r(c, '#b6c6c3', 40, 41, 5, 2);
  r(c, '#b6c6c3', 25, 42, 16, 2);
  r(c, ink, 23, 40, 5, 4);
}

export function coolingUnit(c: Ctx) {
  panel(c, 0, 1, 34, 33, '#d99550', '#fff0c5', '#87503d');
  r(c, '#f6d58c', 3, 4, 28, 4);
  for (let x = 5; x < 29; x += 8) r(c, ink, x, 4, 3, 4);
  disc(c, ink, 17, 21, 10);
  disc(c, '#333b4a', 17, 21, 8);
  disc(c, '#fff0c5', 17, 21, 3);
  for (const [x, y, w, h] of [
    [16, 13, 3, 5],
    [20, 20, 5, 3],
    [15, 24, 3, 5],
    [9, 19, 5, 3],
  ])
    r(c, '#c2b6a5', x, y, w, h);
  r(c, '#fff0c5', 3, 12, 2, 2);
  r(c, '#fff0c5', 29, 29, 2, 2);
}

export function drone(c: Ctx) {
  r(c, ink, 0, 2, 16, 4);
  r(c, ink, 34, 2, 16, 4);
  r(c, '#d2e6df', 1, 2, 14, 2);
  r(c, '#d2e6df', 35, 2, 14, 2);
  r(c, '#8aaab4', 7, 6, 3, 8);
  r(c, '#8aaab4', 40, 6, 3, 8);
  r(c, ink, 7, 12, 36, 4);
  panel(c, 13, 9, 24, 18, '#d99550', '#fff0c5', '#87503d');
  r(c, ink, 17, 14, 16, 8);
  r(c, '#ff735a', 20, 16, 10, 3);
  r(c, '#fff1c7', 22, 16, 2, 2);
  r(c, '#f6d58c', 18, 27, 3, 4);
  r(c, '#f6d58c', 30, 27, 3, 4);
  r(c, '#eac17a', 22, 28, 7, 3);
}

export function ram(c: Ctx, rare = false) {
  // A broad luminous board, inset chips and a notched gold connector: unlike rack slots.
  panel(c, 0, 0, 26, 13, rare ? '#b69be1' : '#80dfa0', '#edffd5', rare ? '#715590' : '#379766');
  for (const x of [4, 11, 18]) {
    r(c, '#213d3c', x, 5, 4, 4);
    r(c, rare ? '#e5c8ff' : '#ccf8b9', x, 4, 4, 1);
  }
  r(c, '#f1cd83', 2, 12, 22, 2);
  for (let x = 2; x < 25; x += 3) if (x !== 11) r(c, '#ffe8a3', x, 14, 2, 2);
  r(c, ink, 11, 12, 3, 4);
  if (rare)
    for (let x = 2; x < 24; x += 4)
      r(c, ['#ffb897', '#ffe5a5', '#bdf5b3', '#aee9fa', '#dfb9ff'][Math.floor(x / 4)], x, 1, 4, 2);
}

/** Strong, distinct silhouettes inside a common hardware casing. */
export function power(c: Ctx, kind: 'shield' | 'magnet' | 'jetpack') {
  const col = kind === 'shield' ? '#e9b777' : kind === 'magnet' ? '#8edab3' : '#c6b4e5';
  poly(c, ink, [
    [7, 0],
    [21, 0],
    [28, 7],
    [28, 21],
    [21, 28],
    [7, 28],
    [0, 21],
    [0, 7],
  ]);
  poly(c, '#34485b', [
    [7, 2],
    [21, 2],
    [26, 7],
    [26, 21],
    [21, 26],
    [7, 26],
    [2, 21],
    [2, 7],
  ]);
  r(c, col, 8, 2, 12, 2);
  r(c, '#142536', 7, 24, 14, 2);
  if (kind === 'shield') {
    poly(c, col, [
      [7, 7],
      [21, 7],
      [20, 17],
      [14, 23],
      [8, 17],
    ]);
    r(c, '#754a43', 9, 10, 10, 2);
    r(c, '#754a43', 9, 14, 10, 2);
    r(c, '#754a43', 13, 8, 2, 3);
    r(c, '#754a43', 15, 12, 2, 3);
  } else if (kind === 'magnet') {
    r(c, col, 11, 6, 6, 10);
    poly(c, col, [
      [6, 14],
      [22, 14],
      [14, 22],
    ]);
    r(c, '#eff4d2', 12, 7, 2, 7);
    r(c, '#e4c088', 6, 23, 16, 1);
  } else {
    panel(c, 7, 7, 7, 13, col, '#f3e8e1', '#737391');
    panel(c, 15, 7, 7, 13, col, '#f3e8e1', '#737391');
    r(c, '#eaa06c', 9, 20, 3, 4);
    r(c, '#eaa06c', 17, 20, 3, 4);
    r(c, '#f8df94', 10, 20, 1, 3);
    r(c, '#f8df94', 18, 20, 1, 3);
  }
}
