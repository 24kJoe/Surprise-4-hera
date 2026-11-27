"use client";

import React, { useState, useEffect } from "react";
import { useVisibleSection } from "@/lib/hooks/useVisibleSection";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, BookOpen, Clock, ArrowLeft, Calendar, X } from "lucide-react";

import type { DailyReason } from "@/lib/letters/types";

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

function getNoteCountdown(targetDate: string, now: number) {
  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return "Unlocked & Ready";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) return `Unlocks in ${days}d ${hours}h`;
  return `Unlocks in ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export default function DailyReasons() {
  const [now, setNow] = useState<number>(0);
  const [dailyReasons, setDailyReasons] = useState<DailyReason[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [openNote, setOpenNote] = useState<DailyReason | null>(null);

  const { ref, active } = useVisibleSection(isArchiveOpen || Boolean(openNote));

  useEffect(() => {
    if (!active) return;
    const initial = setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearTimeout(initial); clearInterval(timer); };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    let loading = false;
    async function refresh() {
      if (loading) return;
      loading = true;
      try {
        const response = await fetch("/api/daily-letters", { signal: controller.signal });
        if (!response.ok) throw new Error("Letters unavailable");
        const letters: DailyReason[] = await response.json();
        if (!controller.signal.aborted) { setDailyReasons(letters); setLoadFailed(false); }
      } catch {
        if (!controller.signal.aborted) setLoadFailed(true);
      } finally {
        loading = false;
      }
    }
    void refresh();
    const interval = setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, [active]);

  useEffect(() => {
    if (isArchiveOpen || openNote) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isArchiveOpen, openNote]);

  const isUnlocked = (dateStr: string) => new Date(dateStr).getTime() <= now;
  const nextUnlock = now ? getNextUnlockCountdown(dailyReasons, now) : null;
  const unlockedReasons = dailyReasons.filter((reason) => isUnlocked(reason.unlockDate));
  const latestReason = unlockedReasons.findLast((reason) => Boolean(reason.content.trim()));
  const unlockedCount = unlockedReasons.length;
  const totalCount = dailyReasons.length;

  return (
    <>
      <section ref={ref} className="relative w-full py-16 px-4 overflow-hidden">
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
              animate={active ? { y: [0, -15, 0], scale: [1, 1.1, 1] } : { y: 0, scale: 1 }}
              transition={active ? { duration: 4 + i, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            >
              <Heart className="w-5 h-5 fill-rose-200/40" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-[640px] mx-auto">
          {/* The New Compact Entry Card */}
          <div className="relative px-7 py-12 sm:px-14 sm:py-14 rounded-[2.5rem] bg-[linear-gradient(145deg,#ffffff,#fffafb_65%,#fff0f5)] border border-rose-200/60 shadow-[0_24px_70px_-25px_rgba(174,62,104,0.25)] flex flex-col items-center text-center overflow-hidden">
            <div aria-hidden="true" className="absolute inset-3 rounded-[1.9rem] border border-rose-100/80 pointer-events-none" />
            
            <div className="absolute top-6 inset-x-0 flex justify-center gap-2 text-[0.5rem] text-[#e66496] opacity-80 pointer-events-none">
              <span className="uppercase tracking-[0.3em] text-[9px] font-semibold">A little love, every day</span>
            </div>

            <div className="w-16 h-16 mt-3 mb-6 rounded-full bg-rose-50 flex items-center justify-center text-[#c54c7b] shadow-sm border border-rose-200/60">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="text-4xl sm:text-5xl leading-[1.15] font-serif text-[rgb(74,32,58)] tracking-tight font-medium mb-5">
              A New Reason,<br /><span className="italic text-[#b94f79]">Every Day</span>
            </h2>
            
            <p className="text-base sm:text-lg leading-relaxed text-[#906579] font-serif mb-7 max-w-sm">
              {loadFailed && !totalCount ? "Letters unavailable. Trying again shortly." : "Little reasons why I fell in love with you, unlocking one by one."}
            </p>

            {/* Next Unlock Countdown */}
            {nextUnlock && (
              <div className="mb-7 py-4 w-full max-w-[280px] border-y border-rose-100 flex flex-col items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#956076]">Your next little love note in</span>
                <div className="inline-flex items-center gap-3 px-5 py-1">
                  <Clock className="w-4 h-4 text-rose-300" />
                  <span className="font-serif tabular-nums text-xl tracking-wider text-[#74334f]">
                    {nextUnlock.days > 0 && `${nextUnlock.days}d `}
                    {String(nextUnlock.hours).padStart(2, "0")}h{" "}
                    {String(nextUnlock.minutes).padStart(2, "0")}m{" "}
                    {String(nextUnlock.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
            )}

            {latestReason && (
              <button
                type="button"
                onClick={() => setOpenNote(latestReason)}
                className="mb-3 w-full rounded-full bg-[#cc4f80] px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(194,70,117,0.4)] transition-colors hover:bg-[#b53e6d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b53e6d] sm:w-auto"
              >
                Read the latest note
              </button>
            )}
            <button
              type="button"
              disabled={!totalCount}
              onClick={() => setIsArchiveOpen(true)}
              className="w-full sm:w-auto rounded-full border border-rose-200 bg-white/70 px-6 py-3 font-semibold text-sm text-[#a83c66] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b53e6d]"
            >
              Open collection <span aria-hidden="true" className="ml-3">↗</span>
            </button>
            <p className="mt-4 text-[11px] tracking-wide text-[#956076]">{unlockedCount} of {totalCount} little reasons unlocked</p>
            <div className="mt-2 h-1 w-44 rounded-full overflow-hidden bg-rose-100" aria-hidden="true">
              <div className="h-full rounded-full bg-[#d887a6]" style={{ width: `${unlockedCount / (totalCount || 1) * 100}%` }} />
            </div>
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
            className="fixed inset-0 z-[170] overflow-y-auto bg-[radial-gradient(ellipse_at_top,#ffe3ee_0%,#fff7fa_55%)]"
          >
            {/* Clean, Flat Header Matching Image */}
            <div className="sticky top-0 z-20 bg-[#fff7fa]/95 border-b border-[#ffe9f2] py-5 sm:py-6 px-4 sm:px-10 flex items-center justify-center">
              <button
                onClick={() => setIsArchiveOpen(false)}
                aria-label="Go back"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>
              
              <div className="flex flex-col items-center text-center px-10">
                <span className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#b83f6c]">Our little collection</span>
                <h2 className="font-serif text-xl sm:text-[1.75rem] font-medium text-[rgb(74,32,58)] leading-tight">
                  A New Day, A New Reason
                </h2>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff758f]" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#ff758f] font-bold">
                    {unlockedCount} / {totalCount} UNLOCKED
                  </span>
                </div>
                <div className="mt-3 h-1 w-32 overflow-hidden rounded-full bg-[#ffe3ee]" aria-hidden="true">
                  <div className="h-full rounded-full bg-[#e66496]" style={{ width: `${totalCount ? unlockedCount / (totalCount || 1) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* The 365 Notes Grid */}
            <div className="px-4 py-7 sm:px-8 sm:py-10 max-w-6xl mx-auto pb-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-[#ffe9f2] pb-4">
                <p className="font-serif text-lg text-[#4a2036]">Little notes, a whole lot of love.</p>
                <p className="text-xs text-[#b83f6c]">A new reason to open each day</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                {dailyReasons.map((reason) => {
                  const unlocked = isUnlocked(reason.unlockDate);
                  const readable = unlocked && Boolean(reason.content.trim());

                  return (
                    <motion.button
                      key={reason.id}
                      type="button"
                      disabled={!readable}
                      aria-label={readable ? `Read day ${reason.dayNumber}` : `Day ${reason.dayNumber}, ${unlocked ? "awaiting a note" : "locked"}`}
                      whileHover={readable ? { y: -4 } : {}}
                      onClick={() => readable && setOpenNote(reason)}
                      className={`group relative overflow-hidden p-4 rounded-2xl flex flex-col items-center justify-center text-center h-44 sm:h-48 transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400 ${
                        readable
                          ? "bg-[#ffffff] border border-[#ffd6e8] shadow-[0_5px_16px_-8px_rgba(224,85,134,0.2)] cursor-pointer hover:border-[#e66496] hover:shadow-[0_12px_25px_-10px_rgba(224,85,134,0.25)]"
                          : "bg-[#fff5fa]/70 border border-[#ffe9f2] cursor-not-allowed"
                      }`}
                    >
                      {readable ? (
                        <>
                          <span aria-hidden="true" className="absolute right-3 top-2 font-serif text-4xl italic text-[#ffe3ee]">{String(reason.dayNumber).padStart(2, "0")}</span>
                          <div className="relative w-11 h-11 rounded-full bg-[#fff0f5] border border-[#ffe9f2] flex items-center justify-center mb-3 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9)]">
                            <Heart className="w-4 h-4 fill-[#e66496] text-[#e66496]" strokeWidth={1} />
                          </div>
                          <span className="text-[9px] font-bold tracking-[0.2em] text-[#b83f6c] uppercase mb-2">
                            DAY {reason.dayNumber}
                          </span>
                          <span className="font-serif text-base text-[#4a2036]">A little love for you</span>
                          <span className="mt-3 text-[10px] text-[#b83f6c] group-hover:text-[#b83f6c]">Open your note ↗</span>
                        </>
                      ) : unlocked ? (
                        <span className="font-serif text-sm text-[#74334f]">A note is on its way</span>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full border border-[#ffe9f2] flex items-center justify-center mb-4 bg-transparent">
                            <Lock className="w-4 h-4 text-[#ff758f] stroke-[1.5]" />
                          </div>
                          
                          <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff758f] uppercase mb-5">
                            DAY {reason.dayNumber}
                          </span>
                          
                          <div className="w-full max-w-[130px] py-2 rounded-2xl bg-[#fff5fa] flex flex-col items-center justify-center">
                            <span className="text-[8px] uppercase tracking-widest text-[#ff758f] font-bold mb-1">
                              Unlocks In
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#d6336c] tracking-tight">
                              {now ? getNoteCountdown(reason.unlockDate, now) : "..."}
                            </span>
                          </div>
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened Note Modal */}
      <AnimatePresence>
        {openNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-[rgb(50,20,38)]/60 backdrop-blur-md"
            onClick={() => setOpenNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: -2, y: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, rotate: 2, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative isolate w-full max-w-[560px] bg-[linear-gradient(145deg,#fffefd,#fff8fa_65%,#ffedf4)] rounded-[2rem] border border-rose-200/80 shadow-[0_30px_90px_-20px_rgba(74,32,58,0.4)] flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden pt-14 sm:max-h-[calc(100dvh-3rem)]"
            >
              <div aria-hidden="true" className="absolute inset-3 -z-10 rounded-[1.4rem] border border-[#ebc5d3]/60 pointer-events-none" />
              <div aria-hidden="true" className="absolute top-0 left-0 -z-10 h-40 w-40 rounded-full bg-rose-100/50 blur-3xl pointer-events-none" />
              <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" 
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
              />

              <button
                onClick={() => setOpenNote(null)}
                type="button"
                aria-label="Close letter"
                className="absolute right-3 top-2 grid h-11 w-11 place-items-center rounded-full sm:right-5 bg-white/70 text-[#a76b83] hover:bg-rose-100 hover:text-[#74334f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b53e6d] transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 sm:px-12 sm:pb-9 [scrollbar-width:thin] [scrollbar-color:#dfafc2_transparent]">
                <div className="flex flex-col items-center text-center mb-5 sm:mb-7">
                  <div aria-hidden="true" className="mb-3 flex items-center gap-4 sm:mb-5 text-[#c46a8e]">
                    <span className="h-px w-12 bg-rose-200" />
                    <Heart className="h-5 w-5 fill-rose-100" strokeWidth={1.2} />
                    <span className="h-px w-12 bg-rose-200" />
                  </div>
                  <div className="flex flex-col items-center">
                    <h2 className="font-serif text-[1.65rem] sm:text-4xl tracking-tight text-[#74334f] mb-3">One more reason <span className="italic">I love you.</span></h2>
                    <span className="font-serif italic text-[#956076] text-sm">
                      {new Date(openNote.unlockDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Cairo' })}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 px-3 py-1 border border-rose-200/60 rounded-full bg-white/60">
                    <Calendar className="w-3 h-3 text-[#4a2036]/40" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] text-[#4a2036]/60 font-medium tracking-widest uppercase">
                      Unlocked
                    </span>
                  </div>
                </div>

                <div dir="auto" className="relative z-10 rounded-2xl border border-rose-100/80 bg-white/60 px-4 py-5 sm:px-7 sm:py-8 shadow-[0_4px_20px_rgba(174,62,104,0.03)]">
                  <span aria-hidden="true" className="absolute -top-5 start-5 font-serif text-6xl leading-none text-[#d99ab2]">“</span>
                  <p
                    className="text-lg sm:text-xl leading-relaxed sm:leading-[2] text-[#64344e] w-full text-start whitespace-pre-wrap break-words"
                    style={{ fontFamily: "'Hail Elastic Light', 'Amiri', serif" }}
                  >
                    {openNote.content}
                  </p>
                </div>

                <div className="relative z-10 mt-5 flex flex-col items-center gap-3 w-full sm:mt-7 text-center">
                  <div aria-hidden="true" className="flex items-center justify-center gap-4 w-full">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#dfafc2]" />
                    <Heart className="w-4 h-4 fill-[#c56d91] text-[#c56d91]" strokeWidth={1.2} />
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#dfafc2]" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-serif italic text-base leading-relaxed text-[#956076]">Always you. Every day.</span>
                    <span className="font-serif italic text-2xl leading-none text-[#9c4669]">Y.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
