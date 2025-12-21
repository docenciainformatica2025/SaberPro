"use client";

import Link from "next/link";
import { Brain, Target, Zap, BarChart3, ChevronLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-metal-dark text-metal-silver p-6 md:p-12 pb-24">
            <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="space-y-6 text-center relative">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ChevronLeft} className="absolute left-0 top-0 text-metal-silver/40 hover:text-white uppercase tracking-widest text-[10px] hidden md:flex">
                            Volver
                        </Button>
                    </Link>

                    <Badge variant="premium" className="mx-auto px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        Ciencia del Aprendizaje
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">
                        Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Metodología</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-metal-silver/60 max-w-3xl mx-auto font-light leading-relaxed">
                        Diseñada científicamente para maximizar tu puntaje en el Saber Pro, combinando psicometría avanzada y tecnología adaptativa.
                    </p>

                    <div className="pt-8">
                        <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-2xl">
                            <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Un método diseñado desde la práctica real</h3>
                            <p className="text-metal-silver text-sm leading-relaxed">
                                Este entrenamiento fue desarrollado por <span className="text-white font-medium">Ing. Antonio Rodríguez</span>, ingeniero y formador en tecnología educativa.
                                El enfoque prioriza diagnóstico, práctica guiada y seguimiento medible del progreso.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-white/5 bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-2xl bg-metal-blue/10 flex items-center justify-center mb-8 text-metal-blue group-hover:bg-metal-blue/20 transition-colors shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <Brain size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Aprendizaje Adaptativo</h2>
                        <p className="text-metal-silver text-lg font-medium leading-relaxed">
                            Nuestro algoritmo identifica tus áreas débiles y ajusta la dificultad y el tipo de preguntas en tiempo real, garantizando que siempre estés desafiando tu límite sin frustrarte.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-white/5 bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-2xl bg-metal-gold/10 flex items-center justify-center mb-8 text-metal-gold group-hover:bg-metal-gold/20 transition-colors shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <Target size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Enfoque por Competencias</h2>
                        <p className="text-metal-silver text-lg font-medium leading-relaxed">
                            No evaluamos memoria, sino habilidades. Cada pregunta está alineada con las competencias específicas del ICFES: Lectura Crítica, Razonamiento Cuantitativo, Competencias Ciudadanas e Inglés.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-white/5 bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Retroalimentación Instantánea</h2>
                        <p className="text-metal-silver text-lg font-medium leading-relaxed">
                            Recibe explicaciones detalladas inmediatamente después de cada respuesta. Entiende el &quot;por qué&quot; de tus errores y corrige tus modelos mentales al instante.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-white/5 bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-8 text-green-400 group-hover:bg-green-500/20 transition-colors shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <BarChart3 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Analítica Predictiva</h2>
                        <p className="text-metal-silver text-lg font-medium leading-relaxed">
                            Visualiza tu progreso con gráficos avanzados tipo radar y tendencias históricas. Conoce tu probabilidad de éxito antes del examen real.
                        </p>
                    </Card>
                </div>

                {/* CTA */}
                <div className="text-center pt-12 border-t border-white/5">
                    <Link href="/register">
                        <Button size="xl" variant="premium" icon={ArrowRight} iconPosition="right" className="h-16 px-12 text-sm font-black uppercase tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] hover:scale-105 transition-all">
                            Comenzar Entrenamiento
                        </Button>
                    </Link>
                    <p className="mt-6 text-metal-silver/30 text-[10px] uppercase font-bold tracking-widest">
                        Únete a la élite académica de Colombia
                    </p>
                </div>
            </div>
        </div>
    );
}
