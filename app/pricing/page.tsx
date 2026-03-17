"use client";

import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Check, X, Zap, Crown, Shield, ArrowRight, Star, Phone, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upgradeUserSubscription, redeemCoupon } from "@/services/finance/subscription.service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import dynamic from 'next/dynamic';

const PaymentGateway = dynamic(() => import("@/components/finance/PaymentGateway"), {
    ssr: false,
    loading: () => <div className="h-20 animate-pulse bg-[var(--theme-bg-surface)] rounded-xl border border-[var(--theme-border-soft)] flex items-center justify-center text-[10px] uppercase tracking-widest text-[var(--theme-text-tertiary)]">Cargando pasarela...</div>
});
import { PAYMENTS_WHATSAPP } from "@/lib/config";

const FeatureItem = ({ text, included = true }: { text: string, included?: boolean }) => (
    <li className={`flex items-center gap-3 ${included ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-quaternary)]/30'}`}>
        {included ? (
            <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Check size={12} strokeWidth={3} />
            </div>
        ) : (
            <div className="w-5 h-5 rounded-full bg-[var(--theme-bg-surface)] flex items-center justify-center text-[var(--theme-text-quaternary)]/30">
                <X size={12} strokeWidth={3} />
            </div>
        )}
        <span className={`text-sm font-medium ${included ? '' : 'line-through decoration-[var(--theme-text-quaternary)]/30'}`}>{text}</span>
    </li>
);

export default function PricingPage() {
    const { user, subscription, role } = useAuth();
    const [viewMode, setViewMode] = useState<'student' | 'teacher'>(
        role === 'teacher' ? 'teacher' : 'student'
    );
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState({ student: 49900, teacher: 89900 });
    const [currency, setCurrency] = useState("COP");
    const [couponCode, setCouponCode] = useState("");
    const [redeeming, setRedeeming] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, "system", "config");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setPricing({
                        student: data.monetization?.students?.price || 49900,
                        teacher: data.monetization?.teachers?.priceMonthly || 89900
                    });
                    setCurrency(data.monetization?.currency || "COP");
                }
            } catch (err: any) {
                // Silent catch for pricing config
            }
        };
        fetchConfig();
    }, []);

    const handleRedeemCoupon = async () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }
        if (!couponCode.trim()) return;

        setRedeeming(true);
        try {
            const result = await redeemCoupon(user.uid, couponCode);
            toast.success(`¡Genial! Tu plan ${result.plan.toUpperCase()} ya está activo. ¡A estudiar!`);
            router.push('/dashboard?promo_success=true');
        } catch (e: any) {
            toast.error(e.message || "Ups, ese código no parece funcionar. Revisa si está bien escrito.");
        } finally {
            setRedeeming(false);
        }
    };

    const handleUpgrade = async () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentResult: string) => {
        if (!user) return;
        setLoading(true);
        const amount = viewMode === 'teacher' ? pricing.teacher : pricing.student;

        let txId = paymentResult;
        let riskContext = undefined;

        try {
            const parsed = JSON.parse(paymentResult);
            if (parsed.transactionId) {
                txId = parsed.transactionId;
                riskContext = paymentResult;
            }
        } catch (e) { }

        try {
            await upgradeUserSubscription(user.uid, 'pro', txId, amount, currency, riskContext);
            setTimeout(() => {
                router.push(viewMode === 'teacher' ? '/teacher?payment_success=true' : '/dashboard?payment_success=true');
            }, 1000);
        } catch (e) {
            toast.error("Error al activar suscripción. Contacte soporte con ID: " + txId);
            setLoading(false);
        }
    };

    const isTeacher = viewMode === 'teacher';

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center space-y-8 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="absolute left-0 -top-24 text-[var(--theme-text-tertiary)] hover:text-brand-primary uppercase tracking-[0.2em] text-[9px] font-black hidden md:flex transition-all">
                        <ArrowRight className="rotate-180 mr-2" size={14} /> Volver al Inicio
                    </Button>
                </Link>

                <Badge variant="primary" className="mx-auto px-5 py-2 text-[9px] uppercase font-black tracking-[0.4em] shadow-[0_0_30px_rgba(212,175,55,0.15)] organic-border">
                    Membresía Élite
                </Badge>

                <h1 className="text-5xl md:text-8xl font-black tracking-tightest text-[var(--theme-text-primary)] leading-[0.85] font-academic">
                    INVERSIÓN EN <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[var(--theme-text-primary)] to-brand-primary italic">TU FUTURO</span>
                </h1>

                <p className="text-xl md:text-2xl text-[var(--theme-text-secondary)] max-w-2xl mx-auto font-academic italic opacity-70">
                    Herramientas profesionales para quienes no dejan su éxito al azar.
                </p>

                {/* Switch - Maestro Style */}
                <div className="inline-flex p-1.5 bg-[var(--theme-bg-surface)]/40 border border-[var(--theme-border-soft)] rounded-2xl backdrop-blur-xl shadow-2xl">
                    <button
                        onClick={() => setViewMode('student')}
                        className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${!isTeacher ? 'bg-brand-primary text-black shadow-xl shadow-brand-primary/20' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
                    >
                        Estudiantes
                    </button>
                    <button
                        onClick={() => setViewMode('teacher')}
                        className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isTeacher ? 'bg-[var(--theme-text-primary)] text-[var(--theme-bg-base)] shadow-xl shadow-black/20' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
                    >
                        Docentes
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full relative z-10">
                {/* Free / Basic Plan */}
                <Card variant="glass" className="p-10 md:p-14 flex flex-col border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/20 hover:border-brand-primary/20 transition-all duration-700 organic-border group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/[0.02] blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-brand-primary/5 transition-colors" />
                    
                    <div className="mb-10 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center text-[var(--theme-text-tertiary)] mb-8 shadow-inner border border-[var(--theme-border-soft)]">
                            <Shield size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-[var(--theme-text-primary)] uppercase tracking-tightest mb-2 font-academic">Acceso Básico</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[var(--theme-text-primary)] font-academic">$0</span>
                            <span className="text-[var(--theme-text-tertiary)] text-[10px] uppercase font-black tracking-widest">/ Gratuito</span>
                        </div>
                        <p className="text-[var(--theme-text-secondary)] text-sm mt-6 font-medium leading-relaxed font-academic italic opacity-70">
                            Explora los fundamentos y realiza diagnósticos iniciales sin costo.
                        </p>
                    </div>
                    <ul className="space-y-4 mb-12 flex-grow relative z-10">
                        <FeatureItem text="3 Simulacros Cortos (10 preguntas)" />
                        <FeatureItem text="Resultados Básicos (Sin IA)" />
                        <FeatureItem text="Acceso a Blog Educativo" />
                        <FeatureItem text="Simulacros Ilimitados" included={false} />
                        <FeatureItem text="Predicción de Puntaje IA" included={false} />
                        <FeatureItem text="Certificado de Excelencia" included={false} />
                    </ul>
                    <Link href="/register">
                        <Button variant="outline" className="w-full h-14 border-[var(--theme-border-soft)] hover:bg-[var(--theme-bg-base)] uppercase tracking-[0.2em] font-black text-[10px] organic-border transition-all">
                            Empezar Trayecto
                        </Button>
                    </Link>
                </Card>

                {/* PRO Plan */}
                <Card variant="primary" className="p-10 md:p-14 flex flex-col relative overflow-hidden transform md:-translate-y-6 shadow-4k organic-border-reverse group border-brand-primary/40 ring-1 ring-brand-primary/20">
                    <div className="absolute top-0 right-0 p-6 pointer-events-none">
                        <div className="bg-brand-primary text-black text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl animate-pulse">
                            Más Popular
                        </div>
                    </div>

                    <div className="mb-10 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-black mb-8 shadow-2xl shadow-brand-primary/30 organic-border-reverse transition-transform group-hover:scale-110 duration-700">
                            <Crown size={28} strokeWidth={2} />
                        </div>
                        <h3 className="text-3xl font-black text-[var(--theme-text-primary)] uppercase tracking-tightest mb-2 font-academic">
                            {isTeacher ? "Licencia Docente" : "SaberPro Elite"}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[var(--theme-text-primary)] to-brand-primary font-academic">
                                {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                                    style: 'currency',
                                    currency: currency,
                                    maximumFractionDigits: 0
                                }).format(isTeacher ? pricing.teacher : pricing.student)}
                            </span>
                            <span className="text-brand-primary text-[10px] uppercase font-black tracking-widest">/ {isTeacher ? 'Mes' : 'Único'}</span>
                        </div>
                        <p className="text-[var(--theme-text-primary)] text-sm mt-6 font-medium leading-relaxed font-academic italic opacity-90">
                            {isTeacher ? "Potencia el rendimiento de tus grupos con analítica predictiva." : "Entrenamiento de élite con retroalimentación inmediata por IA."}
                        </p>
                    </div>

                    <ul className="space-y-4 mb-12 flex-grow relative z-10">
                        {isTeacher ? (
                            <>
                                <FeatureItem text="Estudiantes Ilimitados" />
                                <FeatureItem text="Creación de Clases y Grupos" />
                                <FeatureItem text="Asignación de Simulacros" />
                                <FeatureItem text="Analítica de Grupo Avanzada" />
                                <FeatureItem text="Exportación de Reportes PDF" />
                            </>
                        ) : (
                            <>
                                <FeatureItem text="Simulacros Ilimitados (Todas las áreas)" />
                                <FeatureItem text="Retroalimentación Explicada por IA" />
                                <FeatureItem text="Predicción de Puntaje y Ranking" />
                                <FeatureItem text="Modo Entrenamiento (Cronometrado)" />
                                <FeatureItem text="Soporte Prioritario 24/7" />
                            </>
                        )}
                    </ul>

                    <Button
                        variant="primary"
                        className="w-full h-16 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:scale-[1.02] transition-all organic-border-reverse shimmer-gold kinesthetic-bounce"
                        onClick={handleUpgrade}
                        icon={Zap}
                    >
                        {user ? "Activar Experiencia PRO" : "Elevar Mi Potencial"}
                    </Button>
                </Card>
            </div>

            <div className="mt-16 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                {/* Coupon Card */}
                <Card variant="glass" className="p-8 bg-[var(--theme-bg-surface)]/20 border-[var(--theme-border-soft)] rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-brand-primary/[0.01] blur-2xl -ml-12 -mt-12 rounded-full group-hover:bg-brand-primary/[0.05] transition-colors" />
                    <div className="flex items-center gap-3 mb-6 text-brand-primary relative z-10">
                        <div className="p-2 bg-brand-primary/10 rounded-xl">
                            <Ticket size={18} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-text-primary)]">¿Cuentas con un código?</h4>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <input
                            type="text"
                            placeholder="EJ: PROMO-GOLD"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 h-14 bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-2xl px-5 text-[11px] font-black tracking-widest text-[var(--theme-text-primary)] focus:border-brand-primary/50 outline-none transition-all placeholder:text-[var(--theme-text-tertiary)]/40 shadow-inner"
                        />
                        <Button
                            variant="primary"
                            className="px-6 h-14 text-[10px] font-black uppercase tracking-widest organic-border shadow-xl shadow-brand-primary/10 transition-transform active:scale-95"
                            onClick={handleRedeemCoupon}
                            isLoading={redeeming}
                        >
                            Redimir
                        </Button>
                    </div>
                </Card>

                {/* WhatsApp Payment Card */}
                <Card variant="glass" className="p-8 bg-[var(--theme-bg-surface)]/20 border-[var(--theme-border-soft)] rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-brand-success/[0.01] blur-2xl -ml-12 -mt-12 rounded-full group-hover:bg-brand-success/[0.05] transition-colors" />
                    <div className="flex items-center gap-3 mb-6 text-brand-success relative z-10">
                        <div className="p-2 bg-brand-success/10 rounded-xl">
                            <Phone size={18} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-text-primary)]">Activación Directa</h4>
                    </div>
                    <p className="text-[11px] text-[var(--theme-text-secondary)] mb-6 font-academic font-medium italic opacity-70 relative z-10">¿Prefieres pagar vía Nequi? Gestiona tu membresía por WhatsApp.</p>
                    <Button
                        variant="outline"
                        className="w-full h-14 border-brand-success/20 text-brand-success hover:bg-brand-success/5 uppercase tracking-[0.2em] font-black text-[10px] organic-border-reverse transition-all relative z-10"
                        onClick={() => window.open(`https://wa.me/${PAYMENTS_WHATSAPP}?text=Hola,%20quiero%20adquirir%20el%20plan%20PRO%20por%20WhatsApp`, '_blank')}
                    >
                        Chatear con un experto
                    </Button>
                </Card>
            </div>

            <div className="mt-16 flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-500 scale-90 md:scale-100">
                <Shield size={16} className="text-brand-primary" />
                <span className="text-[9px] uppercase font-black text-[var(--theme-text-tertiary)] tracking-[0.25em]">Transacciones cifradas de extremo a extremo • Wompi Security Engine</span>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentGateway
                    planName={isTeacher ? "Licencia Docente" : "Plan Elite Pro"}
                    price={isTeacher ? pricing.teacher : pricing.student}
                    currency={currency}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
}
