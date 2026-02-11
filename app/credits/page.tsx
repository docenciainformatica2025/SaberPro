"use client";

import Link from "next/link";
import { ChevronLeft, Code2, GraduationCap, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] selection:bg-brand-primary/30 p-6 md:p-12 pb-24 flex items-center justify-center">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl w-full relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Header with Back Button */}
                <div className="relative text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ChevronLeft} className="absolute left-0 top-0 text-theme-text-secondary/60 hover:text-brand-primary tracking-wide text-[10px] hidden md:flex">
                            Volver
                        </Button>
                    </Link>
                    <Badge variant="outline" className="mb-6 px-4 py-1 text-[10px] font-semibold tracking-wider border-theme-border-soft text-theme-text-tertiary">
                        Transparencia
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-semibold text-theme-text-primary tracking-tight mb-4">
                        Acerca del <span className="text-brand-primary">Autor</span>
                    </h1>
                    <p className="text-lg text-theme-text-secondary font-medium max-w-xl mx-auto">
                        La filosofía y tecnología detrás de Saber Pro Trainer.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* The Author */}
                    <Card variant="glass" className="p-8 border-theme-border-soft bg-theme-bg-surface/40">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-theme-text-primary mb-2 tracking-wide">Desarrollo & Ingeniería</h3>
                        <p className="text-theme-text-secondary text-sm leading-relaxed mb-6">
                            Esta plataforma fue diseñada y programada integralmente por el <strong>Ing. Antonio Rodríguez</strong>. No es una plantilla ni un producto de agencia, sino una solución construida desde cero con código moderno (Next.js, React, IA).
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded bg-theme-bg-surface/60 border border-theme-border-soft text-[10px] font-mono text-theme-text-tertiary">Ingeniería de Software</span>
                            <span className="px-2 py-1 rounded bg-theme-bg-surface/60 border border-theme-border-soft text-[10px] font-mono text-theme-text-tertiary">Neuroeducación</span>
                        </div>
                    </Card>

                    {/* The Method */}
                    <Card variant="glass" className="p-8 border-theme-border-soft bg-theme-bg-surface/40">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
                            <GraduationCap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-theme-text-primary mb-2 tracking-wide">Propósito Educativo</h3>
                        <p className="text-theme-text-secondary text-sm leading-relaxed mb-6">
                            El objetivo no es solo "pasar un examen", sino democratizar el acceso a herramientas de entrenamiento de alta calidad. Utilizamos algoritmos para identificar brechas de conocimiento que las clases tradicionales suelen pasar por alto.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded bg-theme-bg-surface/60 border border-theme-border-soft text-[10px] font-mono text-theme-text-tertiary">Aprendizaje Adaptativo</span>
                            <span className="px-2 py-1 rounded bg-theme-bg-surface/60 border border-theme-border-soft text-[10px] font-mono text-theme-text-tertiary">Datos Reales</span>
                        </div>
                    </Card>
                </div>

                {/* Tech Stack (Subtle) */}
                <div className="text-center space-y-4 pt-8 border-t border-theme-border-soft">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-theme-text-tertiary flex items-center justify-center gap-2">
                        <Terminal size={12} /> Tecnología Utilizada
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 transition-all duration-500">
                        <span className="text-xs font-bold text-theme-text-secondary">Next.js 14</span>
                        <span className="text-xs font-bold text-theme-text-secondary">React Server Components</span>
                        <span className="text-xs font-bold text-theme-text-secondary">Google Gemini AI</span>
                        <span className="text-xs font-bold text-theme-text-secondary">Firebase</span>
                        <span className="text-xs font-bold text-theme-text-secondary">Tailwind CSS</span>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-brand-primary/5 p-[1px] rounded-2xl border border-brand-primary/10">
                    <div className="bg-theme-bg-surface/50 rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-theme-text-primary mb-2">¿Interesado en implementar este modelo?</h3>
                        <p className="text-theme-text-secondary text-sm mb-6 max-w-md mx-auto">
                            Si representas a una institución educativa y deseas adaptar esta tecnología, hablemos.
                        </p>

                        <a href="mailto:contacto@saberpro.app" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--theme-bg-base)] font-bold tracking-wider text-xs rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20">
                            <Mail size={16} /> Contactar al Desarrollador
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
