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
      fictional: "Generated product demo · fictional data",
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
      flow: {
        ticket: ["01 / LINEAR", "Highest-priority ticket"],
        brief: ["02 / AI BRIEF", "Goal · scope · acceptance criteria"],
        spec: ["SPEC CLEAR?", "No → Task Owner clarifies → return to 02"],
        context: ["03 / CONTEXT", "Skills · sitemap · existing code"],
        plan: ["04 / PLAN", "Only necessary changes"],
        build: ["05 / BUILD", "Agent implements"],
        evidence: ["06 / VERIFY", "Before / after · Playwright E2E"],
        pass: ["EVIDENCE PASSED?", "No → diagnose the failure"],
        cause: ["CAUSE CLEAR?", "Choose repair or human intervention"],
        repair: ["REPAIR ↺", "Agent fixes → return to 06"],
        human: ["HUMAN INTERVENTION", "Clarify / correct → return to 06"],
        pr: ["07 / PR", "Created only after verification"],
        review: ["08 / AGENT REVIEW", "Independent agent review → report"],
        merge: ["MERGE READY", "Evidence · review report · human check"],
      },
      labels: ["YES", "NO", "UNDERSTOOD", "UNCLEAR", "RETURN TO 06"],
      note: "If the agent cannot resolve a failed check, a human intervenes and the change returns to step 06 for the same verification evidence.",
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
      fictional: "生成操作示意 · 虛構資料",
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
      flow: {
        ticket: ["01 / LINEAR", "最高優先序 Ticket"],
        brief: ["02 / AI BRIEF", "目標 · 範圍 · 驗收條件"],
        spec: ["SPEC 清楚嗎？", "否 → Task Owner 補充 → 回到 02"],
        context: ["03 / CONTEXT", "Skills · Sitemap · Existing Code"],
        plan: ["04 / PLAN", "只做必要變更"],
        build: ["05 / BUILD", "Agent 實作"],
        evidence: ["06 / 驗證", "前後截圖 · Playwright E2E"],
        pass: ["驗證通過嗎？", "否 → 判斷失敗原因"],
        cause: ["AI 明白原因嗎？", "選擇修復或人工介入"],
        repair: ["修復 ↺", "Agent 修復 → 回到 06"],
        human: ["人工介入", "釐清／修正 → 回到 06"],
        pr: ["07 / PR", "驗證完成才建立"],
        review: ["08 / AGENT 複驗", "獨立 Agent 審查 → 產出報告"],
        merge: ["可合併", "證據 · Review 報告 · 人工確認"],
      },
      labels: ["是", "否", "明白", "不明白", "回到 06"],
      note: "AI 無法解決驗證問題時，由人工介入釐清或修正，再回到 06 重跑相同驗證。",
    },
  };
  const flow = copy.delivery.flow;

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
            {reduceMotion
              ? <Image src={withBasePath("/projects/cypherlab/hero.webp")} alt={copy.product.visualAlt} width={1440} height={900} priority sizes="(max-width: 760px) 100vw, 62vw" />
              : <video src={withBasePath("/projects/cypherlab/odds-workflow.mp4")} poster={withBasePath("/projects/cypherlab/hero.webp")} aria-label={copy.product.visualAlt} width="1280" height="720" autoPlay muted loop playsInline controls preload="metadata" onCanPlay={({ currentTarget }) => void currentTarget.play().catch(() => {})} />}
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
            <div className="harness-decision-flow">
              <svg className="harness-routes" viewBox="0 0 1200 620" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="harness-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker>
                  <marker id="harness-arrow-stop" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker>
                </defs>
                <path className="harness-route" d="M160 96H218M378 96H450M570 96H612M772 96H816M976 96H1040M1120 137V250M1040 291H912M792 291H784M624 291H568M408 291H160" />
                <path className="harness-route-stop" d="M510 156C430 190 360 190 320 250V500" />
                <path className="harness-route" d="M240 541C175 541 170 190 298 137" />
                <path className="harness-route-stop" d="M852 351V446M792 506H760" />
                <path className="harness-route" d="M912 506H1040M1120 500V370H1160V332M760 541V600H1010V315H1040" />
                <text x="580" y="82">{copy.delivery.labels[0]}</text><text x="355" y="210">{copy.delivery.labels[1]}</text>
                <text x="770" y="276">{copy.delivery.labels[0]}</text><text x="864" y="398">{copy.delivery.labels[1]}</text>
                <text x="950" y="493">{copy.delivery.labels[2]}</text><text x="735" y="493">{copy.delivery.labels[3]}</text>
                <text x="1128" y="415">{copy.delivery.labels[4]}</text><text x="870" y="590">{copy.delivery.labels[4]}</text>
              </svg>
              <article className="harness-flow-node harness-ticket"><strong>{flow.ticket[0]}</strong><span>{flow.ticket[1]}</span></article>
              <article className="harness-flow-node harness-brief"><strong>{flow.brief[0]}</strong><span>{flow.brief[1]}</span></article>
              <div className="harness-decision harness-spec"><strong>{flow.spec[0]}</strong></div>
              <article className="harness-flow-node harness-context"><strong>{flow.context[0]}</strong><span>{flow.context[1]}</span></article>
              <article className="harness-flow-node harness-plan"><strong>{flow.plan[0]}</strong><span>{flow.plan[1]}</span></article>
              <article className="harness-flow-node harness-build"><strong>{flow.build[0]}</strong><span>{flow.build[1]}</span></article>
              <article className="harness-flow-node harness-evidence"><strong>{flow.evidence[0]}</strong><span>{flow.evidence[1]}</span></article>
              <div className="harness-decision harness-pass"><strong>{flow.pass[0]}</strong></div>
              <article className="harness-flow-node harness-pr"><strong>{flow.pr[0]}</strong><span>{flow.pr[1]}</span></article>
              <article className="harness-flow-node harness-review"><strong>{flow.review[0]}</strong><span>{flow.review[1]}</span></article>
              <article className="harness-flow-node harness-merge"><strong>{flow.merge[0]}</strong><span>{flow.merge[1]}</span></article>
              <article className="harness-flow-node harness-spec-help"><strong>{flow.spec[0]}</strong><span>{flow.spec[1]}</span></article>
              <div className="harness-decision harness-cause"><strong>{flow.cause[0]}</strong></div>
              <article className="harness-flow-node harness-repair"><strong>{flow.repair[0]}</strong><span>{flow.repair[1]}</span></article>
              <article className="harness-flow-node harness-human"><strong>{flow.human[0]}</strong><span>{flow.human[1]}</span></article>
            </div>
            <ol className="harness-mobile-flow">
              {[flow.ticket, flow.brief].map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}
              <li className="harness-mobile-decision"><strong>{flow.spec[0]}</strong></li>
              <li className="harness-mobile-branch"><b>{copy.delivery.labels[1]}</b><strong>{flow.spec[1]}</strong></li>
              <li className="harness-mobile-yes"><b>{copy.delivery.labels[0]}</b><strong>{flow.context[0]}</strong><span>{flow.context[1]}</span></li>
              {[flow.plan, flow.build, flow.evidence].map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}
              <li className="harness-mobile-decision"><strong>{flow.pass[0]}</strong></li>
              <li className="harness-mobile-options"><b>{copy.delivery.labels[1]}</b><div><article><strong>{flow.repair[0]}</strong><span>{flow.repair[1]}</span></article><article><strong>{flow.human[0]}</strong><span>{flow.human[1]}</span></article></div></li>
              <li className="harness-mobile-yes"><b>{copy.delivery.labels[0]}</b><strong>{flow.pr[0]}</strong><span>{flow.pr[1]}</span></li>
              {[flow.review, flow.merge].map(([title, detail], index) => <li className={index ? "harness-mobile-merge" : ""} key={title}><strong>{title}</strong><span>{detail}</span></li>)}
            </ol>
          </div>
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
    note: "From eligibility and clinic work to insurer validation, then into an operational record.",
    stages: [
      ["Verify eligibility", "Confirm the configured service and demo membership."],
      ["Clinic workspace", "Capture diagnosis, medicine, and settlement from one verified work item."],
      ["Validate transaction", "Match the visit to an insurer API, validate it, and return the response."],
      ["Complete the record", "Move only a validated transaction into records and reporting."],
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
    validation: "Insurer transaction validation",
    validationTransaction: "Validation transaction",
    matchPayer: "Match payer",
    router: "API router",
    insurers: ["Insurer A API", "Insurer B API", "Insurer C API"],
    matched: "Matched",
    response: "Validation response returns",
    completed: "Completed",
    record: "Operational record",
    recordRows: ["Eligibility confirmed", "Consultation settled", "Transaction validated", "Record available"],
    reporting: "Available to records and reporting",
    transitions: ["Create work item", "Submit transaction", "Validation succeeds"],
    outcome: "Successful verification creates a trackable clinic work item.",
    outcomeNote: "After settlement, the configured insurer API must validate the transaction before it becomes a record.",
    system: "SYSTEM BEHIND THE FLOW",
    nodes: {
      staff: ["Clinic staff", "Verify · work queue · records"],
      portal: ["Next.js portal", "Verified clinic workspace"],
      api: ["NestJS API", "Orchestrates · Redis cache"],
      mysql: ["MySQL", "Visit state"],
      external: ["Insurer validation / payment APIs", "Payer-specific integrations"],
    },
    links: ["uses", "requests", "persists", "validates transaction"],
    stack: "NEXT.JS · TYPESCRIPT · NESTJS · MYSQL · REDIS",
    boundary: "SIMPLIFIED ARCHITECTURE · FICTIONAL DATA · PARTNER RULES OMITTED",
  } : {
    label: "一次已驗證就診",
    note: "從資格驗證、診所工作區與保險交易驗證，到完成後的營運紀錄。",
    stages: [
      ["資格驗證", "確認已設定的服務與示範會員資格。"],
      ["診所工作區", "在同一筆已驗證待辦完成診斷、藥品與結算。"],
      ["驗證保險交易", "配對保險方 API、送出驗證，再將結果回傳。"],
      ["完成營運紀錄", "只有驗證成功的交易才進入紀錄與報表。"],
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
    validation: "保險交易驗證",
    validationTransaction: "Validation transaction",
    matchPayer: "配對保險方",
    router: "API 路由器",
    insurers: ["保險公司 A API", "保險公司 B API", "保險公司 C API"],
    matched: "已配對",
    response: "驗證結果返回",
    completed: "已完成",
    record: "營運紀錄",
    recordRows: ["資格已確認", "診療已結算", "交易驗證成功", "紀錄可查閱"],
    reporting: "可在紀錄與報表中查閱",
    transitions: ["建立待辦", "送出交易", "驗證成功"],
    outcome: "資格驗證成功後，建立可追蹤的診所待辦。",
    outcomeNote: "結算後須由已設定的保險公司 API 驗證交易，成功後才建立營運紀錄。",
    system: "支援流程的系統",
    nodes: {
      staff: ["診所人員", "驗證 · 待辦 · 紀錄"],
      portal: ["Next.js Portal", "已驗證的診所工作區"],
      api: ["NestJS API", "流程協調 · Redis 快取"],
      mysql: ["MySQL", "就診狀態"],
      external: ["保險驗證／付款 API", "依保險方設定整合"],
    },
    links: ["使用", "送出請求", "寫入", "驗證交易"],
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
            {index === 2 && <div className="care-stage-panel care-validation">
              <div className="care-ui-header"><i /><span>{copy.validation}</span></div>
              <div className="care-routing">
                <div className="care-route-request"><small>TX</small><strong>{copy.validationTransaction}</strong></div>
                <div className="care-route-entry"><span>{copy.matchPayer}</span><i /></div>
                <div className="care-route-network">
                  <strong className="care-route-router">{copy.router}</strong>
                  <ul>{copy.insurers.map((insurer, route) => <li className={route === 1 ? "is-selected" : ""} key={insurer}><span>{insurer}</span>{route === 1 && <b>{copy.matched}</b>}</li>)}</ul>
                </div>
                <div className="care-route-return"><i /><span>{copy.response}</span></div>
              </div>
            </div>}
            {index === 3 && <div className="care-stage-panel care-record">
              <div className="care-ui-header"><span>{copy.record}</span></div>
              <div className="care-record-body">
                <span>{copy.completed}</span><h3>{copy.record}</h3>
                <ul>{copy.recordRows.map((row) => <li key={row}>{row}</li>)}</ul>
                <p>{copy.reporting}</p>
              </div>
            </div>}
            {index < 3 && <span className="care-transition"><em>{copy.transitions[index]}</em><i /></span>}
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
