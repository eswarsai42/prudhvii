"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/wedding";

const KEY = "rw-music";
const LEVEL = 0.4;

export function useAmbientMusic() {
  const [preferred, setPreferredState] = useState(true);
  const [started, setStarted] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const el = useRef<HTMLAudioElement | null>(null);
  const raf = useRef(0);

  const playing = started && preferred && !videoPlaying;

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "off") {
        setPreferredState(false);
      }
    } catch {}
  }, []);

  const build = useCallback(() => {
    if (el.current || ctx.current) return;

    if (SITE.musicUrl) {
      const a = new Audio(SITE.musicUrl);
      a.loop = true;
      a.volume = 0;
      a.preload = "auto";
      el.current = a;
      return;
    }

    const AC =
      window.AudioContext ||
      (window as unknown as {
        webkitAudioContext: typeof AudioContext;
      }).webkitAudioContext;

    const c = new AC();
    const g = c.createGain();
    g.gain.value = 0;

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;

    lp.connect(g);
    g.connect(c.destination);

    [146.83, 220, 293.66, 369.99, 440].forEach((f, i) => {
      [-4, 4].forEach((det) => {
        const o = c.createOscillator();
        o.type = i % 2 ? "sine" : "triangle";
        o.frequency.value = f;
        o.detune.value = det;

        const og = c.createGain();
        og.gain.value = 0.05 / (1 + i * 0.25);

        const lfo = c.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.03;

        const lg = c.createGain();
        lg.gain.value = og.gain.value * 0.6;

        lfo.connect(lg);
        lg.connect(og.gain);
        o.connect(og);
        og.connect(lp);

        o.start();
        lfo.start();
      });
    });

    ctx.current = c;
    master.current = g;
  }, []);

  useEffect(() => {
    if (!started) return;

    const fadeMs = playing ? 1800 : 1200;

    if (ctx.current && master.current) {
      const c = ctx.current;
      const g = master.current;

      if (playing) c.resume().catch(() => {});

      const t = c.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(
        playing ? 1 : 0,
        t + fadeMs / 1000
      );
    }

    const a = el.current;

    if (a) {
      cancelAnimationFrame(raf.current);

      if (playing && a.paused) {
        a.play().catch(() => {});
      }

      const from = a.volume;
      const to = playing ? LEVEL : 0;
      const t0 = performance.now();

      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / fadeMs);

        a.volume = Math.max(
          0,
          Math.min(1, from + (to - from) * k)
        );

        if (k < 1) {
          raf.current = requestAnimationFrame(step);
        } else if (!playing) {
          a.pause();
        }
      };

      raf.current = requestAnimationFrame(step);
    }
  }, [playing, started]);

  const unlock = useCallback(() => {
    build();

    el.current
      ?.play()
      .then(() => {
        if (!playing && el.current) {
          el.current.volume = 0;
        }
      })
      .catch(() => {});

    ctx.current?.resume().catch(() => {});

    setStarted(true);
  }, [build, playing]);

  const savePref = (v: boolean) => {
    setPreferredState(v);

    try {
      localStorage.setItem(KEY, v ? "on" : "off");
    } catch {}
  };

  const startIfPreferred = useCallback(() => {
    if (preferred) unlock();
  }, [preferred, unlock]);

  const toggle = useCallback(() => {
    if (playing) {
      savePref(false);
      return;
    }

    savePref(true);
    unlock();
  }, [playing, unlock]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);

      ctx.current?.close().catch(() => {});
      ctx.current = null;
      master.current = null;

      el.current?.pause();
      el.current = null;
    },
    []
  );

  return {
    playing,
    preferred,
    videoPlaying,
    toggle,
    startIfPreferred,
    setPreferred: savePref,
    setVideoPlaying,
  };
}