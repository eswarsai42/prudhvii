import type { Ornament as O } from "@/lib/events";

/** Hand-drawn style SVG motifs used as event card backgrounds and dividers. */
export function OrnamentArt({ kind, color, className = "" }: { kind: O; color: string; className?: string }) {
  const s = { stroke: color, fill: "none", strokeWidth: 1.2 } as const;
  const petals = (n: number, r: number, len: number) =>
    Array.from({ length: n }, (_, i) => (
      <ellipse key={i} cx="100" cy={100 - r} rx={len / 3} ry={len / 2} transform={`rotate(${(360 / n) * i} 100 100)`} {...s} />
    ));
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {kind === "marigold" && (<>{petals(16, 40, 44)}{petals(12, 22, 30)}<circle cx="100" cy="100" r="7" {...s} /></>)}
      {kind === "lotus" && (<>{petals(8, 38, 56)}{petals(8, 20, 34).map((p, i) => <g key={i} transform="rotate(22 100 100)">{p}</g>)}<circle cx="100" cy="100" r="6" {...s} /></>)}
      {kind === "sparkle" && (<>{[0, 45, 90, 135].map((a) => <path key={a} d="M100 20 L106 94 L100 100 L94 94 Z" transform={`rotate(${a} 100 100)`} {...s} />)}<circle cx="100" cy="100" r="60" {...s} strokeDasharray="2 6" /><circle cx="100" cy="100" r="82" {...s} /></>)}
      {kind === "moon" && (<><path d="M130 30 A72 72 0 1 0 170 130 A58 58 0 1 1 130 30 Z" {...s} />{[[40,40],[60,24],[28,86],[160,50],[150,168]].map(([x,y],i)=><path key={i} d={`M${x} ${y-5} L${x+1.5} ${y-1.5} L${x+5} ${y} L${x+1.5} ${y+1.5} L${x} ${y+5} L${x-1.5} ${y+1.5} L${x-5} ${y} L${x-1.5} ${y-1.5}Z`} {...s} />)}</>)}
      {kind === "sun" && (<><circle cx="100" cy="100" r="38" {...s} />{Array.from({ length: 24 }, (_, i) => <line key={i} x1="100" y1="44" x2="100" y2={i % 2 ? 30 : 18} transform={`rotate(${(360 / 24) * i} 100 100)`} {...s} />)}</>)}
      {kind === "temple" && (<><path d="M30 170 H170 M44 170 V120 H156 V170 M58 120 V90 H142 V120 M74 90 V64 H126 V90 M90 64 V42 H110 V64 M100 42 V24" {...s} />{[62,82,118,138].map((x)=><path key={x} d={`M${x-6} 170 V140 a6 6 0 0 1 12 0 V170`} {...s} />)}</>)}
    </svg>
  );
}

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 text-champagne ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-champagne/70 sm:w-28" />
      <svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 1 L13.5 8.5 L21 11 L13.5 13.5 L11 21 L8.5 13.5 L1 11 L8.5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-champagne/70 sm:w-28" />
    </div>
  );
}
