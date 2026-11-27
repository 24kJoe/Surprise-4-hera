"use client";

import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import BackgroundPetals from "@/components/backgrounds/BackgroundPetals";
import LetterSection from "@/components/letters/LetterSection";

const MemoriesSection = lazy(() => import("@/components/gallery/MemoriesSection"));
const Gallery = lazy(() => import("@/components/gallery/Gallery"));
const DailyReasons = lazy(() => import("@/components/sections/DailyReasons"));
const FutureLetters = lazy(() => import("@/components/letters/FutureLetters"));
const CounterSection = lazy(() => import("@/components/sections/CounterSection"));

function DeferredSection({ id, placeholder, children }: {
  id: string; placeholder: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const fallback = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fallback = <div className={placeholder} aria-hidden="true" />;
  return (
    <div id={id} ref={ref} className="scroll-mt-24">
      {ready ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}

export default function HomeContent() {
  useEffect(() => {
    // The welcome screen can delay mounting past the browser’s initial anchor jump.
    const target = document.getElementById(window.location.hash.slice(1));
    if (target && window.scrollY === 0) target.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <>
      <BackgroundPetals />
      <LetterSection />
      <div className="stitch-divider" />
      <DeferredSection id="memories" placeholder="min-h-[36rem]">
        <MemoriesSection />
      </DeferredSection>
      <div className="stitch-divider" />
      <DeferredSection id="gallery" placeholder="min-h-[26rem]">
        <Gallery />
      </DeferredSection>
      <div className="stitch-divider" />
      <DeferredSection id="daily-reasons" placeholder="min-h-[32rem]">
        <DailyReasons />
      </DeferredSection>
      <div className="stitch-divider" />
      <DeferredSection id="future-letters" placeholder="min-h-[32rem]">
        <FutureLetters />
      </DeferredSection>
      <div className="stitch-divider" />
      <DeferredSection id="counter" placeholder="min-h-[23rem]">
        <CounterSection />
      </DeferredSection>
      <footer>made with a whole heart, just for you.</footer>
    </>
  );
}
