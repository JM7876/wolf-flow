/* ═══════════════════════════════════════════════════════════
   QR Code Encoder — Pure JavaScript, Zero Dependencies
   ─────────────────────────────────────────────────────────
   Generates QR Code module matrices using error-correction
   level H (30%) so a center overlay (wolf emblem) can
   safely obscure up to ~25% of modules while still scanning.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */

// Galois field GF(256) primitives
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }

function polyMul(a, b) {
  const r = new Uint8Array(a.length + b.length - 1);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      r[i + j] ^= gfMul(a[i], b[j]);
  return r;
}

function ecPoly(n) {
  let g = new Uint8Array([1]);
  for (let i = 0; i < n; i++) g = polyMul(g, new Uint8Array([1, EXP[i]]));
  return g;
}

function ecEncode(data, ecLen) {
  const gen = ecPoly(ecLen);
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef) for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], coef);
  }
  return msg.slice(data.length);
}

// Version table: [version, totalCodewords, ecCodewordsPerBlock, numBlocksG1, dataPerBlockG1, numBlocksG2, dataPerBlockG2]
// Error correction level H
const VERSION_TABLE_H = [
  [1,  26, 17, 1, 9, 0, 0],
  [2,  44, 28, 1, 16, 0, 0],
  [3,  70, 22, 2, 13, 0, 0],
  [4,  100, 16, 4, 9, 0, 0],
  [5,  134, 22, 2, 11, 2, 12],
  [6,  172, 28, 2, 15, 2, 16],
  [7,  196, 26, 4, 13, 1, 14],
  [8,  242, 26, 4, 14, 2, 15],
  [9,  292, 24, 4, 12, 4, 13],
  [10, 346, 28, 6, 15, 2, 16],
  [11, 404, 24, 3, 12, 8, 13],
  [12, 466, 28, 7, 14, 4, 15],
  [13, 532, 22, 12, 11, 4, 12],
  [14, 581, 24, 11, 12, 5, 13],
  [15, 655, 24, 11, 12, 7, 13],
  [16, 733, 30, 3, 15, 13, 16],
  [17, 815, 28, 2, 14, 17, 15],
  [18, 901, 28, 2, 14, 19, 15],
  [19, 991, 26, 9, 13, 16, 14],
  [20, 1085, 28, 15, 15, 10, 16],
];

function getVersion(byteLen) {
  for (const row of VERSION_TABLE_H) {
    const [ver, total, ecPer, nb1, dpb1, nb2, dpb2] = row;
    const dataCap = nb1 * dpb1 + nb2 * dpb2;
    if (byteLen <= dataCap) return row;
  }
  return VERSION_TABLE_H[VERSION_TABLE_H.length - 1];
}

// Byte-mode encoding
function encodeData(text) {
  const bytes = new TextEncoder().encode(text);
  const [ver, total, ecPer, nb1, dpb1, nb2, dpb2] = getVersion(bytes.length);
  const dataCap = nb1 * dpb1 + nb2 * dpb2;

  // Build data codewords
  const bits = [];
  const pushBits = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };

  pushBits(0b0100, 4); // Byte mode
  const ccLen = ver <= 9 ? 8 : 16;
  pushBits(bytes.length, ccLen);
  for (const b of bytes) pushBits(b, 8);

  // Terminator
  const totalDataBits = dataCap * 8;
  const termLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, termLen);

  // Byte-align
  while (bits.length % 8 !== 0) bits.push(0);

  // Pad to capacity
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bits.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert to bytes
  const dataBytes = new Uint8Array(dataCap);
  for (let i = 0; i < dataCap; i++) {
    let val = 0;
    for (let b = 0; b < 8; b++) val = (val << 1) | (bits[i * 8 + b] || 0);
    dataBytes[i] = val;
  }

  // Split into blocks and compute EC
  const blocks = [];
  let offset = 0;
  for (let i = 0; i < nb1; i++) { blocks.push(dataBytes.slice(offset, offset + dpb1)); offset += dpb1; }
  for (let i = 0; i < nb2; i++) { blocks.push(dataBytes.slice(offset, offset + dpb2)); offset += dpb2; }

  const ecBlocks = blocks.map(b => ecEncode(b, ecPer));

  // Interleave data
  const interleaved = [];
  const maxData = Math.max(dpb1, dpb2 || 0);
  for (let i = 0; i < maxData; i++)
    for (const b of blocks) if (i < b.length) interleaved.push(b[i]);
  for (let i = 0; i < ecPer; i++)
    for (const b of ecBlocks) if (i < b.length) interleaved.push(b[i]);

  return { version: ver, codewords: interleaved };
}

// Alignment pattern positions
const ALIGN_POS = [
  [], [], [6,18], [6,22], [6,26], [6,30], [6,34],
  [6,22,38], [6,24,42], [6,26,46], [6,28,50], [6,30,54], [6,32,58],
  [6,34,62], [6,26,46,66], [6,26,48,70], [6,26,50,74], [6,30,54,78],
  [6,30,56,82], [6,30,58,86], [6,34,62,90],
];

function createMatrix(version) {
  const size = version * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Int8Array(size)); // 0=empty, 1=dark, -1=light (reserved)
  const reserved = Array.from({ length: size }, () => new Uint8Array(size));

  function setModule(r, c, dark) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = dark ? 1 : -1;
      reserved[r][c] = 1;
    }
  }

  // Finder patterns
  function drawFinder(row, col) {
    for (let dr = -1; dr <= 7; dr++)
      for (let dc = -1; dc <= 7; dc++) {
        const r = row + dr, c = col + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        setModule(r, c, inInner || (inOuter && onBorder));
      }
  }
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  if (version >= 2) {
    const pos = ALIGN_POS[version];
    for (const r of pos)
      for (const c of pos) {
        if ((r < 9 && c < 9) || (r < 9 && c > size - 10) || (r > size - 10 && c < 9)) continue;
        for (let dr = -2; dr <= 2; dr++)
          for (let dc = -2; dc <= 2; dc++)
            setModule(r + dr, c + dc, Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
      }
  }

  // Version info (versions >= 7)
  if (version >= 7) {
    const VERSION_INFO = [
      0x07C94, 0x085BC, 0x09A99, 0x0A4D3, 0x0BBF6, 0x0C762, 0x0D847, 0x0E60D,
      0x0F928, 0x10B78, 0x1145D, 0x12A17, 0x13532, 0x149A6, 0x15683, 0x168C9,
      0x177EC, 0x18EC4, 0x191E1, 0x1AFAB, 0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75, 0x1F250,
    ];
    const info = VERSION_INFO[version - 7];
    for (let i = 0; i < 18; i++) {
      const bit = (info >> i) & 1;
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      setModule(r, c, bit);
      setModule(c, r, bit);
    }
  }

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    reserved[8][i] = 1; reserved[i][8] = 1;
    reserved[8][size - 1 - i] = 1; reserved[size - 1 - i][8] = 1;
  }
  reserved[8][8] = 1;
  setModule(size - 8, 8, true); // Dark module

  return { matrix, reserved, size };
}

function placeData(matrix, reserved, size, codewords) {
  let bitIdx = 0;
  const totalBits = codewords.length * 8;
  let col = size - 1;

  while (col >= 0) {
    if (col === 6) col--;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        const isUpward = ((size - 1 - col + (col > 6 ? 1 : 0)) >> 1) % 2 === 0;
        const rr = isUpward ? size - 1 - row : row;
        if (cc >= 0 && cc < size && !reserved[rr][cc]) {
          if (bitIdx < totalBits) {
            const byteIdx = bitIdx >> 3;
            const bitPos = 7 - (bitIdx & 7);
            matrix[rr][cc] = ((codewords[byteIdx] >> bitPos) & 1) ? 1 : -1;
          } else {
            matrix[rr][cc] = -1;
          }
          bitIdx++;
        }
      }
    }
    col -= 2;
  }
}

function applyMask(matrix, reserved, size, maskId) {
  const maskFn = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
    (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
    (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
  ][maskId];

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!reserved[r][c] && maskFn(r, c))
        matrix[r][c] = matrix[r][c] === 1 ? -1 : 1;
}

function placeFormatInfo(matrix, size, maskId) {
  // EC level H = 2, format = (2 << 3) | maskId
  const FORMAT_INFOS = [
    0x1689A, 0x162AC, 0x17F4E, 0x17B78, 0x16C06, 0x16830, 0x175D2, 0x171E4,
  ];
  const info = FORMAT_INFOS[maskId] || FORMAT_INFOS[0];

  const positions = [];
  // Horizontal
  for (let i = 0; i <= 7; i++) positions.push([8, i <= 5 ? i : i + 1]);
  for (let i = 0; i <= 6; i++) positions.push([8, size - 7 + i]);
  // Vertical
  for (let i = 0; i <= 6; i++) positions.push([i <= 5 ? i : i + 1, 8]);
  positions.push([size - 8, 8]);
  for (let i = 0; i <= 6; i++) positions.push([size - 7 + i, 8]);

  for (let i = 0; i < 15; i++) {
    const bit = (info >> (14 - i)) & 1;
    if (i < 8) {
      matrix[positions[i][0]][positions[i][1]] = bit ? 1 : -1;
    }
    if (i < 7) {
      matrix[positions[8 + i][0]][positions[8 + i][1]] = bit ? 1 : -1;
    }
  }

  // More precise format placement
  const bits = [];
  for (let i = 14; i >= 0; i--) bits.push((info >> i) & 1);

  // Around top-left finder
  const hPos = [0,1,2,3,4,5,7,8]; // column positions for row 8
  const vPos = [0,1,2,3,4,5,7,8]; // row positions for column 8

  for (let i = 0; i < 8; i++) matrix[8][hPos[i]] = bits[i] ? 1 : -1;
  for (let i = 0; i < 7; i++) matrix[vPos[6-i]][8] = bits[8+i] ? 1 : -1;

  // Around other finders
  for (let i = 0; i < 7; i++) matrix[8][size - 7 + i] = bits[8+i] ? 1 : -1;
  for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = bits[i] ? 1 : -1;
}

function scorePenalty(matrix, size) {
  let penalty = 0;
  // Rule 1: adjacent same-color modules in row/column
  for (let r = 0; r < size; r++) {
    let count = 1;
    for (let c = 1; c < size; c++) {
      if ((matrix[r][c] > 0) === (matrix[r][c-1] > 0)) { count++; }
      else { if (count >= 5) penalty += count - 2; count = 1; }
    }
    if (count >= 5) penalty += count - 2;
  }
  for (let c = 0; c < size; c++) {
    let count = 1;
    for (let r = 1; r < size; r++) {
      if ((matrix[r][c] > 0) === (matrix[r-1][c] > 0)) { count++; }
      else { if (count >= 5) penalty += count - 2; count = 1; }
    }
    if (count >= 5) penalty += count - 2;
  }
  return penalty;
}

/**
 * Generate QR code module matrix for a given text string.
 * Returns { modules: boolean[][], size: number, version: number }
 * where modules[row][col] = true means dark module.
 */
export function generateQR(text) {
  const { version, codewords } = encodeData(text);
  const { matrix, reserved, size } = createMatrix(version);
  placeData(matrix, reserved, size, codewords);

  // Try all 8 masks, pick best
  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let m = 0; m < 8; m++) {
    const clone = matrix.map(r => Int8Array.from(r));
    applyMask(clone, reserved, size, m);
    const p = scorePenalty(clone, size);
    if (p < bestPenalty) { bestPenalty = p; bestMask = m; }
  }

  applyMask(matrix, reserved, size, bestMask);
  placeFormatInfo(matrix, size, bestMask);

  const modules = [];
  for (let r = 0; r < size; r++) {
    modules[r] = [];
    for (let c = 0; c < size; c++) modules[r][c] = matrix[r][c] > 0;
  }

  return { modules, size, version };
}
