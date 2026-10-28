"use client";

import { useState } from "react";
import type { AdminDict } from "@/lib/admin-i18n";
import { quickUpdate } from "./actions";
import { SubmitButton } from "@/components/admin/ui";

/** Inline "₹ [640] / kg ✓" price editor shown on each product card. */
export function PriceQuickEdit({ id, price, t }: { id: string; price: number; t: Pick<AdminDict, "perKg" | "priceAria" | "saveShort"> }) {
  const [value, setValue] = useState(String(price));
  const changed = Number(value) !== price;

  return (
    <form action={quickUpdate} className="mt-2 flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value="price" />
      <label className="flex items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-paithani-light">
        <span className="pl-3 text-ink-soft">₹</span>
        <input
          name="value"
          type="number"
          inputMode="numeric"
          min={1}
          max={99999}
          step={1}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={t.priceAria}
          className="w-24 bg-transparent px-2 py-2 text-lg font-bold text-plum outline-none"
        />
        <span className="pr-3 text-sm text-ink-soft">{t.perKg}</span>
      </label>
      {changed && (
        <SubmitButton pendingText="…" className="px-4! py-2!">
          {t.saveShort}
        </SubmitButton>
      )}
    </form>
  );
}
