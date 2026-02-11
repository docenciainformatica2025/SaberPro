"use client";

import { AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExitConfirmationModalProps {
    isOpen: boolean;
    onContinue: () => void;
    onExit: () => void;
}

export default function ExitConfirmationModal({ isOpen, onContinue, onExit }: ExitConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-error)] w-full max-w-md rounded-2xl p-6 shadow-[var(--theme-shadow-lg)] md:p-8 relative overflow-hidden">

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <AlertTriangle size={150} className="text-[var(--theme-text-error)]" />
                </div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-[var(--theme-bg-error-soft)] rounded-full flex items-center justify-center mb-6 mx-auto border border-[var(--theme-border-error)]">
                        <AlertTriangle className="text-[var(--theme-text-error)] w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-black text-center text-[var(--theme-text-primary)] mb-2 uppercase tracking-tight">
                        ¿Abandonar la Prueba?
                    </h2>

                    <p className="text-center text-[var(--theme-text-secondary)] mb-8 leading-relaxed font-medium">
                        Si sales ahora, tu prueba se <span className="text-[var(--theme-text-error)] font-bold">cortará</span> y se registrará solo el progreso hasta este punto.
                        No podrás retomar este intento.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={onContinue}
                            variant="premium"
                            className="w-full h-14 shadow-gold"
                            icon={ArrowRight}
                            iconPosition="left"
                        >
                            Continuar Examen
                        </Button>

                        <button
                            onClick={onExit}
                            className="w-full py-3.5 rounded-xl text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-error)] hover:bg-[var(--theme-bg-error-soft)] border border-transparent hover:border-[var(--theme-border-error)] transition-all font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <XCircle size={18} /> Sí, deseo abandonar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
