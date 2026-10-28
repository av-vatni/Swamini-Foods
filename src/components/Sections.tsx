import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import { BUSINESS } from "@/lib/business";
import { downloadHref } from "@/lib/drive";
import { formatPhone, localDigits } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { fill, formatDate, type Settings } from "@/lib/settings";
import { BrandWordmark } from "./BrandWordmark";
import { Diya } from "./Decor";
import { DownloadIcon, PhoneIcon, PinIcon, WalletIcon } from "./Icons";

export const telHrefFor = (phone: string) => `tel:+91${phone}`;

export function DownloadBrochure({ label, settings, variant = "outline", className = "" }: {
  label: string;
  settings: Settings;
  variant?: "outline" | "light" | "link";
  className?: string;
}) {
  const styles = {
    outline: "rounded-full border-[1.5px] border-zari bg-transparent px-6 py-3.5 text-zari-light hover:bg-white/10",
    light: "rounded-full border-[1.5px] border-paithani-light bg-paper px-6 py-3.5 text-plum hover:bg-white",
    link: "border-b border-dashed border-current text-paithani",
  };
  // Drive brochure (set from admin) or the bundled one
  const remote = downloadHref(settings.brochureUrl);
  return (
    <a
      href={remote ?? BUSINESS.brochure}
      download={remote ? undefined : BUSINESS.brochureFileName}
      {...(remote ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition hover:-translate-y-0.5 ${styles[variant]} ${className}`}
    >
      <DownloadIcon className="size-4.5" />
      {label}
    </a>
  );
}

/** Deadline / closed message, or null when neither applies. */
export function orderStatusText(t: Dictionary, lang: Locale, settings: Settings) {
  if (!settings.ordersOpen) return t.ordersClosed;
  if (settings.orderDeadline) return fill(t.deadline, { date: formatDate(settings.orderDeadline, lang) });
  return null;
}

/** Purple band: made-to-order note + order deadline. */
export function OrderBand({ t, lang, settings }: { t: Dictionary; lang: Locale; settings: Settings }) {
  const status = orderStatusText(t, lang, settings);
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_50%,rgb(244_166_29/.22),transparent_40%),radial-gradient(circle_at_90%_50%,rgb(244_166_29/.22),transparent_40%),linear-gradient(90deg,#3c2a8c,#5a2a8c_50%,#3c2a8c)] px-4 py-8 text-center text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <div className="flex gap-6" aria-hidden="true">
          <Diya /><Diya delay={-0.8} /><Diya delay={-1.6} />
        </div>
        <p className="text-lg font-medium">{t.orderNote}</p>
        {status && <p className="rounded-2xl bg-marigold px-5 py-1.5 font-bold text-plum">{status}</p>}
      </div>
    </section>
  );
}

export function ContactCard({ t, lang, settings, showMapLink = true }: {
  t: Dictionary;
  lang: Locale;
  settings: Settings;
  showMapLink?: boolean;
}) {
  const tel = telHrefFor(settings.phone);
  return (
    <div className="relative mx-auto max-w-2xl rounded-3xl border border-line bg-paper p-6 text-center shadow-card sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[20px] border border-zari/35" />
      <p className={lang === "mr" ? "font-display text-2xl text-paithani" : "text-2xl font-bold text-paithani"}>{t.owner}</p>

      <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
        <div className="flex gap-3 rounded-2xl bg-cream p-4 sm:col-span-2">
          <PinIcon className="mt-0.5 size-5 shrink-0 text-paithani" />
          <div>
            <p className="text-sm font-semibold text-ink-soft">{t.addressLabel}</p>
            <p>{t.address}</p>
            {showMapLink && (
              <a href={BUSINESS.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-paithani underline underline-offset-4">
                {t.mapTitle} ↗
              </a>
            )}
          </div>
        </div>
        <a href={tel} className="flex gap-3 rounded-2xl bg-cream p-4 transition hover:bg-cream-deep">
          <PhoneIcon className="mt-0.5 size-5 shrink-0 text-paithani" />
          <div>
            <p className="text-sm font-semibold text-ink-soft">{t.phoneLabel}</p>
            <p className="text-lg font-bold text-plum">{formatPhone(settings.phone, lang)}</p>
          </div>
        </a>
        <div className="flex gap-3 rounded-2xl bg-cream p-4">
          <WalletIcon className="mt-0.5 size-5 shrink-0 text-paithani" />
          <div>
            <p className="text-sm font-semibold text-ink-soft">{t.upi}</p>
            <p className="text-lg font-bold text-plum">{formatPhone(settings.upi, lang)}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex flex-col items-center gap-4">
        <a
          href={tel}
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-br from-paithani to-plum px-8 py-3.5 font-semibold text-white shadow-[0_6px_16px_rgb(74_13_46/.25)] transition hover:-translate-y-0.5"
        >
          <PhoneIcon /> {t.orderCall}
        </a>
        <DownloadBrochure label={t.downloadShare} settings={settings} variant="link" />
      </div>
    </div>
  );
}

export function Footer({ t, lang, settings }: { t: Dictionary; lang: Locale; settings: Settings }) {
  return (
    <footer className="mt-auto bg-night text-cream/85">
      <div className="zari" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div className="flex items-start gap-4">
          <Image src={BUSINESS.logo} alt="" width={160} height={160} className="size-20 shrink-0" />
          <div>
            {lang === "mr" ? (
              <BrandWordmark label={t.brand} className="block h-10 text-zari-light" />
            ) : (
              <p className="font-display text-2xl text-zari-light">{t.brand}</p>
            )}
            <p className="mt-1 text-sm">{t.footerTagline}</p>
            <p className="mt-2 text-sm">{t.badges.veg}</p>
            {settings.fssai && <p className="text-sm">{t.fssaiLabel} {localDigits(settings.fssai, lang)}</p>}
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <Link href={`/${lang}/products`} className="hover:text-zari-light">{t.nav.products}</Link>
          <Link href={`/${lang}/about`} className="hover:text-zari-light">{t.nav.about}</Link>
          <Link href={`/${lang}/contact`} className="hover:text-zari-light">{t.nav.contact}</Link>
          <DownloadBrochure label={t.download} settings={settings} variant="link" className="self-start text-zari-light!" />
        </nav>
        <div className="text-sm">
          <p>{t.address}</p>
          <a href={telHrefFor(settings.phone)} className="mt-2 inline-block font-semibold text-zari-light">{formatPhone(settings.phone, lang)}</a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-4 text-sm text-cream/60 sm:flex-row sm:justify-between sm:px-6">
          <p className="text-center">{t.footerWish} · {t.brand} · {t.city}</p>
          <a
            href="https://mulsetu.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-xs text-cream/40 transition hover:text-cream/80"
          >
            Powered by
            <span
              aria-hidden="true"
              className="inline-block h-3 aspect-[1473/1074] bg-current"
              style={{
                mask: "url(/brand/mulsetu-mark.svg) center / contain no-repeat",
                WebkitMask: "url(/brand/mulsetu-mark.svg) center / contain no-repeat",
              }}
            />
            Mulsetu Infotech
          </a>
        </div>
      </div>
    </footer>
  );
}
