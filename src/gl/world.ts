import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Lang } from '../content';
import { claymate } from './clay';
import { createEnvironment, roadZ } from './environment';
import { fontsReady } from './labels';
import { detectTier, Post } from './post';
import { lowerTier, pixelRatio, type Tier } from './quality';
import { followShot, frameRect, PHONE_REGION, Rig, type Layout, type Region, type Shot } from './rig';
import { setMaxAnisotropy, setSmallScreens, uploads } from './screens';
import { buildStations, GAP } from './stations';
import { Victor } from './victor';

export type World = {
  setProgress(p: number): void;
  setLang(l: Lang): void;
  setReducedMotion(v: boolean): void;
};

type Opts = { lang: Lang; reducedMotion: boolean };

const UP = new THREE.Vector3(0, 1, 0);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number, a: number, b: number) => THREE.MathUtils.smoothstep(v, a, b);

function lerpShot(out: Shot, from: Shot, to: Shot, w: number) {
  if (w <= 0) return out;
  out.pos.lerp(to.pos, w);
  out.look.lerp(to.look, w);
  out.focus.lerp(to.focus, w);
  out.range += (to.range - out.range) * w;
  out.shift.lerp(to.shift, w);
  void from;
  return out;
}

export async function createWorld(canvas: HTMLCanvasElement, opts: Opts): Promise<World> {
  // Models first: they're the longest wait (the page preloads them too).
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const base = import.meta.env.BASE_URL;
  const load = (name: string) => loader.loadAsync(`${base}models/${name}.glb`);
  const fonts = fontsReady();
  const assets = Promise.all([load('victor'), load('props')]);
  assets.catch(() => {}); // awaited below; this only keeps an early failure from going unhandled
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
  let tier: Tier = detectTier(renderer);
  const forcedTier = ['high', 'medium', 'low'].includes(new URLSearchParams(location.search).get('tier') ?? '');
  const dpr = (t: Tier) => pixelRatio(t, innerWidth, innerHeight, devicePixelRatio);
  renderer.setPixelRatio(dpr(tier));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.info.autoReset = false;
  // Shader logs are for development; in production the check only costs a sync readback per program.
  renderer.debug.checkShaderErrors = import.meta.env.DEV;
  setMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  // Update visible branches once before rendering, rather than every postprocessing pass.
  scene.matrixWorldAutoUpdate = false;
  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.4, 900);
  let layout: Layout = matchMedia('(max-width: 760px)').matches ? 'phone' : 'desktop';
  const post = new Post(renderer, scene, camera, tier);

  const [victorGltf, propsGltf] = (await assets) as [GLTF, GLTF];

  const protos = new Map<string, THREE.Object3D>();
  for (const child of [...propsGltf.scene.children]) {
    claymate(child);
    const holder = new THREE.Group();
    holder.name = child.name;
    holder.userData = { ...child.userData };
    holder.add(child);
    protos.set(child.name, holder);
  }

  setSmallScreens(layout === 'phone' || tier === 'low');
  const stations = buildStations(protos, opts.lang, layout === 'desktop');
  const length = (stations.length - 1) * GAP;
  const env = createEnvironment(scene, length);
  if (tier === 'low') env.setShadowSize(1024);
  stations.forEach((s) => scene.add(s.group));
  const victor = new Victor(victorGltf, scene);
  // Bake soft studio reflections once; only the glasses use them.
  const studio = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const reflection = pmrem.fromScene(studio, 0.04, 0.1, 100, { size: 128 }).texture;
  studio.dispose();
  pmrem.dispose();
  victor.root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((m) => {
      if (m.name === 'glass_lens') (m as THREE.MeshPhysicalMaterial).envMap = reflection;
    });
  });
  const cloudProto = protos.get('cloud_prop');
  const clouds: THREE.Object3D[] = [];
  if (cloudProto) {
    for (let k = 0; k < 16; k++) {
      const c = cloudProto.clone(true);
      const s = 1.6 + ((k * 37) % 10) / 6;
      c.scale.setScalar(s);
      c.position.set(-20 + k * ((length + 40) / 16) + ((k * 53) % 7), 9 + ((k * 29) % 5), -24 - ((k * 17) % 12));
      c.traverse((o) => ((o as THREE.Mesh).castShadow = false));
      scene.add(c);
      clouds.push(c);
    }
  }

  // Walking paths: from one station's spot, along the road, to the next spot.
  const paths = stations.slice(0, -1).map((s, i) => {
    const a = s.spot, b = stations[i + 1].spot;
    const pts = [a.clone()];
    for (let x = a.x + 1.3; x <= b.x - 1.3; x += 1.8) pts.push(new THREE.Vector3(x, 0, roadZ(x)));
    pts.push(b.clone());
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    return { curve, len: curve.getLength() };
  });
  const lampSpots = stations.flatMap((s) => s.lamps);

  const rig = new Rig(camera);
  let restShots: Shot[] = [];
  // Each station frames its subject beside its own paper tag, measured from the page.
  const tags = [...document.querySelectorAll<HTMLElement>('.station .tag')];
  const computeShots = () => {
    restShots = stations.map((s, i) => {
      let region: Region = PHONE_REGION;
      if (layout === 'desktop') {
        // Layout box, not the transformed one: a tag's fade pose shouldn't move its framing.
        const tag = tags[i];
        const x0 = tag ? Math.min(0.2, ((tag.offsetLeft + tag.offsetWidth + 28) / innerWidth) * 2 - 1) : -0.1;
        region = { x0, x1: 0.95, y0: -0.84, y1: 0.8 };
      }
      return frameRect(camera, s.focus.center, s.focus.size, region, layout === 'phone' ? 0.26 : 0.2);
    });
  };
  computeShots();

  const resize = () => {
    layout = matchMedia('(max-width: 760px)').matches ? 'phone' : 'desktop';
    renderer.setPixelRatio(dpr(tier));
    renderer.setSize(innerWidth, innerHeight, false);
    post.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    computeShots();
    kick = 20;
  };
  addEventListener('resize', resize);

  const pointer = new THREE.Vector2();
  addEventListener('pointermove', (e) => pointer.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)), { passive: true });

  let pTarget = 0;
  let pView = -1;
  let reduced = opts.reducedMotion;
  let lastTick = -1;
  let yawView = 0;
  let kick = 60; // frames to render unconditionally (first frames, resizes)
  let currentLang = opts.lang;
  // Font downloads can finish after the scene starts; refresh the clay signs when they do.
  void fonts.then(() => {
    stations.forEach((s) => s.setLang(currentLang));
    kick = Math.max(kick, 2);
  });
  // Opening shot: waits for the first progress (the loader lifting), plays once. Its clock sums
  // capped frame deltas, so a hitch slows it down instead of skipping it.
  let intro: 'pending' | 'running' | 'done' = 'pending';
  let introT = 0;
  let started = false;
  // The first frame renders behind the loader, compiling the post and shadow programs there.
  let firstFrame: (() => void) | null = null;
  const warmed = new Promise<void>((resolve) => (firstFrame = resolve));
  const perfSamples: number[] = [];
  let wasBusy = false;
  let renderMs = 0;
  const timer = new THREE.Timer();
  timer.connect(document);
  const shot: Shot = { pos: new THREE.Vector3(), look: new THREE.Vector3(), focus: new THREE.Vector3(), range: 8, shift: new THREE.Vector2() };

  renderer.setAnimationLoop((ts) => {
    timer.update(ts);
    if (document.hidden) return;
    const frameSeconds = timer.getDelta();
    const dt = Math.min(0.05, frameSeconds);
    const time = timer.getElapsed();
    const tickIndex = Math.floor(time * 12);
    const tick = tickIndex !== lastTick;
    if (tick) lastTick = tickIndex;

    const prev = pView < 0 ? pTarget : pView;
    if (pView < 0 || reduced) pView = reduced ? Math.round(pTarget) : pTarget;
    else pView += (pTarget - pView) * (1 - Math.exp(-dt * 6.5));
    if (Math.abs(pTarget - pView) < 1e-4) pView = pTarget;
    const pv = (pView - prev) / Math.max(dt, 1e-3);

    const N = stations.length;
    const atEnd = pView >= N - 1 - 1e-4;
    const i = Math.min(Math.floor(pView), N - 2);
    const t = atEnd ? 1 : clamp01(pView - i);
    const path = paths[i];
    const walk = atEnd ? 1 : smooth(t, 0.1, 0.9);
    const prevWalk = atEnd ? 1 : smooth(clamp01(prev - i), 0.1, 0.9);
    const pos = path.curve.getPointAt(walk);
    const speed = (Math.abs(walk - prevWalk) / Math.max(dt, 1e-3)) * path.len;
    const moving = !reduced && !atEnd && speed > 0.08;
    const rest = stations[atEnd ? N - 1 : t < 0.5 ? i : i + 1];
    const tan = path.curve.getTangentAt(Math.min(0.999, Math.max(0.001, walk)));
    const dir = pv >= 0 ? 1 : -1;
    const midway = !atEnd && t > 0.08 && t < 0.92;
    const wantYaw = moving ? Math.atan2(tan.x * dir, tan.z * dir) : midway ? Math.atan2(tan.x, tan.z) * 0.55 : rest.yaw;
    if (tick || reduced) {
      let d = wantYaw - yawView;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yawView += reduced ? d : d * 0.55;
    }
    victor.update(tick || reduced, pos, yawView, moving ? 'walk' : midway ? 'idle' : rest.anim, THREE.MathUtils.clamp(speed / Victor.STRIDE, 0.55, 2.4), reduced);

    // Screens start loading three stops ahead.
    stations.forEach((s, j) => j < pTarget + 3.2 && j > pTarget - 1.5 && s.prefetch());

    stations.forEach((s, j) => {
      const dist = Math.abs(pView - j);
      s.group.visible = dist < 1.75;
      if (!s.group.visible) return;
      const since = intro === 'pending' ? 0 : intro === 'running' ? introT : 99;
      const build = reduced ? 1 : j === 0 ? clamp01((since - 0.1) / 1.7) : clamp01((pView - (j - 0.62)) / 0.56);
      const on = 1 - smooth(dist, 0.04, 0.32);
      s.update(build, dist < 0.05, on, tick || reduced, time);
    });

    // Camera: follow while walking, push into the station's framing on arrival.
    const follow = followShot(pos, moving ? dir : 0, layout);
    shot.pos.copy(follow.pos);
    shot.look.copy(follow.look);
    shot.focus.copy(follow.focus);
    shot.range = follow.range;
    shot.shift.copy(follow.shift);
    const wA = atEnd ? 0 : 1 - smooth(t, 0.0, 0.32);
    const wB = atEnd ? 1 : smooth(t, 0.68, 1.0);
    lerpShot(shot, follow, restShots[atEnd ? N - 1 : i], wA);
    if (!atEnd) lerpShot(shot, follow, restShots[i + 1], wB);
    if (intro === 'pending' && (reduced || pTarget > 0.05)) intro = 'done';
    if (intro === 'pending' && started) intro = 'running';
    if (intro === 'running') introT += dt;
    if (intro !== 'done') {
      // The set assembles around Victor while the camera glides in: it starts pulled back and
      // swung round the hello set, moving from the first frame and easing into the rest framing.
      const k = clamp01(introT / 3);
      const away = Math.pow(1 - k, 3);
      if (k < 1 && pTarget < 0.05) {
        const off = shot.pos.clone().sub(shot.look);
        off.applyAxisAngle(UP, -0.32 * away).multiplyScalar(1 + 0.75 * away);
        off.y += 1.2 * away;
        shot.pos.copy(shot.look).add(off);
        shot.range *= 1 + 0.9 * away;
      } else intro = 'done';
    }
    const moved = rig.update(shot, dt, pointer, reduced || kick > 58 || intro !== 'done', layout);

    const pal = env.update(pView, time, shot.focus, camera.position.x);
    if (tick && !reduced) clouds.forEach((c, k) => (c.position.x += 0.012 + (k % 3) * 0.006));
    if (tick) {
      const near = lampSpots
        .map((v) => ({ v, d: v.distanceToSquared(shot.focus) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, env.lamps.length);
      env.lamps.forEach((l, k) => {
        const n = near[k];
        l.visible = !!n;
        if (n) {
          l.position.copy(n.v);
          l.intensity = 5 + pal.night * 13; // lit from dusk, brightest at night
        }
      });
    }
    post.focus(shot.focus, shot.range);

    const busy = kick > 0 || moved > 1e-4 || Math.abs(pv) > 1e-3;
    // Decoded shots go up to the GPU one at a time, on frames between stop-motion ticks while the
    // camera rests or barely drifts, where the copy costs no visible frame. A screen about to power
    // on takes its shots at once.
    const calm = moved < 3e-3 && Math.abs(pv) < 0.01;
    if (!tick && (!busy || calm)) stations.some((s, j) => j < pTarget + 3.2 && j > pTarget - 1.5 && s.loadVideo());
    else if (!tick) stations.some((s, j) => Math.abs(j - pView) < 0.5 && s.loadVideo());
    if (uploads.length) {
      uploads.sort((a, b) => Math.abs(a.station - pView) - Math.abs(b.station - pView));
      if ((!tick && (!busy || calm)) || Math.abs(uploads[0].station - pView) < 0.8) {
        const up = uploads.shift()!;
        renderer.initTexture(up.tex);
        up.done();
      }
    }
    if (busy || tick) {
      scene.children.forEach((child) => {
        if (child.visible) child.updateMatrixWorld();
      });
      // Pointer-only camera movement doesn't change the light or the held clay poses.
      renderer.shadowMap.needsUpdate ||= tick || pView !== prev || kick > 0;
      renderer.info.reset();
      const r0 = performance.now();
      post.render(dt);
      renderMs = renderMs * 0.9 + (performance.now() - r0) * 0.1;
      firstFrame?.();
      firstFrame = null;
      if (!forcedTier && tier !== 'low' && time > 4 && busy && wasBusy && frameSeconds > 0) {
        // Measure real frame time, not the capped animation delta. Recheck after each downgrade.
        perfSamples.push(frameSeconds);
        if (perfSamples.length >= 45) {
          const med = perfSamples.sort((a, b) => a - b)[22];
          perfSamples.length = 0;
          const next = lowerTier(tier, med);
          if (next !== tier) {
            tier = next;
            renderer.setPixelRatio(dpr(tier));
            post.setTier(tier);
            post.setSize(innerWidth, innerHeight);
            if (tier === 'low') env.setShadowSize(1024);
            setSmallScreens(tier === 'low' || layout === 'phone');
            kick = Math.max(kick, 2);
          }
        }
      }
    }
    if (!busy) perfSamples.length = 0;
    wasBusy = busy;
    if (kick > 0) kick--;
  });

  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__world = {
      scene,
      get state() {
        return { intro, introT: +introT.toFixed(2), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, renderMs: +renderMs.toFixed(1), programs: renderer.info.programs?.length, tier, pTarget, pView, cam: camera.position.toArray().map((v) => +v.toFixed(2)), look: shot.look.toArray().map((v) => +v.toFixed(2)), shift: shot.shift.toArray(), rest: restShots.map((r) => r.pos.toArray().map((v) => +v.toFixed(1))) };
      },
    };
  }

  await warmed;
  return {
    setProgress(p: number) {
      pTarget = p;
      started = true;
    },
    setLang(l: Lang) {
      currentLang = l;
      stations.forEach((s) => s.setLang(l));
      kick = Math.max(kick, 2);
    },
    setReducedMotion(v: boolean) {
      reduced = v;
      kick = 10;
    },
  };
}
