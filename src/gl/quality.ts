export type Tier = 'high' | 'medium' | 'low';

// Bound GPU work on Retina and large displays; DOM text stays at native resolution.
export function pixelRatio(tier: Tier, width: number, height: number, deviceRatio: number) {
  const pixels = { high: 1920 * 1080, medium: 1280 * 720, low: 960 * 540 }[tier];
  const cap = { high: 2, medium: 1.5, low: 1 }[tier];
  return Math.min(deviceRatio, cap, Math.sqrt(pixels / Math.max(1, width * height)));
}

export function lowerTier(tier: Tier, frameSeconds: number): Tier {
  if (frameSeconds > 1 / 30) return 'low';
  if (frameSeconds > 1 / 50 && tier === 'high') return 'medium';
  return tier;
}
