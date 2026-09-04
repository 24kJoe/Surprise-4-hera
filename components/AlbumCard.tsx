"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface CollectionItem {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  media?: any[];
  items?: any[];
  _count?: {
    media?: number;
    items?: number;
  };
}

interface AlbumCardProps {
  collection?: CollectionItem;
  tilt?: number;
  index?: number;
}

export default function AlbumCard({ collection, tilt = 0, index = 0 }: AlbumCardProps) {
  if (!collection) return null;

  const mediaList = collection?.media || collection?.items || [];
  const mediaCount =
    mediaList.length ||
    collection?._count?.media ||
    collection?._count?.items ||
    0;

  const firstItem = mediaList[0];
  const mediaUrl =
    typeof firstItem === "string" ? firstItem : firstItem?.url;
  const isVideo =
    typeof firstItem === "object" && firstItem?.type === "VIDEO";
  const thumbnailUrl =
    typeof firstItem === "object" ? firstItem?.thumbnailUrl : null;
  const altText =
    (typeof firstItem === "object" ? firstItem?.altText || firstItem?.caption : null) ||
    collection?.title ||
    "Album cover";

  const destination = `/gallery/${collection?.slug || collection?.id || ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, rotate: 0, scale: 1.03 }}
      style={{ rotate: `${tilt}deg` }}
      className="relative group cursor-pointer select-none"
    >
      {/* Background stacked paper layers (subtle rounded-xl) */}
      <div className="absolute inset-0 bg-white/70 border border-pink-200/60 rounded-xl rotate-2 translate-x-1.5 translate-y-1.5 shadow-xs group-hover:rotate-3 transition-transform duration-300 pointer-events-none" />
      <div className="absolute inset-0 bg-white/80 border border-pink-200/70 rounded-xl -rotate-2 -translate-x-1 -translate-y-1 shadow-xs group-hover:-rotate-3 transition-transform duration-300 pointer-events-none" />

      {/* Main Front Card (balanced rounded-xl) */}
      <Link
        href={destination}
        className="relative block bg-[#fffdfa] p-3 pb-5 rounded-xl border border-pink-200/80 shadow-md hover:shadow-xl hover:border-rose-300 transition-all duration-300"
      >
        {/* Media Frame (gentle rounded-lg) */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-rose-200/60 flex items-center justify-center border border-rose-100/80">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                poster={thumbnailUrl || undefined}
                className="w-full h-full object-cover rounded-lg"
                muted
                playsInline
              />
            ) : (
              <img
                src={mediaUrl}
                alt={altText}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                loading="lazy"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-rose-300 gap-1">
              <svg
                className="w-7 h-7 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.75" />
                <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.75" />
                <path d="m21 15-5-5L5 21" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-medium opacity-70 font-sans">Empty</span>
            </div>
          )}

          {/* Media Count Badge */}
          {mediaCount > 0 && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-xs">
              <svg
                className="w-3 h-3 text-white/90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" />
                <path d="M8 21h11a2 2 0 0 0 2-2V8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{mediaCount}</span>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="mt-3 text-center px-1">
          <h3 className="font-serif font-semibold text-base sm:text-lg text-[rgb(74,32,58)] truncate">
            {collection.title || "Untitled Album"}
          </h3>
          <p className="font-serif italic text-xs text-[var(--rose)] mt-0.5 group-hover:underline">
            Click to view
          </p>
        </div>
      </Link>
    </motion.div>
  );
}