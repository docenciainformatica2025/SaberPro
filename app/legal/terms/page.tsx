"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TermsOfServiceBody from "@/components/legal/TermsOfServiceBody";
import { Button } from "@/components/ui/Button";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary selection:text-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-slate-500 hover:text-brand-primary uppercase tracking-[0.2em] font-black text-[9px] mb-2 transition-all">
                            Volver al Inicio
                        </Button>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                        Términos y Condiciones
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Contrato legal de uso del simulador SaberPro.
                    </p>
                </div>

                {/* Content Card */}
                <div className="metallic-card p-8 md:p-12 rounded-3xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] shadow-2xl">
                    <TermsOfServiceBody />
                </div>
            </div>
        </div>
    );
}
