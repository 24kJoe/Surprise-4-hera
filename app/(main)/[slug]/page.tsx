"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import PolaroidCard, { MediaItem } from "@/components/PolaroidCard";
import { getCollectionBySlug } from "@/lib/get";

interface CollectionData {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  media: MediaItem[];
}

// -------------------------------------------------------------
// Main Collection Page Component
// -------------------------------------------------------------
export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tilts, setTilts] = useState<number[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCollectionBySlug(slug);
        if (!data) {
          setIsNotFound(true);
        } else {
          
          const collectionData = data as unknown as CollectionData;
          setCollection(collectionData);

          // Generate random tilt angles for polaroid cards
          setTilts((collectionData.media || []).map(() => Math.random() * 8 - 4));
        }
      } catch (error) {
        console.error("Error loading collection details:", error);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (isNotFound) {
    notFound();
  }
  const filteredMedia = collection?.media?.filter((item) => {
    if (activeFilter === "IMAGE") return item.type === "IMAGE";
    if (activeFilter === "VIDEO") return item.type === "VIDEO";
    return true;
  }) || [];

  const imageCount = collection?.media?.filter((item) => item.type === "IMAGE").length || 0;
  const videoCount = collection?.media?.filter((item) => item.type === "VIDEO").length || 0;

  return (
    <section id="collection-page" className="pt-[clamp(100px,26vw,140px)] pb-16">
      <div className="section-inner">
        {loading ? (
          <div className="text-center py-20 text-[var(--gold-soft)] font-serif italic text-lg animate-pulse">
            Loading collection...
          </div>
        ) : collection ? (
          <>
            {/* Header Section */}
            <header className="section-head text-center max-w-2xl mx-auto mb-10">
              <span className="eyebrow block mb-2 text-xs font-semibold tracking-[0.28em] text-[var(--gold-soft)] uppercase">
                Collection
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif text-[var(--cream)] font-bold tracking-tight">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-[var(--cream)]/75 text-sm sm:text-base leading-relaxed mt-3">
                  {collection.description}
                </p>
              )}

              {/* فلتر التنقل بين الصور والفيديوهات (يظهر في حال وجود كلا النوعين) */}
              {imageCount > 0 && videoCount > 0 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setActiveFilter("ALL")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeFilter === "ALL"
                        ? "bg-[var(--gold-soft)] text-black shadow"
                        : "bg-white/10 text-[var(--cream)] hover:bg-white/20"
                    }`}
                  >
                    All ({collection.media.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("IMAGE")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeFilter === "IMAGE"
                        ? "bg-[var(--gold-soft)] text-black shadow"
                        : "bg-white/10 text-[var(--cream)] hover:bg-white/20"
                    }`}
                  >
                    Photos ({imageCount})
                  </button>
                  <button
                    onClick={() => setActiveFilter("VIDEO")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeFilter === "VIDEO"
                        ? "bg-[var(--gold-soft)] text-black shadow"
                        : "bg-white/10 text-[var(--cream)] hover:bg-white/20"
                    }`}
                  >
                    Videos ({videoCount})
                  </button>
                </div>
              )}
            </header>

            {/* Media Gallery Grid */}
            {filteredMedia.length === 0 ? (
              <div className="text-center py-20 text-[var(--cream)]/60 font-serif italic text-base sm:text-lg">
                No items found in this category.
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
              >
                {filteredMedia.map((mediaItem, i) => (
                  <PolaroidCard
                    key={mediaItem.id}
                    photo={mediaItem}
                    tilt={tilts[i] || 0}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}