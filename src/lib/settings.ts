import type { Locale } from "./i18n";
import { localDigits } from "./format";

export type Settings = {
  phone: string;
  upi: string;
  fssai: string;
  /** ISO date "2026-10-31" or null */
  orderDeadline: string | null;
  ordersOpen: boolean;
  yearsOfService: number;
  /** Google Drive link (or null → bundled brochure) */
  brochureUrl: string | null;
};

/** Used until the database is set up, or if it is unreachable. */
export const DEFAULT_SETTINGS: Settings = {
  phone: "8149178200",
  upi: "9421450704",
  fssai: "21524044002045",
  orderDeadline: "2026-10-31",
  ordersOpen: true,
  yearsOfService: 16,
  brochureUrl: null,
};

const MONTHS: Record<Locale, string[]> = {
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2026-10-31" → "३१ ऑक्टोबर २०२६" / "31 October 2026" */
export function formatDate(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${localDigits(d, lang)} ${MONTHS[lang][m - 1]} ${localDigits(y, lang)}`;
}

/** Replaces {key} placeholders in dictionary strings. */
export const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
