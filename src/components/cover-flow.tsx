"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

function FocusRail({ active, autoPlay, autoPlayDisabled, onAutoPlayToggle, onOpen, onSelect }: { active: number; autoPlay: boolean; autoPlayDisabled: boolean; onAutoPlayToggle: () => void; onOpen: () => void; onSelect: (index: number) => void }) {
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
        <button className="focus-autoplay" type="button" aria-pressed={autoPlay} disabled={autoPlayDisabled} onClick={onAutoPlayToggle}>
          {lang === "en" ? `AUTO ROTATE · ${autoPlay ? "ON" : "OFF"}` : `自動輪播 · ${autoPlay ? "開" : "關"}`}
        </button>
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
            <a href={links.resume} download>{lang === "en" ? "Resume ↓" : "履歷 ↓"}</a>
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
          <div className="intro-links" aria-label={lang === "en" ? "Contact links" : "聯絡連結"}>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.37 3.26a2.13 2.13 0 1 1-4.26 0 2.13 2.13 0 0 1 4.26 0ZM1.5 8.15h3.74V20H1.5V8.15Zm6.08 0h3.58v1.62h.05c.5-.94 1.72-1.93 3.54-1.93C18.53 7.84 19.2 10.3 19.2 13.5V20h-3.73v-5.76c0-1.37-.03-3.13-1.9-3.13-1.9 0-2.2 1.5-2.2 3.03V20H7.63V8.15Z" /></svg>
            </a>
            <a href={links.email} aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17v-13Zm1.8 1.5L12 12.02 18.7 7H5.3Zm13.7 10V8.88L12 14.12 5 8.88V17h14Z" /></svg>
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.1.7-.22.7-.5v-1.97c-2.85.62-3.45-1.21-3.45-1.21-.47-1.19-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.05 1.57 1.05.91 1.56 2.4 1.11 2.98.85.09-.66.36-1.11.65-1.36-2.28-.26-4.68-1.14-4.68-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.46-1.3.1-2.7 0 0 .86-.28 2.8 1.05a9.73 9.73 0 0 1 5.1 0c1.94-1.33 2.8-1.05 2.8-1.05.56 1.4.2 2.44.1 2.7.65.72 1.05 1.63 1.05 2.75 0 3.93-2.4 4.8-4.69 5.06.37.32.7.95.7 1.92v2.85c0 .28.18.6.7.5A10.2 10.2 0 0 0 12 1.8Z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoverFlow() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const scroller = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [modalProject, setModalProject] = useState<Project>();
  const [webglReady, setWebglReady] = useState(false);
  const markReady = useCallback(() => setWebglReady(true), []);

  const select = useCallback((index: number) => sections.current[Math.max(0, Math.min(homeSlides.length, index))]?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  }), []);
  useEffect(() => {
    const pause = (event: Event) => {
      if (!(event.target instanceof Element && event.target.closest(".focus-autoplay"))) setAutoPlay(false);
    };
    window.addEventListener("pointerdown", pause);
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchstart", pause, { passive: true });
    window.addEventListener("keydown", pause);
    return () => {
      window.removeEventListener("pointerdown", pause);
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchstart", pause);
      window.removeEventListener("keydown", pause);
    };
  }, []);
  useEffect(() => {
    if (!autoPlay || reduceMotion || !webglReady || modalProject || active > projects.length) return;
    let timer = 0;
    const queue = () => { timer = window.setTimeout(() => document.hidden ? queue() : select(active === projects.length ? 1 : active + 1), 12_000); };
    queue();
    return () => window.clearTimeout(timer);
  }, [active, autoPlay, modalProject, reduceMotion, select, webglReady]);
  const selectManually = (index: number) => {
    setAutoPlay(false);
    select(index);
  };
  const openProject = (project: Project) => {
    setAutoPlay(false);
    setModalProject(project);
    dialog.current?.showModal();
  };
  const closeProject = () => dialog.current?.close();

  return (
    <div className="coverflow-shell">
      <FallbackDeck active={active} ready={webglReady} />
      <ThreeDeck scrollerRef={scroller} onActiveChange={setActive} onReady={markReady} />
      <IntroStage hidden={active > 0} />
      {active < homeSlides.length && <FocusRail active={active} autoPlay={autoPlay && !reduceMotion} autoPlayDisabled={Boolean(reduceMotion)} onAutoPlayToggle={() => setAutoPlay((playing) => !playing)} onOpen={() => active > 0 && openProject(projects[active - 1])} onSelect={selectManually} />}

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
