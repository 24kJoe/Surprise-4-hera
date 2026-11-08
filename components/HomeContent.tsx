"use client";

import dynamic from "next/dynamic";
import DeferredSection from "./DeferredSection";
import FloatingHearts from "@/components/FloatingHearts";
import NameToast from "@/components/NameToast";
import LetterSection from "@/components/LetterSection";
import MemoriesSection from "@/components/MemoriesSection";
import CounterSection from "@/components/CounterSection";
const Gallery = dynamic(() => import("@/components/Gallery"));
const VoiceNote = dynamic(() => import("@/components/VoiceNote"));
import DailyReasons from "@/components/DailyReasons";
const FutureLetters = dynamic(() => import("@/components/FutureLetters"));
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

      <DeferredSection id="gallery"><Gallery /></DeferredSection>
      <div className="stitch-divider" />

      <section id="voicenotes">
        <DeferredSection><VoiceNote /></DeferredSection>
      </section>
      <div className="stitch-divider" />

      <DailyReasons />
      <div className="stitch-divider" />

      <section id="future-letters">
        <DeferredSection><FutureLetters /></DeferredSection>
      </section>
      <div className="stitch-divider" />

      <CounterSection />
      <footer>made with a whole heart, just for you.</footer>
    </>
  );
}
