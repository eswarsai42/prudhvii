"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Play } from "lucide-react";
import { GoldDivider } from "./Ornament";
import { Particles } from "./Particles";
import { useExperience } from "./ExperienceProvider";
import { useReducedMotion } from "@/hooks/useMedia";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_ID = "Tlq7-KmJ6lU";
const WATCH_URL = `https://youtu.be/${VIDEO_ID}`;

/* Minimal typing for the YouTube IFrame API. */
interface YTPlayer { destroy: () => void }
interface YTNamespace { Player: new (el: HTMLIFrameElement, opts: { events: { onStateChange: (e: { data: number }) => void } }) => YTPlayer }
declare global { interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void } }

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); if (window.YT) resolve(window.YT); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api"; s.async = true; s.onerror = () => { apiPromise = null; reject(new Error("YouTube API failed to load")); };
    document.head.appendChild(s);
  });
  return apiPromise;
}

export function FirstChapter() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const { music } = useExperience();
  const reduced = useReducedMotion();
  const setVideoPlaying = music.setVideoPlaying;

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (reduced) { gsap.set(".fc-in, .fc-frame", { opacity: 1, y: 0, scale: 1 }); return; }
      gsap.fromTo(".fc-in", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
      gsap.fromTo(".fc-frame", { opacity: 0, scale: 0.92, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: ".fc-frame", start: "top 85%" } });
      gsap.to(".fc-glow", { opacity: 0.9, ease: "none", scrollTrigger: { trigger: ".fc-frame", start: "top 80%", end: "center 50%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Once the iframe exists, listen to its state so the soundtrack can step aside.
  useEffect(() => {
    if (!playing || !frame.current) return;
    let player: YTPlayer | null = null, cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !frame.current) return;
      player = new YT.Player(frame.current, {
        events: { onStateChange: (e) => setVideoPlaying(e.data === 1 || e.data === 3) }, // 1 playing, 3 buffering
      });
    }).catch(() => {});
    return () => { cancelled = true; setVideoPlaying(false); try { player?.destroy(); } catch {} };
  }, [playing, setVideoPlaying]);

  const start = useCallback(() => { setVideoPlaying(true); setPlaying(true); }, [setVideoPlaying]);

  return (
    <section id="first-chapter" ref={root} aria-labelledby="first-chapter-title" className="relative overflow-hidden bg-burgundy px-5 py-24 text-ivory sm:py-36">
      <Particles density={0.6} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,180,106,.12),transparent_62%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="fc-in text-[11px] tracking-[0.4em] text-champagne/90 sm:text-xs">THE ENGAGEMENT TEASER</p>
        <h2 id="first-chapter-title" className="fc-in mt-5 font-display text-4xl font-light tracking-[0.1em] sm:text-6xl">THE FIRST CHAPTER</h2>
        <p className="fc-in mt-4 font-display text-xl italic text-ivory/80 sm:text-2xl">A glimpse of the beautiful beginning of forever.</p>
        <GoldDivider className="fc-in my-9" />

        <div className="fc-frame relative mx-auto w-full max-w-4xl">
          <span aria-hidden className="fc-glow pointer-events-none absolute -inset-10 rounded-[50%] bg-champagne/20 opacity-0 blur-3xl" />
          {/* Rotating gold light sweeps around a thin ornamental border */}
          <div className="relative overflow-hidden rounded-[3px] p-[2px] shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]">
            <span aria-hidden className="sweep-spin absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_62%,#D6B46A_80%,#fff1c7_88%,transparent_100%)]" />
            <span aria-hidden className="absolute inset-0 border border-champagne/50" />
            <div className="relative bg-midnight p-2 sm:p-3">
              <div className="relative border border-champagne/40">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {playing ? (
                    <iframe
                      ref={frame}
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
                      title="Engagement teaser video: The First Chapter"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button onClick={start} aria-label="Play the engagement teaser video" className="group absolute inset-0 block h-full w-full text-left">
                      <Image src="/images/hero-garlands.jpg" alt="" fill sizes="(min-width:1024px) 900px, 100vw" loading="lazy" className="object-cover transition duration-[1600ms] ease-out group-hover:scale-[1.04]" />
                      <span className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/20 to-midnight/55" />
                      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(21,17,15,.65)_100%)]" />
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                        <span className="relative flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
                          <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne" />
                          <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne" style={{ animationDelay: "1.3s" }} />
                          <span className="relative flex h-full w-full items-center justify-center rounded-full border border-champagne bg-gradient-to-br from-[#F2D58D] to-[#AA8750] text-burgundy shadow-[0_0_40px_rgba(214,180,106,.55)] transition duration-500 group-hover:scale-110">
                            <Play className="ml-1 h-8 w-8 fill-current sm:h-11 sm:w-11" />
                          </span>
                        </span>
                        <span className="text-[11px] tracking-[0.4em] text-ivory sm:text-xs">WATCH THE TEASER</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="fc-in mt-9 text-[11px] tracking-[0.34em] text-champagne sm:text-xs">ONE BEAUTIFUL MOMENT. A LIFETIME OF MEMORIES.</p>
        <a href={WATCH_URL} target="_blank" rel="noopener noreferrer" className="fc-in mt-4 inline-flex items-center gap-2 text-sm tracking-[0.1em] text-ivory/55 underline-offset-4 transition hover:text-champagne hover:underline">
          Watch on YouTube <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}
