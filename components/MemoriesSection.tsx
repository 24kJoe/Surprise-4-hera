"use client";

import { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { getCollectionBySlug } from "@/lib/get";
import PolaroidCard, { MediaItem } from "@/components/PolaroidCard";

export default function MemoriesSection() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());
  const [tilts, setTilts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
        // جلب الكولكشن الخاص بـ "our-memories" عن طريق الـ slug
        const collection = await getCollectionBySlug("our-memories");
        
        // استخدام as any لتفادي اعتراض TypeScript على حقل media المرفق
        const mediaList = ((collection as any)?.media as MediaItem[]) || [];

        setPhotos(mediaList);
        setTilts(mediaList.map(() => Math.random() * 6 - 3));
      } catch (error) {
        console.error("Failed to load memories collection:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMedia();
  }, []);

  function toggle(i: number) {
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section id="memories">
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow">Our Memories</div>
          <h2>Every little moment, kept</h2>
          <p>A few snapshots and the timeline of us. Click a date to relive it.</p>
        </div>

        {loading ? (
          <p>Loading memories...</p>
        ) : photos.length === 0 ? (
          <div className="text-center py-8 text-[var(--cream)]/60 font-serif italic">
            No memory items found in this collection yet.
          </div>
        ) : (
          <div className="gallery">
            {photos.map((photo, i) => (
              <PolaroidCard
                key={photo.id}
                photo={photo}
                tilt={tilts[i] || 0}
                index={i}
              />
            ))}
          </div>
        )}

        <div className="timeline">
          {CONFIG.timeline.map((item, i) => (
            <div className={`tl-item${openIdx.has(i) ? " open" : ""}`} key={i}>
              <button className="tl-date-btn" onClick={() => toggle(i)}>
                {item.date}
              </button>
              <div className="tl-reveal">{item.story}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}