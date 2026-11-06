"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MusicToggle } from "./MusicToggle";
import { NAV } from "@/lib/wedding";
import { scrollToId } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { useExperience } from "./ExperienceProvider";

export function Nav() {
  const { introDone } = useExperience();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("scroll-locked");
    return () => { window.removeEventListener("keydown", onKey); if (introDone) document.documentElement.classList.remove("scroll-locked"); };
  }, [open, introDone]);

  const go = (id: string) => { setOpen(false); setTimeout(() => scrollToId(id), open ? 250 : 0); };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }} animate={introDone ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.9, delay: 0.4 }}
        className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "bg-midnight/85 py-3 shadow-[0_1px_0_rgba(214,180,106,.25)] backdrop-blur-md" : "py-5")}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => go("home")} className="font-display text-2xl text-champagne" aria-label="Back to top">
            P <span className="font-serif text-lg italic">&amp;</span> H
          </button>
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} aria-current={active === n.id ? "true" : undefined}
                  className={cn("group relative py-1 text-[13px] tracking-[0.22em] transition-colors", active === n.id ? "text-champagne" : "text-ivory/80 hover:text-champagne")}>
                  {n.label}
                  <span className={cn("absolute -bottom-0.5 left-0 h-px bg-champagne transition-all duration-500", active === n.id ? "w-full" : "w-0 group-hover:w-full")} />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <MusicToggle />
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="rounded-full p-2.5 text-champagne lg:hidden"><Menu size={22} /></button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-burgundy"
          >
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-5 top-5 rounded-full p-3 text-champagne"><X size={26} /></button>
            <ul className="space-y-6 text-center">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                  <button onClick={() => go(n.id)} className="font-display text-4xl text-ivory transition hover:text-champagne">{n.label}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
