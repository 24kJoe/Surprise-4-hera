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

type ViewState = "GALLERY" | "COLLECTIONS" | "UPLOAD";

export default function AdminDashboardSidebar() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [activeView, setActiveView] = useState<ViewState>("GALLERY");

  // Multi-upload state
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      const items = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
      }));
      setPreviewItems((prev) => [...prev, ...items]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) {
      setColError("Title required");
      return;
    }
    setColError("");
    const formData = new FormData();
    formData.append("title", newColTitle);
    formData.append("description", newColDesc);

    startTransitionCol(async () => {
      const res = await createCollectionAction(formData);
      if (res.success) {
        setColSuccess("Created!");
        setNewColTitle("");
        setNewColDesc("");
        loadData();
        setTimeout(() => setColSuccess(""), 3000);
      } else {
        setColError(res.error || "Failed");
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
      }
    });
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Delete collection and all its items?")) return;
    setDeletingColId(id);
    const res = await deleteCollectionAction(id);
    setDeletingColId(null);
    if (res.success) loadData();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return setErrorMsg("Select a file");
    setErrorMsg("");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("caption", caption);
    formData.append("altText", altText);
    formData.append("collectionId", selectedCollectionId);

    startTransitionUpload(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success) {
        setSuccessMsg("Uploaded!");
        setFiles([]);
        setPreviewItems([]);
        setCaption("");
        setAltText("");
        setSelectedCollectionId("none");
        loadData();
        setTimeout(() => {
          setSuccessMsg("");
          setActiveView("GALLERY");
        }, 2000);
      } else {
        setErrorMsg(res.error || "Failed");
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
      }
    });
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Delete item?")) return;
    setDeletingId(id);
    const res = await deleteMediaAction(id);
    setDeletingId(null);
    if (res.success) setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredMedia =
    activeFilter === "all"
      ? mediaItems
      : activeFilter === "none"
      ? mediaItems.filter((item) => !item.collectionId)
      : mediaItems.filter((item) => item.collectionId === activeFilter);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--bg)] text-[var(--cream)] font-sans selection:bg-[var(--gold)] selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--paper)]/60 backdrop-blur-xl border-r border-[var(--line)] flex flex-col shrink-0">
        <div className="p-6 border-b border-[var(--line)]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--cream)]/60 hover:text-[var(--rose)] transition mb-6">
            <span>←</span> Back to Site
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[var(--cream)]">Dashboard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveView("GALLERY")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeView === "GALLERY" ? "bg-[var(--rose)] text-white shadow-md shadow-[var(--rose)]/20" : "text-[var(--cream)] hover:bg-[var(--bg)]"}`}>
            <span>🖼️</span> Media Gallery
          </button>
          <button onClick={() => setActiveView("COLLECTIONS")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeView === "COLLECTIONS" ? "bg-[var(--rose)] text-white shadow-md shadow-[var(--rose)]/20" : "text-[var(--cream)] hover:bg-[var(--bg)]"}`}>
            <span>📁</span> Collections
          </button>
          <button onClick={() => setActiveView("UPLOAD")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeView === "UPLOAD" ? "bg-[var(--rose)] text-white shadow-md shadow-[var(--rose)]/20" : "text-[var(--cream)] hover:bg-[var(--bg)]"}`}>
            <span>✨</span> Upload & Create
          </button>
        </nav>

        <div className="p-6 border-t border-[var(--line)] grid grid-cols-2 gap-2 text-center">
          <div className="bg-[var(--bg)] rounded-xl p-3 border border-[var(--line)]">
            <span className="block text-lg font-serif font-bold text-[var(--gold)]">{mediaItems.length}</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--cream)]/50">Media</span>
          </div>
          <div className="bg-[var(--bg)] rounded-xl p-3 border border-[var(--line)]">
            <span className="block text-lg font-serif font-bold text-[var(--gold)]">{collections.length}</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--cream)]/50">Folders</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* VIEW: GALLERY */}
            {activeView === "GALLERY" && (
              <motion.div key="gallery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-3xl font-serif font-bold">Media Library</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button onClick={() => setActiveFilter("all")} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${activeFilter === "all" ? "bg-[var(--cream)] text-[var(--bg)] border-[var(--cream)]" : "border-[var(--line)] hover:bg-[var(--paper)]"}`}>All</button>
                    <button onClick={() => setActiveFilter("none")} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${activeFilter === "none" ? "bg-[var(--cream)] text-[var(--bg)] border-[var(--cream)]" : "border-[var(--line)] hover:bg-[var(--paper)]"}`}>Unassigned</button>
                    {collections.map(c => (
                      <button key={c.id} onClick={() => setActiveFilter(c.id)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${activeFilter === c.id ? "bg-[var(--cream)] text-[var(--bg)] border-[var(--cream)]" : "border-[var(--line)] hover:bg-[var(--paper)]"}`}>{c.title}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <div key={item.id} className="group relative aspect-square bg-[var(--paper)] rounded-2xl overflow-hidden border border-[var(--line)]">
                      {item.type === "VIDEO" ? (
                        <video src={item.url} className="w-full h-full object-cover" muted loop playsInline onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
                      ) : (
                        <img src={item.url} alt="media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                        <p className="text-white text-xs font-medium truncate">{item.caption || "No caption"}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingMedia(item)} className="flex-1 bg-white/20 hover:bg-white/40 py-2 rounded-lg text-white text-xs font-bold transition">Edit</button>
                          <button onClick={() => handleDeleteMedia(item.id)} className="flex-1 bg-red-500/80 hover:bg-red-500 py-2 rounded-lg text-white text-xs font-bold transition">Del</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: COLLECTIONS */}
            {activeView === "COLLECTIONS" && (
              <motion.div key="collections" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-serif font-bold mb-8">Manage Collections</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {collections.map((col) => (
                    <div key={col.id} className="bg-[var(--paper)] p-6 rounded-3xl border border-[var(--line)] flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-xl font-bold">{col.title}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingCollection(col)} className="text-amber-400 hover:text-amber-300 text-sm">Edit</button>
                          <button onClick={() => handleDeleteCollection(col.id)} className="text-rose-500 hover:text-rose-400 text-sm">Delete</button>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--cream)]/60 mb-6 flex-1">{col.description || "No description."}</p>
                      <div className="pt-4 border-t border-[var(--line)] flex justify-between items-center text-xs">
                        <span className="font-bold text-[var(--rose)]">{col.media?.length || 0} Items</span>
                        <span className="text-[var(--cream)]/40">{new Date(col.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: UPLOAD & CREATE */}
            {activeView === "UPLOAD" && (
              <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                
                {/* Upload Panel */}
                <div className="bg-[var(--paper)] p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-xl">
                  <h2 className="text-2xl font-serif font-bold mb-6">Upload Files</h2>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--line)] rounded-2xl hover:bg-[var(--rose)]/5 hover:border-[var(--rose)] transition cursor-pointer bg-[var(--bg)]/50">
                      <span className="text-3xl mb-2">📁</span>
                      <span className="text-sm font-semibold">Click to select files</span>
                      <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="hidden" />
                    </label>

                    {previewItems.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {previewItems.map((item, i) => (
                          <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[var(--line)]">
                            {item.isVideo ? <video src={item.url} className="w-full h-full object-cover"/> : <img src={item.url} className="w-full h-full object-cover"/>}
                            <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[10px]">✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      <select value={selectedCollectionId} onChange={e => setSelectedCollectionId(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm">
                        <option value="none">No Collection</option>
                        {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                      <input type="text" placeholder="Caption..." value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm" />
                      <input type="text" placeholder="Alt Text..." value={altText} onChange={e => setAltText(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm" />
                    </div>

                    <button type="submit" disabled={isPendingUpload || files.length === 0} className="w-full py-4 rounded-xl bg-[var(--rose)] text-white font-bold disabled:opacity-50 hover:bg-[var(--rose-dim)] transition">
                      {isPendingUpload ? "Uploading..." : "Upload Selected Media"}
                    </button>
                  </form>
                </div>

                {/* Create Collection Panel */}
                <div className="bg-[var(--paper)] p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-xl">
                  <h2 className="text-2xl font-serif font-bold mb-6">Create New Collection</h2>
                  <form onSubmit={handleCreateCollection} className="space-y-4">
                    <input type="text" placeholder="Collection Title" value={newColTitle} onChange={e => setNewColTitle(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm" />
                    <textarea placeholder="Description" rows={3} value={newColDesc} onChange={e => setNewColDesc(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm resize-none" />
                    <button type="submit" disabled={isPendingCol || !newColTitle} className="w-full py-4 rounded-xl bg-[var(--cream)] text-[var(--bg)] font-bold disabled:opacity-50 hover:bg-white transition">
                      {isPendingCol ? "Creating..." : "Create Collection"}
                    </button>
                  </form>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Editing Modals (Same implementation, simplified container) */}
      {editingCollection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg)] rounded-3xl p-6 w-full max-w-md border border-[var(--line)]">
            <h3 className="text-xl font-bold mb-4">Edit Collection</h3>
            <input type="text" value={editingCollection.title} onChange={e => setEditingCollection({...editingCollection, title: e.target.value})} className="w-full p-3 mb-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]" />
            <textarea value={editingCollection.description || ""} onChange={e => setEditingCollection({...editingCollection, description: e.target.value})} className="w-full p-3 mb-4 rounded-xl bg-[var(--paper)] border border-[var(--line)]" />
            <div className="flex gap-2">
              <button onClick={() => setEditingCollection(null)} className="flex-1 py-3 rounded-xl bg-[var(--paper)] font-bold">Cancel</button>
              <button onClick={handleUpdateCollection} className="flex-1 py-3 rounded-xl bg-[var(--rose)] text-white font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg)] rounded-3xl p-6 w-full max-w-md border border-[var(--line)]">
            <h3 className="text-xl font-bold mb-4">Edit Media</h3>
            <select value={editingMedia.collectionId || "none"} onChange={e => setEditingMedia({...editingMedia, collectionId: e.target.value})} className="w-full p-3 mb-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]">
              <option value="none">No Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input type="text" value={editingMedia.caption || ""} onChange={e => setEditingMedia({...editingMedia, caption: e.target.value})} className="w-full p-3 mb-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]" />
            <div className="flex gap-2">
              <button onClick={() => setEditingMedia(null)} className="flex-1 py-3 rounded-xl bg-[var(--paper)] font-bold">Cancel</button>
              <button onClick={handleUpdateMedia} className="flex-1 py-3 rounded-xl bg-[var(--rose)] text-white font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}