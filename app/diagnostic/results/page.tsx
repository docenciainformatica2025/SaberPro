"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    ArrowRight as LucideArrowRight,
    Lock as LucideLock,
    Target as LucideTarget,
    TrendingUp as LucideTrendingUp,
    Zap as LucideZap
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function DiagnosticResultsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("saberpro_diagnostic_results");
        if (!saved) {
            router.push("/diagnostic");
            return;
        }

        const timer = setTimeout(() => {
            const parsed = JSON.parse(saved);
            // Support both old format (no totalCorrect) and new format
            if (!parsed.totalCorrect && parsed.answers) {
                parsed.totalCorrect = parsed.answers.filter((a: any) => a.correct).length;
                parsed.total = parsed.answers.length || 5;
            }
            setData(parsed);
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [router]);

    if (loading || !data) return null;

    // Build chart from per-category answers if available
    const categoryMap: Record<string, boolean[]> = {};
    (data.answers || []).forEach((a: any) => {
        if (!categoryMap[a.category]) categoryMap[a.category] = [];
        categoryMap[a.category].push(a.correct);
    });

    const categoryScore = (cat: string) => {
        const arr = categoryMap[cat];
        if (!arr || arr.length === 0) return data.score > 60 ? 70 : 40;
        return Math.round((arr.filter(Boolean).length / arr.length) * 100);
    };

    const chartData = [
        { subject: 'Cuantitativo', A: categoryScore('Razonamiento Cuantitativo'), fullMark: 100 },
        { subject: 'Lectura', A: categoryScore('Lectura Crítica'), fullMark: 100 },
        { subject: 'Ciudadanas', A: categoryScore('Competencias Ciudadanas'), fullMark: 100 },
        { subject: 'Inglés', A: categoryScore('Inglés (B2)'), fullMark: 100 },
        { subject: 'Comunicación', A: categoryScore('Comunicación Escrita'), fullMark: 100 },
    ];

    const gap = 100 - data.score;

    const correctLabel = data.totalCorrect !== undefined
        ? `${data.totalCorrect} de ${data.total ?? 5} correctas`
        : null;

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] transition-colors duration-500 pb-20 pt-24 md:pt-32 relative">
            {/* Unified Logo Header for Onboarding/Public states */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
                <Logo />
            </div>

            <div className="max-w-4xl mx-auto px-6 space-y-12">
                {/* Navigation Guide */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/')}
                        className="text-[10px] uppercase font-bold tracking-widest opacity-60 hover:opacity-100"
                    >
                        Regresar al Inicio
                    </Button>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-brand-primary/20 text-brand-primary animate-pulse">
                        Resultados Disponibles
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-8">
                        <Badge variant="primary" className="mb-4 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]">
                            Análisis Completado
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-semibold text-[var(--theme-text-primary)] italic uppercase leading-none mb-2">
                            Tu Nivel Actual: <span className={gap > 40 ? "text-red-500" : "text-yellow-500"}>{data.score}%</span>
                        </h1>
                        {correctLabel && (
                            <p className="text-sm text-[var(--theme-text-secondary)] font-bold mb-2">
                                {correctLabel}
                            </p>
                        )}
                        <p className="text-xl text-[var(--theme-text-secondary)] font-light mb-4">
                            {gap > 40
                                ? "No estás mal. Solo necesitas reforzar 3 áreas clave."
                                : "Estás cerca de la excelencia. Asegura tu beca."}
                        </p>
                        <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider bg-[var(--theme-bg-surface)] inline-block px-3 py-1 rounded-full border border-[var(--theme-border-soft)]">
                            Metodología desarrollada por {process.env.NEXT_PUBLIC_AUTHOR_NAME || "SaberPro Team"}
                        </p>
                    </div>

                    <Card variant="glass" className="h-[300px] border-brand-primary/20 bg-[var(--theme-bg-surface)]/40 relative overflow-hidden backdrop-blur-xl">
                        {mounted ? (
                            <div style={{ width: '100%', height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                        <PolarGrid stroke="var(--theme-text-secondary)" opacity={0.1} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--theme-text-secondary)', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar
                                            name="Tu Nivel"
                                            dataKey="A"
                                            stroke="var(--brand-primary)"
                                            strokeWidth={3}
                                            fill="var(--brand-primary)"
                                            fillOpacity={0.4}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-pulse text-[var(--theme-text-tertiary)] text-[10px] font-semibold uppercase tracking-wider">
                                    Generando Visualización...
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-4 text-center">
                            <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-widest font-black">Patrón de Desempeño</p>
                        </div>
                    </Card>
                </div>

                {/* Right: The Promise & Conversion (The Hook) */}
                <div className="bg-[var(--theme-bg-surface)] p-8 md:p-12 rounded-3xl border border-[var(--theme-border-soft)] shadow-2xl relative overflow-hidden animate-in slide-in-from-right-8 duration-700 delay-200">
                    {/* Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-green-400 font-bold uppercase tracking-wider text-xs">
                                <LucideTrendingUp size={16} /> Proyección IA
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--theme-text-primary)] leading-snug">
                                Si practicas 15 minutos al día, puedes subir <span className="text-brand-primary">+18 puntos</span> en 6 semanas.
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)] flex items-center gap-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><LucideLock size={20} /></div>
                                <div>
                                    <p className="text-[var(--theme-text-primary)] font-bold text-sm">Plan de Estudio Personalizado</p>
                                    <p className="text-xs text-[var(--theme-text-secondary)]">Generado según tus 5 respuestas.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)] flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><LucideTarget size={20} /></div>
                                <div>
                                    <p className="text-[var(--theme-text-primary)] font-bold text-sm">Banco de Preguntas Adaptativo</p>
                                    <p className="text-xs text-[var(--theme-text-secondary)]">Solo lo que necesitas reforzar.</p>
                                </div>
                            </div>
                        </div>

                        <Link href={user ? "/dashboard" : "/register?s=diagnostic"} className="block">
                            <Button
                                variant="primary"
                                size="xl"
                                className="w-full h-16 text-sm font-semibold uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse hover:animate-none"
                                icon={LucideZap}
                            >
                                {user ? "Ir a mi Dashboard" : "Crear mi plan personalizado"}
                            </Button>
                        </Link>

                        <p className="text-center text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider">
                            Acceso inmediato • Sin tarjeta de crédito
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
