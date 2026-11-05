"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { X, Navigation, MapPin, Clock, CalendarDays } from "lucide-react";
import { OrnamentArt } from "./Ornament";
import { StatusBadge } from "./EventCard";
import { dateLabelFull, type WeddingEvent } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useMedia";

interface Props { event: WeddingEvent | null; origin: { x: number; y: number }; now: number | null; onClose: () => void }

export function EventOverlay({ event, origin, now, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const closing = useRef(false);

  const close = () => {
    if (closing.current || !root.current) return;
    closing.current = true;
    if (reduced) return onClose();
    gsap.timeline({ onComplete: onClose })
      .to(".ov-in", { opacity: 0, y: -16, duration: 0.25, stagger: 0.03 })
      .to(root.current, { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`, duration: 0.7, ease: "power3.inOut" }, 0.1);
  };

  useEffect(() => {
    if (!event || !root.current) return;
    closing.current = false;
    const prev = document.activeElement as HTMLElement | null;
    lockScroll(true);
    closeBtn.current?.focus();
    const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
    if (reduced) gsap.set(root.current, { clipPath: "none" });
    else {
      gsap.fromTo(root.current, { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }, { clipPath: `circle(${r}px at ${origin.x}px ${origin.y}px)`, duration: 0.9, ease: "power3.inOut" });
      gsap.fromTo(".ov-in", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, delay: 0.5, ease: "power3.out" });
      gsap.fromTo(".ov-orn", { rotate: -40, opacity: 0 }, { rotate: 0, opacity: 0.35, duration: 1.8, delay: 0.3, ease: "power2.out" });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>("a,button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); lockScroll(false); prev?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  if (!event) return null;
  const t = event.theme;
  return (
    <div
      ref={root} role="dialog" aria-modal="true" aria-labelledby="event-title"
      className="fixed inset-0 z-[80] overflow-y-auto"
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})`, color: t.ink }}
    >
      {event.image && <Image src={event.image} alt="" fill sizes="100vw" className="object-cover opacity-25 mix-blend-multiply" />}
      <OrnamentArt kind={t.ornament} color={t.accent} className="ov-orn pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] opacity-0" />
      <button ref={closeBtn} onClick={close} aria-label="Close event details"
        className="fixed right-5 top-5 z-10 rounded-full border p-3 transition hover:bg-black/10 sm:right-8 sm:top-8" style={{ borderColor: `${t.ink}55` }}><X size={22} /></button>

      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-24 text-center">
        <div className="ov-in"><StatusBadge event={event} now={now} /></div>
        <h2 id="event-title" className="ov-in mt-5 font-serif text-4xl leading-tight sm:text-6xl">{event.title}</h2>
        <p className="ov-in mt-3 font-display text-2xl italic opacity-85">{event.tagline}</p>
        <div className="ov-in mx-auto my-9 h-px w-40" style={{ background: t.accent }} />
        <dl className="ov-in mx-auto grid gap-5 text-left sm:grid-cols-3 sm:text-center">
          <div><CalendarDays className="mb-2 sm:mx-auto" size={20} style={{ color: t.accent }} /><dt className="text-[11px] tracking-[0.22em] opacity-70">DATE</dt><dd className="mt-1 font-display text-2xl">{dateLabelFull(event)}</dd></div>
          <div><Clock className="mb-2 sm:mx-auto" size={20} style={{ color: t.accent }} /><dt className="text-[11px] tracking-[0.22em] opacity-70">TIME</dt><dd className="mt-1 font-display text-2xl">{event.time}{event.session ? <span className="block text-base opacity-75">{event.session}</span> : null}</dd></div>
          <div><MapPin className="mb-2 sm:mx-auto" size={20} style={{ color: t.accent }} /><dt className="text-[11px] tracking-[0.22em] opacity-70">LOCATION</dt><dd className="mt-1 font-display text-2xl">{event.location}<span className="block text-base opacity-75">Venue details to be announced</span></dd></div>
        </dl>
        <p className="ov-in mx-auto mt-10 max-w-xl font-display text-xl leading-relaxed opacity-90">{event.description}</p>
        <div className="ov-in mt-10 flex flex-wrap justify-center gap-4">
          {event.maps.map((m) => (
            <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs tracking-[0.22em] transition hover:opacity-90" style={{ background: t.ink, color: t.from }}>
              <Navigation size={14} />NAVIGATE{event.maps.length > 1 ? ` · ${m.label.toUpperCase()}` : ""}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
