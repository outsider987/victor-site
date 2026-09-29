// Run with Node 22.18+: node tools/check-quality.mjs
import assert from 'node:assert/strict';
import { lowerTier, pixelRatio } from '../src/gl/quality.ts';

for (const [tier, budget] of [['high', 1920 * 1080], ['medium', 1280 * 720], ['low', 960 * 540]]) {
  for (const [w, h, dpr] of [[1440, 900, 2], [3840, 2160, 2], [390, 844, 3], [800, 600, 1]]) {
    const ratio = pixelRatio(tier, w, h, dpr);
    assert.ok(w * h * ratio ** 2 <= budget + 1, `${tier}: pixel budget exceeded`);
    assert.ok(ratio > 0 && ratio <= dpr);
  }
  assert.equal(lowerTier(tier, 1 / 60), tier, 'fast frames should preserve quality');
  assert.equal(lowerTier(tier, 0.12), 'low', 'slow frames must reach low quality');
}
assert.equal(pixelRatio('high', 800, 600, 1), 1);
assert.equal(lowerTier('high', 1 / 40), 'medium');
assert.equal(lowerTier('medium', 1 / 40), 'medium');
assert.equal(lowerTier('low', 1 / 40), 'low', 'never upgrade automatically');
console.log('Quality checks passed');
