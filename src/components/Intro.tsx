"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useExperience } from "./ExperienceProvider";
import { Particles } from "./Particles";
import { GoldDivider } from "./Ornament";
import { useReducedMotion } from "@/hooks/useMedia";
import { COUPLE } from "@/lib/wedding";

type Phase = "loading" | "envelope" | "open";
const SEEN = "rw-intro-seen";

export function Intro() {
  const { introDone, finishIntro, music } = useExperience();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const [lit, setLit] = useState(false);
  const [flap, setFlap] = useState(false);
  
  const enter = useCallback(() => {
    music.startIfPreferred();
    try { sessionStorage.setItem(SEEN, "1"); } catch {}
    finishIntro();
  }, [music, finishIntro]);

  const skip = useCallback(() => {
    try { sessionStorage.setItem(SEEN, "1"); } catch {}
    finishIntro();
  }, [finishIntro]);

  // Returning visitors in the same session go straight in.
  useEffect(() => {
    try { if (sessionStorage.getItem(SEEN)) finishIntro(); } catch {}
  }, [finishIntro]);

  // Preload the hero photograph while the loading screen shows its progress line.
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.src = "/images/hero-garlands.jpg";
    const started = performance.now();
    const minMs = reduced ? 300 : 1800;
    let imgReady = false;
    img.onload = img.onerror = () => { imgReady = true; };
    const id = setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / minMs);
      setProgress(imgReady ? t : Math.min(t, 0.9));
      if (t >= 1 && (imgReady || performance.now() - started > 4000)) {
        clearInterval(id);
        if (!cancelled) setPhase("envelope");
      }
    }, 60);
    return () => { cancelled = true; clearInterval(id); };
  }, [reduced]);

  useEffect(() => {
    if (phase !== "envelope") return;
    const a = setTimeout(() => setLit(true), reduced ? 0 : 800);
    const f = setTimeout(() => setFlap(true), reduced ? 0 : 2000);
    const b = setTimeout(() => setPhase("open"), reduced ? 0 : 3200);
    return () => { clearTimeout(a); clearTimeout(f); clearTimeout(b); };
  }, [phase, reduced]);

  useEffect(() => {
    if (introDone) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") skip(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introDone, skip]);

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          key="intro" role="dialog" aria-modal="true" aria-label="Wedding invitation"
          className="fixed inset-0 z-[90] overflow-hidden bg-midnight text-ivory"
          exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2a1420_0%,#15110F_70%)]" />
          <Particles density={1.2} />

          <div className="absolute right-4 top-4 z-10 flex items-center gap-3 sm:right-8 sm:top-8">
            <button
              onClick={() => music.setPreferred(!music.preferred)} aria-pressed={music.preferred}
              className="flex items-center gap-2 rounded-full border border-champagne/40 px-4 py-2 text-xs tracking-[0.2em] text-champagne transition hover:bg-champagne/10"
            >
              {music.preferred ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {music.preferred ? "Music on" : "Music off"}
            </button>
            <button onClick={skip} className="rounded-full px-4 py-2 text-xs tracking-[0.2em] text-ivory/70 transition hover:text-champagne">
              Skip
            </button>
          </div>

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            {phase === "loading" && (
              <div className="flex flex-col items-center gap-8" role="status" aria-label="Loading">
                <div className="font-display text-6xl text-champagne/90 sm:text-7xl">{COUPLE.initials[0]} <span className="font-serif italic">&amp;</span> {COUPLE.initials[1]}</div>
                <div className="h-px w-48 overflow-hidden bg-champagne/20">
                  <div className="h-full bg-champagne transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {phase === "envelope" && (
                <motion.div key="env" className="w-full max-w-[min(88vw,460px)]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}>
                  <svg viewBox="0 0 400 270" className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,.7)]" aria-hidden>
                    <defs><linearGradient id="env" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5d1730" /><stop offset="1" stopColor="#3a0b1c" /></linearGradient></defs>
                    <rect x="4" y="4" width="392" height="262" rx="6" fill="url(#env)" stroke="#D6B46A" strokeWidth="1.2" />
                    <rect x="40" y="30" width="320" height="160" fill="#FFF9EF" opacity={flap ? 1 : 0} />
                    <path d="M4 266 L200 140 L396 266 Z M4 266 L4 80 L200 190 Z M396 266 L396 80 L200 190 Z" fill="#4A1025" stroke="#D6B46A" strokeOpacity=".45" />
                    <motion.path d="M4 4 L200 150 L396 4 Z" fill="#4A1025" stroke="#D6B46A" strokeOpacity=".7"
                      style={{ transformBox: "fill-box", transformOrigin: "center top" }} animate={{ scaleY: flap ? -0.9 : 1 }} transition={{ duration: reduced ? 0 : 0.9, ease: "easeInOut" }} />
                    <motion.g animate={{ opacity: flap ? 0 : lit ? 1 : 0.25 }} transition={{ duration: 1.2 }}>
                      <circle cx="200" cy="150" r="30" fill="#AA8750" stroke="#F2D58D" strokeWidth="1.5" />
                      <text x="200" y="158" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="22" fill="#2a0a14" fontWeight="600">{COUPLE.initials[0]}&amp;{COUPLE.initials[1]}</text>
                    </motion.g>
                  </svg>
                </motion.div>
              )}
              {phase === "open" && (
                <motion.div key="card" className="w-full max-w-[min(92vw,540px)]" initial={{ y: 60, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="relative rounded-sm bg-ivory px-6 py-10 text-center text-burgundy shadow-[0_30px_80px_rgba(0,0,0,.6)] sm:px-12 sm:py-14">
                    <div className="pointer-events-none absolute inset-2 border border-antique/70" />
                    <div className="pointer-events-none absolute inset-3.5 border border-antique/30" />
                    <p className="font-script text-4xl text-antique sm:text-5xl">Two Souls.</p>
                    <h1 className="mt-1 font-display text-3xl font-medium leading-tight sm:text-4xl">One Beautiful Journey.</h1>
                    <GoldDivider className="my-5 text-antique" />
                    <p className="mx-auto max-w-xs font-display text-lg leading-snug text-midnight/80">Together with our families,<br />we invite you to celebrate the beginning of forever.</p>
                    <p className="mt-5 font-serif text-sm tracking-[0.14em] text-burgundy">{COUPLE.groom} &amp; {COUPLE.bride}</p>
                    <button autoFocus onClick={enter} className="mt-7 inline-flex items-center justify-center rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.28em] text-champagne shadow-lg transition hover:bg-[#5d1730] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">
                      ENTER THE CELEBRATION
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
