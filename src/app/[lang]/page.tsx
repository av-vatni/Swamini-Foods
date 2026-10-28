import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { localDigits } from "@/lib/format";
import { BUSINESS } from "@/lib/business";
import { getProducts, getSettings } from "@/lib/data";
import { fill } from "@/lib/settings";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Rangoli, SectionHeading } from "@/components/Decor";
import { FreshIcon, GheeIcon, HomeHeartIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/ProductGrid";
import { ContactCard, DownloadBrochure, OrderBand } from "@/components/Sections";

export default async function HomePage() {
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();
  const featured = (await getProducts()).filter((p) => p.featured);
  const years = localDigits(settings.yearsOfService, lang);
  const featureIcons = [GheeIcon, HomeHeartIcon, FreshIcon];

  return (
    <>
      {/* Hero — Diwali night */}
      <section className="relative overflow-hidden bg-night text-cream">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgb(244_166_29/.22),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgb(184_51_111/.35),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-[1.15fr_1fr] md:gap-10 md:pb-20 md:pt-20">
          {/* Logo medallion with a slowly turning rangoli behind it */}
          <div className="relative mx-auto aspect-square w-64 sm:w-72 md:order-last md:w-full md:max-w-md">
            <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-marigold/30 blur-2xl md:blur-3xl" />
            <Rangoli centerDisc={false} className="absolute inset-0 size-full opacity-90" />
            <Image
              src={BUSINESS.logo}
              alt={t.brand}
              width={800}
              height={800}
              priority
              sizes="(max-width: 768px) 75vw, 340px"
              className="absolute inset-[13%] size-[74%] drop-shadow-[0_10px_24px_rgb(0_0_0/.35)]"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="inline-block rounded-full border border-zari/50 bg-white/5 px-4 py-1.5 text-xs font-semibold text-zari-light sm:text-sm">
              ✦ {fill(t.heritage, { years })}
            </p>
            <p className="mt-4 font-display text-base text-marigold sm:text-lg md:mt-6">{t.byOwner}</p>
            <h1 className="font-display text-[2.6rem] leading-tight text-zari-light drop-shadow-[0_2px_12px_rgb(244_166_29/.25)] sm:text-6xl lg:text-7xl">
              {lang === "mr" ? (
                <BrandWordmark label={t.brand} className="mt-2 block w-full max-w-xl md:mx-0 mx-auto" />
              ) : (
                t.brand
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-display text-base leading-relaxed text-cream/85 sm:text-xl md:mx-0 md:mt-5">
              {t.blessing[0]}
              <br />
              {t.blessing[1]}
            </p>

            <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
              <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold">
                <span aria-hidden="true" className="grid size-3.5 place-items-center rounded-[3px] border-[1.5px] border-green-400">
                  <span className="size-1.5 rounded-full bg-green-400" />
                </span>
                {t.badges.veg}
              </li>
              <li className="rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold">{t.badges.fssai}</li>
              <li className="rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold">{t.badges.homemade}</li>
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-8 md:justify-start">
              <Link
                href={`/${lang}/products`}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-marigold to-saffron px-7 py-3.5 font-bold text-plum shadow-[0_8px_24px_rgb(244_166_29/.3)] transition hover:-translate-y-0.5"
              >
                {t.ctaProducts} →
              </Link>
              <DownloadBrochure label={t.download} settings={settings} />
            </div>
          </div>
        </div>
        <div className="zari" aria-hidden="true" />
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <li key={f.title} className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-5 shadow-card">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cream-deep text-paithani">
                  <Icon />
                </span>
                <div>
                  <h3 className={lang === "mr" ? "font-display text-xl text-plum" : "text-lg font-bold text-plum"}>{f.title}</h3>
                  <p className="mt-1 text-ink-soft">{fill(f.text, { years })}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading title={t.featuredTitle} sub={t.featuredSub} />
        <ProductGrid products={featured} lang={lang} phone={settings.phone} showFilters={false} />
        <div className="mt-10 text-center">
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-paithani-light bg-paper px-7 py-3.5 font-semibold text-plum transition hover:-translate-y-0.5 hover:bg-white"
          >
            {t.viewAll} →
          </Link>
        </div>
      </section>

      <OrderBand t={t} lang={lang} settings={settings} />

      {/* Contact */}
      <section className="px-4 py-16 sm:px-6">
        <SectionHeading title={t.contactTitle} sub={t.contactSub} />
        <ContactCard t={t} lang={lang} settings={settings} />
      </section>
    </>
  );
}
