"use client";

import { useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import NameToast from "@/components/NameToast";
import LetterSection from "@/components/LetterSection";
import MemoriesSection from "@/components/MemoriesSection";
import CounterSection from "@/components/CounterSection";
import Gallery from "@/components/Gallery";
import VoiceNote from "@/components/VoiceNote";
import FutureLetters from "@/components/FutureLetters";

export default function Page() {
  return (
    <>
      <FloatingHearts />
      <NameToast />

      <LetterSection />

      <div className="stitch-divider" />

      <MemoriesSection />

      <div className="stitch-divider" />

      <Gallery />

      <div className="stitch-divider" />

      <section id="voicenotes">
        <VoiceNote />
      </section>

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