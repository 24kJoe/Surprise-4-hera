"use client";

import { useState, useTransition } from "react";
import { saveLetter } from "@/lib/letters/actions";
import { letterLimit, type SavedLetter } from "@/lib/letters/types";

type Day = { date: string; content: string; dayNumber: number };

const dateLabel = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long", timeZone: "UTC",
});
const formatDate = (date: string) => dateLabel.format(new Date(date));

export default function DailyLetterEditor({ dates, letters, today }: {
  dates: Day[]; letters: SavedLetter[]; today: string;
}) {
  const [saved, setSaved] = useState(() => new Map(letters.map((letter) => [letter.date, letter])));
  const [date, setDate] = useState(dates.find((day) => day.date >= today)?.date ?? dates[dates.length - 1].date);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const letter = saved.get(date);
  const text = edits[date] ?? letter?.draft ?? letter?.published ?? dates.find((day) => day.date === date)?.content ?? "";
  const future = date > today;
  const todaySlot = dates.find((day) => day.date === today);
  const todaySaved = saved.get(today);
  const todayStatus = todaySaved?.published || todaySlot?.content.trim() ? "Already written" :
    todaySaved?.draft ? "Draft saved" : "Needs a letter";
  const nextBlank = dates.find((day) => {
    const existing = saved.get(day.date);
    return day.date >= today && !day.content.trim() && !existing?.draft && !existing?.published && !edits[day.date]?.trim();
  });

  function selectDate(value: string) {
    setDate(value);
    setMessage("");
  }

  function save(mode: "draft" | "publish") {
    setMessage("");
    startTransition(async () => {
      try {
        const updated = await saveLetter(date, text, mode);
        setSaved((current) => new Map(current).set(date, updated));
        setEdits((current) => {
          const next = { ...current };
          delete next[date];
          return next;
        });
        setMessage(mode === "draft" ? "Private draft saved." : future ? "Letter scheduled." : "Letter published.");
      } catch {
        setMessage("Could not save. If your session expired, sign in again in another tab.");
      }
    });
  }

  return (
    <section className="mb-8 rounded-3xl border border-rose-200 bg-white p-5 sm:p-8">
      <h1 className="font-serif text-3xl">Daily Letters</h1>
      <p className="mt-2 text-sm">Scheduled letters unlock at midnight in Cairo.</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
        <div>
          <h2 className="font-semibold">Today’s letter · {formatDate(today)}</h2>
          <p className="mt-1 text-sm">{todaySlot ? "Day " + todaySlot.dayNumber + " · " + todayStatus : "No letter scheduled today."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {todaySlot && <button type="button" disabled={pending || date === today} onClick={() => selectDate(today)}
            className="rounded-full border border-rose-300 bg-white px-3 py-2 text-sm disabled:opacity-50">Open today</button>}
          {nextBlank && nextBlank.date !== today && (
            <button type="button" disabled={pending || date === nextBlank.date} onClick={() => selectDate(nextBlank.date)}
              className="rounded-full border border-rose-300 bg-white px-3 py-2 text-sm disabled:opacity-50">
              Next blank · {formatDate(nextBlank.date)}
            </button>
          )}
        </div>
      </div>
      <label className="mt-5 grid gap-2">
        Letter date
        <input type="date" value={date} min={dates[0].date} max={dates[dates.length - 1].date}
          disabled={pending} onChange={(event) => {
            if (dates.some((day) => day.date === event.target.value)) selectDate(event.target.value);
          }} className="w-fit rounded-xl border border-rose-200 p-2" />
      </label>
      <label className="mt-4 grid gap-2">
        Letter
        <textarea dir="auto" rows={7} maxLength={letterLimit} disabled={pending} value={text}
          onChange={(event) => setEdits({ ...edits, [date]: event.target.value })}
          className="rounded-xl border border-rose-200 p-3 text-start" />
      </label>
      <details className="mt-4 rounded-2xl bg-rose-50 p-4">
        <summary className="cursor-pointer">Preview</summary>
        <p dir="auto" className="mt-3 whitespace-pre-wrap break-words text-start font-serif text-lg">
          {text.trim() || "Your letter will appear here."}
        </p>
      </details>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={pending || !text.trim()} onClick={() => save("draft")}
          className="rounded-full border border-rose-300 px-4 py-2 disabled:opacity-50">Save private draft</button>
        <button type="button" disabled={pending || !text.trim()} onClick={() => save("publish")}
          className="rounded-full bg-[#a83c66] px-4 py-2 text-white disabled:opacity-50">
          {future ? "Schedule letter" : "Publish letter"}
        </button>
      </div>
      <p className="mt-3 text-sm" role="status">{pending ? "Saving…" : message}</p>
    </section>
  );
}
