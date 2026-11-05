"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoldDivider } from "./Ornament";
import { useReducedMotion } from "@/hooks/useMedia";
import { STORY } from "@/lib/wedding";

gsap.registerPlugin(ScrollTrigger);

export function Story() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-reveal").forEach((el) =>
        gsap.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }));
      gsap.utils.toArray<HTMLElement>(".story-img").forEach((el) =>
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 85%" } }));
      gsap.utils.toArray<HTMLElement>(".story-par").forEach((el) =>
        gsap.fromTo(el, { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="story" ref={root} className="relative overflow-hidden bg-ivory px-5 py-24 text-midnight sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="story-par relative">
            <div className="story-img relative aspect-[3/4] overflow-hidden">
              <Image src="/images/ring.jpg" alt="A diamond ring being placed on a henna-decorated hand" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" loading="lazy" />
            </div>
            <div className="pointer-events-none absolute -inset-3 border border-antique/50 sm:-inset-4" />
          </div>
          <div className="story-par absolute -bottom-12 -right-3 hidden w-[58%] sm:block lg:-right-14">
            <div className="story-img relative aspect-[3/2] overflow-hidden border-[6px] border-ivory shadow-2xl">
              <Image src="/images/jeep-ride.jpg" alt="The couple riding in an open vehicle decorated with flowers" fill sizes="30vw" className="object-cover" loading="lazy" />
            </div>
          </div>
        </div>

        <div>
          <p className="story-reveal font-script text-5xl text-antique sm:text-6xl">{STORY.subheading}</p>
          <h2 className="story-reveal mt-3 font-display text-4xl font-medium leading-[1.1] text-burgundy sm:text-5xl lg:text-6xl">{STORY.heading}</h2>
          <GoldDivider className="story-reveal my-8 !justify-start text-antique" />
          <div className="space-y-5 font-display text-xl leading-relaxed text-midnight/85 sm:text-[1.4rem] sm:leading-[1.7]">
            {STORY.paragraphs.map((p) => <p key={p} className="story-reveal max-w-[60ch]">{p}</p>)}
          </div>
          <p className="story-reveal mt-10 font-serif text-xl italic text-burgundy sm:text-2xl">{STORY.closing}</p>
          <p className="story-reveal mt-3 max-w-[48ch] font-display text-lg text-midnight/75">{STORY.invite}</p>
        </div>
      </div>
    </section>
  );
}
