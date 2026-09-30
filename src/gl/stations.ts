import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { stations as STATIONS, works, type Lang } from '../content';
import { clay } from './clay';
import { roadZ } from './environment';
import { labelMesh } from './labels';
import { LAYOUT, type Def, type Place, type RestAnim, type Text } from './station-layouts';
import { Screen } from './screens';

export const GAP = 17;
const workById = Object.fromEntries(works.map((w) => [w.id, w]));

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
          if (p.screen === 'main') urls = work.shots.map((sh) => sh.src);
          else if (p.screen === 'phone') urls = work.phone ? [work.phone.src] : [work.shots[0].src];
          else urls = [work.shots[work.shots.length - 1].src];
          const screen = new Screen(urls, a[3], a[4], index);
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
