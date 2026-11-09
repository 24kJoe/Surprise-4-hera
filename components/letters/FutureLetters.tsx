"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Heart, Calendar, X, Compass } from "lucide-react";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

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
    teaser: "A little note for our special day.",
    lockedTeaser: "You won't have a look until my birthday comes.",
    content:
      "انا طبعا مش عارف اقولك ايه ولا ايه انا مبسوط عشان انتي معايا مبسوط علي اي حاجه كنا مع بعض فيها و هفضل مبسوط وجودك بس كفايه وانا اتمنى نفضل مع بعض علطول عيد ميلادي بقا لازم اتمنى وربنا يكتبلي الخير فيكي يارب و ربنا يخليكي ليا حبيبتي مش هلاقي احسن منك حقيقي ومش عايزك تكوني فاكره انك مبتعمليش كفايه لا انتي اكتر من كفايه و انا مبسوط علطول منك وربنا يخليكي ليا تاني و تالت و رابع كتير بقا متعديش , بحبك. ",
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
    content: `سنه و انتي معايا علطول ربنا يعلم انا حبي ليكي قد ايه و انتي بالنسبالي ايه و يارب يخليكي ليا و تفضلي معايا علطول وتبقي حلالي يارب انا من اول ما عرفتك و حبيتك بقيتي شخص مقدرش استغنى عنه تماماً انتي مش بس جزء من حياتي انتي البنت الي عايزها تشاركني حياتي العمر كله و هفضل ادعي ان ربنا يكملهالنا على خير انا اما حبيتك محبتكيش عشان يعوضني عن حد قبل كده او استهبال حبيتك عشان انتي احلى بنت في الدنيا بالنسبالي تأثيرك عليا كان كبير و مازال اتمنى ف يوم اكون قادر اعملك كل الي نفسك فيه و ابقى بني ادم احسن ليكي عشان انتي تستاهلي كل خير و انا هعمل الي هقدر عليه عشان اعملك ده انا اديكي عيوني و حياتي كلها عمري ما تخيلت يطلع مني الكلام ده بس بجد بالنسبالي انا كده مقولتش حاجه تعبر عن حبي ليكي حبي ليكي اكبر من ان كلام يبقى مقياس ليه ربنا يخليكي ليا يارب يارب يارب 
الكلام ده مش هوريهولك غير اما نكمل سنه مع بعض النهارده اليوم الي كتبت فيه ده 
November 4 2026`,
  },
  {
    id: "3",
    unlockDate: "2027-02-07T00:00:00",
    displayDate: "Feb 7, 2027",
    occasion: "Valentine",
    title: "With You 💍",
    lockedTitle: "Valentine's Day",
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

  // Lock background scroll when letter is open
  useEffect(() => {
    if (!openLetter) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openLetter]);

  useEffect(() => {
    if (!openLetter) return;
    window.dispatchEvent(new Event("future-letter-open"));
    return () => {
      window.dispatchEvent(new Event("future-letter-close"));
    };
  }, [openLetter]);

  const isUnlocked = (letter: FutureLetter) =>
    new Date(letter.unlockDate).getTime() <= now;

  return (
    <>
      <section id="secret-letters" className="relative w-full py-16 px-4 overflow-hidden">

        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.25em] font-semibold text-[#a74b70] uppercase mb-5">
              <span className="h-px w-8 bg-rose-200" /> Sealed with love <span className="h-px w-8 bg-rose-200" />
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[rgb(74,32,58)] tracking-tight font-medium">
              Letters for <span className="italic text-[#b94f79]">Later</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#906579] max-w-md mx-auto font-serif">
              Sealed thoughts, personal vows, and milestones waiting for their day to arrive.
            </p>
          </div>

          {/* Envelopes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureLetters.map((letter) => {
              const unlocked = isUnlocked(letter);
              const countdown = !unlocked ? getLiveCountdown(letter.unlockDate, now) : null;

              return (
                <motion.div
                  key={letter.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  role={unlocked ? "button" : undefined}
                  tabIndex={unlocked ? 0 : undefined}
                  aria-label={unlocked ? `Read ${letter.title}` : undefined}
                  onKeyDown={(event) => {
                    if (unlocked && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      setOpenLetter(letter);
                    }
                  }}
                  onClick={() => {
                    if (unlocked) {
                      setOpenLetter(letter);
                    }
                  }}
                  className={`group relative rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b53e6d] ${
                    unlocked
                      ? "bg-[linear-gradient(145deg,#ffffff,#fffafb_65%,#ffeaf2)] border-rose-200/90 shadow-[0_18px_45px_-20px_rgba(174,62,104,0.3)] cursor-pointer hover:border-[#d887a6] hover:shadow-xl hover:shadow-rose-900/10"
                      : "bg-[linear-gradient(145deg,#fffdfd,#fff5f8)] border-rose-200/60 shadow-[0_10px_30px_-20px_rgba(174,62,104,0.2)] select-none"
                  }`}
                >
                  {/* Envelope Top Flap Border Line */}
                  <div aria-hidden="true" className="absolute inset-2 rounded-[1.5rem] border border-rose-100/80 pointer-events-none" />

                  <div>
                    {/* Header Row: Occasion & Wax Seal */}
                    <div className="flex items-center justify-between gap-3 mb-8">
                      <span className="inline-block text-[9px] font-semibold tracking-[0.18em] text-[#956076] uppercase">
                        {letter.occasion}
                      </span>

                      {/* Wax Seal Badge */}
                      <div
                        className={`w-12 h-12 shrink-0 rounded-full ring-4 ring-rose-100/50 flex items-center justify-center shadow-sm border transition-all duration-300 ${
                          unlocked
                            ? "bg-[#cc4f80] border-rose-300 text-white shadow-rose-500/20 group-hover:scale-110"
                            : "bg-[#f9e4ed] border-rose-200 text-[#a76580]"
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
                      className={`font-serif text-2xl font-medium mb-3 leading-snug transition-colors ${
                        unlocked
                          ? "text-[rgb(74,32,58)] group-hover:text-[var(--rose)]"
                          : "text-[rgb(74,32,58)]/75"
                      }`}
                    >
                      {unlocked ? letter.title : letter.lockedTitle}
                    </h3>

                    {/* Teaser Preview */}
                    <p
                      className="text-base leading-relaxed mb-8 font-serif italic text-[#906579]"
                    >
                      {unlocked ? `"${letter.teaser}"` : letter.lockedTeaser}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="pt-4 border-t border-rose-100/90 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#956076] font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {letter.displayDate}
                      </span>

                      {unlocked && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b53e6d]">
                           Read letter ↗
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
                            className="py-2 px-1 flex flex-col items-center justify-center"
                          >
                            <span className="font-serif tabular-nums text-2xl text-[#74334f]">
                              {String(slot.val).padStart(2, "0")}
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.15em] text-[#956076] font-sans">
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
      </section>

      {/* Parchment Letter Read Modal */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-[rgb(50,20,38)]/50 backdrop-blur-md"
            onClick={() => setOpenLetter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[540px] bg-[linear-gradient(145deg,#fffefd,#fff7fa)] rounded-[2rem] border border-rose-200/80 shadow-2xl px-7 pb-7 pt-10 sm:px-12 sm:pb-9 sm:pt-12 overflow-hidden flex flex-col max-h-[82vh] mt-11 sm:mt-17 mb-8 sm:mb-12"
            >
              {/* Decorative Envelope Stationery Corner Stamp */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-100/50 via-transparent to-transparent pointer-events-none rounded-tr-[2rem]" />

              {/* Close Button */}
              <button
                onClick={() => setOpenLetter(null)}
                aria-label="Close letter"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Wax Seal Emblem */}
              <div className="flex flex-col items-center text-center mb-6 shrink-0 mt-1">
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
              <h2 className="text-center text-2xl sm:text-3xl font-serif font-medium text-[rgb(74,32,58)] mb-4 border-b border-rose-100 pb-4 shrink-0">
                {openLetter.title}
              </h2>

              {/* Letter Body Parchment (Scrollable Area) */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200 overscroll-contain">
                <p 
                  dir="auto"
                  className={`text-center text-sm sm:text-base leading-[2.2] text-rose-950/80 whitespace-pre-wrap italic ${amiri.className}`}
                  style={{ fontFamily: '"Hail Elastic Light", "Hail Elastic", "Amiri", "Traditional Arabic", serif' }}
                >
                  {openLetter.content}
                </p>
              </div>

              {/* Letter Sign-off Footer */}
              <div className="pt-4 mt-4 border-t border-rose-100/80 flex justify-between items-center text-xs text-rose-400 font-serif italic shrink-0">
                <span>With all my love</span>
                <Compass className="w-4 h-4 text-rose-300" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
