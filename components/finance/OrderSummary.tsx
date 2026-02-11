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
        <div className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] p-8 rounded-[var(--radius-lg)] space-y-8 shadow-sm">
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-brand-primary">
                    <CreditCard size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Saber Pro Licencia</span>
                </div>
                <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
                    Resumen de Compra
                </h3>
            </header>

            {/* Product Details */}
            <div className="space-y-4 border-b border-[var(--theme-border-soft)] pb-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="font-bold text-[var(--theme-text-primary)] text-lg">Plan {planName}</div>
                        <div className="text-[10px] text-[var(--theme-text-secondary)] uppercase font-bold tracking-widest">{billingPeriod}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[var(--theme-text-primary)] font-bold text-xl">
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
            <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between text-[var(--theme-text-secondary)]">
                    <span>Subtotal</span>
                    <span>${basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-[var(--theme-text-secondary)]/70">
                    <span>IVA (19%)</span>
                    <span>${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pt-6 flex justify-between items-center text-[var(--theme-text-primary)] border-t border-[var(--theme-border-soft)]">
                    <span className="font-bold text-lg">Total a Pagar</span>
                    <span className="font-bold text-3xl text-brand-primary tracking-tight">
                        {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                            style: 'currency',
                            currency: currency,
                            maximumFractionDigits: 0
                        }).format(price)}
                    </span>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-brand-primary/[0.03] border border-brand-primary/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-brand-primary font-bold tracking-widest uppercase">
                    <Lock size={12} strokeWidth={3} /> Pagos Seguros Encriptados (SSL)
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 flex items-center gap-1.5 grayscale opacity-50">
                        <div className="w-4 h-4 rounded-full bg-red-500/80"></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-500/80 -ml-2"></div>
                        <span className="text-[8px] font-bold text-white uppercase ml-1">Mastercard</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 grayscale opacity-50">
                        <span className="text-[8px] font-bold text-white uppercase">VISA</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 grayscale opacity-50">
                        <span className="text-[8px] font-bold text-white uppercase">PSE</span>
                    </div>
                </div>
                <p className="text-[10px] text-[var(--theme-text-secondary)]/50 leading-relaxed font-medium">
                    Sus datos de pago se procesan de forma segura a través de pasarelas certificadas PCI-DSS Nivel 1.
                    SaberPro no almacena su información financiera completa.
                </p>
            </div>
        </div>
    );
}
