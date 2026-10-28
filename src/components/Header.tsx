"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { BrandWordmark } from "@/components/BrandWordmark";
import { usePathname } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { locales, rememberLocale, switchLocalePath, type Locale } from "@/lib/i18n";

const LANG_LABEL: Record<Locale, string> = { mr: "मराठी", en: "EN" };

export function Header({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/products`, label: t.nav.products },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];
  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={`/${lang}`} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 md:flex-none" onClick={() => setOpen(false)}>
          <Image
            src={BUSINESS.logo}
            alt=""
            width={96}
            height={96}
            priority
            className="size-11 shrink-0 drop-shadow-sm sm:size-14"
          />
          <span className="min-w-0 flex-1">
            {lang === "mr" ? (
              /* Fills the space left beside the controls on phones; fixed height from md up. */
              <BrandWordmark label={t.brand} className="block w-full max-w-44 text-plum md:h-9 md:w-auto md:max-w-none" />
            ) : (
              <span className="block truncate font-display text-lg leading-tight text-plum sm:text-xl">{t.brand}</span>
            )}
            <span className="hidden text-xs text-ink-soft sm:block">{t.brandSub}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className="rounded-full px-4 py-2 font-semibold text-ink-soft transition hover:text-paithani aria-[current=page]:bg-cream-deep aria-[current=page]:text-plum"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-white p-0.5 shadow-sm" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocalePath(pathname, l)}
                onClick={() => rememberLocale(l)}
                aria-current={l === lang ? "true" : undefined}
                scroll={false}
                className="min-w-12 rounded-full px-3 py-1.5 text-center text-sm font-semibold text-ink-soft transition aria-current:bg-paithani aria-current:text-white"
              >
                {LANG_LABEL[l]}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.menu}
            className="grid size-10 place-items-center rounded-full border border-line bg-white text-plum md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-cream px-4 pb-4 pt-2 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              className="block rounded-xl px-4 py-3 text-lg font-semibold text-ink-soft aria-[current=page]:bg-cream-deep aria-[current=page]:text-plum"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
      <div className="zari h-1.5!" aria-hidden="true" />
    </header>
  );
}
