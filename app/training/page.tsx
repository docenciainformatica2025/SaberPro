"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Sparkles, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function TrainingSelectionPage() {
    const { user, profile, loading, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex items-center justify-center">
            <AIProcessingLoader text="Modo Entrenamiento" subtext="Iniciando protocolos de simulación" />
        </div>
    );

    const CAREER_PRIORITIES: Record<string, string[]> = {
        ingenieria: ["razonamiento_cuantitativo", "ingles"],
        salud: ["lectura_critica", "razonamiento_cuantitativo"],
        sociales: ["lectura_critica", "competencias_ciudadanas"],
        derecho: ["lectura_critica", "competencias_ciudadanas"],
        administrativas: ["razonamiento_cuantitativo", "competencias_ciudadanas"],
        educacion: ["lectura_critica", "comunicacion_escrita"],
        artes: ["lectura_critica", "ingles"]
    };

    const recommendedByCareer = profile?.targetCareer ? CAREER_PRIORITIES[profile.targetCareer] || [] : [];

    // Determine weakest module if status exists (optional but intuitive)
    // For now, let's stick to career, but sorting them better

    const baseModules = [
        { id: "razonamiento_cuantitativo", label: "Razonamiento Cuantitativo", icon: Zap, desc: "Matemáticas y lógica aplicada" },
        { id: "lectura_critica", label: "Lectura Crítica", icon: Brain, desc: "Análisis de textos y argumentación" },
        { id: "competencias_ciudadanas", label: "Competencias Ciudadanas", icon: Sparkles, desc: "Constitución y sociedad" },
        { id: "ingles", label: "Inglés", icon: Brain, desc: "Vocabulario y gramática" },
        { id: "comunicacion_escrita", label: "Comunicación Escrita", icon: Brain, desc: "Redacción y ortografía" },
    ];

    const modules = [...baseModules].sort((a, b) => {
        const isARec = recommendedByCareer.includes(a.id);
        const isBRec = recommendedByCareer.includes(b.id);
        if (isARec && !isBRec) return -1;
        if (!isBRec && isARec) return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] p-6 md:p-12 pb-24">
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header - Unified with Dashboard Style */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-brand-primary/5 pb-12">
                    <div className="space-y-6">
                        <Link href={role === 'teacher' ? "/teacher" : "/dashboard"}>
                            <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-slate-500 hover:text-brand-primary uppercase tracking-[0.2em] text-[10px] font-black pl-0 transition-all hover:pl-2">
                                {role === 'teacher' ? "Volver al Panel" : "Volver al Inicio"}
                            </Button>
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold tracking-widest uppercase mb-4 shadow-sm">
                                <Sparkles size={11} strokeWidth={2} /> Nueva Experiencia IA
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none mb-1">
                                Modo <span className="text-brand-primary italic">Entrenamiento</span>
                            </h1>
                        </div>
                    </div>
                    <div className="bg-brand-primary/[0.03] p-6 rounded-2xl border border-brand-primary/5 max-w-sm hidden md:block backdrop-blur-sm">
                        <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                            "La práctica constante es la única ruta hacia la maestría. Explora tus límites con nuestro motor de IA."
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const isRecommended = recommendedByCareer.includes(module.id);
                        return (
                            <Link key={module.id} href={`/training/${module.id}`}>
                                <Card
                                    variant={isRecommended ? "premium" : "glass"}
                                    className={`h-full p-8 md:p-10 group transition-all duration-500 hover:-translate-y-3 relative overflow-hidden rounded-[2.5rem] ${isRecommended ? 'shadow-2xl shadow-brand-primary/20 ring-2 ring-brand-primary/20 bg-white' : 'bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)] shadow-xl shadow-slate-200/50'}`}
                                >
                                    {isRecommended && (
                                        <div className="absolute top-6 right-6 z-20">
                                            <Badge variant="primary" className="text-[8px] px-3 py-1 uppercase tracking-[0.2em] font-black shadow-lg bg-brand-primary text-white border-none shimmer-gold">
                                                Recomendado
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Abstract BG Icon - Larger for depth */}
                                    <div className={`absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12 group-hover:rotate-0 scale-110 ${isRecommended ? 'text-brand-primary' : 'text-slate-400'}`}>
                                        <module.icon size={180} strokeWidth={1} />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-2xl ${isRecommended ? 'bg-brand-primary text-white shadow-brand-primary/30' : 'bg-white text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary shadow-slate-200/50'}`}>
                                            <module.icon size={32} strokeWidth={2.5} />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight group-hover:text-brand-primary transition-colors leading-none">
                                            {module.label}
                                        </h3>

                                        <p className={`text-[12px] font-medium mb-8 leading-relaxed flex-grow ${isRecommended ? 'text-slate-600' : 'text-slate-500'}`}>
                                            {module.desc}
                                        </p>

                                        <div className={`flex items-center text-[11px] font-black uppercase tracking-[0.25em] transition-all ${isRecommended ? 'text-brand-primary' : 'text-slate-700 group-hover:text-brand-primary'}`}>
                                            Iniciar <ChevronRight size={14} strokeWidth={3} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
