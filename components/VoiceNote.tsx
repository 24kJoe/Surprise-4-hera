"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Mic, Calendar, Heart } from "lucide-react";

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
  if (isNaN(secs)) return "0:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

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
            y: [0, -12, 0],
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
    caption: "I don't know if i forced you to send it, but i glad i did because it makes my day everytime i hear it .",
    audioUrl: "/audio/LoveNote.mp3",
    duration: "0:07"
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
    caption: "The only song you sang kinda good not that bad started getting better at the end, You sound so cute .",
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
  onSeek: (noteId: string, value: number) => void;
}

const VoiceNoteCard = memo(function VoiceNoteCard({
  note,
  isPlaying,
  isActive,
  currentTime,
  duration,
  onToggle,
  onSeek,
}: VoiceNoteCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`p-5 sm:p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
        isPlaying
          ? "bg-white/95 border-pink-300 shadow-md ring-2 ring-pink-200/50"
          : "bg-white/70 border-pink-200/60 shadow-xs hover:bg-white/90 hover:border-pink-300/80"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-[rgb(74,32,58)]">{note.title}</h2>
            {isPlaying && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-100 text-pink-600 animate-pulse">
                Playing...
              </span>
            )}
          </div>
          <p className="text-xs text-pink-400 mt-0.5">{note.date}</p>
        </div>
        <span className="self-start sm:self-center text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
          {note.duration}
        </span>
      </div>

      {note.caption && (
        <p className="text-xs sm:text-sm text-pink-800/70 mb-5 leading-relaxed italic">
          "{note.caption}"
        </p>
      )}

      {/* Audio Controls */}
      <div className="flex items-center gap-3 bg-pink-50/60 p-3 rounded-xl border border-pink-100/80">
        <button
          onClick={() => onToggle(note)}
          className="w-11 h-11 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-sm hover:shadow transition-all shrink-0 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max={isActive && duration > 0 ? duration : 100}
            value={isActive ? currentTime : 0}
            onChange={(e) => onSeek(note.id, Number(e.target.value))}
            disabled={!isActive}
            className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-pink-400 font-medium px-0.5">
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
  const rafIdRef = useRef<number | null>(null);

  const startTicking = useCallback(() => {
    const tick = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTicking = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleEnded = useCallback(() => {
    stopTicking();
    setPlayingId(null);
    setActiveId(null);
    setCurrentTime(0);
  }, [stopTicking]);

  const cleanupAudio = useCallback(() => {
    stopTicking();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", handleEnded);
      audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current = null;
    }
    loadedNoteIdRef.current = null;
  }, [stopTicking, handleEnded, handleLoadedMetadata]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const togglePlay = useCallback((note: VoiceNote) => {
    setPlayingId((current) => {
      if (current === note.id) {
        audioRef.current?.pause();
        stopTicking();
        return null;
      }
      if (loadedNoteIdRef.current === note.id && audioRef.current) {
        audioRef.current.play();
        startTicking();
        return note.id;
      }
      cleanupAudio();

      const audio = new Audio(note.audioUrl);
      audioRef.current = audio;
      loadedNoteIdRef.current = note.id;

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      setCurrentTime(0);
      setDuration(0);
      audio.play();
      startTicking();
      return note.id;
    });
    setActiveId(note.id);
  }, [cleanupAudio, handleEnded, handleLoadedMetadata, startTicking, stopTicking]);

  const handleSeek = useCallback((noteId: string, value: number) => {
    if (loadedNoteIdRef.current === noteId && audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
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
      {/* Floating Decorative Background Hearts */}
      <FloatingHearts />

      {/* Header Section */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs tracking-widest font-semibold text-pink-500 uppercase bg-pink-100/80 px-3 py-1 rounded-full border border-pink-200/50 mb-3 shadow-xs">
          <Mic className="w-3.5 h-3.5" /> Voice Archives
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[rgb(74,32,58)] tracking-tight">
          Voices I'll Never Forget
        </h1>
        <p className="mt-2 text-sm sm:text-base text-pink-700/80 max-w-md mx-auto italic font-light">
          A collection of cherished recordings, quiet thoughts, and unforgettable moments saved just for us.
        </p>
      </div>

      {/* Optional Memory Timeline */}
      {voiceNotes.length > 0 && (
        <div className="mb-12 p-4 sm:p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-pink-200/60 shadow-sm">
          <h3 className="text-xs font-bold tracking-wider text-pink-500 uppercase mb-4 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Timeline Milestones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {timelineMilestones.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-pink-50/50 rounded-xl border border-pink-100/80 flex flex-col gap-1"
              >
                <span className="text-[10px] font-semibold text-pink-400">{item.date}</span>
                <span className="text-xs font-medium text-[rgb(74,32,58)]">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {voiceNotes.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 bg-white/70 backdrop-blur-md rounded-3xl border border-pink-200/70 shadow-sm max-w-md mx-auto"
        >
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500 shadow-inner">
            <Volume2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-serif text-[rgb(74,32,58)] mb-2">No Voice Notes Yet</h2>
          <p className="text-sm text-pink-600/80 leading-relaxed italic">
            "Every beautiful story begins with a voice. Add your first memory to start this collection."
          </p>
        </motion.div>
      ) : (
        /* Voice Note Cards Grid */
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
                  onSeek={handleSeek}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}