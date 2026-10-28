"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import type { AdminDict } from "@/lib/admin-i18n";
import { login } from "../actions";
import { Field, inputClass, Notice, SubmitButton } from "@/components/admin/ui";

export function LoginForm({ t }: { t: AdminDict }) {
  const [state, action] = useActionState(login, null);
  const reasons: Record<string, string> = { denied: t.m_notAdmin, setup: t.m_setup };
  const reason = reasons[useSearchParams().get("e") ?? ""];

  return (
    <form action={action} className="flex flex-col gap-4">
      <Notice state={state ?? (reason ? { ok: false, message: reason } : null)} />
      <Field label={t.email}>
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </Field>
      <Field label={t.password}>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </Field>
      <SubmitButton pendingText={t.checking} className="mt-2 py-3">{t.loginBtn}</SubmitButton>
    </form>
  );
}
