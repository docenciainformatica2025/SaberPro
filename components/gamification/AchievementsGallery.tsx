"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Zap, Flame, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ALL_BADGES = [
    { id: 'first_step', name: 'Primer Paso', icon: Award, color: 'text-blue-400', desc: 'Completa tu primer simulacro.' },
    { id: 'perfect_score', name: 'Puntaje Perfecto', icon: Target, color: 'text-metal-gold', desc: 'Responde todas las preguntas correctamente.' },
    { id: 'speed_demon', name: 'Demonio Veloz', icon: Zap, color: 'text-yellow-400', desc: 'Termina un examen ahorrando más de 5 minutos.' },
    { id: 'streak_3', name: 'Fuego Inicial', icon: Flame, color: 'text-orange-400', desc: 'Mantén una racha de 3 días.' },
    { id: 'streak_7', name: 'Constancia Oro', icon: Trophy, color: 'text-metal-gold', desc: 'Mantén una racha de 7 días.' },
];

export default function AchievementsGallery() {
    const { profile } = useAuth();
    const userBadges = profile?.gamification?.badges || [];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-metal-silver/40">Insignias y Logros</h3>
                <span className="text-[10px] font-bold text-metal-gold bg-metal-gold/10 px-2 py-0.5 rounded-full border border-metal-gold/20">
                    {userBadges.length} / {ALL_BADGES.length}
                </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {ALL_BADGES.map((badge, idx) => {
                    const isUnlocked = userBadges.includes(badge.id);
                    const Icon = badge.icon;

                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                                relative group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-500
                                ${isUnlocked
                                    ? `bg-black/40 border-white/10 shadow-lg cursor-default`
                                    : `bg-white/[0.02] border-white/5 grayscale opacity-40 cursor-help`
                                }
                            `}
                        >
                            <div className={`
                                p-2 rounded-xl mb-1 transition-transform duration-500 group-hover:scale-110
                                ${isUnlocked ? 'bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : ''}
                            `}>
                                <Icon size={20} className={isUnlocked ? badge.color : 'text-metal-silver'} />
                            </div>

                            {/* Hover Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 bg-metal-dark border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-2xl">
                                <p className="text-[10px] font-black text-white uppercase mb-0.5">{badge.name}</p>
                                <p className="text-[9px] text-metal-silver leading-tight">{badge.desc}</p>
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-metal-dark border-r border-b border-white/10 rotate-45"></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
