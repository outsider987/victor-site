# victor-site

[![Deploy to GitHub Pages](https://github.com/outsider987/victor-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/outsider987/victor-site/actions/workflows/deploy.yml)

Portfolio of **Victor Chang**, senior full-stack engineer. A stop-motion clay set built with three.js: scroll, and a clay Victor walks one tabletop road past twelve stops — hello, what he builds with, seven works, how he works with AI, the road so far, and contact. At each stop the camera settles and the work's real screens light up in a clay frame beside a paper tag that explains it. English first, with a 中文 toggle.

**[Live → outsider987.github.io/victor-site](https://outsider987.github.io/victor-site/)**

## Stack

- **Vite 8 + TypeScript 7**, no UI framework. All copy lives in `src/content.ts` and is prerendered into the HTML at build time, so the page reads fine without JavaScript or WebGL.
- **three.js 0.186** with pmndrs **postprocessing** and **N8AO**: contact shadows, a shallow miniature focus, lamp bloom, grain.
- **Blender 5.2**, headless: every model is sculpted procedurally by script (`tools/clay`), then optimized with **gltf-transform + meshoptimizer**.

## Layout

```
index.html            shell; the build fills in <!--head--> and <!--body-->
src/content.ts        every word on the site, both languages
src/render.ts         content → HTML (used by the Vite plugin in vite.config.ts)
src/main.ts           language toggle, scroll → stations, lightbox, boot
src/scroll.ts         page scroll → station progress (dwell at a stop, then travel)
src/styles.css        paper tags, beads, loader, flat fallback
src/gl/world.ts       renderer, loading and warm-up, the frame loop
src/gl/stations.ts    the twelve stop layouts and their stop-motion runtime
src/gl/rig.ts         camera: follow while walking, frame the set beside its tag on arrival
src/gl/environment.ts sky, hills, terrain, road, lights; palette from dusk to dawn
src/gl/screens.ts     work screens: shot wipes, video, texture streaming
src/gl/victor.ts      the clay figure on 12 fps animation steps
src/gl/clay.ts        clay materials (fingerprint bump, sheen, hair strands)
src/gl/post.ts        GPU tiers and the post chain
tools/clay/           Blender scripts: character.py, props.py, lib.py
tools/capture/        Playwright scripts that shot the live works
tools/build-assets.mjs  models, screens, video and résumés → public/
```

## Commands

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # typecheck + production build into dist/ (served from /victor-site/)
npm run preview    # serve dist/ at http://127.0.0.1:4173/victor-site/
npm run assets     # rebuild public/ from sources (see below)
```

Useful while developing: `?tier=high|medium|low` forces a GPU tier, and in dev `window.__world.state` reports draw calls, triangles and camera state.

## Assets

Everything in `public/` is generated and committed, so CI needs neither Blender nor the sources.

1. **Models.** `blender --background --factory-startup --python tools/clay/character.py -- tools/clay/out` (and `props.py` the same way; add `--preview` for EEVEE stills).
2. **Screens.** The capture scripts in `tools/capture/` need Playwright installed (it isn't a project dependency) and write to `tools/capture/out/`.
3. **Build.** `npm run assets` (or `npm run assets -- models|screens|video|resumes`) optimizes the models, cuts every screen to 16:10 at full size plus a 1024px copy for phones, redacts operator identities in the CypherLab audit shot, encodes the Ironvale clip and copies the three résumés.

## Performance notes

- The 3D chunk downloads at once but starts only after first paint; the models are preloaded from the head.
- Shaders compile against the real render target, the post chain compiles during the model download, and one frame per stop is rendered behind the loader, so nothing compiles or uploads mid-scroll for the first time.
- Work screens decode off the main thread (ImageBitmap) and go to the GPU one per frame while the camera rests; the video buffers early.
- Paper tags sit on their own compositor layers and are painted once behind the loader.
- Three tiers (high, medium, low) set pixel ratio, AO, depth of field and shadow resolution. A frame-time check can step the tier down once after start-up.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: Node 22, `npm ci`, `npm run build`, then `dist/` to GitHub Pages.

## Content rules

`PRODUCT.md` holds the audience, positioning and confidentiality rules: no operator identities, wager or pricing details, or patient data; screens come from development or public demo builds.
