"use client";

import Link from "next/link";
import { ChevronLeft, Code2, GraduationCap, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-metal-gold/30 p-6 md:p-12 pb-24 flex items-center justify-center">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-metal-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl w-full relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Header with Back Button */}
                <div className="relative text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ChevronLeft} className="absolute left-0 top-0 text-metal-silver/40 hover:text-white uppercase tracking-widest text-[10px] hidden md:flex">
                            Volver
                        </Button>
                    </Link>
                    <Badge variant="outline" className="mb-6 px-4 py-1 text-[10px] uppercase font-black tracking-[0.3em] border-metal-silver/20 text-metal-silver/60">
                        Transparencia
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                        Acerca del <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold to-white">Autor</span>
                    </h1>
                    <p className="text-lg text-metal-silver/60 font-light max-w-xl mx-auto">
                        La filosofía y tecnología detrás de Saber Pro Trainer.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* The Author */}
                    <Card variant="glass" className="p-8 border-white/5 bg-white/[0.02]">
                        <div className="w-12 h-12 rounded-xl bg-metal-gold/10 flex items-center justify-center mb-6 text-metal-gold">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Desarrollo & Ingeniería</h3>
                        <p className="text-metal-silver text-sm leading-relaxed mb-6">
                            Esta plataforma fue diseñada y programada integralmente por el <strong>Ing. Antonio Rodríguez</strong>. No es una plantilla ni un producto de agencia, sino una solución construida desde cero con código moderno (Next.js, React, IA).
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-metal-silver/60">Ingeniería de Software</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-metal-silver/60">Neuroeducación</span>
                        </div>
                    </Card>

                    {/* The Method */}
                    <Card variant="glass" className="p-8 border-white/5 bg-white/[0.02]">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                            <GraduationCap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Propósito Educativo</h3>
                        <p className="text-metal-silver text-sm leading-relaxed mb-6">
                            El objetivo no es solo "pasar un examen", sino democratizar el acceso a herramientas de entrenamiento de alta calidad. Utilizamos algoritmos para identificar brechas de conocimiento que las clases tradicionales suelen pasar por alto.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-metal-silver/60">Aprendizaje Adaptativo</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-metal-silver/60">Datos Reales</span>
                        </div>
                    </Card>
                </div>

                {/* Tech Stack (Subtle) */}
                <div className="text-center space-y-4 pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-metal-silver/30 flex items-center justify-center gap-2">
                        <Terminal size={12} /> Tecnología Utilizada
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xs font-bold text-white">Next.js 14</span>
                        <span className="text-xs font-bold text-white">React Server Components</span>
                        <span className="text-xs font-bold text-white">Google Gemini AI</span>
                        <span className="text-xs font-bold text-white">Firebase</span>
                        <span className="text-xs font-bold text-white">Tailwind CSS</span>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-metal-gold/10 to-transparent p-[1px] rounded-2xl">
                    <div className="bg-[#0a0a0a] rounded-2xl p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-metal-gold/5 rounded-full blur-[50px] pointer-events-none" />

                        <h3 className="text-lg font-bold text-white mb-2">¿Interesado en implementar este modelo?</h3>
                        <p className="text-metal-silver text-sm mb-6 max-w-md mx-auto">
                            Si representas a una institución educativa y deseas adaptar esta tecnología, hablemos.
                        </p>

                        <a href="mailto:contacto@saberpro.app" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-metal-gold transition-colors">
                            <Mail size={16} /> Contactar al Desarrollador
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
