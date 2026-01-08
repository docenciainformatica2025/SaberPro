"use client";

import { Shield, Lock, CreditCard, CheckCircle } from "lucide-react";

interface OrderSummaryProps {
    planName: string;
    price: number;
    billingPeriod: string;
    currency?: string;
}

export default function OrderSummary({ planName, price, billingPeriod, currency = "COP" }: OrderSummaryProps) {
    const taxRate = 0.19; // IVA Colombia
    const basePrice = price / (1 + taxRate);
    const taxAmount = price - basePrice;

    return (
        <div className="metallic-card p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="text-metal-gold" size={20} /> Resumen de Compra
            </h3>

            {/* Product Details */}
            <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-bold text-white text-lg">Saber Pro {planName}</div>
                        <div className="text-xs text-metal-silver uppercase tracking-wider">{billingPeriod}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-white font-mono font-bold">
                            {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                                style: 'currency',
                                currency: currency,
                                maximumFractionDigits: 0
                            }).format(price)} {currency}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-metal-silver/60">
                    <span>Subtotal</span>
                    <span className="font-mono">${basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-metal-silver/60">
                    <span>IVA (19%)</span>
                    <span className="font-mono">${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pt-4 flex justify-between items-center text-white border-t border-white/10">
                    <span className="font-bold text-lg">Total a Pagar</span>
                    <span className="font-mono font-black text-2xl text-metal-gold">
                        {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                            style: 'currency',
                            currency: currency,
                            maximumFractionDigits: 0
                        }).format(price)} {currency}
                    </span>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-black/40 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                    <Lock size={12} /> PAGOS SEGUROS ENCRIPTADOS (SSL)
                </div>
                <div className="flex items-center gap-3 opacity-60">
                    {/* Mock Card Logos */}
                    <div className="h-6 w-10 bg-white/10 rounded overflow-hidden relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full mix-blend-multiply opacity-80 left-3"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full mix-blend-multiply opacity-80 right-3"></div>
                    </div>
                    <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                    <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white">PSE</div>
                </div>
                <p className="text-[10px] text-metal-silver/40 leading-tight">
                    Sus datos de pago se procesan de forma segura a través de pasarelas certificadas PCI-DSS Nivel 1.
                    SaberPro no almacena su información financiera completa.
                </p>
            </div>
        </div>
    );
}
