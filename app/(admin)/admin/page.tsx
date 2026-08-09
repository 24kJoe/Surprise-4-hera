"use client";

import React, { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  uploadMediaAction,
  updateMediaAction,
  deleteMediaAction,
  getMediaItems,
  getCollections,
  createCollectionAction,
  updateCollectionAction,
  deleteCollectionAction,
} from "@/lib/actions";

export type MediaType = "IMAGE" | "VIDEO";

interface CollectionItem {
  id: string;
  title: string;
  description?: string | null;
  media?: any[];
  createdAt: Date;
}

interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  publicId?: string | null;
  caption?: string | null;
  altText?: string | null;
  thumbnailUrl?: string | null;
  collectionId?: string | null;
  collection?: CollectionItem | null;
  createdAt: Date;
}

export default function AdminDashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  // Multi-upload state (Images & Videos)
  const [files, setFiles] = useState<File[]>([]);
  const [previewItems, setPreviewItems] = useState<{ url: string; isVideo: boolean }[]>([]);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("none");

  // Collection form state
  const [newColTitle, setNewColTitle] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [colError, setColError] = useState("");
  const [colSuccess, setColSuccess] = useState("");

  // Edit Modals state
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  // Status & Filter state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [isPendingUpload, startTransitionUpload] = useTransition();
  const [isPendingCol, startTransitionCol] = useTransition();
  const [isPendingEdit, startTransitionEdit] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingColId, setDeletingColId] = useState<string | null>(null);

  const loadData = async () => {
    const [mediaData, collectionsData] = await Promise.all([
      getMediaItems(),
      getCollections(),
    ]);
    setMediaItems(mediaData as MediaItem[]);
    setCollections(collectionsData as CollectionItem[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle multiple file selection (Images & Videos)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const items = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
      }));
      setPreviewItems(items);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) {
      setColError("Collection title is required");
      return;
    }

    setColError("");
    setColSuccess("");

    const formData = new FormData();
    formData.append("title", newColTitle);
    formData.append("description", newColDesc);

    startTransitionCol(async () => {
      const res = await createCollectionAction(formData);
      if (res.success) {
        setColSuccess("Collection created successfully! ✨");
        setNewColTitle("");
        setNewColDesc("");
        loadData();
      } else {
        setColError(res.error || "Failed to create collection");
      }
    });
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;

    const formData = new FormData();
    formData.append("id", editingCollection.id);
    formData.append("title", editingCollection.title);
    formData.append("description", editingCollection.description || "");

    startTransitionEdit(async () => {
      const res = await updateCollectionAction(formData);
      if (res.success) {
        setEditingCollection(null);
        loadData();
      } else {
        alert(res.error || "Failed to update collection");
      }
    });
  };

  const handleDeleteCollection = async (id: string) => {
    if (
      !confirm(
        "Deleting this collection will also delete all associated photos & videos! Are you sure?"
      )
    )
      return;

    setDeletingColId(id);
    const res = await deleteCollectionAction(id);
    setDeletingColId(null);

    if (res.success) {
      loadData();
    } else {
      alert(res.error || "Failed to delete collection");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMsg("Please select at least one file to upload");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("caption", caption);
    formData.append("altText", altText);
    formData.append("collectionId", selectedCollectionId);

    startTransitionUpload(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success) {
        setSuccessMsg("Media uploaded successfully! ✨");
        setFiles([]);
        setPreviewItems([]);
        setCaption("");
        setAltText("");
        setSelectedCollectionId("none");
        loadData();
      } else {
        setErrorMsg(res.error || "Failed to upload media");
      }
    });
  };

  const handleUpdateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    const formData = new FormData();
    formData.append("id", editingMedia.id);
    formData.append("caption", editingMedia.caption || "");
    formData.append("altText", editingMedia.altText || "");
    formData.append("collectionId", editingMedia.collectionId || "none");

    startTransitionEdit(async () => {
      const res = await updateMediaAction(formData);
      if (res.success) {
        setEditingMedia(null);
        loadData();
      } else {
        alert(res.error || "Failed to update media item");
      }
    });
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    setDeletingId(id);
    const res = await deleteMediaAction(id);
    setDeletingId(null);

    if (res.success) {
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(res.error || "Failed to delete media item");
    }
  };

  const filteredMedia =
    activeFilter === "all"
      ? mediaItems
      : activeFilter === "none"
      ? mediaItems.filter((item) => !item.collectionId)
      : mediaItems.filter((item) => item.collectionId === activeFilter);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--cream)] p-4 sm:p-8 font-sans selection:bg-[var(--gold)] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--line)]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-[var(--paper)]/80 hover:bg-[var(--paper)] border border-[var(--line)] text-[var(--cream)] hover:text-[var(--rose)] transition-all shadow-sm flex items-center justify-center group"
              title="Back to Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </Link>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-soft)] block">
                Admin Control Panel
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--cream)] mt-1">
                Manage Collections & Media
              </h1>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-[var(--paper)]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[var(--line)] shadow-sm text-xs font-semibold text-[var(--rose)]">
              Collections: {collections.length}
            </div>
            <div className="bg-[var(--paper)]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[var(--line)] shadow-sm text-xs font-semibold text-[var(--rose)]">
              Total Media: {mediaItems.length}
            </div>
          </div>
        </header>

        {/* Create & Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Create Collection */}
          <section className="lg:col-span-1 bg-[var(--paper)]/70 backdrop-blur-md rounded-3xl p-6 border border-[var(--line)] shadow-lg shadow-[var(--rose)]/5 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                Add New Collection
              </h2>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--cream)]/80 mb-1.5">
                    Collection Title
                  </label>
                  <input
                    type="text"
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    placeholder="e.g. Summer Trip"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] focus:ring-2 focus:ring-[var(--rose)]/20 text-sm transition text-[var(--cream)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--cream)]/80 mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newColDesc}
                    onChange={(e) => setNewColDesc(e.target.value)}
                    placeholder="Short summary of memories..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] focus:ring-2 focus:ring-[var(--rose)]/20 text-sm transition resize-none text-[var(--cream)]"
                  />
                </div>

                {colError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
                    {colError}
                  </div>
                )}
                {colSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
                    {colSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPendingCol || !newColTitle.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--cream)] hover:bg-[var(--ink)] disabled:opacity-50 text-white font-semibold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPendingCol ? "Creating..." : "+ Create Collection"}
                </button>
              </form>
            </div>
          </section>

          {/* 2. Upload Media (Photos & Videos) */}
          <section className="lg:col-span-2 bg-[var(--paper)]/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[var(--line)] shadow-lg shadow-[var(--rose)]/5">
            <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
              Upload New Media (Photos & Videos)
            </h2>

            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--line)] rounded-2xl p-4 transition-all hover:border-[var(--rose)] bg-[var(--paper)]/50 relative overflow-hidden group min-h-[220px]">
                {previewItems.length > 0 ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="grid grid-cols-2 gap-2 w-full max-h-40 overflow-y-auto p-1">
                      {previewItems.map((item, idx) => (
                        <div key={idx} className="relative h-20 w-full overflow-hidden rounded-lg border border-[var(--line)] bg-black/20">
                          {item.isVideo ? (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                          {item.isVideo && (
                            <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                              Video
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFiles([]);
                        setPreviewItems([]);
                      }}
                      className="mt-3 bg-rose-500 text-white rounded-full px-3 py-1 text-xs hover:bg-rose-600 transition shadow-md"
                    >
                      ✕ Clear All ({files.length})
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--plum)] flex items-center justify-center text-xl text-[var(--rose)] mb-2 group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <span className="text-xs font-semibold text-[var(--cream)]">
                      Select photos or videos
                    </span>
                    <span className="text-[10px] text-[var(--cream)]/50 mt-1">
                      PNG, JPG, WEBP, MP4, MOV (Multiple allowed)
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--cream)]/80 mb-1">
                      Select Collection
                    </label>
                    <select
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-xs transition text-[var(--cream)]"
                    >
                      <option value="none">General (Unassigned)</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--cream)]/80 mb-1">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Special moment"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-xs transition text-[var(--cream)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--cream)]/80 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Short description"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-xs transition text-[var(--cream)]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPendingUpload || files.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--rose)] hover:bg-[var(--rose-dim)] disabled:opacity-50 text-white font-semibold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPendingUpload
                    ? "Uploading..."
                    : `Upload ${files.length > 0 ? files.length : ""} Item${files.length > 1 ? "s" : ""}`}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Active Collections */}
        {collections.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
              Active Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="bg-[var(--paper)] p-4 rounded-2xl border border-[var(--line)] shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--cream)] flex items-center gap-2">
                      {col.title}
                    </h3>
                    <p className="text-[11px] text-[var(--cream)]/60 mt-0.5 line-clamp-1">
                      {col.description || `${col.media?.length || 0} items`}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingCollection(col)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition text-xs border border-amber-100 cursor-pointer"
                      title="Edit Collection"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(col.id)}
                      disabled={deletingColId === col.id}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition text-xs border border-rose-100 cursor-pointer"
                      title="Delete Collection"
                    >
                      {deletingColId === col.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Gallery & Filters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold flex items-center gap-2">
              Media Gallery
            </h2>

            {/* Gallery Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[var(--rose)] text-white"
                    : "bg-[var(--paper)] text-[var(--cream)]/70 hover:bg-[var(--paper)]/80 border border-[var(--line)]"
                }`}
              >
                All ({mediaItems.length})
              </button>
              <button
                onClick={() => setActiveFilter("none")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "none"
                    ? "bg-[var(--rose)] text-white"
                    : "bg-[var(--paper)] text-[var(--cream)]/70 hover:bg-[var(--paper)]/80 border border-[var(--line)]"
                }`}
              >
                Unassigned
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setActiveFilter(col.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeFilter === col.id
                      ? "bg-[var(--rose)] text-white"
                      : "bg-[var(--paper)] text-[var(--cream)]/70 hover:bg-[var(--paper)]/80 border border-[var(--line)]"
                  }`}
                >
                  {col.title} ({col.media?.length || 0})
                </button>
              ))}
            </div>
          </div>

          {filteredMedia.length === 0 ? (
            <div className="text-center py-16 bg-[var(--paper)]/50 rounded-3xl border border-dashed border-[var(--line)]">
              <p className="text-sm text-[var(--cream)]/60">
                No media items found in this section.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredMedia.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--paper)] rounded-2xl overflow-hidden border border-[var(--line)] shadow-sm hover:shadow-md transition group flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                      {item.type === "VIDEO" ? (
                        <video
                          src={item.url}
                          poster={item.thumbnailUrl || undefined}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.altText || "Image"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Video Indicator Badge */}
                      {item.type === "VIDEO" && (
                        <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-sans">
                          🎥 Video
                        </span>
                      )}

                      {item.collection && (
                        <span className="absolute top-2 left-2 bg-[var(--paper)]/90 backdrop-blur-md text-[var(--rose)] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[var(--line)] shadow-sm">
                          {item.collection.title}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--cream)] line-clamp-2">
                          {item.caption || "No Caption"}
                        </p>
                        <span className="text-[10px] text-[var(--cream)]/50 block mt-1">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setEditingMedia(item)}
                          className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition border border-amber-200/60 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          disabled={deletingId === item.id}
                          className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition border border-rose-200/60 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {deletingId === item.id ? "..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Edit Collection Modal */}
        {editingCollection && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--paper)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl border border-[var(--line)] text-[var(--cream)]"
            >
              <h3 className="text-lg font-bold">Edit Collection</h3>
              <form onSubmit={handleUpdateCollection} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCollection.title}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-[var(--rose)] bg-[var(--paper)] text-[var(--cream)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingCollection.description || ""}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-[var(--rose)] resize-none bg-[var(--paper)] text-[var(--cream)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCollection(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPendingEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] cursor-pointer"
                  >
                    {isPendingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Media Modal */}
        {editingMedia && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--paper)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl border border-[var(--line)] text-[var(--cream)]"
            >
              <h3 className="text-lg font-bold">Edit Media Details</h3>
              <form onSubmit={handleUpdateMedia} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Collection</label>
                  <select
                    value={editingMedia.collectionId || "none"}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        collectionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-[var(--rose)] bg-[var(--paper)] text-[var(--cream)]"
                  >
                    <option value="none">General (Unassigned)</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Caption</label>
                  <input
                    type="text"
                    value={editingMedia.caption || ""}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, caption: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-[var(--rose)] bg-[var(--paper)] text-[var(--cream)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={editingMedia.altText || ""}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, altText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-[var(--rose)] bg-[var(--paper)] text-[var(--cream)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingMedia(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPendingEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] cursor-pointer"
                  >
                    {isPendingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}