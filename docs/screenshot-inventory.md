# Screenshot inventory

All final portfolio visuals are stored below `public/projects/<slug>/`. “Recreated UI” means a new, fictional 1440×900 product screen based on verified routes/components, not a copy of live data.

## CypherLab

- **Relevant frontend:** `/home/outsider/cypherlab/backoffice-ui` (React/Vite).
- **Can run locally:** Yes, dependencies and a build exist, but meaningful authenticated screens depend on backend/auth configuration. Running it would not guarantee a safe, representative state.
- **Useful routes:** trader dashboard, matches, markets, market activity, alerts, audit, reconciliation, settlement, and system health.
- **Existing assets:** architecture/flow diagrams in `backoffice-v2`; no safe product screenshots in the primary UI repository.
- **Candidate:** e-sports markets/live operations board — strong homepage visual; actual data/identifiers may be sensitive. Detail view uses a recreated public NATS architecture diagram.
- **Decision:** **recreated UI** with fictional e-sports event names, zero live money, generic operators, and no tenant/internal identifiers. Architecture labels generalize internal subjects and omit pricing rules.
- **Sensitivity:** High for real screenshots; low for the recreated asset.

## Mediconcen

- **Relevant frontend:** `mcc-clinic-portal-v2/frontend` (Next.js/React) for the selected portfolio story. The claims-review and admin portals remain separate reference surfaces.
- **Can run locally:** Dependencies exist, but authenticated/API-driven pages require environment and backend services. Do not run against configured remote services.
- **Useful routes:** `/verify`, `/pending-list`, `/records`, `/clinic-booking`, and `/operation-report`.
- **Existing assets:** logos and generic promotional/empty-state images. OCR repositories also contain raw document samples; those are excluded from review and reuse.
- **Candidate:** verified-visit work queue with eligibility, consultation, settlement, and record states; optional booking/calendar context.
- **Decision:** **recreated UI** using `DEMO-024` style visit references, generic service states, and no patient, clinic, payer, payment, or medical data.
- **Sensitivity:** Critical for any authenticated clinic screen; low for the recreated asset.

## CarHarbor

- **Relevant frontend:** `/home/outsider/github/carHarbor/carharbor/apps/web` (React/Vite).
- **Can run locally:** Yes. It can operate with a browser wallet and testnet; MetaMask-only mode works without a WalletConnect project id.
- **Useful routes:** marketplace, vehicle detail, seller/create, escrow detail, and demo guide.
- **Existing assets:** clean vehicle hero art plus extensive desktop/mobile demo captures.
- **Candidate:** live escrow summary and state timeline.
- **Decision:** **recreated UI** using the repository’s product structure but omitting browser chrome, URLs, wallet extensions, and all addresses. Existing raw captures are not copied.
- **Sensitivity:** Medium/high for raw captures due to addresses and browser history; low for the recreated asset.

## Chengguang

- **Relevant frontends:** `/home/outsider/bunGame/chengguang_member` and `/home/outsider/bunGame/chengguang_admin` (Vue/Vite).
- **Can run locally:** Built assets and dependencies exist, but useful screens rely on member/admin sessions and backend data.
- **Useful routes/views:** member tender search/list, keyword groups, healthcheck/profile; admin tenders, members, search logs, downloads, and health checks.
- **Existing assets:** brand logos only; no safe product screenshots.
- **Candidate:** member tender discovery with data-health rail; secondary semantic-search lab.
- **Decision:** **recreated UI** with fictional tender titles, no company/member data, no pricing, generic health states, and a visible “Experimental” label for vector search.
- **Sensitivity:** High for real member/search/operations data; low for the recreated asset.

## Capture specification

- Target master size: 1440×900 (16:10).
- Output: optimized WebP, loaded lazily outside the first view.
- Homepage use: Three.js texture planes and a DOM/CSS fallback using the same safe assets.
- Detail use: responsive product figure with explicit “recreated with fictional data” captions where appropriate.
