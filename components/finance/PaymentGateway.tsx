"use client";

import { useState, useEffect } from "react";
import { X, Lock, CreditCard, ShieldCheck, Loader2, AlertCircle, CheckCircle, Smartphone, Building2, Landmark, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import OrderSummary from "./OrderSummary";

interface PaymentGatewayProps {
    planName: string;
    price: number;
    onSuccess: (result: string) => void;
    onCancel: () => void;
}

export default function PaymentGateway({ planName, price, onSuccess, onCancel }: PaymentGatewayProps) {
    const [step, setStep] = useState<'selection' | 'redirecting' | 'success'>('selection');
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'nequi' | 'pse' | 'bancolombia'>('card');
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock Device ID for Audit
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        setDeviceId("dev_" + Math.random().toString(36).substring(2) + Date.now().toString(36));
    }, []);

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
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Main Container */}
            <div className={`w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 ${step === 'success' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} transition-all duration-500`}>

                {/* Left: Summary */}
                <div className="order-2 lg:order-1 h-full">
                    <OrderSummary planName={planName} price={price} billingPeriod="Anual" />

                </div>

                {/* Right: Payment Interface */}
                <div className="order-1 lg:order-2 metallic-card bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col h-full min-h-[500px]">
                    <button onClick={onCancel} className="absolute top-4 right-4 text-metal-silver hover:text-white transition-colors z-10">
                        <X size={24} />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Lock className="text-metal-gold" /> Checkout Seguro
                        </h2>
                        <p className="text-sm text-metal-silver mt-1">Seleccione su método de pago preferido</p>
                    </div>

                    {step === 'selection' && (
                        <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">

                            {/* Method Grid */}
                            <div className="grid grid-cols-1 gap-3 mb-6">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMethod(m.id as any)}
                                        className={`relative group p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${selectedMethod === m.id
                                            ? 'bg-metal-gold/10 border-metal-gold'
                                            : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedMethod === m.id ? 'bg-metal-gold text-black' : 'bg-white/10 text-metal-silver'}`}>
                                                {m.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-bold ${selectedMethod === m.id ? 'text-white' : 'text-metal-silver group-hover:text-white'}`}>
                                                    {m.label}
                                                </div>
                                                <div className="text-[10px] text-metal-silver/50 uppercase tracking-wider">
                                                    {m.logos.join(' • ')}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedMethod === m.id && (
                                            <div className="w-5 h-5 rounded-full bg-metal-gold flex items-center justify-center animate-in zoom-in">
                                                <CheckCircle size={12} className="text-black" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Divider with Secure Info */}
                            <div className="mt-auto space-y-4">
                                {/* Legal Checkbox */}
                                <div className="bg-metal-blue/5 rounded-lg p-3 border border-metal-blue/10 flex gap-3 items-start cursor-pointer hover:bg-metal-blue/10 transition-colors" onClick={() => setLegalAccepted(!legalAccepted)}>
                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${legalAccepted ? 'bg-metal-gold border-metal-gold' : 'border-metal-silver bg-black/50'}`}>
                                        {legalAccepted && <CheckCircle size={12} className="text-black" />}
                                    </div>
                                    <p className="text-[10px] text-metal-silver/80 leading-relaxed select-none">
                                        Acepto iniciar el servicio inmediatamente y <Link href="/terms" target="_blank" className="text-metal-gold hover:underline">renuncio al derecho de retracto</Link>.
                                    </p>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-xs flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
                                        <AlertCircle size={14} /> {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePay}
                                    className="w-full metallic-btn bg-metal-gold text-black font-black py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 text-lg transform transition-all hover:scale-[1.02]"
                                >
                                    PAGAR ${price.toLocaleString()} <ChevronRight size={20} />
                                </button>

                                <div className="flex justify-center gap-4 opacity-30 pt-2 text-metal-silver">
                                    {/* Simple Icons as Footers */}
                                    <div className="flex items-center gap-1 text-[10px]"><Lock size={10} /> SSL ENCRYPTED</div>
                                    <div className="flex items-center gap-1 text-[10px]"><Globe size={10} /> GLOBAL SECURE</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'redirecting' && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-t-metal-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <Lock size={32} className="text-white animate-pulse" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Redirigiendo a Pasarela Segura</h3>
                                <p className="text-metal-silver text-sm max-w-xs mx-auto">
                                    Estamos transfiriéndolo al sitio seguro de su banco/entidad para completar el pago.
                                </p>
                                <div className="mt-6 flex flex-col items-center gap-2">
                                    <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-metal-gold animate-progress w-full origin-left" style={{ animation: 'progress 2s linear' }}></div>
                                    </div>
                                    <span className="text-[10px] text-metal-silver/40 font-mono">HANDSHAKE TLS 1.3 ESTABLISHED</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Success View */}
            {step === 'success' && (
                <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-700">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center text-black relative z-10 shadow-[0_0_100px_rgba(34,197,94,0.6)]">
                            <CheckCircle size={64} className="animate-bounce" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-green-500 scale-150 opacity-20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full border border-green-500 scale-125 opacity-40 animate-pulse"></div>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">¡PAGO EXITOSO!</h2>
                    <p className="text-xl text-metal-silver mb-8">Tu plan <span className="text-metal-gold font-bold">PRO</span> ha sido activado.</p>
                    <p className="text-sm text-metal-silver/40">Redirigiendo a tu panel de control...</p>
                </div>
            )}
        </div>
    );
}
