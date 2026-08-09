"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/lib/config";

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
    <div className="relative inline-flex overflow-hidden h-[1.2em] w-[0.65em] justify-center items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
    <div className="inline-flex items-center justify-center">
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
    { label: "Days", value: values.days, pad: 2 },
    { label: "Hours", value: values.hours, pad: 2 },
    { label: "Minutes", value: values.mins, pad: 2 },
    { label: "Seconds", value: values.secs, pad: 2 },
  ];

  return (
    <section id="counter" className="text-center py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#4a2036]/55 mb-1">
            Since The Day It Began
          </div>
          <h2 className="text-2xl font-bold text-[#4a2036]">
            We&apos;ve been us for...
          </h2>
        </div>

        {/* Counter Grid */}
        <div className="mt-2.5 flex flex-wrap justify-center gap-[clamp(10px,3vw,28px)]">
          {items.map((item) => (
            <div
              key={item.label}
              className="min-w-[100px] rounded-lg border border-[var(--line)] bg-[#4a2036]/[0.03] px-2.5 py-[22px] backdrop-blur-sm"
            >
              <div className="font-serif text-[clamp(1.8rem,5vw,2.6rem)] text-[var(--gold-soft)] tabular-nums leading-none">
                <AnimatedNumber value={item.value} pad={item.pad} />
              </div>
              <div className="mt-[6px] text-[0.68rem] uppercase tracking-[0.18em] text-[#4a2036]/55">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}