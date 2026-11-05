import Image from "next/image";
import { VEERLABS } from "@/lib/wedding";

export function Footer() {
  return (
    <footer className="bg-midnight px-5 pb-12 pt-16 text-center text-ivory">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
        <p className="font-script text-4xl text-champagne">An Experience Crafted with Passion</p>
        <p className="mt-8 text-[10px] tracking-[0.4em] text-ivory/55">DESIGNED &amp; DEVELOPED BY</p>
        <a href={VEERLABS.url} target="_blank" rel="noopener noreferrer" aria-label="VEERLABS, designed and developed this website (opens veerlabs.vercel.app)"
          className="group mx-auto mt-4 inline-flex flex-col items-center gap-3 rounded-sm px-6 py-3 transition-transform duration-500 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">
          <Image src="/veerlabs-logo.svg" alt="" width={44} height={44} className="transition-transform duration-700 group-hover:rotate-[360deg]" />
          <span className="relative font-serif text-xl tracking-[0.42em] text-champagne">
            {VEERLABS.name}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 group-hover:scale-x-100" />
          </span>
        </a>
        <p className="mt-3 font-display text-lg italic text-ivory/70">{VEERLABS.tagline}</p>
        <a href={VEERLABS.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm tracking-[0.12em] text-ivory/60 underline-offset-4 transition hover:text-champagne hover:underline">veerlabs.vercel.app</a>
        <p className="mt-12 text-[11px] tracking-[0.18em] text-ivory/35">PHOTOGRAPHY · MUSE MOMENT MAKERS</p>
      </div>
    </footer>
  );
}
