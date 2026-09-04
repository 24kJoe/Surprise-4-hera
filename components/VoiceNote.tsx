"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Mic,
  Calendar,
  Heart,
  RotateCcw,
  RotateCw,
  Sparkles,
  Music2,
} from "lucide-react";

interface VoiceNote {
  id: string;
  title: string;
  date: string;
  caption: string;
  audioUrl: string;
  duration: string;
}

interface TimelineMilestone {
  date: string;
  title: string;
}

const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0) return "0:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Organic soundwave bar amplitudes
const WAVE_BARS = [
  28, 48, 72, 42, 65, 92, 80, 52, 68, 90, 100, 72, 48, 86, 96, 62, 42, 78,
  88, 56, 38, 68, 82, 92, 52, 74, 88, 42, 62, 34, 52, 76, 44, 66, 84, 50,
];

const FloatingHearts = memo(function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-300/25"
          style={{
            top: `${14 * i + 8}%`,
            left: `${(i * 19 + 7) % 92}%`,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: 4.5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-6 h-6 fill-rose-200/35" />
        </motion.div>
      ))}
    </div>
  );
});

const sampleVoiceNotes: VoiceNote[] = [
  {
    id: "1",
    title: "A voice note i really love to hear actually",
    date: "Mar 27, 2026",
    caption:
      "I don't know if i forced you to send it, but i glad i did because it makes my day everytime i hear it .",
    audioUrl: "/audio/LoveNote.mp3",
    duration: "0:07",
  },
  {
    id: "2",
    title: "You shouldn't have sent this one",
    date: "Mar 21, 2026",
    caption: "It's bad but cute in the same time .",
    audioUrl: "/audio/Zazabo3.mp3",
    duration: "0:11",
  },
  {
    id: "3",
    title: "Bahwak Song",
    date: "Mar 21, 2026",
    caption:
      "The only song you sang kinda good not that bad started getting better at the end, You sound so cute .",
    audioUrl: "/audio/BahwakSong.mp3",
    duration: "0:16",
  },
];

const timelineMilestones: TimelineMilestone[] = [
  { date: "Mar 27, 2026", title: "Love Note" },
  { date: "Mar 21, 2026", title: "Zaza Bo3" },
  { date: "Mar 21, 2026", title: "Bahwak" },
];

interface VoiceNoteCardProps {
  note: VoiceNote;
  isPlaying: boolean;
  isActive: boolean;
  currentTime: number;
  duration: number;
  onToggle: (note: VoiceNote) => void;
  onSeekFraction: (noteId: string, fraction: number) => void;
  onSkip: (noteId: string, deltaSeconds: number) => void;
}

const VoiceNoteCard = memo(function VoiceNoteCard({
  note,
  isPlaying,
  isActive,
  currentTime,
  duration,
  onToggle,
  onSeekFraction,
  onSkip,
}: VoiceNoteCardProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const progress =
    isActive && duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const handleWaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeekFraction(note.id, fraction);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative rounded-3xl p-6 sm:p-7 border backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isPlaying
          ? "bg-gradient-to-b from-white via-white/95 to-rose-50/40 border-[var(--rose)] shadow-xl shadow-rose-950/5 ring-1 ring-[var(--rose)]/30"
          : "bg-white/75 border-rose-100/90 shadow-sm hover:bg-white/95 hover:border-rose-200/90 hover:shadow-md"
      }`}
    >
      {/* Decorative Top Accent */}
      <div
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--rose)] to-transparent transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        }`}
      />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[rgb(74,32,58)] tracking-tight truncate">
              {note.title}
            </h3>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-[var(--rose)] border border-rose-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose)]" />
                Listening
              </span>
            )}
          </div>
          <p className="text-xs text-rose-400 mt-1 font-sans flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-rose-300" />
            {note.date}
          </p>
        </div>

        <span className="self-start text-[11px] font-mono font-medium text-[var(--rose)] bg-rose-50/80 px-3 py-1 rounded-full border border-rose-100 shrink-0">
          {isActive && duration > 0 ? formatTime(duration) : note.duration}
        </span>
      </div>

      {/* Caption / Note */}
      {note.caption && (
        <p className="text-xs sm:text-sm leading-relaxed text-rose-900/75 italic font-serif mb-5 pl-3 border-l-2 border-rose-200/70">
          &ldquo;{note.caption}&rdquo;
        </p>
      )}

      {/* Compact Interactive Player Pod */}
      <div className="rounded-2xl p-3 sm:p-4 bg-white/70 border border-rose-100/90 shadow-xs flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSkip(note.id, -5)}
            disabled={!isActive}
            title="Rewind 5s"
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:text-[var(--rose)] hover:bg-rose-50 disabled:opacity-25 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggle(note)}
            className="w-11 h-11 rounded-full bg-[var(--rose)] hover:opacity-95 text-white flex items-center justify-center shadow-md shadow-rose-950/15 transition-all active:scale-95 cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSkip(note.id, 5)}
            disabled={!isActive}
            title="Forward 5s"
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:text-[var(--rose)] hover:bg-rose-50 disabled:opacity-25 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Waveform & Scrubber */}
        <div className="w-full flex-1 flex flex-col gap-1.5">
          <div
            ref={progressBarRef}
            onClick={handleWaveClick}
            className="group/track relative h-10 w-full flex items-center gap-[2.5px] sm:gap-1 cursor-pointer select-none px-1.5 rounded-xl hover:bg-rose-50/60 transition-colors"
            title="Click anywhere to jump"
          >
            {WAVE_BARS.map((heightPct, idx) => {
              const barFraction = idx / WAVE_BARS.length;
              const isPast = progress >= barFraction;
              return (
                <motion.div
                  key={idx}
                  className="flex-1 rounded-full transition-colors duration-150"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isPast
                      ? "var(--rose)"
                      : "rgba(244, 114, 182, 0.28)",
                  }}
                  animate={
                    isPlaying && isPast
                      ? {
                          scaleY: [1, 1.28, 0.82, 1],
                        }
                      : { scaleY: 1 }
                  }
                  transition={{
                    repeat: isPlaying && isPast ? Infinity : 0,
                    duration: 0.85,
                    delay: (idx % 4) * 0.12,
                  }}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-rose-400 font-mono font-medium px-1">
            <span>{isActive ? formatTime(currentTime) : "0:00"}</span>
            <span>{isActive ? formatTime(duration) : note.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Voicenotes() {
  const [voiceNotes] = useState<VoiceNote[]>(sampleVoiceNotes);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedNoteIdRef = useRef<string | null>(null);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = useCallback(() => {
    setPlayingId(null);
    setCurrentTime(0);
  }, []);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("timeupdate", updateTime);
      audioRef.current.removeEventListener("ended", handleEnded);
      audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current = null;
    }
    loadedNoteIdRef.current = null;
  }, [handleEnded]);

  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  const togglePlay = useCallback(
    (note: VoiceNote) => {
      if (playingId === note.id && audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
        return;
      }

      if (loadedNoteIdRef.current === note.id && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setPlayingId(note.id))
          .catch((err) => console.error("Playback error:", err));
        return;
      }

      cleanupAudio();
      const audio = new Audio(note.audioUrl);
      audioRef.current = audio;
      loadedNoteIdRef.current = note.id;

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      setCurrentTime(0);
      setDuration(0);
      setActiveId(note.id);

      audio
        .play()
        .then(() => setPlayingId(note.id))
        .catch((err) => console.error("Playback error:", err));
    },
    [playingId, cleanupAudio, handleEnded]
  );

  const handleSeekFraction = useCallback((noteId: string, fraction: number) => {
    if (loadedNoteIdRef.current === noteId && audioRef.current) {
      const targetTime = fraction * (audioRef.current.duration || 0);
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  }, []);

  const handleSkip = useCallback((noteId: string, deltaSeconds: number) => {
    if (loadedNoteIdRef.current === noteId && audioRef.current) {
      const newTime = Math.max(
        0,
        Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + deltaSeconds)
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  return (
    <section id="voicenotes" className="relative w-full py-16 px-4 overflow-hidden">
      <FloatingHearts />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.25em] font-semibold text-[var(--rose)] uppercase bg-rose-100/70 px-4 py-1.5 rounded-full border border-rose-200/60 mb-3 shadow-xs">
            <Mic className="w-3.5 h-3.5" /> Audio Keepsakes
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[rgb(74,32,58)] tracking-tight font-medium">
            Voices I&apos;ll Never Forget
          </h2>
          <p className="mt-3 text-sm sm:text-base text-rose-900/65 max-w-md mx-auto italic font-serif">
            A small archive of voice notes, quiet thoughts, and spontaneous songs saved forever.
          </p>
        </div>

        {/* Milestone Cards Header */}
        {voiceNotes.length > 0 && (
          <div className="mb-10 p-5 sm:p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--rose)] uppercase flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5" /> Memory Milestones
              </span>
              <span className="text-xs text-rose-400 font-serif italic">
                {timelineMilestones.length} moments recorded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timelineMilestones.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 flex flex-col gap-0.5 hover:bg-rose-50 transition-colors"
                >
                  <span className="text-[10px] font-medium text-rose-400 font-mono">
                    {item.date}
                  </span>
                  <span className="text-xs font-semibold text-[rgb(74,32,58)] truncate">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        {voiceNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white/80 backdrop-blur-md rounded-3xl border border-rose-200/70 shadow-sm max-w-md mx-auto"
          >
            <div className="w-14 h-14 bg-rose-100/80 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--rose)] shadow-inner">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[rgb(74,32,58)] mb-2 font-medium">
              No Voice Notes Yet
            </h3>
            <p className="text-xs sm:text-sm text-rose-800/70 leading-relaxed italic font-serif">
              &ldquo;Every beautiful story begins with a voice. Add your first
              memory to start this collection.&rdquo;
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            <AnimatePresence>
              {voiceNotes.map((note) => {
                const isPlaying = playingId === note.id;
                const isActive = activeId === note.id;
                return (
                  <VoiceNoteCard
                    key={note.id}
                    note={note}
                    isPlaying={isPlaying}
                    isActive={isActive}
                    currentTime={isActive ? currentTime : 0}
                    duration={isActive ? duration : 0}
                    onToggle={togglePlay}
                    onSeekFraction={handleSeekFraction}
                    onSkip={handleSkip}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Subtle Sign-off Footer */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-rose-400 font-serif italic">
          <Sparkles className="w-3.5 h-3.5 text-rose-300" />
          <span>Press play to hear the voices we saved along the way</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-300" />
        </div>
      </div>
    </section>
  );
}