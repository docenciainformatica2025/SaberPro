"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, Brain, Sparkles, Zap, Timer, Clock, HelpCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { SubscriptionPlan } from "@/types/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SimulationSelectionPage() {
    return (
        <Suspense fallback={<AIProcessingLoader text="Cargando..." />}>
            <SimulationSelectionContent />
        </Suspense>
    );
}

function SimulationSelectionContent() {
    const { user, loading, role, subscription } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get('assignmentId');
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [loadingAssignment, setLoadingAssignment] = useState(!!assignmentId);
    const [simulationCount, setSimulationCount] = useState(0);
    const [step, setStep] = useState(1); // 1: Mode, 2: Module, 3: Pre-flight
    const [selectedModule, setSelectedModule] = useState<any>(null);
    const [isFullSim, setIsFullSim] = useState(false);

    const isPro = subscription?.plan === SubscriptionPlan.PRO || subscription?.plan === SubscriptionPlan.TEACHER_PRO || subscription?.plan === SubscriptionPlan.INSTITUTION;

    const modules = [
        { id: "razonamiento_cuantitativo", label: "Razonamiento Cuantitativo", icon: Zap, desc: "Matemáticas y lógica aplicada" },
        { id: "lectura_critica", label: "Lectura Crítica", icon: Brain, desc: "Análisis de textos y argumentación" },
        { id: "competencias_ciudadanas", label: "Competencias Ciudadanas", icon: Sparkles, desc: "Constitución y sociedad" },
        { id: "ingles", label: "Inglés", icon: Brain, desc: "Vocabulario y gramática" },
        { id: "comunicacion_escrita", label: "Comunicación Escrita", icon: Brain, desc: "Redacción y ortografía" },
    ];

    // Check Limits
    useEffect(() => {
        const checkLimits = async () => {
            if (user && !loading && !assignmentId && !isPro) {
                try {
                    const snap = await getDocs(query(collection(db, "results"), where("userId", "==", user.uid), limit(4)));
                    setSimulationCount(snap.size);
                } catch (e) {
                    console.error("Error checking limits", e);
                }
            }
        };
        checkLimits();
    }, [user, loading, assignmentId, isPro]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Handle Assignment Redirect
    useEffect(() => {
        const handleAssignment = async () => {
            if (user && assignmentId) {
                setLoadingAssignment(true);
                try {
                    const assignDoc = await getDoc(doc(db, "assignments", assignmentId));
                    if (assignDoc.exists()) {
                        const data = assignDoc.data();
                        router.push(`/simulation/${data.subject}?assignmentId=${assignmentId}`);
                    } else {
                        alert("El examen asignado no existe o ha sido eliminado.");
                        router.push('/dashboard');
                    }
                } catch (e) {
                    console.error(e);
                    alert("Error al cargar examen. Revisa tu conexión.");
                    setLoadingAssignment(false);
                }
            }
        };
        handleAssignment();
    }, [user, assignmentId, router]);

    // Fetch profile to ensure Personalization
    useEffect(() => {
        async function checkRequirements() {
            if (user) {
                try {
                    const docSnap = await getDoc(doc(db, "users", user.uid));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (!data.targetCareer && role !== 'teacher') {
                            toast.warning("Configuración Requerida", {
                                description: "Para calibrar el simulacro, necesitamos conocer tu Carrera de Interés.",
                                duration: 5000,
                            });
                            router.push("/profile");
                            return;
                        }
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setCheckingProfile(false);
                }
            } else if (!loading) {
                setCheckingProfile(false);
            }
        }
        checkRequirements();
    }, [user, loading, router]);

    if (loading || checkingProfile || loadingAssignment) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg-base)]">
            <AIProcessingLoader text={loadingAssignment ? "Cargando Asignación..." : "Preparando Simulacro"} subtext={loadingAssignment ? "Obteniendo preguntas del docente..." : "Verificando perfil y calibrando dificultad..."} />
        </div>
    );

    const handleStartSimulation = () => {
        if (!isPro && simulationCount >= 3) {
            toast.error("🔒 Límite Gratuito Alcanzado", {
                description: "Has completado tus simulacros de prueba. Mejora a Pro para continuar.",
                action: { label: "Ver Planes", onClick: () => router.push('/pricing') }
            });
            return;
        }

        if (isFullSim) {
            const sessionId = crypto.randomUUID();
            sessionStorage.setItem('currentSessionId', sessionId);
            sessionStorage.setItem('isFullSimulation', 'true');
            router.push("/simulation/razonamiento_cuantitativo");
        } else if (selectedModule) {
            sessionStorage.removeItem('currentSessionId');
            sessionStorage.removeItem('isFullSimulation');
            router.push(`/simulation/${selectedModule.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] p-6 md:p-12 pb-32">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => step > 1 ? setStep(step - 1) : router.push("/dashboard")} className="p-0 hover:bg-transparent text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] uppercase tracking-wider text-[10px] font-semibold">
                        {step > 1 ? "Regresar" : "Volver al Dashboard"}
                    </Button>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("h-1 w-8 rounded-full transition-all duration-300", step >= i ? "bg-brand-primary" : "bg-[var(--theme-border-soft)]")} />
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        <div className="text-center">
                            <Badge variant="primary" className="mb-4">Paso 1: Selecciona tu Objetivo</Badge>
                            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--theme-text-primary)] italic uppercase tracking-tight">
                                ¿Cómo quieres <span className="text-brand-primary">Entrenar</span> hoy?
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <Card
                                interactive
                                variant="primary"
                                className="p-10 cursor-pointer text-center space-y-6"
                                onClick={() => { setIsFullSim(true); setStep(3); }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-[var(--theme-bg-base)] flex items-center justify-center text-[var(--theme-text-primary)] group-hover:bg-brand-primary group-hover:text-[var(--theme-bg-base)] transition-all">
                                    <Timer size={20} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] uppercase italic">Simulacro Completo</h3>
                                    <p className="text-[var(--theme-text-secondary)]/60 text-sm mt-2">La experiencia real del examen Saber Pro (4h 48m, 100 preguntas).</p>
                                </div>
                                <Button variant="primary" className="w-full">Seleccionar</Button>
                            </Card>

                            <Card
                                interactive
                                variant="glass"
                                className="p-10 cursor-pointer text-center space-y-6"
                                onClick={() => { setIsFullSim(false); setStep(2); }}
                            >
                                <div className="w-20 h-20 bg-[var(--theme-bg-base)] rounded-3xl flex items-center justify-center mx-auto text-[var(--theme-text-primary)]">
                                    <Zap size={40} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] uppercase italic">Entrenamiento Modular</h3>
                                    <p className="text-[var(--theme-text-secondary)]/60 text-sm mt-2">Practica una competencia específica a tu propio ritmo.</p>
                                </div>
                                <Button variant="outline" className="w-full">Seleccionar</Button>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="text-center">
                            <Badge variant="info" className="mb-4">Paso 2: Competencia</Badge>
                            <h2 className="text-3xl md:text-5xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight">
                                Escoge un <span className="text-brand-primary">Módulo</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {modules.map((m) => (
                                <Card
                                    key={m.id}
                                    interactive
                                    variant={selectedModule?.id === m.id ? "premium" : "glass"}
                                    className={cn("p-8 cursor-pointer border-2 transition-all", selectedModule?.id === m.id ? "border-brand-primary shadow-gold" : "border-transparent")}
                                    onClick={() => setSelectedModule(m)}
                                >
                                    <m.icon size={32} className={cn("mb-4", selectedModule?.id === m.id ? "text-[var(--theme-text-primary)]" : "text-brand-primary")} />
                                    <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] uppercase italic">{m.label}</h3>
                                    <p className="text-xs text-[var(--theme-text-secondary)]/50 mt-2">{m.desc}</p>
                                    {selectedModule?.id === m.id && (
                                        <Button onClick={() => setStep(3)} className="mt-8 w-full" size="sm">Continuar</Button>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
                        <Card variant="primary" className="p-12 text-center space-y-8 relative overflow-hidden backdrop-blur-3xl">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldAlert size={200} />
                            </div>

                            <Badge variant="warning" className="animate-pulse">Protocolo de Examen Activo</Badge>
                            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight">
                                Listo para <span className="text-brand-primary">Despegar</span>?
                            </h2>

                            <div className="space-y-4 text-left bg-[var(--theme-bg-base)]/60 p-6 rounded-2xl border border-[var(--theme-border-soft)]">
                                <h4 className="text-[10px] font-semibold text-brand-primary uppercase tracking-[0.2em] mb-4">Reglas del Simulacro:</h4>
                                <ul className="space-y-3">
                                    {[
                                        "No se permite el uso de calculadoras ni IA.",
                                        "El temporizador no se detiene si cierras la pestaña.",
                                        "Debes completar todas las preguntas para recibir certificado.",
                                        isFullSim ? "Módulos automáticos de 50 preguntas cada uno." : "Foco exclusivo en el módulo seleccionado."
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[var(--theme-text-secondary)]">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <Button variant="ghost" onClick={() => setStep(isFullSim ? 1 : 2)} className="flex-1">Cambiar Configuración</Button>
                                <Button variant="primary" onClick={handleStartSimulation} className="flex-[2] h-16 shadow-gold">¡Comenzar Simulacro!</Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
