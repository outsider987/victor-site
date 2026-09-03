export type Lang = "en" | "zh";
export type Localized<T> = Record<Lang, T>;
export type ProjectSlug = "cypherlab" | "mediconcen" | "carharbor" | "chengguang";

type Decision = {
  title: Localized<string>;
  body: Localized<string>;
};

export type Project = {
  slug: ProjectSlug;
  number: string;
  name: string;
  category: Localized<string>;
  focus: Localized<string[]>;
  stack: string[];
  visual: string;
  visualAlt: Localized<string>;
  summary: Localized<string>;
  product: Localized<string>;
  outcome: Localized<string>;
  workflows: Localized<string[]>;
  decisions: Decision[];
  boundary: Localized<string>;
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBasePath = (path: string) => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

export const projects: Project[] = [
  {
    slug: "cypherlab",
    number: "01",
    name: "CYPHERLAB",
    category: { en: "Sportsbook Operations", zh: "體育博彩營運" },
    focus: { en: ["Live Odds", "Market State", "Audit"], zh: ["即時賠率", "市場狀態", "稽核"] },
    stack: ["React", "TypeScript", "Go", "WebSocket", "NATS", "Redis"],
    visual: withBasePath("/projects/cypherlab/hero.webp"),
    visualAlt: {
      en: "Recreated CypherLab e-sports operations board with fictional event data",
      zh: "以虛構賽事資料重建的 CypherLab 電競即時營運面板",
    },
    summary: {
      en: "An e-sports sportsbook operations platform for live odds, market state, alerts, and traceable operator controls.",
      zh: "面向電競賽事的體育博彩營運平台，處理即時賠率、市場狀態、警示與可追溯的操作控制。",
    },
    product: {
      en: "A React and Go sportsbook back office for operating e-sports matches in real time. NATS snapshots and market diffs are projected into live odds, open/suspended states, alerts, audit history, and service health.",
      zh: "以 React 與 Go 建構、聚焦電競賽事的體育博彩營運後台。NATS 的賽事快照與市場差異會投影成即時賠率、開放／暫停狀態、警示、稽核紀錄與服務健康資訊。",
    },
    outcome: {
      en: "Operators can distinguish requested, pending-approval, and applied changes while every guarded command leaves an audit trail.",
      zh: "營運人員能明確區分已送出、待核准與已套用的變更，高風險命令也都留下稽核軌跡。",
    },
    workflows: {
      en: [
        "Monitor live e-sports matches and drill into market activity.",
        "Separate status changes from price and line movements.",
        "Apply guarded controls with re-authentication and audit history.",
      ],
      zh: [
        "監看電競賽事並下鑽到市場活動。",
        "明確區分狀態變更與賠率／盤口跳動。",
        "在權限、重新驗證與稽核軌跡下執行控制。",
      ],
    },
    decisions: [
      {
        title: { en: "Refresh only what moved", zh: "只更新真正變動的畫面" },
        body: {
          en: "WebSocket signals are scoped by fixture and coalesced before TanStack Query invalidation.",
          zh: "WebSocket 訊號依賽事分流並合併，再觸發 TanStack Query 更新。",
        },
      },
      {
        title: { en: "Operational risk is asymmetric", zh: "不同操作，風險也不同" },
        body: {
          en: "Roles, domain guards, re-authentication, approvals, and audit records protect higher-risk controls.",
          zh: "角色、功能權限、重新驗證、核准與稽核紀錄保護高風險操作。",
        },
      },
      {
        title: { en: "Health is part of the product", zh: "系統健康度也是產品介面" },
        body: {
          en: "Health views expose service probes, provider feeds, stream state, latency, and status.",
          zh: "健康頁面呈現服務探針、供應資料流、串流狀態、延遲與狀態。",
        },
      },
    ],
    boundary: {
      en: "The visual is recreated with fictional data. Tenant names, operator identities, live events, wager/exposure data, proprietary rules, internal hosts, and production topology are intentionally excluded.",
      zh: "畫面以虛構資料重建；商戶名稱、操作員身份、即時賽事、投注與曝險、專有規則、內部主機與正式環境拓樸均未公開。",
    },
  },
  {
    slug: "mediconcen",
    number: "02",
    name: "MEDICONCEN",
    category: { en: "Clinic Care Operations", zh: "診所就診營運" },
    focus: { en: ["Eligibility", "Care Flow", "Records"], zh: ["資格驗證", "就診流程", "營運紀錄"] },
    stack: ["Next.js", "TypeScript", "NestJS", "MySQL", "Redis"],
    visual: withBasePath("/projects/mediconcen/hero.webp"),
    visualAlt: {
      en: "Fictional clinic visit work queue reconstructed from repository workflows",
      zh: "依 repository 工作流程，以虛構資料重建的診所就診待辦介面",
    },
    summary: {
      en: "A clinic operations workflow carrying one verified visit through consultation, insurer validation, and records.",
      zh: "把一次已驗證的就診，從診療待辦、保險交易驗證一路帶到營運紀錄。",
    },
    product: {
      en: "A Next.js clinic portal backed by NestJS services for eligibility checks, verified work queues, consultation inputs, insurer transaction validation, and operational records.",
      zh: "以 Next.js 診所端搭配 NestJS 服務，處理資格查核、已驗證待辦、診療輸入、保險交易驗證與營運紀錄。",
    },
    outcome: {
      en: "Only visits validated by the configured insurer become operational records available to reporting.",
      zh: "只有通過指定保險公司交易驗證的就診，才會成為可供報表查閱的營運紀錄。",
    },
    workflows: {
      en: [
        "Select the payer, service, and practitioner before checking member eligibility.",
        "Turn a successful verification into a clinic work item for diagnosis and medicine.",
        "Submit the completed visit through the configured insurer API for transaction validation before moving it into records and reports.",
      ],
      zh: [
        "先選擇保險方、服務與醫師，再確認會員資格。",
        "將成功驗證轉成診所待辦，加入診斷與藥品。",
        "完成診療與結算後，透過已設定的保險公司 API 送出交易驗證，成功後再移入紀錄與報表。",
      ],
    },
    decisions: [
      {
        title: { en: "Verification creates work", zh: "驗證成功才建立待辦" },
        body: {
          en: "A successful eligibility check becomes a validated Pending List item.",
          zh: "資格查核成功後，才建立經驗證的 Pending List 項目。",
        },
      },
      {
        title: { en: "Keep consultation state explicit", zh: "讓診療狀態保持明確" },
        body: {
          en: "Diagnosis, medicine, settlement, insurer validation, and completion remain distinct workflow steps.",
          zh: "診斷、藥品、結算、保險交易驗證與完成維持為不同的流程步驟。",
        },
      },
      {
        title: { en: "Completion becomes an operational record", zh: "完成後形成營運紀錄" },
        body: {
          en: "Records and reports are produced only after the configured insurer validates the transaction.",
          zh: "已設定的保險公司完成交易驗證後，才進入紀錄與報表。",
        },
      },
    ],
    boundary: {
      en: "Every visit, identifier, and status in the visual is fictional. Patient, clinic, payer, eligibility-rule, payment, and integration details are intentionally excluded.",
      zh: "畫面中的就診、識別碼與狀態全為虛構；病患、診所、保險方、資格規則、付款與整合細節均未公開。",
    },
  },
  {
    slug: "carharbor",
    number: "03",
    name: "CARHARBOR",
    category: { en: "Web3 Escrow Prototype", zh: "Web3 託管交易原型" },
    focus: { en: ["Wallet", "Transaction", "State"], zh: ["錢包", "交易", "狀態"] },
    stack: ["React", "TypeScript", "Wagmi", "Viem", "Solidity"],
    visual: withBasePath("/projects/carharbor/hero.webp"),
    visualAlt: {
      en: "Recreated CarHarbor escrow interface without wallet addresses",
      zh: "移除錢包地址後重建的 CarHarbor 託管交易介面",
    },
    summary: {
      en: "An educational testnet prototype that makes wallet, receipt, contract-event, and synchronized business states explicit.",
      zh: "一個教學用測試網原型，清楚區分錢包、收據、合約事件與同步後的業務狀態。",
    },
    product: {
      en: "CarHarbor demonstrates a tokenized vehicle purchase on Polygon Amoy. A seller creates an escrow, a buyer funds it with demo tokens, a verifier marks delivery, and buyer confirmation atomically releases payment and the vehicle NFT.",
      zh: "CarHarbor 在 Polygon Amoy 示範代幣化車輛交易：賣方建立託管、買方以測試代幣入金、驗證方確認交付，最後由買方確認並原子化釋放款項與車輛 NFT。",
    },
    outcome: {
      en: "The interface keeps signature, receipt, synchronization, and final contract state separate, so a transaction hash is never mistaken for completion.",
      zh: "介面將簽名、收據、同步與最終合約狀態分開呈現，不會把取得交易 hash 誤認為完成。",
    },
    workflows: {
      en: [
        "Connect a wallet, verify the required chain, and inspect balances/allowance.",
        "Approve demo tokens and fund an escrow through distinct transaction states.",
        "Recover escrow status and evidence from contract reads and historical events after refresh.",
      ],
      zh: [
        "連接錢包、確認目標鏈並檢查餘額與 allowance。",
        "分開處理測試代幣核准與託管入金的交易狀態。",
        "重新整理後，從合約讀取與歷史事件恢復託管狀態與證據。",
      ],
    },
    decisions: [
      {
        title: { en: "A hash is not completion", zh: "拿到 hash 不等於完成" },
        body: {
          en: "The reducer separates validation, signature, submission, receipt, synchronization, and failure.",
          zh: "交易 reducer 分開描述驗證、簽名、送出、收據、同步與失敗。",
        },
      },
      {
        title: { en: "Read back after the receipt", zh: "收據確認後再次讀鏈" },
        body: {
          en: "A confirmed receipt invalidates targeted queries; fresh contract reads establish final UI state.",
          zh: "收據確認後只失效相關 query，並以最新合約讀取建立最終介面狀態。",
        },
      },
      {
        title: { en: "Keep the contract state small", zh: "維持小而明確的合約狀態機" },
        body: {
          en: "Five explicit states are enforced with role checks and checks-effects-interactions ordering.",
          zh: "五個明確狀態搭配角色檢查與 checks-effects-interactions 順序。",
        },
      },
    ],
    boundary: {
      en: "This is an educational, unaudited prototype—not a production marketplace or legal vehicle-ownership system. The visual contains no wallet, contract, RPC, or deployment identifiers.",
      zh: "這是未經稽核的教學原型，不是正式市場或法律上的車輛所有權系統；畫面未包含錢包、合約、RPC 或部署識別資訊。",
    },
  },
  {
    slug: "chengguang",
    number: "04",
    name: "CHENGGUANG",
    category: { en: "Tender Discovery", zh: "標案探索平台" },
    focus: { en: ["Search", "Data", "Operations"], zh: ["搜尋", "資料", "營運"] },
    stack: ["Vue", "TypeScript", "Go", "PostgreSQL", "Python", "R2"],
    visual: withBasePath("/projects/chengguang/hero.webp"),
    visualAlt: {
      en: "Fictional Chengguang tender discovery interface with an experimental search label",
      zh: "含實驗性搜尋標示、使用虛構標案資料的 Chengguang 探索介面",
    },
    summary: {
      en: "A member and operations workspace connecting tender search with ingestion, saved interests, and data-health tooling.",
      zh: "把標案搜尋、資料匯入、興趣條件與資料健康工具串在一起的會員與營運工作台。",
    },
    product: {
      en: "Chengguang combines member-facing tender discovery, saved keyword groups, profiles and health checks with an admin console for tenders, members, search activity, downloads, and system operations.",
      zh: "Chengguang 將會員端標案探索、關鍵字群組、會員資料與健檢，連接到管理端的標案、會員、搜尋行為、下載與系統營運。",
    },
    outcome: {
      en: "Search behavior, replayable imports, and data-health signals share one operating model, making discovery quality traceable back to its source data.",
      zh: "搜尋行為、可重播匯入與資料健康訊號共用同一套營運模型，讓探索品質能回溯到來源資料。",
    },
    workflows: {
      en: [
        "Filter tenders by text, agency, category, region, status, dates, and amount ranges.",
        "Save keyword groups and connect results to member capability/profile inputs.",
        "Import snapshots, manage downloads, inspect logs, and review crawler/data health.",
      ],
      zh: [
        "依文字、機關、類別、地區、狀態、日期與金額區間篩選標案。",
        "儲存關鍵字群組，並把結果連結到會員能力與資料。",
        "匯入快照、管理下載、檢查紀錄與爬蟲／資料健康度。",
      ],
    },
    decisions: [
      {
        title: { en: "Search and operations share one data model", zh: "搜尋與營運共用同一份資料模型" },
        body: {
          en: "Member filters, admin views, clicks, downloads, and health checks share PostgreSQL-backed models.",
          zh: "會員篩選、管理畫面、點擊、下載與健康檢查共用 PostgreSQL 資料模型。",
        },
      },
      {
        title: { en: "Imports are replayable", zh: "匯入流程可以重播" },
        body: {
          en: "R2-compatible snapshots separate crawl and download work from replayable database imports.",
          zh: "R2 相容快照將爬取與下載工作，和可重播的資料庫匯入分開。",
        },
      },
      {
        title: { en: "Semantic search stays experimental", zh: "語意搜尋維持實驗標示" },
        body: {
          en: "The admin lab compares lexical, synonym, and BGE-M3/reranker paths; it remains experimental.",
          zh: "管理端實驗室比較字面、同義詞與 BGE-M3／reranker 路徑，並維持實驗標示。",
        },
      },
    ],
    boundary: {
      en: "The visual uses fictional tenders and generic health states. Member/company records, search logs, commercial data, storage locations, credentials, production URLs, and ranking rules are excluded.",
      zh: "畫面只使用虛構標案與通用健康狀態；會員／公司資料、搜尋紀錄、商業資料、儲存位置、憑證、正式網址與排序規則均未公開。",
    },
  },
];

export const homeIntro = {
  number: "00",
  name: { en: "ABOUT ME", zh: "關於我" },
  cardName: "VICTOR CHANG",
  visual: withBasePath("/profile/victor.webp"),
  summary: {
    en: "7+ years building production software across real-time messaging, data-heavy admin platforms, microservices, and system design.",
    zh: "7+ 年軟體開發經驗，涵蓋即時訊息、大型後台管理系統、微服務架構與系統設計。",
  },
  visualAlt: { en: "Portrait of Victor Chang", zh: "Victor Chang 的個人照片" },
};

export const homeSlides = [
  { number: homeIntro.number, name: homeIntro.cardName, visual: homeIntro.visual },
  ...projects,
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const about = {
  title: { en: "ABOUT", zh: "關於我" },
  bio: {
    en: "I’m a Taiwan-based software engineer with 7+ years of experience building product interfaces, real-time messaging systems, and data-heavy admin platforms. I also design microservice boundaries and the system flows behind reliable operational software.",
    zh: "我是來自台灣、擁有 7+ 年開發經驗的軟體工程師，長期投入產品介面、即時訊息系統與大型後台管理平台，也具備微服務架構與系統設計經驗，重視清楚的狀態、安全的流程與可靠的營運軟體。",
  },
  location: { en: "Taiwan", zh: "台灣" },
  availability: { en: "Open to remote opportunities", zh: "開放遠端工作機會" },
};

export const links = {
  resume: withBasePath("/Victor_Chang_Go_TypeScript_Resume_v3.pdf"),
  email: "mailto:t790219520@gmail.com",
  github: "https://github.com/outsider987",
  linkedin: "https://linkedin.com/in/yao-hsien-chang",
};
