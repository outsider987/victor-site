import * as THREE from 'three';
import { BlendFunction, BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, NoiseEffect, RenderPass, SMAAEffect, ToneMappingEffect, ToneMappingMode, VignetteEffect } from 'postprocessing';
import { N8AOPostPass } from 'n8ao';

export type Tier = 'high' | 'medium' | 'low';

export function detectTier(renderer: THREE.WebGLRenderer): Tier {
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced === 'high' || forced === 'medium' || forced === 'low') return forced;
  const gl = renderer.getContext();
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const name = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '');
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (/SwiftShader|llvmpipe|Software|Basic Render/i.test(name)) return 'low';
  if (coarse) return /Apple GPU|Adreno \(TM\) 7|Mali-G7|Mali-G6/i.test(name) ? 'medium' : 'low';
  if (/Intel/i.test(name) && !/Arc/i.test(name)) return 'medium';
  return 'high';
}

// Stop-motion lens: contact shadows, a shallow miniature focus, lamp bloom, grain.
export class Post {
  composer: EffectComposer | null = null;
  private dof: DepthOfFieldEffect | null = null;

  constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene, private camera: THREE.PerspectiveCamera, public tier: Tier) {
    this.build();
  }

  build() {
    this.composer?.dispose();
    this.composer = null;
    this.dof = null;
    const r = this.renderer;
    if (this.tier === 'low') {
      r.toneMapping = THREE.NeutralToneMapping;
      r.toneMappingExposure = 1.02;
      return;
    }
    r.toneMapping = THREE.NoToneMapping;
    const size = r.getSize(new THREE.Vector2());
    const composer = new EffectComposer(r, { frameBufferType: THREE.HalfFloatType });
    composer.addPass(new RenderPass(this.scene, this.camera));
    const ao = new N8AOPostPass(this.scene, this.camera, size.x, size.y);
    ao.configuration.aoRadius = 1.1;
    ao.configuration.distanceFalloff = 0.9;
    ao.configuration.intensity = 2.4;
    ao.configuration.color = new THREE.Color('#1b0f22');
    ao.configuration.halfRes = this.tier !== 'high';
    ao.configuration.depthAwareUpsampling = true;
    ao.setQualityMode(this.tier === 'high' ? 'Medium' : 'Performance');
    // Screen glass and glows are the only see-through things; AO-aware compositing for them
    // would cost two extra scene passes a frame. N8AO re-enables it on its own unless told not to.
    ao.autoDetectTransparency = false;
    ao.configuration.transparencyAware = false;
    composer.addPass(ao);
    if (this.tier === 'high') {
      this.dof = new DepthOfFieldEffect(this.camera, { focusDistance: 12, focusRange: 7, bokehScale: 2.4, resolutionScale: 0.5 });
      this.dof.target = new THREE.Vector3();
      composer.addPass(new EffectPass(this.camera, this.dof));
    }
    const bloom = new BloomEffect({ intensity: 0.85, luminanceThreshold: 0.78, luminanceSmoothing: 0.2, mipmapBlur: true, radius: 0.72 });
    const vignette = new VignetteEffect({ offset: 0.34, darkness: 0.48 });
    const noise = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT, premultiply: false });
    noise.blendMode.opacity.value = 0.18;
    const tone = new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL });
    // Tone map before the grain and vignette: soft-light grain on HDR highlights (lamp glass,
    // lit windows) breaks into coloured speckle.
    composer.addPass(new EffectPass(this.camera, bloom, tone, vignette, noise));
    composer.addPass(new EffectPass(this.camera, new SMAAEffect()));
    this.composer = composer;
  }

  setTier(t: Tier) {
    if (t === this.tier) return;
    this.tier = t;
    this.build();
  }

  focus(target: THREE.Vector3, range: number) {
    if (!this.dof) return;
    this.dof.target!.copy(target);
    this.dof.cocMaterial.focusRange = range;
  }

  setSize(w: number, h: number) {
    this.composer?.setSize(w, h);
  }

  render(dt: number) {
    if (this.composer) this.composer.render(dt);
    else this.renderer.render(this.scene, this.camera);
  }
}
