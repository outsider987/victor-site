import * as THREE from 'three';

let maxAniso = 8;
let small = false;
export function setMaxAnisotropy(n: number) {
  maxAniso = n;
}
// Phones and weak GPUs take the 1024px cut of each shot; the stand-up phone shots are already small.
export function setSmallScreens(v: boolean) {
  small = v;
}

// Decode off the main thread where the browser can, so arriving at a station never waits on a WebP decode.
const ua = navigator.userAgent;
const safari = /^((?!chrome|android).)*safari/i.test(ua) ? +(ua.match(/Version\/(\d+)/)?.[1] ?? 0) : Infinity;
const firefox = /Firefox\/(\d+)/.exec(ua);
const useBitmaps = typeof createImageBitmap === 'function' && safari >= 17 && !(firefox && +firefox[1] < 98);
const bitmapLoader = useBitmaps ? new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none' }) : null;
const imageLoader = new THREE.TextureLoader();

// Decoded textures wait here for the world to put them on the GPU; a screen shows a shot only once it's there.
export const uploads: { tex: THREE.Texture; station: number; done: () => void }[] = [];

function loadTexture(url: string, station: number, done: (t: THREE.Texture) => void) {
  const src = small && !url.endsWith('/mobile.webp') ? url.replace(/\.webp$/, '@1k.webp') : url;
  const finish = (t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.needsUpdate = true;
    uploads.push({ tex: t, station, done: () => done(t) });
  };
  if (bitmapLoader) {
    bitmapLoader.loadAsync(src).then((bmp) => {
      const t = new THREE.Texture(bmp);
      t.flipY = false;
      finish(t);
    }, () => {});
  } else imageLoader.loadAsync(src).then(finish, () => {});
}

// A work screen: cycles its shots with a stepped shutter wipe, powers on when the camera arrives.
export class Screen {
  mesh: THREE.Mesh;
  private uniforms = {
    uA: { value: null as THREE.Texture | null },
    uB: { value: null as THREE.Texture | null },
    uMix: { value: 0 },
    uOn: { value: 0 },
  };
  private textures: (THREE.Texture | null)[];
  private requested = false;
  private index = 0;
  private hold = 0;
  private wipe = -1;
  constructor(private urls: string[], width: number, height: number, private station: number) {
    const glassTex = (() => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 160;
      const g = c.getContext('2d')!;
      const gr = g.createLinearGradient(0, 0, 256, 160);
      gr.addColorStop(0, 'rgba(255,255,255,0.0)');
      gr.addColorStop(0.42, 'rgba(255,255,255,0.0)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.55)');
      gr.addColorStop(0.62, 'rgba(255,255,255,0.0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 160);
      return new THREE.CanvasTexture(c);
    })();
    this.textures = urls.map(() => null);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uA, uB; uniform float uMix, uOn; varying vec2 vUv;
        void main(){
          vec3 a = texture2D(uA, vUv).rgb;
          vec3 b = texture2D(uB, vUv).rgb;
          float edge = uMix * 1.15 - 0.05 + sin(vUv.x * 21.0) * 0.012;
          vec3 c = mix(a, b, step(1.0 - vUv.y, edge));
          float v = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x) * smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.93, vUv.y);
          c *= mix(0.9, 1.0, v) * mix(0.08, 1.0, uOn);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: glassTex, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending }));
    glass.position.z = 0.012;
    this.mesh.add(glass);
  }

  // Start loading when the station is a couple of stops away.
  ensure() {
    if (this.requested) return;
    this.requested = true;
    this.urls.forEach((url, i) =>
      loadTexture(url, this.station, (t) => {
        this.textures[i] = t;
        if (this.wipe < 0) this.show();
      }),
    );
  }

  private show() {
    const n = this.textures.length;
    const a = this.textures[this.index] ?? this.textures.find(Boolean) ?? null;
    this.uniforms.uA.value = a;
    this.uniforms.uB.value = this.textures[(this.index + 1) % n] ?? a;
  }

  // on: 0..1 power; active: the camera is resting here; tick: a 12 fps frame elapsed.
  update(on: number, active: boolean, tick: boolean) {
    this.uniforms.uOn.value = on;
    if (!tick || this.textures.length < 2) return;
    if (this.wipe >= 0) {
      this.wipe += 1 / 5;
      this.uniforms.uMix.value = Math.min(1, this.wipe);
      if (this.wipe >= 1) {
        this.index = (this.index + 1) % this.textures.length;
        this.show();
        this.uniforms.uMix.value = 0;
        this.wipe = -1;
        this.hold = 0;
      }
      return;
    }
    if (active && on > 0.95) {
      this.hold++;
      const holdFrames = 12 * 4;
      const next = this.textures[(this.index + 1) % this.textures.length];
      if (this.hold > holdFrames && this.textures[this.index] && next) this.wipe = 0;
    }
  }

  get current() {
    return this.index;
  }
}
