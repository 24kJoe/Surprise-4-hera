"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config/site";
import { Heart } from "lucide-react";

export default function NameToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    
    setShow(true);

    const timer = setTimeout(() => setShow(false), 2300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="name-toast" className={show ? "show" : ""} aria-live="polite">
      <span className="toast-heart" aria-hidden="true"><Heart size={17} fill="currentColor" strokeWidth={1.5} /></span>
      <span className="toast-copy">
        <span id="name-toast-text">{CONFIG.yourName}</span>
      </span>
    </div>
  );
}
