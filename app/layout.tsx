import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Fraunces, Sora } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Our Story",
  description: "A little letter for you.",
};

async function RequestContent({ children }: { children: React.ReactNode }) {
  await connection();
  return children;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sora.variable}`}>
      <body>
        <Suspense fallback={<div role="status" className="p-8 text-center">Loading…</div>}>
          <RequestContent>{children}</RequestContent>
        </Suspense>
      </body>
    </html>
  );
}
