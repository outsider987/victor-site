import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, Row, SectionTitle, EMAIL } from "@/components/site";
import { ClaimsArchDiagram, OcrSketch } from "@/components/case-diagrams";
import { altFor, isLocale, type Locale } from "@/i18n";

const meta = {
  en: {
    title: "Case study: insurance claims platform — Victor Chang",
    description:
      "Architecture and engineering decisions behind a health-insurance claims platform used daily by 150+ clinics across Hong Kong: NestJS microservices, OCR automation, insurer integrations.",
  },
  zh: {
    title: "Case study：保險理賠平台 — Victor Chang",
    description:
      "香港 150+ 診所每日使用的健保理賠平台：NestJS 微服務、OCR 自動化、13 家保險公司系統整合的架構與工程決策。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/work/claims-platform") };
}

export default async function ClaimsPlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";

  const t =
    l === "en"
      ? {
          crumb: "case study",
          h1: "Claims processing that clinics run their day on.",
          metaLine: (
            <>
              2022 – 2026 · health-insurance claims platform, Hong Kong · senior
              full-stack engineer, technical lead
              <br />
              TypeScript · React · NestJS · PostgreSQL · Redis · AWS (EC2, ECS, S3) · Docker
            </>
          ),
          intro1: (
            <>
              When a patient walks out of a clinic, someone has to verify their
              policy, calculate the copayment, file the claim, and get the
              insurer to pay — for years, largely by hand. This platform put
              that flow into software used daily by <strong>150+ clinics</strong>,
              integrated with <strong>13 insurer systems</strong> across Hong
              Kong. I spent four years on it as senior engineer and technical
              lead, bridging teams in Hong Kong, Taiwan, and Vietnam.
            </>
          ),
          intro2: (
            <>
              The first generation was a PHP-era codebase with frontend and
              backend tangled together — every change rippled somewhere
              unexpected. The v2 rewrite untangled it, and it&apos;s the part
              of this work I&apos;m proudest of.
            </>
          ),
          archTitle: "Architecture",
          archCaption:
            "De-identified overview. A React clinic portal talks to a NestJS BFF, which orchestrates microservices for eligibility, copayment, OCR, and insurer API integrations over PostgreSQL and Redis.",
          problemsTitle: "The interesting problems",
          problems: [
            {
              meta: "the v2 rewrite",
              text: "I led the complete frontend rebuild in React: SWR-style caching with request deduplication, and one canonical API-access layer so every endpoint had a single owner and a single shape — replacing a coupled PHP frontend where any change could ripple anywhere. Overall system performance improved 150% on the flows clinics actually wait on.",
            },
            {
              meta: "ci/cd",
              text: "I introduced the team's CI/CD pipeline — from manual, nervous deploys to build-test-deploy on merge. Releases stopped being events; the v2 rewrite would not have shipped at its pace without it.",
            },
            {
              meta: "ocr pipeline",
              text: "Claims arrive as paper — receipts, forms, referral letters — and I had never built AI document recognition before this project. I built the end-to-end orchestration anyway: extraction, classification, validation, confidence-based routing, with spreadsheet-ready structured rows coming out the other side. Manual workload and operational delays dropped by 40%.",
            },
            {
              meta: "integrations",
              text: "Thirteen insurer systems, each speaking a different dialect. The adapter services normalized eligibility checks and claim submission across all of them, so a new integration was a bounded project, not a re-architecture.",
            },
            {
              meta: "distributed team",
              text: "Engineering spanned Hong Kong, Taiwan, and Vietnam. As the cross-country bridge I drove the technical standards and review practices that let three offices ship one product — written specs over meetings, by necessity first and conviction later.",
            },
          ],
          sketchTitle: "The pipeline, abstracted",
          sketchCaption:
            "Stylized sketch — real documents and UI stay confidential. Paper in, structured and validated claim data out; humans only where judgment is needed.",
          numbersTitle: "In numbers",
          numbers: [
            {
              meta: "150+ clinics",
              text: "using the platform daily as their operational system of record for claim processing.",
            },
            {
              meta: "13 insurers",
              text: "integrated through normalized adapter services — eligibility, submission, settlement.",
            },
            {
              meta: "+150% / −40%",
              text: "system performance improvement; reduction in manual workload and operational delays from the automated OCR pipeline.",
            },
            {
              meta: "4 years",
              text: "of ownership across system design, delivery, and a three-country engineering organization.",
            },
          ],
          note: "Company details and real documents withheld. Questions welcome —",
        }
      : {
          crumb: "case study",
          h1: "診所每天靠它運作的理賠系統。",
          metaLine: (
            <>
              2022 – 2026 · 香港健康保險理賠平台 · 資深全端工程師、技術主導
              <br />
              TypeScript · React · NestJS · PostgreSQL · Redis · AWS (EC2, ECS, S3) · Docker
            </>
          ),
          intro1: (
            <>
              病人走出診所之後，有人得驗保單、算共付額、送理賠、追著保險公司付款——多年來大半靠人工。這個平台把整條流程放進軟體，成為香港{" "}
              <strong>150+ 家診所</strong>每日使用、串接{" "}
              <strong>13 家保險公司系統</strong>的日常作業核心。我在這裡做了四年資深工程師與技術主導，串接香港、台灣、越南三地團隊。
            </>
          ),
          intro2: (
            <>
              第一代是 PHP
              時期的舊碼，前後端糾纏在一起——改一個地方，別處就意外波動。v2
              重寫把它徹底解開，也是這段工作裡我最自豪的部分。
            </>
          ),
          archTitle: "架構",
          archCaption:
            "去識別化總覽。React 診所入口對接 NestJS BFF，由它調度資格驗證、共付額、OCR 與保險公司 API 整合等微服務，底層為 PostgreSQL 與 Redis。",
          problemsTitle: "有意思的難題",
          problems: [
            {
              meta: "v2 重寫",
              text: "我主導 React 前端全面重建：SWR 式快取加請求去重，以及唯一的 API 存取層——每個端點只有一個擁有者、一種形狀——取代了「改哪裡都可能波及全站」的 PHP 舊前端。診所實際等待的流程，整體效能提升 150%。",
            },
            {
              meta: "ci/cd",
              text: "我導入了團隊的 CI/CD 管線——從手動、提心吊膽的部署，變成 merge 即 build-test-deploy。發版不再是大事；沒有它，v2 重寫不可能用那個速度出貨。",
            },
            {
              meta: "ocr 管線",
              text: "理賠以紙本進來——收據、表單、轉診信——而我在這個專案之前沒做過 AI 文件辨識。我還是把端到端的調度做了出來：擷取、分類、驗證、依信心值分流，出口是可直接使用的結構化表格資料。人工作業與作業延遲下降 40%。",
            },
            {
              meta: "系統整合",
              text: "13 家保險公司系統，每一家講不同方言。轉接層服務把資格查核與理賠送件全部正規化，新整合從此是一個有邊界的專案，而不是一次重構。",
            },
            {
              meta: "分散式團隊",
              text: "工程橫跨香港、台灣、越南。作為三地之間的橋樑，我推動技術標準與 review 慣例，讓三個辦公室出同一個產品——文件優先於會議，先是不得不，後來是信念。",
            },
          ],
          sketchTitle: "管線（抽象版）",
          sketchCaption:
            "風格化線稿——真實文件與介面均保密。紙本進、結構化且驗證過的理賠資料出；只有需要人為判斷的地方才交給人。",
          numbersTitle: "數字",
          numbers: [
            {
              meta: "150+ 診所",
              text: "每日使用，作為理賠作業的營運系統。",
            },
            {
              meta: "13 家保險公司",
              text: "經正規化的轉接層服務整合——資格、送件、結算。",
            },
            {
              meta: "+150% / −40%",
              text: "系統效能提升；自動化 OCR 管線帶來的人工作業與延遲下降。",
            },
            {
              meta: "4 年",
              text: "的持續擁有權：系統設計、交付，與一個三國工程組織。",
            },
          ],
          note: "公司細節與真實文件均已隱去。歡迎提問——",
        };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/work/claims-platform" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href={`/${l}/work`} className="hover:text-red-ink">work</Link> / {t.crumb}
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            {t.h1}
          </h1>
          <p className="tnum mt-4 font-mono text-xs leading-6 text-ink-3">{t.metaLine}</p>
        </section>

        <section className="mt-10 max-w-xl space-y-4 leading-relaxed">
          <p>{t.intro1}</p>
          <p className="text-ink-2">{t.intro2}</p>
        </section>

        <section>
          <SectionTitle>{t.archTitle}</SectionTitle>
          <figure className="border-y border-rule py-6">
            <ClaimsArchDiagram />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              {t.archCaption}
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>{t.problemsTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.problems.map((p) => (
              <Row key={p.meta} meta={p.meta}>
                <p className="text-[15.5px] leading-relaxed">{p.text}</p>
              </Row>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t.sketchTitle}</SectionTitle>
          <figure className="border-y border-rule py-6">
            <OcrSketch />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              {t.sketchCaption}
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>{t.numbersTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.numbers.map((n) => (
              <Row key={n.meta} meta={n.meta}>
                <p className="text-[15.5px] leading-relaxed">{n.text}</p>
              </Row>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">
            {t.note}{" "}
            <a className="text-red-ink hover:underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer locale={l} />
    </div>
  );
}
