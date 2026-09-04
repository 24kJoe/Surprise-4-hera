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
  getCloudinarySignatureAction,
  saveDirectMediaAction,
  checkDuplicateMediaAction,
  reorderMediaAction,
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
  size?: number | null;
  order?: number;
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
function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect width="13" height="13" x="9" y="9" rx="2" ry="2" {...iconStroke} />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...iconStroke} />
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
function IconCheckSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <polyline points="9 11 12 14 22 4" {...iconStroke} />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" {...iconStroke} />
    </svg>
  );
}
function IconSliders(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <line x1="4" y1="21" x2="4" y2="14" {...iconStroke} />
      <line x1="4" y1="10" x2="4" y2="3" {...iconStroke} />
      <line x1="12" y1="21" x2="12" y2="12" {...iconStroke} />
      <line x1="12" y1="8" x2="12" y2="3" {...iconStroke} />
      <line x1="20" y1="21" x2="20" y2="16" {...iconStroke} />
      <line x1="20" y1="12" x2="20" y2="3" {...iconStroke} />
      <line x1="1" y1="14" x2="7" y2="14" {...iconStroke} />
      <line x1="9" y1="8" x2="15" y2="8" {...iconStroke} />
      <line x1="17" y1="16" x2="23" y2="16" {...iconStroke} />
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
function IconCoffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path {...iconStroke} d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" {...iconStroke} />
      <line x1="10" y1="2" x2="10" y2="4" {...iconStroke} />
      <line x1="14" y1="2" x2="14" y2="4" {...iconStroke} />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Native Hardware Image Compression Engine                              */
/* ---------------------------------------------------------------------- */

type QualityPreset = "ultra" | "high" | "compact";

interface PresetConfig {
  label: string;
  maxDimension: number;
  quality: number;
  description: string;
}

const QUALITY_PRESETS: Record<QualityPreset, PresetConfig> = {
  ultra: {
    label: "Ultra / 4K",
    maxDimension: 3840,
    quality: 0.94,
    description: "Original uncompressed clarity (~2MB+)",
  },
  high: {
    label: "High / 2K (Recommended)",
    maxDimension: 2560,
    quality: 0.88,
    description: "Crisp clarity, fast mobile upload (~900KB)",
  },
  compact: {
    label: "Compact / 1080p",
    maxDimension: 1920,
    quality: 0.78,
    description: "Mobile data saver (~450KB)",
  },
};

async function compressAndroidSafe(file: File, preset: QualityPreset): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  if (preset === "ultra") {
    return file;
  }

  const config = QUALITY_PRESETS[preset];

  try {
    let bitmap: ImageBitmap;
    if ("createImageBitmap" in window) {
      bitmap = await createImageBitmap(file);
    } else {
      return file;
    }

    let { width, height } = bitmap;
    const needsResize = width > config.maxDimension || height > config.maxDimension;

    if (width > height && width > config.maxDimension) {
      height = Math.round((height * config.maxDimension) / width);
      width = config.maxDimension;
    } else if (height > config.maxDimension) {
      width = Math.round((width * config.maxDimension) / height);
      height = config.maxDimension;
    }

    if (!needsResize) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });

    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;

          if (!blob) {
            resolve(file);
            return;
          }

          const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        config.quality
      );
    });
  } catch {
    return file;
  }
}

/* ---------------------------------------------------------------------- */
/*  Direct Cloudinary Upload (Instantly Abortable)                        */
/* ---------------------------------------------------------------------- */

function directUploadToCloudinary(
  file: File,
  signData: { timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string },
  onProgress: (percent: number) => void,
  onAttachXhr?: (xhr: XMLHttpRequest) => void
): Promise<{
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  bytes?: number;
  duration?: number;
  format?: string;
}> {
  return new Promise((resolve, reject) => {
    const isVideo = file.type.startsWith("video/");
    const endpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${isVideo ? "video" : "image"}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", String(signData.timestamp));
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    const xhr = new XMLHttpRequest();
    if (onAttachXhr) onAttachXhr(xhr);

    xhr.open("POST", endpoint);
    xhr.timeout = 300000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch {
          reject(new Error("Invalid response received from Cloudinary"));
        }
      } else {
        reject(new Error(`Cloudinary rejected file with status code ${xhr.status}`));
      }
    };

    xhr.onabort = () => reject(new Error("Upload cancelled by user"));
    xhr.ontimeout = () => reject(new Error("Connection timed out. Check network stability."));
    xhr.onerror = () => reject(new Error("Network error during direct upload"));
    xhr.send(formData);
  });
}

/* ---------------------------------------------------------------------- */
/*  UI Primitives                                                         */
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
/*  Batch Thumbnail Loader                                                */
/* ---------------------------------------------------------------------- */

function BatchFileThumbnail({ file }: { file: File }) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage && !isVideo) return;
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage, isVideo]);

  if (!thumbUrl) {
    return (
      <div className="w-14 h-14 rounded-xl bg-[var(--plum)] flex items-center justify-center text-[var(--rose)] shrink-0">
        {isVideo ? <IconVideo className="w-5 h-5" /> : <IconImage className="w-5 h-5" />}
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-[var(--line)] shrink-0 relative flex items-center justify-center">
      {isVideo ? (
        <>
          <video src={thumbUrl} className="w-full h-full object-cover" muted />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
            <IconVideo className="w-4 h-4" />
          </div>
        </>
      ) : (
        <img
          src={thumbUrl}
          alt={file.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Single-File Lightbox Preview Component                                */
/* ---------------------------------------------------------------------- */

function SingleFilePreviewModal({
  file,
  index,
  total,
  onClose,
  onDelete,
  onNext,
  onPrev,
}: {
  file: File;
  index: number;
  total: number;
  onClose: () => void;
  onDelete: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Modal title={`Preview (${index + 1} of ${total})`} maxWidth="max-w-2xl" onClose={onClose}>
      <div className="space-y-4">
        <div className="w-full max-h-[60vh] rounded-2xl overflow-hidden bg-black/70 flex items-center justify-center border border-[var(--line)] relative">
          {fileUrl && (
            isVideo ? (
              <video src={fileUrl} controls autoPlay className="max-h-[58vh] w-full object-contain" />
            ) : (
              <img src={fileUrl} alt={file.name} className="max-h-[58vh] w-full object-contain" />
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--cream)]/70 px-1 border-t border-[var(--line)] pt-3">
          <div className="truncate max-w-[240px]">
            <p className="font-semibold text-[var(--cream)] truncate">{file.name}</p>
            <p className="text-[11px] text-[var(--cream)]/45">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>

          <div className="flex items-center gap-2">
            <GhostButton onClick={onPrev} disabled={total <= 1}>
              Previous
            </GhostButton>
            <GhostButton onClick={onNext} disabled={total <= 1}>
              Next
            </GhostButton>
            <DangerButton onClick={onDelete}>
              <IconTrash className="w-3.5 h-3.5" /> Remove
            </DangerButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/*  AFK Fullscreen Overlay Component                                      */
/* ---------------------------------------------------------------------- */

function AfkUploadOverlay({
  current,
  total,
  currentFileName,
  statusText,
  onCancel,
}: {
  current: number;
  total: number;
  currentFileName: string;
  statusText: string;
  onCancel: () => void;
}) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0c060a] text-[var(--cream)] flex flex-col items-center justify-between p-6 sm:p-12 select-none overflow-hidden"
    >
      <div className="w-full flex items-center justify-between max-w-xl">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AFK Mode Active (Screen Kept Awake)</span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
        >
          Cancel Upload
        </button>
      </div>

      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md w-full">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--rose)]/15 blur-2xl animate-pulse" />
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              className="text-white/10"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="text-[var(--rose)] transition-all duration-500 ease-out"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - percent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {percent}%
            </span>
            <span className="text-[11px] text-[var(--gold-soft)] uppercase tracking-wider font-semibold mt-1">
              {current} of {total} items
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--cream)]">
            Relax while we upload your memories
          </h2>
          <p className="text-xs text-[var(--cream)]/60 truncate max-w-sm mx-auto">
            {statusText}
          </p>
          <p className="text-[11px] font-mono text-[var(--rose)]/80 truncate max-w-xs mx-auto">
            {currentFileName}
          </p>
        </div>
      </div>

      <div className="text-center text-[11px] text-[var(--cream)]/40 flex items-center gap-2">
        <IconCoffee className="w-4 h-4 text-[var(--gold-soft)]" />
        <span>Your screen will remain on until upload completes.</span>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Main Component                                                        */
/* ---------------------------------------------------------------------- */

export default function AdminDashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [currentView, setCurrentView] = useState<"studio" | "gallery">("studio");
  const [activeStudioTab, setActiveStudioTab] = useState<"upload" | "collection">("upload");

  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingMedia, setInspectingMedia] = useState<MediaItem | null>(null);

  // Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [singleCoverUrl, setSingleCoverUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("none");
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>("high");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AFK Mode State & WakeLock Ref
  const [afkModeEnabled, setAfkModeEnabled] = useState(true);
  const [isAfkActive, setIsAfkActive] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Duplicate Tracking
  const [duplicateNames, setDuplicateNames] = useState<Set<string>>(new Set());

  // Batch Review Modal & File Inspection
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [inspectingFileIndex, setInspectingFileIndex] = useState<number | null>(null);

  // Progress State & Immediate Abort Controllers
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; statusText: string; currentFileName: string } | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const abortUploadRef = useRef(false);
  const activeXhrRef = useRef<XMLHttpRequest | null>(null);

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Collection State
  const [newColTitle, setNewColTitle] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [colError, setColError] = useState("");
  const [colSuccess, setColSuccess] = useState("");

  // Edit Modals
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [confirmDeleteCollection, setConfirmDeleteCollection] = useState<CollectionItem | null>(null);
  const [confirmDeleteMedia, setConfirmDeleteMedia] = useState<MediaItem | null>(null);

  // Status & Filters
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [isPendingCol, startTransitionCol] = useTransition();
  const [isPendingEdit, startTransitionEdit] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingColId, setDeletingColId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch (err) {
      console.warn("Screen WakeLock could not be acquired:", err);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
      } catch (err) {
        console.warn("Error releasing wakeLock:", err);
      }
      wakeLockRef.current = null;
    }
  };

  const stopAllUploads = useCallback(() => {
    abortUploadRef.current = true;
    if (activeXhrRef.current) {
      try {
        activeXhrRef.current.abort();
      } catch (e) {
        console.warn("Could not abort active XHR:", e);
      }
      activeXhrRef.current = null;
    }
    releaseWakeLock();
    setIsAfkActive(false);
  }, []);

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
    return () => {
      releaseWakeLock();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (singleCoverUrl) {
        URL.revokeObjectURL(singleCoverUrl);
      }
    };
  }, [singleCoverUrl]);

  const detectDuplicates = useCallback(
    async (fileList: File[]) => {
      if (!fileList || fileList.length === 0) {
        setDuplicateNames(new Set());
        return;
      }

      const dupes = new Set<string>();

      const seenKeys = new Set<string>();
      fileList.forEach((file) => {
        const sizeKey = `size-${file.size}`;
        const nameKey = `name-${file.name.toLowerCase()}`;

        if (seenKeys.has(sizeKey) || seenKeys.has(nameKey)) {
          dupes.add(file.name);
        } else {
          seenKeys.add(sizeKey);
          seenKeys.add(nameKey);
        }
      });

      try {
        const payload = fileList.map((f) => ({ name: f.name, size: f.size }));
        const checkRes = await checkDuplicateMediaAction(payload);
        if (checkRes.success && checkRes.duplicates) {
          checkRes.duplicates.forEach((name) => dupes.add(name));
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      }

      setDuplicateNames(new Set(dupes));
    },
    []
  );

  const clearSelectedFiles = () => {
    if (singleCoverUrl) {
      URL.revokeObjectURL(singleCoverUrl);
      setSingleCoverUrl(null);
    }
    setFiles([]);
    setDuplicateNames(new Set());
    setShowBatchModal(false);
    setInspectingFileIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFileFromBatch = (indexToRemove: number) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updated);
    detectDuplicates(updated);

    if (inspectingFileIndex !== null) {
      if (updated.length === 0) {
        setInspectingFileIndex(null);
      } else if (inspectingFileIndex >= updated.length) {
        setInspectingFileIndex(updated.length - 1);
      }
    }

    if (indexToRemove === 0) {
      if (singleCoverUrl) URL.revokeObjectURL(singleCoverUrl);
      const nextImage = updated.find((f) => f.type.startsWith("image/"));
      if (nextImage) {
        setSingleCoverUrl(URL.createObjectURL(nextImage));
      } else {
        setSingleCoverUrl(null);
      }
    }

    if (updated.length === 0) {
      setShowBatchModal(false);
      setInspectingFileIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAllDuplicates = () => {
    const uniqueFiles: File[] = [];
    const seen = new Set<string>();

    files.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      const isDbDupe = duplicateNames.has(file.name);
      if (!seen.has(key) && !isDbDupe) {
        seen.add(key);
        uniqueFiles.push(file);
      }
    });

    setFiles(uniqueFiles);
    setDuplicateNames(new Set());
    if (uniqueFiles.length === 0) {
      clearSelectedFiles();
    }
  };

  const applyFiles = (selectedFiles: File[]) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (!singleCoverUrl) {
      const firstImage = selectedFiles.find((f) => f.type.startsWith("image/"));
      if (firstImage) {
        setSingleCoverUrl(URL.createObjectURL(firstImage));
      }
    }

    setFiles((prev) => {
      const combined = [...prev, ...selectedFiles];
      detectDuplicates(combined);
      return combined;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFiles(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    applyFiles(Array.from(e.dataTransfer.files || []));
  }, [applyFiles]);

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
    const isProtected = col.title.toLowerCase() === "our-memories" || (col as any).slug === "our-memories";
    if (isProtected) {
      alert("The 'our-memories' collection is protected and cannot be deleted.");
      return;
    }

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

  /* Unified Direct-to-Cloudinary (Photos + Videos) Upload Pipeline */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMsg("Select at least one photo or video");
      return;
    }

    setShowBatchModal(false);
    setInspectingFileIndex(null);
    setErrorMsg("");
    setSuccessMsg("");
    setIsBatchUploading(true);
    abortUploadRef.current = false;

    if (afkModeEnabled) {
      setIsAfkActive(true);
      await requestWakeLock();
    }

    const total = files.length;
    setUploadProgress({ current: 0, total, statusText: "Preparing upload...", currentFileName: files[0].name });

    let completed = 0;
    const failedItems: { name: string; reason?: string }[] = [];

    for (let i = 0; i < total; i++) {
      if (abortUploadRef.current) {
        for (let j = i; j < total; j++) {
          failedItems.push({ name: files[j].name, reason: "Cancelled by user" });
        }
        break;
      }

      const rawFile = files[i];
      const isVideo = rawFile.type.startsWith("video/");

      try {
        if (isVideo) {
          setUploadProgress({
            current: i,
            total,
            statusText: `Signing video...`,
            currentFileName: rawFile.name,
          });

          const signResult = await getCloudinarySignatureAction();
          if (!signResult.success || !signResult.signature) {
            throw new Error(signResult.error || "Failed to generate upload signature");
          }

          const uploadResult = await directUploadToCloudinary(
            rawFile,
            signResult as any,
            (percent) => {
              setUploadProgress({
                current: i,
                total,
                statusText: `Uploading video (${percent}%)...`,
                currentFileName: rawFile.name,
              });
            },
            (xhr) => {
              activeXhrRef.current = xhr;
            }
          );
          activeXhrRef.current = null;

          if (abortUploadRef.current) break;

          const saveRes = await saveDirectMediaAction({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type: "VIDEO",
            width: uploadResult.width,
            height: uploadResult.height,
            size: uploadResult.bytes || rawFile.size,
            duration: uploadResult.duration,
            mimeType: rawFile.type || `video/${uploadResult.format}`,
            caption,
            altText,
            collectionId: selectedCollectionId,
          });

          if (!saveRes.success) {
            throw new Error(saveRes.error || "Failed to record video in database");
          }

          completed++;
        } else {
          setUploadProgress({
            current: i,
            total,
            statusText: `Optimizing photo...`,
            currentFileName: rawFile.name,
          });

          const readyFile = await compressAndroidSafe(rawFile, qualityPreset);

          if (abortUploadRef.current) break;

          setUploadProgress({
            current: i,
            total,
            statusText: `Signing photo upload...`,
            currentFileName: rawFile.name,
          });

          const signResult = await getCloudinarySignatureAction();
          if (!signResult.success || !signResult.signature) {
            throw new Error(signResult.error || "Failed to generate upload signature");
          }

          const uploadResult = await directUploadToCloudinary(
            readyFile,
            signResult as any,
            (percent) => {
              setUploadProgress({
                current: i,
                total,
                statusText: `Uploading photo (${percent}%)...`,
                currentFileName: rawFile.name,
              });
            },
            (xhr) => {
              activeXhrRef.current = xhr;
            }
          );
          activeXhrRef.current = null;

          if (abortUploadRef.current) break;

          const saveRes = await saveDirectMediaAction({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type: "IMAGE",
            width: uploadResult.width,
            height: uploadResult.height,
            size: uploadResult.bytes || readyFile.size,
            mimeType: readyFile.type || "image/jpeg",
            caption,
            altText,
            collectionId: selectedCollectionId,
          });

          if (!saveRes.success) {
            throw new Error(saveRes.error || "Failed to record photo in database");
          }

          completed++;
        }
      } catch (err: any) {
        if (err.message === "Upload cancelled by user") {
          failedItems.push({ name: rawFile.name, reason: "Cancelled by user" });
        } else {
          failedItems.push({ name: rawFile.name, reason: err.message || "Network error" });
        }
      }

      setUploadProgress({
        current: i + 1,
        total,
        statusText: `Uploaded ${i + 1} of ${total}`,
        currentFileName: rawFile.name,
      });
    }

    activeXhrRef.current = null;
    releaseWakeLock();
    setIsAfkActive(false);
    setIsBatchUploading(false);
    setUploadProgress(null);

    if (failedItems.length > 0) {
      const failedNames = new Set(failedItems.map((f) => f.name));
      const remainingFailedFiles = files.filter((f) => failedNames.has(f.name));
      setFiles(remainingFailedFiles);

      const formattedError = `Failed (${failedItems.length}/${total}):\n` +
        failedItems.map((f) => `• ${f.name}${f.reason ? ` (${f.reason})` : ""}`).join("\n");
      setErrorMsg(formattedError);

      if (completed > 0) {
        setSuccessMsg(`Successfully uploaded ${completed} item${completed > 1 ? "s" : ""}.`);
      }
      await loadData();
    } else {
      setSuccessMsg(`All ${completed} item${completed > 1 ? "s" : ""} uploaded successfully!`);
      clearSelectedFiles();
      setCaption("");
      setAltText("");
      setSelectedCollectionId("none");
      await loadData();
      setCurrentView("gallery");
    }
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
      setSelectedMediaIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    } else {
      alert(res.error || "Could not delete item");
    }
  };

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

  /* Shift arrangement of items in the current collection */
  const moveMediaItem = async (index: number, direction: "left" | "right") => {
    if (isReordering) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredMedia.length) return;

    const newArr = [...filteredMedia];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;

    // Optimistically update the UI
    const updatedIds = new Set(newArr.map((m) => m.id));
    setMediaItems((prev) => {
      const others = prev.filter((m) => !updatedIds.has(m.id));
      return [...newArr, ...others];
    });

    setIsReordering(true);
    const payload = newArr.map((item, idx) => ({ id: item.id, order: idx }));
    await reorderMediaAction(payload);
    setIsReordering(false);
  };

  const toggleSelectMedia = (id: string) => {
    setSelectedMediaIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    const allIds = new Set(filteredMedia.map((m) => m.id));
    setSelectedMediaIds(allIds);
  };

  const clearBulkSelection = () => {
    setSelectedMediaIds(new Set());
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedMediaIds);
    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const chunkSize = 4;
    const failedIds: string[] = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (id) => {
          try {
            const res = await deleteMediaAction(id);
            if (!res.success) failedIds.push(id);
          } catch {
            failedIds.push(id);
          }
        })
      );
    }

    setIsBulkDeleting(false);
    setShowBulkDeleteModal(false);

    const deletedCount = ids.length - failedIds.length;
    const successfullyDeleted = new Set(ids.filter((id) => !failedIds.includes(id)));
    setMediaItems((prev) => prev.filter((m) => !successfullyDeleted.has(m.id)));
    setSelectedMediaIds(new Set(failedIds));

    if (failedIds.length > 0) {
      alert(`Deleted ${deletedCount} items. ${failedIds.length} failed to delete.`);
    } else {
      setSelectMode(false);
    }
  };

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

        {/* View 1: Studio */}
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
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all relative overflow-hidden min-h-[260px] ${
                        isDragging
                          ? "border-[var(--rose)] bg-[var(--rose)]/10"
                          : "border-[var(--line)] bg-[var(--bg)]/40 hover:border-[var(--rose)]/40"
                      }`}
                    >
                      <input
                        id="media-upload-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={isBatchUploading}
                        className="hidden"
                      />

                      {files.length > 0 ? (
                        <div className="w-full flex flex-col items-center justify-center p-4">
                          <div
                            onClick={() => setShowBatchModal(true)}
                            title="Click to view & manage selected files"
                            className="relative w-36 h-28 mb-3 flex items-center justify-center select-none cursor-pointer group"
                          >
                            <div className="absolute inset-0 rounded-2xl bg-white/60 border border-rose-200/60 shadow-xs rotate-6 translate-x-3 translate-y-1 group-hover:rotate-8 transition-transform" />
                            <div className="absolute inset-0 rounded-2xl bg-white/80 border border-rose-200/80 shadow-xs -rotate-4 -translate-x-2 group-hover:-rotate-6 transition-transform" />
                            
                            <div className="relative w-full h-full rounded-2xl bg-[#fffdfa] border border-rose-300 shadow-md group-hover:shadow-xl group-hover:border-[var(--rose)] transition-all flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                              {singleCoverUrl ? (
                                <img
                                  src={singleCoverUrl}
                                  alt=""
                                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform pointer-events-none"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : null}

                              <div className="relative z-10 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-[var(--rose)] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                  <IconEye className="w-4 h-4" />
                                </div>
                                <span className="font-serif text-lg font-bold text-[rgb(74,32,58)] leading-tight">
                                  {files.length}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-900/60">
                                  Batch Selected
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-rose-950/80 text-center font-serif italic">
                                {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1)} MB selected
                              </p>
                              <span className="text-rose-300 text-xs">•</span>
                              <button
                                type="button"
                                onClick={() => setShowBatchModal(true)}
                                className="text-xs font-semibold text-[var(--rose)] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <IconEye className="w-3.5 h-3.5" />
                                <span>View files</span>
                              </button>
                            </div>

                            {/* Mobile-Friendly Duplicate Alert Notice */}
                            {duplicateNames.size > 0 && (
                              <div className="w-full max-w-xs flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium shadow-sm">
                                <div className="flex items-center gap-1.5 truncate">
                                  <IconCopy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="truncate">{duplicateNames.size} duplicate(s)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeAllDuplicates}
                                  className="underline font-bold text-amber-300 hover:text-white shrink-0 cursor-pointer text-[11px]"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <label
                              htmlFor="media-upload-input"
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/70 border border-rose-200/80 text-xs font-semibold text-[var(--rose)] hover:bg-white shadow-2xs transition-all cursor-pointer ${
                                isBatchUploading ? "pointer-events-none opacity-40" : ""
                              }`}
                            >
                              <IconPlus className="w-3.5 h-3.5" />
                              <span>Add more files</span>
                            </label>

                            <button
                              type="button"
                              onClick={clearSelectedFiles}
                              disabled={isBatchUploading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-rose-900/60 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-40"
                            >
                              <IconX className="w-3.5 h-3.5" />
                              <span>Clear selection</span>
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
                            disabled={isBatchUploading}
                            className={`${inputCls} cursor-pointer disabled:opacity-50`}
                          >
                            <option value="none">General (No Collection)</option>
                            {collections.map((col) => (
                              <option key={col.id} value={col.id} className="bg-[var(--paper)] text-[var(--cream)]">
                                {col.title}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <div>
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[var(--gold-soft)] uppercase mb-1.5">
                            <IconSliders className="w-3 h-3" />
                            <span>Mobile Optimization Quality</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["ultra", "high", "compact"] as QualityPreset[]).map((preset) => {
                              const config = QUALITY_PRESETS[preset];
                              const isSelected = qualityPreset === preset;
                              return (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setQualityPreset(preset)}
                                  disabled={isBatchUploading}
                                  className={`px-2.5 py-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer disabled:opacity-50 ${
                                    isSelected
                                      ? "border-[var(--rose)] bg-[var(--rose)]/15 text-white ring-1 ring-[var(--rose)]/40"
                                      : "border-[var(--line)] bg-[var(--bg)] text-[var(--cream)]/60 hover:text-[var(--cream)] hover:border-[var(--cream)]/25"
                                  }`}
                                >
                                  <span className="text-xs font-semibold block leading-tight">{config.label}</span>
                                  <span className="text-[10px] text-[var(--cream)]/40 mt-1 block leading-none">
                                    {preset === "ultra" ? "4K / Original" : preset === "high" ? "2K / Fast" : "1080p"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-[var(--cream)]/40 mt-1 font-serif italic">
                            {QUALITY_PRESETS[qualityPreset].description}
                          </p>
                        </div>

                        {/* AFK Mode Toggle Switch */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center">
                              <IconCoffee className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-[var(--cream)] block">AFK Screen Keep-Awake</span>
                              <span className="text-[10px] text-[var(--cream)]/50 block">Prevents phone sleep & timeouts</span>
                            </div>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={afkModeEnabled}
                              onChange={(e) => setAfkModeEnabled(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--rose)]"></div>
                          </label>
                        </div>

                        <Field label="Caption or Note">
                          <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={isBatchUploading}
                            placeholder="e.g. Walking under the evening lights..."
                            className={`${inputCls} disabled:opacity-50`}
                          />
                        </Field>

                        <Field label="Alt Text (Accessibility)">
                          <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            disabled={isBatchUploading}
                            placeholder="Brief description for screen readers"
                            className={`${inputCls} disabled:opacity-50`}
                          />
                        </Field>
                      </div>

                      {/* Real-time Progress Bar */}
                      {isBatchUploading && uploadProgress && !isAfkActive && (
                        <div className="bg-[var(--bg)]/80 p-3.5 rounded-2xl border border-[var(--line)] space-y-2">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-[var(--cream)]/80 flex items-center gap-2 truncate max-w-[80%]">
                              <IconSpinner className="w-3.5 h-3.5 text-[var(--rose)] shrink-0" />
                              <span className="truncate">{uploadProgress.statusText}</span>
                            </span>
                            <span className="text-[var(--rose)] font-semibold shrink-0">
                              {uploadProgress.current} / {uploadProgress.total}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--rose)] transition-all duration-300 rounded-full"
                              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={stopAllUploads}
                              className="text-[10px] text-rose-300/80 hover:text-rose-200 underline cursor-pointer"
                            >
                              Stop remaining
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Detailed Multi-line Error Banner */}
                      {errorMsg && (
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl text-xs font-medium border bg-rose-500/10 text-rose-300 border-rose-500/25">
                          <div className="flex items-center gap-2 font-semibold">
                            <IconAlert className="w-4 h-4 shrink-0 text-rose-400" />
                            <span>Upload Issues Encountered</span>
                          </div>
                          <div className="mt-1 pl-6 space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] text-rose-200/90 whitespace-pre-line scrollbar-thin">
                            {errorMsg}
                          </div>
                        </div>
                      )}

                      {successMsg && <Banner tone="success">{successMsg}</Banner>}

                      <PrimaryButton
                        type="submit"
                        disabled={isBatchUploading || files.length === 0}
                        loading={isBatchUploading}
                        className="w-full mt-2"
                      >
                        {isBatchUploading
                          ? `Uploading (${uploadProgress?.current || 0}/${uploadProgress?.total || files.length})…`
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

            {/* Collections Grid */}
            {collections.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif text-lg font-semibold text-[var(--cream)] flex items-center gap-2">
                  <span>Albums &amp; Collections</span>
                  <span className="text-xs font-sans text-[var(--cream)]/40 font-normal">({collections.length})</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const sortedCollections = [...collections].sort((a, b) => {
                      const aIsSpecial = a.title.toLowerCase() === "our-memories" || (a as any).slug === "our-memories";
                      const bIsSpecial = b.title.toLowerCase() === "our-memories" || (b as any).slug === "our-memories";
                      if (aIsSpecial) return -1;
                      if (bIsSpecial) return 1;
                      return 0;
                    });

                    return sortedCollections.map((col) => {
                      const isProtected = col.title.toLowerCase() === "our-memories" || (col as any).slug === "our-memories";

                      return (
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

                            {!isProtected ? (
                              <button
                                onClick={() => setConfirmDeleteCollection(col)}
                                disabled={deletingColId === col.id}
                                className="p-1.5 rounded-lg text-[var(--cream)]/60 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Delete album"
                              >
                                {deletingColId === col.id ? <IconSpinner className="w-4 h-4" /> : <IconTrash className="w-4 h-4" />}
                              </button>
                            ) : (
                              <span
                                className="px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--gold-soft)] font-semibold"
                                title="Protected system album"
                              >
                                Protected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {/* View 2: Gallery */}
        {currentView === "gallery" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 pb-20"
          >
            <div className="bg-[var(--paper)]/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[var(--line)] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--cream)]">All Media</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--plum)] text-[var(--rose)] font-semibold">
                      {filteredMedia.length} of {mediaItems.length}
                    </span>
                  </div>

                  {filteredMedia.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectMode(!selectMode);
                        clearBulkSelection();
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        selectMode
                          ? "bg-[var(--rose)] text-white border-[var(--rose)] shadow-sm"
                          : "bg-[var(--bg)] text-[var(--cream)]/75 border-[var(--line)] hover:border-[var(--cream)]/30 hover:text-[var(--cream)]"
                      }`}
                    >
                      <IconCheckSquare className="w-3.5 h-3.5" />
                      <span>{selectMode ? "Exit Selection" : "Select Multiple"}</span>
                    </button>
                  )}
                </div>

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

              {selectMode && (
                <div className="flex items-center justify-between bg-[var(--bg)]/70 p-2.5 px-3.5 rounded-xl border border-[var(--line)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={selectAllFiltered}
                      className="text-xs font-semibold text-[var(--rose)] hover:underline cursor-pointer"
                    >
                      Select All ({filteredMedia.length})
                    </button>
                    <span className="text-[var(--cream)]/20 text-xs">•</span>
                    <button
                      onClick={clearBulkSelection}
                      className="text-xs text-[var(--cream)]/60 hover:text-[var(--cream)] cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-[var(--cream)]">
                    {selectedMediaIds.size} selected
                  </span>
                </div>
              )}

              {/* Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[var(--line)] pt-3">
                {(() => {
                  const ourMemoriesCol = collections.find(
                    (c) => c.title.toLowerCase() === "our-memories" || (c as any).slug === "our-memories"
                  );
                  const remainingCols = collections.filter(
                    (c) => c.id !== ourMemoriesCol?.id
                  );

                  const chips = [
                    { id: "all", label: "All Items", count: mediaItems.length },
                    { id: "none", label: "Unassigned", count: mediaItems.filter((m) => !m.collectionId).length },
                    ...(ourMemoriesCol
                      ? [
                          {
                            id: ourMemoriesCol.id,
                            label: ourMemoriesCol.title,
                            count: ourMemoriesCol.media?.length || 0,
                          },
                        ]
                      : []),
                    ...remainingCols.map((c) => ({ id: c.id, label: c.title, count: c.media?.length || 0 })),
                  ];

                  return chips.map((f) => {
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
                  });
                })()}
              </div>
            </div>

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
                  {filteredMedia.map((item, index) => {
                    const isSelected = selectedMediaIds.has(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        onClick={() => {
                          if (selectMode) toggleSelectMedia(item.id);
                        }}
                        className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[var(--rose)] ring-3 ring-[var(--rose)]/40 shadow-lg shadow-[var(--rose)]/20"
                            : "border-[var(--line)] bg-[var(--paper)] shadow-sm hover:shadow-lg hover:border-[var(--cream)]/25"
                        } ${selectMode ? "cursor-pointer" : ""}`}
                      >
                        <div
                          onClick={(e) => {
                            if (!selectMode) {
                              setInspectingMedia(item);
                            }
                          }}
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

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none opacity-80 group-hover:opacity-95 transition-opacity" />

                        <div className="relative z-10 p-2.5 flex items-start justify-between gap-2">
                          {selectMode ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectMedia(item.id);
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                                isSelected
                                  ? "bg-[var(--rose)] text-white"
                                  : "bg-black/60 border border-white/40 text-transparent hover:border-white"
                              }`}
                            >
                              <IconCheck className="w-3.5 h-3.5" />
                            </div>
                          ) : item.collection ? (
                            <span
                              onClick={() => setActiveFilter(item.collection!.id)}
                              className="bg-[var(--paper)]/90 backdrop-blur-md border border-[var(--line)] text-[var(--rose)] text-[10px] font-semibold px-2 py-0.5 rounded-lg truncate max-w-[70%] shadow-sm hover:border-[var(--rose)] transition-colors cursor-pointer"
                              title={`Filter by: ${item.collection.title}`}
                            >
                              {item.collection.title}
                            </span>
                          ) : (
                            <div />
                          )}

                          <div className="flex items-center gap-1">
                            {item.type === "VIDEO" && (
                              <span className="p-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                                <IconVideo className="w-3 h-3" />
                              </span>
                            )}
                            {!selectMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingMedia(item);
                                }}
                                className="p-1 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                title="Inspect in Lightbox"
                              >
                                <IconEye className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

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

                          {/* Reorder Buttons (Arrangement) */}
                          {!selectMode && (
                            <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-white/15">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveMediaItem(index, "left");
                                  }}
                                  disabled={index === 0 || isReordering}
                                  className="p-1 rounded-lg bg-black/40 hover:bg-black/70 disabled:opacity-30 disabled:pointer-events-none text-white text-[10px] border border-white/10 transition-colors"
                                  title="Move earlier"
                                >
                                  <IconArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveMediaItem(index, "right");
                                  }}
                                  disabled={index === filteredMedia.length - 1 || isReordering}
                                  className="p-1 rounded-lg bg-black/40 hover:bg-black/70 disabled:opacity-30 disabled:pointer-events-none text-white text-[10px] border border-white/10 transition-colors"
                                  title="Move later"
                                >
                                  <IconArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMedia(item);
                                  }}
                                  className="py-1 px-2 rounded-lg bg-[var(--paper)]/90 hover:bg-[var(--paper)] text-[var(--cream)] text-[11px] font-medium flex items-center justify-center gap-1 border border-[var(--line)] transition-colors cursor-pointer"
                                >
                                  <IconEdit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteMedia(item);
                                  }}
                                  disabled={deletingId === item.id}
                                  className="py-1 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-rose-500/30 transition-colors cursor-pointer"
                                >
                                  {deletingId === item.id ? <IconSpinner className="w-3.5 h-3.5" /> : <IconTrash className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence>
              {selectMode && selectedMediaIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--paper)] border border-[var(--line)] shadow-2xl p-3 px-6 rounded-2xl flex items-center gap-4 text-sm"
                >
                  <span className="text-[var(--cream)] font-medium">
                    <strong className="text-[var(--rose)]">{selectedMediaIds.size}</strong> selected
                  </span>

                  <button
                    onClick={() => setShowBulkDeleteModal(true)}
                    className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <IconTrash className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>

                  <button
                    onClick={clearBulkSelection}
                    className="text-xs text-[var(--cream)]/60 hover:text-[var(--cream)]"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Batch Review Modal */}
        <AnimatePresence>
          {showBatchModal && (
            <Modal
              title={`Batch Review (${files.length} items)`}
              maxWidth="max-w-2xl"
              onClose={() => setShowBatchModal(false)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--cream)]/60 pb-2 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-rose-300/80">
                      Total size: {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    {duplicateNames.size > 0 && (
                      <button
                        type="button"
                        onClick={removeAllDuplicates}
                        className="text-amber-400 hover:text-amber-300 font-semibold underline ml-2 cursor-pointer"
                      >
                        Remove {duplicateNames.size} duplicate(s)
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                  >
                    Clear entire batch
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
                  {files.map((file, idx) => {
                    const isDupe = duplicateNames.has(file.name);
                    return (
                      <div
                        key={`${file.name}-${idx}`}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all gap-3 group ${
                          isDupe
                            ? "bg-amber-500/10 border-amber-500/40"
                            : "bg-[var(--bg)]/70 border-[var(--line)] hover:border-[var(--rose)]/60 hover:bg-[var(--bg)]"
                        }`}
                      >
                        <div
                          onClick={() => setInspectingFileIndex(idx)}
                          className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <BatchFileThumbnail file={file} />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-[var(--cream)] group-hover:text-[var(--rose)] transition-colors truncate">
                                {file.name}
                              </p>
                              {isDupe && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 shrink-0">
                                  Duplicate
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--cream)]/45 mt-1 font-serif italic">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                              {file.type.startsWith("video/") ? "Video clip" : "Photo"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectingFileIndex(idx)}
                            className="p-2 rounded-xl text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-[var(--paper)] transition-all cursor-pointer"
                            title="View full preview"
                          >
                            <IconEye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFileFromBatch(idx);
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                            title="Remove from batch"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
                  <PrimaryButton onClick={() => setShowBatchModal(false)}>
                    Done Reviewing ({files.length})
                  </PrimaryButton>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Lightbox Single File Modal */}
        <AnimatePresence>
          {inspectingFileIndex !== null && files[inspectingFileIndex] && (
            <SingleFilePreviewModal
              file={files[inspectingFileIndex]}
              index={inspectingFileIndex}
              total={files.length}
              onClose={() => setInspectingFileIndex(null)}
              onDelete={() => removeFileFromBatch(inspectingFileIndex)}
              onNext={() => {
                setInspectingFileIndex((prev) =>
                  prev !== null && prev < files.length - 1 ? prev + 1 : 0
                );
              }}
              onPrev={() => {
                setInspectingFileIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : files.length - 1
                );
              }}
            />
          )}
        </AnimatePresence>

        {/* Fullscreen Ambient AFK Mode Overlay */}
        <AnimatePresence>
          {isAfkActive && uploadProgress && (
            <AfkUploadOverlay
              current={uploadProgress.current}
              total={uploadProgress.total}
              currentFileName={uploadProgress.currentFileName}
              statusText={uploadProgress.statusText}
              onCancel={stopAllUploads}
            />
          )}
        </AnimatePresence>

        {/* Bulk Delete Modal */}
        <AnimatePresence>
          {showBulkDeleteModal && (
            <Modal title="Delete Selected Media?" onClose={() => !isBulkDeleting && setShowBulkDeleteModal(false)}>
              <div className="space-y-4">
                <p className="text-sm text-[var(--cream)]/75 leading-relaxed mb-6">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-rose-400 font-semibold">{selectedMediaIds.size} selected items</strong>? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <GhostButton
                    onClick={() => setShowBulkDeleteModal(false)}
                    disabled={isBulkDeleting}
                  >
                    Cancel
                  </GhostButton>
                  <DangerButton
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    className="flex items-center gap-2"
                  >
                    {isBulkDeleting ? <IconSpinner className="w-3.5 h-3.5" /> : <IconTrash className="w-3.5 h-3.5" />}
                    <span>{isBulkDeleting ? "Deleting..." : `Delete ${selectedMediaIds.size} Items`}</span>
                  </DangerButton>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Lightbox Media Modal */}
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

        {/* Confirm Delete Single Media Modal */}
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