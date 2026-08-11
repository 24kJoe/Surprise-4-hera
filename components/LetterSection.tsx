"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

export default function LetterSection() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const text = CONFIG.letterText;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    // Reset typed string on mount/change to prevent stale state overlap
    setTyped("");

    function tick() {
      if (i < text.length) {
        const currentChar = text[i];
        
        // Use slice up to index i+1 to ensure strict string rendering
        setTyped(text.slice(0, i + 1));
        i++;

        const delay =
          currentChar === "\n"
            ? 90
            : currentChar === "."
            ? 140
            : 16 + Math.random() * 22;

        timer = setTimeout(tick, delay);
      }
    }

    tick();

    return () => clearTimeout(timer);
  }, []); 

  return (
    <section id="letter">
      <div className="section-inner">
        <div className="letter-card">
          <div className="to-line">{CONFIG.toLine}</div>
          <h1 className="hero-title">{CONFIG.heroTitle}</h1>
          
          {/* whiteSpace: "pre-wrap" forces HTML to render \n newlines correctly */}
          <div id="typed-letter" style={{ whiteSpace: "pre-wrap" }}>
            {typed}
            <span className="cursor">&nbsp;</span>
          </div>
          
          <div className="sign-off">{CONFIG.signOff}</div>
        </div>
      </div>
    </section>
  );
}