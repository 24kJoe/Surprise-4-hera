"use client";

import { useState, useTransition } from "react";
import { saveLetter } from "@/lib/letters/actions";
import { letterLimit, type SavedLetter } from "@/lib/letters/types";

type Day = { date: string; content: string; dayNumber: number };

const dateLabel = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long", timeZone: "UTC",
});
const formatDate = (date: string) => dateLabel.format(new Date(date));
const navigationButton = "inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-40";

function hasLetter(day: Day, saved?: SavedLetter) {
  return Boolean(day.content.trim() || saved?.draft?.trim() || saved?.published?.trim());
}

export default function DailyLetterEditor({ dates, letters, today }: {
  dates: Day[]; letters: SavedLetter[]; today: string;
}) {
  const [saved, setSaved] = useState(() => new Map(letters.map((letter) => [letter.date, letter])));
  const [date, setDate] = useState(() => {
    const todaySlot = dates.find((day) => day.date === today);
    const todaySaved = saved.get(today);
    if (todaySlot && (todaySaved?.draft?.trim() || !hasLetter(todaySlot, todaySaved))) {
      return today;
    }
    return dates.find((day) => day.date >= today && !hasLetter(day, saved.get(day.date)))?.date
      ?? todaySlot?.date
      ?? dates.find((day) => day.date >= today)?.date
      ?? dates[dates.length - 1].date;
  });
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const selectedIndex = dates.findIndex((day) => day.date === date);
  const selected = dates[selectedIndex];
  const letter = saved.get(date);
  const savedText = letter?.draft ?? letter?.published ?? selected.content;
  const text = edits[date] ?? savedText;
  const future = date > today;
  const todaySlot = dates.find((day) => day.date === today);
  const nextBlank = dates.find((day) => day.date >= today && day.date > date &&
    !hasLetter(day, saved.get(day.date)) && !edits[day.date]?.trim());
  const hasText = Boolean(text.trim());
  const status = text !== savedText ? "Unsaved changes" :
    letter?.draft?.trim() ? "Private draft" :
    (letter?.published?.trim() || selected.content.trim()) ? (future ? "Scheduled" : "Published") : "Needs a letter";

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
    <section className="mx-auto max-w-4xl rounded-3xl border border-rose-200 bg-white p-4 sm:p-6" aria-labelledby="letter-date-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div aria-live="polite">
          <p className="mb-1 text-sm font-medium text-[#956076]">
            {date === today ? "Today · " : ""}Day {selected.dayNumber}
          </p>
          <h2 id="letter-date-heading" className="font-serif text-2xl sm:text-3xl">
            {formatDate(date)}
          </h2>
          <p className="mt-1 text-sm text-[#956076]">{status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {todaySlot && date !== today && (
            <button type="button" disabled={pending} onClick={() => selectDate(today)} className={navigationButton}>
              Today
            </button>
          )}
          {nextBlank && (
            <button type="button" disabled={pending} onClick={() => selectDate(nextBlank.date)} className={navigationButton}>
              Next blank
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-rose-100 py-3">
        {[-1, 1].map((step) => {
          const neighbor = dates[selectedIndex + step];
          const label = step < 0 ? "Previous day" : "Next day";
          return (
            <button key={step} type="button" disabled={pending || !neighbor}
              onClick={() => selectDate(neighbor.date)} className={navigationButton}>
              {label}
            </button>
          );
        })}
        <input type="date" aria-label="Jump to a letter date" value={date} min={dates[0].date} max={dates[dates.length - 1].date}
          disabled={pending} onChange={(event) => {
            if (dates.some((day) => day.date === event.target.value)) selectDate(event.target.value);
          }} className="min-h-10 rounded-xl border border-rose-200 bg-white px-2 text-sm" />
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium">
        Letter
        <textarea dir="auto" rows={5} maxLength={letterLimit} disabled={pending} value={text}
          placeholder="Write your letter here…"
          onChange={(event) => setEdits({ ...edits, [date]: event.target.value })}
          className="min-h-32 w-full rounded-xl border border-rose-200 p-3 text-start text-base font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={pending || !hasText} onClick={() => save("publish")}
          className="min-h-11 rounded-xl bg-[#a83c66] px-4 py-2 text-sm font-semibold text-white hover:bg-[#893153] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-50">
          {future ? "Schedule letter" : "Publish letter"}
        </button>
        <button type="button" disabled={pending || !hasText} onClick={() => save("draft")}
          className={navigationButton}>Save draft</button>
      </div>
      <p className="mt-2 text-sm text-[#956076]" role="status">
        {pending ? "Saving…" : message || (future ? "Scheduled letters go live at midnight Cairo time." : "Drafts are only visible here.")}
      </p>

      {hasText && (
        <details className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">Preview letter</summary>
          <p dir="auto" className="mt-3 whitespace-pre-wrap break-words text-start font-serif text-lg">{text.trim()}</p>
        </details>
      )}
    </section>
  );
}
