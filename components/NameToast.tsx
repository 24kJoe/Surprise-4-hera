"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

export default function NameToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    
    setShow(true);

    const timer = setTimeout(() => setShow(false), 2300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="name-toast" className={show ? "show" : ""} aria-live="polite">
      <span className="toast-heart">♥</span>
      <span id="name-toast-text">{CONFIG.yourName}</span>
    </div>
  );
}