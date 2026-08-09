"use client";

import { useEffect, useRef, useState } from "react";

type Heart = {
  id: number;
  left: number;
  size: number;
  opacity: number;
  drift: number;
  duration: number;
};

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const uidRef = useRef(0);

  useEffect(() => {
    function spawn() {
      const id = uidRef.current++;
      const size = 14 + Math.random() * 22;
      const heart: Heart = {
        id,
        left: Math.random() * 100,
        size,
        opacity: 0.35 + Math.random() * 0.35,
        drift: Math.random() * 160 - 80,
        duration: 9 + Math.random() * 8,
      };
      setHearts((prev) => [...prev, heart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, heart.duration * 1000 + 200);
    }

    const interval = setInterval(spawn, 900);
    const timeouts = [0, 1, 2, 3, 4].map((i) => setTimeout(spawn, i * 300));

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []); // يشتغل باستمرار وبشكل تلقائي بمجرد التحميل

  return (
    <div id="heart-field" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={
            {
              left: `${h.left}vw`,
              width: h.size,
              height: (h.size * 29) / 32,
              opacity: h.opacity,
              "--drift": `${h.drift}px`,
              animationName: "float-up",
              animationDuration: `${h.duration}s`,
              animationTimingFunction: "ease-in",
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`g${h.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb3cf" />
                <stop offset="100%" stopColor="#e0507f" />
              </linearGradient>
            </defs>
            <path
              d="M16 28.5 2.6 15.6C-1.9 11.2 0.4 3.6 6.8 2.6c3-0.5 6 0.9 7.7 3.4C16.2 3.5 19.2 2.1 22.2 2.6c6.4 1 8.7 8.6 4.2 13L16 28.5z"
              fill={`url(#g${h.id})`}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}