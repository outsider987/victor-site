import * as THREE from 'three';

export type LabelStyle = { bg: string; fg: string; font?: 'display' | 'zh' | 'body'; weight?: number; align?: 'center' | 'left'; lines?: number; pad?: number; engrave?: boolean };

const FAMILY = {
  display: '"Bricolage Grotesque", "Noto Sans TC", system-ui, sans-serif',
  zh: '"LXGW WenKai TC", "Noto Sans TC", serif',
  body: '"Bricolage Grotesque", "Noto Sans TC", system-ui, sans-serif',
};

const hasCJK = (s: string) => /[㐀-鿿]/.test(s);

export async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load('800 64px "Bricolage Grotesque"'),
      document.fonts.load('700 64px "LXGW WenKai TC"', '天鳳宮換金所規範技能'),
    ]);
  } catch {
    /* fall back to system faces */
  }
}

// Faint clay grain, drawn once and tiled under every label.
let grainTile: HTMLCanvasElement | null = null;
function grain() {
  if (grainTile) return grainTile;
  grainTile = document.createElement('canvas');
  grainTile.width = grainTile.height = 128;
  const g = grainTile.getContext('2d')!;
  for (let i = 0; i < (128 * 128) / 900; i++) {
    g.fillStyle = `rgba(0,0,0,${(Math.random() * 0.05).toFixed(3)})`;
    g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
  }
  return grainTile;
}

// Draw text as if pressed into clay: a dark inner shadow with a light lower lip.
export function drawLabel(canvas: HTMLCanvasElement, text: string, style: LabelStyle) {
  const g = canvas.getContext('2d')!;
  const { width: w, height: h } = canvas;
  g.clearRect(0, 0, w, h);
  g.fillStyle = style.bg;
  g.fillRect(0, 0, w, h);
  g.fillStyle = g.createPattern(grain(), 'repeat')!;
  g.fillRect(0, 0, w, h);
  const lines = text.split('\n');
  const pad = (style.pad ?? 0.12) * h;
  const family = FAMILY[style.font ?? (hasCJK(text) ? 'zh' : 'display')];
  const weight = style.weight ?? 800;
  let size = (h - pad * 2) / lines.length / 1.08;
  const fit = () => {
    g.font = `${weight} ${size}px ${family}`;
    return Math.max(...lines.map((l) => g.measureText(l).width));
  };
  // Width scales with size, so one measurement sets it; the loop only trims rounding.
  const room = w - pad * 2;
  const wide = fit();
  if (wide > room) size = Math.max(8, Math.floor((size * room) / wide));
  while (fit() > room && size > 8) size -= 1;
  g.textBaseline = 'middle';
  g.textAlign = style.align === 'left' ? 'left' : 'center';
  const x = style.align === 'left' ? pad : w / 2;
  const lh = size * 1.08;
  const y0 = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => {
    const y = y0 + i * lh;
    if (style.engrave !== false) {
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.fillText(line, x, y + size * 0.045);
      g.fillStyle = 'rgba(0,0,0,0.35)';
      g.fillText(line, x, y - size * 0.03);
    }
    g.fillStyle = style.fg;
    g.fillText(line, x, y);
  });
}

export function labelMesh(width: number, height: number, text: string, style: LabelStyle) {
  const ppu = 220; // pixels per world unit
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(2048, Math.round(width * ppu));
  canvas.height = Math.min(1024, Math.round(height * ppu));
  drawLabel(canvas, text, style);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.78, metalness: 0 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  mesh.receiveShadow = true;
  return {
    mesh,
    set(next: string) {
      drawLabel(canvas, next, style);
      tex.needsUpdate = true;
    },
  };
}
