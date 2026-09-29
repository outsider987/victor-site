"""Build the two English one-page resumes with a local Chromium installation."""

from html import escape
from pathlib import Path
from shutil import which
from subprocess import run
from sys import argv
from tempfile import TemporaryDirectory


STYLE = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { color: #202020; font: 9.5pt/1.16 "Liberation Serif", "Times New Roman", serif; }
.page { width: 210mm; min-height: 297mm; padding: 11mm 12mm 10mm; }
header { text-align: center; }
h1 { margin: 0; font-size: 20pt; line-height: 1.05; letter-spacing: .01em; }
.headline { margin: 1mm 0 0; font-size: 10.5pt; font-weight: bold; }
.contacts { margin: 1.2mm 0 0; font-size: 9pt; }
.contacts a { color: #174a8b; text-decoration: none; }
section { margin-top: 2.1mm; }
h2 { margin: 0 0 1mm; border-bottom: .45pt solid #555; font-size: 10.9pt; line-height: 1.1; }
p { margin: 0; }
.job { margin-top: 1.6mm; break-inside: avoid; }
.job-top { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
.job-top strong { font-size: 10.2pt; }
.job-top time { white-space: nowrap; }
.job-role, .job-context { font-style: italic; }
.job-stack { margin-top: .4mm; }
ul { margin: .6mm 0 0; padding-left: 5mm; }
li { margin: 0 0 .55mm; padding-left: .2mm; }
.skill { margin: 0; }
.education { display: flex; justify-content: space-between; gap: 4mm; }
.education span { white-space: nowrap; }
"""


RESUMES = {
    "Victor_Chang_Backend.pdf": {
        "headline": "",
        "profile": (
            "Backend-focused Software Engineer with 7+ years of experience building production platforms, "
            "distributed services, real-time systems, and partner integrations. Experienced with Go, "
            "Node.js/NestJS, gRPC, NATS JetStream, PostgreSQL, Redis, AWS, Docker, and Kubernetes, "
            "with end-to-end ownership across integration, implementation, testing, deployment, and "
            "production troubleshooting. Comfortable collaborating in English with Product Managers "
            "and cross-country engineering teams."
        ),
        "jobs": [
            {
                "company": "Cypherlab Sdn. Bhd.", "date": "Feb 2026 – Aug 2026",
                "role": "Senior Full-Stack Engineer",
                "context": "Real-time sports and e-sports betting backoffice platform",
                "stack": "Go, gRPC, NATS JetStream, WebSocket, PostgreSQL, Redis, ClickHouse, Docker, Kubernetes",
                "bullets": [
                    "Contributed to the greenfield rebuild of <strong>Backoffice V2</strong>, restructuring the legacy system into a domain-oriented modular BFF in Go and integrating sports-manager HTTP APIs with order-book, wallet, and user-service via gRPC.",
                    "Built a real-time event pipeline using <strong>NATS JetStream → in-memory projections → WebSocket</strong>, handling event ordering and stale updates to maintain consistent market and odds state for operator dashboards.",
                    "Separated API serving, ClickHouse ingestion, and settlement processing into independent <strong>statically linked Go binaries</strong> deployed as Kubernetes workloads using a shared distroless Docker image, isolating synchronous API traffic from asynchronous workloads.",
                    "Implemented a shared <strong>Command Gate</strong> for high-risk operator actions, centralizing operation reasons, idempotency, maker-checker validation, and audit trails for consistent and traceable workflows.",
                ],
            },
            {
                "company": "Mediconcen", "date": "Feb 2022 – Jan 2026",
                "role": "Senior Full-Stack Engineer",
                "context": "Hong Kong-based InsurTech delivering digital health insurance solutions",
                "stack": "TypeScript, NestJS, Go, PostgreSQL, Redis, AWS, Docker, Kubernetes",
                "bullets": [
                    "Owned end-to-end backend integrations for clinic and insurer partners, covering <strong>eligibility verification, copayment calculation, claims processing, and third-party insurer APIs</strong> from requirement clarification through production support.",
                    "Moved legacy PHP services to <strong>NestJS</strong> while separating frontend and backend, keeping both sides on TypeScript; introduced ORM data access and DTO validation.",
                    "Introduced <strong>Redis caching</strong> for frequently accessed data, reducing repeated database reads and query load on backend services.",
                    "Migrated <strong>AWS ECS workloads to Kubernetes</strong>, replacing per-service deployment scripts with a shared release process to keep environments consistent; accepted added cluster maintenance.",
                    "Troubleshot production issues across backend services, databases, and third-party APIs, collaborating with Product Managers and cross-country engineering teams to identify root causes and deliver fixes.",
                ],
            },
            {
                "company": "Paradromix", "date": "Jul 2021 – Feb 2022",
                "role": "Frontend Engineer",
                "context": "Government-grade crypto management systems and enterprise web platforms",
                "stack": "TypeScript, Vue, Nuxt (SSR), AWS, Nginx, Docker",
                "bullets": [
                    "Led frontend delivery for SSR web platforms and built a custom CMS for non-technical teams, with focus on maintainable architecture and production deployment.",
                ],
            },
            {
                "company": "ULIC TEK", "date": "Jan 2018 – Jul 2021",
                "role": "Software Engineer",
                "context": "Image processing systems and industrial desktop-web hybrid solutions",
                "stack": "Vue, TypeScript, Angular, C++, MFC, OpenCV",
                "bullets": [
                    "Built image-processing functionality in C++/OpenCV and modernized legacy desktop applications with web-based UI layers.",
                ],
            },
        ],
        "skills": [
            ("Backend", "Go, Node.js, NestJS, gRPC, REST APIs, WebSocket, NATS JetStream"),
            ("Data", "PostgreSQL, MySQL, Redis, ClickHouse, MongoDB"),
            ("Cloud & Architecture", "AWS, Docker, Kubernetes, Microservices, Event-Driven Architecture, CI/CD, Linux, Nginx"),
            ("Frontend & Tools", "React, Vue, Next.js, Nuxt, TypeScript, Git, Jira, Postman | English, Mandarin"),
        ],
    },
    "Victor_Chang_FullStack.pdf": {
        "headline": "SENIOR FULL-STACK ENGINEER | REACT · TYPESCRIPT · GO · REAL-TIME SYSTEMS",
        "profile": (
            "Senior Full-Stack Software Engineer with 7+ years of experience building production web platforms "
            "across frontend, backend, and cloud infrastructure. Strong in React/TypeScript and Go/NestJS, "
            "with experience designing real-time workflows, REST/gRPC APIs, event-driven systems, "
            "PostgreSQL/Redis, AWS, Docker, and Kubernetes. Proven end-to-end ownership from requirements "
            "and architecture through implementation, deployment, and production troubleshooting, "
            "collaborating with Product Managers and distributed engineering teams."
        ),
        "jobs": [
            {
                "company": "Cypherlab Sdn. Bhd.", "date": "Feb 2026 – Aug 2026",
                "role": "Senior Full-Stack Engineer",
                "context": "Real-time sports and e-sports betting backoffice platform",
                "stack": "TypeScript, React, Go, gRPC, NATS JetStream, WebSocket, PostgreSQL, Redis, ClickHouse, Docker, Kubernetes",
                "bullets": [
                    "Built <strong>React and TypeScript backoffice workflows</strong> for live sports and e-sports operations while contributing to a <strong>domain-oriented modular BFF in Go</strong>, integrating sports-manager HTTP APIs with order-book, wallet, and user-service via gRPC.",
                    "Modularized WebSocket message handling and built a <strong>NATS JetStream → in-memory projections → WebSocket</strong> pipeline, handling event ordering and stale updates to maintain consistent real-time market and odds state.",
                    "Delivered operator controls for <strong>market closure and odds overrides</strong> and implemented a shared <strong>Command Gate</strong> for high-risk actions with operation reasons, idempotency, maker-checker validation, and audit trails.",
                    "Separated API serving, ClickHouse ingestion, and settlement processing into independent Go binaries deployed as Kubernetes workloads, isolating synchronous API traffic from asynchronous processing.",
                ],
            },
            {
                "company": "Mediconcen", "date": "Feb 2022 – Jan 2026",
                "role": "Senior Full-Stack Engineer",
                "context": "Hong Kong-based InsurTech delivering digital health insurance solutions",
                "stack": "TypeScript, React, NestJS, Go, PostgreSQL, Redis, AWS, Docker, Kubernetes",
                "bullets": [
                    "Modernized a legacy <strong>React</strong> codebase from class components to functional components with Hooks and implemented <strong>infinite scrolling and list virtualization</strong> for large data-heavy views.",
                    "Owned end-to-end clinic and insurer workflows covering <strong>eligibility verification, copayment calculation, claims processing, and third-party insurer APIs</strong>, from requirement clarification through production support.",
                    "Moved legacy PHP services to <strong>NestJS</strong> while separating frontend and backend, keeping both sides on TypeScript; added ORM data access, DTO validation, and <strong>Redis caching</strong> to reduce repeated database reads.",
                    "Migrated production workloads from <strong>AWS ECS to Kubernetes</strong>, replacing per-service deployment scripts with a shared release process to keep environments consistent; accepted added cluster maintenance.",
                    "Troubleshot production issues across frontend, backend services, databases, and third-party APIs with Product Managers and cross-country engineering teams.",
                ],
            },
            {
                "company": "Paradromix", "date": "Jul 2021 – Feb 2022",
                "role": "Frontend Engineer",
                "context": "Government-grade crypto management systems and enterprise web platforms",
                "stack": "TypeScript, Vue, Nuxt (SSR), AWS, Nginx, Docker",
                "bullets": [
                    "Led frontend delivery for SSR web platforms and built a <strong>custom CMS</strong> for non-technical teams, with focus on SEO, maintainable UI architecture, and production deployment.",
                ],
            },
            {
                "company": "ULIC TEK", "date": "Jan 2018 – Jul 2021",
                "role": "Software Engineer",
                "context": "Image processing systems and industrial desktop-web hybrid solutions",
                "stack": "Vue, TypeScript, Angular, C++, MFC, OpenCV",
                "bullets": [
                    "Built image-processing functionality in <strong>C++/OpenCV</strong> and modernized legacy desktop applications with web-based UI layers for industrial desktop-web hybrid solutions.",
                ],
            },
        ],
        "skills": [
            ("Frontend", "React, TypeScript, JavaScript, Next.js, Vue, Nuxt, SSR, SEO, WebSocket, Component Architecture"),
            ("Backend", "Go, Node.js, NestJS, Express, gRPC, REST APIs, WebSocket, NATS JetStream"),
            ("Data", "PostgreSQL, MySQL, Redis, ClickHouse, MongoDB"),
            ("Cloud & Architecture", "AWS, Docker, Kubernetes, Microservices, Event-Driven Architecture, CI/CD, Linux, Nginx"),
            ("Languages", "English, Mandarin"),
        ],
    },
}


def render_job(job):
    bullets = "".join(f"<li>{bullet}</li>" for bullet in job["bullets"])
    return f"""
    <div class="job">
      <div class="job-top"><strong>{escape(job['company'])}</strong><time>{escape(job['date'])}</time></div>
      <p class="job-role">{escape(job['role'])}</p>
      <p class="job-context">{escape(job['context'])}</p>
      <p class="job-stack"><strong>Tech Stack:</strong> {escape(job['stack'])}</p>
      <ul>{bullets}</ul>
    </div>"""


def render_resume(resume):
    headline = f"<p class=\"headline\">{escape(resume['headline'])}</p>" if resume["headline"] else ""
    jobs = "".join(render_job(job) for job in resume["jobs"])
    skills = "".join(f"<p class=\"skill\"><strong>{escape(name)}:</strong> {escape(value)}</p>" for name, value in resume["skills"])
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Victor Chang Resume</title>
    <style>{STYLE}</style></head><body><main class="page">
      <header><h1>CHANG YAO HSIEN (VICTOR)</h1>{headline}
        <p class="contacts"><a href="mailto:t790219520@gmail.com">t790219520@gmail.com</a> &nbsp;◇&nbsp;
          <a href="https://linkedin.com/in/yao-hsien-chang">linkedin.com/in/yao-hsien-chang</a></p></header>
      <section><h2>PROFILE</h2><p>{escape(resume['profile'])}</p></section>
      <section><h2>EXPERIENCE</h2>{jobs}</section>
      <section><h2>TECHNICAL SKILLS</h2>{skills}</section>
      <section><h2>EDUCATION</h2><p class="education"><span><strong>Bachelor of Chemistry</strong>, Chia Nan University of Pharmacy and Science</span><span>Graduated 2017</span></p></section>
    </main></body></html>"""


def main():
    browser = which("google-chrome") or which("chromium-browser")
    if not browser:
        raise SystemExit("Chromium or Google Chrome is required to print the resumes")
    output_dir = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parents[1] / "public/resume"
    output_dir.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory() as temporary:
        for filename, resume in RESUMES.items():
            html_file = Path(temporary) / filename.replace(".pdf", ".html")
            html_file.write_text(render_resume(resume), encoding="utf-8")
            output_file = output_dir / filename
            run([browser, "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
                 f"--print-to-pdf={output_file}", html_file.as_uri()], check=True, capture_output=True)
            print(output_file)


if __name__ == "__main__":
    main()
