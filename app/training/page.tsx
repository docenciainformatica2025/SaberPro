"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Sparkles, Zap, ChevronRight, Target } from "lucide-react";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function TrainingSelectionPage() {
    const { user, loading, role } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchProfile() {
            if (user) {
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase");
                    const docSnap = await getDoc(doc(db, "users", user.uid));
                    if (docSnap.exists()) setUserProfile(docSnap.data());
                } catch (e) {
                    console.error("Error fetching profile", e);
                } finally {
                    setFetchingProfile(false);
                }
            } else if (!loading) {
                setFetchingProfile(false);
            }
        }
        if (!loading) fetchProfile();
    }, [user, loading]);

    if (loading || (user && fetchingProfile)) return (
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

    const recommendedModules = userProfile?.targetCareer ? CAREER_PRIORITIES[userProfile.targetCareer] || [] : [];

    const baseModules = [
        { id: "razonamiento_cuantitativo", label: "Razonamiento Cuantitativo", icon: Zap, desc: "Matemáticas y lógica aplicada" },
        { id: "lectura_critica", label: "Lectura Crítica", icon: Brain, desc: "Análisis de textos y argumentación" },
        { id: "competencias_ciudadanas", label: "Competencias Ciudadanas", icon: Sparkles, desc: "Constitución y sociedad" },
        { id: "ingles", label: "Inglés", icon: Brain, desc: "Vocabulario y gramática" },
        { id: "comunicacion_escrita", label: "Comunicación Escrita", icon: Brain, desc: "Redacción y ortografía" },
    ];

    const modules = [...baseModules].sort((a, b) => {
        const isARec = recommendedModules.includes(a.id);
        const isBRec = recommendedModules.includes(b.id);
        if (isARec && !isBRec) return -1;
        if (!isARec && isBRec) return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] p-6 md:p-12 pb-24">
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--theme-border-soft)] pb-8">
                    <div className="space-y-4">
                        <Link href={role === 'teacher' ? "/teacher" : "/dashboard"}>
                            <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] uppercase tracking-wider text-[10px] pl-0">
                                {role === 'teacher' ? "Volver al Panel" : "Volver al Dashboard"}
                            </Button>
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-semibold tracking-wider uppercase mb-3">
                                <Sparkles size={12} /> Nueva Funcionalidad IA
                            </div>
                            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight">
                                Modo <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[var(--theme-text-primary)] to-brand-primary">Entrenamiento</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-[var(--theme-text-secondary)] text-sm md:text-base max-w-md font-medium leading-relaxed text-right hidden md:block">
                        Practica sin límite de tiempo. Recibe retroalimentación inmediata y explicaciones personalizadas por Inteligencia Artificial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const isRecommended = recommendedModules.includes(module.id);
                        return (
                            <Link key={module.id} href={`/training/${module.id}`}>
                                <Card
                                    variant={isRecommended ? "premium" : "glass"}
                                    className={`h-full p-8 group transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${isRecommended ? 'shadow-[0_0_40px_rgba(212,175,55,0.15)] ring-1 ring-brand-primary/50' : 'bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)]'}`}
                                >
                                    {isRecommended && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <Badge variant="primary" className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-semibold shadow-lg">
                                                Recomendado
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Abstract BG Icon */}
                                    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 ${isRecommended ? 'text-[var(--theme-bg-base)]' : 'text-[var(--theme-text-primary)]'}`}>
                                        <module.icon size={120} />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg ${isRecommended ? 'bg-[var(--theme-bg-base)] text-brand-primary' : 'bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] group-hover:bg-brand-primary/20 group-hover:text-brand-primary'}`}>
                                            <module.icon size={28} strokeWidth={2} />
                                        </div>

                                        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2 uppercase italic tracking-tight group-hover:text-brand-primary transition-colors">
                                            {module.label}
                                        </h3>

                                        <p className={`text-xs font-medium mb-8 leading-relaxed flex-grow ${isRecommended ? 'text-[var(--theme-text-secondary)]' : 'text-[var(--theme-text-tertiary)]'}`}>
                                            {module.desc}
                                        </p>

                                        <div className={`flex items-center text-[10px] font-semibold uppercase tracking-wider transition-colors ${isRecommended ? 'text-black' : 'text-brand-primary group-hover:text-[var(--theme-text-primary)]'}`}>
                                            Iniciar Práctica <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
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
