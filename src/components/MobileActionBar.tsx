import type { Dictionary } from "@/lib/dictionaries";
import type { Settings } from "@/lib/settings";
import { PhoneIcon } from "./Icons";
import { DownloadBrochure, telHrefFor } from "./Sections";

/** Thumb-reach actions pinned to the bottom on phones (hidden on md+). */
export function MobileActionBar({ t, settings }: { t: Dictionary; settings: Settings }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgb(74_13_46/.1)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md gap-2.5">
        <a
          href={telHrefFor(settings.phone)}
          className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-linear-to-br from-paithani to-plum py-3 font-semibold text-white active:scale-[.98]"
        >
          <PhoneIcon className="size-4.5" />
          {t.orderCall}
        </a>
        <DownloadBrochure
          label={t.brochureShort}
          settings={settings}
          variant="light"
          className="flex-1 px-0! py-3! text-sm hover:translate-y-0"
        />
      </div>
    </div>
  );
}
