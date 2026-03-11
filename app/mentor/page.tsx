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

export default function MentorPage() {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");

    const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Estudiante";

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-24 font-sans flex flex-col" suppressHydrationWarning>
            {/* Header */}
            <div className="bg-[var(--theme-bg-base)]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[var(--theme-border-soft)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary relative border border-brand-primary/20">
                        <Bot size={22} />
                        <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-brand-success border-2 border-[var(--theme-bg-base)] rounded-full" />
                    </div>
                    <div>
                        <h1 className="font-bold text-[var(--theme-text-primary)] leading-tight">Mentor IA</h1>
                        <p className="text-[9px] font-bold text-brand-success tracking-widest uppercase">DISPONIBLE</p>
                    </div>
                </div>
                <Sparkles size={18} className="text-brand-primary/40" />
            </div>

            {/* Chat Area */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
                {/* Welcome message — uses real user name */}
                <div className="bg-[var(--theme-bg-surface)] rounded-[2rem] rounded-tl-none p-6 border border-[var(--theme-border-soft)] shadow-sm animate-in slide-in-from-left-4 duration-500 mb-6">
                    <p className="text-[var(--theme-text-primary)] text-base leading-relaxed font-serif">
                        ¡Hola <span className="text-brand-primary font-bold">{firstName}</span>! Soy tu Mentor IA.
                    </p>
                    <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed font-serif mt-3">
                        Una vez que completes tu primer simulacro, analizaré tu desempeño y te daré recomendaciones personalizadas. ¿En qué te puedo ayudar hoy?
                    </p>
                </div>

                {/* Coming soon features */}
                <div className="bg-brand-primary/5 border border-brand-primary/15 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                        <Lock size={18} className="text-brand-primary/60" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-brand-primary/60 uppercase tracking-widest mb-1">PRÓXIMAMENTE</p>
                        <p className="text-[var(--theme-text-primary)] text-sm font-semibold">Chat IA con contexto de tu progreso</p>
                        <p className="text-[var(--theme-text-tertiary)] text-xs mt-1 leading-relaxed">
                            El mentor analizará tus simulacros y te guiará en tiempo real. Disponible tras tu primer diagnóstico.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Area — disabled until feature is live */}
            <div className="p-4 bg-[var(--theme-bg-base)]/95 backdrop-blur-xl sticky bottom-[76px] z-10 w-full border-t border-[var(--theme-border-soft)]">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="El chat estará disponible próximamente..."
                            disabled
                            className="w-full h-12 bg-[var(--theme-bg-surface)] rounded-full px-5 pr-12 text-[var(--theme-text-tertiary)] placeholder:text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)] cursor-not-allowed opacity-60 text-sm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button disabled className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary/30 cursor-not-allowed">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
