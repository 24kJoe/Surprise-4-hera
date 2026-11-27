export type DailyReason = { id: string; dayNumber: number; unlockDate: string; content: string };
export type SavedLetter = { date: string; draft: string | null; published: string | null };
export const letterLimit = 5000;
