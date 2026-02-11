"use client";

import { useAuth } from "@/context/AuthContext";
import { adaptiveEngine } from "@/utils/adaptiveEngine";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function LevelBadge() {
    const { profile } = useAuth();
    const xp = profile?.gamification?.xp || 0;
    const { level, progress, nextLevelXP } = adaptiveEngine.getLevelData(xp);

    if (!profile) return null;

    return (
        <div
            className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--theme-bg-surface)]/80 backdrop-blur-2xl border border-[var(--theme-border-soft)] shadow-xl group hover:border-brand-primary/30 transition-all cursor-default"
            title={`Nivel ${level} - ${xp} / ${nextLevelXP} XP`}
        >
            {/* Level Icon with Pulse */}
            <div className="relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 border border-brand-primary/30 text-brand-primary font-semibold text-sm relative z-10 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    {level}
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-brand-primary/20 blur-sm"
                />
            </div>

            {/* Progress Info */}
            <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]/80">
                    <span>Nivel {level}</span>
                    <span className="text-brand-primary">{Math.floor(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--theme-bg-base)]/50 rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-primary via-yellow-400 to-brand-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    />
                </div>
            </div>

            {/* Hint Badge Icon */}
            <Award size={14} className="text-brand-primary/40 group-hover:text-brand-primary group-hover:scale-110 transition-all ml-1" />
        </div>
    );
}
