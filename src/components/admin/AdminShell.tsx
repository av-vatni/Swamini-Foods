import Image from "next/image";
import Link from "next/link";
import { logout, setAdminLang } from "@/app/admin/actions";
import type { AdminDict, AdminLang } from "@/lib/admin-i18n";
import { BUSINESS } from "@/lib/business";

export function AdminShell({ email, lang, t, active, children }: {
  email: string;
  lang: AdminLang;
  t: AdminDict;
  active: "products" | "settings";
  children: React.ReactNode;
}) {
  const nav = [
    { href: "/admin", label: t.navProducts, key: "products" },
    { href: "/admin/settings", label: t.navSettings, key: "settings" },
  ];
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 bg-plum text-cream shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5">
          <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
            <Image src={BUSINESS.logo} alt="" width={80} height={80} className="size-10 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-tight text-zari-light">{t.appName}</span>
              <span className="block truncate text-xs text-cream/70">{email}</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <AdminLangSwitch lang={lang} label={t.langLabel} />
            <a href="/mr" target="_blank" rel="noopener noreferrer" className="hidden rounded-full border border-white/25 px-3.5 py-1.5 text-sm font-semibold hover:bg-white/10 md:inline-block">
              {t.viewSite}
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20">
                {t.logout}
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-2" aria-label="Admin">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.key ? "page" : undefined}
              className="flex-1 rounded-t-xl px-4 py-2 text-center font-semibold text-cream/75 transition hover:text-white aria-[current=page]:bg-cream aria-[current=page]:text-plum sm:flex-none"
            >
              {n.label}
            </Link>
          ))}
          <a href="/mr" target="_blank" rel="noopener noreferrer" className="flex-1 rounded-t-xl px-4 py-2 text-center font-semibold text-cream/75 md:hidden">
            {t.siteShort}
          </a>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}

/** मराठी | EN switch — stores the choice in a cookie via a server action. */
export function AdminLangSwitch({ lang, label, light = false }: { lang: AdminLang; label: string; light?: boolean }) {
  return (
    <form action={setAdminLang} className={`inline-flex rounded-full p-0.5 ${light ? "border border-line bg-white" : "bg-white/10"}`} aria-label={label}>
      {(["mr", "en"] as const).map((l) => (
        <button
          key={l}
          type="submit"
          name="lang"
          value={l}
          aria-pressed={l === lang}
          className={`min-w-11 rounded-full px-2.5 py-1 text-sm font-semibold transition ${
            l === lang
              ? light ? "bg-paithani text-white" : "bg-cream text-plum"
              : light ? "text-ink-soft" : "text-cream/80 hover:text-white"
          }`}
        >
          {l === "mr" ? "मराठी" : "EN"}
        </button>
      ))}
    </form>
  );
}

export function AdminLoading() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <span className="size-10 animate-spin rounded-full border-4 border-paithani/30 border-t-paithani" aria-label="Loading" />
    </div>
  );
}
