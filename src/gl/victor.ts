import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { claymate } from './clay';

// Clay Victor. The pose only advances on 12 fps ticks, like an animator moving the puppet.
export class Victor {
  root: THREE.Object3D;
  private mixer: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction> = {};
  private current = '';
  private shadow: THREE.Mesh;
  static STRIDE = 0.7; // world units covered by one walk cycle

  constructor(gltf: GLTF, scene: THREE.Scene) {
    this.root = gltf.scene;
    claymate(this.root);
    this.root.scale.setScalar(0.94);
    this.mixer = new THREE.AnimationMixer(this.root);
    for (const clip of gltf.animations) {
      const action = this.mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      this.actions[clip.name] = action;
    }
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(20,10,24,0.75)');
    gr.addColorStop(0.55, 'rgba(20,10,24,0.35)');
    gr.addColorStop(1, 'rgba(20,10,24,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.renderOrder = 1;
    scene.add(this.root, this.shadow);
    this.play('idle', 0);
  }

  private play(name: string, fade = 0.25) {
    if (name === this.current || !this.actions[name]) return;
    const next = this.actions[name];
    next.reset().setEffectiveWeight(1).play();
    if (this.current) this.actions[this.current].crossFadeTo(next, fade, false);
    this.current = name;
  }

  update(tick: boolean, pos: THREE.Vector3, yaw: number, anim: string, walkRate: number, still: boolean) {
    if (!tick) return;
    this.root.position.copy(pos);
    this.root.rotation.y = yaw;
    this.play(anim);
    if (this.actions.walk) this.actions.walk.timeScale = walkRate;
    if (!still) this.mixer.update(1 / 12);
    this.shadow.position.set(pos.x, 0.07, pos.z);
  }
}
