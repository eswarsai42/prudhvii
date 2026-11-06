import { ExperienceProvider } from "@/components/ExperienceProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Schedule } from "@/components/Schedule";
import { Countdown } from "@/components/Countdown";
import { Gallery } from "@/components/Gallery";
import { Instagram } from "@/components/Instagram";
import { Venues } from "@/components/Venues";
import { TimeCapsule } from "@/components/TimeCapsule";
import { FirstChapter } from "@/components/FirstChapter";
import { Guestbook } from "@/components/Guestbook";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <ExperienceProvider>
      <a href="#story" className="sr-only z-[200] bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <SmoothScroll />
      <CustomCursor />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Story />
        <FirstChapter />
        <Schedule />
        <Countdown />
        <Gallery />
        <Instagram/>
        <Venues />
        <TimeCapsule />
        <Guestbook />
        <Closing />
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
