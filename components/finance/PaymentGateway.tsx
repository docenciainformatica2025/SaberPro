"use client";

import { useState, useEffect } from "react";
import { X, Lock, CreditCard, ShieldCheck, Loader2, AlertCircle, CheckCircle, Smartphone, Building2, Landmark, ChevronRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import OrderSummary from "./OrderSummary";

interface PaymentGatewayProps {
    planName: string;
    price: number;
    onSuccess: (result: string) => void;
    onCancel: () => void;
    currency?: string;
}

export default function PaymentGateway({ planName, price, onSuccess, onCancel, currency = "COP" }: PaymentGatewayProps) {
    const [step, setStep] = useState<'selection' | 'redirecting' | 'success'>('selection');
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'nequi' | 'pse' | 'bancolombia'>('card');
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock Device ID for Audit
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        if (!deviceId) {
            const timer = setTimeout(() => {
                setDeviceId("dev_" + Math.random().toString(36).substring(2) + Date.now().toString(36));
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [deviceId]);

    const methods = [
        { id: 'card', label: 'Tarjeta Crédito/Débito', icon: <CreditCard size={24} />, logos: ['Visa', 'Mastercard'] },
        { id: 'nequi', label: 'Nequi / Daviplata', icon: <Smartphone size={24} />, logos: ['Nequi'] },
        { id: 'pse', label: 'PSE (Transferencia)', icon: <Building2 size={24} />, logos: ['PSE'] },
        { id: 'bancolombia', label: 'Botón Bancolombia', icon: <Landmark size={24} />, logos: ['Bancolombia'] }
    ] as const;

    const handlePay = () => {
        if (!legalAccepted) {
            setError("Debe aceptar los términos y renuncia de retracto para continuar.");
            return;
        }
        setError(null);
        setStep('redirecting');

        // Simulate Redirect Latency and Return
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                const riskContext = {
                    transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    deviceId,
                    userAgent: window.navigator.userAgent,
                    ip: 'ANONYMIZED_IP',
                    method: {
                        type: 'redirect',
                        provider: selectedMethod.toUpperCase()
                    }
                };
                onSuccess(JSON.stringify(riskContext));
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[var(--theme-bg-base)]/80 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Main Container */}
            <div className={`w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${step === 'success' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} transition-all duration-500`}>

                {/* Left: Summary */}
                <div className="order-2 lg:order-1 flex flex-col justify-center">
                    <OrderSummary planName={planName} price={price} billingPeriod="Anual" currency={currency} />
                </div>

                {/* Right: Payment Interface */}
                <div className="order-1 lg:order-2 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-[var(--radius-lg)] p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[550px]">
                    <button
                        onClick={onCancel}
                        aria-label="Cerrar pasarela de pago"
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--theme-bg-overlay)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all duration-120"
                    >
                        <X size={24} />
                    </button>

                    <div className="mb-10 space-y-1">
                        <div className="flex items-center gap-2 text-brand-primary">
                            <Lock size={16} strokeWidth={3} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
                        </div>
                        <h2 className="text-4xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
                            Checkout Seguro
                        </h2>
                        <p className="text-[var(--theme-text-secondary)] font-medium">Seleccione su método de pago preferido</p>
                    </div>

                    {step === 'selection' && (
                        <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-180">

                            {/* Method Grid */}
                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMethod(m.id as any)}
                                        className={cn(
                                            "relative group p-6 rounded-2xl border flex items-center justify-between transition-all duration-120",
                                            selectedMethod === m.id
                                                ? "bg-brand-primary/[0.03] border-brand-primary ring-1 ring-brand-primary"
                                                : "bg-transparent border-[var(--theme-border-soft)] hover:border-brand-primary/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-180",
                                                selectedMethod === m.id ? "bg-brand-primary text-white shadow-gold" : "bg-[var(--theme-bg-overlay)] text-[var(--theme-text-secondary)]"
                                            )}>
                                                {m.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className={cn(
                                                    "font-bold text-lg transition-colors",
                                                    selectedMethod === m.id ? "text-[var(--theme-text-primary)]" : "text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)]"
                                                )}>
                                                    {m.label}
                                                </div>
                                                <div className="text-[10px] text-[var(--theme-text-secondary)]/50 uppercase font-bold tracking-widest mt-0.5">
                                                    {m.logos.join(' • ')}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedMethod === m.id && (
                                            <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center animate-in zoom-in duration-120">
                                                <CheckCircle size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-auto space-y-6">
                                {/* Legal Checkbox */}
                                <div
                                    className="bg-[var(--theme-bg-overlay)] rounded-xl p-4 border border-[var(--theme-border-soft)] flex gap-4 items-start cursor-pointer hover:bg-[var(--theme-bg-surface)] transition-all duration-120 select-none group"
                                    onClick={() => setLegalAccepted(!legalAccepted)}
                                >
                                    <div className={cn(
                                        "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-120",
                                        legalAccepted ? "bg-brand-primary border-brand-primary" : "border-[var(--theme-border-medium)] bg-transparent group-hover:border-brand-primary/50"
                                    )}>
                                        {legalAccepted && <CheckCircle size={12} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <p className="text-[11px] text-[var(--theme-text-secondary)] font-medium leading-relaxed">
                                        Acepto iniciar el servicio inmediatamente y <Link href="/legal/terms" target="_blank" className="text-brand-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>renuncio al derecho de retracto</Link>.
                                    </p>
                                </div>

                                <button
                                    onClick={handlePay}
                                    disabled={!legalAccepted}
                                    className={cn(
                                        "w-full h-16 rounded-full flex items-center justify-center gap-3 text-lg font-bold transition-all duration-180",
                                        legalAccepted
                                            ? "bg-brand-primary text-white shadow-gold hover:brightness-105 active:scale-[0.98]"
                                            : "bg-[var(--theme-bg-overlay)] text-[var(--theme-text-quaternary)] cursor-not-allowed opacity-50"
                                    )}
                                >
                                    Pagar {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                                        style: 'currency',
                                        currency: currency,
                                        maximumFractionDigits: 0
                                    }).format(price)} <ChevronRight size={20} />
                                </button>

                                <div className="flex justify-center gap-6 opacity-30 pt-2 text-[var(--theme-text-secondary)]">
                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest"><Lock size={12} /> SSL ENCRYPTED</div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest"><Globe size={12} /> GLOBAL SECURE</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'redirecting' && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-[var(--theme-border-soft)] border-t-brand-primary rounded-full transition-colors"
                                />
                                <Lock size={40} className="text-brand-primary animate-pulse" />
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)]">Conexión Segura</h3>
                                <p className="text-[var(--theme-text-secondary)] font-medium max-w-xs mx-auto leading-relaxed">
                                    Estamos conectando con su entidad financiera. Por favor, no cierre esta ventana.
                                </p>
                                <div className="mt-8 flex flex-col items-center gap-3">
                                    <div className="h-1.5 w-40 bg-[var(--theme-bg-overlay)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                                        <div className="h-full bg-brand-primary animate-progress w-full origin-left" style={{ animation: 'progress 3s ease-in-out' }}></div>
                                    </div>
                                    <span className="text-[10px] text-[var(--theme-text-secondary)]/30 font-bold tracking-[0.2em] uppercase">Handshake TLS 1.3</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Success View */}
            {step === 'success' && (
                <div className="fixed inset-0 z-[110] bg-[var(--theme-bg-base)] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
                    <div className="relative mb-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-40 h-40 rounded-full bg-brand-success flex items-center justify-center text-white relative z-10 shadow-gold"
                        >
                            <CheckCircle size={80} strokeWidth={3} className="animate-bounce" />
                        </motion.div>
                        <div className="absolute inset-0 rounded-full border-2 border-brand-success scale-150 opacity-20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full border border-brand-success scale-125 opacity-40 animate-pulse"></div>
                    </div>
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-5xl font-semibold text-[var(--theme-text-primary)] tracking-tight">¡Pago Exitoso!</h2>
                        <p className="text-xl text-[var(--theme-text-secondary)] font-medium leading-relaxed">
                            Tu suscripción <span className="text-brand-primary font-bold">Pro</span> ha sido activada con éxito.
                        </p>
                        <div className="pt-8">
                            <p className="text-sm text-[var(--theme-text-quaternary)] font-bold uppercase tracking-[0.3em] animate-pulse">
                                Redirigiendo a tu Dashboard
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
