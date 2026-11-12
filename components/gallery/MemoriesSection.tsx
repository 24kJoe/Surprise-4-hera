"use client";

import { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config/site";
import { getCollectionBySlug } from "@/lib/gallery/queries";
import PolaroidCard, { MediaItem } from "@/components/gallery/PolaroidCard";
import { Heart, Sparkles } from "lucide-react";
import styles from "./MemoriesSection.module.css";

export default function MemoriesSection() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
      
        const collection = await getCollectionBySlug("our-memories");
 
        const mediaList = ((collection as any)?.media as MediaItem[]) || [];

        setPhotos(mediaList);
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
    <section id="memories" className={styles.section}>
      <div aria-hidden="true" className={styles.decorations}>
        <Heart /><Heart /><Heart /><Heart /><Sparkles /><Sparkles />
      </div>
      <svg aria-hidden="true" className={styles.topWave} viewBox="0 0 1200 70" preserveAspectRatio="none"><path d="M0 60 Q100 -10 200 15 T400 12 T600 20 T800 15 T1000 20 T1200 55" /></svg>
      <div className={`section-inner ${styles.inner}`}>
        <div className={styles.heading}>
          <div aria-hidden="true" className={styles.bow}>♡<span>⌁</span></div>
          <div className={styles.eyebrow}><span />Our Memories<span /></div>
          <h2>Every little <em>moment,</em> kept</h2>
          <p><span>✦</span> A few snapshots of us. <span>✦</span></p>
        </div>

        {loading ? (
          <p>Loading memories...</p>
        ) : photos.length === 0 ? (
          <div className="text-center py-8 text-[#956076] font-serif italic">
            No memory items found in this collection yet.
          </div>
        ) : (
          <div className={styles.gallery}>
            {photos.map((photo, i) => (
              <PolaroidCard
                key={photo.id}
                photo={photo}
                tilt={[-2, 1.5, 1, -1.75, -1.25, 2][i % 6]}
                memoryStyle
                index={i}
              />
            ))}
          </div>
        )}

        {CONFIG.timeline.length > 0 && <div className="timeline">
          {CONFIG.timeline.map((item, i) => (
            <div className={`tl-item${openIdx.has(i) ? " open" : ""}`} key={i}>
              <button className="tl-date-btn" onClick={() => toggle(i)}>
                {item.date}
              </button>
              <div className="tl-reveal">{item.story}</div>
            </div>
          ))}
        </div>}
      </div>
      <svg aria-hidden="true" className={styles.bottomWave} viewBox="0 0 1200 70" preserveAspectRatio="none"><path d="M0 15 Q100 90 200 55 T400 58 T600 50 T800 55 T1000 50 T1200 20" /></svg>
    </section>
  );
}
