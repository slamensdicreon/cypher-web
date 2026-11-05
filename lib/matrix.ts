/**
 * A still frame of falling code, for anyone who opens the page source or the console.
 * Seeded, so every build draws the same frame. No hyphens: they could end the HTML comment early.
 */

const GLYPHS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789Z:.=*+|';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function matrixRain(width: number, height: number, message: string[], seed = 1113): string {
  const r = rng(seed);
  const grid: string[][] = Array.from({ length: height }, () => Array(width).fill(' '));
  for (let x = 0; x < width; x += 2) {
    // Each column carries one or two falling streams of different lengths.
    for (let k = 0, n = r() < 0.35 ? 2 : 1; k < n; k++) {
      if (r() < 0.18) continue;
      const len = 4 + Math.floor(r() * (height * 0.7));
      const head = Math.floor(r() * (height + len));
      for (let y = head - len; y <= head; y++) {
        if (y >= 0 && y < height && r() > 0.12) grid[y][x] = GLYPHS[Math.floor(r() * GLYPHS.length)];
      }
    }
  }
  // Clear a quiet band in the middle and set the message in it.
  const top = Math.floor((height - message.length) / 2) - 1;
  for (let y = top; y < top + message.length + 2; y++) {
    if (y < 0 || y >= height) continue;
    grid[y] = grid[y].map((ch, x) => (Math.abs(x - width / 2) < width * 0.36 ? ' ' : ch));
  }
  message.forEach((line, i) => {
    const y = top + 1 + i;
    const x0 = Math.floor((width - line.length) / 2);
    [...line].forEach((ch, j) => {
      if (y >= 0 && y < height && x0 + j >= 0 && x0 + j < width) grid[y][x0 + j] = ch;
    });
  });
  return grid.map((row) => row.join('').replace(/\s+$/, '')).join('\n');
}

export const SOURCE_MESSAGE = [
  'wake up.',
  '',
  'you weren’t supposed to look in here.',
  'there is no spoon. there is no source.',
  '',
  'ignorance is bliss.',
];
