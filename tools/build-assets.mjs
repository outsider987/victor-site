// Builds every shipped asset from its source: optimized clay models, work screens, video, résumés.
// Sources: Blender exports in tools/clay/out, live-site captures in tools/capture/out (tools/capture/*.mjs),
// project repos under ~/github and ~/mygame, and the résumé PDFs. Outputs land in public/ and are committed.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { NodeIO, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, resample, simplify, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const ROOT = new URL('..', import.meta.url).pathname;
const HOME = homedir();
const CAP = join(ROOT, 'tools/capture/out');
const OUT = join(ROOT, 'public');
const only = process.argv[2];

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;

// ---------------------------------------------------------------- clay models
async function models() {
  await MeshoptEncoder.ready;
  await MeshoptSimplifier.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
  for (const [name, ratio] of [['victor', 1], ['props', 0.62]]) {
    const src = join(ROOT, 'tools/clay/out', `${name}.glb`);
    if (!existsSync(src)) throw new Error(`missing ${src}: run the Blender scripts in tools/clay first`);
    const doc = await io.read(src);
    const steps = [dedup({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH, PropertyType.TEXTURE] }), weld()];
    if (ratio < 1) steps.push(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0015 }));
    steps.push(resample(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    await doc.transform(...steps);
    const dst = join(OUT, 'models', `${name}.glb`);
    mkdirSync(dirname(dst), { recursive: true });
    await io.write(dst, doc);
    console.log('model', name, kb(src), '→', kb(dst));
  }
}

// ---------------------------------------------------------------- screens
// Every screen is 16:10 so it fills the clay frame; crop = WxH+X+Y on the source, applied before resizing.
const R = (p) => join(HOME, p);
const SHOTS = [
  ['cypherlab/markets', R('github/victor_resume/public/projects/cypherlab/hero.png'), '1760x1100+0+0', 1760],
  ['cypherlab/audit', join(CAP, 'cypherlab-audit-redacted.png'), null, 1600],
  ['mediconcen/ocr', R('github/victor_resume/public/projects/mediconcen/hero.png'), null, 2048],
  ['mediconcen/clinic', R('github/victor_resume/public/projects/mediconcen/clinic.png'), null, 1600],
  ['3ccash/home', join(CAP, '3ccash-d.png'), null, 2048],
  ['3ccash/quote', join(CAP, '3ccash-quote-d.png'), null, 2048],
  ['temple/shop', join(CAP, 'temple-d.png'), null, 2048],
  ['temple/fund', join(CAP, 'temple-fund-d.png'), null, 2048],
  ['temple/calendar', join(CAP, 'temple-cal-d.png'), null, 2048],
  ['sandstorm/board', join(CAP, 'sandstorm-after-d.png'), null, 2048],
  ['sandstorm/title', join(CAP, 'sandstorm-title-d.png'), null, 2048],
  ['betcorgi/crash', join(CAP, 'casino-crashGame.png'), null, 2048],
  ['betcorgi/lobby', join(CAP, 'casino-d.png'), null, 2048],
  ['betcorgi/plinko', join(CAP, 'casino-plinkoGame.png'), null, 2048],
  ['ironvale/courtyard', R('github/mygame/builds/male_hero/captures/environment_hero.png'), null, 1280],
  ['ironvale/sprites', R('github/mygame/art/characters/male_hero/packed/hero_pose_review.png'), null, 1344],
];
// Shown only in the lightbox, never on a clay screen, so they need no small cut.
const LIGHTBOX_ONLY = new Set(['ironvale/sprites']);
// Phone screens: 0.49 aspect to match the clay phone stand.
const PHONES = [
  ['3ccash/mobile', join(CAP, '3ccash-m.png')],
  ['temple/mobile', join(CAP, 'temple-m.png')],
];

function redactAudit() {
  // Operator e-mails are real colleague identities: pixelate the actor column and the modal's author fields.
  const src = join(CAP, 'cypherlab-audit-src.png');
  const dst = join(CAP, 'cypherlab-audit-redacted.png');
  const regions = [['200x660+345+300'], ['134x24+686+311'], ['294x26+763+496']];
  const tmp = regions.map((_, i) => join(CAP, `_r${i}.png`));
  regions.forEach(([geo], i) => run('convert', [src, '-crop', geo, '+repage', '-scale', '6%', '-scale', '1667%', tmp[i]]));
  const args = [src];
  regions.forEach(([geo], i) => args.push(tmp[i], '-geometry', `+${geo.split('+')[1]}+${geo.split('+')[2]}`, '-composite'));
  run('convert', [...args, dst]);
}

function screens() {
  redactAudit();
  for (const [name, src, crop, width] of SHOTS) {
    const dst = join(OUT, 'works', `${name}.webp`);
    mkdirSync(dirname(dst), { recursive: true });
    const args = [src];
    if (crop) args.push('-crop', crop, '+repage');
    // Full size for the lightbox and desktop screens, a 1024px cut for phones and weak GPUs.
    args.push('-resize', `${width}x>`, '-strip', '-quality', '86', '-define', 'webp:method=6');
    const small = dst.replace(/\.webp$/, '@1k.webp');
    if (LIGHTBOX_ONLY.has(name)) args.push(dst);
    else args.push('-write', dst, '-resize', '1024x>', '-quality', '84', small);
    run('convert', args);
    console.log('screen', name, kb(dst), LIGHTBOX_ONLY.has(name) ? '' : kb(small));
  }
  for (const [name, src] of PHONES) {
    const dst = join(OUT, 'works', `${name}.webp`);
    // Keep the top of the page: crop to 0.49 aspect from the top, then size for the stand.
    run('convert', [src, '-gravity', 'north', '-crop', '1170x2388+0+0', '+repage', '-resize', '620x', '-strip', '-quality', '86', dst]);
    console.log('phone', name, kb(dst));
  }
}

function video() {
  const src = R('github/mygame/builds/male_hero/mistpine_attack.mp4');
  const dst = join(OUT, 'works/ironvale/attack.mp4');
  run('ffmpeg', ['-y', '-v', 'error', '-i', src, '-an', '-vf', 'scale=1280:-2,fps=30', '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-crf', '25', '-movflags', '+faststart', dst]);
  console.log('video', 'ironvale/attack', kb(dst));
}

function resumes() {
  const docs = '/mnt/c/Users/outsider/Documents';
  const map = [['Victor_Chang_FullStack_Resume.pdf', 'Victor_Chang_FullStack.pdf'], ['Victor_Chang_FE_Resume_v11.pdf', 'Victor_Chang_Frontend.pdf'], ['Victor_Chang_Backed.pdf', 'Victor_Chang_Backend.pdf']];
  mkdirSync(join(OUT, 'resume'), { recursive: true });
  for (const [from, to] of map) {
    copyFileSync(join(docs, from), join(OUT, 'resume', to));
    console.log('résumé', to);
  }
}

// ---------------------------------------------------------------- page materials
// The clay bead is rendered by tools/clay/ui.py and tinted in CSS; the paper grain is generated
// here (fine grain plus a few long fibres), wrapped at the edges so it tiles without seams.
function ui() {
  mkdirSync(join(OUT, 'ui'), { recursive: true });
  const bead = join(ROOT, 'tools/clay/out/ui-bead.png');
  if (!existsSync(bead)) throw new Error(`missing ${bead}: run tools/clay/ui.py in Blender first`);
  run('convert', [bead, '-resize', '96x96', '-strip', '-quality', '92', '-define', 'webp:alpha-quality=100', join(OUT, 'ui/bead.webp')]);
  console.log('ui bead', kb(join(OUT, 'ui/bead.webp')));
  run('convert', [
    '-size', '256x256', 'xc:gray50', '-seed', '17', '+noise', 'Gaussian', '-virtual-pixel', 'tile', '-blur', '0x0.7', '-colorspace', 'gray', '-auto-level', '+level', '24%,76%',
    '(', '-size', '256x256', 'xc:black', '-seed', '23', '+noise', 'Random', '-colorspace', 'gray', '-threshold', '99.3%', '-virtual-pixel', 'tile', '-motion-blur', '0x9+25', '-auto-level', '+level', '0,42%', ')',
    '-compose', 'screen', '-composite', '-strip', '-quality', '82', join(OUT, 'ui/paper.webp'),
  ]);
  console.log('ui paper', kb(join(OUT, 'ui/paper.webp')));
}

const jobs = { models, screens, video, resumes, ui };
for (const [name, job] of Object.entries(jobs)) {
  if (!only || only === name) await job();
}
