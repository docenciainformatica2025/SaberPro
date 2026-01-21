"use client";

import { Clock, HelpCircle, ArrowRight, Brain, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ModuleIntroProps {
    moduleName: string;
    questionCount: number;
    timeLimitSeconds: number; // in seconds
    onStart: () => void;
}

const MODULE_TITLES: Record<string, string> = {
    "razonamiento_cuantitativo": "Razonamiento Cuantitativo",
    "lectura_critica": "Lectura Crítica",
    "competencias_ciudadanas": "Competencias Ciudadanas",
    "ingles": "Inglés",
    "comunicacion_escrita": "Comunicación Escrita"
};

const RANDOM_QUOTES = [
    "La excelencia no es un acto, sino un hábito. Mantén el enfoque.",
    "Confía en tu preparación. Lee con calma y decide con lógica.",
    "El éxito depende de la preparación previa, y sin ella seguro que llega el fracaso.",
    "La concentración es la clave. Una pregunta a la vez."
];

export default function ModuleIntro({ moduleName, questionCount, timeLimitSeconds, onStart }: ModuleIntroProps) {
    const title = MODULE_TITLES[moduleName] || moduleName.replace(/_/g, " ").toUpperCase();
    const timeMinutes = Math.floor(timeLimitSeconds / 60);
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuote(RANDOM_QUOTES[Math.floor(Math.random() * RANDOM_QUOTES.length)]);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-in fade-in duration-700">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                {/* Left Column: Info & Stats */}
                <div className="flex flex-col justify-center">
                    <Badge variant="premium" className="mb-6 h-7 px-4 w-fit">
                        <Target size={14} className="mr-2" /> Módulo Oficial
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                        {title}
                    </h1>

                    <div className="flex items-center gap-8 mb-8 text-metal-silver">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-metal-blue/10 flex items-center justify-center text-metal-blue border border-metal-blue/20">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Tiempo Límite</p>
                                <p className="text-xl font-bold text-white">{timeMinutes} Minutos</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                <HelpCircle size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Preguntas</p>
                                <p className="text-xl font-bold text-white">{questionCount} Items</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-lg text-metal-silver/80 italic border-l-4 border-metal-gold pl-4 py-2 mb-10 leading-relaxed">
                        &quot;{quote}&quot;
                    </p>

                    <Button
                        onClick={onStart}
                        className="h-16 text-xl font-black shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        COMENZAR AHORA
                    </Button>

                    <p className="text-center text-[10px] font-black text-metal-silver/70 mt-4 uppercase tracking-[0.2em]">
                        El tiempo comenzará a correr inmediatamente.
                    </p>
                </div>

                {/* Right Column: Guidance */}
                <Card variant="glass" className="p-8 md:p-10 relative overflow-hidden backdrop-blur-sm">
                    {/* Decorator */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain size={120} />
                    </div>

                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <Sparkles className="text-metal-gold" size={20} />
                        ORIENTACIONES PSICOLÓGICAS
                    </h3>

                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 group">
                            <div className="mt-1 w-6 h-6 rounded-full bg-metal-silver/10 flex items-center justify-center shrink-0 group-hover:bg-metal-gold group-hover:text-black transition-colors">
                                <span className="text-[10px] font-black">1</span>
                            </div>
                            <div>
                                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1 group-hover:text-metal-gold transition-colors">Lectura Analítica</h4>
                                <p className="text-sm text-metal-silver/60 leading-relaxed">
                                    No te apresures. Lee cada enunciado completamente antes de mirar las opciones. Identifica las palabras clave.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <div className="mt-1 w-6 h-6 rounded-full bg-metal-silver/10 flex items-center justify-center shrink-0 group-hover:bg-metal-gold group-hover:text-black transition-colors">
                                <span className="text-[10px] font-black">2</span>
                            </div>
                            <div>
                                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1 group-hover:text-metal-gold transition-colors">Gestión Emocional</h4>
                                <p className="text-sm text-metal-silver/60 leading-relaxed">
                                    Si encuentras una pregunta difícil, no te bloquees. Respira, márcala mentalmente y continúa. Regresa si te sobra tiempo.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <div className="mt-1 w-6 h-6 rounded-full bg-metal-silver/10 flex items-center justify-center shrink-0 group-hover:bg-metal-gold group-hover:text-black transition-colors">
                                <span className="text-[10px] font-black">3</span>
                            </div>
                            <div>
                                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1 group-hover:text-metal-gold transition-colors">Confianza Racional</h4>
                                <p className="text-sm text-metal-silver/60 leading-relaxed">
                                    Tu primera intuición razonada suele ser correcta. Evita cambiar respuestas a menos que encuentres evidencia clara del error.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <CheckCircle2 className="mt-1 w-6 h-6 text-green-500/50 group-hover:text-green-400 transition-colors shrink-0" />
                            <div>
                                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1 group-hover:text-green-400 transition-colors">Objetividad</h4>
                                <p className="text-sm text-metal-silver/60 leading-relaxed">
                                    Responde basándote únicamente en la información presentada o en tu conocimiento académico, evitando sesgos personales.
                                </p>
                            </div>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}
