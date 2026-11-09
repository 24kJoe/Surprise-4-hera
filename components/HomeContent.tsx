"use client";

import FloatingHearts from "@/components/FloatingHearts";
import NameToast from "@/components/NameToast";
import LetterSection from "@/components/LetterSection";
import MemoriesSection from "@/components/MemoriesSection";
import CounterSection from "@/components/CounterSection";
import Gallery from "@/components/Gallery";
import DailyReasons from "@/components/DailyReasons";
import FutureLetters from "@/components/FutureLetters";
import SurpriseLily from "@/components/SurpriseLily";




export default function HomeContent() {
  return (
    <>
      <FloatingHearts />
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
