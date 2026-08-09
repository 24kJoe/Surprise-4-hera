"use client";

import { useRef, useState } from "react";
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
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract passwords safely from CONFIG
  const configObj = (CONFIG || {}) as Record<string, any>;
  const adminPass = configObj.adminPassword || "12345";
  const homePass = configObj.password || "151009";

  // expectedPassword takes absolute priority if passed via props
  const targetPassword =
    expectedPassword ??
    (type === "admin" ? adminPass : homePass);

  const defaultTitle = type === "admin" ? "Admin Access" : "Enter Password";
  const displayTitle = title || defaultTitle;

  function attempt() {
    const typed = value.trim();
    if (typed === targetPassword) {
      setError("");
      onUnlock();
      return;
    }
    setError("Incorrect password — try again.");
    setValue("");
    inputRef.current?.focus();
  }

  if (unlocked) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-gradient-to-br from-[#fffafc] via-[#ffe9f2] to-[#f6bdcf] p-6 text-[#4a2036]">
      {/* Password Card Container */}
      <div className="relative w-full max-w-[440px] rounded-[28px] border border-[#e05586]/45 bg-gradient-to-b from-white/94 to-[#fff5fa]/88 p-[40px_34px_34px] text-center shadow-[0_20px_45px_rgba(224,85,134,0.18)] backdrop-blur-md">
        
        {/* Hearts Header Decoration */}
        <div className="absolute top-2 inset-x-0 text-[0.68rem] tracking-[0.28em] text-[#e05586]">
          ♥ ♥ ♥
        </div>

        {/* Eyebrow Label */}
        <div className="text-[0.68rem] uppercase tracking-[0.28em] font-semibold text-[#e8659a]">
          {type === "admin" ? "Admin Control Panel" : "Private Page"}
        </div>

        {/* Title */}
        <h1 className="mt-3 mb-[12px] font-serif text-[clamp(2rem,5vw,2.68rem)] font-medium leading-tight text-[#4a2036]">
          {displayTitle}
        </h1>

        {/* Description */}
        <p className="mb-6 text-[0.88rem] text-[#4a2036]/74">
          {type === "admin"
            ? "Please verify admin authorization to proceed."
            : "This website is locked before the story begins."}
        </p>

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="password-input"
              className="block text-left text-[0.70rem] uppercase tracking-[0.18em] text-[#b83f6c] mb-2 font-medium"
            >
              Password
            </label>
            <input
              ref={inputRef}
              id="password-input"
              type="password"
              placeholder="••••••"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") attempt();
              }}
              className="w-full rounded-[12px] border border-[#e05586]/56 bg-white/65 px-3.5 py-3 text-[#4a2036] placeholder-[#4a2036]/55 outline-none transition focus:border-[#e8659a] focus:ring-4 focus:ring-[#e05586]/24"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={attempt}
              className="mt-2 rounded-full border border-[#e05586] bg-gradient-to-r from-[#ff4f93] to-[#e05586] px-8 py-2.5 font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#b83f6c] active:translate-y-0 active:scale-95 cursor-pointer"
            >
              Unlock
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 min-h-[20px] text-[0.78rem] font-medium text-[#b83f6c]">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}