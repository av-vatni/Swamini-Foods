"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import { downloadHref } from "@/lib/drive";
import { Check } from "./ProductForm";
import { DriveLinkField, Field, inputClass, Notice, SubmitButton } from "./ui";

export type SettingsRow = {
  phone: string;
  upi: string;
  fssai: string;
  order_deadline: string | null;
  orders_open: boolean;
  years_of_service: number;
  brochure_url: string | null;
  updated_at?: string;
  updated_by?: string | null;
};

export function SettingsForm({ settings, t }: { settings: SettingsRow; t: AdminDict }) {
  const [state, action] = useActionState(saveSettings, null);
  const brochureTest = downloadHref(settings.brochure_url);

  return (
    <form action={action} className="flex flex-col gap-5">
      <Section title={t.secOrders}>
        <Check name="orders_open" defaultChecked={settings.orders_open} label={t.ordersOpen} hint={t.ordersOpenHint} />
        <Field label={t.deadline} hint={t.deadlineHint}>
          <input name="order_deadline" type="date" defaultValue={settings.order_deadline ?? ""} className={`${inputClass} max-w-56`} />
        </Field>
      </Section>

      <Section title={t.secContact}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.phone}>
            <input name="phone" type="tel" inputMode="numeric" required pattern="[0-9 ]{10,12}" defaultValue={settings.phone} className={inputClass} />
          </Field>
          <Field label={t.upi}>
            <input name="upi" type="tel" inputMode="numeric" required pattern="[0-9 ]{10,12}" defaultValue={settings.upi} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title={t.secBusiness}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.fssai}>
            <input name="fssai" inputMode="numeric" defaultValue={settings.fssai} className={inputClass} />
          </Field>
          <Field label={t.years} hint={t.yearsHint}>
            <input name="years_of_service" type="number" min={1} max={200} required defaultValue={settings.years_of_service} className={`${inputClass} max-w-32`} />
          </Field>
        </div>
      </Section>

      <Section title={t.secBrochure}>
        <DriveLinkField name="brochure_url" label={t.brochureLink} defaultValue={settings.brochure_url} t={t} previewHeight="h-72" />
        <p className="text-sm text-ink-soft">
          {t.brochureNote}
          {brochureTest && (
            <>
              {" "}
              <a href={brochureTest} target="_blank" rel="noopener noreferrer" className="font-semibold text-paithani underline">
                {t.brochureTest}
              </a>
            </>
          )}
        </p>
      </Section>

      <Notice state={state} />

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <SubmitButton pendingText={t.saving} className="w-full py-3 sm:w-auto sm:px-10">{t.saveSettings}</SubmitButton>
      </div>

      {settings.updated_at && (
        <p className="text-center text-xs text-ink-soft">
          {t.lastChanged}: {new Date(settings.updated_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}{" "}
          {settings.updated_by ? `· ${settings.updated_by}` : ""}
        </p>
      )}
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 shadow-card sm:p-5">
      <h2 className="font-display text-xl text-plum">{title}</h2>
      {children}
    </section>
  );
}
