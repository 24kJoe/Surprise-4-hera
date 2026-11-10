"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/lib/config/site";
import { Heart, CalendarHeart } from "lucide-react";

function diff(start: Date, now: Date = new Date()) {
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

function getMonthsDiff(start: Date, now: Date = new Date()) {
  if (now < start) return { months: 0, extraDays: 0 };

  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  
  // Calculate if the day-of-month has passed
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + months);

  if (now < anchor) {
    months--;
    anchor.setMonth(anchor.getMonth() - 1);
  }

  const extraDays = Math.floor((now.getTime() - anchor.getTime()) / 86400000);
  return { months, extraDays };
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
  const [monthData, setMonthData] = useState({ months: 0, extraDays: 0 });

  useEffect(() => {
    const start = new Date(CONFIG.startDate);
    function update() {
      const now = new Date();
      setValues(diff(start, now));
      setMonthData(getMonthsDiff(start, now));
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
        <div className="mb-9 sm:mb-10">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#ad7690] font-medium mb-4">
            <span>Since The Day It Began</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl leading-[1.2] text-[#4a203a] font-normal tracking-tight">
            We&apos;ve been <span className="italic text-[#b34f79]">us</span> for<span className="text-[#c78aa5]">…</span>
          </h2>
        </div>

        {/* Counter Tiles */}
        <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-4">
          {items.map((item, idx) => (
            <div key={item.label} className="relative min-w-0 flex items-center sm:gap-4">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="relative w-full min-w-0 sm:w-auto sm:min-w-[128px] px-1 py-5 sm:px-5 sm:py-7 flex flex-col items-center justify-center group"
              >
                {/* Number Display */}
                <div className="text-[clamp(1.5rem,6.5vw,2.25rem)] sm:text-5xl font-serif text-[#b34f79] tabular-nums leading-none drop-shadow-[0_2px_8px_rgba(179,79,121,0.12)]">
                  <AnimatedNumber value={item.value} pad={item.pad} />
                </div>

                {/* Subtitle Label */}
                <span aria-hidden="true" className="mt-4 h-px w-8 bg-gradient-to-r from-transparent via-[#dba5bc] to-transparent" />
                <span className="mt-3 text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#80516a] group-hover:text-[#b34f79] transition-colors">
                  {item.label}
                </span>
              </motion.div>

              {/* Pulsing Heart Separator */}
              {idx < items.length - 1 && (
                <div aria-hidden="true" className="absolute -right-1 top-[calc(50%-22px)] -translate-y-1/2 translate-x-1/2 flex items-center justify-center text-[#c56d91]/60 sm:static sm:translate-x-0 sm:-translate-y-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  >
                    <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Months Tracker Note */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 inline-flex max-w-full items-center gap-3 rounded-2xl border border-rose-200/60 bg-gradient-to-br from-white to-[#fff2f7] px-4 py-3 sm:px-5 shadow-[0_5px_18px_-10px_rgba(174,62,104,0.2)] text-left"
        >
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-rose-50">
            <CalendarHeart className="h-4 w-4 text-[#bd6389]" strokeWidth={1.5} />
          </span>
          <span className="font-serif text-base leading-snug text-[#80516a]">
            <strong className="font-medium text-[#b34f79] text-xl tabular-nums">{monthData.months}</strong> {monthData.months === 1 ? "month" : "months"}
            {monthData.extraDays > 0 && (
              <> <span className="text-[#b68c9f]">&amp;</span> <strong className="font-medium text-[#b34f79] text-xl tabular-nums">{monthData.extraDays}</strong> {monthData.extraDays === 1 ? "day" : "days"}</>
            )}
            <span className="mt-0.5 block text-xs italic text-[#a17489]">of loving each other</span>
          </span>
        </motion.div>
        <div aria-hidden="true" className="mt-7 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-rose-200" />
          <Heart className="h-4 w-4 fill-[#c56d91] text-[#c56d91]" strokeWidth={1.2} />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-rose-200" />
        </div>
        <p className="mt-3 font-serif italic text-sm text-[#a16d84]">And I&apos;d choose you every second.</p>
      </div>
    </section>
  );
}
