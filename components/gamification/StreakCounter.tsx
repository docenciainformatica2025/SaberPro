"use client";

import { useAuth } from "@/context/AuthContext";
import { Flame } from "lucide-react";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StreakCounter() {
    const { profile, user } = useAuth();
    const [animated, setAnimated] = useState(false);

    // Safe access to streak data
    const streak = profile?.gamification?.streak?.current || 0;
    const lastActive = profile?.gamification?.streak?.lastActiveDate;

    // Optional: Check if streak is "at risk" (not completed today)
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = lastActive === today;
    const isAtRisk = !isCompletedToday && streak > 0;

    useEffect(() => {
        if (streak > 0) {
            const initialTimer = setTimeout(() => setAnimated(true), 100);
            const timer = setTimeout(() => setAnimated(false), 2100);
            return () => {
                clearTimeout(initialTimer);
                clearTimeout(timer);
            };
        }
    }, [streak]);

    if (!profile) return null;

    return (
        <div
            className={`
                relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300
                ${isCompletedToday
                    ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-500"
                    : "bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] text-theme-text-secondary grayscale hover:grayscale-0 hover:border-brand-primary/30 hover:text-brand-primary"
                }
            `}
            title={isCompletedToday ? "¡Racha diaria completada!" : "¡Completa un simulacro para mantener tu racha!"}
        >
            <div className={`relative ${isCompletedToday ? "animate-pulse" : ""}`}>
                <Flame
                    size={18}
                    className={`
                        transition-all duration-500
                        ${isCompletedToday ? "fill-orange-500 text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "fill-transparent text-current"}
                        ${animated ? "scale-125 rotate-12" : ""}
                    `}
                />

                {/* Particle Effects for active streak */}
                {isCompletedToday && (
                    <>
                        <div className="absolute -top-1 left-0 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-75" />
                        <div className="absolute top-1 -right-1 w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-100 opacity-75" />
                    </>
                )}
            </div>

            <span className={`text-sm font-semibold tracking-tight ${isCompletedToday ? "text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-600" : ""}`}>
                {streak}
            </span>

            {/* Tooltip hint if needed, or just standard title attribute used above */}
        </div>
    );
}
