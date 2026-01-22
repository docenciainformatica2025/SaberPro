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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <Card variant="premium" glow className="w-full max-w-md p-8 border-red-500/30 bg-black/80 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden">

                {/* Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    {isActiveActivity ? <AlertTriangle size={150} /> : <XCircle size={150} />}
                </div>

                <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto border transition-colors ${isActiveActivity ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-metal-gold/10 border-metal-gold/20 text-metal-gold'
                        }`}>
                        {isActiveActivity ? <AlertTriangle size={32} /> : isLogout ? <LogOut size={32} /> : <Home size={32} />}
                    </div>

                    <h2 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tight italic">
                        {isActiveActivity ? "¿ABANDONAR SIMULACRO?" : isLogout ? "¿CERRAR SESIÓN?" : "¿VOLVER AL INICIO?"}
                    </h2>

                    <p className="text-center text-metal-silver mb-8 leading-relaxed font-medium">
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
                            className={`w-full h-14 text-sm font-black uppercase tracking-widest ${isActiveActivity ? 'shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'border-red-500/20 text-red-400 hover:bg-red-500/5 hover:text-red-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                {isActiveActivity ? (isLogout ? 'Guardar y Salir' : 'Confirmar Salida') : (isLogout ? 'Sí, Cerrar Sesión' : 'Sí, Volver al Inicio')}
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full text-metal-silver hover:text-white uppercase text-[10px] font-black tracking-widest"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
