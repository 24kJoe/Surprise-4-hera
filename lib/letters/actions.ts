"use server";

import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/services/prisma";
import { schedule } from "./schedule";
import { letterLimit } from "./types";

export async function saveLetter(date: string, text: string, mode: "draft" | "publish") {
  await requireAdmin();
  if (typeof text !== "string" || !text.trim() || text.length > letterLimit ||
      !schedule.some((day) => day.date === date) || (mode !== "draft" && mode !== "publish")) {
    throw new Error("Invalid letter");
  }
  const update = mode === "draft" ? { draft: text.trim() } : { draft: null, published: text.trim() };
  const select = { date: true, draft: true, published: true } as const;
  try {
    return await prisma.dailyLetter.upsert({ where: { date }, create: { date, ...update }, update, select });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "P2002")) throw error;
    return prisma.dailyLetter.update({ where: { date }, data: update, select });
  }
}
