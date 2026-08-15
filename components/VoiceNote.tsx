"use client";

import React, { useState, useRef, useEffect } from "react";
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

// Optional data array — leave empty [] to trigger the empty state view
const sampleVoiceNotes: VoiceNote[] = [
  {
    id: "1",
    title: "Our Very First Voice Note",
    date: "Jan 17, 2026",
    caption: "The first time you sent me a recording and made me smile all day.",
    audioUrl: "/audio/note1.mp3", // Place audio files in public/audio/
    duration: "0:45",
  },
  {
    id: "2",
    title: "Late Night Whispers",
    date: "Feb 14, 2026",
    caption: "Just checking in before sleep to remind you how much you mean to me.",
    audioUrl: "/audio/note2.mp3",
    duration: "1:20",
  },
];

const timelineMilestones: TimelineMilestone[] = [
  { date: "Jan 17, 2026", title: "First Recorded Memory" },
  { date: "Feb 14, 2026", title: "Valentine's Message" },
  { date: "Aug 2026", title: "Birthday Special" },
];

export default function Voicenotes() {
  const [voiceNotes] = useState<VoiceNote[]>(sampleVoiceNotes);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setPlayingId(null);
    setCurrentTime(0);
  };

  const togglePlay = (note: VoiceNote) => {
    if (playingId === note.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(note.audioUrl);
      audioRef.current = audio;
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.play();
      setPlayingId(note.id);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>, noteId: string) => {
    if (playingId === noteId && audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto px-4 py-8 overflow-hidden"
    >
      {/* Floating Decorative Background Hearts */}
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

              return (
                <motion.div
                  key={note.id}
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
                      onClick={() => togglePlay(note)}
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
                        max={isPlaying ? duration : 100}
                        value={isPlaying ? currentTime : 0}
                        onChange={(e) => handleSeek(e, note.id)}
                        disabled={!isPlaying}
                        className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <div className="flex justify-between text-[10px] text-pink-400 font-medium px-0.5">
                        <span>{isPlaying ? formatTime(currentTime) : "0:00"}</span>
                        <span>{isPlaying ? formatTime(duration) : note.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}