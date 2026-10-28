import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getAdminLang } from "@/lib/admin";
import { getAdminDict } from "@/lib/admin-i18n";
import { BUSINESS } from "@/lib/business";
import { AdminLangSwitch } from "@/components/admin/AdminShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-night px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
        <Image src={BUSINESS.logo} alt="स्वामिनी गृह उद्योग" width={240} height={240} priority className="mx-auto size-28" />
        <Suspense fallback={<div className="h-80" />}>
          <LoginCard />
        </Suspense>
      </div>
    </main>
  );
}

/** Reads the language cookie, so it renders per request inside Suspense. */
async function LoginCard() {
  const lang = await getAdminLang();
  const t = getAdminDict(lang);
  return (
    <>
      <div className="mt-3 flex justify-center">
        <AdminLangSwitch lang={lang} label={t.langLabel} light />
      </div>
      <h1 className="mt-3 text-center font-display text-2xl text-plum">{t.loginTitle}</h1>
      <p className="mb-6 text-center text-sm text-ink-soft">{t.loginSub}</p>
      <LoginForm t={t} />
    </>
  );
}
