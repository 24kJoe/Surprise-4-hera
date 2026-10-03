"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Clock, ArrowLeft, X } from "lucide-react";

interface DailyReason {
  id: string;
  dayNumber: number;
  unlockDate: string; 
  title: string;
  content: string;
}

// All 100 reasons starting October 15, 2026.
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

// Optimized specific timer for the main page
function CountdownTimer({ reasons }: { reasons: DailyReason[] }) {
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (now === 0) return null;

  const nextUnlock = getNextUnlockCountdown(reasons, now);

  if (!nextUnlock) return null;

  return (
    <div className="mb-10 flex flex-col items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ff758f]/80">
        Next reason unlocks in
      </span>
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#ffe9f2] shadow-sm">
        <Clock className="w-4 h-4 text-[#ff758f]/60" />
        <span className="font-mono text-sm sm:text-base font-bold text-[#d6336c] tracking-wide">
          {nextUnlock.days > 0 && `${nextUnlock.days}d `}
          {String(nextUnlock.hours).padStart(2, "0")}h{" "}
          {String(nextUnlock.minutes).padStart(2, "0")}m{" "}
          {String(nextUnlock.seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
}

export default function DailyReasons() {
  const [now, setNow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [openNote, setOpenNote] = useState<DailyReason | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    // Only update the grid every 60 seconds to stop lag
    const interval = setInterval(() => setNow(Date.now()), 60000);
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
  const unlockedCount = dailyReasons.filter((r) => isUnlocked(r.unlockDate)).length;

  return (
    <>
      <section id="daily-reasons" className="relative w-full py-24 px-4 overflow-hidden bg-transparent">
        <div className="max-w-3xl mx-auto">
          {/* Main Page Entry Card */}
          <div className="relative p-10 sm:p-16 rounded-[3rem] bg-[#fffdfa] border border-[#fce3ec] shadow-[0_24px_50px_-12px_rgba(224,85,134,0.08)] flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-6 rounded-full bg-[#fdf2f7] flex items-center justify-center text-[#e66496] shadow-inner">
              <Heart strokeWidth={1.5} className="w-5 h-5 fill-[#fce3ec]" />
            </div>

            <h2 className="text-3xl sm:text-[2.5rem] font-serif text-[rgb(74,32,58)] tracking-tight font-medium mb-4 leading-tight">
              A New Reason,<br/>Every Day
            </h2>
            
            <p className="text-sm sm:text-base text-[rgb(74,32,58)]/70 italic font-serif mb-10 max-w-xs leading-relaxed">
              100 reasons why I fell in love with you, sealed away and unlocking one by one.
            </p>

            {mounted && <CountdownTimer reasons={dailyReasons} />}

            <button
              onClick={() => setIsArchiveOpen(true)}
              className="w-full sm:w-auto relative rounded-full bg-gradient-to-b from-[#ff758f] to-[#e65c77] px-10 py-4 font-bold tracking-[0.15em] uppercase text-xs text-white shadow-[0_8px_20px_rgba(224,85,134,0.25)] transition-all duration-300 hover:shadow-[0_12px_25px_rgba(224,85,134,0.35)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Open ({unlockedCount}/100)
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 1. THE ARCHIVE VAULT (Soft UI / Glass)      */}
      {/* ========================================= */}
      <AnimatePresence>
        {isArchiveOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#fcf9fa] overflow-y-auto"
          >
            {/* Soft UI Header - FIXED MOBILE ALIGNMENT */}
            <div className="sticky top-0 z-20 bg-[#fcf9fa]/90 backdrop-blur-xl py-4 sm:py-6 px-4 flex items-center justify-center min-h-[70px] sm:min-h-[90px]">
              <button
                onClick={() => setIsArchiveOpen(false)}
                aria-label="Go back"
                className="absolute left-4 sm:left-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ffe9f2] bg-white shadow-sm flex items-center justify-center text-[#ff758f] hover:scale-105 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
              </button>
              
              <div className="flex flex-col items-center px-10 sm:px-0">
                <h2 className="font-serif text-xl sm:text-3xl text-[rgb(74,32,58)] leading-tight text-center">New Day, New Reason</h2>
                <div className="flex items-center gap-1.5 mt-1 sm:mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff758f]" />
                  <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-[#ff758f] font-bold">
                    {unlockedCount} / 100 UNLOCKED
                  </span>
                </div>
              </div>
            </div>

            {/* Soft Neumorphic Card Grid */}
            <div className="px-4 sm:px-10 max-w-[1400px] mx-auto py-10 pb-24">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {dailyReasons.map((reason) => {
                  const unlocked = isUnlocked(reason.unlockDate);

                  return unlocked ? (
                    <motion.div
                      key={reason.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setOpenNote(reason)}
                      className="relative group bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(224,85,134,0.05)] hover:shadow-[0_15px_40px_rgba(224,85,134,0.12)] transition-all duration-300 aspect-[3/4] flex flex-col items-center p-6 cursor-pointer text-center overflow-hidden"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#fff5fa] flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 text-[#ff758f] fill-[#ffe9f2]" strokeWidth={1.5} />
                      </div>
                      <span className="text-[0.65rem] font-bold tracking-[0.25em] text-[rgb(74,32,58)]/30 uppercase mb-3">Day {reason.dayNumber}</span>
                      <h3 className="font-serif text-lg text-[rgb(74,32,58)] leading-snug px-2 line-clamp-3">
                        {reason.title}
                      </h3>
                    </motion.div>
                  ) : (
                    <div
                      key={reason.id}
                      className="relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(224,85,134,0.05)] aspect-[3/4] flex flex-col items-center p-6 text-center"
                    >
                      <div className="w-12 h-12 rounded-full border border-[#ffe9f2] flex items-center justify-center mb-6 mt-4">
                        <Lock className="w-4 h-4 text-[#ff758f]/50" strokeWidth={1.5} />
                      </div>
                      <span className="text-[0.65rem] font-bold tracking-[0.25em] text-[rgb(74,32,58)]/40 uppercase mb-auto">Day {reason.dayNumber}</span>
                      
                      <div className="w-full mt-auto bg-[#fffdfa] rounded-2xl py-3.5 flex flex-col items-center justify-center border border-[#ffe9f2]/40">
                        <span className="text-[9px] uppercase tracking-widest text-[#ff758f]/80 font-bold mb-1">Unlocks In</span>
                        {(() => {
                           const unlockTime = new Date(reason.unlockDate).getTime();
                           const diff = unlockTime - now;
                           if (diff <= 0) return null;
                           const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                           const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                           return (
                             <span className="font-sans text-[11px] font-bold text-[#d6336c] tracking-wide">
                               {d > 0 && `${d}d `}{h}h left
                             </span>
                           );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 2. THE SINGLE OPENED NOTE MODAL             */}
      {/* ========================================= */}
      <AnimatePresence>
        {openNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#fdf2f7]/80 backdrop-blur-xl"
            onClick={() => setOpenNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#fffdfa] rounded-[2rem] border border-[#fce3ec] shadow-[0_20px_60px_-15px_rgba(224,85,134,0.15)] p-10 sm:p-14 overflow-hidden flex flex-col items-center"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

              <button
                onClick={() => setOpenNote(null)}
                aria-label="Close note"
                className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-[rgb(74,32,58)]/30 hover:text-[#ff758f] hover:bg-white transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <div className="flex flex-col w-full text-left border-b border-[rgb(74,32,58)]/10 pb-6 mb-8 z-10">
                <span className="text-[0.65rem] font-bold tracking-[0.3em] text-[#ff758f]/80 uppercase mb-2">
                  Note No. {String(openNote.dayNumber).padStart(3, '0')}
                </span>
                <span className="font-serif italic text-sm text-[rgb(74,32,58)]/40">
                  {new Date(openNote.unlockDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="z-10 flex flex-col gap-5 w-full">
                <h2 className="font-serif text-2xl sm:text-[1.65rem] font-medium text-[rgb(74,32,58)] leading-tight w-full text-left">
                  {openNote.title}
                </h2>
                <p className="text-base sm:text-lg leading-[1.8] text-[rgb(74,32,58)]/85 font-serif w-full text-left whitespace-pre-wrap">
                  {openNote.content}
                </p>
              </div>

              <div className="z-10 mt-12 flex items-center justify-between pt-6 w-full">
                <div className="w-12 h-12 rounded-full bg-[#4a2036] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.3),0_4px_10px_rgba(74,32,58,0.3)] flex items-center justify-center opacity-95">
                  <Heart className="w-5 h-5 fill-white/20 text-white/40" strokeWidth={1} />
                </div>
                <div className="font-serif italic text-xl text-[rgb(74,32,58)]/60 pr-2">
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