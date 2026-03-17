"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { robustDate } from "@/utils/dates";
import { UserProfile } from "@/types/user";
import {
    User,
    TrendingUp,
    Zap,
    Award,
    ChevronRight,
    Lock,
    Share2,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import BottomNav from "@/components/layout/BottomNav";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EmptyState } from "@/components/ui/EmptyState";

interface EvolutionData {
    totalSimulations: number;
    totalQuestions: number;
    averageScore: number;
    streak: number;
    points: number;
    highestScore: number;
}

export default function EvolutionPage() {
    const { user, profile } = useAuth();
    const [data, setData] = useState<EvolutionData | null>(null);
    const [loading, setLoading] = useState(true);

    const displayName = profile?.fullName
        || user?.displayName
        || user?.email?.split("@")[0]
        || "Estudiante";

    const firstLetter = displayName[0]?.toUpperCase() || "E";

    useEffect(() => {
        if (!user) { setLoading(false); return; }

        const fetchEvolution = async () => {
            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", user.uid)
                );
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setData(null);
                    setLoading(false);
                    return;
                }

                let totalScoreSum = 0;
                let maxScore = 0;
                let totalQuestions = 0;

                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    const score = d.totalQuestions > 0 ? Math.round((d.score / d.totalQuestions) * 100) : 0;
                    totalScoreSum += score;
                    if (score > maxScore) maxScore = score;
                    totalQuestions += d.totalQuestions || 0;
                });

                const avg = snapshot.size > 0 ? Math.round(totalScoreSum / snapshot.size) : 0;
                const streak = profile?.gamification?.streak?.current || 0;
                const points = profile?.gamification?.points || 0;

                setData({
                    totalSimulations: snapshot.size,
                    totalQuestions,
                    averageScore: avg,
                    streak,
                    points,
                    highestScore: maxScore,
                });
            } catch (err) {
                console.error("Error fetching evolution:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolution();
    }, [user, profile]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-24 font-sans" suppressHydrationWarning>
            {/* Header */}
            <div className="bg-[var(--theme-bg-base)]/90 backdrop-blur-xl sticky top-0 z-40 p-4 border-b border-[var(--theme-border-soft)] flex justify-between items-center">
                <Link href="/dashboard" className="text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] transition-colors">
                    <div className="flex items-center gap-1 font-bold text-sm">
                        ← Tu Evolución
                    </div>
                </Link>
                <div className="flex gap-4 text-brand-primary/60">
                    <Share2 size={20} />
                </div>
            </div>

            {/* Profile Hero */}
            <div className="bg-[var(--theme-bg-surface)] border-b border-[var(--theme-border-soft)] p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-primary/30 bg-brand-primary/10 overflow-hidden relative mx-auto flex items-center justify-center">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-brand-primary font-black text-3xl">{firstLetter}</span>
                        )}
                    </div>
                </div>

                <h1 className="text-xl font-bold text-[var(--theme-text-primary)] mt-2 mb-1">{displayName}</h1>
                <p className="text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    {data ? "Estudiante Activo" : "Nuevo Estudiante"}
                </p>

                {data && (
                    <div className="flex justify-center gap-8 border-t border-[var(--theme-border-soft)] pt-6">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[var(--theme-text-primary)]">{data.totalSimulations}</span>
                            <span className="text-[9px] text-[var(--theme-text-tertiary)] uppercase tracking-widest block mt-1">Simulacros</span>
                        </div>
                        <div className="w-px bg-[var(--theme-border-soft)]" />
                        <div className="text-center">
                            <span className="block text-lg font-bold text-brand-success">{data.averageScore}%</span>
                            <span className="text-[9px] text-[var(--theme-text-tertiary)] uppercase tracking-widest block mt-1">Promedio</span>
                        </div>
                        <div className="w-px bg-[var(--theme-border-soft)]" />
                        <div className="text-center">
                            <span className="block text-lg font-bold text-brand-primary">{data.points}</span>
                            <span className="text-[9px] text-[var(--theme-text-tertiary)] uppercase tracking-widest block mt-1">XP</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 py-8 space-y-6">
                {loading ? (
                    // Skeleton
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 bg-[var(--theme-bg-surface)] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : !data ? (
                    // Empty state — new user
                    <div className="py-10">
                        <EmptyState
                            title="Comienza tu evolución"
                            description="Completa tu primer simulacro para ver tu evolución, progreso y estadísticas personalizadas."
                            icon={BookOpen}
                            actionLabel="Ir al Diagnóstico"
                            onAction={() => window.location.href = "/diagnostic"}
                        />
                    </div>
                ) : (
                    <>
                        {/* Streak Card */}
                        <Card className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl">
                            <div className="flex justify-between items-baseline mb-4">
                                <h3 className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">Racha de Consistencia</h3>
                                <Zap size={16} className={data.streak > 0 ? "text-brand-primary fill-brand-primary/30" : "text-[var(--theme-text-tertiary)]"} />
                            </div>
                            {data.streak > 0 ? (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-[var(--theme-text-primary)]">{data.streak} Días</span>
                                    <span className="text-sm font-medium text-brand-primary">activo</span>
                                </div>
                            ) : (
                                <p className="text-[var(--theme-text-secondary)] text-sm">
                                    Practica hoy para iniciar tu racha 🔥
                                </p>
                            )}
                        </Card>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl">
                                <TrendingUp size={20} className="text-brand-primary mb-3" />
                                <span className="block text-2xl font-black text-[var(--theme-text-primary)]">{data.highestScore}%</span>
                                <span className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-widest">Mejor Puntaje</span>
                            </Card>
                            <Card className="p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl">
                                <Award size={20} className="text-brand-success mb-3" />
                                <span className="block text-2xl font-black text-[var(--theme-text-primary)]">{data.totalQuestions}</span>
                                <span className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-widest">Preguntas Resueltas</span>
                            </Card>
                        </div>

                        {/* Next Level — locked until feature is built */}
                        <div>
                            <h3 className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest mb-4 pl-2">Próximos Logros</h3>
                            <div className="bg-[var(--theme-bg-surface)]/60 rounded-2xl p-4 border border-dashed border-[var(--theme-border-soft)] flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--theme-bg-surface)] flex items-center justify-center text-[var(--theme-text-tertiary)]">
                                    <Lock size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-[var(--theme-text-primary)]">Sistema de Logros</h4>
                                    <p className="text-[10px] text-[var(--theme-text-tertiary)] leading-tight mt-1">
                                        Próximamente: badges, certificaciones y ranking por competencia.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link href="/analytics">
                            <Button variant="outline" className="w-full h-11 font-bold uppercase tracking-widest text-xs">
                                Ver Analíticas Completas <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
