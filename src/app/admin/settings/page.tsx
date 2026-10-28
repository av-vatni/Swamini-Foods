import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm, type SettingsRow } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings · सेटिंग्ज" };

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { supabase, email, lang, t } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <AdminShell email={email} lang={lang} t={t} active="settings">
      <h1 className="mb-1 font-display text-3xl text-plum">{t.settingsTitle}</h1>
      <p className="mb-5 text-ink-soft">{t.settingsSub}</p>
      {data ? (
        <SettingsForm settings={data as SettingsRow} t={t} />
      ) : (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {t.settingsNotFound}
          {error ? ` (${error.message})` : ""}
        </p>
      )}
    </AdminShell>
  );
}
