"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/lib/config";
import { Heart, Sparkles } from "lucide-react";

function diff(start: Date = new Date("2026-01-17T13:21:00+02:00"), now: Date = new Date()) {
  let ms = now.getTime() - start.getTime();
  if (ms < 0) ms = 0;
  const days = Math.floor(ms / 86400000);
  ms -= days * 86400000;
  const hours = Math.floor(ms / 3600000);
  ms -= hours * 3600000;
  const mins = Math.floor(ms / 60000);
  ms -= mins * 60000;
  const secs = Math.floor(ms / 1000);
  return { days, hours, mins, secs };
}

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <div className="relative inline-flex overflow-hidden h-[1.2em] w-[0.62em] justify-center items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: "75%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-75%", opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function AnimatedNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const digits = String(value).padStart(pad, "0").split("");
  return (
    <div className="inline-flex items-center justify-center font-serif">
      {digits.map((digit, idx) => (
        <AnimatedDigit key={idx} digit={digit} />
      ))}
    </div>
  );
}

export default function CounterSection() {
  const [values, setValues] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const start = new Date(CONFIG.startDate);
    function update() {
      setValues(diff(start, new Date()));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Days", value: values.days, pad: values.days > 99 ? 3 : 2 },
    { label: "Hours", value: values.hours, pad: 2 },
    { label: "Minutes", value: values.mins, pad: 2 },
    { label: "Seconds", value: values.secs, pad: 2 },
  ];

  return (
    <section id="counter" className="relative py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-[var(--gold-soft)] font-medium mb-2 bg-rose-50/60 px-3.5 py-1 rounded-full border border-rose-100/70 shadow-xs">
            <Sparkles className="w-3 h-3 text-[var(--rose)]" />
            <span>Since The Day It Began</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[rgb(74,32,58)] font-normal tracking-tight">
            We&apos;ve been us for...
          </h2>
        </div>

        {/* Counter Tiles */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {items.map((item, idx) => (
            <div key={item.label} className="flex items-center gap-3 sm:gap-5">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="relative min-w-[90px] sm:min-w-[115px] rounded-2xl border border-[var(--line)] bg-white/80 p-4 sm:p-5 shadow-sm backdrop-blur-md flex flex-col items-center justify-center group hover:border-[var(--rose)]/40 hover:shadow-md transition-all"
              >
                {/* Number Display */}
                <div className="text-3xl sm:text-4xl font-serif text-[var(--gold-soft)] tabular-nums leading-none drop-shadow-xs">
                  <AnimatedNumber value={item.value} pad={item.pad} />
                </div>

                {/* Subtitle Label */}
                <span className="mt-2.5 text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#4a2036]/60 group-hover:text-[var(--rose)] transition-colors">
                  {item.label}
                </span>
              </motion.div>

              {/* Pulsing Heart Separator */}
              {idx < items.length - 1 && (
                <div className="hidden sm:flex items-center justify-center text-[var(--rose)]/45">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}