"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllCollections } from "@/lib/get";
import AlbumCard, { CollectionItem } from "@/components/AlbumCard";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/80 p-3 pb-6 rounded-md shadow-md animate-pulse border border-[var(--line)] flex flex-col gap-3"
        >
          <div className="aspect-square bg-rose-100/70 rounded-xs w-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
          <div className="h-4 bg-rose-100/80 rounded w-3/4 mx-auto mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [tilts, setTilts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const data = await getAllCollections();
        
        const filteredCollections = (data as any[]).filter(
          (collection) => collection.slug !== "our-memories"
        );

        setCollections(filteredCollections as unknown as CollectionItem[]);
        setTilts(filteredCollections.map(() => Math.random() * 8 - 4));
      } catch (error) {
        console.error("Failed to load photo & video collections:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, []);

  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-head text-center mb-12">
          <span className="eyebrow block text-xs font-semibold tracking-[0.28em] text-[var(--gold-soft)] uppercase mb-2">
            Our Little Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[var(--cream)] mb-3">
            Captured Moments
          </h2>
          <p className="text-[var(--cream)]/70 max-w-lg mx-auto text-sm sm:text-base">
            Select a collection to explore the photo and video memories stored inside.
          </p>
        </div>

        {loading ? (
          <GallerySkeleton />
        ) : collections.length === 0 ? (
          <div className="text-center py-12 text-[var(--cream)]/60 font-serif italic">
            No collections available yet.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {collections.map((collection, i) => (
              <AlbumCard
                key={collection.id}
                collection={collection}
                tilt={tilts[i] || 0}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}