"use client";

import { useState } from "react";
import { getDict } from "@/lib/dictionaries";
import { formatMoney, formatQty } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { priceFor, QTY, type Product } from "@/lib/products";
import { PhoneIcon } from "./Icons";

export function PriceCalculator({ product, lang, phone }: { product: Product; lang: Locale; phone: string }) {
  const t = getDict(lang);
  const [grams, setGrams] = useState(QTY.initial);
  const change = (delta: number) =>
    setGrams((g) => Math.min(QTY.max, Math.max(QTY.min, g + delta)));

  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold text-ink">{t.chooseQty}</p>

      <div className="flex flex-wrap gap-2">
        {QTY.presets.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrams(g)}
            aria-pressed={grams === g}
            className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-plum transition hover:border-paithani-light aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-white"
          >
            {formatQty(g, lang)}
          </button>
        ))}
      </div>

      <div className="flex items-center overflow-hidden rounded-2xl border border-line bg-white">
        <button
          type="button"
          onClick={() => change(-QTY.step)}
          disabled={grams <= QTY.min}
          aria-label="− 250 g"
          className="h-12 w-14 shrink-0 bg-cream-deep text-2xl text-plum transition hover:bg-zari-light disabled:opacity-35"
        >
          −
        </button>
        <output aria-live="polite" className="flex-1 text-center text-lg font-bold">
          {formatQty(grams, lang)}
        </output>
        <button
          type="button"
          onClick={() => change(QTY.step)}
          disabled={grams >= QTY.max}
          aria-label="+ 250 g"
          className="h-12 w-14 shrink-0 bg-cream-deep text-2xl text-plum transition hover:bg-zari-light disabled:opacity-35"
        >
          +
        </button>
      </div>
      <p className="-mt-1 text-xs text-ink-soft">{t.stepHint}</p>

      <div className="flex items-baseline justify-between rounded-2xl border border-[#f1d27a] bg-linear-to-br from-[#fff1c7] to-[#fde3b0] px-4 py-3.5 font-semibold">
        <span>{t.total}</span>
        <strong className="text-3xl text-paithani tabular-nums">{formatMoney(priceFor(product, grams), lang)}</strong>
      </div>

      <a
        href={`tel:+91${phone}`}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-paithani to-plum px-6 py-3.5 font-semibold text-white shadow-[0_6px_16px_rgb(74_13_46/.25)] transition hover:-translate-y-0.5"
      >
        <PhoneIcon />
        {t.orderCall}
      </a>
    </div>
  );
}
