"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, ArrowRight, Target, Lightbulb, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdaptiveAdvice } from "@/utils/adaptiveEngine";
import Link from "next/link";

interface AICoachMessageProps {
    analysis: AdaptiveAdvice;
}

export default function AICoachMessage({ analysis }: AICoachMessageProps) {
    const statusColors = {
        excellent: "text-green-400 border-green-500/20 bg-green-500/5",
        good: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        improving: "text-metal-gold border-metal-gold/20 bg-metal-gold/5",
        critical: "text-red-400 border-red-500/20 bg-red-500/5",
    };

    return (
        <Card variant="premium" interactive className="relative overflow-hidden p-8 border-metal-gold/30">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Brain size={240} className="text-metal-gold" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="premium" className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-metal-gold text-black border-none">
                                AI COACH PRO
                            </Badge>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${statusColors[analysis.overallStatus]}`}>
                                Estado: {analysis.overallStatus}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-2 uppercase">
                            <Sparkles className="text-metal-gold" size={24} />
                            Análisis Predicitivo de Desempeño
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Advice Section */}
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 mb-4 text-metal-gold">
                                <Lightbulb size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Visión Estratégica</span>
                            </div>
                            <p className="text-white/90 text-lg leading-relaxed font-medium">
                                {analysis.advice}
                            </p>
                        </div>

                        <div className="bg-metal-gold/5 rounded-2xl p-6 border border-metal-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                            <div className="flex items-center gap-3 mb-4 text-metal-gold">
                                <Zap size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Siguiente Paso Crítico</span>
                            </div>
                            <p className="text-white font-bold text-lg mb-6">
                                {analysis.actionStep}
                            </p>
                            <Link href="/training">
                                <Button variant="premium" size="lg" className="w-full md:w-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] group">
                                    COMENZAR ENTRENAMIENTO EN {analysis.nextRecommendedModule.toUpperCase()}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Contrast */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-black/20 rounded-2xl border border-white/5 flex flex-col justify-between">
                            <div>
                                <Target className="text-green-400 mb-4" size={24} />
                                <span className="text-[10px] font-black text-metal-silver uppercase tracking-widest">Fortaleza Principal</span>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-white leading-tight uppercase truncate">{analysis.strengthModule.name}</div>
                                <div className="text-sm font-bold text-green-400">{analysis.strengthModule.value}% Dominio</div>
                            </div>
                        </div>

                        <div className="p-6 bg-black/20 rounded-2xl border border-white/5 flex flex-col justify-between">
                            <div>
                                <Target className="text-red-400 mb-4" size={24} />
                                <span className="text-[10px] font-black text-metal-silver uppercase tracking-widest">Oportunidad de Mejora</span>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-white leading-tight uppercase truncate">{analysis.criticalModule.name}</div>
                                <div className="text-sm font-bold text-red-400">{analysis.criticalModule.value}% Dominio</div>
                            </div>
                        </div>

                        <div className="col-span-1 sm:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-metal-silver uppercase tracking-widest">Proyección Estimada</div>
                                    <div className="text-xl font-black text-white tracking-widest">GLOBAL SCORE</div>
                                </div>
                            </div>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white italic">
                                ~{((analysis.criticalModule.value + analysis.strengthModule.value) / 2 * 3).toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
