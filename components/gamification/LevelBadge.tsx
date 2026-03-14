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
            className="relative flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1 rounded-full bg-[var(--theme-bg-surface)]/80 backdrop-blur-2xl border border-[var(--theme-border-soft)] shadow-md group hover:border-brand-primary/20 transition-all cursor-default scale-[0.85] md:scale-90"
            title={`Nivel ${level} - ${xp} / ${nextLevelXP} XP`}
        >
            {/* Level Icon with Pulse */}
            <div className="relative">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 border border-brand-primary/30 text-brand-primary font-bold text-[10px] relative z-10 shadow-sm">
                    {level}
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-brand-primary/20 blur-sm"
                />
            </div>

            {/* Progress Info */}
            <div className="flex flex-col gap-0.5 w-16 md:w-20">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tight text-[var(--theme-text-secondary)]/60">
                    <span>Lvl {level}</span>
                    <span className="text-brand-primary font-black">{Math.floor(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-[var(--theme-bg-base)]/50 rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-primary via-yellow-400 to-brand-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    />
                </div>
            </div>

            {/* Hint Badge Icon */}
            <Award size={12} className="text-brand-primary/40 group-hover:text-brand-primary group-hover:scale-110 transition-all ml-0.5" />
        </div>
    );
}
