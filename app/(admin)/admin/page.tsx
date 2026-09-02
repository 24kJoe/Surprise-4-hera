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
      <aside className="w-full md:w-64 bg-[var(--paper)]/80 backdrop-blur-xl border-r border-[var(--line)] flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10">
        <div className="p-6 border-b border-[var(--line)]/50">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--cream)]/60 hover:text-[var(--rose)] transition mb-6 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Site
          </Link>
          <h1 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--cream)] to-[var(--cream)]/60">
            Workspace
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveView("GALLERY")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${activeView === "GALLERY" ? "bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dim)] text-white shadow-lg shadow-[var(--rose)]/20 border border-[var(--rose)]/50" : "text-[var(--cream)]/70 hover:bg-[var(--bg)] border border-transparent hover:border-[var(--line)]"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Media Gallery
          </button>
          <button onClick={() => setActiveView("COLLECTIONS")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${activeView === "COLLECTIONS" ? "bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dim)] text-white shadow-lg shadow-[var(--rose)]/20 border border-[var(--rose)]/50" : "text-[var(--cream)]/70 hover:bg-[var(--bg)] border border-transparent hover:border-[var(--line)]"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Collections
          </button>
          <button onClick={() => setActiveView("UPLOAD")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${activeView === "UPLOAD" ? "bg-gradient-to-r from-[var(--rose)] to-[var(--rose-dim)] text-white shadow-lg shadow-[var(--rose)]/20 border border-[var(--rose)]/50" : "text-[var(--cream)]/70 hover:bg-[var(--bg)] border border-transparent hover:border-[var(--line)]"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload & Create
          </button>
        </nav>

        <div className="p-6 border-t border-[var(--line)]/50 grid grid-cols-2 gap-3 text-center">
          <div className="bg-[var(--bg)]/50 rounded-xl p-3 border border-[var(--line)] shadow-inner">
            <span className="block text-xl font-serif font-bold text-[var(--gold)]">{mediaItems.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--cream)]/50 font-semibold mt-1 block">Media</span>
          </div>
          <div className="bg-[var(--bg)]/50 rounded-xl p-3 border border-[var(--line)] shadow-inner">
            <span className="block text-xl font-serif font-bold text-[var(--gold)]">{collections.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--cream)]/50 font-semibold mt-1 block">Folders</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* VIEW: GALLERY */}
            {activeView === "GALLERY" && (
              <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--line)]/50">
                  <div>
                    <h2 className="text-3xl font-serif font-bold">Media Library</h2>
                    <p className="text-sm text-[var(--cream)]/60 mt-2">Manage and organize all uploaded photos and videos.</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide bg-[var(--paper)]/30 backdrop-blur-md p-1.5 rounded-2xl border border-[var(--line)]">
                    <button onClick={() => setActiveFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === "all" ? "bg-[var(--rose)] text-white shadow-md" : "text-[var(--cream)]/70 hover:bg-[var(--paper)]"}`}>All</button>
                    <button onClick={() => setActiveFilter("none")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === "none" ? "bg-[var(--rose)] text-white shadow-md" : "text-[var(--cream)]/70 hover:bg-[var(--paper)]"}`}>Unassigned</button>
                    {collections.map(c => (
                      <button key={c.id} onClick={() => setActiveFilter(c.id)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === c.id ? "bg-[var(--rose)] text-white shadow-md" : "text-[var(--cream)]/70 hover:bg-[var(--paper)]"}`}>{c.title}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredMedia.map((item) => (
                    <div key={item.id} className="group relative aspect-square bg-[var(--paper)]/50 rounded-2xl overflow-hidden border border-[var(--line)] shadow-sm">
                      {item.type === "VIDEO" ? (
                        <video src={item.url} className="w-full h-full object-cover" muted loop playsInline onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
                      ) : (
                        <img src={item.url} alt="media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                      
                      {item.type === "VIDEO" && (
                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] tracking-wider font-bold px-2 py-1 rounded-lg">VIDEO</span>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                        <p className="text-white text-xs font-medium truncate mb-3">{item.caption || "No caption"}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingMedia(item)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-xl text-white text-xs font-bold transition flex justify-center items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMedia(item.id)} className="flex-1 bg-rose-500/80 hover:bg-rose-500 backdrop-blur-md py-2 rounded-xl text-white text-xs font-bold transition flex justify-center items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: COLLECTIONS */}
            {activeView === "COLLECTIONS" && (
              <motion.div key="collections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="pb-6 border-b border-[var(--line)]/50">
                  <h2 className="text-3xl font-serif font-bold">Manage Collections</h2>
                  <p className="text-sm text-[var(--cream)]/60 mt-2">Organize your media into thematic folders.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {collections.map((col) => (
                    <div key={col.id} className="bg-gradient-to-b from-[var(--paper)]/80 to-[var(--paper)]/40 backdrop-blur-xl p-6 rounded-3xl border border-[var(--line)] shadow-lg hover:shadow-xl transition-all flex flex-col group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--bg)]/50 rounded-2xl border border-[var(--line)]">
                          <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingCollection(col)} className="p-2 bg-[var(--bg)] hover:text-amber-400 rounded-xl transition border border-[var(--line)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDeleteCollection(col.id)} className="p-2 bg-[var(--bg)] hover:text-rose-400 rounded-xl transition border border-[var(--line)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-2">{col.title}</h3>
                      <p className="text-xs text-[var(--cream)]/60 mb-6 flex-1 line-clamp-3">{col.description || "No description."}</p>
                      <div className="pt-4 border-t border-[var(--line)]/50 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-[var(--rose)] tracking-widest">{col.media?.length || 0} Items</span>
                        <span className="text-[10px] text-[var(--cream)]/40 font-medium">{new Date(col.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: UPLOAD & CREATE */}
            {activeView === "UPLOAD" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="pb-6 border-b border-[var(--line)]/50">
                  <h2 className="text-3xl font-serif font-bold">Workspace</h2>
                  <p className="text-sm text-[var(--cream)]/60 mt-2">Upload new media files and create new collections here.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Upload Panel */}
                  <div className="lg:col-span-2 bg-gradient-to-b from-[var(--paper)]/80 to-[var(--paper)]/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[var(--rose)]/10 rounded-xl text-[var(--rose)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                      </div>
                      <h2 className="text-xl font-serif font-bold">Upload Files</h2>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-6">
                      <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-[var(--line)] rounded-2xl hover:bg-[var(--rose)]/5 hover:border-[var(--rose)]/50 transition-all cursor-pointer bg-[var(--bg)]/30 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 text-[var(--cream)]/40 group-hover:text-[var(--rose)] transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                          <p className="text-sm font-semibold text-[var(--cream)]/80">Click to browse files</p>
                        </div>
                        <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="hidden" />
                      </label>

                      {previewItems.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                          {previewItems.map((item, i) => (
                            <div key={i} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-[var(--line)] snap-start group">
                              {item.isVideo ? <video src={item.url} className="w-full h-full object-cover"/> : <img src={item.url} className="w-full h-full object-cover"/>}
                              <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 bg-[var(--bg)]/30 p-5 rounded-2xl border border-[var(--line)]/50">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--cream)]/60 mb-1.5">Collection</label>
                          <select value={selectedCollectionId} onChange={e => setSelectedCollectionId(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm appearance-none">
                            <option value="none">No Collection</option>
                            {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--cream)]/60 mb-1.5">Caption</label>
                          <input type="text" placeholder="Write a memory..." value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--cream)]/60 mb-1.5">Alt Text</label>
                          <input type="text" placeholder="Accessibility text..." value={altText} onChange={e => setAltText(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm" />
                        </div>
                      </div>

                      <button type="submit" disabled={isPendingUpload || files.length === 0} className="w-full py-4 rounded-xl bg-[var(--rose)] text-white font-bold text-sm disabled:opacity-50 hover:bg-[var(--rose-dim)] transition shadow-lg shadow-[var(--rose)]/20">
                        {isPendingUpload ? "Uploading..." : "Upload Selected Media"}
                      </button>
                    </form>
                  </div>

                  {/* Create Collection Panel */}
                  <div className="lg:col-span-1 bg-gradient-to-b from-[var(--paper)]/80 to-[var(--paper)]/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[var(--rose)]/10 rounded-xl text-[var(--rose)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </div>
                      <h2 className="text-xl font-serif font-bold">New Collection</h2>
                    </div>

                    <form onSubmit={handleCreateCollection} className="space-y-4 flex-1">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--cream)]/60 mb-1.5">Collection Title</label>
                        <input type="text" placeholder="e.g. Summer Trip" value={newColTitle} onChange={e => setNewColTitle(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)]/50 border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--cream)]/60 mb-1.5">Description</label>
                        <textarea placeholder="A short summary..." rows={4} value={newColDesc} onChange={e => setNewColDesc(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--bg)]/50 border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm resize-none" />
                      </div>
                      <button type="submit" disabled={isPendingCol || !newColTitle} className="w-full py-4 rounded-xl bg-[var(--cream)] text-[var(--bg)] font-bold text-sm disabled:opacity-50 hover:bg-white transition shadow-md mt-4">
                        {isPendingCol ? "Creating..." : "Create Collection"}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Editing Modals */}
      {editingCollection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-[var(--bg)] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[var(--line)] relative">
            <button onClick={() => setEditingCollection(null)} className="absolute top-4 right-4 p-2 text-[var(--cream)]/40 hover:text-[var(--rose)] transition bg-[var(--paper)] rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-serif font-bold mb-6">Edit Collection</h3>
            <form onSubmit={handleUpdateCollection} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--cream)]/60 mb-1.5">Title</label>
                <input type="text" value={editingCollection.title} onChange={e => setEditingCollection({...editingCollection, title: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--cream)]/60 mb-1.5">Description</label>
                <textarea value={editingCollection.description || ""} onChange={e => setEditingCollection({...editingCollection, description: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm resize-none" rows={3} />
              </div>
              <button type="submit" disabled={isPendingEdit} className="w-full py-3 mt-2 rounded-xl text-sm font-bold bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] transition shadow-lg shadow-[var(--rose)]/20">
                {isPendingEdit ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-[var(--bg)] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[var(--line)] relative">
            <button onClick={() => setEditingMedia(null)} className="absolute top-4 right-4 p-2 text-[var(--cream)]/40 hover:text-[var(--rose)] transition bg-[var(--paper)] rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-serif font-bold mb-6">Edit Media</h3>
            <form onSubmit={handleUpdateMedia} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--cream)]/60 mb-1.5">Collection</label>
                <select value={editingMedia.collectionId || "none"} onChange={e => setEditingMedia({...editingMedia, collectionId: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm appearance-none">
                  <option value="none">No Collection</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--cream)]/60 mb-1.5">Caption</label>
                <input type="text" value={editingMedia.caption || ""} onChange={e => setEditingMedia({...editingMedia, caption: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] text-sm" />
              </div>
              <button type="submit" disabled={isPendingEdit} className="w-full py-3 mt-2 rounded-xl text-sm font-bold bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] transition shadow-lg shadow-[var(--rose)]/20">
                {isPendingEdit ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}