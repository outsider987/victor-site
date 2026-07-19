import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "./i18n";

/**
 * Locale routing:
 * 1. Paths already prefixed with /en or /zh pass through untouched.
 * 2. Bare paths redirect to a locale chosen by: NEXT_LOCALE cookie
 *    (set by the manual language switch) → Accept-Language → default.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}

export const config = {
  // everything except Next internals and files with extensions
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
