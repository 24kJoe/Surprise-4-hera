import { Suspense } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSignIn from "@/components/admin/AdminSignIn";
import DailyLetterEditor from "@/components/admin/DailyLetterEditor";
import { signOut } from "@/lib/admin/actions";
import { adminConfigured, isAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/services/prisma";
import { cairoDay, schedule } from "@/lib/letters/schedule";

export const instant = false;

async function AdminContent() {
  if (!adminConfigured()) return <p>Admin sign-in hasn’t been configured.</p>;
  if (!(await isAdmin())) return <AdminSignIn />;

  const letters = await prisma.dailyLetter.findMany().catch(() => null);
  return (
    <AdminDashboard signOutAction={signOut} dailyLetters={letters ? (
      <DailyLetterEditor dates={schedule.map(({ date, content, dayNumber }) => ({ date, content, dayNumber }))}
        letters={letters} today={cairoDay()} />
    ) : <p role="alert">Letters are unavailable. Try refreshing.</p>} />
  );
}

export default function AdminPage() {
  return <Suspense fallback={<p>Loading admin…</p>}><AdminContent /></Suspense>;
}
