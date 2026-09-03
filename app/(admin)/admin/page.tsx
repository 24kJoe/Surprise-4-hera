"use client";

import React, { useState, useEffect, useTransition, useRef, useCallback, useMemo } from "react";
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

/* ---------------------------------------------------------------------- */
/*  Icons                                                                 */
/* ---------------------------------------------------------------------- */

const iconStroke = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.75 };

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}
function IconImage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" {...iconStroke} />
      <circle cx="8.5" cy="9.5" r="1.5" {...iconStroke} />
      <path {...iconStroke} d="m5 17 4.5-4.5a2 2 0 0 1 2.8 0L15 15.2M14.5 13.7l1.3-1.3a2 2 0 0 1 2.8 0L21 15" />
    </svg>
  );
}
function IconVideo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" {...iconStroke} />
      <path {...iconStroke} d="M15.5 10.2 20 7.6a1 1 0 0 1 1.5.87v7.06a1 1 0 0 1-1.5.87l-4.5-2.6" />
    </svg>
  );
}
function IconEdit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M16.5 4.5 19.5 7.5 8 19H5v-3L16.5 4.5Z" />
    </svg>
  );
}
function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12.5A2 2 0 0 0 8 21.5h8a2 2 0 0 0 2-2L19 7" />
    </svg>
  );
}
function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconUpload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M12 15V4m0 0 4 4m-4-4L8 8M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
    </svg>
  );
}
function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="m4 12.5 5 5L20 7" />
    </svg>
  );
}
function IconAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M12 9v4.5M12 16.5h.01M10.4 4.3 2.9 17.5A1.5 1.5 0 0 0 4.2 19.8h15.6a1.5 1.5 0 0 0 1.3-2.3L13.6 4.3a1.5 1.5 0 0 0-2.6 0Z" />
    </svg>
  );
}
function IconFolder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.2h8a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17.7v-11Z" />
    </svg>
  );
}
function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="8" {...iconStroke} />
      <path {...iconStroke} d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" {...iconStroke} />
    </svg>
  );
}
function IconSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${props.className || ""}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  UI Primitives with Original Palette                                   */
/* ---------------------------------------------------------------------- */

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:outline-none focus:border-[var(--rose)] focus:ring-2 focus:ring-[var(--rose)]/20 text-sm text-[var(--cream)] placeholder:text-[var(--cream)]/35 transition-all";

const labelCls = "block text-[11px] font-semibold tracking-wider text-[var(--gold-soft)] uppercase mb-1.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Banner({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const styles =
    tone === "error"
      ? "bg-rose-500/10 text-rose-300 border-rose-500/25"
      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/25";
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border ${styles}`}
    >
      {tone === "error" ? <IconAlert className="w-4 h-4 shrink-0" /> : <IconCheck className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </motion.div>
  );
}

function PrimaryButton({
  children,
  loading,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--rose)] hover:bg-[var(--rose-dim)] disabled:opacity-45 disabled:cursor-not-allowed text-white font-medium text-xs shadow-md shadow-black/20 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer ${className}`}
    >
      {loading && <IconSpinner className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

function GhostButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-medium border border-[var(--line)] bg-[var(--bg)]/40 hover:bg-[var(--bg)] text-[var(--cream)]/75 hover:text-[var(--cream)] hover:border-[var(--cream)]/30 transition-all cursor-pointer disabled:opacity-45 ${className}`}
    >
      {children}
    </button>
  );
}

function DangerButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-45 ${className}`}
    >
      {children}
    </button>
  );
}

function Modal({
  onClose,
  title,
  maxWidth = "max-w-md",
  children,
}: {
  onClose: () => void;
  title: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.16 }}
        className={`bg-[var(--paper)] rounded-3xl p-6 w-full ${maxWidth} shadow-2xl border border-[var(--line)] text-[var(--cream)] relative`}
      >
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[var(--line)]">
          <h3 className="text-base font-serif font-semibold text-[var(--cream)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose)]" />
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-[var(--cream)]/50 hover:text-[var(--cream)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Main Component                                                        */
/* ---------------------------------------------------------------------- */

export default function AdminDashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Top view toggle: Studio (Upload) first
  const [currentView, setCurrentView] = useState<"studio" | "gallery">("studio");
  const [activeStudioTab, setActiveStudioTab] = useState<"upload" | "collection">("upload");

  // Gallery Search & Inspector Lightbox
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingMedia, setInspectingMedia] = useState<MediaItem | null>(null);

  // Multi-upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previewItems, setPreviewItems] = useState<{ url: string; isVideo: boolean; name: string }[]>([]);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("none");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collection form state
  const [newColTitle, setNewColTitle] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [colError, setColError] = useState("");
  const [colSuccess, setColSuccess] = useState("");

  // Edit Modals state
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [confirmDeleteCollection, setConfirmDeleteCollection] = useState<CollectionItem | null>(null);
  const [confirmDeleteMedia, setConfirmDeleteMedia] = useState<MediaItem | null>(null);

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
    setLoaded(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviewItems((prev) => [
      ...prev,
      ...selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
        name: file.name,
      })),
    ]);
  };

  const removeSingleFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFiles(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    applyFiles(Array.from(e.dataTransfer.files || []));
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) {
      setColError("Please provide a title for the collection");
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
        setColSuccess("Collection created successfully");
        setNewColTitle("");
        setNewColDesc("");
        loadData();
      } else {
        setColError(res.error || "Could not create collection");
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
        alert(res.error || "Could not save changes");
      }
    });
  };

  const handleDeleteCollection = async (col: CollectionItem) => {
    setDeletingColId(col.id);
    const res = await deleteCollectionAction(col.id);
    setDeletingColId(null);
    setConfirmDeleteCollection(null);

    if (res.success) {
      if (activeFilter === col.id) setActiveFilter("all");
      loadData();
    } else {
      alert(res.error || "Could not delete collection");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMsg("Select at least one photo or video");
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
        setSuccessMsg(`${files.length} item${files.length > 1 ? "s" : ""} uploaded successfully`);
        setFiles([]);
        setPreviewItems([]);
        setCaption("");
        setAltText("");
        setSelectedCollectionId("none");
        await loadData();
        setCurrentView("gallery");
      } else {
        setErrorMsg(res.error || "Upload failed");
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
        alert(res.error || "Could not save changes");
      }
    });
  };

  const handleDeleteMedia = async (item: MediaItem) => {
    setDeletingId(item.id);
    const res = await deleteMediaAction(item.id);
    setDeletingId(null);
    setConfirmDeleteMedia(null);
    if (inspectingMedia?.id === item.id) {
      setInspectingMedia(null);
    }

    if (res.success) {
      setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
    } else {
      alert(res.error || "Could not delete item");
    }
  };

  // Filtered and Searched items
  const filteredMedia = useMemo(() => {
    let result = mediaItems;
    if (activeFilter === "none") {
      result = result.filter((item) => !item.collectionId);
    } else if (activeFilter !== "all") {
      result = result.filter((item) => item.collectionId === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.caption?.toLowerCase().includes(query) ||
          item.altText?.toLowerCase().includes(query) ||
          item.collection?.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [mediaItems, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--cream)] p-4 sm:p-8 font-sans selection:bg-[var(--gold)] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--line)]">
          <div className="flex items-center gap-4">
            <Link
              href="/#letter"
              className="p-2.5 rounded-2xl bg-[var(--paper)]/80 hover:bg-[var(--paper)] border border-[var(--line)] text-[var(--cream)] hover:text-[var(--rose)] transition-colors shadow-sm flex items-center justify-center group shrink-0"
              title="Return to site"
            >
              <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gold-soft)] block">
                Dashboard
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--cream)] mt-0.5 leading-tight">
                Media &amp; Collections
              </h1>
            </div>
          </div>

          {/* Master View Navigation */}
          <div className="p-1.5 rounded-2xl bg-[var(--paper)] border border-[var(--line)] flex items-center gap-1 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setCurrentView("studio")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentView === "studio"
                  ? "bg-[var(--rose)] text-white shadow-sm"
                  : "text-[var(--cream)]/65 hover:text-[var(--cream)] hover:bg-[var(--bg)]/50"
              }`}
            >
              <IconUpload className="w-4 h-4" />
              <span>Upload &amp; Manage</span>
            </button>

            <button
              onClick={() => setCurrentView("gallery")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentView === "gallery"
                  ? "bg-[var(--rose)] text-white shadow-sm"
                  : "text-[var(--cream)]/65 hover:text-[var(--cream)] hover:bg-[var(--bg)]/50"
              }`}
            >
              <IconImage className="w-4 h-4" />
              <span>Media Gallery ({mediaItems.length})</span>
            </button>
          </div>
        </header>

        {/* View 1: Studio (Upload & Album Setup) */}
        {currentView === "studio" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <section className="bg-[var(--paper)]/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[var(--line)] shadow-xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStudioTab("upload")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                      activeStudioTab === "upload"
                        ? "bg-[var(--rose)] text-white shadow-sm"
                        : "text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <IconUpload className="w-3.5 h-3.5" /> Upload Media
                  </button>

                  <button
                    onClick={() => setActiveStudioTab("collection")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                      activeStudioTab === "collection"
                        ? "bg-[var(--rose)] text-white shadow-sm"
                        : "text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <IconPlus className="w-3.5 h-3.5" /> Create Collection
                  </button>
                </div>

                <span className="text-[11px] text-[var(--cream)]/40 hidden sm:inline-block">
                  {activeStudioTab === "upload" ? "Add images or video clips" : "Create organized albums"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {activeStudioTab === "upload" ? (
                  <motion.form
                    key="tab-upload"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleUpload}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all relative overflow-hidden min-h-[240px] ${
                        isDragging
                          ? "border-[var(--rose)] bg-[var(--rose)]/10"
                          : "border-[var(--line)] bg-[var(--bg)]/40 hover:border-[var(--rose)]/40"
                      }`}
                    >
                      {/* Native file input with explicit ID */}
                      <input
                        id="media-upload-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {previewItems.length > 0 ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="grid grid-cols-3 gap-2.5 w-full max-h-48 overflow-y-auto p-1.5">
                            {previewItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square w-full overflow-hidden rounded-xl border border-[var(--line)] bg-black/20 group"
                              >
                                {item.isVideo ? (
                                  <video src={item.url} className="w-full h-full object-cover" muted />
                                ) : (
                                  <img src={item.url} alt="Upload preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeSingleFile(idx)}
                                  className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-[var(--rose)] text-white transition-colors"
                                >
                                  <IconX className="w-3 h-3" />
                                </button>
                                {item.isVideo && (
                                  <span className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded-md">
                                    <IconVideo className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            <label
                              htmlFor="media-upload-input"
                              className="text-xs font-semibold text-[var(--rose)] hover:text-[var(--rose-dim)] transition-colors cursor-pointer"
                            >
                              + Add more
                            </label>
                            <span className="text-[var(--cream)]/30 text-xs">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFiles([]);
                                setPreviewItems([]);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-xs text-[var(--cream)]/60 hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              Clear all ({files.length})
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="media-upload-input"
                          className="flex flex-col items-center cursor-pointer w-full h-full justify-center text-center p-6"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[var(--plum)] flex items-center justify-center text-[var(--rose)] mb-3 group-hover:scale-105 transition-transform">
                            <IconUpload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-[var(--cream)]">
                            Drop files here, or browse from device
                          </span>
                          <span className="text-[11px] text-[var(--cream)]/45 mt-1.5">
                            Supports high-res PNG, JPG, WEBP, and MP4 videos
                          </span>
                        </label>
                      )}
                    </div>

                    <div className="flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        <Field label="Assign to Collection">
                          <select
                            value={selectedCollectionId}
                            onChange={(e) => setSelectedCollectionId(e.target.value)}
                            className={`${inputCls} cursor-pointer`}
                          >
                            <option value="none">General (No Collection)</option>
                            {collections.map((col) => (
                              <option key={col.id} value={col.id} className="bg-[var(--paper)] text-[var(--cream)]">
                                {col.title}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Caption or Note">
                          <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="e.g. Walking under the evening lights..."
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Alt Text (Accessibility)">
                          <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Brief description for screen readers"
                            className={inputCls}
                          />
                        </Field>
                      </div>

                      {errorMsg && <Banner tone="error">{errorMsg}</Banner>}
                      {successMsg && <Banner tone="success">{successMsg}</Banner>}

                      <PrimaryButton
                        type="submit"
                        disabled={isPendingUpload || files.length === 0}
                        loading={isPendingUpload}
                        className="w-full mt-2"
                      >
                        {isPendingUpload
                          ? "Uploading Assets…"
                          : `Upload ${files.length > 0 ? `${files.length} Item${files.length > 1 ? "s" : ""}` : "Files"}`}
                      </PrimaryButton>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="tab-collection"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleCreateCollection}
                    className="max-w-xl space-y-4"
                  >
                    <Field label="Collection Title">
                      <input
                        type="text"
                        value={newColTitle}
                        onChange={(e) => setNewColTitle(e.target.value)}
                        placeholder="e.g. Our First Anniversary"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Description (Optional)">
                      <textarea
                        rows={3}
                        value={newColDesc}
                        onChange={(e) => setNewColDesc(e.target.value)}
                        placeholder="A memorable line or date about this collection..."
                        className={`${inputCls} resize-none`}
                      />
                    </Field>

                    {colError && <Banner tone="error">{colError}</Banner>}
                    {colSuccess && <Banner tone="success">{colSuccess}</Banner>}

                    <div className="pt-2">
                      <PrimaryButton
                        type="submit"
                        disabled={isPendingCol || !newColTitle.trim()}
                        loading={isPendingCol}
                        className="w-full sm:w-auto"
                      >
                        <IconPlus className="w-3.5 h-3.5" /> Create Collection
                      </PrimaryButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </section>

            {collections.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif text-lg font-semibold text-[var(--cream)] flex items-center gap-2">
                  <span>Albums &amp; Collections</span>
                  <span className="text-xs font-sans text-[var(--cream)]/40 font-normal">({collections.length})</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {collections.map((col) => (
                    <div
                      key={col.id}
                      className="bg-[var(--paper)]/80 p-4 rounded-2xl border border-[var(--line)] shadow-sm hover:border-[var(--cream)]/20 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[var(--plum)] flex items-center justify-center text-[var(--rose)] shrink-0">
                          <IconFolder className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-[var(--cream)] truncate">{col.title}</h3>
                          <p className="text-[11px] text-[var(--cream)]/50 mt-0.5 truncate">
                            {col.description || `${col.media?.length || 0} media saved`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => setEditingCollection(col)}
                          className="p-1.5 rounded-lg text-[var(--cream)]/60 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Edit album"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteCollection(col)}
                          disabled={deletingColId === col.id}
                          className="p-1.5 rounded-lg text-[var(--cream)]/60 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete album"
                        >
                          {deletingColId === col.id ? <IconSpinner className="w-4 h-4" /> : <IconTrash className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {/* View 2: Enhanced Media Gallery Section */}
        {currentView === "gallery" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Gallery Controls Header */}
            <div className="bg-[var(--paper)]/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[var(--line)] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--cream)]">All Media</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--plum)] text-[var(--rose)] font-semibold">
                    {filteredMedia.length} of {mediaItems.length}
                  </span>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-64">
                  <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cream)]/40 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search caption or album..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--cream)] placeholder:text-[var(--cream)]/35 focus:outline-none focus:border-[var(--rose)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--cream)]/40 hover:text-[var(--cream)]"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Collection Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[var(--line)] pt-3">
                {[
                  { id: "all", label: "All Items", count: mediaItems.length },
                  { id: "none", label: "Unassigned", count: mediaItems.filter((m) => !m.collectionId).length },
                  ...collections.map((c) => ({ id: c.id, label: c.title, count: c.media?.length || 0 })),
                ].map((f) => {
                  const isActive = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[var(--rose)] text-white border-[var(--rose)] shadow-sm"
                          : "bg-[var(--bg)]/70 text-[var(--cream)]/65 hover:text-[var(--cream)] border-[var(--line)]"
                      }`}
                    >
                      <span>{f.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-white/25 text-white" : "bg-[var(--paper)] text-[var(--cream)]/50"
                        }`}
                      >
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gallery Grid */}
            {!loaded ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--paper)] border border-[var(--line)] animate-pulse" />
                ))}
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-dashed border-[var(--line)] bg-[var(--paper)]/30 p-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--plum)] flex items-center justify-center text-[var(--rose)] mx-auto mb-3">
                  <IconImage className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-[var(--cream)]/70">No matching items found</p>
                <p className="text-xs text-[var(--cream)]/45 mt-1">Try another search filter or upload fresh memories</p>
                <button
                  onClick={() => setCurrentView("studio")}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--rose)] text-white hover:bg-[var(--rose-dim)] transition-colors cursor-pointer"
                >
                  <IconUpload className="w-3.5 h-3.5" /> Upload Media Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredMedia.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-sm hover:shadow-lg hover:border-[var(--cream)]/25 transition-all flex flex-col justify-between"
                    >
                      {/* Media Display */}
                      <div
                        onClick={() => setInspectingMedia(item)}
                        className="absolute inset-0 cursor-pointer overflow-hidden bg-black/40"
                      >
                        {item.type === "VIDEO" ? (
                          <video
                            src={item.url}
                            poster={item.thumbnailUrl || undefined}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.altText || "Media item"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none opacity-80 group-hover:opacity-95 transition-opacity" />

                      {/* Top Badges & Quick View Button */}
                      <div className="relative z-10 p-2.5 flex items-start justify-between gap-2">
                        {item.collection ? (
                          <span
                            onClick={() => setActiveFilter(item.collection!.id)}
                            className="bg-[var(--paper)]/90 backdrop-blur-md border border-[var(--line)] text-[var(--rose)] text-[10px] font-semibold px-2 py-0.5 rounded-lg truncate max-w-[70%] shadow-sm hover:border-[var(--rose)] transition-colors cursor-pointer"
                            title={`Filter by: ${item.collection.title}`}
                          >
                            {item.collection.title}
                          </span>
                        ) : <div />}

                        <div className="flex items-center gap-1">
                          {item.type === "VIDEO" && (
                            <span className="p-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                              <IconVideo className="w-3 h-3" />
                            </span>
                          )}
                          <button
                            onClick={() => setInspectingMedia(item)}
                            className="p-1 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Inspect in Lightbox"
                          >
                            <IconEye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Details & Persistent Mobile Action Bar */}
                      <div className="relative z-10 p-3 pt-4 flex flex-col justify-end">
                        <p className="text-xs font-medium text-[var(--cream)] truncate drop-shadow-sm">
                          {item.caption || <span className="text-[var(--cream)]/40 italic">Untitled Asset</span>}
                        </p>
                        <span className="text-[10px] text-[var(--cream)]/50 mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>

                        <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-white/15">
                          <button
                            onClick={() => setEditingMedia(item)}
                            className="py-1 rounded-lg bg-[var(--paper)]/90 hover:bg-[var(--paper)] text-[var(--cream)] text-[11px] font-medium flex items-center justify-center gap-1 border border-[var(--line)] transition-colors cursor-pointer"
                          >
                            <IconEdit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteMedia(item)}
                            disabled={deletingId === item.id}
                            className="py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-rose-500/30 transition-colors cursor-pointer"
                          >
                            {deletingId === item.id ? <IconSpinner className="w-3 h-3" /> : <IconTrash className="w-3 h-3" />} Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Lightbox / Media Inspector Modal */}
        <AnimatePresence>
          {inspectingMedia && (
            <Modal
              title={inspectingMedia.caption || "Media Preview"}
              maxWidth="max-w-2xl"
              onClose={() => setInspectingMedia(null)}
            >
              <div className="space-y-4">
                <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center border border-[var(--line)]">
                  {inspectingMedia.type === "VIDEO" ? (
                    <video
                      src={inspectingMedia.url}
                      controls
                      autoPlay
                      className="max-h-[60vh] w-full object-contain"
                    />
                  ) : (
                    <img
                      src={inspectingMedia.url}
                      alt={inspectingMedia.altText || "Preview"}
                      className="max-h-[60vh] w-full object-contain"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--cream)]/70 px-1">
                  <div>
                    {inspectingMedia.collection && (
                      <span className="font-semibold text-[var(--rose)] mr-2">
                        Album: {inspectingMedia.collection.title}
                      </span>
                    )}
                    <span>
                      {new Date(inspectingMedia.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <GhostButton
                      onClick={() => {
                        const itemToEdit = inspectingMedia;
                        setInspectingMedia(null);
                        setEditingMedia(itemToEdit);
                      }}
                    >
                      <IconEdit className="w-3 h-3" /> Edit
                    </GhostButton>
                    <DangerButton
                      onClick={() => {
                        const itemToDelete = inspectingMedia;
                        setConfirmDeleteMedia(itemToDelete);
                      }}
                    >
                      <IconTrash className="w-3 h-3" /> Delete
                    </DangerButton>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Edit Collection Modal */}
        <AnimatePresence>
          {editingCollection && (
            <Modal title="Edit Collection" onClose={() => setEditingCollection(null)}>
              <form onSubmit={handleUpdateCollection} className="space-y-4">
                <Field label="Collection Title">
                  <input
                    type="text"
                    value={editingCollection.title}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={editingCollection.description || ""}
                    onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
                <div className="flex justify-end gap-2 pt-2">
                  <GhostButton type="button" onClick={() => setEditingCollection(null)}>
                    Cancel
                  </GhostButton>
                  <PrimaryButton type="submit" disabled={isPendingEdit} loading={isPendingEdit}>
                    Save Changes
                  </PrimaryButton>
                </div>
              </form>
            </Modal>
          )}
        </AnimatePresence>

        {/* Edit Media Modal */}
        <AnimatePresence>
          {editingMedia && (
            <Modal title="Edit Media Item" onClose={() => setEditingMedia(null)}>
              <form onSubmit={handleUpdateMedia} className="space-y-4">
                <Field label="Assigned Collection">
                  <select
                    value={editingMedia.collectionId || "none"}
                    onChange={(e) => setEditingMedia({ ...editingMedia, collectionId: e.target.value })}
                    className={inputCls}
                  >
                    <option value="none">General (Unassigned)</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id} className="bg-[var(--paper)] text-[var(--cream)]">
                        {col.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Caption">
                  <input
                    type="text"
                    value={editingMedia.caption || ""}
                    onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Alt Text">
                  <input
                    type="text"
                    value={editingMedia.altText || ""}
                    onChange={(e) => setEditingMedia({ ...editingMedia, altText: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <div className="flex justify-end gap-2 pt-2">
                  <GhostButton type="button" onClick={() => setEditingMedia(null)}>
                    Cancel
                  </GhostButton>
                  <PrimaryButton type="submit" disabled={isPendingEdit} loading={isPendingEdit}>
                    Save Changes
                  </PrimaryButton>
                </div>
              </form>
            </Modal>
          )}
        </AnimatePresence>

        {/* Confirm Delete Collection Modal */}
        <AnimatePresence>
          {confirmDeleteCollection && (
            <Modal title="Delete Collection?" onClose={() => setConfirmDeleteCollection(null)}>
              <p className="text-sm text-[var(--cream)]/75 leading-relaxed mb-6">
                Are you sure you want to delete <span className="text-[var(--cream)] font-semibold">{confirmDeleteCollection.title}</span>? Photos and videos belonging to this collection will remain safe under unassigned media.
              </p>
              <div className="flex justify-end gap-2">
                <GhostButton onClick={() => setConfirmDeleteCollection(null)}>Cancel</GhostButton>
                <DangerButton
                  onClick={() => handleDeleteCollection(confirmDeleteCollection)}
                  disabled={deletingColId === confirmDeleteCollection.id}
                >
                  {deletingColId === confirmDeleteCollection.id ? <IconSpinner className="w-3.5 h-3.5" /> : <IconTrash className="w-3.5 h-3.5" />}
                  Delete Collection
                </DangerButton>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Confirm Delete Media Modal */}
        <AnimatePresence>
          {confirmDeleteMedia && (
            <Modal title="Delete Media Asset?" onClose={() => setConfirmDeleteMedia(null)}>
              <p className="text-sm text-[var(--cream)]/75 leading-relaxed mb-6">
                Are you sure you want to permanently remove this media file? This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <GhostButton onClick={() => setConfirmDeleteMedia(null)}>Cancel</GhostButton>
                <DangerButton
                  onClick={() => handleDeleteMedia(confirmDeleteMedia)}
                  disabled={deletingId === confirmDeleteMedia.id}
                >
                  {deletingId === confirmDeleteMedia.id ? <IconSpinner className="w-3.5 h-3.5" /> : <IconTrash className="w-3.5 h-3.5" />}
                  Delete Permanently
                </DangerButton>
              </div>
            </Modal>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}