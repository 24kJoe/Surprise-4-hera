"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAllCollections } from "@/lib/get";
import { reorderCollectionsAction } from "@/lib/actions"; // Adjust path if needed
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
  
  // Drag and drop state
  const [reorderMode, setReorderMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

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
        console.error("Failed to load collections:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, []);

  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index;
    if (dragItemRef.current === null || dragOverItemRef.current === null) return;
    if (dragItemRef.current === dragOverItemRef.current) return;

    const items = [...collections];
    const draggedItem = items.splice(dragItemRef.current, 1)[0];
    items.splice(dragOverItemRef.current, 0, draggedItem);

    dragItemRef.current = dragOverItemRef.current;
    setCollections(items);
  };

  const handleDragEnd = () => {
    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };

  const saveNewOrder = async () => {
    setIsSaving(true);
    const payload = collections.map((item, idx) => ({ id: item.id, order: idx }));
    const res = await reorderCollectionsAction(payload);
    setIsSaving(false);

    if (res.success) {
      setReorderMode(false);
    } else {
      alert(res.error || "Failed to save order");
    }
  };

  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-head text-center mb-8">
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

        {/* Reorder Toolbar */}
        {!loading && collections.length > 0 && (
          <div className="flex justify-center sm:justify-end mb-8">
            {!reorderMode ? (
              <button
                onClick={() => setReorderMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg)] text-[var(--cream)]/75 border border-[var(--line)] hover:border-[var(--cream)]/30 hover:text-[var(--cream)] transition-all cursor-pointer shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
                </svg>
                <span>Rearrange Albums</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--plum)]/30 border border-[var(--rose)]/30 p-3 px-5 rounded-2xl w-full sm:w-auto shadow-md">
                <div className="flex items-center gap-2 text-[var(--rose)] text-sm font-medium">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-pulse">
                    <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
                  </svg>
                  <span>Drag albums to reorder</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setReorderMode(false);
                      window.location.reload(); // Quick way to cancel and reset to saved order
                    }}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium border border-[var(--line)] bg-[var(--bg)]/40 hover:bg-[var(--bg)] text-[var(--cream)]/75 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNewOrder}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSaving ? "Saving..." : "Save Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
              <div
                key={collection.id}
                draggable={reorderMode}
                onDragStart={() => reorderMode && handleDragStart(i)}
                onDragEnter={() => reorderMode && handleDragEnter(i)}
                onDragEnd={() => reorderMode && handleDragEnd()}
                onDragOver={(e) => e.preventDefault()}
                className={`${
                  reorderMode
                    ? "cursor-grab active:cursor-grabbing hover:ring-2 ring-[var(--rose)]/50 rounded-xl z-10 opacity-90 scale-100 hover:scale-105 transition-transform"
                    : ""
                }`}
                style={reorderMode ? { pointerEvents: "auto" } : {}}
              >
                {/* We render a div overlay in reorderMode to prevent clicking the AlbumCard link */}
                <div className="relative">
                  {reorderMode && (
                    <div className="absolute inset-0 z-20" />
                  )}
                  <AlbumCard
                    collection={collection}
                    tilt={tilts[i] || 0}
                    index={i}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}