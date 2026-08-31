import type { Metadata } from "next";
import { Header } from "@/components/header";
import { LanguageProvider } from "@/components/language";
import { withBasePath } from "@/data/projects";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Victor Chang — Software Engineer", template: "%s — Victor Chang" },
  description: "Victor Chang's software engineering portfolio: real-time operations, healthcare workflows, Web3 transaction UX, and tender discovery.",
  icons: { icon: withBasePath("/favicon.svg") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
