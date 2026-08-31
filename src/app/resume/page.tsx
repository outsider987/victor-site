"use client";

import { projects, links } from "@/data/projects";
import { useLanguage } from "@/components/language";

export default function ResumePage() {
  const { lang } = useLanguage();
  return (
    <main id="main" className="resume-page">
      <header className="resume-intro">
        <p className="section-index">{lang === "en" ? "RESUME" : "履歷"}</p>
        <h1>Victor Chang</h1>
        <p>{lang === "en" ? "Software engineer focused on clear product interfaces, real-time services, and data-heavy operational systems." : "專注於清楚產品介面、即時服務與資料密集型營運系統的軟體工程師。"}</p>
        <div><span>Taiwan · UTC+8</span><a href={links.email}>t790219520@gmail.com</a><a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </header>
      <section className="resume-section">
        <h2>{lang === "en" ? "Selected engineering work" : "精選工程經驗"}</h2>
        {projects.map((project) => (
          <article key={project.slug}>
            <p>{project.number}</p>
            <div><h3>{project.name}</h3><strong>{project.category[lang]}</strong><p>{project.summary[lang]}</p><small>{project.fullStack.join(" · ")}</small></div>
          </article>
        ))}
      </section>
      <section className="resume-section resume-capabilities">
        <h2>{lang === "en" ? "Capabilities" : "能力範圍"}</h2>
        <p>{lang === "en" ? "Frontend systems · TypeScript · React / Vue · Go and Node services · Real-time state · Data-intensive interfaces · Cloud-native delivery · Product-oriented engineering" : "前端系統 · TypeScript · React / Vue · Go 與 Node 服務 · 即時狀態 · 資料密集介面 · 雲原生交付 · 產品導向工程"}</p>
      </section>
      <footer className="resume-footer">{lang === "en" ? "References and a detailed employment history are available on request." : "完整工作經歷與推薦人資料可來信索取。"}</footer>
    </main>
  );
}
