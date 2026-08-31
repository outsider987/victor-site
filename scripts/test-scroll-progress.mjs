import assert from "node:assert/strict";
import { scrollProgress } from "../src/components/scroll-progress.ts";

assert.equal(scrollProgress(0, [0, 800, 1600]), 0);
assert.equal(scrollProgress(400, [0, 800, 1600]), 0.5);
assert.equal(scrollProgress(1200, [0, 800, 1600]), 1.5);
assert.equal(scrollProgress(2000, [0, 800, 1600]), 2);
