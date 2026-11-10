"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import LilyFlower from "./LilyFlower";
import styles from "./SurpriseLily.module.css";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

// Edit this separate popup letter here. The original page letter is unchanged.
const LILY_LETTER = {
  title: "Ann",
  message: "حاولت اعمل حاجه حلوه معرفش يعني المهم انا بحبك و الله مكنش قصدي اتعصب عليكي يا احلي و اجمل بنت في الدنيا متعيطيش تاني بقا  دموعك غاليه يحبيبتي هوديكي المعادي و اعزمك علي الكوري ده استني عليا, بموت فيكي يروحي و يارب علطول تفضلي فرحانه و متزعليش تاني ابدا.",
  signOff: "Y.",
};
const SEEN_KEY = "lily-letter-seen-v1";
const READ_KEY = "lily-letter-read-content";
// Changing any part of the letter automatically makes it unread again.
const LETTER_REVISION = JSON.stringify(LILY_LETTER);

export default function SurpriseLily() {
  const [phase, setPhase] = useState<"loading" | "bloom" | "aside" | "open" | "closed">("loading");
  const [visible, setVisible] = useState(true);
  const [readRevision, setReadRevision] = useState<string | null>(null);
  const isUnread = readRevision !== LETTER_REVISION;
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const open = phase === "open";
  const transition = { duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setReadRevision(localStorage.getItem(READ_KEY));
        setPhase(localStorage.getItem(SEEN_KEY) === "true" ? "closed" : "bloom");
      } catch {
        setPhase("bloom");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open || !visible) return;
    try {
      localStorage.setItem(SEEN_KEY, "true");
      localStorage.setItem(READ_KEY, LETTER_REVISION);
    } catch { /* Storage may be disabled. */ }
    const readTimer = setTimeout(() => setReadRevision(LETTER_REVISION), 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      clearTimeout(readTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, visible]);

  useEffect(() => {
    if (!visible || (phase !== "bloom" && phase !== "aside")) return;
    const timer = setTimeout(() => setPhase(phase === "bloom" ? "aside" : "open"), reduceMotion ? 0 : phase === "bloom" ? 1700 : 800);
    return () => clearTimeout(timer);
  }, [phase, visible, reduceMotion]);

  useEffect(() => {
    const hide = () => { setVisible(false); setPhase("closed"); };
    const show = () => setVisible(true);
    window.addEventListener("future-letter-open", hide);
    window.addEventListener("future-letter-close", show);
    return () => {
      window.removeEventListener("future-letter-open", hide);
      window.removeEventListener("future-letter-close", show);
    };
  }, []);

  useEffect(() => {
    if (moveFocus.current) (open ? closeRef : circleRef).current?.focus({ preventScroll: true });
  }, [open]);

  function close() {
    moveFocus.current = true;
    setPhase("closed");
  }

  if (!visible || phase === "loading") return null;

  return (
    <LayoutGroup id="lily-popup">
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop" aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            onClick={close}
            className="fixed inset-0 z-[154] bg-[#4a2036]/15 backdrop-blur-md"
          />
        )}
        {(phase === "bloom" || phase === "aside") && (
          <motion.div
            key="lily"
            aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="pointer-events-none fixed inset-0 z-[160] flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="relative w-[calc(100%-2rem)] max-w-lg"
              initial={{ x: "0%" }}
              animate={{ x: phase === "bloom" ? "0%" : "-50%" }}
              transition={transition}
            >
              <motion.div
                layoutId="lily-flower"
                initial={{ scale: 0.4, y: 50, x: "-50%" }}
                animate={{ scale: phase === "bloom" ? 1 : 0.5, y: phase === "bloom" ? 0 : -90, x: "-50%", rotate: phase === "bloom" ? 0 : -18 }}
                style={{ left: "50%", willChange: "transform" }}
                transition={transition}
                className="absolute top-1/2 -mt-36 w-[200px] sm:w-[260px] drop-shadow-[0_16px_24px_rgba(157,76,106,0.18)]"
              >
                <LilyFlower />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div key="letter-position" className="pointer-events-none fixed inset-0 z-[155] flex items-center justify-center p-4" exit={{ opacity: 1 }}>
            <motion.div
              layoutId={reduceMotion ? undefined : "lily-paper"}
              role="dialog" aria-modal="true" aria-labelledby="lily-letter-title"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              transition={transition} style={{ borderRadius: 28 }}
              onKeyDown={(event) => {
                if (event.key === "Escape") close();
                if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); }
              }}
              className="pointer-events-auto relative w-full max-w-lg border border-rose-200/80 bg-[#fffdfa] shadow-[0_24px_100px_-20px_rgba(112,43,70,0.35)]"
            >
                <button ref={closeRef} type="button" onClick={close} aria-label="Close letter" className="absolute right-4 top-4 z-10 flex items-center justify-center rounded-full bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-500">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
                <motion.div layoutId="lily-flower" transition={transition} aria-hidden="true" className="pointer-events-none absolute -left-6 top-20 z-10 w-20 drop-shadow-[0_12px_20px_rgba(157,76,106,0.15)] sm:-left-24 sm:w-40">
                  <LilyFlower />
                </motion.div>
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.65 }}
                  animate={{ opacity: 1, scale: 1, rotate: 12 }}
                  transition={{ ...transition, delay: reduceMotion ? 0 : 0.15 }}
                  className="pointer-events-none absolute -right-2 top-[40%] z-10 w-14 drop-shadow-[0_8px_16px_rgba(157,76,106,0.12)] sm:-right-16 sm:w-28"
                >
                  <LilyFlower />
                </motion.div>
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.65 }}
                  animate={{ opacity: 1, scale: 1, rotate: -10 }}
                  transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}
                  className="pointer-events-none absolute -left-3 bottom-4 z-10 w-16 drop-shadow-[0_8px_16px_rgba(157,76,106,0.12)] sm:-left-16 sm:w-28"
                >
                  <LilyFlower />
                </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className={`${styles.letterScroll} max-h-[75dvh] overflow-y-auto rounded-[28px] px-16 pb-8 pt-16 text-center sm:px-20 sm:pb-12`}>
                <div className="mb-5 flex justify-center"><Heart aria-hidden="true" className="h-6 w-6 fill-rose-100 text-rose-400" strokeWidth={1.3} /></div>
                <h2 id="lily-letter-title" dir="auto" className="mb-6 text-center font-serif text-2xl text-[#4a2036]">{LILY_LETTER.title}</h2>
                <div className="mx-auto mb-6 h-px w-16 bg-rose-200" />
                <p dir="auto" className={`${amiri.className} whitespace-pre-wrap text-base leading-8 text-[#4a2036]/85`}>{LILY_LETTER.message}</p>
                <p dir="auto" className="mt-7 border-t border-rose-100 pt-5 text-right font-serif italic text-rose-500">{LILY_LETTER.signOff}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        {phase === "closed" && (
          <motion.button
            key="circle" ref={circleRef} type="button"
            layoutId={reduceMotion ? undefined : "lily-paper"}
            aria-label={isUnread ? "Open letter, new message" : "Open letter"}
            title={isUnread ? "A new love note for you" : "A little love note"}
            onClick={() => { moveFocus.current = true; setPhase("open"); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={transition} style={{ borderRadius: 18 }}
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            className="fixed right-4 top-24 z-[150] flex h-12 w-12 items-center justify-center bg-gradient-to-br from-[#df86a6] to-[#bb577f] text-white shadow-[0_6px_16px_-5px_rgba(160,66,104,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-[filter] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b34f79] sm:right-6 sm:top-28"
          >
            <Heart aria-hidden="true" className="h-5 w-5 fill-current" strokeWidth={1.5} />
            {isUnread && (
              <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50 motion-safe:animate-ping" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#fff7fa] bg-red-500" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
