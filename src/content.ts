// Bilingual site content. Every claim traces to a résumé, README or project doc.
import { works } from './works.ts';
export { works };
export type { Work, Shot } from './works.ts';

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
    { year: '2022', when: '2022.02 – 2026.01', org: 'Mediconcen', role: { en: 'Senior Full-Stack Engineer', zh: '資深全端工程師' } as L, what: { en: 'Hong Kong InsurTech: clinic and insurer workflows.', zh: '串接診所與保險公司的理賠流程。' } as L },
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
  ...works.map((w) => ({ id: w.id, kind: 'work' as StationKind, bead: w.bead, label: { en: w.name, zh: w.nameZh ?? w.name } })),
  { id: 'ai', kind: 'ai', bead: '#b9a6e8', label: { en: 'AI crew', zh: 'AI 劇組' } },
  { id: 'experience', kind: 'experience', bead: '#9a918a', label: { en: 'Road so far', zh: '一路走來' } },
  { id: 'contact', kind: 'contact', bead: '#f19aa0', label: { en: "That's a wrap", zh: '殺青' } },
];
