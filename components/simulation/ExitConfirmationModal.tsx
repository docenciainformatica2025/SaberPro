"use client";

import { AlertTriangle, XCircle, ArrowRight } from "lucide-react";

interface ExitConfirmationModalProps {
    isOpen: boolean;
    onContinue: () => void;
    onExit: () => void;
}

export default function ExitConfirmationModal({ isOpen, onContinue, onExit }: ExitConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-metal-dark border border-red-500/30 w-full max-w-md rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] md:p-8 relative overflow-hidden">

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <AlertTriangle size={150} />
                </div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/20">
                        <AlertTriangle className="text-red-500 w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-white mb-2">
                        ¿Abandonar la Prueba?
                    </h2>

                    <p className="text-center text-metal-silver mb-8 leading-relaxed">
                        Si sales ahora, tu prueba se <span className="text-red-400 font-bold">cortará</span> y se registrará solo el progreso hasta este punto.
                        No podrás retomar este intento.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onContinue}
                            className="w-full metallic-btn bg-gradient-to-r from-metal-gold to-[#B8860B] text-black font-bold py-3.5 rounded-xl shadow-lg hover:shadow-metal-gold/20 flex items-center justify-center gap-2 transform transition-transform hover:scale-[1.02]"
                        >
                            <ArrowRight size={20} /> Continuar Examen
                        </button>

                        <button
                            onClick={onExit}
                            className="w-full py-3.5 rounded-xl text-metal-silver/60 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <XCircle size={18} /> Sí, deseo abandonar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
