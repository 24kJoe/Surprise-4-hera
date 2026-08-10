"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Settings, Menu, X } from "lucide-react";
import { useActiveSection } from "@/lib/hooks";

interface NavProps {
  className?: string;
}

export default function Nav({ className }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // الروابط المباشرة بدون الحاجة لـ baseUrl
  const links = [
    { href: "/#letter", id: "#letter", label: "Letter" },
    { href: "/#memories", id: "#memories", label: "Memories" },
    { href: "/#gallery", id: "#gallery", label: "Gallery" },
    { href: "/#counter", id: "#counter", label: "Counter" },
  ];

  // تتبع الأقسام أثناء السكرول
  const sectionIds = links.map((l) => l.id);
  const scrolledActiveSection = useActiveSection(sectionIds);

  // حالة محليّة لإعطاء استجابة فورية عند الضغط
  const [activeTab, setActiveTab] = useState("#letter");

  // تحديث التحديد النشط فور تغير القسم المكتشف بالسكرول
  useEffect(() => {
    if (scrolledActiveSection) {
      setActiveTab(scrolledActiveSection);
    }
  }, [scrolledActiveSection]);

  const handleLinkClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={twMerge(
        "fixed top-0 left-0 right-0 z-50",
        "bg-white/80 backdrop-blur-md border-b border-pink-200/50 shadow-xs",
        "px-4 py-3 md:px-8",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Brand Logo + Desktop Links */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <Link
            href="/#letter"
            onClick={() => handleLinkClick("#letter")}
            className="font-serif text-lg md:text-xl text-[#4a2036] tracking-wider flex items-center gap-1.5 group shrink-0"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-pink-500 text-xl leading-none inline-block"
            >
              ♥
            </motion.span>
            <span className="group-hover:opacity-80 transition-opacity font-semibold">
              Our Story
            </span>
          </Link>

          {/* Links for Desktop */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  className={twMerge(
                    "relative text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-200 z-10 font-medium",
                    isActive
                      ? "text-white"
                      : "text-[#4a2036]/80 hover:text-[#4a2036]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-pink-500 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Side: Light Admin Button (Desktop) & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Light Admin Link - Desktop */}
          <Link
            href="/admin"
            className={twMerge(
              "hidden md:flex items-center gap-2 group",
              "bg-pink-50/80 hover:bg-pink-100/80 text-[#e05586] hover:text-[#b83f6c]",
              "border border-pink-200/80 hover:border-pink-300",
              "text-xs tracking-wider uppercase font-semibold",
              "px-4 py-2 rounded-full shadow-xs backdrop-blur-sm",
              "transition-all duration-300 active:scale-95"
            )}
            title="Admin Panel"
          >
            <Settings className="w-4 h-4 text-[#e05586] group-hover:text-[#b83f6c] transition-transform duration-300 group-hover:rotate-90" />
            <span>Admin</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#4a2036] focus:outline-none rounded-lg hover:bg-pink-100/50 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-pink-100/60 mt-3 pt-3 flex flex-col gap-1.5 pb-2"
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => handleLinkClick(link.id)}
                className={twMerge(
                  "text-xs uppercase tracking-widest px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-between",
                  activeTab === link.id
                    ? "bg-pink-500 text-white shadow-xs"
                    : "text-[#4a2036] hover:bg-pink-100/50"
                )}
              >
                <span>{link.label}</span>
                {activeTab === link.id && <span>♥</span>}
              </a>
            ))}

            {/* Light Admin Link - Mobile */}
            <div className="pt-2 mt-1 border-t border-pink-100/40">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-xs uppercase tracking-widest px-4 py-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#e05586] font-semibold transition-colors"
              >
                <span>Admin Panel</span>
                <Settings className="w-4 h-4 text-[#e05586]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}