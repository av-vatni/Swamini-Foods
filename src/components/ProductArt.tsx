import Image from "next/image";
import { imageSrc } from "@/lib/drive";
import type { Product } from "@/lib/products";

/** Product photo if available, otherwise a category illustration. */
export function ProductArt({ product, alt, className = "", sizes = "(max-width: 640px) 50vw, 25vw" }: {
  product: Product;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const src = imageSrc(product.image, 1000);
  return (
    <div className={`art-${product.category} art-bg relative grid place-items-center overflow-hidden ${className}`}>
      {src ? (
        // Drive images are already resized by Google, so skip Next's optimizer.
        // Google answers 429 to Drive image requests that carry another site's Referer.
        <Image src={src} alt={alt} fill sizes={sizes} unoptimized={!src.startsWith("/")} referrerPolicy="no-referrer" className="object-cover" />
      ) : (
        <CategoryIcon category={product.category} />
      )}
    </div>
  );
}

function CategoryIcon({ category }: { category: Product["category"] }) {
  const cls = "relative w-[38%] max-w-28 drop-shadow-sm";
  if (category === "sweet")
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className={cls}>
        <ellipse cx="32" cy="51" rx="25" ry="6" fill="var(--ic-dark)" opacity=".3" />
        <circle cx="21" cy="40" r="10.5" fill="var(--ic)" />
        <circle cx="43" cy="40" r="10.5" fill="var(--ic)" />
        <circle cx="32" cy="25" r="10.5" fill="var(--ic)" />
        <g fill="var(--ic-dark)" opacity=".5">
          <circle cx="18" cy="37" r="1.3" /><circle cx="24" cy="44" r="1.3" /><circle cx="40" cy="37" r="1.3" />
          <circle cx="46" cy="44" r="1.3" /><circle cx="29" cy="22" r="1.3" /><circle cx="35" cy="28" r="1.3" />
        </g>
      </svg>
    );
  if (category === "namkeen")
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className={cls}>
        <path
          d="M32 32a2 2 0 0 1 2 2 4 4 0 0 1-4 4 6 6 0 0 1-6-6 8 8 0 0 1 8-8 10 10 0 0 1 10 10 12 12 0 0 1-12 12 14 14 0 0 1-14-14 16 16 0 0 1 16-16 18 18 0 0 1 18 18"
          fill="none" stroke="var(--ic)" strokeWidth="4.5" strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cls}>
      <path d="M20 22h24l4 30a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z" fill="var(--ic)" />
      <path d="M18 22c4-6 24-6 28 0z" fill="var(--ic-dark)" opacity=".35" />
      <path d="M24 34h16M24 42h16" stroke="var(--ic-dark)" strokeWidth="2" opacity=".5" strokeLinecap="round" />
    </svg>
  );
}
