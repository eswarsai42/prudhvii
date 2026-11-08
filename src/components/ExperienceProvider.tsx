"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAmbientMusic } from "@/hooks/useAmbientMusic";

interface Ctx {
  introDone: boolean;
  finishIntro: () => void;
  music: ReturnType<typeof useAmbientMusic>;
}

const ExperienceContext = createContext<Ctx | null>(null);

export const useExperience = () => {
  const c = useContext(ExperienceContext);

  if (!c) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }

  return c;
};

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  const music = useAmbientMusic();

  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", !introDone);
  }, [introDone]);

  const value = useMemo(
    () => ({
      introDone,
      finishIntro: () => setIntroDone(true),
      music,
    }),
    [introDone, music]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}