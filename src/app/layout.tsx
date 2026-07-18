import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
