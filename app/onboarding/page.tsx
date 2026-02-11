"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, BookOpen, Target, Sparkles, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "welcome" | "profile" | "goals" | "diagnostic" | "generating";

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>("welcome");
    const [profile, setProfile] = useState({
        career: "",
        university: "",
        examDate: "",
        goal: "excellence", // "pass" | "improve" | "excellence"
    });

    const nextStep = (next: Step) => setStep(next);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
                {step === "welcome" && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                        className="max-w-2xl w-full text-center space-y-8"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-brand-primary/10 rounded-3xl text-brand-primary animate-bounce-subtle">
                                <Sparkles size={48} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Badge variant="ghost" className="text-brand-primary font-bold tracking-widest uppercase px-4 h-8 bg-brand-primary/5 border border-brand-primary/10">
                                BIENVENIDO A SABER PRO ONE
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-semibold text-[var(--theme-text-primary)] tracking-tight text-pretty">
                                Tu mejor resultado empieza hoy.
                            </h1>
                            <p className="text-xl md:text-2xl text-[var(--theme-text-secondary)] font-medium max-w-lg mx-auto leading-relaxed">
                                Hemos diseñado un mapa de aprendizaje inteligente pensado exclusivamente para ti.
                            </p>
                        </div>

                        <div className="pt-8">
                            <Button
                                onClick={() => nextStep("profile")}
                                className="h-16 px-10 text-lg font-bold shadow-gold rounded-full"
                                size="xl"
                                icon={ArrowRight}
                                iconPosition="right"
                            >
                                Diseñar mi Plan Personal
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "profile" && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl w-full space-y-10"
                    >
                        <header className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">Paso 1 de 3</span>
                            <h2 className="text-4xl font-semibold text-[var(--theme-text-primary)] tracking-tight">Cúentanos sobre ti</h2>
                            <p className="text-[var(--theme-text-secondary)] font-medium">Esto nos ayuda a calibrar la dificultad y los módulos.</p>
                        </header>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <GraduationCap size={16} className="text-brand-primary" /> Carrera Universitaria
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Ingeniería de Sistemas"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    onChange={(e) => setProfile({ ...profile, career: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-brand-primary" /> Fecha de tu examen
                                </label>
                                <input
                                    type="date"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    onChange={(e) => setProfile({ ...profile, examDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" className="flex-1 h-14" onClick={() => nextStep("welcome")}>Atrás</Button>
                            <Button className="flex-[2] h-14 font-bold" onClick={() => nextStep("goals")}>Continuar</Button>
                        </div>
                    </motion.div>
                )}

                {step === "goals" && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl w-full space-y-10"
                    >
                        <header className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">Paso 2 de 3</span>
                            <h2 className="text-4xl font-semibold text-[var(--theme-text-primary)] tracking-tight">¿Cuál es tu meta?</h2>
                            <p className="text-[var(--theme-text-secondary)] font-medium">Personalizaremos tu camino según tu ambición.</p>
                        </header>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: "excellence", label: "Excelencia", desc: "Quiero el mejor puntaje del país", icon: Sparkles, color: "text-brand-accent", bg: "bg-brand-accent/5" },
                                { id: "improve", label: "Mejorar", desc: "Superar mi promedio actual", icon: Target, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                                { id: "pass", label: "Asegurar", desc: "Cumplir con los requisitos básicos", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/5" }
                            ].map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setProfile({ ...profile, goal: g.id })}
                                    className={cn(
                                        "w-full text-left p-6 rounded-2xl border transition-all duration-120 flex items-center gap-6 group",
                                        profile.goal === g.id ? "border-brand-primary ring-1 ring-brand-primary bg-brand-primary/[0.02]" : "border-[var(--theme-border-soft)] hover:border-brand-primary/30"
                                    )}
                                >
                                    <div className={cn("p-4 rounded-xl transition-colors", g.bg, g.color)}>
                                        <g.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[var(--theme-text-primary)]">{g.label}</h3>
                                        <p className="text-sm text-[var(--theme-text-secondary)]">{g.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" className="flex-1 h-14" onClick={() => nextStep("profile")}>Atrás</Button>
                            <Button className="flex-[2] h-14 font-bold" onClick={() => nextStep("diagnostic")}>Continuar</Button>
                        </div>
                    </motion.div>
                )}

                {step === "diagnostic" && (
                    <motion.div
                        key="diagnostic"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-xl w-full text-center space-y-8"
                    >
                        <div className="p-6 bg-brand-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-brand-primary">
                            <Target size={40} />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-semibold text-[var(--theme-text-primary)]">¿Hacemos un diagnóstico rápido?</h2>
                            <p className="text-lg text-[var(--theme-text-secondary)] leading-relaxed">
                                Solo 5 preguntas para entender tu nivel actual y crear un plan **realmente** adaptativo.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button className="h-16 text-lg font-bold shadow-gold" size="xl">
                                Iniciar Diagnóstico (2 min)
                            </Button>
                            <Button variant="ghost" className="h-14 opacity-60 hover:opacity-100" onClick={() => nextStep("generating")}>
                                Omitir por ahora
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "generating" && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-md w-full text-center space-y-12"
                    >
                        <div className="relative flex justify-center items-center h-48">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute w-40 h-40 border-4 border-dashed border-brand-primary/20 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                className="absolute w-32 h-32 border-4 border-dashed border-brand-accent/20 rounded-full"
                            />
                            <Sparkles className="text-brand-primary animate-pulse" size={48} />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-[var(--theme-text-primary)]">Generando tu Plan Maestro</h2>
                            <p className="text-[var(--theme-text-secondary)] animate-pulse">
                                Analizando carrera ({profile.career}) y meta ({profile.goal})...
                            </p>
                        </div>

                        <GeneratingProgress onComplete={() => window.location.href = '/dashboard'} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full -z-10" />
        </div>
    );
}

function GeneratingProgress({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + 1.2;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="w-full space-y-4">
            <div className="h-2 w-full bg-[var(--theme-bg-surface)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                <motion.div
                    className="h-full bg-brand-primary"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[var(--theme-text-secondary)]/50">
                <span>Calibrando</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
