"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import type { ProductRow } from "@/lib/data";
import { fill } from "@/lib/settings";
import { DriveLinkField, Field, inputClass, Notice, SubmitButton } from "./ui";

export function ProductForm({ product, t }: { product?: ProductRow; t: AdminDict }) {
  const [state, action] = useActionState(saveProduct, null);
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const perKg = Number(price) > 0 ? Number(price) : 0;

  const categories = [
    { value: "sweet", label: t.cat_sweet },
    { value: "namkeen", label: t.cat_namkeen },
    { value: "flour", label: t.cat_flour },
  ];
  const tags = [
    { value: "", label: t.tag_none },
    { value: "ghee", label: t.tag_ghee },
    { value: "oil", label: t.tag_oil },
  ];

  return (
    <div className="flex flex-col gap-5">
      <form action={action} className="flex flex-col gap-5">
        {product && <input type="hidden" name="id" value={product.id} />}

        <Card title={t.secName}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.nameMr}>
              <input name="name_mr" required defaultValue={product?.name_mr} placeholder="उदा. बेसन लाडू" className={inputClass} />
            </Field>
            <Field label={t.nameEn}>
              <input name="name_en" required defaultValue={product?.name_en} placeholder="e.g. Besan Ladoo" className={inputClass} />
            </Field>
            <Field label={t.descMr}>
              <textarea name="description_mr" rows={3} defaultValue={product?.description_mr} className={inputClass} />
            </Field>
            <Field label={t.descEn}>
              <textarea name="description_en" rows={3} defaultValue={product?.description_en} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card title={t.secPrice}>
          <Field
            label={t.price}
            hint={perKg ? fill(t.priceSplit, { q: Math.round(perKg / 4), h: Math.round(perKg / 2) }) : t.priceHint}
          >
            <input
              name="price"
              type="number"
              inputMode="numeric"
              min={1}
              max={99999}
              step={1}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`${inputClass} max-w-48 text-lg font-bold`}
            />
          </Field>
          <ChoiceGroup name="category" label={t.category} options={categories} defaultValue={product?.category ?? "sweet"} />
          <ChoiceGroup name="tag" label={t.badge} options={tags} defaultValue={product?.tag ?? ""} />
        </Card>

        <Card title={t.secPhoto}>
          <DriveLinkField name="image_url" label={t.photoLink} defaultValue={product?.image_url} t={t} />
        </Card>

        <Card title={t.secWeb}>
          <Check name="is_available" defaultChecked={product?.is_available ?? true} label={t.showOnSite} hint={t.showOnSiteHint} />
          <Check name="is_featured" defaultChecked={product?.is_featured ?? false} label={t.featureLabel} />
          <details className="rounded-xl bg-cream px-3 py-2">
            <summary className="cursor-pointer text-sm font-semibold text-ink-soft">{t.advanced}</summary>
            <div className="mt-3">
              <Field label="Slug" hint={t.slugHint}>
                <input name="slug" defaultValue={product?.slug} pattern="[a-z0-9-]*" className={inputClass} />
              </Field>
            </div>
          </details>
        </Card>

        <Notice state={state} />

        <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <Link href="/admin" className="rounded-full border border-line bg-white px-5 py-2.5 font-semibold text-plum">
            {t.back}
          </Link>
          <SubmitButton pendingText={t.saving} className="flex-1 py-3 sm:flex-none sm:px-10">
            {product ? t.saveChanges : t.addProduct}
          </SubmitButton>
        </div>
      </form>

      {product && (
        <form
          action={deleteProduct}
          onSubmit={(e) => {
            if (!confirm(fill(t.deleteConfirm, { name: product.name_mr }))) e.preventDefault();
          }}
          className="mt-4 rounded-2xl border border-red-100 bg-red-50/50 p-4"
        >
          <input type="hidden" name="id" value={product.id} />
          <p className="mb-3 text-sm text-red-800">{t.deleteNote}</p>
          <SubmitButton variant="danger" pendingText={t.deleting}>{t.deleteBtn}</SubmitButton>
        </form>
      )}

      {product?.updated_at && (
        <p className="text-center text-xs text-ink-soft">
          {t.lastChanged}: {new Date(product.updated_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}{" "}
          {product.updated_by ? `· ${product.updated_by}` : ""}
        </p>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 shadow-card sm:p-5">
      <h2 className="font-display text-xl text-plum">{title}</h2>
      {children}
    </section>
  );
}

function ChoiceGroup({ name, label, options, defaultValue }: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="peer sr-only" />
            <span className="inline-block rounded-full border border-line bg-white px-4 py-2 font-semibold text-ink-soft transition peer-checked:border-plum peer-checked:bg-plum peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-marigold">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Check({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-3 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-5 shrink-0 accent-paithani" />
      <span>
        <span className="font-semibold">{label}</span>
        {hint && <span className="block text-sm text-ink-soft">{hint}</span>}
      </span>
    </label>
  );
}
