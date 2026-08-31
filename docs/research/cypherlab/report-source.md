# CypherLab case-study deep research

**Audience:** portfolio owner and hiring-manager readers  
**Date:** 2026-08-30  
**Scope:** verify the public CypherLab story against the local repository family, audit the current English/Traditional Chinese case-study presentation, and define an evidence-safe redesign direction. This report does not change production or portfolio code.

## Assumptions

- The page should communicate engineering judgment to a hiring manager, not document every service.
- The local checkout is the strongest available implementation evidence; it does not prove production scale, business impact, deployment geography, or sole personal ownership.
- Real operations screens and internal identifiers remain private. The existing `hero.webp` is a safe fictional reconstruction.
- The absent pricing-engine repository is a hard boundary: its algorithm and exact override precedence must stay undisclosed and unclaimed.

## Executive answer

The strongest truthful story is **one live market, two trust loops**:

1. **Observe:** normalize an incoming event, cross an intentionally opaque pricing boundary, merge a versioned full/diff projection, and refresh only the affected fixture.
2. **Control:** validate an operator command, route it through approval when required, publish scoped override state, recompute, and distinguish pending from engine-visible application in the UI.

The current page contains these facts, but four equal tabs and six equal service cards obscure them. `Score / phase` and `Trading state` are product effects of the same projection path, not independent architectures. The redesign should therefore show both loops together around one large product surface, with no tabs and no horizontal card rail.

## What the repositories support

### 1. The read path is a projection problem, not a service inventory

The inspected projection stores one computed event per fixture. A full event replaces the fixture snapshot; a diff merges market/selection changes and removals. Both are guarded by per-fixture `ComputeSeq` before typed status changes are emitted (`backoffice-v2/internal/marketprojections/projection.go:3-18,57-66,77-179`).

The public-safe description should be:

> Version-check the computed update, merge it into one fixture projection, then refresh the affected operator view.

Do not say that NATS itself makes application state exactly-once or strictly ordered. JetStream consumers can redeliver when work is not acknowledged, so the application-level sequence guard is the meaningful design decision ([NATS acknowledgment and redelivery](https://docs.nats.io/learn/jetstream/acknowledgment)).

### 2. Context, trading state, and odds are separate product dimensions

There is no independent market-status field. Market state is derived from the complete selection set: any open selection makes it open, all settled makes it settled, and all suspended (or empty) makes it suspended (`backoffice-v2/internal/marketprojections/sm_reader.go:319-360`). Match-level live operational state is narrower: it is open/suspended over relevant market archetypes, while terminal closed remains fixture-lifecycle driven (`backoffice-v2/internal/marketprojections/operational_status.go:5-24`).

That means the current sentence “selection → market → match” is directionally useful but too broad. The page should label three effects beside the product visual instead:

- **Odds:** computed price, line, probability.
- **Availability:** selection status and derived market state; relevant live markets inform match operational state.
- **Match context:** lifecycle, score, phase, and clock; a context update does not by itself claim a price change.

### 3. Realtime is deliberately hybrid

The BFF broadcasts a compact fixture signal containing fixture ID, compute sequence, lifecycle, market count, and optional scoreboard values—not a full price payload (`backoffice-v2/internal/realtime/handler.go:43-80,93-133`). The React client coalesces fixture-scoped invalidation at roughly one second and broader lists at roughly four seconds; its predicate avoids refreshing unrelated fixtures and non-price structural queries (`backoffice-ui/src/lib/ws/useLiveOddsInvalidation.ts:22-68,83-169`). TanStack Query documents that invalidation marks matching queries stale, background-refetches active ones, and supports predicate matching ([TanStack Query invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)).

This is a stronger portfolio decision than the generic label “REST refresh + WS signal.” The reader should see the tradeoff:

> Small signal now; scoped authoritative read next. Typed status/score data may patch immediately, while structural and price-bearing data is reconciled through the fixture projection.

### 4. The operator path has meaningful intermediate states

The central command gate requires a reason, supports idempotency, parks high-impact changes for maker-checker approval, and audits the applied path (`backoffice-v2/internal/commandgate/gate.go:1-22,240-335`). Approval execution enforces a different maker/checker and rebuilds the persisted command before applying it (`backoffice-v2/internal/commandgate/gate.go:676-745`). Override code writes a merged scoped envelope into engine-watched NATS KV (`backoffice-v2/internal/overrides/overrides.go:15-38`). NATS KV itself is JetStream-backed and its watch API delivers existing state followed by live updates ([NATS Key/Value Store](https://docs.nats.io/learn/key-value/)); ordered consumers are also the mechanism behind KV watch ([NATS ordered consumers](https://docs.nats.io/learn/jetstream/ordered-consumer)).

The UI already distinguishes pending approval from direct apply. After a direct write, it shows `Applying…`, polls engine-visible selections, and clears the state after a visible price change or a 20-second safety budget (`backoffice-ui/src/resources/markets/market-activity/overrideHandlers.ts:106-183`; `MarketActivity.tsx:602-619,1025-1049`).

Therefore replace the absolute copy “HTTP success is not final” with the more accurate:

> Accepted, pending approval, and engine-applied are distinct states. The resolved projection confirms what the operator can trust.

## Gap matrix

| Current element | Evidence verdict | Decision |
|---|---|---|
| Odds update path | Strong, but “ordered” can overstate transport guarantees | **Keep and revise** to version-checked full/diff merge |
| Trading state path | Strong, but match aggregation is more conditional than the copy implies | **Fold** into the product-effect legend |
| Score / phase path | Strong field separation, weak as a standalone architecture | **Fold** into match-context annotation |
| Operator override path | Strong command/pending/apply loop; exact engine internals unavailable | **Keep as the return loop**, label pricing as an opaque boundary |
| Returning event is always the final UI confirmation | Directionally correct, but current UI also expires `Applying…` after 20 seconds | **Revise** to “engine-visible resolved projection” and disclose no timing guarantee |
| Four interactive tabs | Duplicates the same backbone and hides the end-to-end story | **Remove** |
| Six equal service cards | Makes infrastructure look more important than decisions and product effects | **Remove** |
| Tiny product-effect card | Safe, but visually subordinate | **Replace** with the existing large fictional product image plus three annotations |
| Infinite signal/glow animation | Decorative; no information after the first pass | **Remove** |
| Mobile horizontal tab and card rails | Requires two-dimensional exploration and keeps 9–11px copy | **Replace** with one vertical narrative |

## Recommended single-section structure

### Editorial hierarchy

- Eyebrow: `EVENT CONSISTENCY / OPERATOR CONTROL`
- Title: `One live market. Two trust loops.`
- One-sentence thesis: `Incoming changes are version-checked before one fixture refreshes. Operator commands remain pending until the resolved state is visible.`
- Large fictional product visual: reuse `public/projects/cypherlab/hero.webp`.
- Three product annotations: `Odds`, `Availability`, `Match context`.
- Two persistent semantic ordered lists: `Observe a computed update` and `Change, then verify`.
- Closing engineering judgment: `Trust is explicit at both boundaries: stale state is rejected on read; requested state is not presented as applied on write.`

### Information flow

```text
OBSERVE
Provider → Normalize → JetStream → Pricing boundary → Full/diff + ComputeSeq → Fixture projection
                                                                                     ↓
                                                                      OPERATIONS PRODUCT
                                                                                     │
CONTROL                                                                              │
Operator ← Pending / applied ← Resolved projection ← Recompute ← Watched override ← Gate
```

The pricing node must literally say `Internal algorithm not shown`. `NATS KV` should be secondary technical copy under `Watched override state`, not an equal product step.

### Traditional Chinese core copy

- Eyebrow: `事件一致性／操作控制`
- Title: `一個即時市場，兩個可信閉環。`
- Thesis: `外部變化先經版本檢查，再只刷新受影響的賽事；操作命令則維持待處理，直到解析後狀態回到介面。`
- Observe: `正規化 → 版本檢查 → 合併完整／差異事件 → 更新單一賽事`
- Control: `驗證 → 視需要核准 → 寫入受監控設定 → 重新計算 → 確認已套用`

## Presentation and accessibility constraints

- Keep the near-black editorial surface, white text, and one acid-yellow accent. Remove per-trace colors, glowing dots, pulsing cells, and repeated bordered cards.
- Body copy should be at least 16px; monospace is for short labels and field names, not explanations.
- Desktop: one bounded composition, with the product visual at roughly half the width and both loops visible without mode switching.
- Short desktop viewports and mobile: allow native vertical scrolling. Never compress the narrative or add a horizontal service rail.
- If any disclosure-style interaction remains, use native buttons with explicit expanded/controlled relationships. If it is presented as tabs, implement `tablist`, `tab`, `tabpanel`, selection state, and arrow-key behavior required by the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
- Animate once in reading order: title, observe lane, product effect, control return. Suppress non-essential motion under `prefers-reduced-motion`, consistent with [W3C technique C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html).
- Keep native dialog focus containment, Escape close, visible close control, and an explicit accessible name; the [WAI-ARIA modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) recommends placing initial focus where large semantic content remains understandable.

## Public boundary

Safe to show: generalized provider input, canonical normalization, NATS/JetStream, opaque pricing boundary, full/diff projection, `ComputeSeq`, scoped refresh, generalized command gate, watched override state, pending/applied UI states, and fictional market data.

Do not show: provider identities, exact subjects, market-template IDs, tenant/operator identities, thresholds, override precedence, pricing formulas, internal hosts, production topology, real market/wager/audit data, scale/latency/revenue claims, or sole-ownership claims.

## Limitations and disagreements

1. **Sequence-contract mismatch:** the shared event contract says consumers reject `ComputeSeq <= last`, while the current projection implementation rejects only `< last` (`tam-protos/.../types.go:41-49` versus `projection.go:87-88,124-125`). Public copy should say only “older versions are rejected.”
2. **Engine repository absent:** the BFF, UI, shared contracts, and comments support the override/recompute boundary, but the internal pricing algorithm and exact apply/reject rules are not independently inspectable.
3. **UI confirmation has a timeout:** `Applying…` clears on visible repricing or after 20 seconds, so the portfolio must not claim a hard end-to-end confirmation SLA or that every cleared badge proves application.
4. **No production evidence:** repository code cannot substantiate volume, latency, availability, commercial impact, or live deployment topology.
5. **Visual audit:** at 1440×900 the current composition fits but subordinates the product to six service cards; at 390×844 the tabs and trace become separate horizontal rails and explanatory text falls to 9–11px (`src/app/globals.css:128-180,320-337`).

## Implementation boundary for a later approved change

Use the shortest in-repo path: rewrite only the CypherLab case-study component and its existing CSS selectors, reuse `hero.webp`, Motion, the native dialog, existing locale state, and current routes. Add no diagram library, image, project type, or route. The home modal and `/work/cypherlab` must continue to share the same component.

## Claim-to-source ledger

| Claim | Primary evidence | Confidence |
|---|---|---|
| Full replaces; diff merges/removes under per-fixture sequence guard | `backoffice-v2/internal/marketprojections/projection.go:3-18,77-179` | High |
| Market state derives from selection state; match operational state is conditional | `sm_reader.go:319-360`; `operational_status.go:5-24` | High |
| Realtime price refresh is compact, fixture-scoped, and coalesced | `realtime/handler.go:43-80,93-133`; `useLiveOddsInvalidation.ts:22-68,83-169`; TanStack Query docs | High |
| Command gate supports reason, idempotency, maker-checker, and audit | `commandgate/gate.go:1-22,240-335,676-745` | High |
| Scoped override state is written to NATS KV and intended for engine watch | `overrides/overrides.go:15-38`; NATS KV docs | Medium-high; engine implementation absent |
| UI distinguishes pending approval from direct apply and waits for visible reprice | `overrideHandlers.ts:106-183`; `MarketActivity.tsx:602-619,1025-1049` | High, with timeout limitation |
| Current interaction and mobile layout are over-fragmented | `src/components/case-study.tsx:58-242`; `src/app/globals.css:128-180,320-337`; 1440×900 and 390×844 local render audit | High |
| Real screens are unsafe; fictional reconstruction is intentional | `docs/screenshot-inventory.md:5-13`; `docs/portfolio-source-notes.md:40-50` | High |
