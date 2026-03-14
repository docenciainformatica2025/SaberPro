"use client";

import { useAuth } from "@/context/AuthContext";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";

export default function StreakCounter() {
    const { profile } = useAuth();
    const [animated, setAnimated] = useState(false);

    // Safe access to streak data
    const streak = profile?.gamification?.streak?.current || 0;
    const lastActive = profile?.gamification?.streak?.lastActiveDate;

    // Optional: Check if streak is "at risk" (not completed today)
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = lastActive === today;

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
                relative flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 scale-[0.85] md:scale-90
                ${isCompletedToday
                    ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-500"
                    : "bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] text-theme-text-secondary grayscale hover:grayscale-0 hover:border-brand-primary/30 hover:text-brand-primary"
                }
            `}
            title={isCompletedToday ? "¡Racha diaria completada!" : "¡Sigue entrenando para mantener tu racha!"}
        >
            <div className={`relative ${isCompletedToday ? "opacity-90" : ""}`}>
                <Flame
                    size={14}
                    className={`
                        transition-all duration-500
                        ${isCompletedToday ? "fill-brand-accent text-brand-accent drop-shadow-[0_0_4px_rgba(255,145,0,0.4)]" : "fill-transparent text-current"}
                        ${animated ? "scale-110" : ""}
                    `}
                />
            </div>

            <span className={`text-xs font-black tracking-tight ${isCompletedToday ? "text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-600" : ""}`}>
                {streak}
            </span>
        </div>
    );
}
