"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAlbumSummaries } from "@/lib/gallery/queries";
import { reorderCollectionsAction } from "@/lib/gallery/actions"; // Adjust path if needed
import AlbumCard, { CollectionItem } from "@/components/gallery/AlbumCard";

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
  const [mobilePage, setMobilePage] = useState(0);
  const mobilePageCount = Math.ceil(collections.length / 2);
  const currentMobilePage = Math.min(mobilePage, Math.max(0, mobilePageCount - 1));
  const [desktopPage, setDesktopPage] = useState(0);
  const desktopPageCount = Math.ceil(collections.length / 3);
  const currentDesktopPage = Math.min(desktopPage, Math.max(0, desktopPageCount - 1));
  
  // Drag and drop state
  const [reorderMode, setReorderMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const data = await getAlbumSummaries();
        
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
    <section id="gallery" className="scroll-mt-24">
      <div className="section-inner">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-[#a74b70] uppercase mb-5">
            <span aria-hidden="true" className="h-px w-8 bg-rose-200" />
            Our Little Gallery
            <span aria-hidden="true" className="h-px w-8 bg-rose-200" />
          </span>
          <h2 className="text-4xl sm:text-5xl tracking-tight font-serif text-[var(--cream)] mb-4">
            Captured <span className="italic text-[#b94f79]">Moments</span>
          </h2>
          <p className="text-[#906579] max-w-sm mx-auto font-serif text-base sm:text-lg leading-relaxed">
            Our favorite days, little adventures, and all the moments in between.
          </p>
        </div>

        {/* Reorder Toolbar */}
        {!loading && collections.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-7 pb-4 border-b border-rose-200/60">
            <span className="font-serif italic text-sm text-[#956076]">{collections.length} little chapters of us</span>
            {!reorderMode ? (
              <button
                onClick={() => setReorderMode(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-medium bg-white/60 text-[#956076] border border-rose-200/70 hover:bg-rose-50 hover:text-[#74334f] transition-colors cursor-pointer"
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
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-7 sm:gap-y-10"
          >
            {collections.map((collection, i) => (
              <div
                key={collection.id}
                draggable={reorderMode}
                onDragStart={() => reorderMode && handleDragStart(i)}
                onDragEnter={() => reorderMode && handleDragEnter(i)}
                onDragEnd={() => reorderMode && handleDragEnd()}
                onDragOver={(e) => e.preventDefault()}
                className={`${!reorderMode && Math.floor(i / 2) !== currentMobilePage ? "hidden" : "block"} ${!reorderMode && Math.floor(i / 3) !== currentDesktopPage ? "sm:hidden" : "sm:block"} ${
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
                    index={reorderMode ? i : i % 3}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
        {!loading && !reorderMode && mobilePageCount > 1 && (
          <nav aria-label="Album pages" className="mt-7 flex items-center justify-between gap-3 sm:hidden">
            <button
              onClick={() => setMobilePage(currentMobilePage - 1)}
              disabled={currentMobilePage === 0}
              className="min-h-11 rounded-full border border-rose-200 bg-white/70 px-4 text-xs text-[#956076] disabled:opacity-35"
            >
              ← Previous
            </button>
            <span aria-live="polite" className="text-xs text-[#956076]">{currentMobilePage + 1} / {mobilePageCount}</span>
            <button
              onClick={() => setMobilePage(currentMobilePage + 1)}
              disabled={currentMobilePage === mobilePageCount - 1}
              className="min-h-11 rounded-full border border-rose-200 bg-white/70 px-4 text-xs text-[#956076] disabled:opacity-35"
            >
              Next →
            </button>
          </nav>
        )}
        {!loading && !reorderMode && desktopPageCount > 1 && (
          <nav aria-label="Album pages" className="mt-8 hidden sm:flex items-center justify-center gap-6">
            <button
              onClick={() => setDesktopPage(currentDesktopPage - 1)}
              disabled={currentDesktopPage === 0}
              className="min-h-11 rounded-full border border-rose-200 bg-white/70 px-5 text-sm text-[#956076] hover:bg-rose-50 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span aria-live="polite" className="text-sm text-[#956076]">{currentDesktopPage + 1} / {desktopPageCount}</span>
            <button
              onClick={() => setDesktopPage(currentDesktopPage + 1)}
              disabled={currentDesktopPage === desktopPageCount - 1}
              className="min-h-11 rounded-full border border-rose-200 bg-white/70 px-5 text-sm text-[#956076] hover:bg-rose-50 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
