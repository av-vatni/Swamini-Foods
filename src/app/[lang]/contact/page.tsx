import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { BUSINESS } from "@/lib/business";
import { getSettings } from "@/lib/data";
import { SectionHeading } from "@/components/Decor";
import { ContactCard } from "@/components/Sections";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.nav.contact };
}

export default async function ContactPage() {
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6">
      <SectionHeading title={t.contactTitle} sub={t.contactSub} />
      <ContactCard t={t} lang={lang} settings={settings} />
      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-line shadow-card">
        <iframe
          title={t.mapTitle}
          src={BUSINESS.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-72 w-full border-0 sm:h-96"
        />
      </div>
    </section>
  );
}
