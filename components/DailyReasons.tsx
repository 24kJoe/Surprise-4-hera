"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Sparkles, BookOpen, Clock, ArrowLeft, Calendar, X } from "lucide-react";

interface DailyReason {
  id: string;
  dayNumber: number;
  unlockDate: string; // Format: "YYYY-MM-DDThh:mm:ss"
  title: string;
  content: string;
}

// All 100 reasons strictly starting from October 15, 2026. 
// Simply replace the title and content for each day.
const dailyReasons: DailyReason[] = [
  { id: "1", dayNumber: 1, unlockDate: "2026-10-15T00:00:00", title: "Your Smile", content: "I love you because your smile is the brightest thing in my universe." },
  { id: "2", dayNumber: 2, unlockDate: "2026-10-16T00:00:00", title: "Your Heart", content: "I love you for how deeply you care about the people around you." },
  { id: "3", dayNumber: 3, unlockDate: "2026-10-17T00:00:00", title: "How You Make Me Feel", content: "I love you because you make me feel like I can conquer the world." },
  { id: "4", dayNumber: 4, unlockDate: "2026-10-18T00:00:00", title: "Reason 4", content: "Type your reason here..." },
  { id: "5", dayNumber: 5, unlockDate: "2026-10-19T00:00:00", title: "Reason 5", content: "Type your reason here..." },
  { id: "6", dayNumber: 6, unlockDate: "2026-10-20T00:00:00", title: "Reason 6", content: "Type your reason here..." },
  { id: "7", dayNumber: 7, unlockDate: "2026-10-21T00:00:00", title: "Reason 7", content: "Type your reason here..." },
  { id: "8", dayNumber: 8, unlockDate: "2026-10-22T00:00:00", title: "Reason 8", content: "Type your reason here..." },
  { id: "9", dayNumber: 9, unlockDate: "2026-10-23T00:00:00", title: "Reason 9", content: "Type your reason here..." },
  { id: "10", dayNumber: 10, unlockDate: "2026-10-24T00:00:00", title: "Reason 10", content: "Type your reason here..." },
  { id: "11", dayNumber: 11, unlockDate: "2026-10-25T00:00:00", title: "Reason 11", content: "Type your reason here..." },
  { id: "12", dayNumber: 12, unlockDate: "2026-10-26T00:00:00", title: "Reason 12", content: "Type your reason here..." },
  { id: "13", dayNumber: 13, unlockDate: "2026-10-27T00:00:00", title: "Reason 13", content: "Type your reason here..." },
  { id: "14", dayNumber: 14, unlockDate: "2026-10-28T00:00:00", title: "Reason 14", content: "Type your reason here..." },
  { id: "15", dayNumber: 15, unlockDate: "2026-10-29T00:00:00", title: "Reason 15", content: "Type your reason here..." },
  { id: "16", dayNumber: 16, unlockDate: "2026-10-30T00:00:00", title: "Reason 16", content: "Type your reason here..." },
  { id: "17", dayNumber: 17, unlockDate: "2026-10-31T00:00:00", title: "Reason 17", content: "Type your reason here..." },
  { id: "18", dayNumber: 18, unlockDate: "2026-11-01T00:00:00", title: "Reason 18", content: "Type your reason here..." },
  { id: "19", dayNumber: 19, unlockDate: "2026-11-02T00:00:00", title: "Reason 19", content: "Type your reason here..." },
  { id: "20", dayNumber: 20, unlockDate: "2026-11-03T00:00:00", title: "Reason 20", content: "Type your reason here..." },
  { id: "21", dayNumber: 21, unlockDate: "2026-11-04T00:00:00", title: "Reason 21", content: "Type your reason here..." },
  { id: "22", dayNumber: 22, unlockDate: "2026-11-05T00:00:00", title: "Reason 22", content: "Type your reason here..." },
  { id: "23", dayNumber: 23, unlockDate: "2026-11-06T00:00:00", title: "Reason 23", content: "Type your reason here..." },
  { id: "24", dayNumber: 24, unlockDate: "2026-11-07T00:00:00", title: "Reason 24", content: "Type your reason here..." },
  { id: "25", dayNumber: 25, unlockDate: "2026-11-08T00:00:00", title: "Reason 25", content: "Type your reason here..." },
  { id: "26", dayNumber: 26, unlockDate: "2026-11-09T00:00:00", title: "Reason 26", content: "Type your reason here..." },
  { id: "27", dayNumber: 27, unlockDate: "2026-11-10T00:00:00", title: "Reason 27", content: "Type your reason here..." },
  { id: "28", dayNumber: 28, unlockDate: "2026-11-11T00:00:00", title: "Reason 28", content: "Type your reason here..." },
  { id: "29", dayNumber: 29, unlockDate: "2026-11-12T00:00:00", title: "Reason 29", content: "Type your reason here..." },
  { id: "30", dayNumber: 30, unlockDate: "2026-11-13T00:00:00", title: "Reason 30", content: "Type your reason here..." },
  { id: "31", dayNumber: 31, unlockDate: "2026-11-14T00:00:00", title: "Reason 31", content: "Type your reason here..." },
  { id: "32", dayNumber: 32, unlockDate: "2026-11-15T00:00:00", title: "Reason 32", content: "Type your reason here..." },
  { id: "33", dayNumber: 33, unlockDate: "2026-11-16T00:00:00", title: "Reason 33", content: "Type your reason here..." },
  { id: "34", dayNumber: 34, unlockDate: "2026-11-17T00:00:00", title: "Reason 34", content: "Type your reason here..." },
  { id: "35", dayNumber: 35, unlockDate: "2026-11-18T00:00:00", title: "Reason 35", content: "Type your reason here..." },
  { id: "36", dayNumber: 36, unlockDate: "2026-11-19T00:00:00", title: "Reason 36", content: "Type your reason here..." },
  { id: "37", dayNumber: 37, unlockDate: "2026-11-20T00:00:00", title: "Reason 37", content: "Type your reason here..." },
  { id: "38", dayNumber: 38, unlockDate: "2026-11-21T00:00:00", title: "Reason 38", content: "Type your reason here..." },
  { id: "39", dayNumber: 39, unlockDate: "2026-11-22T00:00:00", title: "Reason 39", content: "Type your reason here..." },
  { id: "40", dayNumber: 40, unlockDate: "2026-11-23T00:00:00", title: "Reason 40", content: "Type your reason here..." },
  { id: "41", dayNumber: 41, unlockDate: "2026-11-24T00:00:00", title: "Reason 41", content: "Type your reason here..." },
  { id: "42", dayNumber: 42, unlockDate: "2026-11-25T00:00:00", title: "Reason 42", content: "Type your reason here..." },
  { id: "43", dayNumber: 43, unlockDate: "2026-11-26T00:00:00", title: "Reason 43", content: "Type your reason here..." },
  { id: "44", dayNumber: 44, unlockDate: "2026-11-27T00:00:00", title: "Reason 44", content: "Type your reason here..." },
  { id: "45", dayNumber: 45, unlockDate: "2026-11-28T00:00:00", title: "Reason 45", content: "Type your reason here..." },
  { id: "46", dayNumber: 46, unlockDate: "2026-11-29T00:00:00", title: "Reason 46", content: "Type your reason here..." },
  { id: "47", dayNumber: 47, unlockDate: "2026-11-30T00:00:00", title: "Reason 47", content: "Type your reason here..." },
  { id: "48", dayNumber: 48, unlockDate: "2026-12-01T00:00:00", title: "Reason 48", content: "Type your reason here..." },
  { id: "49", dayNumber: 49, unlockDate: "2026-12-02T00:00:00", title: "Reason 49", content: "Type your reason here..." },
  { id: "50", dayNumber: 50, unlockDate: "2026-12-03T00:00:00", title: "Reason 50", content: "Type your reason here..." },
  { id: "51", dayNumber: 51, unlockDate: "2026-12-04T00:00:00", title: "Reason 51", content: "Type your reason here..." },
  { id: "52", dayNumber: 52, unlockDate: "2026-12-05T00:00:00", title: "Reason 52", content: "Type your reason here..." },
  { id: "53", dayNumber: 53, unlockDate: "2026-12-06T00:00:00", title: "Reason 53", content: "Type your reason here..." },
  { id: "54", dayNumber: 54, unlockDate: "2026-12-07T00:00:00", title: "Reason 54", content: "Type your reason here..." },
  { id: "55", dayNumber: 55, unlockDate: "2026-12-08T00:00:00", title: "Reason 55", content: "Type your reason here..." },
  { id: "56", dayNumber: 56, unlockDate: "2026-12-09T00:00:00", title: "Reason 56", content: "Type your reason here..." },
  { id: "57", dayNumber: 57, unlockDate: "2026-12-10T00:00:00", title: "Reason 57", content: "Type your reason here..." },
  { id: "58", dayNumber: 58, unlockDate: "2026-12-11T00:00:00", title: "Reason 58", content: "Type your reason here..." },
  { id: "59", dayNumber: 59, unlockDate: "2026-12-12T00:00:00", title: "Reason 59", content: "Type your reason here..." },
  { id: "60", dayNumber: 60, unlockDate: "2026-12-13T00:00:00", title: "Reason 60", content: "Type your reason here..." },
  { id: "61", dayNumber: 61, unlockDate: "2026-12-14T00:00:00", title: "Reason 61", content: "Type your reason here..." },
  { id: "62", dayNumber: 62, unlockDate: "2026-12-15T00:00:00", title: "Reason 62", content: "Type your reason here..." },
  { id: "63", dayNumber: 63, unlockDate: "2026-12-16T00:00:00", title: "Reason 63", content: "Type your reason here..." },
  { id: "64", dayNumber: 64, unlockDate: "2026-12-17T00:00:00", title: "Reason 64", content: "Type your reason here..." },
  { id: "65", dayNumber: 65, unlockDate: "2026-12-18T00:00:00", title: "Reason 65", content: "Type your reason here..." },
  { id: "66", dayNumber: 66, unlockDate: "2026-12-19T00:00:00", title: "Reason 66", content: "Type your reason here..." },
  { id: "67", dayNumber: 67, unlockDate: "2026-12-20T00:00:00", title: "Reason 67", content: "Type your reason here..." },
  { id: "68", dayNumber: 68, unlockDate: "2026-12-21T00:00:00", title: "Reason 68", content: "Type your reason here..." },
  { id: "69", dayNumber: 69, unlockDate: "2026-12-22T00:00:00", title: "Reason 69", content: "Type your reason here..." },
  { id: "70", dayNumber: 70, unlockDate: "2026-12-23T00:00:00", title: "Reason 70", content: "Type your reason here..." },
  { id: "71", dayNumber: 71, unlockDate: "2026-12-24T00:00:00", title: "Reason 71", content: "Type your reason here..." },
  { id: "72", dayNumber: 72, unlockDate: "2026-12-25T00:00:00", title: "Reason 72", content: "Type your reason here..." },
  { id: "73", dayNumber: 73, unlockDate: "2026-12-26T00:00:00", title: "Reason 73", content: "Type your reason here..." },
  { id: "74", dayNumber: 74, unlockDate: "2026-12-27T00:00:00", title: "Reason 74", content: "Type your reason here..." },
  { id: "75", dayNumber: 75, unlockDate: "2026-12-28T00:00:00", title: "Reason 75", content: "Type your reason here..." },
  { id: "76", dayNumber: 76, unlockDate: "2026-12-29T00:00:00", title: "Reason 76", content: "Type your reason here..." },
  { id: "77", dayNumber: 77, unlockDate: "2026-12-30T00:00:00", title: "Reason 77", content: "Type your reason here..." },
  { id: "78", dayNumber: 78, unlockDate: "2026-12-31T00:00:00", title: "Reason 78", content: "Type your reason here..." },
  { id: "79", dayNumber: 79, unlockDate: "2027-01-01T00:00:00", title: "Reason 79", content: "Type your reason here..." },
  { id: "80", dayNumber: 80, unlockDate: "2027-01-02T00:00:00", title: "Reason 80", content: "Type your reason here..." },
  { id: "81", dayNumber: 81, unlockDate: "2027-01-03T00:00:00", title: "Reason 81", content: "Type your reason here..." },
  { id: "82", dayNumber: 82, unlockDate: "2027-01-04T00:00:00", title: "Reason 82", content: "Type your reason here..." },
  { id: "83", dayNumber: 83, unlockDate: "2027-01-05T00:00:00", title: "Reason 83", content: "Type your reason here..." },
  { id: "84", dayNumber: 84, unlockDate: "2027-01-06T00:00:00", title: "Reason 84", content: "Type your reason here..." },
  { id: "85", dayNumber: 85, unlockDate: "2027-01-07T00:00:00", title: "Reason 85", content: "Type your reason here..." },
  { id: "86", dayNumber: 86, unlockDate: "2027-01-08T00:00:00", title: "Reason 86", content: "Type your reason here..." },
  { id: "87", dayNumber: 87, unlockDate: "2027-01-09T00:00:00", title: "Reason 87", content: "Type your reason here..." },
  { id: "88", dayNumber: 88, unlockDate: "2027-01-10T00:00:00", title: "Reason 88", content: "Type your reason here..." },
  { id: "89", dayNumber: 89, unlockDate: "2027-01-11T00:00:00", title: "Reason 89", content: "Type your reason here..." },
  { id: "90", dayNumber: 90, unlockDate: "2027-01-12T00:00:00", title: "Reason 90", content: "Type your reason here..." },
  { id: "91", dayNumber: 91, unlockDate: "2027-01-13T00:00:00", title: "Reason 91", content: "Type your reason here..." },
  { id: "92", dayNumber: 92, unlockDate: "2027-01-14T00:00:00", title: "Reason 92", content: "Type your reason here..." },
  { id: "93", dayNumber: 93, unlockDate: "2027-01-15T00:00:00", title: "Reason 93", content: "Type your reason here..." },
  { id: "94", dayNumber: 94, unlockDate: "2027-01-16T00:00:00", title: "Reason 94", content: "Type your reason here..." },
  { id: "95", dayNumber: 95, unlockDate: "2027-01-17T00:00:00", title: "Reason 95", content: "Type your reason here..." },
  { id: "96", dayNumber: 96, unlockDate: "2027-01-18T00:00:00", title: "Reason 96", content: "Type your reason here..." },
  { id: "97", dayNumber: 97, unlockDate: "2027-01-19T00:00:00", title: "Reason 97", content: "Type your reason here..." },
  { id: "98", dayNumber: 98, unlockDate: "2027-01-20T00:00:00", title: "Reason 98", content: "Type your reason here..." },
  { id: "99", dayNumber: 99, unlockDate: "2027-01-21T00:00:00", title: "Reason 99", content: "Type your reason here..." },
  { id: "100", dayNumber: 100, unlockDate: "2027-01-22T00:00:00", title: "Reason 100", content: "Type your reason here..." },
];

function getNextUnlockCountdown(reasons: DailyReason[], now: number) {
  const futureReasons = reasons
    .map((r) => new Date(r.unlockDate).getTime())
    .filter((time) => time > now)
    .sort((a, b) => a - b);

  if (futureReasons.length === 0) return null;

  const diff = futureReasons[0] - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function getCardCountdown(targetDate: string, now: number) {
  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return "Ready to Open";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m left`;
}

export default function DailyReasons() {
  const [now, setNow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [openNote, setOpenNote] = useState<DailyReason | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isArchiveOpen || openNote) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isArchiveOpen, openNote]);

  const isUnlocked = (dateStr: string) => mounted && new Date(dateStr).getTime() <= now;
  const nextUnlock = mounted ? getNextUnlockCountdown(dailyReasons, now) : null;
  const unlockedCount = dailyReasons.filter((r) => isUnlocked(r.unlockDate)).length;

  return (
    <>
      <section id="daily-reasons" className="relative w-full py-16 px-4 overflow-hidden">
        {/* Background Ambient Sparkles for the Main Page */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/30"
              style={{
                top: `${15 * i + 5}%`,
                left: `${(i * 25) % 90}%`,
              }}
              animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 fill-rose-200/40" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          {/* The New Compact Entry Card */}
          <div className="relative p-8 sm:p-10 rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-rose-200/60 shadow-[0_20px_50px_-12px_rgba(224,85,134,0.15)] flex flex-col items-center text-center overflow-hidden">
            
            <div className="absolute top-6 inset-x-0 flex justify-center gap-2 text-[0.5rem] text-[#e66496] opacity-80 pointer-events-none">
              <span>♥</span><span>♥</span><span>♥</span>
            </div>

            <div className="w-14 h-14 mt-2 mb-5 rounded-full bg-rose-50 flex items-center justify-center text-[var(--rose)] shadow-inner border border-rose-100/50">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[rgb(74,32,58)] tracking-tight font-medium mb-3">
              A New Reason, Every Day
            </h2>
            
            <p className="text-sm sm:text-base text-rose-900/65 italic font-serif mb-8 max-w-sm">
              100 reasons why I fell in love with you, sealed away and unlocking one by one.
            </p>

            {/* Next Unlock Countdown */}
            {nextUnlock && (
              <div className="mb-8 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-rose-400">Next reason unlocks in:</span>
                <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-rose-100 shadow-sm">
                  <Clock className="w-4 h-4 text-rose-300" />
                  <span className="font-mono text-sm font-bold text-[var(--rose)]">
                    {nextUnlock.days > 0 && `${nextUnlock.days}d `}
                    {String(nextUnlock.hours).padStart(2, "0")}h{" "}
                    {String(nextUnlock.minutes).padStart(2, "0")}m{" "}
                    {String(nextUnlock.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
            )}

            {/* Button to Open the Archive */}
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="w-full sm:w-auto relative rounded-2xl bg-[#d65385] px-8 py-3.5 font-bold tracking-wider uppercase text-xs text-white shadow-[0_8px_20px_rgba(224,85,134,0.2)] transition-all duration-300 hover:bg-[#c24675] hover:shadow-[0_8px_25px_rgba(224,85,134,0.3)] active:scale-[0.98]"
            >
              Open The Archive ({unlockedCount}/100)
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 1. THE FULLSCREEN ARCHIVE VAULT MODAL       */}
      {/* ========================================= */}
      <AnimatePresence>
        {isArchiveOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[80] bg-[#fff5fa] overflow-y-auto"
          >
            {/* Clean, Flat Header */}
            <div className="sticky top-0 z-20 bg-[#fff5fa]/95 backdrop-blur-md border-b border-rose-200/50 py-5 px-6 sm:px-10 flex items-center justify-between min-h-[80px]">
              <button
                onClick={() => setIsArchiveOpen(false)}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
              </button>
              
              {/* Centered Title */}
              <div className="flex flex-col items-center text-center">
                <h2 className="font-serif text-2xl sm:text-[1.75rem] font-medium text-[rgb(74,32,58)] leading-tight">
                  Reason Archive
                </h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff758f]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#ff758f] font-bold">
                    {unlockedCount} / 100 UNLOCKED
                  </span>
                </div>
              </div>

              {/* Balanced Right Spacer */}
              <div className="w-10 sm:w-11 hidden sm:block shrink-0" />
            </div>

            {/* The 100 Notes Grid */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 mt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {dailyReasons.map((reason) => {
                  const unlocked = isUnlocked(reason.unlockDate);

                  return (
                    <motion.div
                      key={reason.id}
                      whileHover={unlocked ? { y: -4, scale: 1.02 } : {}}
                      onClick={() => unlocked && setOpenNote(reason)}
                      className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center h-48 transition-all duration-300 ${
                        unlocked
                          ? "bg-white border border-rose-100 shadow-sm cursor-pointer hover:border-rose-300 hover:shadow-md"
                          : "bg-white/40 backdrop-blur-md border border-white shadow-[0_8px_30px_rgba(224,85,134,0.04)] cursor-not-allowed"
                      }`}
                    >
                      {unlocked ? (
                        <>
                          <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-3 border border-rose-100/50 shadow-inner">
                            <Heart className="w-4 h-4 fill-rose-300/50 stroke-[1.5]" />
                          </div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-rose-400 uppercase mb-2">
                            DAY {reason.dayNumber}
                          </span>
                          <h3 className="font-serif text-base sm:text-lg font-medium text-[rgb(74,32,58)] leading-snug px-2 line-clamp-2">
                            {reason.title}
                          </h3>
                        </>
                      ) : (
                        <>
                          {/* Beautiful Frosted Lock Icon */}
                          <div className="w-12 h-12 rounded-full bg-rose-50/60 flex items-center justify-center text-rose-300 mb-3 border border-rose-100/50 shadow-inner">
                            <Lock className="w-4 h-4 stroke-[1.5]" />
                          </div>
                          <span className="text-[10px] font-bold tracking-[0.25em] text-rose-300 uppercase mb-4">
                            DAY {reason.dayNumber}
                          </span>
                          
                          {/* Premium Frosted Countdown Label */}
                          <div className="flex flex-col items-center justify-center py-2 px-4 rounded-2xl bg-white/80 border border-rose-50 shadow-sm w-full max-w-[140px]">
                            <span className="text-[8px] uppercase tracking-widest text-rose-300 font-bold mb-0.5">
                              Unlocks In
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-rose-400 tracking-tight">
                              {mounted ? getCardCountdown(reason.unlockDate, now) : "..."}
                            </span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 2. AUTHENTIC VINTAGE LETTER MODAL           */}
      {/* ========================================= */}
      <AnimatePresence>
        {openNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 bg-[rgb(50,20,38)]/60 backdrop-blur-md"
            onClick={() => setOpenNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: -2, y: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, rotate: 2, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#FCFAF5] rounded-xl border border-[#e8dfd8] shadow-[0_30px_60px_-15px_rgba(74,32,58,0.25)] p-8 sm:p-12 overflow-hidden flex flex-col"
            >
              {/* Subtle Paper Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" 
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
              />

              {/* Minimalist Close 'X' */}
              <button
                onClick={() => setOpenNote(null)}
                aria-label="Close letter"
                className="absolute top-4 right-4 p-2 text-[#4a2036]/30 hover:text-[#4a2036]/80 transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Authentic Postmark Header */}
              <div className="flex items-end justify-between border-b border-[#4a2036]/10 pb-5 mb-8 z-10 mt-2">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#4a2036]/40 font-bold mb-1">
                    Reason No. {String(openNote.dayNumber).padStart(3, '0')}
                  </span>
                  <span className="font-serif italic text-[#4a2036]/70 text-sm">
                    {new Date(openNote.unlockDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                {/* Vintage Typewriter Stamp for Status */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#4a2036]/10 rounded-sm bg-[#4a2036]/[0.02]">
                  <Calendar className="w-3 h-3 text-[#4a2036]/40" strokeWidth={1.5} />
                  <span className="font-mono text-[9px] text-[#4a2036]/60 font-medium tracking-widest uppercase">
                    Unlocked
                  </span>
                </div>
              </div>

              {/* Letter Title & Body (Left-Aligned for authenticity) */}
              <div className="z-10 flex flex-col gap-5">
                <h2 className="font-serif text-2xl sm:text-[1.65rem] font-medium text-[rgb(74,32,58)] leading-tight w-full text-left">
                  {openNote.title}
                </h2>
                
                <p className="text-base sm:text-lg leading-[1.8] text-[rgb(74,32,58)]/85 font-serif w-full text-left whitespace-pre-wrap">
                  {openNote.content}
                </p>
              </div>

              {/* Elegant Wax Seal & Sign-off */}
              <div className="z-10 mt-12 flex items-center justify-between pt-6 w-full">
                <div className="w-12 h-12 rounded-full bg-[#9c2b4e] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.3),0_4px_10px_rgba(156,43,78,0.3)] flex items-center justify-center opacity-95">
                  <Heart className="w-5 h-5 fill-white/20 text-white/40" strokeWidth={1} />
                </div>
                <div className="font-serif italic text-xl text-[#4a2036]/60 pr-2">
                  Yours always
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}