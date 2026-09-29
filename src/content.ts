// Bilingual site content. Every claim traces to a résumé, README or project doc.
export type Lang = 'en' | 'zh';
export type L = Record<Lang, string>;

export const site = {
  title: { en: 'Victor Chang · Senior Full-Stack Engineer', zh: 'Victor Chang · 資深全端工程師' } as L,
  description: {
    en: 'Victor Chang builds real-time platforms, client sites and games end to end. Walk through seven works on a stop-motion clay set.',
    zh: 'Victor Chang 從即時系統、客戶網站到遊戲都一手打造。走進定格黏土布景，看七個作品。',
  } as L,
  ogAlt: 'A clay figure of Victor Chang stands in a clay village beside a paper tag with his name and role.',
  skip: { en: 'Skip to content', zh: '跳到內容' } as L,
  loading: { en: 'Loading the clay world…', zh: '黏土世界載入中…' } as L,
  scroll: { en: 'Scroll to walk', zh: '往下滾，一起走' } as L,
  nav: {
    work: { en: 'Work', zh: '作品' } as L,
    ai: { en: 'AI method', zh: 'AI 協作' } as L,
    experience: { en: 'Experience', zh: '經歷' } as L,
    contact: { en: 'Contact', zh: '聯絡' } as L,
    stations: { en: 'Stations', zh: '站點' } as L,
  },
  footer: {
    en: 'Built with three.js. Clay models sculpted procedurally in Blender. © 2026 Victor Chang.',
    zh: '以 three.js 打造，黏土模型以 Blender 程序化雕塑。© 2026 Victor Chang。',
  } as L,
};

export const person = {
  name: 'Victor Chang',
  email: 't790219520@gmail.com',
  linkedin: 'https://linkedin.com/in/yao-hsien-chang',
  github: 'https://github.com/outsider987',
};

export const hero = {
  role: { en: 'Senior full-stack engineer', zh: '資深全端工程師' } as L,
  promise: {
    en: 'I build real-time platforms, client sites and games, end to end.',
    zh: '即時系統、客戶網站、遊戲，從設計到上線我一手完成。',
  } as L,
  sub: {
    en: '7+ years across React, TypeScript, Go and the cloud. Open to remote roles, and to building your next product.',
    zh: '7 年以上 React、TypeScript、Go 與雲端經驗。開放遠端職缺，也接網站與系統開發。',
  } as L,
  note: { en: 'And I work out, too 😳', zh: '而且我有在健身 😳' } as L,
  ctaWork: { en: 'See the works', zh: '看作品' } as L,
  ctaContact: { en: 'Get in touch', zh: '聯絡我' } as L,
  ctaResume: { en: 'Résumé (PDF)', zh: '履歷 PDF' } as L,
};

export const skills = {
  title: { en: 'What I build with', zh: '我的工具箱' } as L,
  lede: {
    en: 'Six kinds of work I do end to end, from the first sketch to production.',
    zh: '六種我能從草圖做到上線的工作。',
  } as L,
  lanes: [
    { id: 'realtime', title: { en: 'Real-time systems', zh: '即時系統' } as L, line: { en: 'Event pipelines that stay consistent under load.', zh: '高負載下依然一致的事件管線。' } as L, tags: ['Go', 'NATS JetStream', 'WebSocket', 'gRPC', 'Socket.IO'] },
    { id: 'frontend', title: { en: 'Product frontends', zh: '產品前端' } as L, line: { en: 'Data-dense interfaces operators trust.', zh: '資料密集、讓營運人員信任的介面。' } as L, tags: ['React', 'TypeScript', 'Vue · Nuxt', 'Next.js', 'SSR · SEO'] },
    { id: 'backend', title: { en: 'Backend and data', zh: '後端與資料' } as L, line: { en: 'Workflows with money and rules inside them.', zh: '牽涉金流與規則的業務流程。' } as L, tags: ['NestJS', 'PostgreSQL', 'Redis', 'ClickHouse', 'SQLite · D1'] },
    { id: 'cloud', title: { en: 'Cloud and delivery', zh: '雲端與交付' } as L, line: { en: 'Shipped, deployed and kept running.', zh: '做完、上線，而且穩定運作。' } as L, tags: ['AWS', 'Kubernetes', 'Docker', 'Cloudflare Workers', 'CI/CD'] },
    { id: 'games', title: { en: 'Games and graphics', zh: '遊戲與圖學' } as L, line: { en: 'Engines, math and pixels.', zh: '引擎、數學與像素。' } as L, tags: ['PixiJS', 'three.js', 'GSAP', 'Unity · Blender', 'C++ · OpenCV'] },
    { id: 'ai', title: { en: 'AI-assisted delivery', zh: 'AI 協作交付' } as L, line: { en: 'Agents with rules, skills, gates and proof.', zh: '有規範、技能、關卡與驗證的 AI 代理。' } as L, tags: ['Claude Code', 'Codex', 'Playwright MCP', 'Spec-driven'] },
  ],
};

export type Shot = { src: string; alt: L };
export type Work = {
  id: string;
  name: string;
  nameZh?: string;
  sub: L;
  meta: L;
  story: L;
  beats: L[];
  stack: string[];
  shots: Shot[];
  phone?: Shot;
  video?: { src: string; poster: string; alt: L };
  link?: { href: string; label: L };
  note?: L;
};

export const works: Work[] = [
  {
    id: 'cypherlab',
    name: 'CypherLab',
    sub: { en: 'A real-time back office that keeps pace with the match', zh: '掌握賽事變化的即時營運後台' },
    meta: { en: 'Real-time sportsbook back office · 2026', zh: '即時體育博彩營運後台 · 2026' },
    story: {
      en: "Sports and e-sports markets move every second. I helped rebuild the operators' back office from scratch: a modular Go BFF behind a React console, fed by a real-time pipeline that never shows a stale price.",
      zh: '體育與電競盤口每秒都在變。我參與從零重建營運後台：React 主控台背後是模組化的 Go BFF，由一條絕不顯示過期價格的即時管線供應資料。',
    },
    beats: [
      { en: 'NATS JetStream → in-memory projections → WebSocket, with per-match sequence guards that drop stale updates.', zh: 'NATS JetStream → 記憶體投影 → WebSocket，每場比賽以序號把關，過期更新直接丟棄。' },
      { en: 'A shared Command Gate: closing a market or overriding odds requires a reason, idempotency, maker-checker approval and an audit trail.', zh: '共用 Command Gate：關盤、改賠率都必須附理由、具冪等性、經雙人覆核並留下稽核紀錄。' },
      { en: 'API serving, ClickHouse ingestion and settlement run as separate Go binaries on Kubernetes from one distroless image.', zh: 'API、ClickHouse 寫入與結算拆成獨立 Go 執行檔，共用同一個 distroless 映像跑在 Kubernetes。' },
    ],
    stack: ['Go', 'gRPC', 'NATS JetStream', 'WebSocket', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'ClickHouse', 'Kubernetes'],
    shots: [
      { src: 'works/cypherlab/markets.webp', alt: { en: 'CypherLab match markets board with per-market status and actions', zh: 'CypherLab 賽事盤口面板，含各盤口狀態與操作' } },
      { src: 'works/cypherlab/audit.webp', alt: { en: 'Audit log with an action reason and before/after change, operator names blurred', zh: '稽核紀錄與操作理由、變更前後對照，操作者已模糊處理' } },
    ],
    note: { en: 'Screens from a development environment. Operator identities, wager data and pricing rules are withheld.', zh: '畫面來自開發環境；操作員身分、投注資料與定價規則均未公開。' },
  },
  {
    id: 'mediconcen',
    name: 'Mediconcen',
    sub: { en: 'Claims that flow from clinic to insurer', zh: '從診所櫃台一路順到保險公司的理賠' },
    meta: { en: 'InsurTech · Hong Kong · 2022–2026', zh: '保險科技 · 香港 · 2022–2026' },
    story: {
      en: 'Four years owning clinic-to-insurer workflows end to end: eligibility checks, co-payment calculation, claim submission and insurer APIs, plus onboarding every new clinic and insurer partner.',
      zh: '四年間負責診所到保險公司的完整流程：資格驗證、自付額計算、理賠送件與保險公司 API 串接，並主導每一家新診所與保險夥伴的導入。',
    },
    beats: [
      { en: 'Modernised a legacy React codebase (classes → hooks) and made data-heavy lists fast with infinite scroll and virtualisation.', zh: '把舊 React 程式從 class 改寫為 Hooks，並以無限捲動與虛擬列表讓大量資料的畫面變快。' },
      { en: 'The old PHP system handled frontend and backend work together. We split them and chose NestJS so both sides used TypeScript, adding ORM access, DTO validation and Redis caching.', zh: '原有 PHP 系統同時處理前後端；拆分後選 NestJS，讓兩端都使用 TypeScript，再導入 ORM、DTO 驗證與 Redis 快取。' },
      { en: 'Each service maintained its own deployment script, making environment settings and releases inconsistent. Moving from ECS to Kubernetes unified deployment, at the cost of cluster maintenance.', zh: '各服務原本各自維護部署腳本，讓環境設定與發布步驟難以一致；遷至 Kubernetes 統一部署配置與流程，代價是叢集維運成本提高。' },
    ],
    stack: ['TypeScript', 'React', 'Next.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis', 'AWS', 'Kubernetes'],
    shots: [
      { src: 'works/mediconcen/portal.webp', alt: { en: 'Clinic Portal home: member verification, consultation records and booking tools', zh: 'Clinic Portal 首頁：會員驗證、就診紀錄與預約等操作入口' } },
      { src: 'works/mediconcen/records.webp', alt: { en: 'Clinic Portal consultation records with demo entries', zh: 'Clinic Portal 就診紀錄，使用示範資料' } },
    ],
    note: { en: 'Clinic Portal shown with demo data; no real patient records are displayed.', zh: 'Clinic Portal 畫面使用示範資料，不含真實病患紀錄。' },
  },
  {
    id: '3ccash',
    name: '3C換金所',
    sub: { en: 'Send a photo on LINE, get a quote in a minute', zh: 'LINE 傳照片，一分鐘拿到估價' },
    meta: { en: 'Client site · Taipei · live', zh: '客戶網站 · 台北 · 已上線' },
    story: {
      en: "A second-hand Mac, camera and 3C buyback store. I built the whole stack on Cloudflare's edge: an SEO-first storefront, an admin console, and a LINE bot that walks customers through a quote.",
      zh: '二手 Mac、相機與 3C 收購門市。我在 Cloudflare 邊緣網路上打造整套系統：重視 SEO 的官網、管理後台，以及一步步引導顧客估價的 LINE 機器人。',
    },
    beats: [
      { en: 'Nuxt SSR runs inside a Durable Object behind a 60-second edge HTML cache; static assets never touch Worker CPU.', zh: 'Nuxt SSR 在 Durable Object 內執行，前面有 60 秒邊緣 HTML 快取；靜態資源完全不耗 Worker CPU。' },
      { en: "A LINE valuation state machine: HMAC-verified webhook → quick-reply steps → a summary card pushed to the owner's phone.", zh: 'LINE 估價狀態機：HMAC 驗證 webhook → 快速回覆逐步收集 → 彙整卡片直接推播到店長手機。' },
      { en: 'Migrated from Go + Railway + Postgres to serverless Cloudflare: Workers, D1, Durable Objects and Pages.', zh: '從 Go + Railway + Postgres 全面遷移到 Cloudflare 無伺服器架構：Workers、D1、Durable Objects 與 Pages。' },
    ],
    stack: ['Nuxt 3', 'Vue', 'Cloudflare Workers', 'Durable Objects', 'D1', 'Pages', 'LINE Messaging API'],
    shots: [
      { src: 'works/3ccash/home.webp', alt: { en: '3C換金所 homepage: in-store cash payment and one-minute LINE quotes', zh: '3C換金所首頁：實體門市現場付現、LINE 一分鐘估價' } },
      { src: 'works/3ccash/quote.webp', alt: { en: 'Online quote form that sorts device details before sending them to LINE', zh: '線上估價表單，整理機況後帶到 LINE' } },
    ],
    phone: { src: 'works/3ccash/mobile.webp', alt: { en: '3C換金所 on a phone', zh: '手機版 3C換金所' } },
    link: { href: 'https://3ccash.com', label: { en: 'Visit 3ccash.com', zh: '前往 3ccash.com' } },
  },
  {
    id: 'temple',
    name: '天鳳宮 · 勇氣媽祖',
    sub: { en: "A temple's shop, fund and calendar, on LINE", zh: '宮廟的商城、基金與行事曆，全接上 LINE' },
    meta: { en: 'Client site · live', zh: '客戶網站 · 已上線' },
    story: {
      en: 'A temple community needed more than a brochure: an online shop, a building fund with a public donor list, an events calendar with sign-ups and a member centre, all tied to LINE Login.',
      zh: '宮廟需要的不只是形象網站：線上商城、公開芳名的建廟基金、可報名的活動行事曆與會員中心，全部串接 LINE 登入。',
    },
    beats: [
      { en: 'Nuxt 4 on Cloudflare Workers with D1 and R2; the same code runs on Node and SQLite for local demos.', zh: 'Nuxt 4 跑在 Cloudflare Workers，搭配 D1 與 R2；同一份程式也能在 Node 與 SQLite 上做本機展示。' },
      { en: '7-ELEVEN pickup checkout: the server verifies the store itself and never trusts store details sent by the browser.', zh: '7-ELEVEN 取貨結帳：由伺服器自行查核門市，不採信瀏覽器傳來的門市資料。' },
      { en: 'Role-based admin for members, orders and payment reconciliation, products and stock, events and coupons.', zh: '依角色授權的後台：會員、訂單與核款、商品與庫存、活動與優惠券。' },
    ],
    stack: ['Nuxt 4', 'Vue 3', 'Element Plus', 'Cloudflare Workers', 'D1', 'R2', 'LINE Login'],
    shots: [
      { src: 'works/temple/shop.webp', alt: { en: 'Temple shop with product categories and cart', zh: '宮廟商城，含商品分類與購物車' } },
      { src: 'works/temple/fund.webp', alt: { en: 'Temple building fund page with progress and pledge button', zh: '建廟基金頁，含募款進度與護持按鈕' } },
      { src: 'works/temple/calendar.webp', alt: { en: 'Events calendar with sign-ups', zh: '可報名的活動行事曆' } },
    ],
    phone: { src: 'works/temple/mobile.webp', alt: { en: 'Temple shop on a phone', zh: '手機版宮廟商城' } },
    link: { href: 'https://courage-mazu.com', label: { en: 'Visit courage-mazu.com', zh: '前往 courage-mazu.com' } },
  },
  {
    id: 'sandstorm',
    name: 'Sandstorm God',
    nameZh: '沙暴之神',
    sub: { en: "Slot math that's proven, not promised", zh: '數學經得起驗證的老虎機' },
    meta: { en: 'HTML5 slot game · playable', zh: 'HTML5 老虎機 · 可試玩' },
    story: {
      en: 'A full HTML5 slot: 6×5 cluster pays, multiplier orbs, free games, an awakening mode, buy-feature and jackpots. The engine is pure TypeScript with a replayable RNG, so every spin can be simulated, replayed and checked.',
      zh: '完整的 HTML5 老虎機：6×5 群集消除、倍數球、免費遊戲、覺醒模式、購買特色與 JP。引擎是純 TypeScript、亂數可重播，每一轉都能模擬、重播與驗證。',
    },
    beats: [
      { en: 'Monte Carlo simulation on every CPU core confirms the 96.89% RTP target; maximum win 81,000×.', zh: '用所有 CPU 核心跑蒙地卡羅模擬，確認 RTP 96.89%；最高 81,000 倍。' },
      { en: 'The engine emits an event sequence; the PixiJS and GSAP layer only plays it back.', zh: '引擎只輸出事件序列，PixiJS 與 GSAP 表現層負責播放。' },
      { en: 'All sound is synthesised live with Web Audio. Art is original, generated with Codex and cleaned by script.', zh: '所有音效以 Web Audio 即時合成；美術全部原創，由 Codex 生成再以腳本清理。' },
    ],
    stack: ['TypeScript', 'PixiJS v8', 'GSAP', 'Vite', 'Web Audio', 'Cloudflare'],
    shots: [
      { src: 'works/sandstorm/board.webp', alt: { en: 'Sandstorm God reels with jackpot meters and two original characters', zh: '沙暴之神盤面，含 JP 與兩位原創角色' } },
      { src: 'works/sandstorm/title.webp', alt: { en: 'Sandstorm God title screen', zh: '沙暴之神標題畫面' } },
    ],
    link: { href: 'https://sandstorm-god.courage-mazu.workers.dev', label: { en: 'Play it', zh: '試玩' } },
    note: { en: 'Rules follow a published commercial game spec; the name, art and audio are original.', zh: '玩法規則依公開的商業遊戲規格實作；名稱、美術與音效皆為原創。' },
  },
  {
    id: 'betcorgi',
    name: 'BetCorgi',
    sub: { en: 'Twenty games, one server-authoritative ledger', zh: '二十款遊戲，一本由伺服器說了算的帳' },
    meta: { en: 'Virtual-points game platform · demo', zh: '虛擬點數遊戲平台 · 展示版' },
    story: {
      en: "Crash, Plinko, Mines, Blackjack and sixteen more. The Go server generates every result and settles it; the browser can't set a balance or a payout, and points can't be bought or cashed out.",
      zh: 'Crash、Plinko、Mines、21 點等二十款遊戲。每個結果都由 Go 伺服器產生並結算；瀏覽器無法指定餘額或獎金，點數不能儲值也不能兌現。',
    },
    beats: [
      { en: 'Each bet, settlement, idempotency key and wallet entry commits in one SQLite transaction; balances are integer cents.', zh: '每筆下注、結算、冪等鍵與錢包流水都在同一個 SQLite 交易中提交；金額以整數分儲存。' },
      { en: 'Socket.IO with reconnect recovery for in-progress games; shared rounds refund on restart instead of paying twice.', zh: 'Socket.IO 斷線重連可恢復進行中的遊戲；共用回合在重啟時退點，不會重複派彩。' },
      { en: 'Rate limits and trusted-proxy parsing stop spoofed client IPs.', zh: '限速與可信代理解析，防止偽造來源 IP。' },
    ],
    stack: ['Nuxt 3', 'Vue', 'Go', 'Socket.IO', 'SQLite', 'Playwright'],
    shots: [
      { src: 'works/betcorgi/crash.webp', alt: { en: 'BetCorgi Crash game mid-round at 2.10×', zh: 'BetCorgi Crash 遊戲進行中（2.10×）' } },
      { src: 'works/betcorgi/lobby.webp', alt: { en: 'BetCorgi lobby with twenty games', zh: 'BetCorgi 大廳的二十款遊戲' } },
      { src: 'works/betcorgi/plinko.webp', alt: { en: 'BetCorgi Plinko board', zh: 'BetCorgi Plinko 板' } },
    ],
    link: { href: 'https://casino-ail.pages.dev', label: { en: 'Open the demo', zh: '開啟展示版' } },
    note: { en: 'The public demo runs in browser mock mode. Virtual points only, no real money.', zh: '公開展示版以瀏覽器模擬模式運行；僅虛擬點數，不涉及真實金錢。' },
  },
  {
    id: 'ironvale',
    name: 'Ironvale',
    sub: { en: 'From Blender bones to an HD-2D battlefield', zh: '從 Blender 骨架到 HD-2D 戰場' },
    meta: { en: 'HD-2D character pipeline · game tech', zh: 'HD-2D 角色管線 · 遊戲技術' },
    story: {
      en: 'A character pipeline for HD-2D tactics games: Blender renders eight directions, pixel processing and hand retouching build the atlases, and Unity imports them into a lit 3D map. The hero is me.',
      zh: 'HD-2D 戰棋遊戲的角色管線：Blender 算出八方向動作，經像素化與人工修圖做成圖集，Unity 自動匯入到有光影的 3D 地圖。主角就是我。',
    },
    beats: [
      { en: "Hand-cleaned frames always win: re-renders never overwrite an artist's fixes.", zh: '人工修過的影格永遠優先：重新算圖絕不覆蓋美術的修正。' },
      { en: 'Unity URP scene with shadows, fog, bloom and depth of field that follows the character.', zh: 'Unity URP 場景：陰影、霧、Bloom，景深跟著角色走。' },
      { en: 'One command builds, runs EditMode and PlayMode tests, makes a Windows player and smoke-tests all eight directions.', zh: '一個指令完成建置、EditMode/PlayMode 測試、輸出 Windows 版並自動驗證八個方向。' },
    ],
    stack: ['Blender', 'Python', 'Unity 6 URP', 'C#', 'Pillow'],
    shots: [
      { src: 'works/ironvale/courtyard.webp', alt: { en: 'Ironvale courtyard in Unity with the pixel hero under a lamp', zh: 'Ironvale 在 Unity 中的庭院，像素主角站在路燈下' } },
      { src: 'works/ironvale/sprites.webp', alt: { en: 'Eight-direction sprite sheet: idle, walk, attack and guard', zh: '八方向動作圖：待機、走路、攻擊、格擋' } },
    ],
    video: { src: 'works/ironvale/attack.mp4', poster: 'works/ironvale/courtyard.webp', alt: { en: 'The pixel hero attacking in the Unity player', zh: '像素主角在 Unity 中攻擊' } },
  },
];

export const aiMethod = {
  title: { en: 'How I work with AI', zh: '我怎麼和 AI 協作' } as L,
  lede: {
    en: "I run AI agents the way I'd run a crew: written rules, shared skills, gated specs, and proof before anything is called done.",
    zh: '我帶 AI 代理就像帶劇組：寫下規範、共用技能、規格把關，而且完成前一定要有證據。',
  } as L,
  steps: [
    {
      sign: { en: 'RULES', zh: '規範' } as L,
      title: { en: 'Rules before prompts', zh: '先有規範，再下指令' } as L,
      body: { en: 'Every workspace carries a short operating doc with hard laws: money is decimal, never float; fail loud, never invent; map the blast radius before a cross-repo change.', zh: '每個工作區都有一份簡短的作業守則，寫明硬性規定：金額用 decimal 不用 float；寧可報錯也不捏造；跨 repo 修改前先評估影響範圍。' } as L,
      evidence: 'CLAUDE.md · AGENTS.md',
    },
    {
      sign: { en: 'SKILLS', zh: '技能' } as L,
      title: { en: 'Skills as shared muscle memory', zh: '把技能變成共用的肌肉記憶' } as L,
      body: { en: 'Reusable skills such as verify-live, replay-validate and cross-repo-change live in one repo and install into Claude, Codex or any agent.', zh: 'verify-live、replay-validate、cross-repo-change 等技能集中在一個 repo，可安裝到 Claude、Codex 或任何代理。' } as L,
      evidence: 'sportsbook-skills',
    },
    {
      sign: { en: 'SPECS', zh: '規格' } as L,
      title: { en: 'Specs gate the work', zh: '用規格替工作把關' } as L,
      body: { en: 'Spec (what and why) → approved → plan (how, per repo) → reviewed → tasks → pull requests. No plan before approval, no code before the plan is reviewed.', zh: '規格（做什麼、為什麼）→ 核准 → 計畫（各 repo 怎麼做）→ 審查 → 任務 → PR。未核准不寫計畫，計畫未審不寫程式。' } as L,
      evidence: 'backoffice-specs',
    },
    {
      sign: { en: 'VERIFY', zh: '驗證' } as L,
      title: { en: 'Agents verify the real thing', zh: '讓代理驗證真實環境' } as L,
      body: { en: 'An agent drives Playwright through a live environment: real login, role permissions, write-and-revert, database reconcile. It writes a schema-checked result that a dashboard reads.', zh: '代理用 Playwright 操作真實環境：實際登入、角色權限、寫入後還原、資料庫對帳，並輸出經 schema 驗證的結果給儀表板讀取。' } as L,
      evidence: 'backoffice-e2e-agent-harness',
    },
    {
      sign: { en: 'GATES', zh: '關卡' } as L,
      title: { en: 'Humans hold the gates', zh: '關鍵關卡由人把守' } as L,
      body: { en: "Agents draft tickets and changes. A person approves anything that leaves the machine or can't be undone.", zh: '代理負責起草工單與修改；凡是會離開本機或無法復原的動作，一律由人核准。' } as L,
      evidence: 'human-gated tickets',
    },
  ],
  footnote: {
    en: 'Claude Code for engineering, Codex for image generation, with the prompt and provenance saved beside every generated asset. This site was built the same way.',
    zh: '工程用 Claude Code，生圖用 Codex；每個生成素材旁都保存提示詞與來源紀錄。這個網站也是這樣做出來的。',
  } as L,
};

export const experience = {
  title: { en: 'The road so far', zh: '一路走來' } as L,
  items: [
    { year: '2026', when: '2026.02 – 2026.08', org: 'CypherLab Sdn. Bhd.', role: { en: 'Senior Full-Stack Engineer', zh: '資深全端工程師' } as L, what: { en: 'Real-time sports and e-sports betting back office.', zh: '即時體育與電競博彩營運後台。' } as L },
    { year: '2022', when: '2022.02 – 2026.01', org: 'Mediconcen', role: { en: 'Senior Full-Stack Engineer', zh: '資深全端工程師' } as L, what: { en: 'Hong Kong InsurTech: clinic and insurer workflows.', zh: '香港保險科技：診所與保險公司流程。' } as L },
    { year: '2021', when: '2021.07 – 2022.02', org: 'Paradromix', role: { en: 'Frontend Engineer', zh: '前端工程師' } as L, what: { en: 'SSR web platforms with Nuxt and a custom CMS for non-technical teams.', zh: '以 Nuxt 打造 SSR 平台，並為非技術團隊建置自訂 CMS。' } as L },
    { year: '2018', when: '2018.01 – 2021.07', org: 'ULIC TEK', role: { en: 'Software Engineer', zh: '軟體工程師' } as L, what: { en: 'Image processing in C++ and OpenCV, and desktop-web hybrid apps.', zh: 'C++ 與 OpenCV 影像處理，以及桌面與網頁混合應用。' } as L },
  ],
  education: { en: 'BSc Chemistry, Chia Nan University of Pharmacy and Science, 2017', zh: '嘉南藥理大學 化學系學士，2017' } as L,
  languages: { en: 'English · Mandarin', zh: '英文 · 中文' } as L,
};

export const contact = {
  title: { en: "Let's build the next one", zh: '一起做下一個作品' } as L,
  lede: { en: "That's a wrap on the tour. The next scene is yours.", zh: '這趟旅程殺青了，下一幕交給你。' } as L,
  hiring: { en: 'Hiring for a remote role?', zh: '正在招募遠端工程師？' } as L,
  hiringLine: { en: 'Download my backend résumé, or email me directly.', zh: '下載後端履歷，或直接寫信給我。' } as L,
  project: { en: 'Need a site or system built?', zh: '需要網站或系統？' } as L,
  projectLine: { en: 'Tell me what it has to do. I reply within a day.', zh: '告訴我它要做到什麼，我一天內回覆。' } as L,
  email: { en: 'Email me', zh: '寄信給我' } as L,
  resumes: [
    { label: { en: 'Backend résumé', zh: '後端履歷' } as L, file: 'resume/Victor_Chang_Backend.pdf' },
  ],
};

// Stations, in walking order. The id doubles as the section id.
export type StationKind = 'intro' | 'skills' | 'work' | 'ai' | 'experience' | 'contact';
export const stations: { id: string; kind: StationKind; bead: string; label: L }[] = [
  { id: 'hello', kind: 'intro', bead: '#f3c35a', label: { en: 'Hello', zh: '開場' } },
  { id: 'skills', kind: 'skills', bead: '#6e9f4f', label: { en: 'Toolbox', zh: '工具箱' } },
  ...works.map((w, i) => ({ id: w.id, kind: 'work' as StationKind, bead: ['#e0533a', '#2d7f86', '#2fbf71', '#c9332b', '#e0a02a', '#e8903f', '#7d6bd1'][i], label: { en: w.name, zh: w.nameZh ?? w.name } })),
  { id: 'ai', kind: 'ai', bead: '#b9a6e8', label: { en: 'AI crew', zh: 'AI 劇組' } },
  { id: 'experience', kind: 'experience', bead: '#9a918a', label: { en: 'Road so far', zh: '一路走來' } },
  { id: 'contact', kind: 'contact', bead: '#f19aa0', label: { en: "That's a wrap", zh: '殺青' } },
];
