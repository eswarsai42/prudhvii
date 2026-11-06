"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EventCard } from "./EventCard";
import { EventOverlay } from "./EventOverlay";
import { TimelinePhoto } from "./TimelinePhoto";
import { TIMELINE_PHOTOS } from "@/lib/timeline";
import { GoldDivider } from "./Ornament";
import { EVENTS, type WeddingEvent } from "@/lib/events";
import { useNow } from "@/hooks/useCountdown";
import { useReducedMotion } from "@/hooks/useMedia";

gsap.registerPlugin(ScrollTrigger);

export function Schedule() {
  const root = useRef<HTMLElement>(null);
  const now = useNow(30_000);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<WeddingEvent | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (reduced) { gsap.set(".tl-line-fill", { scaleY: 1 }); return; }
      gsap.fromTo(".tl-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-wrap", start: "top 60%", end: "bottom 70%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el, i) => {
        const fromLeft = window.innerWidth >= 1024 ? (i % 2 === 0 ? -60 : 60) : 0;
        gsap.fromTo(el.querySelector(".event-card"), { opacity: 0, x: fromLeft, y: 50 }, { opacity: 1, x: 0, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } });
        gsap.fromTo(el.querySelector(".tl-dot"), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 80%" } });
        const photo = el.querySelector<HTMLElement>(".tl-photo");
        const reveal = el.querySelector<HTMLElement>(".tl-reveal");
        const img = el.querySelector<HTMLElement>(".tl-img");
        if (photo && reveal) {
          const circle = photo.dataset.variant === "circle";
          const dir = window.innerWidth >= 1024 ? (i % 2 === 0 ? 1 : -1) : 0; // photo sits opposite the card
          gsap.fromTo(photo, { opacity: 0, x: dir * 50, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: photo, start: "top 88%", onEnter: () => reveal.classList.add("shine-go") } });
          gsap.fromTo(reveal, { clipPath: circle ? "circle(0% at 50% 50%)" : "inset(0 0 100% 0)" }, { clipPath: circle ? "circle(75% at 50% 50%)" : "inset(0 0 0% 0)", duration: 1.5, ease: "power4.inOut", scrollTrigger: { trigger: photo, start: "top 88%" } });
          if (img) { gsap.set(img, { scale: 1.16 }); gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } }); }
        }
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="celebrations" ref={root} className="relative overflow-hidden bg-midnight px-5 py-24 text-ivory sm:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,16,37,.55),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-script text-5xl text-champagne sm:text-6xl">Eleven Celebrations</p>
          <h2 className="mt-2 font-display text-4xl font-light sm:text-6xl">The Wedding Celebration Schedule</h2>
          <GoldDivider className="my-7" />
          <p className="mx-auto max-w-xl font-display text-lg text-ivory/75 sm:text-xl">Tap any celebration for its details and directions. All timings are India Standard Time.</p>
        </header>

        <ol className="tl-wrap relative mt-20 space-y-14 sm:space-y-20 lg:space-y-16">
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-champagne/20 lg:left-1/2 lg:-translate-x-1/2">
            <span className="tl-line-fill absolute inset-0 origin-top bg-gradient-to-b from-champagne via-champagne to-antique" />
          </span>
          {EVENTS.map((e, i) => {
            const photo = TIMELINE_PHOTOS[e.id];
            const cardCol = i % 2 ? "lg:col-start-2" : "lg:col-start-1";
            const photoCol = i % 2 ? "lg:col-start-1" : "lg:col-start-2";
            return (
              <li key={e.id} className="tl-item relative space-y-8 pl-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-24 lg:space-y-0 lg:pl-0">
                <span aria-hidden className="tl-dot absolute left-0 top-8 h-[23px] w-[23px] rounded-full border-2 border-champagne bg-midnight lg:left-1/2 lg:top-1/2 lg:-ml-[11px] lg:-mt-[11px]">
                  <span className="absolute inset-1 rounded-full bg-champagne" />
                </span>
                <div className={`${cardCol} lg:row-start-1`}>
                  <EventCard event={e} now={now} onOpen={(ev, o) => { setOrigin(o); setOpen(ev); }} />
                </div>
                {photo && <div className={`${photoCol} py-3 lg:row-start-1 lg:py-0`}><TimelinePhoto photo={photo} index={i} /></div>}
              </li>
            );
          })}
        </ol>
      </div>
      <EventOverlay event={open} origin={origin} now={now} onClose={() => setOpen(null)} />
    </section>
  );
}
