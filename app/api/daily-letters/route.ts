import { connection } from "next/server";
import { cairoDay, schedule } from "@/lib/letters/schedule";
import { prisma } from "@/lib/services/prisma";

export async function GET() {
  await connection();
  const today = cairoDay();
  const records = await prisma.dailyLetter.findMany({
    where: { date: { lte: today }, published: { not: null } },
    select: { date: true, published: true },
  }).catch(() => {
    console.error("Daily letters database unavailable");
    return [];
  });
  const published = new Map(records.map((letter) => [letter.date, letter.published]));
  return Response.json(schedule.map(({ date, id, dayNumber, unlockDate, content }) => ({
    id, dayNumber, unlockDate, content: date <= today ? (published.get(date) ?? content) : "",
  })), { headers: { "Cache-Control": "no-store" } });
}
