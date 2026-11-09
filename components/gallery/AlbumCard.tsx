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
    collection?._count?.media ??
    collection?._count?.items ??
    mediaList.length;

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
      whileHover={{ y: -6, rotate: 0 }}
      style={{ rotate: `${tilt * 0.4}deg` }}
      className="relative group cursor-pointer select-none"
    >
      {/* Background stacked paper layers (subtle rounded-xl) */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#fff3f7] border border-rose-200/60 rounded-[1.5rem] rotate-[1.5deg] translate-y-1.5 shadow-sm group-hover:rotate-2 transition-transform duration-300 pointer-events-none" />

      {/* Main Front Card (balanced rounded-xl) */}
      <Link
        href={destination}
        className="relative block h-full bg-[linear-gradient(145deg,#ffffff,#fff9fb)] p-3 sm:p-4 rounded-[1.5rem] border border-rose-200/60 shadow-[0_12px_32px_-18px_rgba(126,53,84,0.3)] hover:shadow-[0_20px_40px_-18px_rgba(126,53,84,0.3)] hover:border-[#dca3ba] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b53e6d] transition-all duration-300"
      >
        {/* Media Frame (gentle rounded-lg) */}
        <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-rose-200/60 flex items-center justify-center border border-rose-100/80">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                poster={thumbnailUrl || undefined}
                preload={thumbnailUrl ? "none" : "metadata"}
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
                decoding="async"
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
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#4a2036]/65 text-white text-[10px] font-medium backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-xs">
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
        <div className="flex items-center justify-between gap-2 px-1 pt-3 sm:pt-5 pb-2">
          <div className="min-w-0">
          <h3 className="font-serif font-medium text-base sm:text-2xl leading-tight text-[rgb(74,32,58)] break-words">
            {collection.title || "Untitled Album"}
          </h3>
          <p className="hidden sm:block font-serif italic text-sm text-[#956076] mt-1.5">
            A little piece of us
          </p>
          </div>
          <span aria-hidden="true" className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-rose-50/70 text-[#b95c82] group-hover:bg-[#cc4f80] group-hover:text-white transition-colors">↗</span>
        </div>
      </Link>
    </motion.div>
  );
}
