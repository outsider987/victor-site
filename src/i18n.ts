export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** hreflang alternates for a locale-less path like "/work" */
export function altFor(path: string) {
  return {
    languages: {
      en: `/en${path}`,
      "zh-Hant": `/zh${path}`,
      "x-default": `/en${path}`,
    },
  };
}
