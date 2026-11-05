"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMedia";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!desktop || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 }), dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: reduced ? 0.01 : 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: reduced ? 0.01 : 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
      const hot = (e.target as HTMLElement)?.closest("a,button,input,textarea,select,label,[data-cursor]");
      gsap.to(ring.current, { scale: hot ? 1.8 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave);
    };
  }, [desktop, reduced]);

  if (!desktop) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-champagne/80 opacity-0" />
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-champagne opacity-0" />
    </div>
  );
}
