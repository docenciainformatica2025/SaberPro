"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Bot,
    Send,
    Sparkles,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import BottomNav from "@/components/layout/BottomNav";
import SupportChat from "@/components/ui/SupportChat";

export default function MentorPage() {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Estudiante";

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 font-sans flex flex-col" suppressHydrationWarning>
            {/* Header Content for Context */}
            <div className="px-6 pt-12 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black tracking-widest uppercase mb-4">
                    <Sparkles size={12} fill="currentColor" /> Mentoría Cognitiva Activa
                </div>
                <h1 className="text-3xl font-bold text-[var(--theme-text-primary)] tracking-tight">
                    Tu <span className="text-brand-primary italic">Mentor Personal</span>
                </h1>
                <p className="text-sm text-[var(--theme-text-secondary)] mt-2 font-medium">
                    Hola {firstName}, estoy aquí para guiarte en tu preparación Saber Pro. ¿Tienes dudas técnicas o académicas?
                </p>
            </div>

            <div className="flex-1 px-6 max-w-2xl mx-auto w-full h-[600px]">
                <SupportChat isGlobal={false} />
            </div>

            <BottomNav />
        </div>
    );
}
