export const locales = ["mr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "mr";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Remembers the visitor's language choice (read by proxy.ts). Client-side only. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Same path in another language: /mr/products -> /en/products */
export const switchLocalePath = (pathname: string, target: Locale) =>
  pathname.replace(/^\/(mr|en)(?=\/|$)/, `/${target}`) || `/${target}`;
