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
    <li className={`flex items-center gap-3 ${included ? 'text-white' : 'text-metal-silver/30'}`}>
        {included ? (
            <div className="w-5 h-5 rounded-full bg-metal-gold/20 flex items-center justify-center text-metal-gold">
                <Check size={12} strokeWidth={3} />
            </div>
        ) : (
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-metal-silver/30">
                <X size={12} strokeWidth={3} />
            </div>
        )}
        <span className={`text-sm font-medium ${included ? '' : 'line-through decoration-metal-silver/30'}`}>{text}</span>
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
            await upgradeUserSubscription(user.uid, 'pro', txId, amount, riskContext);
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
        <div className="min-h-screen bg-metal-dark flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-metal-gold/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="absolute left-0 -top-20 text-metal-silver/40 hover:text-white uppercase tracking-widest text-[10px] hidden md:flex">
                        <ArrowRight className="rotate-180 mr-2" size={14} /> Volver
                    </Button>
                </Link>

                <Badge variant="premium" className="mx-auto px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    Inversión Inteligente
                </Badge>

                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                    Planes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Acceso</span>
                </h1>

                <p className="text-xl text-metal-silver/60 max-w-2xl mx-auto font-light">
                    Elige la herramienta adecuada para maximizar tu potencial. Sin contratos ocultos.
                </p>

                {/* Switch */}
                <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
                    <button
                        onClick={() => setViewMode('student')}
                        className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${!isTeacher ? 'bg-metal-gold text-black shadow-lg shadow-metal-gold/20' : 'text-metal-silver hover:text-white'}`}
                    >
                        Estudiantes
                    </button>
                    <button
                        onClick={() => setViewMode('teacher')}
                        className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${isTeacher ? 'bg-metal-blue text-white shadow-lg shadow-metal-blue/20' : 'text-metal-silver hover:text-white'}`}
                    >
                        Docentes
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
                {/* Free / Basic Plan */}
                <Card variant="glass" className="p-10 flex flex-col border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-metal-silver mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Acceso Básico</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-metal-silver text-sm uppercase font-bold">/ Siempre</span>
                        </div>
                        <p className="text-metal-silver/60 text-sm mt-4 font-medium leading-relaxed">
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
                        <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 uppercase tracking-widest font-bold text-xs">
                            Crear Cuenta Gratis
                        </Button>
                    </Link>
                </Card>

                {/* PRO Plan */}
                <Card variant="premium" className="p-10 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_50px_rgba(212,175,55,0.15)] ring-1 ring-metal-gold/50">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="bg-gradient-to-r from-metal-gold to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                            Recomendado
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-metal-gold to-yellow-600 flex items-center justify-center text-black mb-6 shadow-lg shadow-metal-gold/20">
                            <Crown size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                            {isTeacher ? "Licencia Docente" : "Plan Élite Pro"}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-metal-gold">
                                ${new Intl.NumberFormat('es-CO').format(isTeacher ? pricing.teacher : pricing.student)}
                            </span>
                            <span className="text-metal-gold text-sm uppercase font-bold">/ {isTeacher ? 'Mes' : 'Único'}</span>
                        </div>
                        <p className="text-white/80 text-sm mt-4 font-medium leading-relaxed">
                            {isTeacher ? "Gestiona múltiples grupos, asigna tareas y monitorea el progreso en tiempo real." : "Desbloquea todo el potencial de la IA y asegura tu ingreso a la universidad."}
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
                        variant="premium"
                        className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:scale-105 transition-all"
                        onClick={handleUpgrade}
                        icon={Zap}
                    >
                        {user ? "Activar Plan Ahora" : "Comenzar Ahora"}
                    </Button>
                </Card>
            </div>

            <div className="mt-16 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <Shield size={14} className="text-metal-gold" />
                <span className="text-[10px] uppercase font-bold text-metal-silver tracking-widest">Pagos procesados de forma segura con Wompi</span>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentGateway
                    planName={isTeacher ? "Licencia Docente" : "Plan Elite Pro"}
                    price={isTeacher ? pricing.teacher : pricing.student}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
}
