"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Particles } from "./Particles";
import { GoldDivider } from "./Ornament";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMedia";
import { COUPLE, VEERLABS } from "@/lib/wedding";

gsap.registerPlugin(ScrollTrigger);
const Rings3D = dynamic(() => import("./Rings3D"), { ssr: false });

export function Closing() {
  const root = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 55%" }, defaults: { ease: "power3.out" } });
      tl.fromTo(".cl-initial", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: 0.2 })
        .fromTo(".cl-line", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.25 }, "-=0.6")
        .fromTo(".cl-sign", { opacity: 0 }, { opacity: 1, duration: 1.6 }, "-=0.3");
      gsap.to(".cl-bg", { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} aria-labelledby="closing-title" className="relative overflow-hidden bg-midnight text-ivory">
      <div className="relative flex min-h-[100svh] items-center justify-center px-5 py-28 text-center">
        <div className="cl-bg absolute -inset-y-[6%] inset-x-0">
          <Image src="/images/entrance.jpg" alt="" fill sizes="100vw" loading="lazy" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/90 via-midnight/70 to-midnight/95" />
        <Particles density={0.9} />
        {desktop && !reduced && <div className="pointer-events-none absolute right-[6%] top-[14%] hidden h-56 w-72 opacity-90 lg:block"><Rings3D /></div>}

        <div className="relative max-w-3xl">
          <div className="flex items-baseline justify-center gap-4 font-display text-8xl font-light text-champagne sm:text-[9rem]" aria-label={`${COUPLE.initials[0]} and ${COUPLE.initials[1]}`}>
            <span className="cl-initial">{COUPLE.initials[0]}</span><span className="cl-initial font-serif text-5xl italic text-ivory/70 sm:text-7xl">&amp;</span><span className="cl-initial">{COUPLE.initials[1]}</span>
          </div>
          <h2 id="closing-title" className="mt-8 font-display text-3xl font-light leading-snug sm:text-5xl">
            <span className="cl-line block">Some Moments Become Memories.</span>
            <span className="cl-line mt-1 block italic text-champagne">Some Memories Become Forever.</span>
          </h2>
          <GoldDivider className="cl-line my-9" />
          <p className="cl-line font-display text-xl text-ivory/85 sm:text-2xl">Thank you for being part of our beautiful journey.</p>
          <p className="cl-line mt-10 text-xs tracking-[0.4em] text-champagne">WITH LOVE,</p>
          <p className="cl-line mt-4 font-serif text-lg tracking-[0.18em] sm:text-2xl">{COUPLE.groom.toUpperCase()}<br /><span className="font-display text-3xl italic text-champagne">&amp;</span><br />{COUPLE.bride.toUpperCase()}</p>
        </div>
      </div>
      <p className="cl-sign border-t border-champagne/15 bg-midnight py-5 text-center text-[11px] tracking-[0.3em] text-ivory/50">
        THIS CELEBRATION, ONLINE · CRAFTED BY <a href={VEERLABS.url} target="_blank" rel="noopener noreferrer" className="text-champagne/80 underline-offset-4 transition hover:text-champagne hover:underline">{VEERLABS.name}</a>
      </p>
    </section>
  );
}
