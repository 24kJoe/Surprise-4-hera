"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { signIn } from "@/lib/admin/actions";

export default function AdminSignIn() {
  const [error, action, pending] = useActionState(signIn, "");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#fff5fa] p-4 text-[#4a2036]">
      <Link
        href="/#letter"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-[#ffe9f2] text-[#4a2036]/60 hover:text-[#e66496] transition-colors shadow-sm flex items-center justify-center group z-50"
        title="Return to site"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </Link>
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
          Admin Access
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-[0.85rem] text-[#4a2036]/60 text-center font-serif italic">
          Please verify your identity to continue.
        </p>

        <form action={action} className="w-full flex flex-col gap-4 relative z-10">
          {/* Custom Input Field with Icon */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e66496]/50 group-focus-within:text-[#e66496] transition-colors">
              <Lock className="w-[1.15rem] h-[1.15rem]" />
            </div>
            <input
              type="password"
              name="password"
              required
              aria-label="Password"
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-[16px] border border-[#fff0f5] bg-[#fffafc] pl-12 pr-4 py-3.5 text-[#4a2036] placeholder-[#4a2036]/30 shadow-[inset_0_2px_8px_rgba(224,85,134,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#e66496]/40 focus:ring-4 focus:ring-[#e66496]/10 font-medium text-[0.95rem] tracking-wide"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="relative w-full rounded-[16px] bg-[#d65385] px-8 py-3.5 font-bold tracking-wider uppercase text-[0.75rem] text-white shadow-[0_8px_20px_rgba(224,85,134,0.2)] transition-all duration-300 hover:bg-[#c24675] hover:shadow-[0_8px_25px_rgba(224,85,134,0.3)] active:scale-[0.98]"
          >
            {pending ? "Unlocking…" : "Unlock Dashboard"}
          </button>

          <div className="absolute -bottom-6 inset-x-0 h-4 flex items-center justify-center">
            {error && (
              <motion.span
                role="alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[0.75rem] uppercase tracking-widest text-[#d65385] font-bold"
              >
                {error}
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
