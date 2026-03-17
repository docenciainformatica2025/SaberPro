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
    ChevronRight,
    Sparkles,
    Shield
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
    const { user, profile, subscription, isSuperAdmin } = useAuth();
    const router = useRouter();
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
                // Fetch stats as primary data
                const dashboardStats = await StudentService.getDashboardStats(user.uid);
                if (dashboardStats) {
                    setStats(dashboardStats);
                    // Derivate challenge based on stats
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

    const isPro = subscription?.plan !== 'free' || isSuperAdmin;

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 font-sans selection:bg-brand-primary/20 transition-colors duration-500 overflow-x-hidden" suppressHydrationWarning>
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="px-6 pt-10 pb-4 flex items-center justify-between relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Continuar entrenamiento</p>
                    <h1 className="text-3xl md:text-3xl font-black text-[var(--theme-text-primary)] tracking-tight leading-none font-academic">
                        Hola, <span className="text-gradient-maestro">{userName}</span>
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
                                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">
                                        {stats?.totalSimulations === 0 ? "Comenzando Ruta" : "Activo Ahora"}
                                    </span>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-brand-primary leading-none tracking-tight">
                                    {stats?.totalSimulations === 0
                                        ? "¡Bienvenido a tu entrenamiento!"
                                        : (stats?.weeklyProgress ?? 0) >= 80 ? "Paso de Élite" : (stats?.weeklyProgress ?? 0) >= 50 ? "Buen ritmo" : "El comienzo"}
                                </h2>
                                <p className="text-[12px] text-[var(--theme-text-secondary)] mt-2.5 max-w-[85%] leading-relaxed font-medium">
                                    {stats?.totalSimulations === 0
                                        ? "Configuramos tu plan basado en tu meta. Tu primer paso es revisar tu Planificador."
                                        : (stats?.weeklyProgress ?? 0) >= 100
                                            ? "Has dominado tus objetivos semanales. Estás en el 1% superior."
                                            : `Falta un ${100 - (stats?.weeklyProgress ?? 0)}% para completar tu meta.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <Link href="/planner">
                                <Button variant="maestro" className="h-10 px-6 rounded-xl shadow-premium">
                                    {stats?.totalSimulations === 0 ? "Ver mi Plan de Estudio" : "Continuar Ruta"} <ChevronRight size={14} className="ml-2" />
                                </Button>
                            </Link>
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
                                        <p className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em] mb-0.5">Módulo sugerido</p>
                                        <h4 className="text-lg font-bold text-[var(--theme-text-primary)] tracking-tight font-academic">“{challenge?.label || 'Lectura Crítica'}”</h4>
                                    </div>
                                </div>

                                <Link href={`/training/${challenge?.module || 'lectura_critica'}`}>
                                    <Button
                                        variant="maestro"
                                        className="w-full h-14 rounded-2xl"
                                    >
                                        <span className="relative z-10">Comenzar entrenamiento</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subscription / Upsell Card - 360 Degree Visibility */}
                {!isPro && (
                    <div className="bg-gradient-to-r from-slate-900 to-brand-primary p-[1px] rounded-[2rem] shadow-2xl overflow-hidden group mb-8">
                        <div className="bg-[var(--theme-bg-surface)] rounded-[1.95rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 transition-transform group-hover:scale-110">
                                    <Sparkles size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold text-[var(--theme-text-primary)] tracking-tight">¡Sube al <span className="text-brand-primary italic">Siguiente Nivel</span>!</h4>
                                    <p className="text-[11px] text-[var(--theme-text-secondary)] font-medium leading-relaxed max-w-sm">
                                        Con el plan PRO tienes ejercicios ilimitados y consejos personalizados para que asegures tu mejor puntaje. ¡Tú puedes lograrlo!
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="premium"
                                className="h-14 px-8 rounded-xl shadow-lg w-full md:w-auto"
                                onClick={() => router.push('/pricing')}
                            >
                                ¡Quiero ser PRO!
                            </Button>
                        </div>
                    </div>
                )}

                {isPro && (
                    <div className="flex items-center justify-between px-6 py-4 bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] mb-8">
                        <div className="flex items-center gap-3">
                            <Shield size={16} className="text-brand-primary" />
                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Tienes el Plan PRO Activo ✨</span>
                        </div>
                        <span className="text-[9px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">Soporte Prioritario</span>
                    </div>
                )}
            </div>

        </div>
    );
}
