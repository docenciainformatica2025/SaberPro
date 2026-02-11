"use client";

import PublicQuizEngine from "@/components/diagnostic/PublicQuizEngine";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function DiagnosticPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] selection:bg-brand-primary/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors z-20" aria-label="Volver al inicio">
                <ChevronLeft size={16} /> Volver
            </Link>

            <div className="relative z-10 w-full max-w-2xl">
                <div className="text-center mb-10 space-y-4">
                    <Badge variant="primary" className="mx-auto px-4 py-1.5 text-[10px] bg-brand-primary/10 text-brand-primary border-brand-primary/20 uppercase tracking-[0.2em]">
                        Micro-Diagnóstico Gratuito
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-semibold text-[var(--theme-text-primary)] italic tracking-tight uppercase">
                        Mide tu Nivel <span className="text-metal-old">Real</span>
                    </h1>
                    <p className="text-[var(--theme-text-secondary)]/60 text-lg">
                        5 preguntas clave para identificar tus brechas antes del registro.
                    </p>
                </div>

                <PublicQuizEngine />
            </div>
        </div>
    );
}
