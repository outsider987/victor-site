import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Victor Chang — Senior Full-Stack Engineer (Remote, UTC+8)",
  description:
    "I build real-time, real-money systems. 7+ years shipping insurance claims platforms, live trading consoles, and crypto products with distributed teams across APAC. React/TypeScript · Node · Go.",
  metadataBase: new URL("https://victorchang.vercel.app"),
  openGraph: {
    title: "Victor Chang — Senior Full-Stack Engineer",
    description:
      "Real-time, real-money systems. React/TypeScript · Node · Go. Remote (UTC+8).",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
