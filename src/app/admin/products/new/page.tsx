import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { BackLink } from "@/components/admin/BackLink";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product · नवीन उत्पादन" };

export default function NewProductPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <NewProduct />
    </Suspense>
  );
}

async function NewProduct() {
  const { email, lang, t } = await requireAdmin();
  return (
    <AdminShell email={email} lang={lang} t={t} active="products">
      <BackLink label={t.backToProducts} />
      <h1 className="mb-5 font-display text-3xl text-plum">{t.newTitle}</h1>
      <ProductForm t={t} />
    </AdminShell>
  );
}
