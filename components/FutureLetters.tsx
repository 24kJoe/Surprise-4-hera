"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Sparkles, Heart, Calendar, X, Clock, Compass } from "lucide-react";

interface FutureLetter {
  id: string;
  unlockDate: string;
  displayDate: string;
  occasion: string;
  title: string;
  lockedTitle: string;
  teaser: string;
  lockedTeaser: string;
  content: string;
}

const futureLetters: FutureLetter[] = [
  {
    id: "1",
    unlockDate: "2026-11-02T00:00:00",
    displayDate: "Nov 2, 2026",
    occasion: "My Birthday",
    title: "Surprise",
    lockedTitle: "My Birthday Letter for you",
    teaser: "A little note for your special day.",
    lockedTeaser: "You won't have a look until my birthday comes.",
    content:
      "Happy Birthday, my love! I hope today brings you as much happiness as you bring into my life every single day. I'm so grateful for you...",
  },
  {
    id: "2",
    unlockDate: "2027-01-17T13:21:00",
    displayDate: "Jan 17, 2027",
    occasion: "1st Anniversary",
    title: "Happy Anniversary",
    lockedTitle: "One Year Anniversary",
    teaser: "I have a little something for you i guess you have to wait, patience is key.",
    lockedTeaser: "Imagine on that day we will be celebrating our first year together.",
    content:
      "Happy Anniversary, my love. Exactly at 1:21 PM today marks our first year together. I wrote this in advance so it would be waiting for you. Whatever this year held, I hope you feel how deeply loved you are right now...",
  },
  {
    id: "3",
    unlockDate: "2027-02-07T00:00:00",
    displayDate: "Feb 7, 2027",
    occasion: "Ramadan",
    title: "With You 💍",
    lockedTitle: "First Ramadan Together",
    teaser: "Reflecting on our time together.",
    lockedTeaser: "Locked until February 7th.",
    content:
      "A beautiful milestone with you. Thank you for choosing us every single day. Here's to forever...",
  },
];

function getLiveCountdown(target: string, now: number) {
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function FutureLetters() {
  const [now, setNow] = useState<number>(Date.now());
  const [openLetter, setOpenLetter] = useState<FutureLetter | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isUnlocked = (letter: FutureLetter) =>
    new Date(letter.unlockDate).getTime() <= now;

  return (
    <section id="secret-letters" className="relative w-full py-16 px-4 overflow-hidden">
      {/* Gentle Floating Atmospheric Sparkles */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/25"
            style={{
              top: `${12 * i + 6}%`,
              left: `${(i * 19 + 5) % 94}%`,
            }}
            animate={{
              y: [0, -16, 0],
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-5 h-5 fill-rose-200/40" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.25em] font-semibold text-[var(--rose)] uppercase bg-rose-100/70 px-4 py-1.5 rounded-full border border-rose-200/60 mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5" /> Time-Locked Keepsakes
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[rgb(74,32,58)] tracking-tight font-medium">
            Letters for Later
          </h2>
          <p className="mt-3 text-sm sm:text-base text-rose-900/65 max-w-lg mx-auto italic font-serif">
            Sealed thoughts, personal vows, and milestones waiting for their day to arrive.
          </p>
        </div>

        {/* Envelopes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {futureLetters.map((letter) => {
            const unlocked = isUnlocked(letter);
            const countdown = !unlocked ? getLiveCountdown(letter.unlockDate, now) : null;

            return (
              <motion.div
                key={letter.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => unlocked && setOpenLetter(letter)}
                className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                  unlocked
                    ? "bg-gradient-to-b from-white via-white/95 to-rose-50/40 border-rose-200/90 shadow-xl shadow-rose-900/5 cursor-pointer hover:border-[var(--rose)] hover:shadow-2xl hover:shadow-rose-900/10"
                    : "bg-white/60 backdrop-blur-md border-rose-100/80 shadow-sm cursor-not-allowed select-none"
                }`}
              >
                {/* Envelope Top Flap Border Line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200 rounded-t-3xl opacity-70" />

                <div>
                  {/* Header Row: Occasion & Wax Seal */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="inline-block text-[10px] font-bold tracking-widest text-[var(--rose)] uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                      {letter.occasion}
                    </span>

                    {/* Wax Seal Badge */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 ${
                        unlocked
                          ? "bg-[var(--rose)] border-rose-300 text-white shadow-rose-500/30 group-hover:scale-110"
                          : "bg-rose-100/70 border-rose-200 text-rose-400"
                      }`}
                      title={unlocked ? "Click to open letter" : "Letter is locked"}
                    >
                      {unlocked ? (
                        <Mail className="w-5 h-5 drop-shadow-sm" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Letter Title */}
                  <h3
                    className={`font-serif text-xl sm:text-2xl font-semibold mb-2 leading-snug transition-colors ${
                      unlocked
                        ? "text-[rgb(74,32,58)] group-hover:text-[var(--rose)]"
                        : "text-[rgb(74,32,58)]/75"
                    }`}
                  >
                    {unlocked ? letter.title : letter.lockedTitle}
                  </h3>

                  {/* Teaser Preview */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 font-serif italic ${
                      unlocked ? "text-rose-900/75" : "text-rose-800/50"
                    }`}
                  >
                    {unlocked ? `"${letter.teaser}"` : letter.lockedTeaser}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="pt-4 border-t border-rose-100/90 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-rose-500/80 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {letter.displayDate}
                    </span>

                    {unlocked && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--rose)] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <Sparkles className="w-3 h-3" /> Read Now
                      </span>
                    )}
                  </div>

                  {/* Countdown Timer Dials (Only when locked) */}
                  {!unlocked && countdown && (
                    <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
                      {[
                        { label: "Days", val: countdown.days },
                        { label: "Hours", val: countdown.hours },
                        { label: "Mins", val: countdown.minutes },
                        { label: "Secs", val: countdown.seconds },
                      ].map((slot, idx) => (
                        <div
                          key={idx}
                          className="bg-rose-50/70 border border-rose-100 rounded-xl py-1.5 px-1 flex flex-col items-center justify-center"
                        >
                          <span className="font-mono text-xs font-bold text-[rgb(74,32,58)]">
                            {String(slot.val).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-rose-400 font-sans">
                            {slot.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Parchment Letter Read Modal */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-[rgb(50,20,38)]/50 backdrop-blur-md"
            onClick={() => setOpenLetter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#fffdfa] rounded-[2rem] border border-rose-200/80 shadow-2xl p-7 sm:p-10 overflow-hidden"
            >
              {/* Decorative Envelope Stationery Corner Stamp */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-100/50 via-transparent to-transparent pointer-events-none rounded-tr-[2rem]" />

              {/* Close Button */}
              <button
                onClick={() => setOpenLetter(null)}
                aria-label="Close letter"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Wax Seal Emblem */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-13 h-13 rounded-full bg-[var(--rose)] border-2 border-rose-300/80 flex items-center justify-center text-white shadow-lg shadow-rose-900/15 mb-3">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--rose)] uppercase">
                  {openLetter.occasion}
                </span>
                <span className="text-xs text-rose-400 mt-0.5 font-sans">
                  Written for {openLetter.displayDate}
                </span>
              </div>

              {/* Letter Heading */}
              <h2 className="text-center text-2xl sm:text-3xl font-serif font-medium text-[rgb(74,32,58)] mb-6 border-b border-rose-100 pb-4">
                {openLetter.title}
              </h2>

              {/* Letter Body Parchment */}
              <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200">
                <p className="text-sm sm:text-base leading-relaxed text-rose-950/80 whitespace-pre-wrap font-serif italic text-left">
                  {openLetter.content}
                </p>
              </div>

              {/* Letter Sign-off Footer */}
              <div className="mt-8 pt-4 border-t border-rose-100/80 flex justify-between items-center text-xs text-rose-400 font-serif italic">
                <span>With all my love</span>
                <Compass className="w-4 h-4 text-rose-300" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}