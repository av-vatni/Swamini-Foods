/**
 * "स्वामिनी गृह उद्योग" in the brand's calligraphic lettering, traced from the
 * brochure. The SVG is used as a mask, so it takes the current text colour.
 * Size it by height (e.g. `h-8`); the width follows the artwork's ratio.
 */
export function BrandWordmark({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block aspect-[3328/684] bg-current align-middle ${className}`}
      style={{
        mask: "url(/brand/swamini-wordmark.svg) center / contain no-repeat",
        WebkitMask: "url(/brand/swamini-wordmark.svg) center / contain no-repeat",
      }}
    />
  );
}
