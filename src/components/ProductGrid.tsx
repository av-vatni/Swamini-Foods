"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDict } from "@/lib/dictionaries";
import { formatMoney, localDigits } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Category, Product } from "@/lib/products";
import { ProductArt } from "./ProductArt";
import { PriceCalculator } from "./PriceCalculator";

type Filter = "all" | Category;
const FILTERS: Filter[] = ["all", "sweet", "namkeen", "flour"];

export function TagBadge({ tag, lang }: { tag?: Product["tag"]; lang: Locale }) {
  if (!tag) return null;
  const t = getDict(lang);
  const style =
    tag === "ghee"
      ? "border-[#f1d27a] bg-[#fff1c7] text-[#8a5a00]"
      : "border-[#e4c9d4] bg-[#f6e9ee] text-ink-soft";
  return (
    <span className={`inline-block self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {t.tags[tag]}
    </span>
  );
}

export function ProductGrid({
  products,
  lang,
  phone,
  showFilters = true,
}: {
  products: Product[];
  lang: Locale;
  phone: string;
  showFilters?: boolean;
}) {
  const t = getDict(lang);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Product | null>(null);
  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      {showFilters && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className="rounded-full border border-line bg-paper px-5 py-2.5 font-semibold text-plum transition hover:border-paithani-light aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-white"
            >
              {t.filters[f]}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((p, i) => (
          <li
            key={p.slug}
            className="animate-rise"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <button
              type="button"
              onClick={() => setActive(p)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-paper text-left shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <ProductArt product={p} alt={p.name[lang]} className="aspect-[16/11] w-full" />
              <div className="zari h-1.5!" aria-hidden="true" />
              <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                <h3 className={lang === "mr" ? "font-display text-lg sm:text-xl" : "text-base font-semibold sm:text-lg"}>
                  {p.name[lang]}
                </h3>
                <TagBadge tag={p.tag} lang={lang} />
                <div className="mt-auto flex items-baseline gap-1.5 border-t border-dashed border-line pt-2.5">
                  <span className="text-xl font-bold text-paithani sm:text-2xl">{formatMoney(p.price, lang)}</span>
                  <span className="text-xs text-ink-soft sm:text-sm">/ {localDigits(1, lang)} {t.kg}</span>
                </div>
                <span className="text-xs font-semibold text-paithani-light transition group-hover:translate-x-1 sm:text-sm">
                  {t.tapHint} →
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <QuickView product={active} lang={lang} phone={phone} onClose={() => setActive(null)} />
    </>
  );
}

function QuickView({ product, lang, phone, onClose }: {
  product: Product | null;
  lang: Locale;
  phone: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = getDict(lang);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
    document.body.style.overflow = product ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label={product?.name[lang]}
      className="quick-view m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-auto rounded-t-3xl bg-paper p-0 text-ink shadow-2xl open:animate-pop sm:m-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[460px] sm:rounded-3xl"
    >
      {product && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/85 text-2xl leading-none text-plum shadow"
          >
            ×
          </button>
          <ProductArt product={product} alt={product.name[lang]} className="aspect-[16/8] w-full" sizes="460px" />
          <div className="zari" aria-hidden="true" />
          <div className="flex flex-col gap-2 p-5">
            <h3 className={lang === "mr" ? "font-display text-3xl text-plum" : "text-2xl font-bold text-plum"}>
              {product.name[lang]}
            </h3>
            <TagBadge tag={product.tag} lang={lang} />
            <p className="text-ink-soft">{product.description[lang]}</p>
            <p className="mb-2 text-ink-soft">
              {t.rate}: <strong className="text-paithani">{formatMoney(product.price, lang)} / {localDigits(1, lang)} {t.kg}</strong>
            </p>
            {/* key resets the calculator for each product */}
            <PriceCalculator key={product.slug} product={product} lang={lang} phone={phone} />
            <Link
              href={`/${lang}/products/${product.slug}`}
              onClick={onClose}
              className="mt-1 self-center font-semibold text-paithani underline decoration-dashed underline-offset-4"
            >
              {t.viewDetails} →
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
