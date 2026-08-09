"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

export default function LetterSection() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const text = CONFIG.letterText;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (i < text.length) {
        const currentChar = text[i];
        
        setTyped((prev) => prev + currentChar);
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
  }, []); // تعمل المرة الأولى فقط عند تحميل المكون

  return (
    <section id="letter">
      <div className="section-inner">
        <div className="letter-card">
          <div className="to-line">{CONFIG.toLine}</div>
          <h1 className="hero-title">{CONFIG.heroTitle}</h1>
          <div id="typed-letter">
            {typed}
            <span className="cursor">&nbsp;</span>
          </div>
          <div className="sign-off">{CONFIG.signOff}</div>
        </div>
      </div>
    </section>
  );
}