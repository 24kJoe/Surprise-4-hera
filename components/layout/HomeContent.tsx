"use client";

import BackgroundPetals from "@/components/backgrounds/BackgroundPetals";
import NameToast from "@/components/shared/NameToast";
import LetterSection from "@/components/letters/LetterSection";
import MemoriesSection from "@/components/gallery/MemoriesSection";
import CounterSection from "@/components/sections/CounterSection";
import Gallery from "@/components/gallery/Gallery";
import DailyReasons from "@/components/sections/DailyReasons";
import FutureLetters from "@/components/letters/FutureLetters";
import SurpriseLily from "@/components/letters/SurpriseLily";




export default function HomeContent() {
  return (
    <>
      <BackgroundPetals />
      <NameToast />
      <SurpriseLily />

      <LetterSection />
      <div className="stitch-divider" />

      <MemoriesSection />
      <div className="stitch-divider" />

      <Gallery />
      <div className="stitch-divider" />

      <DailyReasons />
      <div className="stitch-divider" />

      <section id="future-letters">
        <FutureLetters />
      </section>
      <div className="stitch-divider" />

      <CounterSection />
      <footer>made with a whole heart, just for you.</footer>
    </>
  );
}
