import * as THREE from 'three';

export type Layout = 'desktop' | 'phone';
export type Shot = { pos: THREE.Vector3; look: THREE.Vector3; focus: THREE.Vector3; range: number; shift: THREE.Vector2 };

// Region in NDC where the subject may sit: desktop keeps clear of the paper tag,
// phones keep it in the top half above the scrolling tag.
export type Region = { x0: number; x1: number; y0: number; y1: number };
export const PHONE_REGION: Region = { x0: -0.94, x1: 0.94, y0: -0.02, y1: 0.84 };

export function frameRect(camera: THREE.PerspectiveCamera, center: THREE.Vector3, size: THREE.Vector2, region: Region, elev = 0.2): Shot {
  const tanf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  const w = region.x1 - region.x0, h = region.y1 - region.y0;
  const dW = size.x / (w * tanf * camera.aspect);
  const dH = size.y / (h * tanf);
  const d = Math.max(dW, dH) * 1.03;
  const dir = new THREE.Vector3(0, elev, 1).normalize();
  const pos = center.clone().addScaledVector(dir, d);
  const shift = new THREE.Vector2((region.x0 + region.x1) / 2, (region.y0 + region.y1) / 2);
  return { pos, look: center.clone(), focus: center.clone(), range: Math.max(4, size.x * 0.9), shift };
}

export function followShot(target: THREE.Vector3, heading: number, layout: Layout): Shot {
  const back = layout === 'phone' ? new THREE.Vector3(-0.6, 5.2, 19) : new THREE.Vector3(-1.4, 3.4, 12.6);
  const pos = target.clone().add(back);
  const look = target.clone().add(new THREE.Vector3(heading * 1.6 - 0.4, 1.35, -1.2));
  return { pos, look, focus: target.clone().add(new THREE.Vector3(0, 1, 0)), range: 7, shift: new THREE.Vector2(0, layout === 'phone' ? 0.2 : 0) };
}

export class Rig {
  private pos = new THREE.Vector3();
  private look = new THREE.Vector3();
  private shift = new THREE.Vector2();
  private started = false;

  constructor(public camera: THREE.PerspectiveCamera) {}

  // Returns how far the camera moved this frame, so the caller can skip idle renders.
  update(target: Shot, dt: number, pointer: THREE.Vector2, snap: boolean, layout: Layout) {
    const px = layout === 'desktop' ? pointer.x * 0.32 : 0;
    const py = layout === 'desktop' ? pointer.y * 0.18 : 0;
    const want = target.pos.clone().add(new THREE.Vector3(px, py, 0));
    const before = this.camera.position.clone();
    if (!this.started || snap) {
      this.pos.copy(want);
      this.look.copy(target.look);
      this.shift.copy(target.shift);
      this.started = true;
    } else {
      const k = 1 - Math.exp(-dt * 4.2);
      this.pos.lerp(want, k);
      this.look.lerp(target.look, k);
      this.shift.lerp(target.shift, k);
    }
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
    // Lens shift: slide the image so the subject lands at shift (NDC) without turning the camera.
    const W = 1000, H = 1000 / this.camera.aspect;
    this.camera.setViewOffset(W, H, (-this.shift.x * W) / 2, (this.shift.y * H) / 2, W, H);
    return before.distanceTo(this.pos);
  }
}
