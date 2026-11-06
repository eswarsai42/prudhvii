"use client";
import { VolumeX } from "lucide-react";
import { useExperience } from "./ExperienceProvider";
import { cn } from "@/lib/utils";

/** Small circular champagne-gold sound control: spinning ring + animated bars while playing, muted speaker otherwise. */
export function MusicToggle({ className = "" }: { className?: string }) {
  const { music } = useExperience();
  const on = music.playing;
  return (
    <button
      onClick={music.toggle} aria-pressed={on} aria-label={on ? "Turn music off" : "Turn music on"} title={on ? "Music on" : "Music off"}
      className={cn("group relative flex h-11 w-11 items-center justify-center rounded-full border border-champagne/60 bg-midnight/40 text-champagne backdrop-blur transition duration-500 hover:scale-110 hover:border-champagne hover:bg-champagne/15 hover:shadow-[0_0_22px_rgba(214,180,106,.45)]", className)}
    >
      {on && <span aria-hidden className="music-ring absolute inset-[3px] rounded-full border border-dashed border-champagne/70" />}
      {on ? (
        <span aria-hidden className="flex h-4 items-end gap-[2.5px]">
          {[0, 1, 2, 3].map((i) => <span key={i} className="music-bar w-[2.5px] rounded-full bg-champagne" style={{ animationDelay: `${i * 0.18}s` }} />)}
        </span>
      ) : <VolumeX size={17} aria-hidden />}
    </button>
  );
}
