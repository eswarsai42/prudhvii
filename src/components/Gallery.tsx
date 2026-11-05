"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GoldDivider } from "./Ornament";
import { GALLERY, GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/gallery";
import { lockScroll } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const [cat, setCat] = useState<GalleryCategory>("Engagement");
  const [index, setIndex] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const photos = GALLERY[cat];

  useEffect(() => {
    if (!grid.current || reduced) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".g-item", {
        start: "top 92%", once: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40, clipPath: "inset(12% 0 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 1, stagger: 0.12, ease: "power3.out" }),
      });
    }, grid);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => { clearTimeout(t); ctx.revert(); };
  }, [cat, reduced]);

  return (
    <section id="gallery" className="relative bg-ivory px-5 py-24 text-midnight sm:py-36">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="font-script text-5xl text-antique sm:text-6xl">The Wedding Journal</p>
          <h2 className="mt-2 font-display text-4xl font-light text-burgundy sm:text-6xl">Moments, Collected</h2>
          <GoldDivider className="my-7 text-antique" />
        </header>

        <div role="tablist" aria-label="Gallery collections" className="mx-auto -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {GALLERY_CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={cn("shrink-0 rounded-full border px-5 py-2 text-xs tracking-[0.2em] transition", cat === c ? "border-burgundy bg-burgundy text-champagne" : "border-antique/50 text-burgundy hover:border-burgundy")}>
              {c.toUpperCase()}{GALLERY[c].length === 0 && <span className="ml-1.5 opacity-50">·&nbsp;soon</span>}
            </button>
          ))}
        </div>

        <div ref={grid} className="mt-10" role="tabpanel" aria-label={`${cat} photographs`}>
          {photos.length === 0 ? (
            <div className="mx-auto max-w-lg border border-dashed border-antique/60 px-8 py-20 text-center">
              <p className="font-display text-2xl italic text-burgundy">{cat} photographs will appear here.</p>
              <p className="mt-2 text-sm text-midnight/60">Add them to <code className="rounded bg-burgundy/5 px-1.5 py-0.5">src/lib/gallery.ts</code> once the photographer shares them.</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((p, i) => (
                <button key={p.src} onClick={() => setIndex(i)} className="g-item group relative mb-4 block w-full overflow-hidden bg-burgundy/10 text-left" aria-label={`Open photograph ${i + 1} of ${photos.length}`}>
                  <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" loading="lazy"
                    className="h-auto w-full transition duration-[1200ms] ease-out group-hover:scale-[1.05]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-burgundy/60 via-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 translate-y-3 font-display text-lg italic text-ivory opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">View</span>
                </button>
              ))}
            </div>
          )}
          <p className="mt-8 text-center text-xs tracking-[0.18em] text-midnight/50">PHOTOGRAPHY · MUSE MOMENT MAKERS</p>
        </div>
      </div>
      <Lightbox photos={photos} index={index} setIndex={setIndex} />
    </section>
  );
}

function Lightbox({ photos, index, setIndex }: { photos: { src: string; alt: string; w: number; h: number; lowRes?: boolean }[]; index: number | null; setIndex: (i: number | null) => void }) {
  const [dir, setDir] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const go = useCallback((d: number) => {
    setDir(d);
    setIndex(index === null ? null : (index + d + photos.length) % photos.length);
  }, [index, photos.length, setIndex]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true); closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); lockScroll(false); };
  }, [open, go, setIndex]);

  const p = index !== null ? photos[index] : null;
  return (
    <AnimatePresence>
      {p && (
        <motion.div role="dialog" aria-modal="true" aria-label="Photograph viewer" className="fixed inset-0 z-[85] flex items-center justify-center bg-midnight/95"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setIndex(null)}>
          <button ref={closeRef} onClick={() => setIndex(null)} aria-label="Close viewer" className="absolute right-4 top-4 z-10 rounded-full border border-champagne/40 p-3 text-champagne hover:bg-champagne/10"><X size={20} /></button>
          {photos.length > 1 && (<>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photograph" className="absolute left-3 z-10 rounded-full border border-champagne/40 p-3 text-champagne hover:bg-champagne/10 sm:left-8"><ChevronLeft size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photograph" className="absolute right-3 z-10 rounded-full border border-champagne/40 p-3 text-champagne hover:bg-champagne/10 sm:right-8"><ChevronRight size={22} /></button>
          </>)}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure key={p.src} custom={dir} className="flex max-h-[88vh] max-w-[92vw] flex-col items-center"
              initial={{ opacity: 0, x: dir * 60, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
              onDragEnd={(_, i) => { if (i.offset.x < -80) go(1); else if (i.offset.x > 80) go(-1); }}
              onClick={(e) => e.stopPropagation()}>
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} priority sizes="92vw"
                style={p.lowRes ? { maxWidth: `min(92vw, ${p.w * 1.6}px)` } : undefined}
                className="max-h-[80vh] w-auto max-w-[92vw] object-contain shadow-2xl" />
              <figcaption className="mt-4 max-w-xl text-center font-display text-lg italic text-ivory/80">{p.alt}<span className="ml-3 text-sm not-italic tracking-[0.2em] text-champagne">{(index ?? 0) + 1} / {photos.length}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
