import { useEffect, useRef, useState } from "react";

export function useVisibleSection(keepActive = false) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let inView = !("IntersectionObserver" in window);
    const update = () => setActive(!document.hidden && (inView || keepActive));
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? false;
        update();
      })
      : undefined;
    observer?.observe(element);
    document.addEventListener("visibilitychange", update);
    const initial = window.setTimeout(update, 0);
    return () => {
      window.clearTimeout(initial);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [keepActive]);

  return { ref, active };
}
