import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n";
import "../globals.css";

const grotesk = Bricolage_Grotesque({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700"],
  preload: false,
});

const meta = {
  en: {
    title: "Victor Chang — Senior Full-Stack Engineer (Remote, UTC+8)",
    description:
      "I build real-time, real-money systems. 7+ years shipping insurance claims platforms, live trading consoles, and crypto products with distributed teams across APAC. React/TypeScript · Node · Go.",
  },
  zh: {
    title: "Victor Chang 張耀賢 — 資深全端工程師（遠端 · UTC+8）",
    description:
      "我打造即時運作、真金白銀的系統。七年資歷：保險理賠平台、即時交易台、加密產品。React/TypeScript · Node · Go，長期與亞太分散式團隊協作。",
  },
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return {
    title: t.title,
    description: t.description,
    metadataBase: new URL("https://victorchang.vercel.app"),
    openGraph: { title: t.title, description: t.description, type: "website" },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  return (
    <html
      lang={l === "zh" ? "zh-Hant" : "en"}
      suppressHydrationWarning
      className={`${grotesk.variable} ${plexMono.variable} ${notoSansTC.variable} h-full`}
    >
      <body data-locale={l} className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
