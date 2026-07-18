# victorchang.vercel.app

Personal site of **Victor Chang** — senior full-stack engineer focused on
real-time, real-money systems (InsurTech, trading, crypto).

Two audiences, one site:

- **`/work`** — case studies and working style, for hiring teams.
- **`/services`** — freelance offerings and process, for clients (EN / 中文).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static prerender)
- TypeScript, Tailwind CSS v4
- Deployed on Vercel

## Architecture notes

- All pages are statically prerendered — no client JS beyond Next defaults;
  the content doesn't need it.
- Design tokens live in `src/app/globals.css` as CSS custom properties mapped
  into Tailwind via `@theme inline`.
- Shared UI (`Nav`, `Footer`, `Chip`, `Eyebrow`) in `src/components/site.tsx` —
  deliberately one file until it earns splitting.

De-identified live demos of the systems described in `/work` are being built
as separate public repos and will be linked here.

## Run locally

```bash
npm install
npm run dev
```

## License

Content © Victor Chang. Code MIT.
