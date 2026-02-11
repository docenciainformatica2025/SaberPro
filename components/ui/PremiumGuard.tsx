"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PremiumGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function PremiumGuard({ children, fallback }: PremiumGuardProps) {
    const { subscription, loading } = useAuth();

    if (loading) {
        // Can render a skeleton or nothing while checking
        return <div className="animate-pulse h-32 bg-[var(--theme-bg-surface)] rounded-xl w-full border border-[var(--theme-border-soft)]"></div>;
    }

    if (subscription?.plan === 'pro') {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    // Default "Locked" UI
    return (
        <div className="relative overflow-hidden rounded-2xl border border-theme-border-soft bg-surface-card p-8 text-center group hover:border-brand-primary/20 transition-all duration-300 shadow-sm">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-brand-primary/[0.02] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-4 bg-brand-primary/5 rounded-full border border-brand-primary/10 group-hover:scale-110 transition-transform duration-500">
                    <Lock className="w-8 h-8 text-brand-primary" />
                </div>

                <h3 className="text-xl font-bold text-theme-text-primary">Contenido Pro</h3>
                <p className="text-theme-text-secondary max-w-sm font-medium">
                    Esta función está disponible en el nivel <span className="text-brand-primary font-bold">Pro</span>. Desbloquea simulacros ilimitados y análisis avanzado.
                </p>

                <Link
                    href="/pricing"
                    className="mt-2"
                >
                    <Button variant="primary" icon={Sparkles}>
                        Actualizar a Pro
                    </Button>
                </Link>
            </div>
        </div>
    );
}
