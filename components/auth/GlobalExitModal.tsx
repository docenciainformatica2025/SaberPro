"use client";

import { AlertTriangle, LogOut, XCircle, ArrowRight, Home } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface GlobalExitModalProps {
    isOpen: boolean;
    type: 'logout' | 'navigation';
    isActiveActivity: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function GlobalExitModal({ isOpen, type, isActiveActivity, onCancel, onConfirm }: GlobalExitModalProps) {
    if (!isOpen) return null;

    const isLogout = type === 'logout';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-xl animate-in fade-in duration-300">
            <Card variant="premium" glow className="w-full max-w-md p-8 border-[var(--theme-border-error)] shadow-[var(--theme-shadow-lg)] relative overflow-hidden bg-[var(--theme-bg-surface)]">

                {/* Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    {isActiveActivity ? <AlertTriangle size={150} className="text-[var(--theme-text-error)]" /> : <XCircle size={150} className="text-[var(--theme-text-tertiary)]" />}
                </div>

                <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto border transition-colors ${isActiveActivity ? 'bg-[var(--theme-bg-error-soft)] border-[var(--theme-border-error)] text-[var(--theme-text-error)]' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                        }`}>
                        {isActiveActivity ? <AlertTriangle size={32} /> : isLogout ? <LogOut size={32} /> : <Home size={32} />}
                    </div>

                    <h2 className="text-2xl font-black text-center text-[var(--theme-text-primary)] mb-2 uppercase tracking-tighter italic">
                        {isActiveActivity ? "¿ABANDONAR SIMULACRO?" : isLogout ? "¿CERRAR SESIÓN?" : "¿VOLVER AL INICIO?"}
                    </h2>

                    <p className="text-center text-[var(--theme-text-secondary)] mb-8 leading-relaxed font-medium text-sm">
                        {isActiveActivity
                            ? "Si sales ahora, tu progreso se guardará automáticamente y la sesión se dará por terminada. No podrás reanudar este intento."
                            : isLogout
                                ? "¿Estás seguro de que deseas cerrar tu sesión de entrenamiento?"
                                : "¿Deseas salir al menú principal? No se perderá ningún dato guardado."
                        }
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={onConfirm}
                            variant={isActiveActivity ? "premium" : "outline"}
                            className={`w-full h-12 text-xs font-bold uppercase tracking-widest ${isActiveActivity ? 'shadow-gold' : 'border-[var(--theme-border-error)] text-[var(--theme-text-error)] hover:bg-[var(--theme-bg-error-soft)]'}`}
                        >
                            <span className="flex items-center gap-2">
                                {isActiveActivity ? (isLogout ? 'Guardar y Salir' : 'Confirmar Salida') : (isLogout ? 'Sí, Cerrar Sesión' : 'Sí, Volver al Inicio')} {isActiveActivity ? null : <ArrowRight size={14} />}
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] uppercase text-[10px] font-black tracking-widest hover:bg-[var(--theme-bg-base)]/10"
                        >
                            Cancelar Operación
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
