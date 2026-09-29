import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { stations as STATIONS, works, type L, type Lang } from '../content';
import { clay } from './clay';
import { roadZ } from './environment';
import { labelMesh, type LabelStyle } from './labels';
import { Screen } from './screens';

export const GAP = 17;
type V3 = [number, number, number];
type Text = L | string;
type Place = {
  prop: string;
  at: V3;
  rot?: number;
  s?: number;
  tint?: Record<string, string>;
  label?: { anchor: string; text: Text; style: LabelStyle };
  screen?: 'main' | 'phone' | 'slot';
  bob?: number;
  wag?: boolean;
};
export type RestAnim = 'wave' | 'present' | 'idle';
type Def = {
  props: Place[];
  victor: { at: [number, number]; yaw: number; anim: RestAnim };
  focus: { min: [number, number]; max: [number, number]; z: number };
  keepOut: [number, number, number, number];
};

const PLAQUE: LabelStyle = { bg: '#efe4cf', fg: '#3a2530', weight: 800 };
const SIGN: LabelStyle = { bg: '#c9956a', fg: '#2e1c14', weight: 800 };
const workById = Object.fromEntries(works.map((w) => [w.id, w]));

function workStation(_id: string, extras: Place[], frame = '#efe4cf'): Def {
  return {
    props: [{ prop: 'screen_frame', at: [1.5, 0, -2.3], screen: 'main', tint: { clay_frame: frame } }, ...extras],
    victor: { at: [0.05, -1.15], yaw: 0.3, anim: 'present' },
    focus: { min: [-1.3, -0.35], max: [4.3, 5.66], z: -2.1 },
    keepOut: [-6.5, 7, -5.4, 2.4],
  };
}

const LAYOUT: Record<string, Def> = {
  hello: {
    props: [
      { prop: 'house_a', at: [4.4, 0, -4.4], rot: -0.25 },
      { prop: 'house_b', at: [7.3, 0, -6.0], rot: -0.1 },
      { prop: 'house_c', at: [1.0, 0, -7.2], rot: 0.12 },
      { prop: 'tree_round', at: [-1.8, 0, -4.8] },
      { prop: 'tree_round_b', at: [2.7, 0, -2.9], s: 0.9 },
      { prop: 'tree_pine', at: [9.6, 0, -4.2], s: 1.15 },
      // Victor waits under a lit lamp, right of centre.
      { prop: 'lamp_post', at: [3.1, 0, 0.3] },
      { prop: 'signpost', at: [-3.6, 0, -1.3], rot: 0.28, label: { anchor: 'label', text: { en: 'Works this way →', zh: '作品往這走 →' }, style: SIGN } },
      { prop: 'bench', at: [6.2, 0, -1.7], rot: -0.35 },
      { prop: 'mailbox', at: [8.4, 0, -0.4], rot: -0.5 },
      // Midground between him and the houses.
      { prop: 'fence', at: [5.3, 0, -2.5], rot: -0.12 },
      { prop: 'flower', at: [4.1, 0, -0.9], s: 1.1 },
      { prop: 'flower', at: [0.8, 0, -1.7], s: 0.9 },
      { prop: 'grass', at: [4.7, 0, 1.2], s: 1.1 },
      { prop: 'rock_a', at: [6.9, 0, 0.5], s: 0.8 },
      // Foreground along the bottom and right edges of the frame, nearer the lens than the set.
      { prop: 'tree_round', at: [6.9, 0, 3.4], s: 1.25 },
      { prop: 'bush', at: [5.3, 0, 2.7], s: 1.3 },
      { prop: 'grass', at: [3.9, 0, 2.6], s: 1.4 },
      { prop: 'flower', at: [4.6, 0, 2.2], s: 1.2 },
      { prop: 'rock_b', at: [2.9, 0, 3.0], s: 1.1 },
    ],
    victor: { at: [1.9, 1.0], yaw: 0.12, anim: 'wave' },
    focus: { min: [0.4, 0], max: [6.6, 3.7], z: -1.2 },
    keepOut: [-4.5, 10, -8, 2.3],
  },
  skills: {
    props: [
      { prop: 'workbench', at: [1.8, 0, -1.6], s: 1.35 },
      { prop: 'bolt', at: [0.35, 1.43, -1.75], s: 0.72, bob: 0.04 },
      { prop: 'monitor_icon', at: [0.98, 1.43, -1.8], s: 0.8 },
      { prop: 'database', at: [1.62, 1.43, -1.75], s: 0.62 },
      { prop: 'cloud_icon', at: [2.26, 1.43, -1.8], s: 0.66, bob: 0.03 },
      { prop: 'gamepad', at: [2.86, 1.43, -1.6], s: 0.95 },
      { prop: 'robot_head', at: [3.36, 1.43, -1.78], s: 0.72 },
      { prop: 'toolbox', at: [-0.4, 0, -1.0], s: 1.2, rot: 0.3 },
      { prop: 'lamp_post', at: [5.3, 0, -0.4] },
      { prop: 'tree_pine', at: [-3.6, 0, -4.0] },
      { prop: 'house_c', at: [6.8, 0, -5.8], rot: -0.3 },
    ],
    victor: { at: [-1.35, 0.7], yaw: 0.42, anim: 'present' },
    focus: { min: [-2.3, 0], max: [4.4, 3.3], z: -1.4 },
    keepOut: [-4.5, 6.5, -5, 2.3],
  },
  cypherlab: workStation('cypherlab', [
    { prop: 'scoreboard', at: [-4.9, 0, -3.4], rot: 0.3, label: { anchor: 'panel', text: '● LIVE   1.72   2.14   3.40', style: { bg: '#141318', fg: '#7dff9c', weight: 700, engrave: false } } },
    { prop: 'trophy', at: [3.55, 0, 0.9], s: 1.25, rot: -0.3 },
    { prop: 'gamepad', at: [2.45, 0, 1.35], s: 1.5, rot: -0.5 },
    { prop: 'lamp_post', at: [-3.4, 0, -0.1] },
  ], '#e8553a'),
  mediconcen: workStation('mediconcen', [
    { prop: 'clinic', at: [-5.4, 0, -3.9], rot: 0.32 },
    { prop: 'clipboard', at: [3.5, 0, 0.8], rot: -0.35, s: 1.3 },
    { prop: 'pill_bottle', at: [2.55, 0, 1.3], s: 1.35 },
    { prop: 'lamp_post', at: [-3.3, 0, -0.1] },
  ], '#9fd3d6'),
  '3ccash': workStation('3ccash', [
    { prop: 'shop', at: [-5.3, 0, -3.5], rot: 0.36, label: { anchor: 'label', text: '3C換金所', style: { bg: '#2fbf71', fg: '#ffffff', font: 'zh', weight: 700 } } },
    { prop: 'camera', at: [-5.7, 1.11, -3.15], rot: 0.5, s: 1.1 },
    { prop: 'laptop', at: [-4.6, 1.11, -2.9], rot: 0.2 },
    { prop: 'phone_stand', at: [3.55, 0, 0.55], rot: -0.35, screen: 'phone', s: 1.05 },
    { prop: 'bubble', at: [4.4, 1.95, 0.2], rot: -0.4, s: 0.9, bob: 0.1 },
  ], '#f2ede3'),
  temple: workStation('temple', [
    { prop: 'gate', at: [-5.2, 0, -3.8], rot: 0.3, label: { anchor: 'plaque', text: '天鳳宮', style: { bg: '#e6a92e', fg: '#6a1f16', font: 'zh', weight: 700 } } },
    { prop: 'lantern', at: [-6.5, 1.98, -3.4], rot: 0.3 },
    { prop: 'lantern', at: [-3.95, 1.98, -4.2], rot: 0.3 },
    { prop: 'phone_stand', at: [3.55, 0, 0.55], rot: -0.35, screen: 'phone', s: 1.05 },
    { prop: 'lantern', at: [4.55, 1.9, 0.1], rot: -0.2, bob: 0.03 },
  ], '#c9332b'),
  sandstorm: workStation('sandstorm', [
    { prop: 'pyramid', at: [-5.6, 0, -4.8], s: 1.25, rot: 0.2 },
    { prop: 'dune', at: [-3.6, 0, -1.9], s: 1.3 },
    { prop: 'dune', at: [4.8, 0, -3.9], s: 1.5, rot: 0.6 },
    { prop: 'slot_machine', at: [3.7, 0, 0.45], rot: -0.35, screen: 'slot', s: 0.95 },
    { prop: 'scarab', at: [-3.1, 0.05, 0.9], s: 1.9, rot: 0.6 },
  ], '#e0a02a'),
  betcorgi: workStation('betcorgi', [
    { prop: 'plinko', at: [-5.3, 0, -3.1], rot: 0.32 },
    { prop: 'corgi', at: [-3.3, 0, 0.9], rot: 0.7, s: 1.35, wag: true },
    { prop: 'dice', at: [3.2, 0, 1.0], s: 1.3, rot: 0.3 },
    { prop: 'dice', at: [3.85, 0, 1.4], s: 1.1, rot: 1.1 },
    { prop: 'bench', at: [5.6, 0, -1.6], rot: -0.4 },
  ], '#e8903f'),
  ironvale: workStation('ironvale', [
    { prop: 'timber_house', at: [-5.4, 0, -4.4], rot: 0.3 },
    { prop: 'fountain', at: [-3.7, 0, -1.2] },
    { prop: 'sword_stone', at: [3.5, 0, 0.8], s: 1.1, rot: -0.3 },
    { prop: 'lamp_post', at: [5.9, 0, -1.8] },
  ], '#7d6bd1'),
  ai: {
    props: [
      { prop: 'director_chair', at: [-2.4, 0, 0.5], rot: 0.45, label: { anchor: 'back', text: 'VICTOR', style: { bg: '#e8553a', fg: '#fff4e6', weight: 800, engrave: false } } },
      { prop: 'film_camera', at: [-4.6, 0, -0.3], rot: 0.95 },
      { prop: 'storyboard', at: [5.9, 0, -2.0], rot: -0.4, label: { anchor: 'board', text: { en: 'SPEC → PLAN → TASKS\n→ PR → VERIFY', zh: '規格 → 計畫 → 任務\n→ PR → 驗證' }, style: { bg: '#fbf6ea', fg: '#2b1f2c', weight: 800 } } },
      ...(['RULES', 'SKILLS', 'SPECS', 'VERIFY', 'GATES'] as const).map((sign, k): Place => ({
        prop: 'robot',
        at: [-0.6 + k * 1.2, 0, -2.7 - Math.sin((k / 4) * Math.PI) * 0.5],
        rot: (2 - k) * 0.12,
        tint: { clay_robot: ['#2d7f86', '#5a3656', '#e0a02a', '#6e9f4f', '#c4412a'][k] },
        label: { anchor: 'sign', text: { en: sign, zh: ['規範', '技能', '規格', '驗證', '關卡'][k] }, style: { bg: '#fbf6ea', fg: '#2b1f2c', weight: 800 } },
        bob: 0.02,
      })),
      { prop: 'light_stand', at: [-6.4, 0, -3.2], rot: 0.6 },
    ],
    victor: { at: [-1.35, 0.55], yaw: 0.55, anim: 'present' },
    focus: { min: [-3.2, 0], max: [6.5, 3.1], z: -1.8 },
    keepOut: [-7.5, 7.5, -5, 2.3],
  },
  experience: {
    props: [
      ...[['2018', 'ULIC TEK'], ['2021', 'PARADROMIX'], ['2022', 'MEDICONCEN'], ['2026', 'CYPHERLAB']].map(([y, org], k): Place => ({
        prop: 'milestone',
        at: [-2.1 + k * 2.55, 0, -1.2 - (k % 2) * 0.35],
        rot: 0.12 - k * 0.08,
        s: 1.5,
        label: { anchor: 'plaque', text: `${y}\n${org}`, style: PLAQUE },
      })),
      { prop: 'tree_round', at: [-6.3, 0, -3.8] },
      { prop: 'tree_round_b', at: [7.2, 0, -3.4] },
      { prop: 'bush', at: [0.9, 0, -3.4], s: 1.3 },
    ],
    victor: { at: [-3.7, 0.4], yaw: 0.95, anim: 'idle' },
    focus: { min: [-4.4, 0], max: [6.4, 2.6], z: -1.3 },
    keepOut: [-7.5, 8, -5, 2.3],
  },
  contact: {
    props: [
      { prop: 'clapperboard', at: [1.6, 0, -1.3], s: 2.0, rot: -0.1, label: { anchor: 'slate', text: { en: "THAT'S A WRAP\nVICTOR CHANG · 2026", zh: '殺青\nVICTOR CHANG · 2026' }, style: { bg: '#1e1d22', fg: '#f5eddd', weight: 800, engrave: false } } },
      { prop: 'light_stand', at: [-4.6, 0, -2.4], rot: 0.75 },
      { prop: 'light_stand', at: [7.0, 0, -2.6], rot: -0.75 },
      { prop: 'mailbox', at: [4.8, 0, 0.8], rot: -0.35 },
      { prop: 'film_camera', at: [-2.8, 0, -3.4], rot: 0.4 },
    ],
    victor: { at: [-1.5, 0.95], yaw: 0.2, anim: 'wave' },
    focus: { min: [-5.2, 0], max: [8.0, 4.4], z: -1.6 },
    keepOut: [-6.5, 9, -5, 2.3],
  },
};

// Seeded scenery so every visit builds the same world.
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function scenery(i: number, def: Def, dense: boolean): Place[] {
  const r = rng(1000 + i * 97);
  const out: Place[] = [];
  const [kx0, kx1, kz0, kz1] = def.keepOut;
  const free = (x: number, z: number, pad = 0) => !(x > kx0 - pad && x < kx1 + pad && z > kz0 - pad && z < kz1 + pad);
  const onRoad = (x: number, z: number) => Math.abs(z - (roadZ(i * GAP + x) )) < 1.7;
  const tries = (n: number, pick: () => Place | null) => {
    for (let k = 0, made = 0; k < n * 6 && made < n; k++) {
      const p = pick();
      if (p) {
        out.push(p);
        made++;
      }
    }
  };
  const back = ['tree_round', 'tree_round_b', 'tree_pine', 'tree_pine', 'house_a', 'house_b', 'house_c', 'bush'];
  tries(dense ? 7 : 4, () => {
    const x = -8 + r() * 16, z = -11 + r() * 5;
    if (!free(x, z, 0.6)) return null;
    const prop = back[Math.floor(r() * back.length)];
    return { prop, at: [x, 0, z], rot: (r() - 0.5) * 0.8, s: 0.85 + r() * 0.35 };
  });
  tries(dense ? 5 : 3, () => {
    const x = -8.5 + r() * 17, z = -6 + r() * 6;
    if (!free(x, z, 0.4) || onRoad(x, z)) return null;
    const prop = ['bush', 'rock_a', 'rock_b', 'tree_round_b', 'flower'][Math.floor(r() * 5)];
    return { prop, at: [x, 0, z], rot: r() * 6, s: 0.8 + r() * 0.5 };
  });
  tries(dense ? 16 : 8, () => {
    const x = -8.5 + r() * 17, z = -6 + r() * 11;
    if (!free(x, z, 0.1) || onRoad(x, z)) return null;
    if (z > 2.4 && x > kx0 + 1 && x < kx1 - 1) return null;
    const prop = r() > 0.35 ? 'grass' : 'flower';
    return { prop, at: [x, 0, z], rot: r() * 6, s: z > 2.4 ? 0.6 + r() * 0.3 : 0.8 + r() * 0.6 };
  });
  // A lamp and a fence on the walk to the next station.
  if (i < STATIONS.length - 1) {
    const mx = GAP / 2 + (r() - 0.5) * 2;
    out.push({ prop: 'lamp_post', at: [mx, 0, roadZ(i * GAP + mx) - 1.9] });
    out.push({ prop: 'fence', at: [mx + 3.2, 0, roadZ(i * GAP + mx + 3.2) - 2.6], rot: (r() - 0.5) * 0.3 });
    out.push({ prop: r() > 0.5 ? 'tree_round' : 'tree_pine', at: [mx - 3.5, 0, roadZ(i * GAP + mx - 3.5) - 3.6], s: 0.9 + r() * 0.3 });
    out.push({ prop: 'rock_a', at: [mx + 1.5, 0, roadZ(i * GAP + mx + 1.5) + 2.3], rot: r() * 6, s: 0.7 });
  }
  return out;
}

type Item = { obj: THREE.Object3D; order: number; base: THREE.Vector3; baseScale: number; baseRot: number; bob: number; wag: boolean; set: boolean };

// A held pose's scale on its way in: overshoots a little, then settles.
function popScale(q: number) {
  return q <= 0 ? 0.0001 : q >= 1 ? 1 : 1 + 1.9 * Math.pow(q - 1, 3) + 0.9 * Math.pow(q - 1, 2);
}

// Bake placed props into one mesh per material, in station space. Model attributes arrive quantized,
// so positions, normals and colours are read back as floats before the transform is applied.
function mergePatch(places: Place[], protos: Map<string, THREE.Object3D>) {
  const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>();
  for (const p of places) {
    const proto = protos.get(p.prop);
    if (!proto) continue;
    const obj = proto.clone(true);
    obj.position.set(...p.at);
    obj.rotation.y = p.rot ?? 0;
    obj.scale.setScalar(p.s ?? 1);
    obj.updateMatrixWorld(true);
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material)) return;
      const g = new THREE.BufferGeometry();
      for (const [name, size] of [['position', 3], ['normal', 3], ['color', 3]] as const) {
        const a = mesh.geometry.getAttribute(name);
        if (!a) return;
        const out = new Float32Array(a.count * size);
        for (let i = 0; i < a.count; i++) {
          out[i * size] = a.getX(i);
          out[i * size + 1] = a.getY(i);
          out[i * size + 2] = a.getZ(i);
        }
        g.setAttribute(name, new THREE.BufferAttribute(out, size));
      }
      if (mesh.geometry.index) g.setIndex(Array.from(mesh.geometry.index.array as ArrayLike<number>));
      g.applyMatrix4(mesh.matrixWorld);
      const list = byMat.get(mesh.material) ?? [];
      list.push(g);
      byMat.set(mesh.material, list);
    });
  }
  if (!byMat.size) return null;
  const patch = new THREE.Group();
  for (const [material, geos] of byMat) {
    const merged = mergeGeometries(geos);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, material);
    mesh.receiveShadow = true;
    patch.add(mesh);
  }
  return patch;
}

export class StationRuntime {
  group = new THREE.Group();
  items: Item[] = [];
  screens: Screen[] = [];
  labels: { set: (s: string) => void; text: Text }[] = [];
  lamps: THREE.Vector3[] = [];
  patch: THREE.Group | null = null;
  spot: THREE.Vector3;
  yaw: number;
  anim: RestAnim;
  focus: { center: THREE.Vector3; size: THREE.Vector2 };
  kind: string;
  id: string;

  constructor(public index: number, def: Def, protos: Map<string, THREE.Object3D>, lang: Lang, dense: boolean) {
    const station = STATIONS[index];
    this.id = station.id;
    this.kind = station.kind;
    const ox = index * GAP;
    this.group.position.x = ox;
    this.spot = new THREE.Vector3(ox + def.victor.at[0], 0, def.victor.at[1]);
    this.yaw = def.victor.yaw;
    this.anim = def.victor.anim;
    const [x0, y0] = def.focus.min, [x1, y1] = def.focus.max;
    this.focus = { center: new THREE.Vector3(ox + (x0 + x1) / 2, (y0 + y1) / 2, def.focus.z), size: new THREE.Vector2(x1 - x0, y1 - y0) };

    const work = station.kind === 'work' ? workById[station.id] : null;
    const extras = scenery(index, def, dense);
    // Grass, flowers and pebbles are many and tiny: merged into one patch, they cost one draw.
    const small = (p: Place) => /^(grass|flower|rock_)/.test(p.prop);
    this.patch = mergePatch(extras.filter(small), protos);
    if (this.patch) this.group.add(this.patch);
    const all = [...def.props.map((p) => ({ ...p, set: true })), ...extras.filter((p) => !small(p)).map((p) => ({ ...p, set: false }))];
    all.forEach((p, k) => {
      const proto = protos.get(p.prop);
      if (!proto) return;
      const obj = proto.clone(true);
      obj.position.set(...p.at);
      obj.rotation.y = p.rot ?? 0;
      const s = p.s ?? 1;
      obj.scale.setScalar(s);
      if (p.tint) {
        obj.traverse((o) => {
          const mesh = o as THREE.Mesh;
          const name = mesh.userData?.mat as string | undefined;
          if (mesh.isMesh && name && p.tint![name]) mesh.material = clay(p.tint![name]);
        });
      }
      const anchors = proto.userData as Record<string, number[]>;
      if (p.label) {
        const a = anchors[p.label.anchor];
        if (a) {
          const lm = labelMesh(a[3], a[4], pick(p.label.text, lang), p.label.style);
          lm.mesh.position.set(a[0], a[1], a[2] + 0.006);
          obj.add(lm.mesh);
          this.labels.push({ set: lm.set, text: p.label.text });
        }
      }
      if (p.screen && work) {
        const a = anchors.screen;
        if (a) {
          let urls: string[];
          let video: string | undefined;
          if (p.screen === 'main') {
            urls = work.shots.filter((sh) => !sh.src.includes('sprites')).map((sh) => sh.src);
            video = work.video?.src;
          } else if (p.screen === 'phone') urls = work.phone ? [work.phone.src] : [work.shots[0].src];
          else urls = [work.shots[work.shots.length - 1].src];
          const screen = new Screen(urls, a[3], a[4], index, p.screen === 'main' ? video : undefined);
          screen.mesh.position.set(a[0], a[1], a[2] + 0.004);
          obj.add(screen.mesh);
          this.screens.push(screen);
        }
      }
      if (anchors.light) this.lamps.push(new THREE.Vector3(anchors.light[0] * s, anchors.light[1] * s, anchors.light[2] * s).applyEuler(obj.rotation).add(obj.position).add(this.group.position));
      this.group.add(obj);
      this.items.push({ obj, order: p.set ? k : 0, base: obj.position.clone(), baseScale: s, baseRot: obj.rotation.y, bob: p.bob ?? 0, wag: !!p.wag, set: p.set });
    });
    // Scenery pops first, then the set piece by piece.
    const setItems = this.items.filter((it) => it.set);
    setItems.forEach((it, k) => (it.order = k));
  }

  setLang(lang: Lang) {
    this.labels.forEach((l) => l.set(pick(l.text, lang)));
  }

  prefetch() {
    this.screens.forEach((sc) => sc.ensure());
  }

  // Start one waiting video, if any; returns whether it did.
  loadVideo() {
    const sc = this.screens.find((s) => s.wantsVideo);
    sc?.loadVideo();
    return !!sc;
  }

  // build: 0..1 how much of the set stands; stepped on 12 fps ticks by the caller.
  update(build: number, active: boolean, on: number, tick: boolean, time: number) {
    const n = this.items.filter((it) => it.set).length;
    if (this.patch && tick) {
      // The patch sprouts with the rest of the scenery, grown up from the ground.
      const q = Math.round(THREE.MathUtils.clamp(build / 0.25, 0, 1) * 5) / 5;
      this.patch.scale.set(1, popScale(q), 1);
      this.patch.visible = q > 0;
    }
    for (const it of this.items) {
      if (tick) {
        let local: number;
        if (it.set) {
          const a = 0.18 + (it.order / Math.max(1, n)) * 0.62;
          local = THREE.MathUtils.clamp((build - a) / 0.2, 0, 1);
        } else {
          local = THREE.MathUtils.clamp(build / 0.25, 0, 1);
        }
        const q = Math.round(local * 5) / 5; // held poses, like hand-placed props
        const s = it.baseScale * popScale(q);
        it.obj.scale.set(s, s * (q > 0 && q < 1 ? 1.12 : 1), s);
        it.obj.visible = q > 0;
        const bob = it.bob ? Math.sin(Math.round(time * 12) / 12 * 2.4 + it.order) * it.bob : 0;
        it.obj.position.set(it.base.x, it.base.y + bob, it.base.z);
        if (it.wag) it.obj.rotation.y = it.baseRot + Math.sin(Math.round(time * 12) * 0.9) * 0.08;
      }
    }
    this.screens.forEach((sc) => sc.update(on, active, tick));
  }
}

export function pick(t: Text, lang: Lang) {
  return typeof t === 'string' ? t : t[lang];
}

export function buildStations(protos: Map<string, THREE.Object3D>, lang: Lang, dense: boolean) {
  return STATIONS.map((s, i) => new StationRuntime(i, LAYOUT[s.id], protos, lang, dense));
}
