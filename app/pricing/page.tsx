"use client";

import { useAuth } from "@/context/AuthContext";
import { Check, X, Zap, Crown, Shield, ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upgradeUserSubscription } from "@/services/finance/subscription.service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import PaymentGateway from "@/components/finance/PaymentGateway";

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
            } catch (err) {
                console.error("Error fetching pricing config:", err);
            }
        };
        fetchConfig();
    }, []);

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
            console.error(e);
            alert("Error al activar suscripción. Contacte soporte con ID: " + txId);
            setLoading(false);
        }
    };

    const isTeacher = viewMode === 'teacher';

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="absolute left-0 -top-20 text-[var(--theme-text-secondary)]/40 hover:text-[var(--theme-text-primary)] uppercase tracking-wider text-[10px] hidden md:flex">
                        <ArrowRight className="rotate-180 mr-2" size={14} /> Volver
                    </Button>
                </Link>

                <Badge variant="primary" className="mx-auto px-4 py-1.5 text-[10px] uppercase font-semibold tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    Membresía
                </Badge>

                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-[var(--theme-text-primary)] uppercase italic">
                    Planes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[var(--theme-text-primary)] to-brand-primary">Acceso</span>
                </h1>

                <p className="text-xl text-[var(--theme-text-secondary)]/60 max-w-2xl mx-auto font-light">
                    Herramientas profesionales para quien toma su preparación en serio.
                </p>

                {/* Switch */}
                <div className="inline-flex p-1 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-full backdrop-blur-md">
                    <button
                        onClick={() => setViewMode('student')}
                        className={`px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${!isTeacher ? 'bg-brand-primary text-[var(--theme-bg-base)] shadow-lg shadow-brand-primary/20' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
                    >
                        Estudiantes
                    </button>
                    <button
                        onClick={() => setViewMode('teacher')}
                        className={`px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${isTeacher ? 'bg-metal-blue text-white shadow-lg shadow-metal-blue/20' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
                    >
                        Docentes
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
                {/* Free / Basic Plan */}
                <Card variant="glass" className="p-10 flex flex-col border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] hover:border-[var(--theme-border-medium)] transition-colors">
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[var(--theme-bg-base)] flex items-center justify-center text-[var(--theme-text-secondary)] mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] uppercase tracking-tight mb-2">Acceso Básico</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-[var(--theme-text-primary)]">$0</span>
                            <span className="text-[var(--theme-text-secondary)] text-sm uppercase font-bold">/ Siempre</span>
                        </div>
                        <p className="text-[var(--theme-text-secondary)]/60 text-sm mt-4 font-medium leading-relaxed">
                            Ideal para conocer la plataforma y realizar diagnósticos iniciales.
                        </p>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                        <FeatureItem text="3 Simulacros Cortos (10 preguntas)" />
                        <FeatureItem text="Resultados Básicos (Sin IA)" />
                        <FeatureItem text="Acceso a Blog Educativo" />
                        <FeatureItem text="Simulacros Ilimitados" included={false} />
                        <FeatureItem text="Predicción de Puntaje IA" included={false} />
                        <FeatureItem text="Certificado de Excelencia" included={false} />
                    </ul>
                    <Link href="/register">
                        <Button variant="outline" className="w-full h-12 border-[var(--theme-border-soft)] hover:bg-[var(--theme-bg-base)] uppercase tracking-wider font-bold text-xs">
                            Crear Cuenta Gratis
                        </Button>
                    </Link>
                </Card>

                {/* PRO Plan */}
                <Card variant="primary" className="p-10 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_50px_rgba(212,175,55,0.15)] ring-1 ring-brand-primary/50">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="bg-brand-primary text-[var(--theme-bg-base)] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                            Recomendado
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-[var(--theme-bg-base)] mb-6 shadow-lg shadow-brand-primary/20">
                            <Crown size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] uppercase tracking-tight mb-2">
                            {isTeacher ? "Licencia Docente" : "Plan Élite Pro"}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[var(--theme-text-primary)] to-brand-primary">
                                {new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
                                    style: 'currency',
                                    currency: currency,
                                    maximumFractionDigits: 0
                                }).format(isTeacher ? pricing.teacher : pricing.student)}
                            </span>
                            <span className="text-brand-primary text-sm uppercase font-bold">/ {isTeacher ? 'Mes' : 'Único'}</span>
                        </div>
                        <p className="text-[var(--theme-text-primary)]/80 text-sm mt-4 font-medium leading-relaxed">
                            {isTeacher ? "Para docentes que gestionan el progreso de sus grupos." : "Entrenamiento completo sin restricciones."}
                        </p>
                    </div>

                    <ul className="space-y-4 mb-10 flex-grow">
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
                        className="w-full h-14 text-sm font-semibold uppercase tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:scale-105 transition-all"
                        onClick={handleUpgrade}
                        icon={Zap}
                    >
                        {user ? "Activar Plan Ahora" : "Comenzar Ahora"}
                    </Button>
                </Card>
            </div>

            <div className="mt-16 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <Shield size={14} className="text-brand-primary" />
                <span className="text-[10px] uppercase font-bold text-[var(--theme-text-secondary)] tracking-wider">Pagos procesados de forma segura con Wompi</span>
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
