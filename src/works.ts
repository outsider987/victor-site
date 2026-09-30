import type { L } from './content.ts';

export type Shot = { src: string; alt: L };
export type Work = {
  id: string;
  bead: string;
  name: string;
  nameZh?: string;
  sub: L;
  meta: L;
  story: L;
  beats: L[];
  stack: string[];
  shots: Shot[];
  phone?: Shot;
  link?: { href: string; label: L };
  note?: L;
};

export const works: Work[] = [
  {
    id: 'cypherlab',
    bead: '#e0533a',
    name: 'CypherLab',
    sub: { en: 'A real-time back office that keeps pace with the match', zh: '掌握賽事變化的即時營運後台' },
    meta: { en: 'Real-time sportsbook back office · 2026', zh: '即時體育博彩營運後台 · 2026' },
    story: {
      en: 'I helped rebuild a sports and e-sports back office. Operators need to follow changing markets and odds, and trace every market closure or odds adjustment.',
      zh: '我參與重建體育與電競營運後台。賠率和盤口會隨比賽變動，營運人員要即時掌握，也要能追查每次關盤和調整賠率的操作。',
    },
    beats: [
      { en: 'The team already knew Go, so we kept a shared backend language. The BFF groups code by business domain and combines data from downstream services.', zh: '團隊原本就熟悉 Go，因此新後台也沿用 Go；BFF 按業務功能拆分模組，再整合其他服務的資料給前端。' },
      { en: 'NATS JetStream feeds in-memory market state and WebSocket updates. Per-match sequence checks stop older events from overwriting newer ones.', zh: 'NATS JetStream 接收賽事更新，整理盤口狀態後透過 WebSocket 推到畫面；每場比賽都檢查更新順序，避免舊資料蓋掉新資料。' },
      { en: 'TanStack Query loads and caches the initial market data; WebSocket applies live updates. Added or removed markets trigger a refetch. This avoids a custom cache, but resync timing still needs explicit handling.', zh: '盤口先透過 TanStack Query 載入並快取，之後由 WebSocket 即時更新。遇到盤口新增或移除，就重新抓取資料。這省下自行管理快取的工作，但何時重新同步仍得自己判斷。' },
      { en: 'Closing a market or changing odds requires a reason, a second approval and an audit trail. Idempotency prevents duplicate commands.', zh: '關盤或調整賠率要附上原因、經雙人覆核並留下操作紀錄；重複送出也不會執行兩次。' },
      { en: 'API serving, ClickHouse ingestion and settlement run separately on Kubernetes, keeping background work apart from operator requests.', zh: 'API、資料寫入和結算分開部署，避免背景工作影響營運後台的操作。' },
    ],
    stack: ['Go', 'gRPC', 'NATS JetStream', 'WebSocket', 'React', 'TypeScript', 'TanStack Query', 'PostgreSQL', 'Redis', 'ClickHouse', 'Kubernetes'],
    shots: [
      { src: 'works/cypherlab/markets.webp', alt: { en: 'CypherLab match markets board with per-market status and actions', zh: 'CypherLab 賽事盤口面板，含各盤口狀態與操作' } },
      { src: 'works/cypherlab/audit.webp', alt: { en: 'Audit log with an action reason and before/after change, operator names blurred', zh: '稽核紀錄與操作理由、變更前後對照，操作者已模糊處理' } },
    ],
    note: { en: 'Screens from a development environment. Operator identities, wager data and pricing rules are withheld.', zh: '畫面來自開發環境；操作員身分、投注資料與定價規則均未公開。' },
  },
  {
    id: 'mediconcen',
    bead: '#2d7f86',
    name: 'Mediconcen',
    sub: { en: 'Connecting clinics and insurers through claims', zh: '串起診所與保險公司的理賠流程' },
    meta: { en: 'InsurTech · Hong Kong · 2022–2026', zh: '保險科技 · 香港 · 2022–2026' },
    story: {
      en: 'I owned clinic-to-insurer workflows covering eligibility checks, co-payment calculation, claim submission and insurer APIs, and helped onboard new partners.',
      zh: '我負責診所到保險公司的理賠流程，包括資格驗證、自付額計算、理賠送件與保險公司 API 串接，也參與新合作夥伴的導入。',
    },
    beats: [
      { en: 'Moved legacy React pages from classes to Hooks, then added infinite scroll and virtualized lists to keep data-heavy views responsive.', zh: '把舊 React 頁面從 class 改成 Hooks，並用無限捲動和虛擬列表改善大量資料的顯示。' },
      { en: 'The PHP application coupled web pages and backend logic. We split them and built NestJS APIs so both sides could use TypeScript.', zh: '原本的 PHP 系統把網頁和後端綁在一起。拆分後，我們用 NestJS 建立 API，讓前後端都用 TypeScript 開發。' },
      { en: 'Each service had its own deployment script, so releases and environment settings varied. Moving from ECS to Kubernetes standardized deployment, with more cluster maintenance in return.', zh: '各服務以前各有部署腳本，發布步驟和環境設定不一致。從 ECS 遷到 Kubernetes 後，改用同一套流程管理部署；代價是叢集維運負擔增加。' },
    ],
    stack: ['TypeScript', 'React', 'Next.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis', 'AWS', 'Kubernetes'],
    shots: [
      { src: 'works/mediconcen/portal.webp', alt: { en: 'Clinic Portal home: member verification, consultation records and booking tools', zh: 'Clinic Portal 首頁：會員驗證、就診紀錄與預約等操作入口' } },
      { src: 'works/mediconcen/records.webp', alt: { en: 'Clinic Portal consultation records with demo entries', zh: 'Clinic Portal 就診紀錄，使用示範資料' } },
    ],
    note: { en: 'Clinic Portal shown with demo data; no real patient records are displayed.', zh: 'Clinic Portal 畫面使用示範資料，不含真實病患紀錄。' },
  },
  {
    id: 'vote',
    bead: '#73958b',
    name: '開票所',
    sub: { en: 'Election night, seen from the counting room', zh: '把開票現場搬到你的螢幕' },
    meta: { en: '3D election results · Taiwan · 2026', zh: '3D 地方選舉開票網站 · 台灣 · 2026' },
    story: {
      en: "I built a 3D results site for Taiwan's 2026 local elections. Each county rises as a stack of counted ballots; the board adds 正 strokes as votes come in, and a red stamp marks a decided race.",
      zh: '我為 2026 台灣地方選舉打造 3D 開票網站。各縣市的紙堆隨開票數升高，計票板一筆筆畫出「正」字，確定當選時再蓋上紅章。',
    },
    beats: [
      { en: 'The public replay uses official 2022 final results. Its intermediate counts are simulated and labelled as such.', zh: '公開重播使用中選會的 2022 最終結果；中途票數是模擬資料，畫面也清楚標示。' },
      { en: 'For election night, one poller turns Central Election Commission updates into JSON. Browsers read a static Cloudflare feed instead of contacting the source site.', zh: '選舉夜由單一程式整理中選會更新，再發布成 JSON；瀏覽器只讀 Cloudflare 的靜態資料，不直接連中選會。' },
      { en: 'The same results drive ballot stacks, the tally board, close-race alerts and a text view across mayor and council races.', zh: '縣市長與議員結果共用同一份狀態，帶動選票紙堆、計票板、拉鋸戰提醒與文字版結果。' },
    ],
    stack: ['TypeScript', 'three.js', 'Vite', 'Node.js', 'Cloudflare Workers', 'TopoJSON'],
    shots: [
      { src: 'works/vote/mayor.webp', alt: { en: '2022 mayor election replay with 3D ballot stacks, close races and Taipei vote board', zh: '2022 縣市長開票重播：3D 選票紙堆、拉鋸戰與臺北市計票板' } },
      { src: 'works/vote/council.webp', alt: { en: '2022 council election replay with decided seat totals and Taipei district vote board', zh: '2022 議員開票重播：全國席次與臺北市選區計票板' } },
    ],
    link: { href: 'https://vote.courage-mazu.workers.dev/?source=replay', label: { en: 'View the replay', zh: '觀看重播' } },
    note: { en: 'Independent site, not affiliated with the CEC. Screens show the 2022 replay: official final results with simulated in-progress votes.', zh: '本站不是中選會官方網站。畫面為 2022 重播：最終結果取自中選會，中途票數為模擬資料。' },
  },
  {
    id: '3ccash',
    bead: '#2fbf71',
    name: '3C換金所',
    sub: { en: 'Send a photo on LINE, get a quote in a minute', zh: 'LINE 傳照片，一分鐘拿到估價' },
    meta: { en: 'Client site · Taipei · live', zh: '客戶網站 · 台北 · 已上線' },
    story: {
      en: "A second-hand Mac, camera and 3C buyback store. I built the whole stack on Cloudflare's edge: an SEO-first storefront, an admin console, and a LINE bot that walks customers through a quote.",
      zh: '我替二手 Mac、相機與 3C 收購門市建置官網、管理後台和 LINE 估價機器人，整套系統部署在 Cloudflare。',
    },
    beats: [
      { en: 'Nuxt SSR runs inside a Durable Object behind a 60-second edge HTML cache; static assets never touch Worker CPU.', zh: 'Nuxt 頁面由 Durable Object 產生，並在邊緣快取 60 秒；靜態檔案則由 Cloudflare 直接提供。' },
      { en: "A LINE valuation state machine: HMAC-verified webhook → quick-reply steps → a summary card pushed to the owner's phone.", zh: 'LINE 機器人逐步詢問機況，再把整理好的資料推送給店長；Webhook 會先驗證來源。' },
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
    bead: '#c9332b',
    name: '天鳳宮 · 勇氣媽祖',
    sub: { en: "A temple's shop, fund and calendar, on LINE", zh: '宮廟的商城、基金與行事曆，全接上 LINE' },
    meta: { en: 'Client site · live', zh: '客戶網站 · 已上線' },
    story: {
      en: 'A temple community needed more than a brochure: an online shop, a building fund with a public donor list, an events calendar with sign-ups and a member centre, all tied to LINE Login.',
      zh: '宮廟需要的不只是形象網站：線上商城、公開捐款芳名的建廟基金、可報名的活動行事曆與會員中心，全部串接 LINE 登入。',
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
    bead: '#e0a02a',
    name: 'Sandstorm God',
    nameZh: '沙暴之神',
    sub: { en: "Slot math that's proven, not promised", zh: '數學經得起驗證的老虎機' },
    meta: { en: 'HTML5 slot game · playable', zh: 'HTML5 老虎機 · 可試玩' },
    story: {
      en: 'I built an HTML5 slot with a 6×5 cluster-pays board, multiplier orbs, free games, an awakening mode and jackpots. Its TypeScript engine uses replayable randomness, so spins can be simulated and checked.',
      zh: '我做了一款 HTML5 老虎機，包含 6×5 消除玩法、倍數球、免費遊戲、覺醒模式和彩金。遊戲邏輯用 TypeScript 撰寫，每次轉動的結果都能重現並驗證。',
    },
    beats: [
      { en: 'Monte Carlo simulations check the 96.89% RTP target; maximum win is 81,000×.', zh: '透過蒙地卡羅模擬檢查 96.89% 的 RTP 目標；最高獎金為 81,000 倍。' },
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
    bead: '#e8903f',
    name: 'BetCorgi',
    sub: { en: 'Twenty games, one server-authoritative ledger', zh: '二十款遊戲，點數由伺服器統一管理' },
    meta: { en: 'Virtual-points game platform · demo', zh: '虛擬點數遊戲平台 · 展示版' },
    story: {
      en: "Crash, Plinko, Mines, Blackjack and sixteen more. The Go server generates every result and settles it; the browser can't set a balance or a payout, and points can't be bought or cashed out.",
      zh: 'Crash、Plinko、Mines、21 點等二十款遊戲。每個結果都由 Go 伺服器產生並結算；瀏覽器無法指定餘額或獎金，點數不能儲值也不能兌現。',
    },
    beats: [
      { en: 'Bets, settlements and wallet entries commit in one SQLite transaction, with idempotency keys to prevent duplicate processing.', zh: '下注、結算與錢包紀錄在同一筆 SQLite 交易中完成，也會檢查是否重複處理，避免點數只更新一半或重複入帳。' },
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
];
