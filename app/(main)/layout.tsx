"use client";

import { useState, useEffect } from "react";
import PasswordGate from "@/components/PasswordGate";
import WelcomeScreen from "@/components/WelcomeScreen";
import Nav from "@/components/Nav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [started, setStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // We only persist the password unlock status if desired, 
        // or clear `mainStarted` so WelcomeScreen always plays on refresh
        const mainAuth = sessionStorage.getItem("main_unlocked");

        if (mainAuth === "true") {
            setIsUnlocked(true);
        }

        // Always reset `started` to false on fresh load/refresh
        setStarted(false);
        setIsLoading(false);
    }, []);

    const handleUnlock = () => {
        sessionStorage.setItem("main_unlocked", "true");
        setIsUnlocked(true);
    };

    const handleStart = () => {
        // Updated: Removed setting sessionStorage for `main_started`
        setStarted(true);
    };

    if (isLoading) {
        return null;
    }

    return (
        <>
            {!isUnlocked && (
                <PasswordGate
                    unlocked={isUnlocked}
                    onUnlock={handleUnlock}
                    title="Enter Password"
                    expectedPassword="1231"
                />
            )}

            {isUnlocked && !started && (
                <WelcomeScreen onComplete={handleStart} />
            )}

            {isUnlocked && started && (
                <main className="w-full min-h-screen">
                    <Nav />
                    {children}
                </main>
            )}
        </>
    );
}