import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { BUSINESS } from "@/lib/business";
import { getSettings } from "@/lib/data";
import { localDigits } from "@/lib/format";
import { fill } from "@/lib/settings";
import { Rangoli, SectionHeading } from "@/components/Decor";
import { FreshIcon, GheeIcon, HomeHeartIcon } from "@/components/Icons";
import { OrderBand } from "@/components/Sections";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.about.title };
}

export default async function AboutPage() {
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();
  const years = localDigits(settings.yearsOfService, lang);
  const icons = [GheeIcon, HomeHeartIcon, FreshIcon];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6">
        <SectionHeading title={t.about.title} sub={fill(t.about.lead, { years })} />
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.3fr]">
          <div className="relative mx-auto w-full max-w-xs">
            <div aria-hidden="true" className="absolute inset-[15%] rounded-full bg-marigold/30 blur-3xl" />
            <Rangoli centerDisc={false} className="relative w-full" />
            <Image
              src={BUSINESS.logo}
              alt={t.brand}
              width={800}
              height={800}
              sizes="240px"
              className="absolute inset-[13%] size-[74%] drop-shadow-lg"
            />
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-ink">
            {t.about.body.map((para) => <p key={para}>{para}</p>)}
            <p className={lang === "mr" ? "pt-2 font-display text-2xl text-paithani" : "pt-2 text-xl font-bold text-paithani"}>
              — {t.owner}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading title={t.about.valuesTitle} />
        <ul className="grid gap-4 sm:grid-cols-3">
          {t.features.map((f, i) => {
            const Icon = icons[i];
            return (
              <li key={f.title} className="rounded-2xl border border-line bg-paper p-6 text-center shadow-card">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream-deep text-paithani"><Icon /></span>
                <h3 className={lang === "mr" ? "mt-3 font-display text-xl text-plum" : "mt-3 text-lg font-bold text-plum"}>{f.title}</h3>
                <p className="mt-1 text-ink-soft">{fill(f.text, { years })}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 text-center">
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center rounded-full bg-linear-to-br from-paithani to-plum px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5"
          >
            {t.ctaProducts} →
          </Link>
        </div>
      </section>

      <OrderBand t={t} lang={lang} settings={settings} />
    </>
  );
}
