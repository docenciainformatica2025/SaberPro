"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ArrowLeft, Lock, Star, Trophy, Zap, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Mock Achievements Config
const ACHIEVEMENTS = [
    { id: 'first_steps', title: 'Primeros Pasos', desc: 'Completa tu primer simulacro', icon: Star, color: 'text-yellow-400', xp: 50 },
    { id: 'math_wiz', title: 'Mente Maestra', desc: 'Obtén 80%+ en Razonamiento Cuantitativo', icon: Zap, color: 'text-blue-400', xp: 200 },
    { id: 'streak_3', title: 'En Llamas', desc: 'Mantén una racha de 3 días', icon: Trophy, color: 'text-orange-500', xp: 150 },
    { id: 'reader', title: 'Lector Voraz', desc: 'Completa 5 módulos de Lectura Crítica', icon: BookOpen, color: 'text-green-400', xp: 100 },
    { id: 'perfectionist', title: 'Perfeccionista', desc: 'Obtén 100% en cualquier módulo', icon: Target, color: 'text-purple-500', xp: 500 },
    { id: 'veteran', title: 'Veterano', desc: 'Completa 50 simulacros totales', icon: Trophy, color: 'text-metal-gold', xp: 1000 },
];

export default function AchievementsPage() {
    const { user, profile } = useAuth(); // In real app, profile contains unlocked achievement IDs

    // Mock user progress
    const unlockedIds = ['first_steps', 'reader'];
    const currentXP = 250;
    const nextLevelXP = 500;
    const level = 1;

    return (
        <div className="min-h-screen bg-metal-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-metal-dark/90 backdrop-blur-md border-b border-white/5 p-4 md:px-8 flex justify-between items-center">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-metal-silver hover:text-white">
                        <span className="hidden md:inline">DASHBOARD</span>
                    </Button>
                </Link>
                <h1 className="text-lg font-black uppercase tracking-widest text-white">Logros y Medallas</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-5xl mx-auto pt-8 px-4">

                {/* Level / XP Header */}
                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block relative mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-metal-gold bg-black flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                            <span className="text-4xl font-black text-white">{level}</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-metal-gold text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-20">
                            Nivel
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Aprendiz Iniciado</h2>
                    <p className="text-metal-silver text-sm mb-6 max-w-md mx-auto">
                        Sigue completando logros para ganar XP y subir de nivel.
                    </p>

                    <div className="max-w-md mx-auto bg-white/5 rounded-full h-3 relative overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-metal-gold to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between max-w-md mx-auto mt-2 text-[10px] font-black uppercase tracking-wider text-metal-silver/50">
                        <span>{currentXP} XP</span>
                        <span>{nextLevelXP} XP</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = unlockedIds.includes(ach.id);
                        const Icon = ach.icon;

                        return (
                            <Card
                                key={ach.id}
                                variant={isUnlocked ? "glass" : "solid"}
                                className={`
                                    p-6 text-center flex flex-col items-center justify-center aspect-square transition-all duration-300
                                    ${isUnlocked
                                        ? "bg-white/[0.02] border-white/10 hover:border-metal-gold/30 hover:-translate-y-1 hover:shadow-xl"
                                        : "bg-black/40 border-white/5 opacity-60 grayscale"
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-500
                                    ${isUnlocked
                                        ? `bg-white/5 ${ach.color} shadow-[0_0_20px_currentColor] group-hover:scale-110`
                                        : "bg-white/5 text-metal-silver"
                                    }
                                `}>
                                    {isUnlocked ? <Icon size={32} /> : <Lock size={24} />}
                                </div>

                                <h3 className={`font-bold text-sm uppercase tracking-tight mb-2 ${isUnlocked ? "text-white" : "text-metal-silver"}`}>
                                    {ach.title}
                                </h3>

                                <p className="text-xs text-metal-silver/60 leading-tight mb-4 flex-grow">
                                    {ach.desc}
                                </p>

                                <Badge variant="outline" className={`text-[9px] border-white/10 ${isUnlocked ? "text-metal-gold" : "text-metal-silver/30"}`}>
                                    +{ach.xp} XP
                                </Badge>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
