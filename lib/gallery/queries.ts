"use server";

import { MediaType } from "@prisma/client";
import { prisma } from "@/lib/services/prisma";

export async function getCollectionBySlug(slug: string) {
  if (!slug) return null;
  try {
    return await prisma.collection.findUnique({
      where: { slug: decodeURIComponent(slug) },
      include: { media: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] } },
    });
  } catch (error) {
    console.error(`Error fetching collection by slug [${slug}]:`, error);
    return null;
  }
}

export async function getImagesByCollectionSlug(slug: string) {
  const collection = await getCollectionBySlug(slug);
  return collection?.media.filter((item) => item.type === MediaType.IMAGE) || [];
}

export async function getVideosByCollectionSlug(slug: string) {
  const collection = await getCollectionBySlug(slug);
  return collection?.media.filter((item) => item.type === MediaType.VIDEO) || [];
}

export async function getMediaByCollectionSlug(slug: string) {
  const collection = await getCollectionBySlug(slug);
  const media = collection?.media || [];
  return {
    images: media.filter((item) => item.type === MediaType.IMAGE),
    videos: media.filter((item) => item.type === MediaType.VIDEO),
  };
}

export async function getAllCollections() {
  try {
    return await prisma.collection.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { media: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] } },
    });
  } catch (error) {
    console.error("Error fetching all collections:", error);
    return [];
  }
}

// The home page only needs one cover and a count, not every album item.
export async function getAlbumSummaries() {
  try {
    return await prisma.collection.findMany({
      where: { OR: [{ slug: null }, { slug: { not: "our-memories" } }] },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        media: {
          take: 1,
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
        _count: { select: { media: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching album summaries:", error);
    return [];
  }
}
