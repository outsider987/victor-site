// Renders the page body from content at build time, so every word ships as real HTML.
// Both languages are emitted; CSS shows the active one and hides the other from assistive tech.
import { aiMethod, contact, experience, hero, person, site, skills, stations, works, type L, type Work } from './content.ts';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const t = (l: L) => `<span class="t" lang="en">${esc(l.en)}</span><span class="t" lang="zh-Hant">${esc(l.zh)}</span>`;
const attr = (name: string, l: L) => `${name}="${esc(l.en)}" data-${name}-en="${esc(l.en)}" data-${name}-zh="${esc(l.zh)}"`;

const icon = {
  arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  out: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/></svg>',
  mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
  doc: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
  expand: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  linkedin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.5v.5M10 19v-6a3 3 0 0 1 6 0v6M10 10v9"/></svg>',
  github: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.4 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.4 0C6.1 1.3 5 1.6 5 1.6a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 8.6c0 5.1 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V21"/></svg>',
};

function stationOpen(id: string, kind: string, index: number, labelled: string) {
  return `<section class="station station--${kind}" id="${id}" data-kind="${kind}" data-index="${index}" aria-labelledby="${labelled}">
  <span class="station__snap" aria-hidden="true"></span>
  <div class="station__pin">`;
}
const stationClose = '</div></section>';

function introSection() {
  return `${stationOpen('hello', 'intro', 0, 'hello-title')}
    <article class="tag tag--hero">
      <span class="tag__pin" aria-hidden="true"></span>
      <h1 class="tag__title tag__title--hero" id="hello-title">${esc(person.name)}</h1>
      <p class="tag__role">${t(hero.role)}</p>
      <p class="tag__promise">${t(hero.promise)}</p>
      <p class="tag__story">${t(hero.sub)}</p>
      <p class="tag__note">${t(hero.note)}</p>
      <div class="tag__actions">
        <a class="btn btn--primary" href="#${works[0].id}">${t(hero.ctaWork)}${icon.arrow}</a>
        <a class="btn btn--secondary" href="#contact">${t(hero.ctaContact)}</a>
        <a class="btn btn--link" href="${contact.resumes[0].file}" download>${icon.doc}${t(hero.ctaResume)}</a>
      </div>
    </article>
    <p class="scroll-cue" aria-hidden="true"><span class="scroll-cue__dot"></span>${t(site.scroll)}</p>
  ${stationClose}`;
}

function skillsSection() {
  const lanes = skills.lanes.map((lane) => `
        <li class="lane lane--${lane.id}">
          <h3 class="lane__title">${t(lane.title)}</h3>
          <p class="lane__line">${t(lane.line)}</p>
          <p class="lane__tags">${lane.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</p>
        </li>`).join('');
  return `${stationOpen('skills', 'skills', 1, 'skills-title')}
    <article class="tag tag--skills">
      <span class="tag__pin" aria-hidden="true"></span>
      <h2 class="tag__title" id="skills-title">${t(skills.title)}</h2>
      <p class="tag__lede">${t(skills.lede)}</p>
      <ul class="lanes">${lanes}
      </ul>
    </article>
  ${stationClose}`;
}

function workSection(w: Work, index: number) {
  const beats = w.beats.map((b) => `<li>${t(b)}</li>`).join('');
  const chips = w.stack.map((s) => `<li class="chip">${esc(s)}</li>`).join('');
  const shots = w.shots.map((s, i) => `<img class="shot" src="${s.src}" ${attr('alt', s.alt)} width="1600" height="1000" loading="lazy" decoding="async" data-shot="${i}">`).join('');
  const name = w.nameZh ? `${esc(w.name)} <span class="tag__alias" lang="zh-Hant">${esc(w.nameZh)}</span>` : esc(w.name);
  const link = w.link ? `<a class="btn btn--primary" href="${w.link.href}" target="_blank" rel="noopener">${t(w.link.label)}${icon.out}</a>` : '';
  return `${stationOpen(w.id, 'work', index, `${w.id}-title`)}
    <article class="tag tag--work" data-work="${w.id}">
      <span class="tag__pin" aria-hidden="true"></span>
      <h2 class="tag__title" id="${w.id}-title">${name}</h2>
      <p class="tag__sub">${t(w.sub)}</p>
      <p class="tag__meta">${t(w.meta)}</p>
      <p class="tag__story">${t(w.story)}</p>
      <ul class="tag__beats">${beats}</ul>
      <ul class="tag__stack" ${attr('aria-label', { en: 'Stack', zh: '技術' })}>${chips}</ul>
      <div class="tag__actions">
        ${link}
        <button class="btn btn--secondary" type="button" data-open-shots="${w.id}">${icon.expand}<span class="t" lang="en">View the screens</span><span class="t" lang="zh-Hant">放大看畫面</span></button>
      </div>
      ${w.note ? `<p class="tag__note">${t(w.note)}</p>` : ''}
      <div class="tag__shots">${shots}</div>
    </article>
  ${stationClose}`;
}

function aiSection(index: number) {
  const steps = aiMethod.steps.map((s) => `
        <li class="step">
          <h3 class="step__title">${t(s.title)}</h3>
          <p class="step__body">${t(s.body)}</p>
          <p class="step__evidence">${esc(s.evidence)}</p>
        </li>`).join('');
  return `${stationOpen('ai', 'ai', index, 'ai-title')}
    <article class="tag tag--ai">
      <span class="tag__pin" aria-hidden="true"></span>
      <h2 class="tag__title" id="ai-title">${t(aiMethod.title)}</h2>
      <p class="tag__lede">${t(aiMethod.lede)}</p>
      <ol class="steps">${steps}
      </ol>
      <p class="tag__note">${t(aiMethod.footnote)}</p>
    </article>
  ${stationClose}`;
}

function experienceSection(index: number) {
  const items = experience.items.map((e) => `
        <li class="road__item">
          <p class="road__when">${esc(e.when)}</p>
          <h3 class="road__org">${esc(e.org)}</h3>
          <p class="road__role">${t(e.role)}</p>
          <p class="road__what">${t(e.what)}</p>
        </li>`).join('');
  return `${stationOpen('experience', 'experience', index, 'experience-title')}
    <article class="tag tag--experience">
      <span class="tag__pin" aria-hidden="true"></span>
      <h2 class="tag__title" id="experience-title">${t(experience.title)}</h2>
      <ol class="road">${items}
      </ol>
      <p class="tag__meta">${t(experience.education)}</p>
      <p class="tag__meta">${t(experience.languages)}</p>
    </article>
  ${stationClose}`;
}

function contactSection(index: number) {
  const resumes = contact.resumes.map((r) => `<a class="btn btn--secondary" href="${r.file}" download>${icon.doc}${t(r.label)}</a>`).join('');
  return `${stationOpen('contact', 'contact', index, 'contact-title')}
    <article class="tag tag--contact">
      <span class="tag__pin" aria-hidden="true"></span>
      <h2 class="tag__title" id="contact-title">${t(contact.title)}</h2>
      <p class="tag__lede">${t(contact.lede)}</p>
      <div class="contact">
        <section class="contact__col" aria-labelledby="c-hiring">
          <h3 id="c-hiring">${t(contact.hiring)}</h3>
          <p>${t(contact.hiringLine)}</p>
          <div class="tag__actions tag__actions--stack">${resumes}</div>
        </section>
        <section class="contact__col" aria-labelledby="c-project">
          <h3 id="c-project">${t(contact.project)}</h3>
          <p>${t(contact.projectLine)}</p>
          <div class="tag__actions tag__actions--stack">
            <a class="btn btn--primary" href="mailto:${person.email}">${icon.mail}${t(contact.email)}</a>
            <a class="btn btn--secondary" href="${person.linkedin}" target="_blank" rel="noopener">${icon.linkedin}LinkedIn</a>
            <a class="btn btn--secondary" href="${person.github}" target="_blank" rel="noopener">${icon.github}GitHub</a>
          </div>
        </section>
      </div>
      <p class="tag__email"><a href="mailto:${person.email}">${esc(person.email)}</a></p>
      <p class="tag__note">${t(site.footer)}</p>
    </article>
  ${stationClose}`;
}

export function renderBody() {
  const firstWork = 2;
  const sections = [
    introSection(),
    skillsSection(),
    ...works.map((w, i) => workSection(w, firstWork + i)),
    aiSection(firstWork + works.length),
    experienceSection(firstWork + works.length + 1),
    contactSection(firstWork + works.length + 2),
  ].join('\n');
  const beads = stations.map((s, i) => `<li><a class="bead${s.kind === 'work' ? ' bead--work' : ''}" href="#${s.id}" data-i="${i}" style="--bead:${s.bead}"><span class="bead__dot" aria-hidden="true"></span><span class="bead__label">${t(s.label)}</span></a></li>`).join('');
  return `<a class="skip" href="#hello">${t(site.skip)}</a>
<header class="topbar">
  <a class="topbar__brand" href="#hello">${esc(person.name)}</a>
  <nav class="topbar__nav" ${attr('aria-label', { en: 'Main', zh: '主要' })}>
    <a href="#${works[0].id}">${t(site.nav.work)}</a>
    <a href="#ai">${t(site.nav.ai)}</a>
    <a href="#experience">${t(site.nav.experience)}</a>
    <a href="#contact">${t(site.nav.contact)}</a>
  </nav>
  <div class="lang" role="group" ${attr('aria-label', { en: 'Language', zh: '語言' })}>
    <button type="button" data-lang="en" aria-pressed="true">EN</button>
    <button type="button" data-lang="zh" aria-pressed="false" lang="zh-Hant">中文</button>
  </div>
</header>
<canvas class="world" id="world" aria-hidden="true"></canvas>
<div class="loader" id="loader" role="status">
  <div class="loader__card">
    <span class="tag__pin loader__pin" aria-hidden="true"></span>
    <span class="loader__spinner" aria-hidden="true"><span class="loader__ball"></span><span class="loader__ball"></span><span class="loader__ball"></span><span class="loader__ball"></span></span>
    <span class="loader__text">${t(site.loading)}</span>
  </div>
</div>
<main id="content">
${sections}
</main>
<nav class="beads" ${attr('aria-label', site.nav.stations)}><ol>${beads}</ol></nav>
<dialog class="lightbox" id="lightbox" ${attr('aria-label', { en: 'Screens', zh: '畫面' })}>
  <div class="lightbox__frame"><img class="lightbox__img" src="${works[0].shots[0].src}" ${attr('alt', works[0].shots[0].alt)} width="1600" height="1000" loading="lazy" decoding="async"><p class="lightbox__cap"></p></div>
  <div class="lightbox__bar">
    <button type="button" class="btn btn--secondary" data-lb="prev"><span class="t" lang="en">Previous</span><span class="t" lang="zh-Hant">上一張</span></button>
    <span class="lightbox__count" aria-live="polite"></span>
    <button type="button" class="btn btn--secondary" data-lb="next"><span class="t" lang="en">Next</span><span class="t" lang="zh-Hant">下一張</span></button>
    <button type="button" class="btn btn--primary" data-lb="close"><span class="t" lang="en">Close</span><span class="t" lang="zh-Hant">關閉</span></button>
  </div>
</dialog>`;
}

export function renderHead(base: string) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: 'Senior Full-Stack Engineer',
    email: `mailto:${person.email}`,
    url: 'https://outsider987.github.io/victor-site/',
    sameAs: [person.linkedin, person.github],
    address: { '@type': 'PostalAddress', addressCountry: 'TW' },
  };
  return `<title>${esc(site.title.en)}</title>
    <meta name="description" content="${esc(site.description.en)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(site.title.en)}">
    <meta property="og:description" content="${esc(site.description.en)}">
    <link rel="preload" as="image" href="${base}ui/first-scene-desktop.jpg" media="(min-width: 761px)" fetchpriority="high">
    <link rel="preload" as="image" href="${base}ui/first-scene-mobile.jpg" media="(max-width: 760px)" fetchpriority="high">
    <script>
      // Start the clay models downloading now, but only where they can be drawn.
      if ('WebGL2RenderingContext' in window) ['props', 'victor'].forEach(function (m) {
        var l = document.createElement('link');
        l.rel = 'preload'; l.as = 'fetch'; l.crossOrigin = 'anonymous'; l.href = '${base}models/' + m + '.glb';
        document.head.appendChild(l);
      });
    </script>
    <link rel="canonical" href="https://outsider987.github.io${base}">
    <meta property="og:url" content="https://outsider987.github.io${base}">
    <meta property="og:image" content="https://outsider987.github.io${base}og.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(site.ogAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}
