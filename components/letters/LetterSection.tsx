"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "@/lib/config/site";
import { Heart } from "lucide-react";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

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
      <div className="w-full max-w-3xl mx-auto">
        {/* Parchment Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative isolate bg-[#fffdfc] rounded-[28px] sm:rounded-[36px] border border-[var(--line)] shadow-[0_18px_60px_-30px_rgba(144,57,94,0.2)] px-7 py-10 sm:px-14 sm:py-12 md:px-16 overflow-hidden"
        >
          <div aria-hidden="true" className="absolute inset-3 -z-10 rounded-[19px] sm:rounded-[25px] border border-rose-100/70 pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none text-[#dda4b8]">
            <Heart className="absolute left-4 top-16 h-5 w-5 -rotate-12 fill-current sm:left-7 sm:h-6 sm:w-6" strokeWidth={1} />
            <Heart className="absolute right-4 top-32 h-4 w-4 rotate-12 fill-current text-[#e8bdcc] sm:right-7 sm:h-5 sm:w-5" strokeWidth={1} />
            <Heart className="absolute bottom-32 left-4 h-4 w-4 rotate-12 fill-current text-[#e8bdcc] sm:left-7 sm:h-5 sm:w-5" strokeWidth={1} />
            <Heart className="absolute bottom-16 right-4 h-5 w-5 -rotate-12 fill-current sm:right-7 sm:h-6 sm:w-6" strokeWidth={1} />
          </div>

          {/* Top Stamp / Emblem */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-7">
            <div aria-hidden="true" className="flex items-center gap-4 text-[#c56d91] mb-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-200" />
              <Heart className="w-5 h-5 fill-current" strokeWidth={1.2} />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-200" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.28em] text-[var(--rose)] uppercase font-sans">
              {CONFIG.toLine}
            </span>
          </div>

          {/* Letter Title */}
          <h1 dir="auto" className={`${amiri.className} text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[rgb(74,32,58)] text-center mb-6 sm:mb-7 leading-[1.6] tracking-tight`}>
            {CONFIG.heroTitle}
          </h1>

          {/* Ruled Paper Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-auto mb-7 sm:mb-8" />

          {/* Typed Body Content */}
          <div dir="auto" className={`${amiri.className} min-h-[160px] sm:min-h-[200px] text-rose-950/85 font-serif text-base sm:text-lg md:text-xl leading-[2.2] whitespace-pre-wrap break-words text-start px-1 sm:px-2`}>
            {typed}
            <span
              className={`inline-block w-0.5 h-[1.15em] bg-[var(--rose)] ml-1 align-middle transition-opacity duration-300 ${
                isFinished ? "animate-pulse opacity-60" : "animate-blink opacity-100"
              }`}
            />
          </div>

          {/* Sign-off Footer */}
          <div aria-hidden="true" className="mx-auto mt-10 flex w-full max-w-xs items-center justify-center gap-4 sm:gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#dfafc2]" />
            <div className="flex items-center gap-2.5">
              <Heart className="h-2.5 w-2.5 -rotate-12 fill-current text-[#dfafc2]" strokeWidth={1} />
              <Heart className="h-5 w-5 fill-current text-[#bd708e]" strokeWidth={1} />
              <Heart className="h-2.5 w-2.5 rotate-12 fill-current text-[#dfafc2]" strokeWidth={1} />
            </div>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#dfafc2]" />
          </div>
          <div className="relative pt-6 flex justify-end text-end">
            <span className={`${amiri.className} font-serif italic text-base sm:text-lg text-[rgb(74,32,58)]`}>
              {CONFIG.signOff}
            </span>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
