"use server";

import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function getCollectionBySlug(slug: string) {
  noStore();
  if (!slug) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      include: {
        media: {
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });
    return collection;
  } catch (error) {
    console.error(`Error fetching collection by slug [${slug}]:`, error);
    return null;
  }
}

export async function getImagesByCollectionSlug(slug: string) {
  noStore();
  if (!slug) return [];
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          where: { type: MediaType.IMAGE },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });
    return collection?.media || [];
  } catch (error) {
    console.error(`Error fetching images by collection slug [${slug}]:`, error);
    return [];
  }
}

export async function getVideosByCollectionSlug(slug: string) {
  noStore();
  if (!slug) return [];
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          where: { type: MediaType.VIDEO },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });
    return collection?.media || [];
  } catch (error) {
    console.error(`Error fetching videos by collection slug [${slug}]:`, error);
    return [];
  }
}

export async function getMediaByCollectionSlug(slug: string) {
  noStore();
  if (!slug) return { images: [], videos: [] };
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });

    const media = collection?.media || [];

    return {
      images: media.filter((item) => item.type === MediaType.IMAGE),
      videos: media.filter((item) => item.type === MediaType.VIDEO),
    };
  } catch (error) {
    console.error(`Error fetching media by collection slug [${slug}]:`, error);
    return { images: [], videos: [] };
  }
}

export async function getAllCollections() {
  noStore();
  try {
    return await prisma.collection.findMany({
      // Sorts the collections themselves by your custom order
      orderBy: [{ order: "asc" }, { createdAt: "desc" }], 
      include: {
        media: {
          orderBy: [{ order: "asc" }, { createdAt: "desc" }], 
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all collections:", error);
    return [];
  }
}