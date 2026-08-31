# Portfolio source notes

Internal implementation reference. These notes were produced from the source repositories directly; they are not public-page copy. No environment values, credentials, internal hostnames, production URLs, personal records, or live financial data were copied.

## PROJECT — CypherLab

**PRODUCT**  
A multi-service e-sports and sports-market operations platform. The inspected UI and API contracts explicitly support an `esports` sport code alongside a trader dashboard, matches and markets, market activity, settlement, alerts, audit logs, reconciliation, permissions, reports, and system-health views.

**MAIN USERS**  
Operators, traders, supervisors, duty managers, administrators, and support/operations staff. These role names are evidenced by routes, permissions, tests, and UI copy.

**FRONTEND**  
`backoffice-ui`: React 18, TypeScript, Vite, React Router, TanStack Query, Radix UI, Recharts, i18next, Vitest, and a shared WebSocket client. Live odds signals trigger fixture-scoped query invalidation with coalescing.

**BACKEND**  
Go services including `backoffice-service`, `backoffice-v2`, and `sports-manager`. Evidence includes HTTP/BFF handlers, gRPC, NATS consumers/publishers, Redis caches/locks, PostgreSQL via pgx, ClickHouse readers, audit paths, settlement workers, and background reconciliation jobs.

**DATA**  
PostgreSQL for operational records; ClickHouse for event/reporting projections; Redis for caching, coordination, and aggregates; NATS/JetStream for event transport. Exact schemas and business calculations must not be published.

**INFRASTRUCTURE**  
Dockerfiles, Kubernetes deployments, Helm charts, HPA templates, Argo CD applications, Prometheus-oriented dashboards/metrics, and OpenTelemetry dependencies are present.

**IMPORTANT WORKFLOWS**

- Operator landing/dashboard and live match monitoring.
- Match and market drill-down with live refresh. The current `backoffice-v2` path consumes normalized raw events plus computed full snapshots and diffs from NATS/JetStream. Full events replace a fixture projection; diffs merge changed markets/selections and explicit removals. `ComputeSeq` is the per-match stale-event guard.
- The wire contract separates lifecycle from trading state. `Fixture.Status` and `Livescore.Scoreboard` drive match phase, clock, score, and incidents. `Bet.Status` drives each selection's open/suspended/settled state; market and match operational states are derived from the selection set. There is no independent `Market.Status` field.
- Odds and state are separate concerns. Raw provider `Bet.Price` values are comparison inputs; computed `Market.Bets[].Price`, line, probability, and start price are the priced projection. Status-only changes do not imply a price change. The exact pricing algorithm is not locally inspectable and must not be described.
- The current UI receives a compact fixture-scoped WebSocket change signal for a newer computed sequence, then coalesces a REST projection refresh for structural/price changes. Score and status flips also have typed WebSocket deltas for immediate cache patches. The React client rejects stale sequence signals and isolates updates by match.
- Operator controls form a return loop rather than a one-way request: an authenticated command passes assignment/permission, reason, idempotency, audit, and—when required—maker-checker gates; the approved override is written to NATS JetStream KV; the engine watches it and recomputes; the next computed event becomes the authoritative UI state. A zero multiplier is used for suspension, while positive multipliers affect price/resume behavior. Public copy should describe the semantics without publishing internal precedence or pricing rules.
- Alerts, notification takeover, and system-health inspection.
- Settlement and reconciliation workbenches.
- Role-based administration, re-authentication for higher-risk actions, and before/after audit records.

**TECH STACK**  
React, TypeScript, Vite, TanStack Query, Go, WebSocket, NATS, Redis, PostgreSQL, ClickHouse, gRPC, Docker, Kubernetes, Helm, Argo CD.

**SCREENSHOT CANDIDATES**  
Markets/trading board; trader dashboard; alerts; audit detail; system health. Actual screens may contain operational identifiers, people, match data, or proprietary controls, so the portfolio uses a recreated operations screen with fictional data.

**SAFE PUBLIC STORY**  
A sportsbook operations platform focused on e-sports. Provider events are normalized into a canonical match/market/selection contract, computed into versioned full/diff updates, and projected into match context, trading state, and odds. Operator controls return through an audited command loop, and the interface confirms the engine's resolved state rather than treating the HTTP response as final. Public diagrams generalize subject names and omit pricing rules.

**PRIVATE / DO NOT PUBLISH**  
Tenant or merchant names, operator identities, internal domains, live events, live wagers, financial exposure, proprietary pricing/settlement logic, production topology, credentials, tokens, alert payloads, and raw audit records.

**UNVERIFIED ITEMS**  
The odds-engine implementation repository is not present locally. Its input/output and override behavior are evidenced by shared typed contracts, consumers, tests, and current BFF/UI code, but its internal pricing algorithm is unverified and must not be visualized or claimed. Production scale, revenue impact, latency claims, exact personal ownership, and deployment geography are intentionally omitted.

### CypherLab architecture evidence for the detail modal

Use one bounded section with two connected lanes, not a service inventory.

**READ / COMPUTE LANE**

1. Provider feeds enter `odds-adapter`.
2. The adapter normalizes provider formats, resolves canonical match/entity IDs through sports-manager, validates prices, stamps an adapter sequence, and publishes one typed raw `standard.Event` to JetStream.
3. The locally unavailable odds engine consumes the raw event and emits computed full snapshots plus diffs. This boundary must be labelled “pricing engine — internal algorithm not shown”.
4. `backoffice-v2` applies full/diff events to an in-memory per-fixture projection under `ComputeSeq`; recent JetStream replay and engine snapshot hydration rebuild state after restart.
5. REST serves the merged projection. WebSocket sends compact change signals and immediate status/score deltas; TanStack Query refreshes only the affected fixture.

**CONTROL / CONFIRMATION LANE**

1. The operator edits a selection price or changes availability in React.
2. The BFF checks assignment, permission, reason, idempotency, audit requirements, and maker-checker approval when required.
3. The approved command is written to the engine-watched NATS KV as a scoped override.
4. The engine applies or rejects the command and recomputes the match.
5. The returning computed full/diff event—not the initial HTTP success—updates the projection and confirms the actual state in the UI.

**FIELD-TO-EFFECT LEGEND**

- Match context: fixture lifecycle, participants, league, start time, scoreboard, periods, incidents.
- Trading state: per-selection status; market and match availability are derived aggregates.
- Odds: computed selection price, line, probability, and start price; raw provider prices remain comparison inputs.
- Structure: changed/removed market and selection IDs in diffs.
- Ordering: adapter `Seq` belongs to raw ingestion; engine `ComputeSeq` belongs to computed ordering and stale-event rejection.

**DO NOT SHOW**

Exact subjects, provider identities, market-template IDs, suspension thresholds, override precedence edge cases, pricing formulas, infrastructure hostnames, production topology, or real operational/audit values.

## PROJECT — Mediconcen

**PRODUCT**  
A healthcare-operations repository family spanning clinic workflows, administration, insurance/benefit processing, document handling, and OCR services.

**MAIN USERS**  
Clinic staff, doctors, operational administrators, claims/review staff, and platform administrators, inferred conservatively from routes and modules.

**FRONTEND**  
Separate admin, clinic, and claims-review portals built with Next.js and React. The clinic portal uses MUI, SWR, guided forms, calendar/date tooling, signatures, Socket.IO, and localized UI. Verified routes include `/verify`, `/pending-list`, `/records`, `/clinic-booking`, and `/operation-report`.

**BACKEND**  
NestJS services using TypeORM, MySQL, Redis/cache-manager, JWT/passport, validation, scheduled jobs, Socket.IO/WebSockets, document/PDF tooling, and AWS SDK clients. Dedicated OCR repositories expose document, page, OCR, claim, and report modules.

**DATA**  
MySQL/TypeORM entities and migrations for operational data; Redis caching; object storage for files. Raw repository fixtures and dumps were not inspected or reused because they may contain sensitive claim or reference data.

**INFRASTRUCTURE**  
Dockerfiles, Docker Compose, Helm charts, and CI-related configuration exist across the family.

**IMPORTANT WORKFLOWS**

- Clinic registration, profiles, doctors, insurers, opening hours, and bookings.
- Policy/eligibility verification and treatment coverage.
- Pending consultations with diagnosis, medicine, payment, and signature steps.
- Clinic records and operation reports.
- Admin analytics, clinic management, reference data, notifications, and refunds.
- Document upload, OCR extraction, structured claim review, and reporting services.

**TECH STACK**  
Next.js, React, TypeScript/JavaScript, NestJS, TypeORM, MySQL, Redis, AWS SDK, Socket.IO, Docker, Helm.

**SCREENSHOT CANDIDATES**  
Clinic verification; pending consultation; payment confirmation; clinic records; admin analytics; OCR/document review. All real data-bearing screens are unsafe, so the selected portfolio visual is a fictional clinic work queue reconstructed from the clinic portal flow.

**SAFE PUBLIC STORY**  
A clinic operations workflow that selects a payer, service, and practitioner; verifies eligibility; creates a Pending List work item; captures diagnosis and medicine; completes settlement; and moves the visit into records and reports. Booking is an optional adjacent workflow. OCR remains a separate capability in the repository family and is not presented as part of this exact clinic flow.

**PRIVATE / DO NOT PUBLISH**  
Patient or doctor data, clinic/insurer identities, claims, receipts, documents, medical codes, payment information, policy rules, database dumps, storage locations, production URLs, authentication configuration, credentials, and integration details.

**UNVERIFIED ITEMS**  
User counts, payer counts, performance improvements, automation percentages, exact personal ownership, and shared deployment/data boundaries across the repository family are omitted because the repositories alone do not prove them.

## PROJECT — CarHarbor

**PRODUCT**  
An educational Polygon Amoy prototype demonstrating a tokenized vehicle purchase through an escrow contract. Its README explicitly says it is not audited, production-ready, or legal vehicle ownership.

**MAIN USERS**  
Demo buyer, seller, and delivery verifier roles.

**FRONTEND**  
React 18, TypeScript, Vite, React Router, RainbowKit, Wagmi, Viem, TanStack Query, Radix UI, Tailwind CSS, and Motion.

**BACKEND**  
No backend or indexer. The frontend reads and writes directly through EVM clients.

**DATA**  
Typed ABI and deployment metadata, contract reads, receipts, events, and demo vehicle metadata. Refresh recovery uses chain reads and historical logs rather than React memory.

**INFRASTRUCTURE**  
pnpm workspace, Vite build, Hardhat 3 contracts/tests, and testnet deployment scripts.

**IMPORTANT WORKFLOWS**

- Marketplace and vehicle detail.
- Wallet connection and required-chain handling.
- Seller NFT approval and escrow creation.
- Buyer token approval and escrow funding.
- Verifier delivery confirmation and buyer receipt confirmation.
- Receipt, event, and read-back synchronization; error recovery for rejection, network, balance, gas, and revert states.

**TECH STACK**  
React, TypeScript, Vite, Wagmi, Viem, RainbowKit, TanStack Query, Solidity, Hardhat, OpenZeppelin, Polygon Amoy.

**SCREENSHOT CANDIDATES**  
Marketplace/vehicle; live escrow timeline; transaction-state dialog; settlement evidence. Existing browser captures include a production-style URL, wallet addresses, bookmarks, and wallet chrome, so they are not copied. The portfolio uses a clean recreated escrow screen with no addresses.

**SAFE PUBLIC STORY**  
A working testnet prototype that makes the difference between a signature request, transaction hash, confirmed receipt, contract event, and synchronized business state visible to the user.

**PRIVATE / DO NOT PUBLISH**  
Wallet secrets, private keys, environment values, RPC credentials, WalletConnect keys, full wallet addresses, deployment addresses, and browser chrome/history.

**UNVERIFIED ITEMS**  
No production, audit, legal-ownership, dispute-resolution, or economic-value claims.

## PROJECT — Chengguang

**PRODUCT**  
A tender-discovery and operations platform with separate member/admin web apps, a Go API, PostgreSQL, tender import/download tooling, data-health views, notifications, and a Python crawler.

**MAIN USERS**  
Members searching and organizing tenders; admins managing members, tenders, keyword groups, downloads, clicks/search logs, and system health.

**FRONTEND**  
Vue 3, TypeScript, Vite, Vue Router, Element Plus, Tailwind CSS. Admin also uses Pinia and ECharts. Member routes include personal tender lists, broad search, keyword groups, profile/application, and tender healthcheck.

**BACKEND**  
Go HTTP application with PostgreSQL/pgx, member/admin modules, imports, tender downloads, data health, notifications, and operation logs. Python/Playwright tooling handles tender-site automation and CAPTCHA-related workflows.

**DATA**  
PostgreSQL migrations cover tenders, agencies, members/roles/plans, keyword groups, operation/search logs, health checks, companies, click/download activity, and pgvector-backed experimental embeddings. Cloudflare R2-compatible object storage is used for snapshots and tender files.

**INFRASTRUCTURE**  
Dockerfile, database migrations, replayable R2 import paths, scheduled/background operations, and healthcheck code.

**IMPORTANT WORKFLOWS**

- Member tender discovery with text, agency, type, region, amount, and status filters.
- Saved keyword groups and member profile/capability inputs.
- Tender cards, detail/download actions, and notifications.
- Admin management, search/click logs, crawler/import health, and full-system checks.
- Experimental BGE-M3 dense search and reranking in an admin semantic lab using PostgreSQL + pgvector.

**TECH STACK**  
Vue 3, TypeScript, Vite, Go, PostgreSQL, pgvector (experimental search), Python, Playwright, Cloudflare R2-compatible storage, Docker.

**SCREENSHOT CANDIDATES**  
Member tender list/search; admin tender list; data health; keyword groups; semantic lab. Real tender/member screens can reveal customers, searches, prices, and operational state, so the portfolio uses a fictional reconstructed discovery screen.

**SAFE PUBLIC STORY**  
A searchable tender workspace connecting member filters and saved interests with a Go/PostgreSQL ingestion and operations layer. Semantic/vector retrieval is shown only as an experiment, not a production claim.

**PRIVATE / DO NOT PUBLISH**  
Member/company information, subscription/financial data, real search logs, internal operational counts, tender-download credentials, CAPTCHA workflows, LINE configuration, R2 locations, API credentials, production URLs, and proprietary ranking rules.

**UNVERIFIED ITEMS**  
Semantic search production status, commercial scale, recommendation quality, and exact personal ownership are not claimed.
