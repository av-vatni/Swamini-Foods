import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";
import { getDict } from "./dictionaries";

/** Current locale from the /[lang] segment (server components only). */
export async function getLocale(): Promise<Locale> {
  const value = (await lang()) ?? ""; // undefined under /admin (separate root layout)
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary() {
  return getDict(await getLocale());
}
