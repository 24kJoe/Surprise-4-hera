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
        const mainAuth = sessionStorage.getItem("main_unlocked");
        const hasStarted = sessionStorage.getItem("main_started");

        if (mainAuth === "true") {
            setIsUnlocked(true);
        }

        if (hasStarted === "true") {
            setStarted(true);
        }

        setIsLoading(false);
    }, []);

    const handleUnlock = () => {
        sessionStorage.setItem("main_unlocked", "true");
        setIsUnlocked(true);
    };

    const handleStart = () => {
        sessionStorage.setItem("main_started", "true");
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
                    expectedPassword="151009"
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