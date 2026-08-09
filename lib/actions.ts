"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MediaType } from "@prisma/client";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
  let baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) {
    baseSlug = `collection-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.collection.findUnique({
      where: { slug },
    });

    if (!existing || (currentId && existing.id === currentId)) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// --- Collections Actions ---

export async function getCollections() {
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
    console.error("Error fetching collections:", error);
    return [];
  }
}

export async function createCollectionAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !title.trim()) {
      return { success: false, error: "Collection title is required" };
    }

    const slug = await generateUniqueSlug(title);

    const newCollection = await prisma.collection.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        slug,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: newCollection };
  } catch (error: any) {
    console.error("Collection creation error:", error);
    return { success: false, error: error.message || "An error occurred while creating the collection" };
  }
}

export async function updateCollectionAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!id) return { success: false, error: "Collection ID is missing" };
    if (!title || !title.trim()) return { success: false, error: "Collection title is required" };

    const slug = await generateUniqueSlug(title, id);

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        slug,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Update collection error:", error);
    return { success: false, error: error.message || "An error occurred while updating the collection" };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      where: { collectionId },
    });

    for (const item of mediaItems) {
      if (item.publicId) {
        const resourceType = item.type === MediaType.VIDEO ? "video" : "image";
        await cloudinary.uploader.destroy(item.publicId, { resource_type: resourceType });
      }
    }

    await prisma.collection.delete({
      where: { id: collectionId },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete collection error:", error);
    return { success: false, error: error.message || "An error occurred while deleting the collection" };
  }
}

// --- Media Actions ---

export async function getMediaItems() {
  try {
    return await prisma.mediaItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { collection: true },
    });
  } catch (error) {
    console.error("Error fetching media items:", error);
    return [];
  }
}

export async function uploadMediaAction(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string;
    const altText = formData.get("altText") as string;
    const collectionId = formData.get("collectionId") as string;

    if (!files || files.length === 0 || (files.length === 1 && files[0].size === 0)) {
      return { success: false, error: "Please select at least one file to upload" };
    }

    const createdMedia = [];

    for (const file of files) {
      if (file.size === 0) continue;

      const isVideo = file.type.startsWith("video/");
      const mediaType = isVideo ? MediaType.VIDEO : MediaType.IMAGE;

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
        width?: number;
        height?: number;
        bytes?: number;
        format?: string;
        duration?: number;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "surprise_app",
            resource_type: isVideo ? "video" : "image",
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });

      const savedMedia = await prisma.mediaItem.create({
        data: {
          type: mediaType,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width || null,
          height: uploadResult.height || null,
          size: uploadResult.bytes || null,
          duration: uploadResult.duration || null,
          mimeType: file.type || `${isVideo ? "video" : "image"}/${uploadResult.format}`,
          altText: altText || null,
          caption: caption || null,
          collectionId: collectionId && collectionId !== "none" ? collectionId : null,
        },
      });

      createdMedia.push(savedMedia);
    }

    revalidatePath("/admin");
    return { success: true, data: createdMedia };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "An error occurred during upload" };
  }
}

export async function updateMediaAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const caption = formData.get("caption") as string;
    const altText = formData.get("altText") as string;
    const collectionId = formData.get("collectionId") as string;

    if (!id) return { success: false, error: "Media ID is missing" };

    const updatedMedia = await prisma.mediaItem.update({
      where: { id },
      data: {
        caption: caption || null,
        altText: altText || null,
        collectionId: collectionId && collectionId !== "none" ? collectionId : null,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: updatedMedia };
  } catch (error: any) {
    console.error("Update media error:", error);
    return { success: false, error: error.message || "An error occurred while updating media details" };
  }
}

export async function deleteMediaAction(mediaId: string) {
  try {
    const media = await prisma.mediaItem.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return { success: false, error: "Media item not found" };
    }

    if (media.publicId) {
      const resourceType = media.type === MediaType.VIDEO ? "video" : "image";
      await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
    }

    await prisma.mediaItem.delete({
      where: { id: mediaId },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "An error occurred while deleting the media item" };
  }
}