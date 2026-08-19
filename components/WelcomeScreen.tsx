"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const HOLD_MS = 1900;
const HEART_PATH =
  "M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z";

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const uid = useId().replace(/:/g, "");
  const maskId = `liquidMask-${uid}`;
  const filterId = `softEdge-${uid}`;
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillGroupRef = useRef<SVGGElement>(null);
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

  // Prevent a runaway rAF loop / stale refs if the component unmounts mid-hold.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      holdingRef.current = false;
    };
  }, []);

  const setProgress = (p: number) => {
    if (fillGroupRef.current) {
      // Moves the wavy liquid mask up through the heart. Range is tuned so
      // p=0 sits fully below the heart's lowest point and p=1 sits just
      // above its top cleft, so the fill genuinely reads as "rising".
      const y = (1 - p) * 24.5 - 1;
      fillGroupRef.current.setAttribute("transform", `translate(0, ${y})`);
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
        // The component never unmounts (it just fades out via CSS), so the
        // effect's cleanup that would normally restore scrolling never
        // runs. Reset it explicitly here or the whole page stays
        // permanently unscrollable — which also breaks nav clicks, since
        // there's nothing to scroll to.
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        onComplete();
      }, 500);
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

  const beginHold = useCallback(() => {
    if (doneRef.current || holdingRef.current) return;
    holdingRef.current = true;
    startTimeRef.current = performance.now();
    btnRef.current?.classList.add("holding");
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  function startHold(e: React.PointerEvent) {
    if (e.cancelable) e.preventDefault();
    beginHold();
  }

  const cancelHold = useCallback(() => {
    if (doneRef.current || !holdingRef.current) return;
    holdingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    btnRef.current?.classList.remove("holding");
    if (btnRef.current) btnRef.current.style.transform = "";
    if (fillGroupRef.current) fillGroupRef.current.style.transition = "transform .45s ease";

    setProgress(0);
    setCaption("Don't let go 😞 — try again");

    setTimeout(() => {
      if (fillGroupRef.current) fillGroupRef.current.style.transition = "";
      if (!holdingRef.current && !doneRef.current) setCaption("Press & hold");
    }, 500);
  }, []);

  // Keyboard support: a "press and hold" control with only pointer events
  // was unusable without a mouse/touchscreen. Enter/Space now mirror it.
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.repeat) return;
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      e.preventDefault();
      beginHold();
    }
  }
  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      if (holdingRef.current) cancelHold();
    }
  }

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
      className={`welcome-root fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        isHiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <svg className="drift drift-1" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-2" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-3" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-4" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-5" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>

      <div className="welcome-text relative text-center mb-10 px-8">
        <div className="eyebrow welcome-eyebrow text-[11px] uppercase tracking-[0.35em] text-rose-500/80 mb-3 font-semibold">
          Before We Start
        </div>
        <h1 className="welcome-title text-5xl mb-3">Hey Annona</h1>
        <p className="text-sm text-[#4a2036]/70 max-w-[26ch] mx-auto leading-relaxed">
          I made you something. Press and hold to open your heart.
        </p>
      </div>

      <div className="hold-wrap relative flex flex-col items-center gap-5">
        <span className="spark spark-1" aria-hidden="true" />
        <span className="spark spark-2" aria-hidden="true" />
        <span className="spark spark-3" aria-hidden="true" />
        <button
          ref={btnRef}
          id="welcome-btn"
          aria-label="Press and hold to enter"
          onPointerDown={startHold}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onContextMenu={(e) => e.preventDefault()}
          className="hold-btn relative w-32 h-32 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400 select-none touch-none"
        >
          <span className="breathe-ring" aria-hidden="true" />

          <svg
            className="hold-heart-outline absolute inset-0 w-full h-full"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={HEART_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <svg
            className="hold-heart-fill absolute inset-0 w-full h-full"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" />
              </filter>
              <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <g ref={fillGroupRef} transform="translate(0, 24.5)" filter={`url(#${filterId})`}>
                  <path
                    d="M-6,1.4 C-3,-1.1 0,3.9 3,1.4 C6,-1.1 9,3.9 12,1.4 C15,-1.1 18,3.9 21,1.4 C24,-1.1 27,3.9 30,1.4 L30,44 L-6,44 Z"
                    fill="#ffffff"
                  />
                </g>
              </mask>
            </defs>
            <path d={HEART_PATH} fill="#e0567f" mask={`url(#${maskId})`} />
          </svg>
        </button>
        <span className="heart-shadow" aria-hidden="true" />

        <div
          className="hold-caption text-[11px] uppercase tracking-[0.25em] text-[#4a2036]/60 font-medium h-4 transition-colors duration-300"
          aria-live="polite"
          aria-atomic="true"
        >
          <span key={caption} className="caption-fade">{caption}</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap');

        :root {
          --ink: #4a2036;
          --rose: #e0567f;
          --rose-deep: #9c2e54;
          --gold: #d9a566;
        }

        .welcome-root {
          background:
            radial-gradient(circle at 50% 30%, #fff4f7 0%, transparent 55%),
            linear-gradient(160deg, #fffaf6 0%, #fdeef2 45%, #fbe4ec 100%);
        }

        .welcome-root::before {
          content: "";
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(circle at 16% 18%, rgba(224, 86, 127, 0.14) 0%, transparent 40%),
            radial-gradient(circle at 86% 82%, rgba(217, 165, 102, 0.12) 0%, transparent 38%);
          filter: blur(50px);
          pointer-events: none;
        }

        .welcome-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"),
            radial-gradient(circle at 50% 42%, transparent 55%, rgba(74, 32, 54, 0.05) 100%);
          background-size: 140px 140px, 100% 100%;
          opacity: 0.05;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .welcome-title {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-style: italic;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: 0.01em;
        }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .welcome-eyebrow { animation: rise-in 0.7s ease both; animation-delay: 0.05s; }
        .welcome-title   { animation: rise-in 0.7s ease both; animation-delay: 0.18s; }
        .welcome-text p  { animation: rise-in 0.7s ease both; animation-delay: 0.3s; }
        .hold-wrap       { animation: rise-in 0.8s ease both; animation-delay: 0.42s; }

        .drift {
          position: absolute;
          bottom: -10%;
          width: 14px;
          height: 14px;
          color: var(--rose);
          opacity: 0;
          pointer-events: none;
          animation: drift-up 9s ease-in infinite;
        }
        .drift-1 { left: 12%; width: 11px; height: 11px; animation-delay: 0s; }
        .drift-2 { left: 28%; width: 16px; height: 16px; animation-delay: 1.8s; filter: blur(0.6px); opacity: 0; }
        .drift-3 { left: 52%; width: 9px;  height: 9px;  animation-delay: 3.4s; }
        .drift-4 { left: 71%; width: 15px; height: 15px; animation-delay: 5.2s; filter: blur(0.6px); }
        .drift-5 { left: 87%; width: 10px; height: 10px; animation-delay: 6.6s; }

        @keyframes drift-up {
          0%   { transform: translateY(0) scale(0.8) rotate(-4deg); opacity: 0; }
          10%  { opacity: 0.2; }
          80%  { opacity: 0.12; }
          100% { transform: translateY(-70vh) scale(1.1) rotate(4deg); opacity: 0; }
        }

        .spark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          animation: twinkle 3.2s ease-in-out infinite;
        }
        .spark-1 { top: 2%;  left: 6%;   animation-delay: 0.3s; }
        .spark-2 { top: 72%; right: 4%;  animation-delay: 1.6s; width: 4px; height: 4px; }
        .spark-3 { top: 42%; left: -8%;  animation-delay: 2.4s; width: 4px; height: 4px; }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50%      { opacity: 0.8; transform: scale(1); }
        }
        #welcome-btn.holding ~ .spark,
        #welcome-btn.complete ~ .spark {
          animation-play-state: paused;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .caption-fade {
          display: inline-block;
          animation: caption-in 0.35s ease;
        }
        @keyframes caption-in {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .heart-shadow {
          position: absolute;
          top: 122px;
          left: 50%;
          width: 46px;
          height: 10px;
          background: radial-gradient(ellipse, rgba(156, 46, 84, 0.32) 0%, transparent 75%);
          filter: blur(3px);
          transform: translateX(-50%) scale(1);
          transition: transform 0.35s ease, opacity 0.35s ease;
          opacity: 0.8;
          pointer-events: none;
        }
        #welcome-btn.holding ~ .heart-shadow {
          transform: translateX(-50%) scale(1.3);
          opacity: 0.45;
        }
        #welcome-btn.complete ~ .heart-shadow {
          opacity: 0.55;
        }

        .hold-btn {
          transition: transform 0.15s ease, filter 0.4s ease;
          -webkit-tap-highlight-color: transparent;
        }
        #welcome-btn.holding {
          filter: drop-shadow(0 0 16px rgba(224, 86, 127, 0.45));
        }

        .hold-heart-outline { color: #f0c3d2; }

        .breathe-ring {
          position: absolute;
          inset: -18px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(224, 86, 127, 0.35) 0%, transparent 72%);
          animation: breathe 2.6s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(0.92); opacity: 0.55; }
          50%      { transform: scale(1.18); opacity: 0.05; }
        }

        #welcome-btn.holding .breathe-ring,
        #welcome-btn.complete .breathe-ring {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hold-wrap::before {
          content: "";
          position: absolute;
          inset: -60px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(217, 165, 102, 0.35) 0%, rgba(224, 86, 127, 0.18) 45%, transparent 72%);
          opacity: 0;
          transform: scale(0.6);
          pointer-events: none;
          z-index: -1;
        }
        .welcome-root:has(#welcome-btn.complete) .hold-wrap::before {
          animation: bloom 0.9s ease-out forwards;
        }
        @keyframes bloom {
          0%   { opacity: 0; transform: scale(0.5); }
          40%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0; transform: scale(1.6); }
        }

        .welcome-root:has(#welcome-btn.complete) .hold-caption {
          color: var(--rose-deep);
        }

        @media (prefers-reduced-motion: reduce) {
          .drift, .breathe-ring, .hold-wrap::before, .spark,
          .welcome-eyebrow, .welcome-title, .welcome-text p, .hold-wrap, .caption-fade {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}