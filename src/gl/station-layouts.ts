import type { L } from '../content';
import type { LabelStyle } from './labels';

type V3 = [number, number, number];
export type Text = L | string;
export type Place = {
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
export type Def = {
  props: Place[];
  victor: { at: [number, number]; yaw: number; anim: RestAnim };
  focus: { min: [number, number]; max: [number, number]; z: number };
  keepOut: [number, number, number, number];
};

const PLAQUE: LabelStyle = { bg: '#efe4cf', fg: '#3a2530', weight: 800 };
const SIGN: LabelStyle = { bg: '#c9956a', fg: '#2e1c14', weight: 800 };

function workStation(extras: Place[], frame = '#efe4cf'): Def {
  return {
    props: [{ prop: 'screen_frame', at: [1.5, 0, -2.3], screen: 'main', tint: { clay_frame: frame } }, ...extras],
    victor: { at: [0.05, -1.15], yaw: 0.3, anim: 'present' },
    focus: { min: [-1.3, -0.35], max: [4.3, 5.66], z: -2.1 },
    keepOut: [-6.5, 7, -5.4, 2.4],
  };
}

export const LAYOUT: Record<string, Def> = {
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
  cypherlab: workStation([
    { prop: 'scoreboard', at: [-4.9, 0, -3.4], rot: 0.3, label: { anchor: 'panel', text: '● LIVE   1.72   2.14   3.40', style: { bg: '#141318', fg: '#7dff9c', weight: 700, engrave: false } } },
    { prop: 'trophy', at: [3.55, 0, 0.9], s: 1.25, rot: -0.3 },
    { prop: 'gamepad', at: [2.45, 0, 1.35], s: 1.5, rot: -0.5 },
    { prop: 'lamp_post', at: [-3.4, 0, -0.1] },
  ], '#e8553a'),
  mediconcen: workStation([
    { prop: 'clinic', at: [-5.4, 0, -3.9], rot: 0.32 },
    { prop: 'clipboard', at: [3.5, 0, 0.8], rot: -0.35, s: 1.3 },
    { prop: 'pill_bottle', at: [2.55, 0, 1.3], s: 1.35 },
    { prop: 'lamp_post', at: [-3.3, 0, -0.1] },
  ], '#9fd3d6'),
  vote: workStation([
    { prop: 'storyboard', at: [-5.1, 0, -3.4], rot: 0.32, s: 1.45, label: { anchor: 'board', text: { en: 'COUNTING\n正 正 正', zh: '開票中\n正 正 正' }, style: { bg: '#f8f4e9', fg: '#1b2226', font: 'zh', weight: 700 } } },
    { prop: 'clipboard', at: [3.4, 0, 0.9], rot: -0.35, s: 1.5, label: { anchor: 'paper', text: { en: '22 COUNTIES', zh: '22 縣市' }, style: { bg: '#f8f4e9', fg: '#1b2226', weight: 700 } } },
    { prop: 'lamp_post', at: [-3.3, 0, -0.1] },
  ], '#c7cfcb'),
  '3ccash': workStation([
    { prop: 'shop', at: [-5.3, 0, -3.5], rot: 0.36, label: { anchor: 'label', text: '3C換金所', style: { bg: '#2fbf71', fg: '#ffffff', font: 'zh', weight: 700 } } },
    { prop: 'camera', at: [-5.7, 1.11, -3.15], rot: 0.5, s: 1.1 },
    { prop: 'laptop', at: [-4.6, 1.11, -2.9], rot: 0.2 },
    { prop: 'phone_stand', at: [3.55, 0, 0.55], rot: -0.35, screen: 'phone', s: 1.05 },
    { prop: 'bubble', at: [4.4, 1.95, 0.2], rot: -0.4, s: 0.9, bob: 0.1 },
  ], '#f2ede3'),
  temple: workStation([
    { prop: 'gate', at: [-5.2, 0, -3.8], rot: 0.3, label: { anchor: 'plaque', text: '天鳳宮', style: { bg: '#e6a92e', fg: '#6a1f16', font: 'zh', weight: 700 } } },
    { prop: 'lantern', at: [-6.5, 1.98, -3.4], rot: 0.3 },
    { prop: 'lantern', at: [-3.95, 1.98, -4.2], rot: 0.3 },
    { prop: 'phone_stand', at: [3.55, 0, 0.55], rot: -0.35, screen: 'phone', s: 1.05 },
    { prop: 'lantern', at: [4.55, 1.9, 0.1], rot: -0.2, bob: 0.03 },
  ], '#c9332b'),
  sandstorm: workStation([
    { prop: 'pyramid', at: [-5.6, 0, -4.8], s: 1.25, rot: 0.2 },
    { prop: 'dune', at: [-3.6, 0, -1.9], s: 1.3 },
    { prop: 'dune', at: [4.8, 0, -3.9], s: 1.5, rot: 0.6 },
    { prop: 'slot_machine', at: [3.7, 0, 0.45], rot: -0.35, screen: 'slot', s: 0.95 },
    { prop: 'scarab', at: [-3.1, 0.05, 0.9], s: 1.9, rot: 0.6 },
  ], '#e0a02a'),
  betcorgi: workStation([
    { prop: 'plinko', at: [-5.3, 0, -3.1], rot: 0.32 },
    { prop: 'corgi', at: [-3.3, 0, 0.9], rot: 0.7, s: 1.35, wag: true },
    { prop: 'dice', at: [3.2, 0, 1.0], s: 1.3, rot: 0.3 },
    { prop: 'dice', at: [3.85, 0, 1.4], s: 1.1, rot: 1.1 },
    { prop: 'bench', at: [5.6, 0, -1.6], rot: -0.4 },
  ], '#e8903f'),
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
