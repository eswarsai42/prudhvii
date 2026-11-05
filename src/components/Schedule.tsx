"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EventCard } from "./EventCard";
import { EventOverlay } from "./EventOverlay";
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

        <ol className="tl-wrap relative mt-20 space-y-10 sm:space-y-14 lg:space-y-0">
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-champagne/20 lg:left-1/2 lg:-translate-x-1/2">
            <span className="tl-line-fill absolute inset-0 origin-top bg-gradient-to-b from-champagne via-champagne to-antique" />
          </span>
          {EVENTS.map((e, i) => (
            <li key={e.id} className={`tl-item relative pl-10 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0 ${i > 0 ? "lg:-mt-16" : ""}`}>
              <span aria-hidden className="tl-dot absolute left-0 top-8 h-[23px] w-[23px] rounded-full border-2 border-champagne bg-midnight lg:left-1/2 lg:-ml-[11px]">
                <span className="absolute inset-1 rounded-full bg-champagne" />
              </span>
              <div className={i % 2 ? "lg:col-start-2" : "lg:col-start-1"}>
                <EventCard event={e} now={now} onOpen={(ev, o) => { setOrigin(o); setOpen(ev); }} />
              </div>
            </li>
          ))}
        </ol>
      </div>
      <EventOverlay event={open} origin={origin} now={now} onClose={() => setOpen(null)} />
    </section>
  );
}
