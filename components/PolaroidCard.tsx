"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

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
  photo: MediaItem;
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
      {/* Media frame with smooth rounded-2xl corners */}
      <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--rose-dim)] to-[var(--gold-soft)] flex items-center justify-center relative group shadow-inner">
        {photo.url ? (
          isVideo ? (
            /* عرض معاينة الفيديو داخل البطاقة */
            <div className="w-full h-full relative">
              <video
                src={photo.url}
                poster={photo.thumbnailUrl || undefined}
                className="w-full h-full object-cover rounded-2xl"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-md">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>
          ) : (
            /* عرض الصورة */
            <img
              src={photo.url}
              alt={photo.caption || photo.altText || "Gallery photo"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
              loading="lazy"
            />
          )
        ) : (
          <span className="text-xs text-white/70">No Media</span>
        )}
      </div>

      <div className="font-serif italic text-sm text-center mt-3.5 text-rose-950/80 line-clamp-2 px-1">
        {photo.caption || "A special moment"}
      </div>
    </>
  );

  // Soft rounded-3xl container styling
  const cardClasses =
    "bg-[#fffdfa] p-3.5 pb-6 rounded-3xl text-[var(--ink)] shadow-md hover:shadow-xl border border-rose-200/80 hover:border-rose-300 transition-all duration-300 flex flex-col justify-between block w-full";

  return (
    <>
      {href ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
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
          whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
          onClick={handleCardClick}
          style={{ rotate: `${tilt}deg` }}
          className={cardClasses}
        >
          {content}
        </motion.div>
      )}

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
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#fffdfa] p-5 sm:p-7 pb-8 rounded-[2.5rem] max-w-3xl w-full shadow-2xl border border-rose-200/80 cursor-default flex flex-col items-center"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-black/5 flex items-center justify-center border border-rose-100/70">
                {isVideo ? (
                  <video
                    src={photo.url}
                    poster={photo.thumbnailUrl || undefined}
                    controls
                    autoPlay
                    className="max-h-[75vh] w-auto max-w-full rounded-2xl"
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.altText || "Expanded view"}
                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
                  />
                )}
              </div>

              {photo.caption && (
                <p className="mt-4 text-center font-serif italic text-base sm:text-lg text-[rgb(74,32,58)] px-3">
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