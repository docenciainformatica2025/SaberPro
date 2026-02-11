import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
    message?: string;
    isVisible: boolean;
    onAnimationEnd?: () => void;
}

export default function SuccessAnimation({ message = "¡Excelente!", isVisible, onAnimationEnd }: SuccessAnimationProps) {
    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            onAnimationEnd={onAnimationEnd}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" />
            <div className="bg-[var(--theme-bg-surface)] border border-brand-primary/50 px-8 py-6 rounded-2xl shadow-[var(--theme-accent-gold-soft)] flex flex-col items-center gap-4 animate-success-pulse">
                <div className="rounded-full bg-brand-primary/10 p-4 border border-brand-primary/20">
                    <CheckCircle className="text-brand-primary w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-[var(--theme-text-primary)] tracking-wide">{message || "¡Éxito!"}</h3>
            </div>
        </div>
    );
}
