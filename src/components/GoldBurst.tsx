"use client";
import { useEffect, useRef } from "react";

/** One-shot burst of golden particles from the centre of its parent. */
export function GoldBurst({ onDone }: { onDone?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pts = Array.from({ length: 150 }, () => {
      const a = Math.random() * Math.PI * 2, s = Math.random() * 5 + 1.2;
      return { x: w / 2, y: h / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, r: Math.random() * 2.4 + 0.6, life: 1, d: Math.random() * 0.012 + 0.008 };
    });
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.05; p.life -= p.d;
        if (p.life <= 0) continue; alive = true;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,232,160,${p.life})`); g.addColorStop(1, "rgba(214,180,106,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 7); ctx.fill();
      }
      if (alive) raf = requestAnimationFrame(tick); else onDone?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
