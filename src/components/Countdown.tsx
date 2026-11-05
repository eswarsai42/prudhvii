"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Particles } from "./Particles";
import { GoldDivider } from "./Ornament";
import { useCountdown } from "@/hooks/useCountdown";
import { WEDDING_DATE_LABEL, WEDDING_TARGET_ISO } from "@/lib/wedding";

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-24 w-[4.6rem] items-center justify-center overflow-hidden border border-champagne/40 bg-black/20 sm:h-40 sm:w-32">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={text} initial={{ y: "-60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}
            className="gold-text font-display text-5xl font-light tabular-nums sm:text-8xl">{text}</motion.span>
        </AnimatePresence>
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-champagne/15" />
      </div>
      <span className="mt-4 text-[10px] tracking-[0.3em] text-champagne/80 sm:text-xs">{label}</span>
    </div>
  );
}

export function Countdown() {
  const cd = useCountdown(WEDDING_TARGET_ISO);
  return (
    <section aria-labelledby="countdown-title" className="relative overflow-hidden bg-burgundy px-5 py-24 text-center text-ivory sm:py-32">
      <Particles density={0.7} />
      <div className="relative">
        <p className="text-[11px] tracking-[0.38em] text-champagne/90 sm:text-xs">{WEDDING_DATE_LABEL.toUpperCase()}</p>
        <h2 id="countdown-title" className="mt-5 font-display text-4xl font-light tracking-[0.08em] sm:text-6xl">THE BEGINNING OF FOREVER</h2>
        <GoldDivider className="my-9" />
        {!cd ? <div className="h-40" /> : cd.done ? (
          <p className="font-display text-3xl italic text-champagne">The celebration has begun.</p>
        ) : (
          <div role="timer" aria-label={`${cd.days} days, ${cd.hours} hours, ${cd.minutes} minutes until the wedding`} className="flex justify-center gap-2.5 sm:gap-7">
            <Unit value={cd.days} label="DAYS" /><Unit value={cd.hours} label="HOURS" /><Unit value={cd.minutes} label="MINUTES" /><Unit value={cd.seconds} label="SECONDS" />
          </div>
        )}
        <p className="mt-10 font-display text-lg italic text-ivory/70">Counting down to the Grand Wedding, India Standard Time.</p>
      </div>
    </section>
  );
}
