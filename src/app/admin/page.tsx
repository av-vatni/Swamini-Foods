import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import type { AdminDict, AdminLang } from "@/lib/admin-i18n";
import { rowToProduct, type ProductRow } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { fill } from "@/lib/settings";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { SubmitButton } from "@/components/admin/ui";
import { ProductArt } from "@/components/ProductArt";
import { moveProduct, quickUpdate } from "./actions";
import { PriceQuickEdit } from "./PriceQuickEdit";

export const metadata: Metadata = { title: "Products · उत्पादने" };

export default function AdminProductsPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ProductsDashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsDashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const { supabase, email, lang, t } = await requireAdmin();
  const sp = await searchParams;
  const { data, error } = await supabase.from("products").select("*").order("sort_order").order("name_en");
  const rows = (data ?? []) as ProductRow[];
  const visibleCount = rows.filter((r) => r.is_available).length;

  return (
    <AdminShell email={email} lang={lang} t={t} active="products">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-plum">{t.productsTitle}</h1>
          <p className="text-ink-soft">{fill(t.countLine, { total: rows.length, visible: visibleCount })}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-linear-to-br from-marigold to-saffron px-5 py-2.5 font-bold text-plum shadow-[0_6px_16px_rgb(244_166_29/.3)]"
        >
          {t.addNew}
        </Link>
      </div>

      {sp.saved && <Banner>{t.savedNew}</Banner>}
      {sp.deleted && <Banner>{t.deletedMsg}</Banner>}
      {error && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {t.loadError}: {error.message}
        </p>
      )}

      <p className="mb-4 rounded-2xl bg-cream-deep/70 px-4 py-3 text-sm text-ink-soft">{t.tip}</p>

      <ul className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <ProductItem key={r.id} row={r} first={i === 0} last={i === rows.length - 1} lang={lang} t={t} />
        ))}
      </ul>

      {!error && rows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">{t.empty}</p>
      )}
    </AdminShell>
  );
}

function ProductItem({ row: r, first, last, lang, t }: { row: ProductRow; first: boolean; last: boolean; lang: AdminLang; t: AdminDict }) {
  const p = rowToProduct(r);
  // Primary name in the chosen admin language, the other one underneath
  const [primary, secondary] = lang === "en" ? [r.name_en, r.name_mr] : [r.name_mr, r.name_en];
  const category = { sweet: t.cat_sweet, namkeen: t.cat_namkeen, flour: t.cat_flour }[r.category];

  return (
    <li className={`rounded-2xl border bg-paper p-3 shadow-card sm:p-4 ${r.is_available ? "border-line" : "border-dashed border-ink-soft/40 opacity-70"}`}>
      <div className="flex gap-3">
        <ProductArt product={p} alt="" className="size-20 shrink-0 rounded-xl sm:size-24" sizes="96px" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className={lang === "en" ? "text-lg font-bold text-plum" : "font-display text-xl text-plum"}>{primary}</h2>
            {r.tag && (
              <span className="rounded-full bg-[#fff1c7] px-2 py-0.5 text-xs font-semibold text-[#8a5a00]">
                {r.tag === "ghee" ? t.tag_ghee : t.tag_oil}
              </span>
            )}
            {r.is_featured && <span className="rounded-full bg-marigold/25 px-2 py-0.5 text-xs font-semibold text-plum">{t.featured}</span>}
            {!r.is_available && <span className="rounded-full bg-ink-soft/15 px-2 py-0.5 text-xs font-semibold text-ink-soft">{t.hiddenBadge}</span>}
          </div>
          <p className="truncate text-sm text-ink-soft">
            {secondary} · {category} · <strong className="text-paithani">{formatMoney(r.price, "en")}</strong> {t.perKg}
          </p>
          <PriceQuickEdit id={r.id} price={r.price} t={t} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-line pt-3">
        <Toggle id={r.id} field="is_available" on={r.is_available} onLabel={t.visible} offLabel={t.hidden} />
        <Toggle id={r.id} field="is_featured" on={r.is_featured} onLabel={t.featured} offLabel={t.notFeatured} />
        <span className="ml-auto flex gap-1.5">
          <Move id={r.id} dir="up" disabled={first} label={t.moveUp} />
          <Move id={r.id} dir="down" disabled={last} label={t.moveDown} />
          <Link href={`/admin/products/${r.id}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-plum hover:bg-cream-deep">
            {t.edit}
          </Link>
        </span>
      </div>
    </li>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800">{children}</p>;
}

function Toggle({ id, field, on, onLabel, offLabel }: { id: string; field: string; on: boolean; onLabel: string; offLabel: string }) {
  return (
    <form action={quickUpdate}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!on)} />
      <SubmitButton
        variant="ghost"
        pendingText="…"
        aria-pressed={on}
        className={`px-3.5! py-2! text-sm ${on ? "border-paithani-light! bg-paithani/10! text-plum" : "text-ink-soft"}`}
      >
        {on ? onLabel : offLabel}
      </SubmitButton>
    </form>
  );
}

function Move({ id, dir, disabled, label }: { id: string; dir: "up" | "down"; disabled: boolean; label: string }) {
  return (
    <form action={moveProduct}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <SubmitButton variant="ghost" pendingText="…" disabled={disabled} aria-label={label} title={label} className="size-9 px-0! py-0!">
        {dir === "up" ? "↑" : "↓"}
      </SubmitButton>
    </form>
  );
}
