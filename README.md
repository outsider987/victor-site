# victor-site

[![Deploy Next.js site to Pages](https://github.com/outsider987/victor-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/outsider987/victor-site/actions/workflows/deploy.yml)

Personal software engineering portfolio and case study index for **Victor Chang** (Senior Full-Stack Engineer).

**[Live Portfolio → https://outsider987.github.io/victor-site/](https://outsider987.github.io/victor-site/)**

---

## Overview

Designed with a Swiss monochrome aesthetic, this site documents engineering decisions, system boundaries, and architectural trade-offs across real-time operations, distributed business workflows, and Web3 infrastructure.

### Featured Case Studies

1. **CypherLab (Sportsbook Operations):** Real-time e-sports back office projecting NATS snapshots and market diffs into live odds, state machines, and audited operator controls (React, TypeScript, Go, WebSocket, Redis).
2. **Mediconcen (Insurance Claims Adjudication):** Rule-driven medical insurance claims workflow system with deterministic state progression and automated adjudication.
3. **CarHarbor (Tender & Auction Discovery):** Aggregation pipeline and operational dashboard for tracking vehicle tenders and price movements.
4. **Chengguang (Member Entitlements & Lab Data):** Shared quota reconciliation and administrative analytics platform.

---

## Tech Stack

* **Framework:** Next.js 16 (App Router, Static Export)
* **UI & Styling:** React 19, Tailwind-inspired custom CSS variables, Swiss modernist layout
* **Motion & Graphics:** Motion (Framer Motion 13), Three.js
* **Type Safety:** TypeScript 5 (strict mode)
* **CI/CD:** GitHub Actions deploying static builds directly to GitHub Pages

---

## Getting Started

### Prerequisites

* Node.js ≥ 20
* npm ≥ 10

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

### Production Build & Type Check

```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Static export build (outputs to ./out)
npm run build
```

---

## Contact

* **Website:** [outsider987.github.io/victor-site](https://outsider987.github.io/victor-site/)
* **LinkedIn:** [linkedin.com/in/yao-hsien-chang](https://linkedin.com/in/yao-hsien-chang)
* **GitHub:** [@outsider987](https://github.com/outsider987)
* **Email:** [t790219520@gmail.com](mailto:t790219520@gmail.com)
