"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export default function PopupMessage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-24 right-4 sm:top-28 sm:right-6 z-[150] flex flex-col items-end">
      {/* 1. The Permanent Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffe9f2] bg-white/90 p-3 shadow-[0_8px_20px_-5px_rgba(224,85,134,0.25)] backdrop-blur-md text-[#e66496] hover:bg-[#fff0f5] transition-colors cursor-pointer"
          >
            <Heart className="h-5 w-5 fill-current" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. The Expanded Message */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-[calc(100vw-2rem)] max-w-[22rem] origin-top-right rounded-[24px] border border-[#ffe9f2] bg-white/95 p-6 sm:p-7 shadow-[0_20px_50px_-10px_rgba(224,85,134,0.2)] backdrop-blur-xl flex flex-col items-center text-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-[#4a2036]/40 transition-colors hover:bg-[#fff0f5] hover:text-[#e66496] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* Heart Icon Header */}
            <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0f5] text-[#e66496] shadow-inner border border-rose-100/50">
              <Heart className="h-5 w-5 fill-rose-200/40" strokeWidth={1.5} />
            </div>

            <h3 className="mb-5 font-serif text-[1.15rem] font-medium text-[#4a2036]">
              Surprise Message!
            </h3>

            <p 
              dir="auto" 
              className={`text-[1.2rem] sm:text-[1.25rem] leading-[1.8] text-[#4a2036]/90 ${amiri.className}`}
              style={{ fontFamily: '"Hail Elastic Light", "Hail Elastic", "Amiri", "Traditional Arabic", serif' }}
            >
             Wait for a New one.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}