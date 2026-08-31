"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { projects, withBasePath, type Project } from "@/data/projects";
import { useLanguage } from "./language";

const pathIconKinds = [["nats", "go", "ws", "query"], ["react", "go", "postgres", "nats", "go", "ws"]];

function TechIcon({ kind }: { kind: string }) {
  if (kind === "react") return <i className="cypher-tech-icon" data-kind={kind} aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="2.4" /><ellipse cx="16" cy="16" rx="14" ry="5.5" /><ellipse cx="16" cy="16" rx="14" ry="5.5" transform="rotate(60 16 16)" /><ellipse cx="16" cy="16" rx="14" ry="5.5" transform="rotate(120 16 16)" /></svg></i>;
  if (kind === "query") return <i className="cypher-tech-icon" data-kind={kind} aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m4 9 12-6 12 6-12 6zM4 15l12 6 12-6M4 21l12 6 12-6" /></svg></i>;
  if (kind === "go") return <i className="cypher-tech-icon cypher-go-icon" data-kind={kind} aria-hidden="true"><span>≡GO</span></i>;
  if (kind === "nats") return <i className="cypher-tech-icon" data-kind={kind} aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 25V7h7l8 10V7h7v18h-7L12 15v10z" /></svg></i>;
  if (kind === "ws") return <i className="cypher-tech-icon" data-kind={kind} aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m11 7-6 9 6 9h6l-6-9 6-9zM21 7h-6l6 9-6 9h6l6-9z" /></svg></i>;
  return <i className="cypher-tech-icon" data-kind={kind} aria-hidden="true"><svg viewBox="0 0 32 32"><ellipse cx="16" cy="7" rx="10" ry="4" /><path d="M6 7v16c0 2 4.5 4 10 4s10-2 10-4V7M6 15c0 2 4.5 4 10 4s10-2 10-4" /></svg></i>;
}

function CypherArchitecture({ lang }: { lang: "en" | "zh" }) {
  const reduceMotion = useReducedMotion();
  const copy = lang === "en" ? {
    product: {
      eyebrow: "01 / PRODUCT ARCHITECTURE",
      title: "Real-time market operations across React, Go, and NATS",
      lede: "Versioned projections keep reads current; audited command loops keep writes verifiable.",
      layers: [
        ["react", "React 18 / TypeScript", "Operator workspace"],
        ["query", "TanStack Query", "Scoped client cache"],
        ["go", "Go BFF", "Projection + command gate"],
        ["nats", "NATS / JetStream", "Full + diff events"],
        ["ws", "WebSocket", "Realtime signal"],
        ["postgres", "PostgreSQL", "Audit + command state"],
      ],
      callouts: [["01", "Frontend realtime", "WS signal → scoped query refresh"], ["02", "Go projection", "Full / diff merge → ComputeSeq guard"], ["03", "Controlled command", "Reason → idempotency → approval → audit"]],
      visualAlt: "Fictional e-sports market board used to explain CypherLab's realtime read and control paths",
      fictional: "Recreated interface · fictional data",
      operator: "Operator change",
      market: "LIVE · MAP 2 · MATCH WINNER",
      selection: "NEON UNIT",
      current: "Current odds",
      next: "New odds",
      reason: "Reason required",
      reasonValue: "Roster update confirmed by official.",
      status: "Status",
      states: ["REQUESTED", "PENDING APPROVAL", "APPLIED"],
      submit: "Submit change",
      paths: [
        ["READ PATH", ["NATS full / diff", "Go projection · ComputeSeq", "WS signal", "TanStack Query · scoped refresh"]],
        ["WRITE PATH", ["React command", "Go gate · validate / idempotency", "PostgreSQL audit", "Watched override", "Recompute boundary", "Returned projection"]],
      ],
      boundary: "Pricing internals omitted. Accepted, pending approval, and engine-applied remain distinct states.",
    },
    delivery: {
      eyebrow: "02 / MY AGENT DELIVERY HARNESS",
      title: "From a Linear ticket to a merge-ready PR",
      lede: "I use a Harness that can stop, recover, and rerun every AI change: unclear intent stops the work; evidence must pass before a PR is created.",
      principle: ["HUMAN STEERS · AGENT EXECUTES", "EVIDENCE DECIDES"],
      frame: "MY HARNESS / REPEATABLE DELIVERY SYSTEM",
      stages: [
        {
          number: "01", title: "SELECT & ALIGN", rows: [
            ["HUMAN", "Pick the highest-priority Linear ticket"],
            ["AGENT", "Extract goal, scope, and acceptance criteria"],
            ["GATE", "Unclear → Task Owner updates the spec"],
          ],
        },
        {
          number: "02", title: "CONTEXT & PLAN", rows: [
            ["HARNESS", "Load frontend / backend skills + project sitemap"],
            ["AGENT", "Reuse existing modules and call paths"],
            ["AGENT", "Plan only the necessary change"],
          ],
        },
        {
          number: "03", title: "BUILD & VERIFY", rows: [
            ["AGENT", "Implement → inspect → repair"],
            ["HARNESS", "Before / after + Playwright E2E"],
            ["GATE", "Pass → PR · unclear → stop"],
          ],
        },
        {
          number: "04", title: "PR & DOUBLE REVIEW", rows: [
            ["AGENT", "Create PR after verification"],
            ["AGENT REVIEW", "Codex / Claude second check"],
            ["HUMAN", "Code review + one manual run"],
          ],
        },
      ],
      gates: [
        ["↺ REPAIR LOOP", "Verification fails → fix → rerun", "RETURN TO 03 / VERIFY"],
        ["■ STOP & CLARIFY", "Intent missing → update spec → replan", "RETURN TO 02 / PLAN"],
      ],
      outcome: ["MERGE READY", "Evidence passed · agent-reviewed · human-run"],
      note: "Frontend verification path shown. Backend evidence is selected to match the change rather than invented for the diagram.",
    },
  } : {
    product: {
      eyebrow: "01 / 產品架構",
      title: "橫跨 React、Go 與 NATS 的即時市場營運",
      lede: "版本化 projection 維持讀取正確；受稽核的命令閉環讓寫入可以被驗證。",
      layers: [
        ["react", "React 18 / TypeScript", "操作員工作區"],
        ["query", "TanStack Query", "指定範圍前端快取"],
        ["go", "Go BFF", "Projection＋命令關卡"],
        ["nats", "NATS / JetStream", "完整＋差異事件"],
        ["ws", "WebSocket", "即時訊號"],
        ["postgres", "PostgreSQL", "稽核＋命令狀態"],
      ],
      callouts: [["01", "前端即時更新", "WS 訊號 → 指定範圍 query 更新"], ["02", "Go 資料投影", "完整／差異合併 → ComputeSeq 保護"], ["03", "受控命令", "原因 → 冪等 → 核准 → 稽核"]],
      visualAlt: "以虛構資料重建的電競市場操作台，用來說明 CypherLab 的即時讀取與控制路徑",
      fictional: "重建介面 · 虛構資料",
      operator: "操作員變更",
      market: "即時 · MAP 2 · 勝負盤",
      selection: "NEON UNIT",
      current: "目前賠率",
      next: "新賠率",
      reason: "必填原因",
      reasonValue: "官方已確認選手名單更新。",
      status: "狀態",
      states: ["已送出", "等待核准", "已套用"],
      submit: "送出變更",
      paths: [
        ["讀取路徑", ["NATS 完整／差異事件", "Go projection · ComputeSeq", "WS 訊號", "TanStack Query · 指定範圍更新"]],
        ["寫入路徑", ["React 命令", "Go gate · 驗證／冪等", "PostgreSQL 稽核", "受監控 override", "重新計算邊界", "回傳 projection"]],
      ],
      boundary: "內部定價邏輯不公開；已接受、待核准與引擎已套用是不同狀態。",
    },
    delivery: {
      eyebrow: "02 / 我的 AGENT DELIVERY HARNESS",
      title: "從 Linear Ticket 到可合併 PR",
      lede: "我用一套可停下、可修正、可重跑的 Harness 控制 AI 變更；需求不清就停止，證據通過才建立 PR。",
      principle: ["HUMAN STEERS · AGENT EXECUTES", "EVIDENCE DECIDES"],
      frame: "MY HARNESS / 可重複的交付系統",
      stages: [
        {
          number: "01", title: "選擇與對齊", rows: [
            ["HUMAN", "選最高優先序 Linear Ticket"],
            ["AGENT", "整理目標、範圍、驗收條件"],
            ["GATE", "不清楚 → Task Owner 補充 Spec"],
          ],
        },
        {
          number: "02", title: "載入脈絡與規劃", rows: [
            ["HARNESS", "載入 Frontend / Backend Skill 與 Sitemap"],
            ["AGENT", "沿用既有模組與呼叫路徑"],
            ["AGENT", "只規劃必要變更"],
          ],
        },
        {
          number: "03", title: "實作與驗證", rows: [
            ["AGENT", "實作 → 檢查 → 修復"],
            ["HARNESS", "前後截圖＋Playwright E2E"],
            ["GATE", "通過 → PR · 不清楚 → 停止"],
          ],
        },
        {
          number: "04", title: "PR 與雙重複驗", rows: [
            ["AGENT", "驗證完成後建立 PR"],
            ["AGENT REVIEW", "Codex / Claude 二次檢查"],
            ["HUMAN", "人工 Review＋手動跑一次"],
          ],
        },
      ],
      gates: [
        ["↺ 修復閉環", "驗證失敗 → 修復 → 重跑", "回到 03 / 驗證"],
        ["■ 停止並釐清", "意圖不足 → 補 Spec → 重規劃", "回到 02 / 規劃"],
      ],
      outcome: ["可合併", "證據通過 · Agent 複驗 · 人工執行"],
      note: "圖中呈現前端驗證路徑；後端證據依變更內容選擇，不為示意圖虛構流程。",
    },
  };

  return (
    <div className="cypher-story">
      <motion.section
        className="cypher-product-section"
        aria-labelledby="cypher-product-title"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .12 }}
        transition={{ duration: .48 }}
      >
        <header className="cypher-section-heading">
          <span>{copy.product.eyebrow}</span>
          <div><h2 id="cypher-product-title">{copy.product.title}</h2><p>{copy.product.lede}</p></div>
        </header>

        <ul className="cypher-stack-rail" aria-label={lang === "en" ? "Product technology stack" : "產品技術棧"}>
          {copy.product.layers.map(([kind, title]) => <li key={title}><TechIcon kind={kind} /><strong>{title}</strong></li>)}
        </ul>

        <div className="cypher-product-layout">
          <ol className="cypher-callouts">
            {copy.product.callouts.map(([number, title, detail]) => <li key={number}><span>{number}</span><strong>{title}</strong><small>{detail}</small></li>)}
          </ol>

          <figure className="cypher-market-visual">
            <Image src={withBasePath("/projects/cypherlab/hero.webp")} alt={copy.product.visualAlt} width={1440} height={900} priority sizes="(max-width: 760px) 100vw, 62vw" />
            <figcaption>{copy.product.fictional}</figcaption>
          </figure>

          <aside className="cypher-operator" aria-label={copy.product.operator}>
            <header><strong>{copy.product.operator}</strong><span>×</span></header>
            <p>{copy.product.market}</p>
            <h3>{copy.product.selection}</h3>
            <div className="cypher-odds-change"><span><small>{copy.product.current}</small>2.10</span><i>→</i><strong><small>{copy.product.next}</small>2.18</strong></div>
            <p className="cypher-field-label">{copy.product.reason}</p>
            <div className="cypher-reason">{copy.product.reasonValue}</div>
            <p className="cypher-field-label">{copy.product.status}</p>
            <ol className="cypher-status">{copy.product.states.map((state) => <li key={state}>{state}</li>)}</ol>
            <span className="cypher-submit">{copy.product.submit}</span>
          </aside>
        </div>

        <div className="cypher-trust-paths">
          {copy.product.paths.map(([label, steps], pathIndex) => <div key={label as string}>
            <strong>{label}</strong>
            <ol>{(steps as string[]).map((step, stepIndex) => <li key={step}><TechIcon kind={pathIconKinds[pathIndex][stepIndex]} /><span>{step}</span></li>)}</ol>
          </div>)}
        </div>
        <p className="cypher-boundary">{copy.product.boundary}</p>
      </motion.section>

      <motion.section
        className="cypher-delivery-section"
        aria-labelledby="cypher-delivery-title"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .1 }}
        transition={{ duration: .5 }}
      >
        <header className="cypher-section-heading">
          <span>{copy.delivery.eyebrow}</span>
          <div><h2 id="cypher-delivery-title">{copy.delivery.title}</h2><p>{copy.delivery.lede}</p></div>
        </header>

        <div className="delivery-canvas">
          <div className="harness-definition">
            <strong>{copy.delivery.principle[0]}</strong><span>{copy.delivery.principle[1]}</span>
          </div>
          <div className="harness-frame">
            <span className="harness-frame-label">{copy.delivery.frame}</span>
            <ol className="harness-stages">
              {copy.delivery.stages.map((stage, index) => <li className="harness-stage" key={stage.number}>
                <header><span>{stage.number}</span><h3>{stage.title}</h3></header>
                <div>{stage.rows.map(([role, detail]) => <p key={`${role}-${detail}`}><b>{role}</b><span>{detail}</span></p>)}</div>
                {index < copy.delivery.stages.length - 1 && <i aria-hidden="true">→</i>}
              </li>)}
            </ol>
            <div className="harness-gates">
              {copy.delivery.gates.map(([title, detail, target], index) => <article className={index ? "harness-stop" : "harness-repair"} key={title}>
                <strong>{title}</strong><span>{detail}</span><small>{target}</small>
              </article>)}
            </div>
          </div>
          <div className="harness-outcome"><i aria-hidden="true">↓</i><article><strong>{copy.delivery.outcome[0]}</strong><span>{copy.delivery.outcome[1]}</span></article></div>
        </div>
        <footer className="delivery-note">{copy.delivery.note}</footer>
      </motion.section>
    </div>
  );
}

function MediconcenJourney({ lang }: { lang: "en" | "zh" }) {
  const reduceMotion = useReducedMotion();
  const copy = lang === "en" ? {
    label: "ONE VERIFIED VISIT",
    note: "From eligibility to the clinic workspace, then into an operational record.",
    stages: [
      ["Verify eligibility", "Confirm the configured service and demo membership."],
      ["Clinic workspace", "Run diagnosis, medicine, and settlement from one verified work item."],
      ["Complete the record", "Move the settled visit into records and reporting."],
    ],
    verification: "Visit verification",
    payer: "Payer and service",
    service: "Configured clinic service",
    membership: "Membership check",
    member: "Demo membership",
    ready: "Ready",
    verify: "Verify eligibility",
    workQueue: "Clinic work queue · verified visit",
    workAlt: "Fictional clinic work queue showing verified visits and consultation progress",
    completed: "Completed",
    record: "Operational record",
    recordRows: ["Eligibility confirmed", "Consultation settled", "Record available"],
    reporting: "Available to records and reporting",
    transitions: ["Create work item", "Complete settlement"],
    outcome: "Successful verification creates a trackable clinic work item.",
    outcomeNote: "Settlement moves the completed visit into records and reporting.",
    system: "SYSTEM BEHIND THE FLOW",
    nodes: {
      staff: ["Clinic staff", "Verify · work queue · records"],
      portal: ["Next.js portal", "Verified clinic workspace"],
      api: ["NestJS API", "Orchestrates · Redis cache"],
      mysql: ["MySQL", "Visit state"],
      external: ["Eligibility / payment services", "External systems"],
    },
    links: ["uses", "requests", "persists", "verifies / settles"],
    stack: "NEXT.JS · TYPESCRIPT · NESTJS · MYSQL · REDIS",
    boundary: "SIMPLIFIED ARCHITECTURE · FICTIONAL DATA · PARTNER RULES OMITTED",
  } : {
    label: "一次已驗證就診",
    note: "從資格驗證、診所工作區，到完成後的營運紀錄。",
    stages: [
      ["資格驗證", "確認已設定的服務與示範會員資格。"],
      ["診所工作區", "在同一筆已驗證待辦完成診斷、藥品與結算。"],
      ["完成營運紀錄", "將已結算的就診移入紀錄與報表。"],
    ],
    verification: "就診資格驗證",
    payer: "保險方與服務",
    service: "已設定的診所服務",
    membership: "會員資格查核",
    member: "示範會員資格",
    ready: "可驗證",
    verify: "驗證資格",
    workQueue: "診所待辦 · 已驗證就診",
    workAlt: "使用虛構資料呈現資格已驗證與診療進度的診所待辦介面",
    completed: "已完成",
    record: "營運紀錄",
    recordRows: ["資格已確認", "診療已結算", "紀錄可查閱"],
    reporting: "可在紀錄與報表中查閱",
    transitions: ["建立待辦", "完成結算"],
    outcome: "資格驗證成功後，建立可追蹤的診所待辦。",
    outcomeNote: "結算完成後，再將就診移入紀錄與報表。",
    system: "支援流程的系統",
    nodes: {
      staff: ["診所人員", "驗證 · 待辦 · 紀錄"],
      portal: ["Next.js Portal", "已驗證的診所工作區"],
      api: ["NestJS API", "流程協調 · Redis 快取"],
      mysql: ["MySQL", "就診狀態"],
      external: ["資格／付款服務", "外部系統"],
    },
    links: ["使用", "送出請求", "寫入", "驗證／結算"],
    stack: "NEXT.JS · TYPESCRIPT · NESTJS · MYSQL · REDIS",
    boundary: "簡化架構 · 全部為虛構資料 · 合作方規則不公開",
  };

  return (
    <div className="care-journey">
      <motion.header
        className="care-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : .35, delay: reduceMotion ? 0 : .08 }}
      >
        <strong>{copy.label}</strong><span>{copy.note}</span>
      </motion.header>

      <ol className="care-stages" aria-label={copy.label}>
        {copy.stages.map(([title, description], index) => (
          <motion.li
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : .42, delay: reduceMotion ? 0 : .18 + index * .12 }}
          >
            <header className="care-stage-heading"><span>0{index + 1}</span><div><h2>{title}</h2><p>{description}</p></div></header>
            {index === 0 && <div className="care-stage-panel care-verification">
              <div className="care-ui-header"><i /><span>{copy.verification}</span></div>
              <div className="care-ui-body">
                <p>{copy.payer}</p><div className="care-ui-field">{copy.service}</div>
                <p>{copy.membership}</p><div className="care-ui-field"><strong>{copy.member}</strong><span>{copy.ready}</span></div>
                <span className="care-ui-button">{copy.verify}</span>
              </div>
            </div>}
            {index === 1 && <figure className="care-stage-panel care-workspace">
              <figcaption><i />{copy.workQueue}</figcaption>
              <Image src={withBasePath("/projects/mediconcen/hero.webp")} alt={copy.workAlt} width={1600} height={900} priority sizes="(max-width: 760px) calc(100vw - 32px), 52vw" />
            </figure>}
            {index === 2 && <div className="care-stage-panel care-record">
              <div className="care-ui-header"><span>{copy.record}</span></div>
              <div className="care-record-body">
                <span>{copy.completed}</span><h3>{copy.record}</h3>
                <ul>{copy.recordRows.map((row) => <li key={row}>{row}</li>)}</ul>
                <p>{copy.reporting}</p>
              </div>
            </div>}
            {index < 2 && <span className="care-transition"><em>{copy.transitions[index]}</em><i /></span>}
          </motion.li>
        ))}
      </ol>

      <div className="care-outcome"><strong>{copy.outcome}</strong><span>{copy.outcomeNote}</span></div>

      <motion.section
        className="care-architecture"
        aria-labelledby="care-system-title"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : .42, delay: reduceMotion ? 0 : .62 }}
      >
        <h2 id="care-system-title">{copy.system}</h2>
        <div className="care-system">
          <div className="care-system-main">
            <div className="care-system-actor"><strong>{copy.nodes.staff[0]}</strong><small>{copy.nodes.staff[1]}</small></div>
            <motion.div className="care-system-link" initial={reduceMotion ? false : { opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : .74 }}><span>{copy.links[0]}</span><i /></motion.div>
            <div className="care-system-node"><strong>{copy.nodes.portal[0]}</strong><small>{copy.nodes.portal[1]}</small></div>
            <motion.div className="care-system-link" initial={reduceMotion ? false : { opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : .81 }}><span>{copy.links[1]}</span><i /></motion.div>
            <div className="care-system-node care-system-api"><strong>{copy.nodes.api[0]}</strong><small>{copy.nodes.api[1]}</small></div>
          </div>
          <div className="care-system-branches">
            {[copy.nodes.mysql, copy.nodes.external].map((node, index) => <div className="care-system-branch" key={node[0]}>
              <motion.div className="care-system-link" initial={reduceMotion ? false : { opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : .88 + index * .07 }}><span>{copy.links[index + 2]}</span><i /></motion.div>
              <div className="care-system-node"><strong>{node[0]}</strong><small>{node[1]}</small></div>
            </div>)}
          </div>
        </div>
        <footer className="care-system-footer"><span>{copy.stack}</span><span>{copy.boundary}</span></footer>
      </motion.section>
    </div>
  );
}

export function CaseStudy({ project, modal = false, onClose }: { project: Project; modal?: boolean; onClose?: () => void }) {
  const { lang } = useLanguage();
  const next = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];

  const sheet = (
      <section className={`case-sheet ${project.slug}-case`}>
        <div className="case-toolbar">
          {modal
            ? <button className="back-link" type="button" onClick={onClose} autoFocus>× {lang === "en" ? "Close" : "關閉"}</button>
            : <Link className="back-link" href="/">← {lang === "en" ? "All work" : "所有作品"}</Link>}
          <p className="case-kicker">{project.number} / 04 · {project.category[lang]}</p>
        </div>

        <div className="case-title">
          <h1>{project.name}</h1>
          <p>{project.summary[lang]}</p>
        </div>

        {project.slug === "cypherlab" ? <CypherArchitecture lang={lang} /> : project.slug === "mediconcen" ? <MediconcenJourney lang={lang} /> : <div className="case-body">
          <figure className="case-visual">
            <Image src={project.visual} alt={project.visualAlt[lang]} width={1440} height={900} priority sizes="(max-width: 900px) 100vw, 68vw" />
            <figcaption>{lang === "en" ? "Recreated interface · fictional data" : "重建介面 · 虛構資料"}</figcaption>
          </figure>

          <aside className="case-notes">
            <div className="brief-block">
              <h2>{lang === "en" ? "Product" : "產品"}</h2>
              <p>{project.product[lang]}</p>
              <small>{lang === "en" ? "For" : "使用者"} — {project.users[lang]}</small>
            </div>

            <div className="brief-block">
              <h2>{lang === "en" ? "Core flow" : "核心流程"}</h2>
              <ol>{project.workflows[lang].map((workflow) => <li key={workflow}>{workflow}</li>)}</ol>
            </div>

            <div className="brief-block engineering-brief">
              <h2>{lang === "en" ? "Engineering" : "工程重點"}</h2>
              <dl>{project.decisions.map((decision) => <div key={decision.title.en}><dt>{decision.title[lang]}</dt><dd>{decision.body[lang]}</dd></div>)}</dl>
            </div>

            <div className="brief-block stack-brief">
              <h2>{lang === "en" ? "Stack" : "技術"}</h2>
              <p>{project.fullStack.join(" · ")}</p>
            </div>

            <details className="public-boundary">
              <summary>{lang === "en" ? "Public boundary" : "公開邊界"}</summary>
              <p>{project.boundary[lang]}</p>
            </details>
          </aside>
        </div>}

        {!modal && <footer className="case-footer">
          <Link href="/">{lang === "en" ? "Back to cover flow" : "返回 Cover Flow"}</Link>
          <Link href={`/work/${next.slug}`}>{lang === "en" ? "Next" : "下一個"} — {next.name} →</Link>
        </footer>}
      </section>
  );

  return modal ? sheet : (
    <main id="main" className="case-page">
      {sheet}
    </main>
  );
}
