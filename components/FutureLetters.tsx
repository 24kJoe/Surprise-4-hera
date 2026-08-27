"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Sparkles, Heart, CalendarClock, X } from "lucide-react";

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
    lockedTitle: "My Birthday Letter for you ",
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
    lockedTitle: "One Year Anniversary ",
    teaser: "I have a little something for you i guess you have to wait, paitence is key.",
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto px-4 py-8 overflow-hidden"
    >
      {/* Floating Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/30"
            style={{
              top: `${15 * i + 8}%`,
              left: `${(i * 21) % 90}%`,
            }}
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 4.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-5 h-5 fill-pink-200/40" />
          </motion.div>
        ))}
      </div>

      {/* Header Section */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs tracking-widest font-semibold text-pink-500 uppercase bg-pink-100/80 px-3 py-1 rounded-full border border-pink-200/50 mb-3 shadow-xs">
          <Lock className="w-3.5 h-3.5" /> Time Capsule
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[rgb(74,32,58)] tracking-tight">
          Letters for Later
        </h1>
        <p className="mt-2 text-sm sm:text-base text-pink-700/80 max-w-md mx-auto italic font-light">
          Little notes sealed away, waiting patiently for the right moment to reach you.
        </p>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <AnimatePresence>
          {futureLetters.map((letter) => {
            const unlocked = isUnlocked(letter);
            const countdown = !unlocked ? getLiveCountdown(letter.unlockDate, now) : null;

            return (
              <motion.div
                key={letter.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => unlocked && setOpenLetter(letter)}
                className={`relative p-5 sm:p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                  unlocked
                    ? "bg-white/90 border-pink-300 shadow-md cursor-pointer hover:bg-white hover:border-pink-400"
                    : "bg-white/50 border-pink-200/50 shadow-xs cursor-not-allowed opacity-90"
                }`}
              >
                {/* Wax-seal style badge */}
                <div
                  className={`absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border ${
                    unlocked
                      ? "bg-pink-500 border-pink-300 text-white"
                      : "bg-pink-100 border-pink-200 text-pink-400"
                  }`}
                >
                  {unlocked ? <Mail className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                <span className="text-[10px] font-semibold tracking-wider text-pink-400 uppercase">
                  {letter.occasion}
                </span>

                <h2
                  className={`text-lg font-serif mt-1 mb-2 ${
                    unlocked ? "text-[rgb(74,32,58)]" : "text-[rgb(74,32,58)]/70"
                  }`}
                >
                  {unlocked ? letter.title : letter.lockedTitle}
                </h2>

                <p
                  className={`text-xs sm:text-sm leading-relaxed italic mb-4 ${
                    unlocked ? "text-pink-800/70" : "text-pink-700/60"
                  }`}
                >
                  {unlocked ? `"${letter.teaser}"` : letter.lockedTeaser}
                </p>

                {/* Live Countdown & Status Footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-pink-100/80">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-pink-500">
                    <CalendarClock className="w-3.5 h-3.5" />
                    {letter.displayDate}
                  </span>

                  {unlocked ? (
                    <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                      Tap to open
                    </span>
                  ) : countdown ? (
                    <span className="text-[11px] font-mono font-medium text-pink-500/90 bg-pink-50/80 px-2 py-0.5 rounded-md border border-pink-100">
                      {countdown.days > 0 && `${countdown.days}d `}
                      {String(countdown.hours).padStart(2, "0")}h{" "}
                      {String(countdown.minutes).padStart(2, "0")}m{" "}
                      {String(countdown.seconds).padStart(2, "0")}s
                    </span>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Opened Letter Modal */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center p-5 bg-[rgb(74,32,58)]/40 backdrop-blur-sm"
            onClick={() => setOpenLetter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl border border-pink-200 shadow-2xl p-7 sm:p-9"
            >
              <button
                onClick={() => setOpenLetter(null)}
                aria-label="Close letter"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                  <Heart className="w-5 h-5 fill-pink-400" />
                </div>
              </div>

              <span className="block text-center text-[10px] font-semibold tracking-widest text-pink-400 uppercase mb-1">
                {openLetter.occasion} · {openLetter.displayDate}
              </span>
              <h2 className="text-center text-2xl font-serif text-[rgb(74,32,58)] mb-5">
                {openLetter.title}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-pink-900/80 whitespace-pre-wrap font-light">
                {openLetter.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}