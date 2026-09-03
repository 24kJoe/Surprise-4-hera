"use server";

import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

export async function getCollectionBySlug(slug: string) {
  if (!slug) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      include: {
        media: {
          orderBy: { createdAt: "desc" },
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
  if (!slug) return [];
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          where: { type: MediaType.IMAGE },
          orderBy: { createdAt: "desc" },
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
  if (!slug) return [];
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          where: { type: MediaType.VIDEO },
          orderBy: { createdAt: "desc" },
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
  if (!slug) return { images: [], videos: [] };
  try {
    const decodedSlug = decodeURIComponent(slug);
    const collection = await prisma.collection.findUnique({
      where: { slug: decodedSlug },
      select: {
        media: {
          orderBy: { createdAt: "desc" },
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
  try {
    return await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        media: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all collections:", error);
    return [];
  }
}