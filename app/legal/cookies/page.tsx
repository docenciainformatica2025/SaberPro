"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CookieContent from "@/components/legal/CookieContent";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary selection:text-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <Link href="/">
                            <Logo variant="full" size="md" className="hover:scale-105 transition-transform" />
                        </Link>
                        <Link href="/">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={ArrowLeft}
                                className="text-[var(--theme-text-tertiary)] hover:text-brand-primary uppercase tracking-[0.2em] font-black text-[9px] transition-all"
                            >
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-[0.9] font-academic">
                        Política de <span className="text-brand-primary italic">Cookies</span>
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed font-academic italic text-lg md:text-xl">
                        Transparencia en el uso de tecnologías de rastreo.
                    </p>
                </div>

                {/* Content Card */}
                <Card variant="glass" className="p-8 md:p-14 rounded-3xl bg-[var(--theme-bg-surface)]/20 border border-[var(--theme-border-soft)] shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/[0.02] blur-[100px] -mr-32 -mt-32 rounded-full transition-opacity group-hover:opacity-100 opacity-60" />
                    <div className="relative z-10 prose prose-invert prose-brand max-w-none">
                        <CookieContent />
                    </div>
                </Card>
            </div>
        </div>
    );
}
