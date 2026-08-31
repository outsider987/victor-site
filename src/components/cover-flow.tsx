"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { about, homeIntro, homeSlides, links, projects, type Project } from "@/data/projects";
import { CaseStudy } from "./case-study";
import { useLanguage } from "./language";
import { ThreeDeck } from "./three-deck";

function FallbackDeck({ active, ready }: { active: number; ready: boolean }) {
  return (
    <div className={`fallback-deck ${active === 0 ? "intro-active" : ""} ${ready ? "webgl-ready" : ""}`} aria-hidden="true">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="fallback-card"
          data-offset={Math.max(-1, Math.min(3, index - (active - 1)))}
        >
          <Image src={project.visual} alt="" width={1440} height={900} priority={index === 0} />
        </div>
      ))}
    </div>
  );
}

function FocusRail({ active, onOpen, onSelect }: { active: number; onOpen: () => void; onSelect: (index: number) => void }) {
  const { lang } = useLanguage();
  const project = active > 0 ? projects[active - 1] : undefined;
  const slideNames = [homeIntro.name[lang], ...projects.map((item) => item.name)];

  return (
    <aside className={`focus-rail${active === 0 ? " intro-active" : ""}`}>
      <p className="focus-mode"><b>B —</b> FULL STACK</p>
      <Link href="/" className="focus-identity" aria-label="Victor Chang — home">
        <strong>VICTOR<br />CHANG</strong>
        <span>{lang === "en" ? "FULL-STACK ENGINEER" : "全端工程師"}</span>
      </Link>

      <div className="focus-project" aria-live="polite">
        <p className="project-kicker"><span>{project?.number ?? homeIntro.number}</span> / 04</p>
        <h1>{project?.name ?? homeIntro.name[lang]}</h1>
        {project ? <>
          <dl>
            <div><dt>FOCUS</dt><dd>{project.focus[lang].join(" · ")}</dd></div>
            <div><dt>STACK</dt><dd>{project.stack.slice(0, 5).join(" · ")}</dd></div>
          </dl>
          <button className="project-cta" type="button" onClick={onOpen}>
            {lang === "en" ? "View project" : "查看專案"}<span aria-hidden="true">↗</span>
          </button>
        </> : <>
          <button className="project-cta" type="button" onClick={() => onSelect(1)}>
            {lang === "en" ? "View work" : "查看作品"}<span aria-hidden="true">↓</span>
          </button>
        </>}
      </div>

      <nav className="focus-controls" data-active={active} aria-label={lang === "en" ? "Project slides" : "專案頁面"}>
        <div className="focus-meter">
          {slideNames.map((name, index) => (
            <button
              key={name}
              type="button"
              className={index === active ? "active" : ""}
              onClick={() => onSelect(index)}
              aria-label={`${String(index).padStart(2, "0")}: ${name}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
        <span>{lang === "en" ? "SCROLL TO ADVANCE" : "向下捲動切換"}</span>
      </nav>
    </aside>
  );
}

function About() {
  const { lang } = useLanguage();
  return (
    <div className="about-content">
      <p className="section-label">05 — {about.title[lang]}</p>
      <div className="about-grid">
        <p className="about-bio">{about.bio[lang]}</p>
        <div className="about-contact">
          <p>{about.location[lang]}</p>
          <p>{about.availability[lang]}</p>
          <div className="about-links">
            <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={links.email}>Email ↗</a>
            <Link href="/resume" target="_blank">{lang === "en" ? "Resume ↗" : "履歷 ↗"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroStage({ hidden }: { hidden: boolean }) {
  const { lang } = useLanguage();
  const capabilities = lang === "en"
    ? ["REAL-TIME MESSAGING · WEBSOCKET · NATS", "ADMIN & OPERATIONS SYSTEMS", "MICROSERVICES · SYSTEM DESIGN"]
    : ["即時訊息開發 · WEBSOCKET · NATS", "大型後台與營運管理系統", "微服務架構 · 系統設計"];
  return (
    <div className="intro-stage" aria-hidden={hidden || undefined}>
      <div className="intro-profile">
        <div className="intro-avatar-orbit">
          <Image className="intro-avatar" src={homeIntro.visual} alt={homeIntro.visualAlt[lang]} width={160} height={160} priority />
        </div>
        <div className="intro-copy">
          <span>00 — {lang === "en" ? "PROFILE" : "個人簡介"}</span>
          <h2>{lang === "en" ? "FULL-STACK ENGINEER" : "全端工程師"}</h2>
          <p>{homeIntro.summary[lang]}</p>
          <div className="intro-capability">
            <strong>{lang === "en" ? "EXPERIENCE" : "經驗領域"}</strong>
            <div className="intro-capability-window">
              <div className="intro-capability-track">
                {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
                <span aria-hidden="true">{capabilities[0]}</span>
              </div>
            </div>
          </div>
          <ul>
            <li>{about.location[lang]}</li>
            <li>{about.availability[lang]}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CoverFlow() {
  const { lang } = useLanguage();
  const scroller = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [modalProject, setModalProject] = useState<Project>();
  const [webglReady, setWebglReady] = useState(false);
  const markReady = useCallback(() => setWebglReady(true), []);

  const select = (index: number) => sections.current[Math.max(0, Math.min(homeSlides.length, index))]?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
  const openProject = (project: Project) => {
    setModalProject(project);
    dialog.current?.showModal();
  };
  const closeProject = () => dialog.current?.close();

  return (
    <div className="coverflow-shell">
      <FallbackDeck active={active} ready={webglReady} />
      <ThreeDeck scrollerRef={scroller} onActiveChange={setActive} onReady={markReady} />
      <IntroStage hidden={active > 0} />
      {active < homeSlides.length && <FocusRail active={active} onOpen={() => active > 0 && openProject(projects[active - 1])} onSelect={select} />}

      <main id="main" ref={scroller} className="coverflow-scroll">
        {active > 0 && active < homeSlides.length && <div className="active-hit-anchor">
          <button className="active-hit" type="button" onClick={() => openProject(projects[active - 1])} aria-label={lang === "en" ? `Open ${projects[active - 1].name} project` : `開啟 ${projects[active - 1].name} 專案`} />
        </div>}
        <section ref={(node) => { sections.current[0] = node; }} id="intro" className="coverflow-section" aria-label="00 — About Victor Chang" />
        {projects.map((project, index) => (
          <section
            key={project.slug}
            ref={(node) => { sections.current[index + 1] = node; }}
            id={project.slug}
            className="coverflow-section"
            aria-label={`${project.number} — ${project.name}`}
          />
        ))}
        <section ref={(node) => { sections.current[homeSlides.length] = node; }} className="coverflow-section about-section" id="about" aria-label="About and contact">
          <About />
        </section>
      </main>

      <dialog ref={dialog} className="project-dialog" onClose={() => setModalProject(undefined)} onClick={(event) => event.target === event.currentTarget && closeProject()}>
        {modalProject && <CaseStudy project={modalProject} modal onClose={closeProject} />}
      </dialog>
    </div>
  );
}
