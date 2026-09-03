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

// Generates static aesthetic wave bar patterns per note
const WAVE_BARS = [
  25, 45, 75, 40, 60, 95, 80, 50, 65, 90, 100, 70, 45, 85, 95, 60, 40, 75,
  85, 55, 35, 65, 80, 90, 50, 70, 85, 40, 60, 30, 50, 75,
];

const FloatingHearts = memo(function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300/30"
          style={{
            top: `${15 * i + 10}%`,
            left: `${(i * 18) % 90}%`,
          }}
          animate={{
            y: [0, -14, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-6 h-6 fill-pink-200/40" />
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
      transition={{ duration: 0.2 }}
      className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 ${
        isPlaying
          ? "bg-white/95 border-[var(--rose)] shadow-lg shadow-rose-950/5 ring-2 ring-[var(--rose)]/20"
          : "bg-white/70 border-pink-200/60 shadow-sm hover:bg-white/90 hover:border-pink-300/80"
      }`}
    >
      {/* Top Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[rgb(74,32,58)]">
              {note.title}
            </h2>
            {isPlaying && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-[var(--rose)] border border-rose-200/60 animate-pulse">
                Playing
              </span>
            )}
          </div>
          <p className="text-xs text-pink-400/80 mt-0.5 font-sans">{note.date}</p>
        </div>
        <span className="self-start sm:self-center text-xs font-semibold text-[var(--rose)] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          {isActive && duration > 0 ? formatTime(duration) : note.duration}
        </span>
      </div>

      {note.caption && (
        <p className="text-xs sm:text-sm text-pink-900/70 mb-5 leading-relaxed italic font-serif">
          &ldquo;{note.caption}&rdquo;
        </p>
      )}

      {/* Audio Player Strip */}
      <div className="bg-rose-50/70 p-3 sm:p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-center gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onSkip(note.id, -5)}
            disabled={!isActive}
            title="Rewind 5s"
            className="p-2 rounded-full text-pink-700/60 hover:text-[var(--rose)] hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggle(note)}
            className="w-12 h-12 rounded-full bg-[var(--rose)] hover:opacity-90 text-white flex items-center justify-center shadow-md shadow-rose-950/15 transition-all active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSkip(note.id, 5)}
            disabled={!isActive}
            title="Forward 5s"
            className="p-2 rounded-full text-pink-700/60 hover:text-[var(--rose)] hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Waveform & Scrubber */}
        <div className="w-full flex-1 flex flex-col gap-1.5">
          <div
            ref={progressBarRef}
            onClick={handleWaveClick}
            className="group relative h-9 w-full flex items-center gap-0.5 sm:gap-1 cursor-pointer select-none px-1 rounded-xl hover:bg-white/40 transition-colors"
            title="Click to jump"
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
                      : "rgba(244, 114, 182, 0.35)",
                  }}
                  animate={
                    isPlaying && isPast
                      ? {
                          scaleY: [1, 1.25, 0.85, 1],
                        }
                      : { scaleY: 1 }
                  }
                  transition={{
                    repeat: isPlaying && isPast ? Infinity : 0,
                    duration: 0.8,
                    delay: (idx % 4) * 0.15,
                  }}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-pink-400 font-medium px-1 font-mono">
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
      // Toggle pause if active
      if (playingId === note.id && audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
        return;
      }

      // Resume current audio
      if (loadedNoteIdRef.current === note.id && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setPlayingId(note.id))
          .catch((err) => console.error("Playback error:", err));
        return;
      }

      // Load new track
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto px-4 py-8 overflow-hidden"
    >
      <FloatingHearts />

      {/* Header Section */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs tracking-widest font-semibold text-[var(--rose)] uppercase bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200/50 mb-3 shadow-xs">
          <Mic className="w-3.5 h-3.5" /> Voice Archives
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[rgb(74,32,58)] tracking-tight">
          Voices I&apos;ll Never Forget
        </h1>
        <p className="mt-2 text-sm sm:text-base text-pink-700/80 max-w-md mx-auto italic font-light">
          A collection of cherished recordings, quiet thoughts, and unforgettable
          moments saved just for us.
        </p>
      </div>

      {/* Optional Memory Timeline */}
      {voiceNotes.length > 0 && (
        <div className="mb-10 p-4 sm:p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-pink-200/60 shadow-sm">
          <h3 className="text-xs font-bold tracking-wider text-[var(--rose)] uppercase mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Timeline Milestones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {timelineMilestones.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col gap-0.5"
              >
                <span className="text-[10px] font-semibold text-pink-400">
                  {item.date}
                </span>
                <span className="text-xs font-medium text-[rgb(74,32,58)]">
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 bg-white/70 backdrop-blur-md rounded-3xl border border-pink-200/70 shadow-sm max-w-md mx-auto"
        >
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--rose)] shadow-inner">
            <Volume2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-serif text-[rgb(74,32,58)] mb-2">
            No Voice Notes Yet
          </h2>
          <p className="text-sm text-pink-600/80 leading-relaxed italic">
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
    </motion.div>
  );
}