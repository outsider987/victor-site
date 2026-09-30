# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + TypeScript + vanilla three.js + GSAP, static build deployed to GitHub Pages at `outsider987.github.io/victor-site` (existing URL and Actions deploy preserved). Content is authored as semantic HTML; WebGL is layered on top as progressive enhancement. User's choice (2026-09-27), replacing the previous Next.js 16 static export entirely.

## Users

Two audiences, weighted equally (confirmed by the user):

- **Hiring side:** recruiters and engineering managers evaluating Victor for remote or international senior full-stack, frontend, or backend roles. They skim many portfolios and need role, strengths, and proof within seconds, then a resume or a way to reach him.
- **Client side:** business owners (mostly Taiwan) looking for someone to build and run a website or system end to end, the way 3C換金所 and 天鳳宮 were built. They need to see shipped, live work and a direct way to start a conversation.

## Product Purpose

The personal portfolio of Victor Chang (Chang Yao Hsien). It lets a visitor quickly understand what he can do and what he has built, is memorable enough to be retold, and converts both audiences into contact: email, LinkedIn, resume download, or a visit to a live project.

## Positioning

A senior full-stack engineer (7+ years, since 2018) whose work spans real-time operations platforms (a live sportsbook back office on Go, NATS, WebSocket), regulated business workflows (insurance claims and clinic operations), edge-native client sites shipped on Cloudflare, and games and creative tech he builds himself. He works with AI agents through a documented, verifiable method rather than ad hoc prompting.

## Operating Context

- Visitors usually arrive from a resume link, LinkedIn, or the GitHub profile (`@outsider987`), on desktop or phone.
- Three resume variants exist (Frontend, Full-Stack, Backend); the site must not contradict their facts or dates.
- Public contact: `t790219520@gmail.com`, `linkedin.com/in/yao-hsien-chang`, `github.com/outsider987`. Location Taiwan (UTC+8).

## Capabilities and Constraints

- **Language:** English primary with a Traditional Chinese toggle.
- **Featured works (user-selected):** CypherLab, Mediconcen, 開票所 (vote), 3C換金所 (3ccash.com), 天鳳宮 / 勇氣媽祖 (courage-mazu.com), 沙暴之神 Sandstorm God, BetCorgi.
- **Not featured:** the comics site (scrapes copyrighted content). Matchbook and HoldBook were offered and not selected this round.
- **Story structure (user's explicit request):** each work is a story chapter; scrolling moves to the next story through an animated three.js transition.
- **AI collaboration section (user's explicit request):** how Victor runs projects with AI agents must be written into the site.
- **Confidentiality:** CypherLab and Mediconcen are shown only through sanitized or already-approved screenshots and videos. No tenant or operator identities, wager or exposure data, pricing or settlement logic, patient or claim data, internal hosts, or production topology.
- **Resilience:** all content must remain readable and navigable without WebGL (locked-down corporate machines, crawlers, reduced motion).
- **Undecided:** a personal domain does not exist yet; deploy stays on GitHub Pages.

## Brand Commitments

- Name as "Victor Chang"; formal form "Chang Yao Hsien (Victor)" as on the resumes. No Chinese-character name is on record; do not invent one.

## Evidence on Hand

- **Resumes:** `C:\Users\outsider\Documents\Victor_Chang_{FE_Resume_v11,FullStack_Resume,Backed}.pdf`. Roles: CypherLab (Feb–Aug 2026), Mediconcen (Feb 2022–Jan 2026), Paradromix (Jul 2021–Feb 2022), ULIC TEK (Jan 2018–Jul 2021); BSc Chemistry, Chia Nan University (2017).
- **Live sites:** `3ccash.com`, `admin.3ccash.com`, `courage-mazu.com`, `sandstorm-god.courage-mazu.workers.dev`, `casino-ail.pages.dev`.
- **Screens and video:** prior portfolio assets in `~/github/victor_resume/public/projects/` (CypherLab markets board and audit, Mediconcen OCR claims workbench and clinic portal) and `public/projects/*/*.mp4` in the old site (CypherLab market and odds demos, Mediconcen workflow demo); fresh captures of the live sites.
- **Election project:** `~/github/vote` contains the 3D results site, 2022 replay data, the poller and Cloudflare publishing scripts; `vote.courage-mazu.workers.dev/?source=replay` is the public replay. The 2026 count has not happened yet.
- **Project facts:** Sandstorm God README (RTP 96.89%, max 81,000×, Monte Carlo simulation, PixiJS + GSAP, synthesized audio); BetCorgi README (Nuxt + Go Socket.IO, 20 games, server-authoritative settlement, virtual points only); 3ccash AGENTS.md (Nuxt SSR in Durable Objects, D1, Pages admin, LINE webhook); temple AGENTS.md (Nuxt 4 on Workers, D1, R2, LINE Login, shop, fund, calendar, admin).
- **AI method evidence:** `~/cypherlab/sportsbook-skills` (one skill set installable into Claude, Codex, or any agent), `~/cypherlab/backoffice-e2e-agent-harness` (Claude Code + MCP Playwright against a live environment, human-gated tickets), `~/cypherlab/backoffice-specs` (spec → plan → tasks gates), workspace `CLAUDE.md` operating rules, `AGENTS.md` project maps in client repos.
- **Absent, never fabricate:** testimonials, client quotes, traffic or revenue figures, user counts, performance claims beyond what READMEs state.

## Product Principles

1. **Prove, don't claim.** Every capability points at something shipped: a live link, a real screen, a video, a repo.
2. **Two audiences, one story.** Engineering depth for hiring managers and shipped outcomes for clients, both reachable from the first screen.
3. **Respect confidentiality.** Professional work is shown the way its owners would allow, never with proprietary detail.
4. **Authored, not templated.** The site should feel made by Victor, using his own characters and games.
5. **Legible in seconds.** Skills and works read quickly even with WebGL off.
