"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

export type MediaType = "IMAGE" | "VIDEO";

export interface MediaItem {
  id: string;
  type?: MediaType;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  altText?: string | null;
}

interface PolaroidCardProps {
  photo: MediaItem; // يدعم كلاً من الصورة والفيديو
  tilt: number;
  onClick?: () => void;
  index?: number;
  href?: string;
}

export default function PolaroidCard({
  photo,
  tilt,
  onClick,
  index = 0,
  href,
}: PolaroidCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isVideo = photo.type === "VIDEO";

  // إغلاق المودال بضغطة ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  // منع التمرير بالخلفية عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleCardClick = () => {
    if (onClick) onClick();
    if (!href) {
      setIsOpen(true);
    }
  };

  const content = (
    <>
      <div className="aspect-square rounded-[2px] overflow-hidden bg-gradient-to-br from-[var(--rose-dim)] to-[var(--gold-soft)] flex items-center justify-center relative group">
        {photo.url ? (
          isVideo ? (
            /* عرض معاينة الفيديو داخل البطاقة */
            <div className="w-full h-full relative">
              <video
                src={photo.url}
                poster={photo.thumbnailUrl || undefined}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>
          ) : (
            /* عرض الصورة */
            <img
              src={photo.url}
              alt={photo.caption || photo.altText || "Gallery photo"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )
        ) : (
          <span className="text-xs text-white/70">No Media</span>
        )}
      </div>
      <div className="font-serif italic text-sm text-center mt-3 text-[var(--cream)] line-clamp-2 px-1">
        {photo.caption || "A special moment"}
      </div>
    </>
  );

  const cardClasses =
    "bg-[var(--paper)] p-3 pb-6 rounded-[3px] text-[var(--ink)] shadow-[var(--shadow)] cursor-pointer transition-shadow duration-300 hover:shadow-2xl border border-pink-100 flex flex-col justify-between block w-full";

  return (
    <>
      {/* بطاقة البولاروايد الأساسية */}
      {href ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
          style={{ rotate: `${tilt}deg` }}
        >
          <Link href={href} className={cardClasses}>
            {content}
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
          onClick={handleCardClick}
          style={{ rotate: `${tilt}deg` }}
          className={cardClasses}
        >
          {content}
        </motion.div>
      )}

      {/* المودال الاحترافي (Lightbox) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[var(--paper)] p-4 sm:p-6 pb-8 rounded-lg max-w-3xl w-full shadow-2xl border border-pink-200/50 cursor-default flex flex-col items-center"
            >
              {/* زر الإغلاق */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-[var(--cream)] flex items-center justify-center font-bold transition-colors focus:outline-none cursor-pointer"
              >
                ✕
              </button>

              {/* إطار الميديا المكبرة (صورة أو فيديو مع أدوات التحكم) */}
              <div className="w-full max-h-[75vh] overflow-hidden rounded-md bg-black/5 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={photo.url}
                    poster={photo.thumbnailUrl || undefined}
                    controls
                    autoPlay
                    className="max-h-[75vh] w-auto max-w-full rounded-sm"
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.altText || "Expanded view"}
                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm"
                  />
                )}
              </div>

              {/* الكابشن (الوصف) */}
              {photo.caption && (
                <p className="mt-4 text-center font-serif italic text-base sm:text-lg text-[var(--cream)] px-2">
                  {photo.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}