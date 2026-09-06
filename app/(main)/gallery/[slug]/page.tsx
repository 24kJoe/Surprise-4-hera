import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug } from "@/lib/get";
import InteractiveGalleryGrid from "@/components/InteractiveGalleryGrid";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Back to Gallery Button */}
      <div className="mb-8 flex items-center justify-between border-b border-[var(--rose)]/15 pb-4">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 hover:bg-white/90 border border-[var(--rose)]/20 text-[var(--plum)] font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group backdrop-blur-sm"
        >
          <svg
            className="w-4 h-4 text-[var(--rose)] group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Gallery</span>
        </Link>
      </div>

      <header className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <span className="text-xs font-semibold tracking-[0.28em] text-[var(--gold-soft)] uppercase">
          Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--cream)]">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-sm sm:text-base text-[var(--cream)]/70">
            {collection.description}
          </p>
        )}
      </header>

      {/* Render the new interactive drag-and-drop grid component */}
      <InteractiveGalleryGrid initialMedia={collection.media || []} />
    </main>
  );
}