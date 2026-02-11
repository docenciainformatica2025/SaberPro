import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrivacyContent from "@/components/legal/PrivacyContent";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary selection:text-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-brand-primary transition-colors mb-4 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-text-primary)] via-[var(--theme-text-secondary)] to-[var(--theme-text-primary)]">
                        Política de Privacidad
                    </h1>
                </div>

                {/* Content Card */}
                <div className="metallic-card p-8 md:p-12 rounded-3xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] shadow-2xl">
                    <PrivacyContent />
                </div>
            </div>
        </div>
    );
}
