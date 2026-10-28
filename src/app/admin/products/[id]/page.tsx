import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import type { ProductRow } from "@/lib/data";
import { fill } from "@/lib/settings";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { BackLink } from "@/components/admin/BackLink";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit product · उत्पादन संपादन" };

type Props = PageProps<"/admin/products/[id]">;

export default function EditProductPage({ params }: Props) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: Pick<Props, "params">) {
  const { id } = await params;
  const { supabase, email, lang, t } = await requireAdmin();
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const { data } = isUuid
    ? await supabase.from("products").select("*").eq("id", id).maybeSingle()
    : { data: null };
  const product = data as ProductRow | null;

  return (
    <AdminShell email={email} lang={lang} t={t} active="products">
      <BackLink label={t.backToProducts} />
      {product ? (
        <>
          <h1 className="mb-5 font-display text-3xl text-plum">
            {fill(t.editTitle, { name: lang === "en" ? product.name_en : product.name_mr })}
          </h1>
          <ProductForm key={product.id} product={product} t={t} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">{t.productNotFound}</p>
      )}
    </AdminShell>
  );
}
