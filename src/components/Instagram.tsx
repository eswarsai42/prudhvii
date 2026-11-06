"use client";

import { Camera, ArrowUpRight } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/prudhvikaharshi/";

export function Instagram() {
  return (
    <section
      id="instagram"
      className="relative overflow-hidden bg-ivory px-5 py-24 text-midnight sm:py-36"
    >
      <div className="mx-auto max-w-7xl text-center">

        <p className="font-script text-5xl text-antique sm:text-6xl">
          A Little More of Us
        </p>

        <h2 className="mt-3 font-display text-4xl font-light text-burgundy sm:text-6xl">
          Follow Our Journey
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-midnight/60">
          Every picture tells a story. Follow our shared wedding
          journey and be a part of our beautiful memories.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border border-antique px-8 py-4 text-xs tracking-[0.2em] text-burgundy transition duration-500 hover:bg-burgundy hover:text-ivory"
          >
            <Camera size={19} />
            FOLLOW @PRUDHVIKAHARSHI
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        <p className="mt-12 font-display text-xl italic text-burgundy">
          Two hearts. One beautiful journey. Forever together. ❤️
        </p>

      </div>
    </section>
  );
}