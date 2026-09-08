"use client";

import React, { useState, useRef } from "react";
import { reorderMediaAction } from "@/lib/actions";

export default function InteractiveGalleryGrid({ initialMedia }: { initialMedia: any[] }) {
  const [mediaItems, setMediaItems] = useState(initialMedia);
  const [reorderMode, setReorderMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // NEW: State to track which media item is currently being viewed
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index;
    if (dragItemRef.current === null || dragOverItemRef.current === null) return;
    if (dragItemRef.current === dragOverItemRef.current) return;

    const items = [...mediaItems];
    const draggedItem = items.splice(dragItemRef.current, 1)[0];
    items.splice(dragOverItemRef.current, 0, draggedItem);

    dragItemRef.current = dragOverItemRef.current;
    setMediaItems(items);
  };

  const handleDragEnd = () => {
    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };

  const saveNewOrder = async () => {
    setIsSaving(true);
    const payload = mediaItems.map((item, idx) => ({ id: item.id, order: idx }));
    const res = await reorderMediaAction(payload);
    setIsSaving(false);

    if (res.success) {
      setReorderMode(false);
    } else {
      alert(res.error || "Failed to save order");
    }
  };

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--cream)]/50 font-serif italic">
        No memories have been added to this collection yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Reorder Toolbar */}
        <div className="flex justify-center sm:justify-end">
          {!reorderMode ? (
            <button
              onClick={() => setReorderMode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg)] text-[var(--cream)]/75 border border-[var(--line)] hover:border-[var(--cream)]/30 hover:text-[var(--cream)] transition-all cursor-pointer shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
              </svg>
              <span>Rearrange Photos</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--plum)]/30 border border-[var(--rose)]/30 p-3 px-5 rounded-2xl w-full sm:w-auto shadow-md">
              <div className="flex items-center gap-2 text-[var(--rose)] text-sm font-medium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-pulse">
                  <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
                </svg>
                <span>Drag photos to reorder</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setMediaItems(initialMedia);
                    setReorderMode(false);
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

        {/* Photo Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {mediaItems.map((item: any, idx: number) => {
            const isVideo = item.type === "VIDEO" || item.url?.match(/\.(mp4|webm|mov)$/i);
            const tilt = ((idx % 5) - 2) * 1.5;

            return (
              <div
                key={item.id || idx}
                draggable={reorderMode}
                onDragStart={() => reorderMode && handleDragStart(idx)}
                onDragEnter={() => reorderMode && handleDragEnter(idx)}
                onDragEnd={() => reorderMode && handleDragEnd()}
                onDragOver={(e) => e.preventDefault()}
                // NEW: Open the viewer when clicked (only if not currently reordering)
                onClick={() => !reorderMode && setSelectedMedia(item)}
                style={{ transform: `rotate(${tilt}deg)` }}
                className={`bg-[var(--paper)] p-3 pb-5 rounded-2xl border border-[var(--line)] shadow-md transition-all duration-300 flex flex-col justify-between w-64 ${
                  reorderMode
                    ? "cursor-grab active:cursor-grabbing hover:ring-2 ring-[var(--rose)]/50 scale-100 hover:scale-105 z-10"
                    // NEW: Added cursor-pointer here so it feels clickable
                    : "cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:rotate-0" 
                }`}
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/20 border border-[var(--line)] pointer-events-none">
                  {isVideo ? (
                    <video
                      src={item.url}
                      poster={item.thumbnailUrl || undefined}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || "Collection item"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Video Icon Indicator */}
                  {isVideo && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
                        <path d="M15.5 10.2 20 7.6a1 1 0 0 1 1.5.87v7.06a1 1 0 0 1-1.5.87l-4.5-2.6" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="pt-3 px-1 text-center flex flex-col items-center">
                  <p className="font-serif text-sm text-[var(--cream)] truncate w-full">
                    {item.caption || "A sweet moment"}
                  </p>
                  {reorderMode && (
                    <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/10 text-[10px] uppercase tracking-wider text-[var(--cream)]/50 font-semibold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                        <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
                      </svg>
                      Drag
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: Lightbox Modal for viewing media */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)} // Close when clicking the background
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-black/50 rounded-full transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the actual image from closing the modal
          >
            {selectedMedia.type === "VIDEO" || selectedMedia.url?.match(/\.(mp4|webm|mov)$/i) ? (
              <video 
                src={selectedMedia.url} 
                controls 
                autoPlay 
                playsInline
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl outline-none"
              />
            ) : (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.caption || "Expanded view"} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            )}
            
            {/* Display caption in the viewer if it exists */}
            {selectedMedia.caption && (
              <div className="mt-4 text-center text-white/90 font-serif text-lg tracking-wide">
                {selectedMedia.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}