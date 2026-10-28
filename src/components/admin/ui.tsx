"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { AdminDict } from "@/lib/admin-i18n";
import { imageSrc, isDriveLink } from "@/lib/drive";

/** Submit button that shows a spinner while its form is saving. */
export function SubmitButton({
  children,
  pendingText = "…",
  className = "",
  variant = "primary",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingText?: string; variant?: "primary" | "ghost" | "danger" }) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-linear-to-br from-paithani to-plum text-white shadow-[0_6px_16px_rgb(74_13_46/.22)]",
    ghost: "border border-line bg-white text-plum hover:bg-cream-deep",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button
      type="submit"
      disabled={pending || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition disabled:opacity-60 ${styles[variant]} ${className}`}
      {...rest}
    >
      {/* Fixed structure (spinner always mounted, text wrapped in a span) so browser translation
          or extensions that rewrite text nodes can't make React's DOM updates crash. */}
      <span
        aria-hidden="true"
        className={`size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${pending ? "" : "hidden"}`}
      />
      <span>{pending ? pendingText : children}</span>
    </button>
  );
}

export function Notice({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`rounded-2xl border px-4 py-3 font-semibold ${state.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}
    >
      {state.message}
    </p>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-sm text-ink-soft">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink outline-none transition focus:border-paithani-light focus:ring-2 focus:ring-paithani-light/20";

/** Google Drive link input with a live preview so the admin can confirm sharing works. */
export function DriveLinkField({
  name,
  label,
  defaultValue,
  t,
  previewHeight = "h-40",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  t: Pick<AdminDict, "driveHint" | "notDrive" | "previewBroken">;
  previewHeight?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [broken, setBroken] = useState(false);
  const src = imageSrc(value, 600);

  return (
    <div className="flex flex-col gap-2">
      <Field
        label={label}
        hint={t.driveHint}
      >
        <input
          name={name}
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => { setValue(e.target.value); setBroken(false); }}
          placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
          className={inputClass}
        />
      </Field>

      {value && !isDriveLink(value) && (
        <p className="text-sm font-semibold text-amber-700">{t.notDrive}</p>
      )}

      {src && (
        <div className={`relative overflow-hidden rounded-2xl border border-line bg-cream-deep ${previewHeight}`}>
          {broken ? (
            <p className="grid size-full place-items-center p-4 text-center text-sm font-semibold text-red-700">
              {t.previewBroken}
            </p>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- live preview of an arbitrary pasted link
            <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="size-full object-contain" />
          )}
        </div>
      )}
    </div>
  );
}
