"use client";

import { useState } from "react";
import PasswordGate from "@/components/PasswordGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <>
      <PasswordGate
        type="admin"
        unlocked={isUnlocked}
        onUnlock={() => setIsUnlocked(true)}
        expectedPassword="Joe2112008"
      />
      {isUnlocked ? children : null}
    </>
  );
}