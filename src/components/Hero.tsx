"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { Particles } from "./Particles";
import { useExperience } from "./ExperienceProvider";
import { useReducedMotion } from "@/hooks/useMedia";
import { useCountdown } from "@/hooks/useCountdown";
import { COUPLE, WEDDING_DATE_LABEL, WEDDING_TARGET_ISO } from "@/lib/wedding";
import { scrollToId } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const { introDone } = useExperience();
  const reduced = useReducedMotion();
  const cd = useCountdown(WEDDING_TARGET_ISO);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.to(img.current, { yPercent: 12, scale: 1.12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (!introDone || !root.current) return;
    const ctx = gsap.context(() => {
      if (reduced) { gsap.set(".hero-in", { opacity: 1, y: 0 }); return; }
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(img.current, { scale: 1.25 }, { scale: 1.05, duration: 3, ease: "power2.out" }, 0)
        .fromTo(".hero-kicker", { opacity: 0, letterSpacing: "0.7em" }, { opacity: 1, letterSpacing: "0.38em", duration: 1.6 }, 0.3)
        .fromTo(".hero-name", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.18 }, 0.6)
        .fromTo(".hero-amp", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, 1.0)
        .fromTo(".hero-in", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 1.5);
    }, root);
    return () => ctx.revert();
  }, [introDone, reduced]);

  const cells = cd && !cd.done ? [["Days", cd.days], ["Hours", cd.hours], ["Minutes", cd.minutes], ["Seconds", cd.seconds]] as const : null;

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-midnight text-ivory">
      <div ref={img} className="absolute inset-0 will-change-transform">
        <Image src="/images/hero-garlands.jpg" alt="" fill priority sizes="100vw" className="hidden object-cover object-[50%_25%] md:block" />
        <Image src="/images/flowers.jpg" alt="" fill sizes="100vw" className="object-cover object-[52%_25%] md:hidden" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-transparent to-midnight/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(21,17,15,.65)_100%)]" />
      <div className="film-grain" aria-hidden />
      <Particles density={0.8} />

      <div className="hero-copy relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-16 pt-28 text-center sm:pb-14">
        <p className="hero-kicker text-[11px] tracking-[0.38em] text-champagne opacity-0 sm:text-xs">THE WEDDING CELEBRATION</p>
        <h1 className="mt-5 font-display text-[clamp(1.5rem,3.6vw,3.6rem)] font-light leading-[0.98]">
          <span className="block overflow-hidden pb-2"><span className="hero-name block opacity-0">{COUPLE.groom.toUpperCase()}</span></span>
          <span className="hero-amp my-1 block font-serif text-[0.5em] italic text-champagne opacity-0">&amp;</span>
          <span className="block overflow-hidden pb-2"><span className="hero-name block opacity-0">{COUPLE.bride.toUpperCase()}</span></span>
        </h1>
        <p className="hero-in mt-5 hidden max-w-md font-display text-xl italic text-ivory/85 opacity-0 sm:block sm:text-2xl">A celebration of love, traditions and forever.</p>
        <div className="hero-in mt-5 flex items-center gap-5 opacity-0">
          <span className="h-px w-12 bg-champagne/60 sm:w-20" />
          <time dateTime="2027-02-20" className="font-serif text-sm tracking-[0.3em] text-champagne sm:text-base">{WEDDING_DATE_LABEL.toUpperCase()}</time>
          <span className="h-px w-12 bg-champagne/60 sm:w-20" />
        </div>
        <div className="hero-in mt-6 opacity-0" aria-live="off">
          {cells ? (
            <div className="flex gap-5 sm:gap-9">
              {cells.map(([label, v]) => (
                <div key={label} className="min-w-[3.4rem]">
                  <div className="font-display text-3xl tabular-nums text-ivory sm:text-5xl">{String(v).padStart(2, "0")}</div>
                  <div className="mt-1 text-[10px] tracking-[0.25em] text-champagne/80">{label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          ) : cd?.done ? <p className="font-display text-2xl italic text-champagne">Today we celebrate.</p> : <div className="h-12" />}
        </div>
      </div>

      <button onClick={() => scrollToId("story")} aria-label="Scroll to our story" className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-2 md:flex text-champagne/80 transition hover:text-champagne">
        <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
        <span className="relative block h-12 w-px overflow-hidden bg-champagne/25"><span className="scroll-line absolute inset-x-0 top-0 h-5 bg-champagne" /></span>
        <ChevronDown size={14} />
      </button>
    </section>
  );
}
