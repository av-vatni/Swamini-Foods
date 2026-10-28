import type { Metadata } from "next";
import { locales } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import { getSettings } from "@/lib/data";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { MobileActionBar } from "@/components/MobileActionBar";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: { default: t.brand, template: `%s | ${t.brand}` },
    description: t.metaDescription,
    alternates: { languages: { mr: "/mr", en: "/en" } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={fontVariables}>
      {/* bottom padding on phones keeps the footer clear of the action bar */}
      <body className="flex min-h-dvh flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <div aria-hidden="true" className="toran pointer-events-none animate-sway" />
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer t={t} lang={lang} settings={settings} />
        <MobileActionBar t={t} settings={settings} />
      </body>
    </html>
  );
}
