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
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300" />
            <div className="bg-metal-dark border border-metal-gold/50 px-8 py-6 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)] flex flex-col items-center gap-4 animate-success-pulse">
                <div className="rounded-full bg-metal-gold/20 p-4">
                    <CheckCircle className="text-metal-gold w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">{message}</h3>
            </div>
        </div>
    );
}
