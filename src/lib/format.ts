import type { Locale } from "./i18n";

const DEV_DIGITS = "०१२३४५६७८९";

/** Converts ASCII digits to Devanagari digits for Marathi. */
export const localDigits = (value: string | number, lang: Locale) =>
  lang === "mr"
    ? String(value).replace(/\d/g, (d) => DEV_DIGITS[Number(d)])
    : String(value);

/** ₹1,200 / ₹१,२०० — Indian digit grouping. */
export const formatMoney = (amount: number, lang: Locale) =>
  "₹" + localDigits(amount.toLocaleString("en-IN"), lang);

/** 98765 43210 */
export const formatPhone = (phone: string, lang: Locale) =>
  localDigits(phone.replace(/(\d{5})(\d{5})/, "$1 $2"), lang);

/** 1250 -> "1 kg 250 g" / "१ किलो २५० ग्रॅम" */
export function formatQty(grams: number, lang: Locale) {
  const units = lang === "mr" ? { kg: "किलो", g: "ग्रॅम" } : { kg: "kg", g: "g" };
  const kg = Math.floor(grams / 1000);
  const rest = grams % 1000;
  const parts: string[] = [];
  if (kg) parts.push(`${localDigits(kg, lang)} ${units.kg}`);
  if (rest) parts.push(`${localDigits(rest, lang)} ${units.g}`);
  return parts.join(" ");
}
