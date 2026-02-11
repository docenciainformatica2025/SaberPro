import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TermsOfServiceBody from "@/components/legal/TermsOfServiceBody";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary selection:text-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-brand-primary transition-colors mb-4 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-text-primary)] via-[var(--theme-text-secondary)] to-[var(--theme-text-primary)]">
                        Términos y Condiciones
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] max-w-2xl mx-auto leading-relaxed">
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
