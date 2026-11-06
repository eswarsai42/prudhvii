"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  open: boolean;            // flap open
  sealed?: boolean;         // wax seal on the flap
  letterY?: number;         // % of envelope height the letter is raised (open) or lowered (inserted)
  letterScaleY?: number;
  letter?: ReactNode;
  reduced?: boolean;
}

/** A gold envelope built from layers so the flap can open in real 3D. */
export function GoldenEnvelope({ open, sealed = false, letterY = 0, letterScaleY = 1, letter, reduced = false }: Props) {
  const dur = reduced ? 0 : 0.9;
  return (
    <div className="relative mx-auto aspect-[3/2] w-full max-w-[380px] [perspective:1400px]" aria-hidden>
      <div className="absolute inset-0 rounded-[4px] bg-gradient-to-br from-[#E9CF8D] via-[#C9A55A] to-[#9D7A3A] shadow-[0_30px_60px_-15px_rgba(0,0,0,.7)]" />
      {/* letter sits between back and front pocket */}
      <motion.div className="absolute inset-x-[7%] top-[8%] z-[2] h-[86%] origin-bottom" animate={{ y: `${letterY}%`, scaleY: letterScaleY }} transition={{ duration: dur, ease: "easeInOut" }}>
        {letter ?? <div className="h-full w-full bg-ivory shadow-md"><div className="m-3 h-[calc(100%-1.5rem)] border border-antique/50" /></div>}
      </motion.div>
      {/* front pocket */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-br from-[#F0D890] to-[#B8913F]" style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/10 to-transparent" style={{ clipPath: "polygon(0 100%, 50% 52%, 100% 100%)" }} />
      {/* flap */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[54%] origin-top" style={{ transformStyle: "preserve-3d" }}
        initial={false} animate={{ rotateX: open ? -178 : 0, zIndex: open ? 1 : 5 }}
        transition={{ duration: dur, ease: "easeInOut", zIndex: { delay: open ? dur * 0.45 : dur * 0.5, duration: 0 } }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4DE9E] to-[#C9A55A] [backface-visibility:hidden]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 96%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#B8913F] to-[#8F6D2E] [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 96%)" }} />
      </motion.div>
      {/* wax seal */}
      <motion.div className="absolute left-1/2 top-[44%] z-[6] -ml-8 h-16 w-16" initial={false}
        animate={sealed ? { scale: 1, opacity: 1, rotate: 0 } : { scale: open ? 0.4 : 1, opacity: open ? 0 : 1, rotate: 0 }}
        transition={{ duration: reduced ? 0 : 0.6, type: sealed ? "spring" : "tween", bounce: 0.5 }}>
        <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_6px_8px_rgba(0,0,0,.45)]">
          <defs><radialGradient id="wax" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#8B2346" /><stop offset="1" stopColor="#4A1025" /></radialGradient></defs>
          <path d="M32 3c5 0 7 4 12 5 5 1 10 3 11 8 1 5-3 8-3 13s4 8 2 13-8 6-12 8-8 7-13 7-8-5-13-7-10-3-12-8 2-8 2-13-4-8-3-13 6-7 11-8 7-5 12-5z" fill="url(#wax)" />
          <circle cx="32" cy="32" r="19" fill="none" stroke="#D6B46A" strokeOpacity=".7" strokeWidth="1.3" />
          <text x="32" y="38" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="17" fill="#E9CF8D" fontWeight="600">P&amp;H</text>
        </svg>
      </motion.div>
    </div>
  );
}
