"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 1900;

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<SVGSVGElement>(null);
  const [caption, setCaption] = useState("Press & hold");
  const [isHiding, setIsHiding] = useState(false);

  const holdingRef = useRef(false);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const setProgress = (p: number) => {
    if (fillRef.current) {
      fillRef.current.style.clipPath = `inset(${(1 - p) * 100}% 0 0 0)`;
    }
    if (btnRef.current) {
      btnRef.current.style.transform = `scale(${1 + p * 0.12})`;
    }
  };

  const complete = useCallback(() => {
    holdingRef.current = false;
    doneRef.current = true;
    btnRef.current?.classList.remove("holding");
    btnRef.current?.classList.add("complete");
    setCaption("Yours, always 💗");
    
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setTimeout(() => {
      setIsHiding(true);
      setTimeout(() => {
        onComplete();
      }, 500); // 
    }, 400);
  }, [onComplete]);

  const tick = useCallback(
    (now: number) => {
      if (!holdingRef.current) return;
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / HOLD_MS, 1);
      setProgress(p);
      
      if (p < 0.35) setCaption("Press & hold");
      else if (p < 0.75) setCaption("Keep holding...");
      else if (p < 1) setCaption("Almost there...");
      
      if (p >= 1) {
        complete();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [complete]
  );

  function startHold(e: React.PointerEvent) {
    if (doneRef.current || holdingRef.current) return;
    if (e.cancelable) e.preventDefault();
    holdingRef.current = true;
    startTimeRef.current = performance.now();
    btnRef.current?.classList.add("holding");
    rafRef.current = requestAnimationFrame(tick);
  }

  const cancelHold = useCallback(() => {
    if (doneRef.current || !holdingRef.current) return;
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    btnRef.current?.classList.remove("holding");
    if (btnRef.current) btnRef.current.style.transform = "";
    if (fillRef.current) fillRef.current.style.transition = "clip-path .45s ease";
    
    setProgress(0);
    setCaption("Don't let go 😞 — try again");
    
    setTimeout(() => {
      if (fillRef.current) fillRef.current.style.transition = "";
      if (!holdingRef.current && !doneRef.current) setCaption("Press & hold");
    }, 500);
  }, []);

  useEffect(() => {
    function up() {
      if (holdingRef.current) cancelHold();
    }
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [cancelHold]);

  return (
    <div
      id="welcome-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        isHiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="welcome-text text-center mb-8">
        <div className="eyebrow welcome-eyebrow text-xs uppercase tracking-widest text-pink-500 mb-2 font-semibold">
          Before We Start
        </div>
        <h1 className="text-3xl font-serif text-[#4a2036] mb-2">Hey Annona</h1>
        <p className="text-sm text-[#4a2036]/80">
          I made you something. Press and hold to open your heart.
        </p>
      </div>

      <div className="hold-wrap flex flex-col items-center gap-4">
        <button
          ref={btnRef}
          id="welcome-btn"
          aria-label="Press and hold to enter"
          onPointerDown={startHold}
          onContextMenu={(e) => e.preventDefault()}
          className="relative w-24 h-24 flex items-center justify-center focus:outline-none select-none touch-none"
        >
          <svg
            className="hold-heart-outline absolute inset-0 w-full h-full text-pink-200 stroke-current fill-none stroke-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
          </svg>
          <svg
            ref={fillRef}
            className="hold-heart-fill absolute inset-0 w-full h-full text-pink-500 fill-current"
            id="hold-heart-fill"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ clipPath: "inset(100% 0 0 0)" }}
          >
            <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
          </svg>
        </button>

        <div className="hold-caption text-xs uppercase tracking-wider text-[#4a2036]/70 font-medium h-4">
          {caption}
        </div>
      </div>
    </div>
  );
}