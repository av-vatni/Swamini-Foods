import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/locale.server";
import { getProducts, getSettings } from "@/lib/data";
import { SectionHeading } from "@/components/Decor";
import { ProductGrid } from "@/components/ProductGrid";
import { DownloadBrochure, OrderBand } from "@/components/Sections";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.menuTitle };
}

export default async function ProductsPage() {
  const lang = await getLocale();
  const t = await getDictionary();
  const settings = await getSettings();
  const products = await getProducts();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6">
        <SectionHeading title={t.menuTitle} sub={t.menuSub} />
        <ProductGrid products={products} lang={lang} phone={settings.phone} />
        <div className="mt-10 text-center">
          <DownloadBrochure label={t.download} settings={settings} variant="light" />
        </div>
      </section>
      <OrderBand t={t} lang={lang} settings={settings} />
    </>
  );
}
