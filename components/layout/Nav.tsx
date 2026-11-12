"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Settings, Menu, X, Heart } from "lucide-react";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

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
    { href: "/#daily-reasons", id: "#daily-reasons", label: "Daily Reasons" },
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

  // Keep the shareable URL in sync with the same section used by the tabs.
  // Replacing the entry avoids adding a history entry for every scroll.
  useEffect(() => {
    if (pathname !== "/" || !scrolledActiveSection) return;
    const timer = setTimeout(() => {
      const hash = `#${scrolledActiveSection}`;
      if (window.location.pathname !== "/" || window.location.hash === hash) return;
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.replaceState(window.history.state, "", url);
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname, scrolledActiveSection]);

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
        "bg-[#fff0f6]/95 backdrop-blur-xl",
        "border-b border-[var(--line)]",
        "shadow-[0_4px_20px_rgba(116,51,79,0.04)]",
        "px-4 md:px-8",
        isScrolled ? "py-2" : "py-3",
        "transition-[padding] duration-300 ease-out",
        className
      )}
    >

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-7">
          <Link
            href="/#letter"
            onClick={(e) => handleLinkClick({ href: "/#letter", id: "#letter" }, e)}
            className="text-[#4a2036] flex items-center gap-3 group shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b96386] rounded-lg"
          >
            <span
              className={twMerge(
                "relative inline-flex items-center justify-center rounded-xl bg-[#f7dce7] text-[var(--rose)] transition-colors duration-300 group-hover:bg-[#f1cbdc] group-hover:text-[var(--rose-dim)]",
                "w-9 h-9"
              )}
            >
              <Heart aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={1.3} />
            </span>
            <span className="font-[family-name:var(--serif)] text-xl leading-normal font-normal tracking-normal text-[var(--cream)]">
              Our Story
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 border-l border-[#ead3dd] pl-6">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
                  aria-current={isActive ? "location" : undefined}
                  className={twMerge(
                    "relative isolate font-[family-name:var(--sans)] text-[11px] uppercase tracking-[0.12em] px-3.5 py-3 rounded-lg transition-colors duration-200 z-10 font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#b96386]",
                    isActive
                      ? "text-[var(--rose-dim)] bg-[#f4d3e1]"
                      : "text-[var(--cream)]/75 hover:text-[var(--cream)] hover:bg-[#f9eef3]/70"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full -z-10 bg-[#c45d86]"
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
              "hidden xl:flex items-center gap-2 group relative overflow-hidden",
              "bg-transparent hover:bg-[#f9eef3] text-[#956076] hover:text-[#74334f]",
              "border border-transparent",
              "text-xs tracking-wide font-medium",
              "px-3 py-2 rounded-lg",
              "focus-visible:outline-2 focus-visible:outline-[#b96386]",
              "transition-all duration-300 active:scale-95"
            )}
            title="Admin Panel"
          >
            <Settings className="w-4 h-4 text-[#e05586] group-hover:text-[#b83f6c] transition-transform duration-300 group-hover:rotate-90" />
            <span>Admin</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden relative p-2.5 text-[#74465b] rounded-xl bg-[#f8e6ed] hover:bg-[#f3d9e4] focus-visible:outline-2 focus-visible:outline-[#b96386] transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            className="xl:hidden overflow-hidden border-t border-[#efd7e1] mt-3 pt-3 grid grid-cols-2 gap-2 pb-2"
          >
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={twMerge(
                    "font-[family-name:var(--sans)] text-[11px] uppercase tracking-[0.12em] px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between border",
                    isActive
                      ? "bg-[#f4d3e1] text-[#873e5e] border-transparent"
                      : "text-[#4a2036] border-transparent hover:bg-pink-100/50 hover:border-[#e05586]/20"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <Heart aria-hidden="true" className="h-3 w-3 fill-current" />
                  )}
                </a>
              );
            })}

            <div className="col-span-2 pt-2 mt-1 border-t border-[#e05586]/15">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-xs tracking-wide px-4 py-3 rounded-xl hover:bg-[#f9edf2] text-[#956076] font-medium transition-colors"
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
