# Mediconcen detail-section research

Date: 2026-08-30  
Status: approval wireframe; implementation intentionally paused

## Research question

How can the Mediconcen case-study modal explain both the product workflow and the supporting architecture in one section, at a glance, without looking like a generic AI-generated technology diagram?

## Conclusion

Replace the current four-lane by six-stage matrix with one editorial story: **one verified clinic visit**. Show three visible product states first, then a compact system backbone underneath. The reader should understand the product before seeing framework names.

The section's single takeaway is:

> A successful eligibility check creates a clinic work item. Completing settlement turns it into an operational record.

This is deliberately scoped to `mcc-clinic-portal-v2`. The wider Mediconcen repository family contains separate admin, claims, and OCR applications, but their end-to-end production relationship was not verified strongly enough to publish as one architecture.

## Repository evidence

Read-only sources inspected:

- Frontend pages: `/home/outsider/mediconcen/mcc-clinic-portal-v2/frontend/src/pages/verify`, `pending-list`, `records`, `clinic-booking`, and `operation-report`.
- The `verify` page contains insurer, service, practitioner, phone/code, card/QR, coverage, and error handling UI.
- The `pending-list` page contains diagnosis, medicine, consultation summary, signature, settlement, and payment UI.
- The `records` and `operation-report` pages expose completed operational records and reporting.
- Backend orchestration: `/home/outsider/mediconcen/mcc-clinic-portal-v2/backend/src/verify/verify.service.ts` creates a pending-list item after verification.
- Settlement: `/home/outsider/mediconcen/mcc-clinic-portal-v2/backend/src/pay/pay.service.ts` reads the work item, creates/updates a record, and removes the completed pending item.
- Verified stack from package manifests: Next.js 12, React 18, TypeScript; NestJS 10, TypeORM, MySQL, and Redis.

Safe public abstraction:

`Clinic staff -> Next.js portal -> NestJS API -> MySQL`, with an external eligibility service involved during verification and a payment service involved during completion. Redis is a supporting cache and can remain a small annotation instead of becoming another primary box.

Private details excluded:

- identities, visit and claim data
- clinic, insurer, and partner names
- request/response payloads
- URLs, credentials, tokens, and environment configuration
- benefit, payment, validation, and eligibility business rules

## Why the current composition fails

The current implementation in `src/components/case-study.tsx` gives six stages and four technical lanes nearly equal visual weight. The related CSS uses 9–14px labels, repeated borders, all-caps mono text, a dark grid, and an infinitely glowing signal. The result requires cell-by-cell reading before the core message becomes clear.

Calling that appearance “AI-like” is a design inference, not a measurable classifier result. The cues are specific: repeated equal cards, decorative glow, excessive technical microcopy, and no dominant product artifact. Removing those cues also fixes the comprehension problem.

## Evidence synthesis

- The official C4 guidance says a system-context view should start with the big picture—people, the system, and directly connected external systems—rather than low-level details. It is intended for technical and non-technical audiences: <https://c4model.com/diagrams/system-context>
- C4 dynamic diagrams are useful for one user story or feature, using numbered interactions, but should be used sparingly: <https://c4model.com/diagrams/dynamic>
- C4's review checklist requires named elements, understandable meaning, and intent labels on arrows: <https://c4model.com/diagrams/checklist>
- Nielsen Norman Group finds that clear hierarchy guides attention through contrast, scale, and grouping; equal size/color and too much all-caps make a page difficult to parse: <https://www.nngroup.com/articles/visual-hierarchy-ux-definition/>
- Descriptive headings let readers scan efficiently instead of reading every word: <https://www.nngroup.com/articles/layer-cake-pattern-scanning/>
- Jesper Landberg's portfolio keeps fixed interface copy minimal and makes project visuals the repeated central content unit. The useful principle is content-led motion and restrained chrome, not copying its exact WebGL treatment: <https://jesperlandberg.com/>

## Proposed information hierarchy

1. **Mediconcen** — project identity.
2. **One-sentence outcome** — what changes through the system.
3. **Three product states** — Verify, Care workspace, Complete record.
4. **System behind the flow** — four-node backbone plus two external dependencies.
5. **Technology and public boundary** — quiet caption only.

The optional booking route is omitted from the core story because it is adjacent to, rather than required by, the verified visit flow. OCR is omitted because the inspected OCR repositories are separate and their integration into this clinic flow is unverified.

## Visual direction

- Warm paper sheet on the site's black backdrop; black ink plus one Mediconcen green.
- Asymmetric editorial composition: the care workspace is the largest product state.
- Square/hairline image frames; no glass, gradient, glow, pills, or repeated rounded cards.
- Product labels are sentence case. Monospace is reserved for numbers and the final stack caption.
- Primary explanatory copy is at least 16px; stage labels are 22–24px; only metadata may be 12–13px.
- One entrance sequence: title, product states, then connector lines. No infinite moving indicator.
- Reduced-motion mode displays the final static composition immediately.

## Approval wireframe

See [`../../wireframes/mediconcen-detail.svg`](../../wireframes/mediconcen-detail.svg).

## Mobile adaptation

The same single section becomes a vertical three-step story. Each step keeps its product crop next to its action label. The system backbone follows as a short vertical chain. No horizontal mini-cards and no hover-only information.

## Implementation boundary after approval

Reuse the existing modal, language state, Motion dependency, and recreated safe UI assets. Replace only `MediconcenJourney` and its associated `.care-*` styles. Do not add a diagram library or a new runtime dependency.

