"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface PremiumGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function PremiumGuard({ children, fallback }: PremiumGuardProps) {
    const { subscription, loading } = useAuth();

    if (loading) {
        // Can render a skeleton or nothing while checking
        return <div className="animate-pulse h-32 bg-metal-silver/10 rounded-xl w-full"></div>;
    }

    if (subscription?.plan === 'pro') {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    // Default "Locked" UI
    return (
        <div className="relative overflow-hidden rounded-2xl border border-metal-gold/30 bg-metal-dark/50 p-8 text-center backdrop-blur-sm group hover:border-metal-gold/60 transition-colors">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-metal-gold/5 via-transparent to-metal-blue/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-4 bg-metal-gold/10 rounded-full border border-metal-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-8 h-8 text-metal-gold" />
                </div>

                <h3 className="text-xl font-bold text-white">Contenido Premium</h3>
                <p className="text-metal-silver/80 max-w-sm">
                    Esta función está reservada para usuarios Pro. Desbloquea simulacros ilimitados y análisis avanzado con IA.
                </p>

                <Link
                    href="/pricing"
                    className="mt-2 metallic-btn bg-gradient-to-r from-metal-gold to-[#B8860B] text-black font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                >
                    <Sparkles size={18} />
                    Actualizar a Pro
                </Link>
            </div>
        </div>
    );
}
