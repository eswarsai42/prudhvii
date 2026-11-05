"use client";
import { useEffect, useRef } from "react";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMedia";

/** Slow, sparse golden dust. Pauses off-screen, thinner on mobile, static-free under reduced motion. */
export function Particles({ className = "", density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = Math.round((desktop ? 70 : 26) * density);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.00006 + 0.00002, p: Math.random() * Math.PI * 2, d: (Math.random() - 0.5) * 0.00002,
    }));
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) { last = now; return; }
      const dt = Math.min(now - last, 50); last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.y -= p.s * dt; p.x += p.d * dt; p.p += 0.002 * dt;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(p.p));
        const g = ctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, p.r * 4);
        g.addColorStop(0, `rgba(240,208,128,${a})`); g.addColorStop(1, "rgba(214,180,106,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [reduced, desktop, density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
