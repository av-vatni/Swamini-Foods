import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { formatMoney, localDigits } from "@/lib/format";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { PRODUCTS as SEED_PRODUCTS } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { PriceCalculator } from "@/components/PriceCalculator";
import { ProductGrid, TagBadge } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/Decor";

type Props = PageProps<"/[lang]/products/[slug]">;

export async function generateStaticParams() {
  const products = await getProducts();
  // Cache Components needs at least one param; fall back to the built-in list
  return (products.length ? products : SEED_PRODUCTS).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLocale();
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name[lang], description: product.description[lang] };
}

/* The shell (back link) is shared by every product; the URL-specific part streams inside Suspense. */
export default async function ProductPage({ params }: Props) {
  const lang = await getLocale();
  const t = await getDictionary();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 md:pt-14">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-soft md:mb-6">
          <Link href={`/${lang}/products`} className="font-semibold text-paithani hover:underline">
            ← {t.backToProducts}
          </Link>
        </nav>
        <Suspense fallback={<DetailsSkeleton />}>
          <ProductDetails params={params} />
        </Suspense>
      </section>
    </>
  );
}

async function ProductDetails({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-3xl border border-line shadow-card">
          <ProductArt product={product} alt={product.name[lang]} className="aspect-4/3 w-full md:aspect-square" sizes="(max-width: 768px) 100vw, 560px" />
          <div className="zari" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className={lang === "mr" ? "font-display text-4xl text-plum sm:text-5xl" : "text-3xl font-bold text-plum sm:text-4xl"}>
            {product.name[lang]}
          </h1>
          <TagBadge tag={product.tag} lang={lang} />
          <p className="text-lg text-ink-soft">{product.description[lang]}</p>
          <p className="text-ink-soft">
            {t.rate}:{" "}
            <strong className="text-2xl text-paithani">{formatMoney(product.price, lang)}</strong>{" "}
            / {localDigits(1, lang)} {t.kg}
          </p>
          <div className="mt-2 rounded-3xl border border-line bg-paper p-4 shadow-card sm:p-5">
            <PriceCalculator product={product} lang={lang} phone={settings.phone} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeading title={t.related} />
          <ProductGrid products={related} lang={lang} phone={settings.phone} showFilters={false} />
        </div>
      )}
    </>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 md:grid-cols-2 md:gap-12" aria-hidden="true">
      <div className="aspect-4/3 rounded-3xl bg-cream-deep md:aspect-square" />
      <div className="flex flex-col gap-4">
        <div className="h-10 w-2/3 rounded-xl bg-cream-deep" />
        <div className="h-5 w-1/4 rounded-full bg-cream-deep" />
        <div className="h-16 rounded-xl bg-cream-deep" />
        <div className="h-72 rounded-3xl bg-cream-deep" />
      </div>
    </div>
  );
}
