"use server";

import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

/**
 * جلب كولكشن كامل بالـ slug مع كل الميديا الخاصة به
 */
export async function getCollectionBySlug(slug: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
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

/**
 * جلب الصور فقط الخاصة بكولكشن معين
 */
export async function getImagesByCollectionSlug(slug: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
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

/**
 * جلب الفيديوهات فقط الخاصة بكولكشن معين
 */
export async function getVideosByCollectionSlug(slug: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
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

/**
 * جلب الميديا مقسمة إلى صور وفيديوهات في أوبجيكت واحد
 */
export async function getMediaByCollectionSlug(slug: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
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

/**
 * جلب جميع الكولكشنز مع أحدث صورة وأحدث فيديو لكل كولكشن (معاينة)
 */
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