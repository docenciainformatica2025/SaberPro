"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Lock, Target, TrendingUp, Zap } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Link from "next/link";

export default function DiagnosticResultsPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    useEffect(() => {
        // 1. Read from localStorage
        const saved = localStorage.getItem("saberpro_diagnostic_results");
        if (!saved) {
            router.push("/diagnostic"); // No data? Go back to start
            return;
        }

        const timer = setTimeout(() => {
            setData(JSON.parse(saved));
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [router]);

    if (loading || !data) return null;

    // Mock Radar Data based on score (Simplified logic for Micro-Diagnostic)
    const chartData = [
        { subject: 'Cuantitativo', A: data.score > 60 ? 80 : 40, fullMark: 100 },
        { subject: 'Lectura', A: data.score > 60 ? 70 : 50, fullMark: 100 },
        { subject: 'Ciudadanas', A: data.score > 80 ? 90 : 60, fullMark: 100 },
        { subject: 'Inglés', A: data.score > 40 ? 60 : 30, fullMark: 100 },
        { subject: 'Lógica', A: data.score > 50 ? 85 : 45, fullMark: 100 },
    ];

    const gap = 100 - data.score;
    const projectedScore = Math.round(data.score * 1.3); // Promesa de valor

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] selection:bg-brand-primary/30 p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left: The Visual Diagnosis (The Gap) */}
                <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="mb-8">
                        <Badge variant="primary" className="mb-4 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]">
                            Análisis Completado
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-semibold text-[var(--theme-text-primary)] italic uppercase leading-none mb-2">
                            Tu Nivel Actual: <span className={gap > 40 ? "text-red-500" : "text-yellow-500"}>{data.score}%</span>
                        </h1>
                        <p className="text-xl text-[var(--theme-text-secondary)] font-light mb-4">
                            {gap > 40
                                ? "No estás mal. Solo necesitas reforzar 3 áreas clave."
                                : "Estás cerca de la excelencia. Asegura tu beca."}
                        </p>
                        <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider bg-[var(--theme-bg-surface)] inline-block px-3 py-1 rounded-full border border-[var(--theme-border-soft)]">
                            Metodología desarrollada por {process.env.NEXT_PUBLIC_AUTHOR_NAME || "SaberPro Team"}
                        </p>
                    </div>

                    <Card variant="glass" className="h-[300px] border-brand-primary/20 bg-black/40 relative">
                        {mounted ? (
                            <div style={{ width: '100%', height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                        <PolarGrid stroke="var(--theme-border-soft)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--theme-text-tertiary)', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Tu Nivel"
                                            dataKey="A"
                                            stroke="var(--brand-primary)"
                                            strokeWidth={3}
                                            fill="var(--brand-primary)"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-pulse text-tertiary text-[10px] font-semibold uppercase tracking-wider">
                                    Generando Visualización...
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-4 text-center">
                            <p className="text-xs text-theme-text-secondary uppercase tracking-wider font-bold">Patrón de Desempeño</p>
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
                                <TrendingUp size={16} /> Proyección IA
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--theme-text-primary)] leading-snug">
                                Si practicas 15 minutos al día, puedes subir <span className="text-brand-primary">+18 puntos</span> en 6 semanas.
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)] flex items-center gap-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Lock size={20} /></div>
                                <div>
                                    <p className="text-[var(--theme-text-primary)] font-bold text-sm">Plan de Estudio Personalizado</p>
                                    <p className="text-xs text-[var(--theme-text-secondary)]">Generado según tus 5 respuestas.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)] flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Target size={20} /></div>
                                <div>
                                    <p className="text-[var(--theme-text-primary)] font-bold text-sm">Banco de Preguntas Adaptativo</p>
                                    <p className="text-xs text-[var(--theme-text-secondary)]">Solo lo que necesitas reforzar.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/register?s=diagnostic" className="block">
                            <Button
                                variant="primary"
                                size="xl"
                                className="w-full h-16 text-sm font-semibold uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse hover:animate-none"
                                icon={Zap}
                            >
                                Crear mi plan personalizado
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
