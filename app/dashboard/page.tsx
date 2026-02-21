"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Home,
    Map as MapIcon,
    Award,
    Gift,
    Sun,
    Flag,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Simple illustration placeholder (in a real app, use next/image)
const HikerIllustration = () => (
    <div className="absolute right-4 bottom-4 w-32 h-32 opacity-90">
        {/* Simple SVG composition for the hiker */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <path d="M80,80 L20,100 L100,100 Z" fill="#fbd5b5" /> {/* Hill */}
            <circle cx="60" cy="40" r="8" fill="#fca5a5" /> {/* Head */}
            <rect x="55" y="48" width="10" height="20" fill="#3b82f6" rx="2" /> {/* Body */}
            <path d="M55,60 L45,80" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" /> {/* Leg L */}
            <path d="M65,60 L75,80" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" /> {/* Leg R */}
            <path d="M55,50 L40,40" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" /> {/* Arm L */}
            <line x1="75" y1="40" x2="75" y2="90" stroke="#9ca3af" strokeWidth="1" /> {/* Pole */}
            <path d="M75,30 L90,35 L75,40 Z" fill="#f97316" /> {/* Flag */}
        </svg>
    </div>
);

export default function DashboardPage() {
    const { user, profile } = useAuth();
    const [userName, setUserName] = useState("Estudiante");

    useEffect(() => {
        if (user) {
            setUserName(profile?.firstName || user.displayName?.split(' ')[0] || "Estudiante");
        }
    }, [user, profile]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-24 font-sans selection:bg-brand-primary/20">
            {/* Top Bar */}
            <div className="px-6 pt-12 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Hola, <span className="text-brand-primary">{userName}</span>
                    </h1>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Resumen de Hoy</p>
                </div>
                <div className="p-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                    <Sun className="text-yellow-500 animate-spin-slow" size={20} />
                </div>
            </div>

            <div className="px-6 space-y-6">

                {/* Hero Card: Progress */}
                <div className="bg-gradient-to-br from-brand-primary/5 to-brand-primary/[0.02] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-48">
                        <div className="flex justify-between items-start">
                            {/* Circular Progress */}
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-800" />
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="85, 100" strokeLinecap="round" className="text-brand-primary drop-shadow-[0_0_8px_rgba(26,35,126,0.3)]" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">85%</span>
                                </div>
                            </div>

                            <div className="flex-1 pl-6 pt-1">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    Buen progreso
                                </h2>
                                <p className="text-[11px] text-slate-500 mt-1 max-w-[80%]">
                                    Solo te falta un <span className="text-brand-primary font-bold">15%</span> para tu meta semanal.
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Link href="/planner">
                                <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/50 backdrop-blur-sm">
                                    Ver mi Ruta
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Challenge Card */}
                <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-xl shadow-blue-100/50 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-[#0284c7] mb-6">Tu reto del día</h3>

                    <div className="bg-blue-100 rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm text-[#0284c7]">
                            <Gift size={32} strokeWidth={2.5} />
                        </div>

                        <p className="text-[#1e3a8a] font-medium mb-1">Completa la lección:</p>
                        <h4 className="text-lg font-black text-[#1e3a8a] mb-6">“Geografía Humana”</h4>

                        <Button
                            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-2xl h-12 text-lg shadow-lg shadow-orange-200"
                        >
                            Aceptar Reto
                        </Button>
                    </div>
                </div>

            </div>

            {/* Bottom Navigation (Optimized) */}
            <div className="fixed bottom-6 left-6 right-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 flex justify-between items-center shadow-lg shadow-slate-200/20 border border-slate-200/60 dark:border-slate-800/60 z-50">
                <Link href="/dashboard" className="flex-1 flex flex-col items-center gap-1 py-1">
                    <div className="p-1.5 rounded-lg bg-brand-primary/10">
                        <Home size={20} className="text-brand-primary" />
                    </div>
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Home</span>
                </Link>

                <Link href="/mentor" className="flex-1 flex flex-col items-center gap-1 py-1 opacity-40 hover:opacity-100 transition-opacity translate-y-0.5">
                    <MapIcon size={18} className="text-slate-500" />
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Ruta</span>
                </Link>

                <Link href="/achievements" className="flex-1 flex flex-col items-center gap-1 py-1 opacity-40 hover:opacity-100 transition-opacity translate-y-0.5">
                    <Award size={18} className="text-slate-500" />
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Logros</span>
                </Link>
            </div>
        </div>
    );
}
