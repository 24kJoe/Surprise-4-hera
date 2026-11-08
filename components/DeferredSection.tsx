"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function DeferredSection({ children, id }: { children: ReactNode; id?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={container} id={ready ? undefined : id} style={{ minHeight: ready ? undefined : 320 }}>
    {ready ? children : <div role="status" className="p-8 text-center text-rose-400">Loading…</div>}
  </div>;
}
