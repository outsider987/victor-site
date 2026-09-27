import * as THREE from 'three';
import { clay } from './clay';

// The journey runs from dusk, through the night, to dawn at the wrap.
type Stop = { p: number; top: string; mid: string; bot: string; fog: string; hemiSky: string; hemiGround: string; key: string; keyI: number; night: number; hills: [string, string, string] };
const STOPS: Stop[] = [
  { p: 0, top: '#2c4f7c', mid: '#d68a70', bot: '#f5b98a', fog: '#c78e82', hemiSky: '#ffd8bd', hemiGround: '#50405c', key: '#ffd3a4', keyI: 2.7, night: 0.1, hills: ['#8a6f8f', '#6c5a80', '#4f4a6e'] },
  { p: 2.5, top: '#1d3e63', mid: '#6f6a92', bot: '#c49090', fog: '#6b6a8a', hemiSky: '#cdd8ff', hemiGround: '#3a3452', key: '#ffe0bb', keyI: 2.5, night: 0.4, hills: ['#5f6189', '#4a4d75', '#373b61'] },
  { p: 5.5, top: '#0d2a40', mid: '#1c4c60', bot: '#2e6a72', fog: '#1d4854', hemiSky: '#a3cad9', hemiGround: '#28303f', key: '#ffe8c8', keyI: 2.35, night: 0.85, hills: ['#2c5a66', '#234856', '#1a3746'] },
  { p: 9, top: '#141a3c', mid: '#2e2f5e', bot: '#4b406f', fog: '#2e2f56', hemiSky: '#aeaaea', hemiGround: '#2a2442', key: '#f2e6ff', keyI: 2.3, night: 0.95, hills: ['#453f73', '#363260', '#28264c'] },
  { p: 11, top: '#3b6399', mid: '#efa47f', bot: '#ffd9a6', fog: '#e2ab92', hemiSky: '#ffe8cc', hemiGround: '#5c4b5c', key: '#fff1da', keyI: 2.9, night: 0.0, hills: ['#b58a8f', '#95768e', '#735f82'] },
];

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
function mixHex(a: string, b: string, t: number, out: THREE.Color) {
  return out.copy(tmpA.set(a)).lerp(tmpB.set(b), t);
}

export function palette(p: number) {
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1].p) i++;
  const a = STOPS[i], b = STOPS[i + 1];
  const t = THREE.MathUtils.smoothstep(p, a.p, b.p);
  const c = (k: 'top' | 'mid' | 'bot' | 'fog' | 'hemiSky' | 'hemiGround' | 'key') => mixHex(a[k], b[k], t, new THREE.Color());
  return {
    top: c('top'), mid: c('mid'), bot: c('bot'), fog: c('fog'), hemiSky: c('hemiSky'), hemiGround: c('hemiGround'), key: c('key'),
    keyI: THREE.MathUtils.lerp(a.keyI, b.keyI, t),
    night: THREE.MathUtils.lerp(a.night, b.night, t),
    hills: a.hills.map((h, k) => mixHex(h, b.hills[k], t, new THREE.Color())),
  };
}

// Deterministic value noise for terrain and silhouettes.
function hash(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
export function noise2(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}

export const roadZ = (x: number) => 1.55 + Math.sin(x * 0.11) * 0.55 + Math.sin(x * 0.037) * 0.35;

export function createEnvironment(scene: THREE.Scene, length: number) {
  const group = new THREE.Group();
  scene.add(group);

  // Sky dome: painted gradient, a soft sun or moon glow, stars that come out at night.
  const skyUniforms = {
    uTop: { value: new THREE.Color() },
    uMid: { value: new THREE.Color() },
    uBot: { value: new THREE.Color() },
    uNight: { value: 0 },
    uTime: { value: 0 },
    uGlowDir: { value: new THREE.Vector3(0.35, 0.18, -0.92).normalize() },
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(400, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyUniforms,
      vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop, uMid, uBot, uGlowDir; uniform float uNight, uTime; varying vec3 vDir;
        float h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
        void main(){
          vec3 d = normalize(vDir);
          float y = d.y;
          vec3 c = y > 0.0 ? mix(uMid, uTop, smoothstep(0.0, 0.62, y)) : mix(uMid, uBot, smoothstep(0.0, -0.25, y));
          // brushy horizontal streaks, like a painted backdrop
          float streak = sin(d.y * 90.0 + sin(d.x * 7.0) * 2.0) * 0.5 + 0.5;
          c *= 1.0 + (streak - 0.5) * 0.035;
          float g = max(dot(d, normalize(uGlowDir)), 0.0);
          vec3 glowC = mix(vec3(1.0, 0.78, 0.55), vec3(0.85, 0.9, 1.0), uNight);
          c += glowC * (pow(g, 18.0) * 0.35 + pow(g, 4.0) * 0.12) * (0.6 + 0.4 * (1.0 - uNight));
          // stars
          vec2 sp = vec2(atan(d.z, d.x) * 90.0, d.y * 140.0);
          vec2 cell = floor(sp);
          float r = h21(cell);
          vec2 f = fract(sp) - 0.5;
          float star = step(0.985, r) * smoothstep(0.18, 0.0, length(f)) * smoothstep(0.05, 0.35, y);
          star *= 0.6 + 0.4 * sin(uTime * 2.0 + r * 40.0);
          c += vec3(1.0, 0.96, 0.85) * star * uNight;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  group.add(sky);

  // Moon: a clay disc that glows at night.
  const moon = new THREE.Mesh(new THREE.SphereGeometry(4.5, 48, 32), new THREE.MeshStandardMaterial({ color: '#f6dc8a', emissive: '#f4c865', emissiveIntensity: 0, roughness: 0.9 }));
  group.add(moon);

  // Backdrop hills: three slabs of clay pressed onto the painted sky, each drifting with its own
  // parallax. Tops catch the light, bases sink into shade, thumb smears run along them.
  const hillColors = [0, 1, 2].map(() => new THREE.Color('#555'));
  const hills = [
    { z: -42, h: 9, base: -2, amp: 4.5, freq: 0.045, par: 0.25 },
    { z: -58, h: 14, base: -2, amp: 6.5, freq: 0.03, par: 0.45 },
    { z: -78, h: 20, base: -2, amp: 9, freq: 0.02, par: 0.62 },
  ].map((cfg, k) => {
    const pos: number[] = [], top: number[] = [], index: number[] = [];
    const x0 = -140, x1 = length + 140;
    for (let x = x0, col = 0; x <= x1; x += 1.5, col++) {
      const y = cfg.h * 0.55 + noise2(x * cfg.freq, k * 10) * cfg.amp + noise2(x * cfg.freq * 3.1, k * 5 + 3) * cfg.amp * 0.25;
      pos.push(x, y, 0, x, cfg.base, 0);
      top.push(1, 0);
      if (col > 0) {
        const a = (col - 1) * 2;
        index.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aTop', new THREE.Float32BufferAttribute(top, 1));
    geo.setIndex(index);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: hillColors[k] } },
        side: THREE.DoubleSide,
        vertexShader: /* glsl */ `attribute float aTop; varying vec2 vP; varying float vTop;
          void main(){ vP = position.xy; vTop = aTop; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying vec2 vP; varying float vTop;
          float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(h1(i), h1(i + vec2(1.0, 0.0)), f.x), mix(h1(i + vec2(0.0, 1.0)), h1(i + vec2(1.0, 1.0)), f.x), f.y); }
          void main(){
            float smear = vn(vP * vec2(0.22, 1.4)) * 0.6 + vn(vP * vec2(0.8, 3.6)) * 0.4;
            float shade = mix(0.72, 1.0, smoothstep(0.0, 0.85, vTop));
            float rim = smoothstep(0.9, 1.0, vTop) * 0.14;
            gl_FragColor = vec4(uColor * (shade + rim + (smear - 0.5) * 0.16), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    );
    mesh.position.z = cfg.z;
    mesh.renderOrder = -9 + k * -0.1;
    mesh.frustumCulled = false;
    group.add(mesh);
    return { mesh, par: cfg.par };
  });

  // Terrain: a long clay tabletop, flat where the road and sets sit, rising into hills behind.
  const W = length + 90, D = 70;
  const tg = new THREE.PlaneGeometry(W, D, Math.round(W * 0.85), 72);
  tg.rotateX(-Math.PI / 2);
  tg.translate(length / 2, 0, -15);
  const pos = tg.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const moss = new THREE.Color('#7aa857'), leaf = new THREE.Color('#5f9448'), dry = new THREE.Color('#9fb565'), sand = new THREE.Color('#cfb27f');
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const back = Math.max(0, -z - 9);
    let y = noise2(x * 0.08, z * 0.08) * 0.28 + noise2(x * 0.21, z * 0.2) * 0.08;
    const rise = 2.6 * (1 - Math.exp(-back / 9));
    y += rise * (0.75 + 0.25 * noise2(x * 0.04, z * 0.04)) + noise2(x * 0.06, z * 0.06) * Math.min(back, 12) * 0.08;
    const front = Math.max(0, z - 7);
    y -= front * front * 0.02;
    const nearRoad = Math.abs(z - roadZ(x));
    y *= THREE.MathUtils.smoothstep(nearRoad, 1.2, 3.2);
    pos.setY(i, y);
    const n = noise2(x * 0.12 + 40, z * 0.12) * 0.5 + 0.5;
    col.copy(moss).lerp(leaf, n * 0.7).lerp(dry, Math.max(0, noise2(x * 0.05, z * 0.07)) * 0.5);
    col.offsetHSL(0, 0, noise2(x * 0.42 + 9, z * 0.42) * 0.035); // hand-mixed, not flat
    col.lerp(sand, THREE.MathUtils.smoothstep(2.4 - nearRoad, 0, 1.2) * 0.35);
    colors.set([col.r, col.g, col.b], i * 3);
  }
  tg.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  tg.computeVertexNormals();
  const ground = new THREE.Mesh(tg, clay('#ffffff', { rough: 0.86, bump: 0.9, scale: 0.9, sheen: 0.2, vertexColors: true, macro: 0.16, macroAmp: 0.2 }));
  ground.receiveShadow = true;
  group.add(ground);

  // The road: a pressed ribbon of sandy clay with uneven edges.
  const pts: THREE.Vector3[] = [];
  for (let x = -16; x <= length + 16; x += 1) pts.push(new THREE.Vector3(x, 0, roadZ(x)));
  const path = new THREE.CatmullRomCurve3(pts);
  const segs = pts.length * 3;
  const rv: number[] = [], ri: number[] = [];
  for (let s = 0; s <= segs; s++) {
    const t = s / segs;
    const p = path.getPointAt(t), tan = path.getTangentAt(t);
    const nx = -tan.z, nz = tan.x;
    const half = 1.12 + noise2(p.x * 0.6, 3) * 0.14;
    for (const side of [-1, 1]) {
      const w = half * side;
      rv.push(p.x + nx * w, 0.045 + Math.abs(noise2(p.x * 1.3, side * 7)) * 0.02, p.z + nz * w);
    }
    if (s < segs) {
      const a = s * 2;
      ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.Float32BufferAttribute(rv, 3));
  rg.setIndex(ri);
  rg.computeVertexNormals();
  const road = new THREE.Mesh(rg, clay('#d8bb8b', { rough: 0.9, bump: 1.3, scale: 1.1, sheen: 0.15, macro: 0.3, macroAmp: 0.07 }));
  road.receiveShadow = true;
  group.add(road);

  // Light rig.
  const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 1.0);
  const key = new THREE.DirectionalLight('#ffffff', 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 80 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  const rim = new THREE.DirectionalLight('#a9dcff', 0.9);
  scene.add(hemi, key, key.target, rim, rim.target);
  const lamps = [0, 1, 2, 3].map(() => {
    const l = new THREE.PointLight('#ffc873', 0, 9, 1.6);
    scene.add(l);
    return l;
  });

  scene.fog = new THREE.Fog('#888', 34, 120);

  return {
    lamps,
    key,
    setShadowSize(n: number) {
      key.shadow.mapSize.set(n, n);
      key.shadow.map?.dispose();
      key.shadow.map = null as unknown as THREE.WebGLRenderTarget;
    },
    update(p: number, time: number, focus: THREE.Vector3, camX: number) {
      const pal = palette(p);
      skyUniforms.uTop.value.copy(pal.top);
      skyUniforms.uMid.value.copy(pal.mid);
      skyUniforms.uBot.value.copy(pal.bot);
      skyUniforms.uNight.value = pal.night;
      skyUniforms.uTime.value = time;
      (scene.fog as THREE.Fog).color.copy(pal.fog);
      hemi.color.copy(pal.hemiSky);
      hemi.groundColor.copy(pal.hemiGround);
      hemi.intensity = 1.05 - pal.night * 0.25;
      key.color.copy(pal.key);
      key.intensity = pal.keyI;
      key.position.copy(focus).add(new THREE.Vector3(-9, 16, 11));
      key.target.position.copy(focus);
      rim.position.copy(focus).add(new THREE.Vector3(7, 9, -14));
      rim.target.position.copy(focus);
      rim.intensity = 0.5 + pal.night * 0.8;
      hills.forEach(({ mesh, par }) => (mesh.position.x = camX * par));
      hillColors.forEach((c, k) => c.copy(pal.hills[k]).lerp(pal.fog, 0.18 + k * 0.12));
      moon.position.set(camX * 0.9 + 26, 30, -110);
      const mm = moon.material as THREE.MeshStandardMaterial;
      mm.emissiveIntensity = 0.3 + pal.night * 1.6;
      moon.visible = pal.night > 0.2;
      skyUniforms.uGlowDir.value.set(pal.night > 0.5 ? 0.24 : -0.45, pal.night > 0.5 ? 0.26 : 0.1, -0.94).normalize();
      return pal;
    },
  };
}
