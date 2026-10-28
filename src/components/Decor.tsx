/* Decorative, purely visual pieces (no client JS). */

export function Diya({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span aria-hidden="true" className={`relative inline-block h-4 w-10 shrink-0 ${className}`}>
      {/* flame */}
      <span
        className="absolute bottom-full left-1/2 mb-px h-5 w-2.5 -translate-x-1/2 origin-bottom animate-flicker rounded-[50%_50%_50%_50%/65%_65%_35%_35%] bg-[radial-gradient(ellipse_at_50%_70%,#fff6c8_0%,#ffd23f_40%,#ff8c1a_80%)] shadow-[0_0_16px_5px_rgb(255_190_60/.45)]"
        style={{ animationDelay: `${delay}s` }}
      />
      {/* rim */}
      <span className="absolute -inset-x-0.5 -top-1 h-1.5 rounded-[50%] bg-[#f4a259]" />
      {/* bowl */}
      <span className="absolute inset-0 rounded-b-full bg-linear-to-b from-[#e0782a] to-[#a94812]" />
    </span>
  );
}

/** Concentric rangoli built from petal rings. */
export function Rangoli({ className = "", centerDisc = true }: { className?: string; centerDisc?: boolean }) {
  const ring = (count: number, radius: number, rx: number, ry: number, fill: string, offset = 0) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i + offset;
      return (
        <ellipse
          key={`${radius}-${i}`}
          cx="0"
          cy={-radius}
          rx={rx}
          ry={ry}
          fill={fill}
          transform={`rotate(${angle})`}
        />
      );
    });
  const dots = (count: number, radius: number, r: number, fill: string) =>
    Array.from({ length: count }, (_, i) => (
      <circle key={`d${radius}-${i}`} cx="0" cy={-radius} r={r} fill={fill} transform={`rotate(${(360 / count) * i})`} />
    ));

  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" className={`overflow-hidden ${className}`}>
      {/* Spins around its own centre (0,0); fill-box keeps it from swinging off-screen. */}
      <g className="animate-spin-slow" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        {dots(48, 95, 1.5, "#f0d48a")}
        {ring(16, 76, 8.5, 17, "#b8336f", 0)}
        {ring(16, 76, 3.8, 9, "#f0d48a", 0)}
        {dots(16, 61, 2.3, "#f4a61d")}
        {ring(12, 50, 8.5, 13, "#f4a61d", 15)}
        {ring(12, 50, 3.3, 7, "#fff3d1", 15)}
        {ring(10, 33, 6, 9, "#e8781a", 0)}
      </g>
      {centerDisc && (
        <>
          <circle r="23" fill="#4a0d2e" />
          <circle r="23" fill="none" stroke="#f0d48a" strokeWidth="1.4" strokeDasharray="2 3" />
        </>
      )}
    </svg>
  );
}

export function SectionHeading({ title, sub, light = false }: { title: string; sub?: string; light?: boolean }) {
  return (
    <div className="mb-8 text-center">
      <span aria-hidden="true" className="mb-1 block tracking-[.6em] text-zari">✦✦✦</span>
      <h2 className={`font-display text-3xl sm:text-4xl ${light ? "text-zari-light" : "text-plum"}`}>{title}</h2>
      <div className="marigold-rule mt-3" />
      {sub && <p className={`mt-3 ${light ? "text-cream/80" : "text-ink-soft"}`}>{sub}</p>}
    </div>
  );
}
