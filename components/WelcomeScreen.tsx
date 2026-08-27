"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const HOLD_MS = 1900;
const HEART_PATH =
  "M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const uid = useId().replace(/:/g, "");
  const maskId = `liquidMask-${uid}`;
  const filterId = `softEdge-${uid}`;
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillGroupRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      holdingRef.current = false;
    };
  }, []);

  // Hardware-accelerated 2D Canvas Particle Burst
  const triggerHeartBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas || !btnRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const btnRect = btnRef.current.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;

    const pinkPalette = ["#ff758f", "#e0567f", "#ffb3c1", "#c93b68", "#ffccd5", "#ff4d6d"];
    const particleCount = 60; // Mobile-optimized count
    const particles: Particle[] = [];

    // Pre-render heart path for performance
    const heartPath = new Path2D(HEART_PATH);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 3.5;
      const maxLife = 90 + Math.random() * 30; // ~1.5 to 2 seconds at 60fps

      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 14 + Math.random() * 12,
        color: pinkPalette[Math.floor(Math.random() * pinkPalette.length)],
        rotation: (Math.random() - 0.5) * Math.PI,
        vRot: (Math.random() - 0.5) * 0.05,
        alpha: 1,
        life: 0,
        maxLife,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let p of particles) {
        if (p.life < p.maxLife) {
          alive = true;
          p.life++;

          // Physics update
          p.x += p.vx;
          p.y += p.vy + 0.3; // Gentle gravity
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.rotation += p.vRot;

          // Smooth fade-out in final 30% of lifetime
          const progress = p.life / p.maxLife;
          p.alpha = progress > 0.7 ? (1 - progress) / 0.3 : 1;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.size / 24, p.size / 24); // Original SVG viewbox is 24x24
          ctx.translate(-12, -12); // Center path origin

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill(heartPath);

          ctx.restore();
        }
      }

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animate);
  };

  const setProgress = (p: number) => {
    if (fillGroupRef.current) {
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

    triggerHeartBurst();

    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setTimeout(() => {
      setIsHiding(true);
      setTimeout(() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        onComplete();
      }, 500);
    }, 600);
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
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50" />

      <svg className="drift drift-1" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-2" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>
      <svg className="drift drift-3" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART_PATH} fill="currentColor" /></svg>

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
              <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
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
        }

        .welcome-root {
          background:
            radial-gradient(circle at 50% 30%, #fff4f7 0%, transparent 55%),
            linear-gradient(160deg, #fffaf6 0%, #fdeef2 45%, #fbe4ec 100%);
        }

        .welcome-title {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-style: italic;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: 0.01em;
        }

        .hold-btn {
          will-change: transform;
          transition: transform 0.15s ease, filter 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        
        #welcome-btn.holding {
          filter: drop-shadow(0 0 12px rgba(224, 86, 127, 0.35));
        }

        .hold-heart-outline { color: #f0c3d2; }

        .drift {
          position: absolute;
          bottom: -10%;
          width: 12px;
          height: 12px;
          color: var(--rose);
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          animation: drift-up 9s ease-in infinite;
        }
        .drift-1 { left: 15%; animation-delay: 0s; }
        .drift-2 { left: 50%; animation-delay: 3s; }
        .drift-3 { left: 82%; animation-delay: 6s; }

        @keyframes drift-up {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          15%  { opacity: 0.18; }
          80%  { opacity: 0.1; }
          100% { transform: translateY(-70vh) scale(1.1); opacity: 0; }
        }

        .breathe-ring {
          position: absolute;
          inset: -14px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(224, 86, 127, 0.25) 0%, transparent 70%);
          will-change: transform, opacity;
          animation: breathe 2.8s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(0.95); opacity: 0.5; }
          50%      { transform: scale(1.12); opacity: 0.1; }
        }

        .heart-shadow {
          position: absolute;
          top: 122px;
          left: 50%;
          width: 46px;
          height: 10px;
          background: radial-gradient(ellipse, rgba(156, 46, 84, 0.25) 0%, transparent 75%);
          transform: translateX(-50%) scale(1);
          transition: transform 0.35s ease, opacity 0.35s ease;
          opacity: 0.7;
          pointer-events: none;
        }

        .caption-fade {
          display: inline-block;
          animation: caption-in 0.25s ease;
        }
        @keyframes caption-in {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}