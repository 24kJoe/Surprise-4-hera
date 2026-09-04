"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "@/lib/config";
import { Heart, Sparkles, Feather } from "lucide-react";

export default function LetterSection() {
  const [typed, setTyped] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const text = CONFIG.letterText;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    setTyped("");
    setIsFinished(false);

    function tick() {
      if (i < text.length) {
        const currentChar = text[i];

        setTyped(text.slice(0, i + 1));
        i++;

        const delay =
          currentChar === "\n"
            ? 120
            : currentChar === "." || currentChar === ","
            ? 180
            : 18 + Math.random() * 24;

        timer = setTimeout(tick, delay);
      } else {
        setIsFinished(true);
      }
    }

    tick();

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="letter" className="relative py-24 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Expanded Max-Width for a wider parchment spread */}
      <div className="max-w-5xl mx-auto">
        {/* Parchment Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-[#fffdfa] rounded-[2.5rem] border border-rose-200/80 shadow-2xl shadow-rose-950/5 p-8 sm:p-14 md:p-20 overflow-hidden"
        >
          {/* Faint Stationery Watermark */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-10 pointer-events-none text-[var(--rose)]">
            <Feather className="w-28 h-28 sm:w-36 sm:h-36" />
          </div>

          {/* Top Stamp / Emblem */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-[var(--rose)] mb-3 shadow-xs">
              <Heart className="w-5 h-5 fill-rose-300/40" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.28em] text-[var(--rose)] uppercase font-sans">
              {CONFIG.toLine}
            </span>
          </div>

          {/* Letter Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[rgb(74,32,58)] text-center mb-8 sm:mb-10 tracking-tight">
            {CONFIG.heroTitle}
          </h1>

          {/* Ruled Paper Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300/80 to-transparent mx-auto mb-8 sm:mb-10" />

          {/* Typed Body Content */}
          <div className="min-h-[160px] sm:min-h-[200px] text-rose-950/85 font-serif text-base sm:text-lg md:text-xl leading-[2] tracking-wide whitespace-pre-wrap pl-1 sm:pl-2">
            {typed}
            <span
              className={`inline-block w-0.5 h-[1.15em] bg-[var(--rose)] ml-1 align-middle transition-opacity duration-300 ${
                isFinished ? "animate-pulse opacity-60" : "animate-blink opacity-100"
              }`}
            />
          </div>

          {/* Sign-off Footer */}
          <div className="mt-14 pt-8 border-t border-rose-100/90 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif italic text-base sm:text-lg text-[rgb(74,32,58)]">
              {CONFIG.signOff}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-serif italic">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Written with all my heart</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}