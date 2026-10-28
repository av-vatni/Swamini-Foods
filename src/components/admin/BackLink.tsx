import Link from "next/link";

/** "← All products" link shown at the top of product screens. */
export function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/admin"
      className="mb-4 inline-flex items-center gap-1 rounded-full border border-line bg-white px-4 py-2 font-semibold text-plum shadow-sm transition hover:bg-cream-deep"
    >
      {label}
    </Link>
  );
}
