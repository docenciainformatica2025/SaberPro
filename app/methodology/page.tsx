"use client";

import Link from "next/link";
import { Brain, Target, Zap, BarChart3, ChevronLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] p-6 md:p-12 pb-24">
            <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="space-y-6 text-center relative">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ChevronLeft} className="absolute left-0 top-0 text-[var(--theme-text-tertiary)]/40 hover:text-[var(--theme-text-primary)] uppercase tracking-wider text-[10px] hidden md:flex">
                            Volver
                        </Button>
                    </Link>

                    <Badge variant="primary" className="mx-auto px-4 py-1.5 text-[10px] uppercase font-semibold tracking-[0.2em] shadow-[var(--theme-accent-gold-soft)]">
                        Ciencia del Aprendizaje
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight uppercase italic text-[var(--theme-text-primary)]">
                        Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[var(--theme-text-primary)] to-brand-primary">Metodología</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--theme-text-secondary)]/60 max-w-3xl mx-auto font-light leading-relaxed">
                        Diseñada científicamente para maximizar tu puntaje en el Saber Pro, combinando psicometría avanzada y tecnología adaptativa.
                    </p>

                    <div className="pt-8">
                        <div className="inline-block p-6 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] backdrop-blur-sm max-w-2xl">
                            <h3 className="text-[var(--theme-text-primary)] font-bold mb-2 uppercase tracking-wide text-sm">Un método diseñado desde la práctica real</h3>
                            <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed">
                                Este entrenamiento fue desarrollado por <span className="text-[var(--theme-text-primary)] font-medium">Ing. Antonio Rodríguez</span>, ingeniero y formador en tecnología educativa.
                                El enfoque prioriza diagnóstico, práctica guiada y seguimiento medible del progreso.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="w-16 h-16 rounded-2xl bg-metal-blue/10 flex items-center justify-center mb-8 text-metal-blue group-hover:bg-metal-blue/20 transition-colors shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <Brain size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-4 italic uppercase tracking-tight">Aprendizaje Adaptativo</h2>
                        <p className="text-[var(--theme-text-secondary)] text-lg font-medium leading-relaxed">
                            Nuestro algoritmo identifica tus áreas débiles y ajusta la dificultad y el tipo de preguntas en tiempo real, garantizando que siempre estés desafiando tu límite sin frustrarte.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8 text-brand-primary group-hover:bg-brand-primary/20 transition-colors shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <Target size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-4 italic uppercase tracking-tight">Enfoque por Competencias</h2>
                        <p className="text-[var(--theme-text-secondary)] text-lg font-medium leading-relaxed">
                            No evaluamos memoria, sino habilidades. Cada pregunta está alineada con las competencias específicas del ICFES: Lectura Crítica, Razonamiento Cuantitativo, Competencias Ciudadanas e Inglés.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-4 italic uppercase tracking-tight">Retroalimentación Instantánea</h2>
                        <p className="text-[var(--theme-text-secondary)] text-lg font-medium leading-relaxed">
                            Recibe explicaciones detalladas inmediatamente después de cada respuesta. Entiende el &quot;por qué&quot; de tus errores y corrige tus modelos mentales al instante.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-8 text-green-400 group-hover:bg-green-500/20 transition-colors shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <BarChart3 size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-4 italic uppercase tracking-tight">Analítica Predictiva</h2>
                        <p className="text-[var(--theme-text-secondary)] text-lg font-medium leading-relaxed">
                            Visualiza tu progreso con gráficos avanzados tipo radar y tendencias históricas. Conoce tu probabilidad de éxito antes del examen real.
                        </p>
                    </Card>
                </div>

                {/* CTA */}
                <div className="text-center pt-12 border-t border-[var(--theme-border-soft)]">
                    <Link href="/register">
                        <Button size="xl" variant="primary" icon={ArrowRight} iconPosition="right" className="h-16 px-12 text-sm font-semibold uppercase tracking-wider shadow-[var(--theme-accent-gold-soft)] hover:shadow-[var(--theme-accent-gold-medium)] hover:scale-105 transition-all">
                            Comenzar Entrenamiento
                        </Button>
                    </Link>
                    <p className="mt-6 text-[var(--theme-text-tertiary)]/30 text-[10px] uppercase font-bold tracking-wider">
                        Únete a la élite académica de Colombia
                    </p>
                </div>
            </div>
        </div>
    );
}
