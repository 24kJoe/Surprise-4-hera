"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { CONFIG } from "@/lib/config";

interface PasswordGateProps {
  type?: "home" | "admin";
  unlocked: boolean;
  onUnlock: () => void;
  expectedPassword?: string;
  title?: string;
}

export default function PasswordGate({
  type = "home",
  unlocked,
  onUnlock,
  expectedPassword,
  title,
}: PasswordGateProps) {
  // --- Admin State (Text Input) ---
  const [textValue, setTextValue] = useState("");
  const [textError, setTextError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Home State (PIN Pad) ---
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Extract passwords safely
  const configObj = (CONFIG || {}) as Record<string, any>;
  const adminPass = configObj.adminPassword || "12345";
  const homePass = configObj.password || "151009";

  const targetPassword = expectedPassword ?? (type === "admin" ? adminPass : homePass);
  const passcodeLength = targetPassword.length;

  const defaultTitle = type === "admin" ? "Admin Access" : "Enter Passcode";
  const displayTitle = title || defaultTitle;

  // --- Admin Handlers ---
  function attemptText() {
    if (textValue.trim() === targetPassword) {
      setTextError("");
      onUnlock();
    } else {
      setTextError("Incorrect password");
      setTextValue("");
      inputRef.current?.focus();
    }
  }

  // --- Home Handlers ---
  const handlePress = (num: string) => {
    if (pinInput.length < passcodeLength) {
      const newInput = pinInput + num;
      setPinInput(newInput);
      setPinError(false);

      if (newInput.length === passcodeLength) {
        if (newInput === targetPassword) {
          setTimeout(() => onUnlock(), 300);
        } else {
          setPinError(true);
          setTimeout(() => setPinInput(""), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  if (unlocked) return null;

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff5fa] p-4 text-[#4a2036]"
        >
          {/* Dashboard-Style Back Button (Admin Only) */}
          {type === "admin" && (
            <Link 
              href="/#letter" 
              className="absolute top-6 left-6 sm:top-8 sm:left-8 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-[#ffe9f2] text-[#4a2036]/60 hover:text-[#e66496] transition-colors shadow-sm flex items-center justify-center group z-50" 
              title="Return to site"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          )}

          {type === "admin" ? (
            /* ============================================================== */
            /* ADMIN VIEW: CLEAN CARD LOGIN                                   */
            /* ============================================================== */
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-[400px] rounded-[2.5rem] border border-[#ffe9f2] bg-white p-10 sm:p-12 shadow-[0_20px_50px_-12px_rgba(224,85,134,0.15)] flex flex-col items-center"
            >
              {/* Hearts Header */}
              <div className="absolute top-6 inset-x-0 flex justify-center gap-2 text-[0.5rem] text-[#e66496] opacity-80 pointer-events-none">
                <span>♥</span>
                <span>♥</span>
                <span>♥</span>
              </div>

              {/* Shield Icon */}
              <div className="w-14 h-14 mt-3 mb-5 rounded-full bg-white flex items-center justify-center text-[#d65385] shadow-[0_8px_20px_rgba(224,85,134,0.12)] border border-[#fff0f5]">
                <ShieldCheck strokeWidth={2.2} className="w-6 h-6" />
              </div>

              {/* Title */}
              <h1 className="mb-1 font-serif text-[1.7rem] font-medium tracking-tight text-[#4a2036] text-center">
                {displayTitle}
              </h1>
              
              {/* Subtitle */}
              <p className="mb-8 text-[0.85rem] text-[#4a2036]/60 text-center font-serif italic">
                Please verify your identity to continue.
              </p>

              <div className="w-full flex flex-col gap-4 relative z-10">
                {/* Custom Input Field with Icon */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e66496]/50 group-focus-within:text-[#e66496] transition-colors">
                    <Lock className="w-[1.15rem] h-[1.15rem]" />
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    placeholder="Enter password"
                    autoComplete="off"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") attemptText();
                    }}
                    className="w-full rounded-[16px] border border-[#fff0f5] bg-[#fffafc] pl-12 pr-4 py-3.5 text-[#4a2036] placeholder-[#4a2036]/30 shadow-[inset_0_2px_8px_rgba(224,85,134,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#e66496]/40 focus:ring-4 focus:ring-[#e66496]/10 font-medium text-[0.95rem] tracking-wide"
                  />
                </div>

                <button
                  type="button"
                  onClick={attemptText}
                  className="relative w-full rounded-[16px] bg-[#d65385] px-8 py-3.5 font-bold tracking-wider uppercase text-[0.75rem] text-white shadow-[0_8px_20px_rgba(224,85,134,0.2)] transition-all duration-300 hover:bg-[#c24675] hover:shadow-[0_8px_25px_rgba(224,85,134,0.3)] active:scale-[0.98]"
                >
                  UNLOCK DASHBOARD
                </button>
                
                <div className="absolute -bottom-6 inset-x-0 h-4 flex items-center justify-center">
                  {textError && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[0.75rem] uppercase tracking-widest text-[#d65385] font-bold"
                    >
                      {textError}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ============================================================== */
            /* HOME VIEW: ANIMATED NUMERIC PIN PAD                            */
            /* ============================================================== */
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-[360px] bg-white rounded-[32px] p-10 sm:p-12 shadow-[0_24px_60px_-15px_rgba(224,85,134,0.12)] border border-[#fff0f5] flex flex-col items-center"
            >
              {/* Hearts Header */}
              <div className="absolute top-7 inset-x-0 flex justify-center gap-2.5 text-[0.55rem] text-[#e66496]">
                <span>♥</span>
                <span>♥</span>
                <span>♥</span>
              </div>

              {/* Lock Icon */}
              <div className="w-12 h-12 mt-4 mb-4 rounded-full bg-[#fff5fa] flex items-center justify-center text-[#e66496]">
                <Lock strokeWidth={2.2} className="w-[1.15rem] h-[1.15rem]" />
              </div>

              {/* Title */}
              <h1 className="mb-8 font-serif text-[1.4rem] font-medium tracking-wide text-[#4a2036] text-center">
                {displayTitle}
              </h1>

              {/* Passcode Dots */}
              <motion.div
                animate={pinError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 sm:gap-4 mb-10"
              >
                {Array.from({ length: passcodeLength }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      i < pinInput.length
                        ? "bg-[#e66496] scale-110 shadow-sm"
                        : "bg-[#fff0f5]"
                    } ${pinError ? "bg-red-400" : ""}`}
                  />
                ))}
              </motion.div>

              {/* Number Pad Grid */}
              <div className="grid grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-5 w-full max-w-[260px] mx-auto mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePress(num.toString())}
                    className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl font-serif text-[#4a2036] bg-transparent hover:bg-[#fff0f5] focus:bg-[#ffe9f2] active:bg-[#f6bdcf] transition-colors outline-none focus:ring-1 focus:ring-[#e66496]/30"
                  >
                    {num}
                  </button>
                ))}
                <div />
                <button
                  onClick={() => handlePress("0")}
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl font-serif text-[#4a2036] bg-transparent hover:bg-[#fff0f5] focus:bg-[#ffe9f2] active:bg-[#f6bdcf] transition-colors outline-none focus:ring-1 focus:ring-[#e66496]/30"
                >
                  0
                </button>
                <button
                  onClick={handleDelete}
                  disabled={pinInput.length === 0}
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center text-[#e66496] hover:text-[#c44975] transition-colors disabled:opacity-0 outline-none"
                >
                  <Delete className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>
              
              <div className="absolute bottom-4 inset-x-0 h-4 flex items-center justify-center">
                {pinError && (
                  <span className="text-[0.75rem] text-red-400 font-medium animate-pulse">
                    Incorrect passcode
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}