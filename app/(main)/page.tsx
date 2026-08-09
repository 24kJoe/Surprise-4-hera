"use client";

import { useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import NameToast from "@/components/NameToast";
import Nav from "@/components/Nav";
import LetterSection from "@/components/LetterSection";
import MemoriesSection from "@/components/MemoriesSection";
import CounterSection from "@/components/CounterSection";
import Gallery from "@/components/Gallery";

export default function Page() {
  return (
    <>
      <FloatingHearts />
      <NameToast />

      <Nav />

      <LetterSection />

      <div className="stitch-divider" />

      <MemoriesSection />

      <div className="stitch-divider" />

      <Gallery />
      <CounterSection />

      <footer>made with a whole heart, just for you.</footer>
    </>
  );
}
