import { connection } from "next/server";
import { cairoDay, schedule } from "@/lib/letters/schedule";
import { prisma } from "@/lib/services/prisma";

export async function GET() {
  await connection();
  const now = Date.now();
  const today = cairoDay(now);
  // Temporary live test. Remove this override to restore Day 46's normal release.
  const previewDay = schedule.find((day) => day.dayNumber === 46);
  const records = await prisma.dailyLetter.findMany({
    where: {
      OR: previewDay ? [{ date: { lte: today } }, { date: previewDay.date }] : [{ date: { lte: today } }],
      published: { not: null },
    },
    select: { date: true, published: true },
  }).catch(() => {
    console.error("Daily letters database unavailable");
    return [];
  });
  const published = new Map(records.map((letter) => [letter.date, letter.published]));
  return Response.json(schedule.map(({ date, id, dayNumber, unlockDate, content }) => ({
    id,
    dayNumber,
    unlockDate: date === previewDay?.date ? new Date(now - 60_000).toISOString() : unlockDate,
    content: date === previewDay?.date
      ? (published.get(date) || content || "This is a test letter for Day " + dayNumber + ".")
      : date <= today ? (published.get(date) ?? content) : "",
  })), { headers: { "Cache-Control": "no-store" } });
}
