import Image from "next/image";
import type { TimelinePhotoDef } from "@/lib/timeline";

const Spark = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 22 22" className={`absolute h-5 w-5 text-champagne ${className}`}><path d="M11 1 L13.5 8.5 L21 11 L13.5 13.5 L11 21 L8.5 13.5 L1 11 L8.5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
);

/** Photograph beside a timeline card. Variants give the column an editorial rhythm. */
export function TimelinePhoto({ photo, index }: { photo: TimelinePhotoDef; index: number }) {
  const { variant } = photo;
  const img = (sizes: string) => (
    <div className="tl-hover absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]">
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} loading="lazy" className="tl-img object-cover" style={{ objectPosition: photo.focus ?? "50% 50%" }} />
    </div>
  );
  const shine = <span aria-hidden className="shine absolute inset-0" />;

  if (variant === "circle")
    return (
      <figure data-variant="circle" className="tl-photo group relative mx-auto h-[15.5rem] w-[15.5rem] sm:h-[17rem] sm:w-[17rem]">
        <span aria-hidden className="absolute -inset-3 rounded-full border border-champagne/70" />
        <span aria-hidden className="absolute -inset-6 rounded-full border border-dashed border-champagne/35" />
        <div className="tl-reveal shine relative h-full w-full overflow-hidden rounded-full border-2 border-champagne/80">{img("280px")}{shine}</div>
        <Spark className="-right-8 top-2" /><Spark className="-left-9 bottom-8 scale-75" />
      </figure>
    );

  if (variant === "polaroid")
    return (
      <figure data-variant="polaroid" className="tl-photo group relative mx-auto w-[16.5rem] sm:w-[18.5rem]" style={{ transform: `rotate(${index % 2 ? 3 : -3}deg)` }}>
        <div className="bg-ivory p-3 pb-12 shadow-[0_28px_50px_-18px_rgba(0,0,0,.85)]">
          <div className="tl-reveal relative aspect-[4/3] overflow-hidden bg-burgundy/20">{img("300px")}{shine}</div>
          <p className="absolute inset-x-0 bottom-3 text-center font-script text-3xl leading-none text-burgundy">P &amp; H</p>
        </div>
        <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg] bg-champagne/60 shadow-sm" />
      </figure>
    );

  if (variant === "arch")
    return (
      <figure data-variant="arch" className="tl-photo group relative mx-auto w-[16rem] sm:w-[18.5rem]">
        <span aria-hidden className="absolute -inset-2.5 rounded-t-[999px] border border-champagne/70" />
        <div className="tl-reveal relative aspect-[3/4.1] overflow-hidden rounded-t-[999px] border border-champagne/60">{img("300px")}{shine}</div>
        <Spark className="-left-6 top-10" />
      </figure>
    );

  if (variant === "editorial")
    return (
      <figure data-variant="editorial" className="tl-photo group relative mx-auto w-[16.5rem] sm:w-[19rem]">
        <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 border border-champagne/70" />
        <span aria-hidden className="absolute -left-3 -top-3 h-14 w-14 border-l-2 border-t-2 border-champagne" />
        <span aria-hidden className="absolute -bottom-3 -right-3 h-14 w-14 border-b-2 border-r-2 border-champagne" />
        <div className="tl-reveal relative aspect-[4/5] overflow-hidden">{img("320px")}{shine}</div>
      </figure>
    );

  if (variant === "portrait")
    return (
      <figure data-variant="portrait" className="tl-photo group relative mx-auto w-[16.5rem] sm:w-[19rem]">
        <span aria-hidden className="absolute -inset-2.5 border border-champagne/60" />
        <div className="tl-reveal relative aspect-[3/4] overflow-hidden border border-champagne/50">{img("320px")}{shine}</div>
        <Spark className="-right-7 -top-7" />
      </figure>
    );

  // landscape: cinematic wide crop with letterbox bars
  return (
    <figure data-variant="landscape" className="tl-photo group relative mx-auto w-full max-w-[32rem]">
      <span aria-hidden className="absolute -inset-2 border border-champagne/55" />
      <div className="tl-reveal relative aspect-[16/10] overflow-hidden">
        {img("(min-width:1024px) 480px, 90vw")}{shine}
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/45 via-transparent to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-2 border border-champagne/40" />
      </div>
    </figure>
  );
}
