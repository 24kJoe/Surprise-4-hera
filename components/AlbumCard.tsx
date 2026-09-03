"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Images, Video, Film } from "lucide-react";

export type MediaType = "IMAGE" | "VIDEO";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  altText?: string | null;
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  media: MediaItem[];
}

interface AlbumCardProps {
  collection: CollectionItem;
  tilt: number;
  index?: number;
}

export default function AlbumCard({ collection, tilt, index = 0 }: AlbumCardProps) {

  const latestMedia = collection.media?.[0];
  const totalCount = collection.media?.length || 0;
  

  const imageCount = collection.media?.filter((item) => item.type === "IMAGE").length || 0;
  const videoCount = collection.media?.filter((item) => item.type === "VIDEO").length || 0;

  const href = collection.slug ? `/${collection.slug}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
      style={{ rotate: `${tilt}deg` }}
      className="relative group cursor-pointer"
    >
      <Link href={href} className="block">
        <div className="absolute inset-0 bg-white/40 rounded-[3px] border border-pink-100 transform translate-x-2 translate-y-2 shadow-sm transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
        <div className="absolute inset-0 bg-white/70 rounded-[3px] border border-pink-100 transform translate-x-1 translate-y-1 shadow-md transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />

        <div className="relative bg-[var(--paper,#fff)] p-3 pb-5 rounded-[3px] text-[var(--ink,#333)] shadow-[var(--shadow)] border border-pink-100 flex flex-col justify-between">
          
          
          <div className="aspect-square rounded-[2px] overflow-hidden bg-gradient-to-br from-[var(--rose-dim,#9f1239)] to-[var(--gold-soft,#d4af37)] flex items-center justify-center relative">
            {latestMedia ? (
              latestMedia.type === "VIDEO" ? (
              
                <div className="w-full h-full relative">
                  <video
                    src={latestMedia.url}
                    poster={latestMedia.thumbnailUrl || undefined}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-black/60 p-2 rounded-full text-white backdrop-blur-xs">
                      <Video className="w-5 h-5 fill-white" />
                    </div>
                  </div>
                </div>
              ) : (
            
                <img
                  src={latestMedia.url}
                  alt={latestMedia.altText || latestMedia.caption || collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )
            ) : (
              <span className="text-xs text-white/70"> Empty </span>
            )}

           
            {totalCount > 0 && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-sans px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                {videoCount > 0 && imageCount > 0 ? (
                  <>
                    <Film className="w-3 h-3" />
                    <span>{totalCount}</span>
                  </>
                ) : videoCount > 0 ? (
                  <>
                    <Video className="w-3 h-3" />
                    <span>{videoCount}</span>
                  </>
                ) : (
                  <>
                    <Images className="w-3 h-3" />
                    <span>{imageCount}</span>
                  </>
                )}
              </div>
            )}
          </div>

        
          <div className="mt-3 text-center px-1">
            <h3 className="font-serif font-bold text-base text-[var(--cream,#1a1a1a)] line-clamp-1">
              {collection.title}
            </h3>
            <p className="font-serif italic text-xs text-rose-500/80 mt-1 line-clamp-1">
              {latestMedia?.caption || collection.description || "اضغط للاستعراض"}
            </p>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}