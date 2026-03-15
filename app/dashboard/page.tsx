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
import { StudentService, DashboardStats, DailyChallenge } from "@/services/student/student.service";
import { toast } from "sonner";

// Premium Illustration component
const HikerIllustration = () => (
    <div className="absolute right-4 bottom-4 w-32 h-32 opacity-100 scale-110 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(30,58,138,0.2)]">
            <defs>
                <linearGradient id="hillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <path d="M80,80 L20,100 L100,100 Z" fill="url(#hillGrad)" className="animate-pulse" />
            <circle cx="60" cy="40" r="8" fill="#fca5a5" className="animate-bounce" style={{ animationDuration: '3s' }} />
            <rect x="55" y="48" width="10" height="20" fill="var(--brand-primary)" rx="2" />
            <path d="M55,60 L45,80" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
            <path d="M65,60 L75,80" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
            <path d="M55,50 L40,40" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
            <line x1="75" y1="40" x2="75" y2="90" stroke="var(--brand-primary)" strokeWidth="1.5" opacity="0.3" />
            <path d="M75,30 L90,35 L75,40 Z" fill="#f97316" className="animate-pulse" />
        </svg>
    </div>
);

export default function DashboardPage() {
    const { user, profile } = useAuth();
    const [userName, setUserName] = useState("Estudiante");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!user) return;
        setUserName(profile?.firstName || user.displayName?.split(' ')[0] || "Estudiante");

        const loadData = async () => {
            setIsLoadingStats(true);
            try {
                const dashboardStats = await StudentService.getDashboardStats(user.uid);
                if (dashboardStats) {
                    setStats(dashboardStats);
                    const dailyChallenge = await StudentService.getDailyChallenge(user.uid, dashboardStats);
                    setChallenge(dailyChallenge);
                }
            } catch (err) {
                console.error("Dashboard load error", err);
                toast.error("Error al cargar estadísticas");
            } finally {
                setIsLoadingStats(false);
            }
        };

        loadData();
    }, [user, profile]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 font-sans selection:bg-brand-primary/20 transition-colors duration-500 overflow-x-hidden" suppressHydrationWarning>
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="px-6 pt-10 pb-4 flex items-center justify-between relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Continuar entrenamiento</p>
                    <h1 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)] tracking-tight leading-none">
                        Hola, <span className="text-brand-primary">{userName}</span>
                    </h1>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-[var(--theme-bg-surface)] shadow-sm rounded-lg border border-[var(--theme-border-soft)] group active:scale-95 transition-all">
                    <Sun className="text-yellow-500/80" size={16} strokeWidth={2} />
                </div>
            </div>

            <div className="px-6 space-y-8">

                {/* Hero Card: Core Progress - Ultra Premium Glass */}
                <div className="bg-gradient-to-br from-brand-primary/10 via-[var(--theme-bg-surface)]/80 to-[var(--theme-bg-surface)]/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden group shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] transform hover:scale-[1.01] transition-all duration-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10 flex flex-col h-56 sm:h-60 justify-between">
                        <div className="flex justify-between items-start">
                            {/* Circular Progress with Orbital Glow */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 group/progress">
                                {isLoadingStats ? (
                                    <div className="w-full h-full rounded-full border-4 border-white/5 animate-pulse" />
                                ) : (
                                    <>
                                        {/* Glow Layer */}
                                        <div className="absolute inset-0 rounded-full bg-brand-primary/20 blur-2xl scale-75 group-hover/progress:scale-110 transition-transform duration-700" />

                                        <svg className="w-full h-full -rotate-90 relative z-10 drop-shadow-2xl" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--theme-border-soft)]" />
                                            <circle
                                                cx="18" cy="18" r="16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3.2"
                                                strokeDasharray={`${stats?.weeklyProgress || 0}, 100`}
                                                strokeLinecap="round"
                                                className="text-brand-primary transition-all duration-1500 ease-out"
                                                style={{ filter: 'drop-shadow(0 0 8px var(--brand-primary))' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                            <span className="text-2xl font-black text-[var(--theme-text-primary)] leading-none">{stats?.weeklyProgress || 0}%</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mt-1">META</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex-1 pl-8 pt-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/10 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">Activo Ahora</span>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-brand-primary leading-none tracking-tight">
                                    {(stats?.weeklyProgress ?? 0) >= 80 ? "Paso de Élite" : (stats?.weeklyProgress ?? 0) >= 50 ? "Buen ritmo" : "El comienzo"}
                                </h2>
                                <p className="text-[12px] text-[var(--theme-text-secondary)] mt-2.5 max-w-[85%] leading-relaxed font-medium">
                                    {(stats?.weeklyProgress ?? 0) >= 100
                                        ? "Has dominado tus objetivos semanales. Estás en el 1% superior."
                                        : `Falta un ${100 - (stats?.weeklyProgress ?? 0)}% para completar tu meta.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <Link href="/planner">
                                <Button className="h-9 px-5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-brand-primary text-white shadow-md hover:translate-y-[-1px] transition-all">
                                    Continuar Ruta <ChevronRight size={12} className="ml-1" />
                                </Button>
                            </Link>
                            <HikerIllustration />
                        </div>
                    </div>
                </div>

                {/* Challenge Section - More Emotion */}
                <div className="bg-transparent space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.4em]">Propuesta Diaria</h3>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-brand-primary" />
                            <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                            <div className="w-1 h-1 rounded-full bg-brand-primary/20" />
                        </div>
                    </div>

                    <div className="bg-[var(--theme-bg-surface)] backdrop-blur-md rounded-[2.5rem] p-1 border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden group">
                        {isLoadingStats ? (
                            <div className="h-56 bg-slate-50 dark:bg-white/[0.02] animate-pulse rounded-[2.2rem]" />
                        ) : (
                            <div className="bg-gradient-to-b from-slate-50/50 dark:from-white/[0.03] to-transparent p-7 rounded-[2.2rem] relative overflow-hidden transition-all duration-700">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                                        <Gift size={24} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Módulo sugerido</p>
                                        <h4 className="text-base font-bold text-slate-800 tracking-tight">“{challenge?.label || 'Lectura Crítica'}”</h4>
                                    </div>
                                </div>

                                <Link href={`/training/${challenge?.module || 'lectura_critica'}`}>
                                    <Button
                                        className="w-full bg-slate-900 text-white hover:bg-black font-bold rounded-xl h-12 text-[10px] uppercase tracking-widest shadow-sm"
                                    >
                                        <span className="relative z-10">Comenzar ahora</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom Navigation - Ultra Sleek v2026 */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] max-w-sm bg-black/95 backdrop-blur-3xl rounded-full p-1.5 flex justify-around items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 z-50 animate-in slide-in-from-bottom-8 duration-1000">
                <Link href="/dashboard" className="flex-1 flex flex-col items-center gap-1 py-1.5 touch-manipulation group">
                    <div className="p-2 rounded-xl bg-brand-primary text-white shadow-lg transition-all transform group-active:scale-90">
                        <Home size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[8px] font-black text-white dark:text-brand-primary uppercase tracking-widest">Inicio</span>
                </Link>

                <Link href="/mentor" className="flex-1 flex flex-col items-center gap-1 py-1.5 touch-manipulation group opacity-40 hover:opacity-100 transition-all">
                    <div className="p-2 rounded-xl text-white">
                        <MapIcon size={18} strokeWidth={2} />
                    </div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Ruta</span>
                </Link>

                <Link href="/achievements" className="flex-1 flex flex-col items-center gap-1 py-1.5 touch-manipulation group opacity-40 hover:opacity-100 transition-all">
                    <div className="p-2 rounded-xl text-white">
                        <Award size={18} strokeWidth={2} />
                    </div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Logros</span>
                </Link>
            </div>
        </div>
    );
}
