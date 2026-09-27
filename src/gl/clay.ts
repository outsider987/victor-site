import * as THREE from 'three';

// Plasticine: a fingerprinted height field sampled triplanar in object space, turned into a bump
// with screen-space derivatives. No UVs needed, and the detail sticks to moving figures.

function fingerprintTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = '#808080';
  g.fillRect(0, 0, size, size);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // Draw each mark nine times so the tile wraps without seams.
  const wrap = (draw: (ox: number, oy: number) => void) => {
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) draw(ox, oy);
  };
  // Soft thumb presses.
  for (let i = 0; i < 70; i++) {
    const x = rnd() * size, y = rnd() * size, r = 18 + rnd() * 60, light = rnd() > 0.5;
    wrap((ox, oy) => {
      const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
      gr.addColorStop(0, light ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)');
      gr.addColorStop(1, 'rgba(128,128,128,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      g.fill();
    });
  }
  // Fingerprint whorls.
  g.lineWidth = 1.3;
  for (let i = 0; i < 22; i++) {
    const x = rnd() * size, y = rnd() * size, rings = 6 + Math.floor(rnd() * 8), rot = rnd() * Math.PI, sq = 0.55 + rnd() * 0.3;
    wrap((ox, oy) => {
      for (let k = 1; k <= rings; k++) {
        g.strokeStyle = k % 2 ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.10)';
        g.beginPath();
        g.ellipse(x + ox, y + oy, k * 3.1, k * 3.1 * sq, rot, rnd() * 0.6, Math.PI * 2 - rnd() * 1.2);
        g.stroke();
      }
    });
  }
  // Tool drags and pin dents.
  for (let i = 0; i < 40; i++) {
    const x = rnd() * size, y = rnd() * size, len = 20 + rnd() * 50, a = rnd() * Math.PI;
    wrap((ox, oy) => {
      g.strokeStyle = 'rgba(0,0,0,0.08)';
      g.lineWidth = 2 + rnd() * 3;
      g.beginPath();
      g.moveTo(x + ox, y + oy);
      g.lineTo(x + ox + Math.cos(a) * len, y + oy + Math.sin(a) * len);
      g.stroke();
    });
  }
  for (let i = 0; i < 900; i++) {
    const x = rnd() * size, y = rnd() * size, r = 0.6 + rnd() * 2.2;
    wrap((ox, oy) => {
      g.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.08})`;
      g.beginPath();
      g.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      g.fill();
    });
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}

let detail: THREE.Texture | null = null;
const shared = {
  uClayMap: { value: null as THREE.Texture | null },
};

const vertexPre = /* glsl */ `
varying vec3 vClayPos;
varying vec3 vClayNormal;
`;
const vertexMain = /* glsl */ `
vClayPos = position;
vClayNormal = normal;
`;
const fragmentPre = /* glsl */ `
uniform sampler2D uClayMap;
uniform float uClayScale;
uniform float uClayBump;
uniform float uClayHair;
uniform float uClayMacro;
uniform float uClayMacroAmp;
varying vec3 vClayPos;
varying vec3 vClayNormal;
// Broad thumb smears for big surfaces (ground, road): the slope of a heavily blurred sample of
// the same map, taken in world units, so it reads at camera distance where the fine print can't.
vec3 clayMacro(vec3 n) {
  vec2 q = vClayPos.xz * uClayMacro;
  float e = 0.015;
  float h0 = texture2D(uClayMap, q, 3.5).r;
  float hx = texture2D(uClayMap, q + vec2(e, 0.0), 3.5).r;
  float hz = texture2D(uClayMap, q + vec2(0.0, e), 3.5).r;
  vec2 g = vec2(hx - h0, hz - h0) / e * uClayMacroAmp;
  vec3 tx = normalize((viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
  vec3 tz = normalize((viewMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
  return normalize(n - g.x * tx - g.y * tz);
}
float clayHeight() {
  vec3 w = pow(abs(normalize(vClayNormal)), vec3(4.0));
  w /= (w.x + w.y + w.z + 1e-5);
  vec3 p = vClayPos * uClayScale;
  float h = texture2D(uClayMap, p.yz).r * w.x + texture2D(uClayMap, p.xz).r * w.y + texture2D(uClayMap, p.xy).r * w.z;
  if (uClayHair > 0.5) {
    float a = atan(vClayPos.z, vClayPos.x);
    float wobble = texture2D(uClayMap, p.xz * 0.35).r * 3.0;
    h = mix(h, 0.5 + 0.5 * sin(a * 62.0 + wobble + vClayPos.y * 6.0), 0.55);
  }
  return h;
}
vec3 clayPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
  vec3 vSigmaX = normalize(dFdx(surfPos));
  vec3 vSigmaY = normalize(dFdy(surfPos));
  vec3 vN = surfNorm;
  vec3 R1 = cross(vSigmaY, vN);
  vec3 R2 = cross(vN, vSigmaX);
  float fDet = dot(vSigmaX, R1) * faceDir;
  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
  return normalize(abs(fDet) * surfNorm - vGrad);
}
`;
const fragmentNormal = /* glsl */ `
#include <normal_fragment_maps>
{
  float clayH = clayHeight();
  vec2 dHdxy = vec2(dFdx(clayH), dFdy(clayH)) * uClayBump;
  normal = clayPerturb(-vViewPosition, normal, dHdxy, faceDirection);
  if (uClayMacro > 0.0) normal = clayMacro(normal);
}
`;

export type ClayOpts = { rough?: number; bump?: number; scale?: number; sheen?: number; hair?: boolean; metal?: number; physical?: boolean; vertexColors?: boolean; macro?: number; macroAmp?: number };

function patch(mat: THREE.MeshStandardMaterial, o: ClayOpts) {
  const uniforms = { uClayScale: { value: o.scale ?? 1.4 }, uClayBump: { value: o.bump ?? 1.0 }, uClayHair: { value: o.hair ? 1 : 0 }, uClayMacro: { value: o.macro ?? 0 }, uClayMacroAmp: { value: o.macroAmp ?? 0.12 } };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uClayMap = shared.uClayMap;
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${vertexPre}`).replace('#include <begin_vertex>', `#include <begin_vertex>\n${vertexMain}`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${fragmentPre}`).replace('#include <normal_fragment_maps>', fragmentNormal);
  };
  mat.customProgramCacheKey = () => `clay-${o.hair ? 'hair' : 'base'}${o.vertexColors ? '-vc' : ''}`;
  mat.userData.clay = uniforms;
  return mat;
}

const cache = new Map<string, THREE.Material>();

export function clay(color: THREE.ColorRepresentation, o: ClayOpts = {}) {
  if (!detail) {
    detail = fingerprintTexture();
    shared.uClayMap.value = detail;
  }
  const c = new THREE.Color(color);
  const key = `${c.getHexString()}|${JSON.stringify(o)}`;
  let m = cache.get(key) as THREE.MeshStandardMaterial | undefined;
  if (!m) {
    const base = {
      color: c,
      roughness: o.rough ?? 0.72,
      metalness: o.metal ?? 0,
      vertexColors: !!o.vertexColors,
    };
    m = o.physical === false
      ? new THREE.MeshStandardMaterial(base)
      : new THREE.MeshPhysicalMaterial({
          ...base,
          sheen: o.sheen ?? 0.35,
          sheenRoughness: 0.55,
          sheenColor: c.clone().lerp(new THREE.Color('#ffffff'), 0.45),
        });
    patch(m, o);
    cache.set(key, m);
  }
  return m;
}

export function glow(color: THREE.ColorRepresentation, strength = 2.2) {
  const key = `glow|${new THREE.Color(color).getHexString()}|${strength}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: strength, roughness: 0.5 });
    cache.set(key, m);
  }
  return m;
}

// Replace the Blender preview materials by name with clay equivalents.
const SPECIAL: Record<string, (src: THREE.MeshStandardMaterial) => THREE.Material> = {
  clay_vc: () => clay('#ffffff', { rough: 0.7, vertexColors: true }),
  clay_glossvc: () => clay('#ffffff', { rough: 0.2, bump: 0.15, sheen: 0, vertexColors: true }),
  clay_glasses: () => clay('#16151b', { rough: 0.18, bump: 0.15, sheen: 0 }),
  clay_eye: () => clay('#f7f2e8', { rough: 0.22, bump: 0.2, sheen: 0 }),
  clay_pupil: () => clay('#121014', { rough: 0.12, bump: 0.1, sheen: 0 }),
  clay_hair: () => clay('#19171e', { rough: 0.6, bump: 0.3, hair: true, sheen: 0.18 }),
  glass_lens: () => new THREE.MeshPhysicalMaterial({ name: 'glass_lens', color: '#bbd2ee', metalness: 0.85, roughness: 0.075, clearcoat: 1, clearcoatRoughness: 0.08, emissive: '#b4cbe4', emissiveIntensity: 0.08, envMapIntensity: 0.9 }),
  clay_skin: () => clay('#e6b28b', { rough: 0.62, bump: 0.8, sheen: 0.45 }),
  clay_blush: () => clay('#e79c8e', { rough: 0.7, bump: 0.6 }),
  clay_gold: () => clay('#e6a92e', { rough: 0.3, metal: 0.6, bump: 0.5, sheen: 0 }),
  clay_silver: () => clay('#cfd2da', { rough: 0.32, metal: 0.45, bump: 0.4, sheen: 0 }),
  clay_black: () => clay('#1f1e24', { rough: 0.42, bump: 0.7 }),
  clay_water: () => new THREE.MeshPhysicalMaterial({ color: '#4aa3c7', roughness: 0.08, clearcoat: 1, transmission: 0, metalness: 0 }),
  glow_warm: () => glow('#ffcf6b', 4.2),
  glow_red: () => glow('#ff5a45', 2.4),
  glow_green: () => glow('#62ff8f', 2.4),
};

export function claymate(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const swap = (m: THREE.Material) => {
      const src = m as THREE.MeshStandardMaterial;
      mesh.userData.mat = src.name;
      const special = SPECIAL[src.name];
      if (special) return special(src);
      return clay(src.color ?? '#cccccc', { rough: Math.max(0.55, src.roughness ?? 0.7) });
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
    // Light sources and reflective lenses neither cast nor catch shadows.
    if (/^(glow|glass_lens)/.test(String(mesh.userData.mat))) mesh.castShadow = mesh.receiveShadow = false;
  });
}
