import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export const GALLERY_CACHE_TAG = "gallery-data";

// Callers handle failures outside the cache so empty fallback galleries aren't cached.
export async function getCachedCollections() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag(GALLERY_CACHE_TAG);
  return prisma.collection.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { media: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] } },
  });
}

export async function getCachedCollection(slug: string) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag(GALLERY_CACHE_TAG);
  return prisma.collection.findUnique({
    where: { slug },
    include: { media: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] } },
  });
}
