"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string>("");

  // Stable string key so the effect doesn't re-run every render just
  // because the caller passed a new array literal with the same ids.
  const idsKey = sectionIds.join(",");

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // Near the bottom of the page (e.g. inside/after the last section,
      // possibly under a footer) — just force the last section active
      // instead of requiring scrollPosition to land inside its bounds.
      if (window.scrollY >= maxScroll - 2 && ids.length > 0) {
        setActiveSection(ids[ids.length - 1].replace("#", ""));
        return;
      }

      // Otherwise: the active section is the last one whose top has
      // been scrolled past. No upper bound check, so it can't fail to
      // match near a section's bottom edge.
      let current = "";
      for (const id of ids) {
        const cleanId = id.replace("#", "");
        const element = document.getElementById(cleanId);
        if (element && element.offsetTop <= scrollPosition) {
          current = cleanId;
        }
      }
      if (current) setActiveSection(current);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [idsKey, offset]);

  return activeSection;
}