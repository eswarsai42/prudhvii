"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/wedding";

/**
 * Background music. Plays NEXT_PUBLIC_MUSIC_URL when provided, otherwise a soft
 * generated pad (Web Audio) so the sound toggle works without any audio asset.
 * Browsers only allow audio after a user gesture; `start` must be called from a click.
 */
export function useAmbientMusic() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const el = useRef<HTMLAudioElement | null>(null);
  const built = useRef(false);

  const build = useCallback(() => {
    if (built.current) return;
    built.current = true;
    if (SITE.musicUrl) {
      el.current = new Audio(SITE.musicUrl);
      el.current.loop = true;
      el.current.volume = 0.35;
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = new AC();
    const g = c.createGain(); g.gain.value = 0;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    lp.connect(g); g.connect(c.destination);
    [146.83, 220, 293.66, 369.99, 440].forEach((f, i) => {
      [-4, 4].forEach((det) => {
        const o = c.createOscillator(); o.type = i % 2 ? "sine" : "triangle";
        o.frequency.value = f; o.detune.value = det;
        const og = c.createGain(); og.gain.value = 0.05 / (1 + i * 0.25);
        const lfo = c.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03;
        const lg = c.createGain(); lg.gain.value = og.gain.value * 0.6;
        lfo.connect(lg); lg.connect(og.gain); o.connect(og); og.connect(lp);
        o.start(); lfo.start();
      });
    });
    ctx.current = c; master.current = g;
  }, []);

  const setPlaying = useCallback(async (play: boolean) => {
    try {
      build();
      if (el.current) { if (play) await el.current.play(); else el.current.pause(); }
      if (ctx.current && master.current) {
        if (play) await ctx.current.resume();
        const t = ctx.current.currentTime;
        master.current.gain.cancelScheduledValues(t);
        master.current.gain.linearRampToValueAtTime(play ? 1 : 0, t + 1.5);
      }
      setOn(play);
    } catch { setOn(false); }
  }, [build]);

  const toggle = useCallback(() => setPlaying(!on), [on, setPlaying]);
  useEffect(() => () => { ctx.current?.close(); el.current?.pause(); }, []);
  return { on, toggle, setPlaying };
}
