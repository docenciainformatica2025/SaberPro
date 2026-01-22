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
            className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-[#111]/90 backdrop-blur-2xl border border-white/10 shadow-2xl group hover:border-metal-gold/30 transition-all cursor-default"
            title={`Nivel ${level} - ${xp} / ${nextLevelXP} XP`}
        >
            {/* Level Icon with Pulse */}
            <div className="relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-metal-gold/20 to-metal-gold/5 border border-metal-gold/30 text-metal-gold font-black text-sm relative z-10 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    {level}
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-metal-gold/20 blur-sm"
                />
            </div>

            {/* Progress Info */}
            <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-metal-silver/80">
                    <span>Nivel {level}</span>
                    <span className="text-metal-gold">{Math.floor(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-metal-gold via-yellow-400 to-metal-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    />
                </div>
            </div>

            {/* Hint Badge Icon */}
            <Award size={14} className="text-metal-gold/40 group-hover:text-metal-gold group-hover:scale-110 transition-all ml-1" />
        </div>
    );
}
