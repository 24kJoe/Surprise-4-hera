"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Settings, Menu, X } from "lucide-react";
import { useActiveSection } from "@/lib/hooks";

interface NavProps {
  className?: string;
}

export default function Nav({ className }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isGallerySubpage = pathname?.startsWith("/gallery");

  const links = [
    { href: "/#letter", id: "#letter", label: "Letter" },
    { href: "/#memories", id: "#memories", label: "Memories" },
    { href: "/#gallery", id: "#gallery", label: "Gallery" },
    { href: "/#voicenotes", id: "#voicenotes", label: "Voicenotes" },
    { href: "/#future-letters", id: "#future-letters", label: "Secret Letters" },
    { href: "/#counter", id: "#counter", label: "Counter" },
  ];

  const sectionIds = links.map((l) => l.id.replace("#", ""));
  const scrolledActiveSection = useActiveSection(sectionIds);

  const [activeTab, setActiveTab] = useState("#letter");

  useEffect(() => {
    // If we are browsing an individual gallery album, highlight Gallery
    if (isGallerySubpage) {
      setActiveTab("#gallery");
      return;
    }

    if (scrolledActiveSection) {
      setActiveTab(`#${scrolledActiveSection}`);
    }
  }, [scrolledActiveSection, isGallerySubpage]);

  // Shrink the nav once the page is scrolled a bit — never hide it entirely.
  useEffect(() => {
    let ticking = false;

    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 24);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrolled();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLinkClick = (link: { href: string; id: string }, e?: React.MouseEvent) => {
    // If we're on a subpage like /gallery/[slug], let normal navigation take us back home
    if (pathname !== "/") {
      setIsOpen(false);
      router.push(link.href);
      return;
    }

    e?.preventDefault();
    setActiveTab(link.id);

    const wasOpenOnMobile = isOpen;
    setIsOpen(false);

    const cleanId = link.id.replace("#", "");

    const performScroll = () => {
      const el = document.getElementById(cleanId);
      if (!el) return;

      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      const navOffset = 88;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });

      if (scrollResetTimeout.current) clearTimeout(scrollResetTimeout.current);
      scrollResetTimeout.current = setTimeout(() => {
        html.style.scrollBehavior = prevScrollBehavior;
      }, 700);
    };

    if (wasOpenOnMobile) {
      requestAnimationFrame(() => requestAnimationFrame(performScroll));
    } else {
      performScroll();
    }

    window.history.pushState(null, "", `/${link.id}`);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={twMerge(
        "fixed top-0 left-0 right-0 z-50 transform-gpu will-change-transform",
        "bg-white/70 backdrop-blur-xl",
        "border-b border-[#e05586]/25",
        "shadow-[0_8px_32px_rgba(224,85,134,0.12)]",
        "px-4 md:px-8",
        isScrolled ? "py-2" : "py-3",
        "transition-[padding] duration-300 ease-out",
        className
      )}
    >
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#ff4f93] to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e05586]/60 to-transparent" />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/#letter"
            onClick={(e) => handleLinkClick({ href: "/#letter", id: "#letter" }, e)}
            className="font-serif text-lg md:text-xl text-[#4a2036] tracking-wider flex items-center gap-2 group shrink-0"
          >
            <span
              className={twMerge(
                "relative inline-flex items-center justify-center rounded-full border border-[#e05586]/40 bg-gradient-to-br from-[#ffe3ee]/80 to-white/40 shadow-[0_0_12px_rgba(224,85,134,0.35)] group-hover:shadow-[0_0_20px_rgba(255,79,147,0.55)] transition-all duration-300",
                isScrolled ? "w-6 h-6" : "w-7 h-7"
              )}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-[#e05586] text-base leading-none inline-block drop-shadow-[0_0_6px_rgba(255,79,147,0.55)]"
              >
                ♥
              </motion.span>
              <motion.span
                className="absolute inset-0 rounded-full border border-[#ff4f93]/50"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              />
            </span>
            <span className="group-hover:opacity-80 transition-opacity font-semibold bg-gradient-to-r from-[#4a2036] via-[#b83f6c] to-[#4a2036] bg-clip-text text-transparent bg-[length:200%_auto] group-hover:bg-[position:100%_0]">
              Our Story
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full border border-[#e05586]/15 bg-white/40 backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(224,85,134,0.08)]">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
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
                      className="absolute inset-0 rounded-full -z-10 bg-gradient-to-r from-[#e05586] via-[#ff4f93] to-[#e8659a] shadow-[0_0_16px_rgba(255,79,147,0.55)]"
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

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className={twMerge(
              "hidden md:flex items-center gap-2 group relative overflow-hidden",
              "bg-white/60 hover:bg-white/80 text-[#e05586] hover:text-[#b83f6c]",
              "border border-[#e05586]/30 hover:border-[#ff4f93]/60",
              "text-xs tracking-wider uppercase font-semibold",
              "px-4 py-2 rounded-full backdrop-blur-sm",
              "shadow-[0_0_0_rgba(255,79,147,0)] hover:shadow-[0_0_18px_rgba(255,79,147,0.35)]",
              "transition-all duration-300 active:scale-95"
            )}
            title="Admin Panel"
          >
            <Settings className="w-4 h-4 text-[#e05586] group-hover:text-[#b83f6c] transition-transform duration-300 group-hover:rotate-90" />
            <span>Admin</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2 text-[#4a2036] focus:outline-none rounded-lg border border-[#e05586]/25 bg-white/50 hover:bg-pink-100/50 hover:border-[#ff4f93]/50 hover:shadow-[0_0_14px_rgba(255,79,147,0.35)] transition-all"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-[#e05586]/20 mt-3 pt-3 flex flex-col gap-1.5 pb-2"
          >
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={twMerge(
                    "text-xs uppercase tracking-widest px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-between border",
                    isActive
                      ? "bg-gradient-to-r from-[#e05586] via-[#ff4f93] to-[#e8659a] text-white border-transparent shadow-[0_0_16px_rgba(255,79,147,0.45)]"
                      : "text-[#4a2036] border-transparent hover:bg-pink-100/50 hover:border-[#e05586]/20"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">♥</span>
                  )}
                </a>
              );
            })}

            <div className="pt-2 mt-1 border-t border-[#e05586]/15">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-xs uppercase tracking-widest px-4 py-3 rounded-xl bg-white/60 hover:bg-pink-100 border border-[#e05586]/30 hover:border-[#ff4f93]/60 text-[#e05586] font-semibold transition-colors hover:shadow-[0_0_14px_rgba(255,79,147,0.35)]"
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