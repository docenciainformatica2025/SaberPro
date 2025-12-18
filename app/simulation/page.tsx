"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, Brain, Sparkles, Zap, Timer, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { SubscriptionPlan } from "@/types/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

    const isPro = subscription?.plan === SubscriptionPlan.PRO || subscription?.plan === SubscriptionPlan.TEACHER_PRO || subscription?.plan === SubscriptionPlan.INSTITUTION;

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
                        // Only require targetCareer for students
                        if (!data.targetCareer && role !== 'teacher') {
                            const confirm = window.confirm("⚠️ Requisito Faltante\n\nPara generar un simulacro efectivo, necesitamos saber tu Carrera de Interés.\n\n¿Ir al perfil a configurarlo?");
                            if (confirm) router.push("/profile");
                            else router.push("/dashboard");
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
        <div className="min-h-screen flex items-center justify-center bg-metal-dark">
            <AIProcessingLoader text={loadingAssignment ? "Cargando Asignación..." : "Preparando Simulacro"} subtext={loadingAssignment ? "Obteniendo preguntas del docente..." : "Verificando perfil y calibrando dificultad..."} />
        </div>
    );

    const modules = [
        { id: "razonamiento_cuantitativo", label: "Razonamiento Cuantitativo", icon: Zap, desc: "Matemáticas y lógica aplicada" },
        { id: "lectura_critica", label: "Lectura Crítica", icon: Brain, desc: "Análisis de textos y argumentación" },
        { id: "competencias_ciudadanas", label: "Competencias Ciudadanas", icon: Sparkles, desc: "Constitución y sociedad" },
        { id: "ingles", label: "Inglés", icon: Brain, desc: "Vocabulario y gramática" },
        { id: "comunicacion_escrita", label: "Comunicación Escrita", icon: Brain, desc: "Redacción y ortografía" },
    ];

    return (
        <div className="min-h-screen bg-metal-dark p-6 md:p-12 pb-32">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                <Link href={role === 'teacher' ? "/teacher" : "/dashboard"}>
                    <Button variant="ghost" icon={ArrowLeft} className="mb-8 p-0 hover:bg-transparent text-metal-silver hover:text-white uppercase tracking-widest text-[10px] font-black">
                        {role === 'teacher' ? "Volver al Panel Docente" : "Volver al Dashboard"}
                    </Button>
                </Link>

                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-metal-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <Badge variant="premium" className="mb-6 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        Modo Examen Real
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 italic tracking-tighter uppercase">
                        Simulacro <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Saber Pro</span>
                    </h1>
                    <p className="text-metal-silver/60 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                        Mide tus conocimientos en condiciones reales. Sin pausas, sin ayudas de IA y con límite de tiempo por pregunta.
                    </p>
                </div>

                {/* Full Simulation Option */}
                <Card
                    variant="premium"
                    className="p-10 mb-20 flex flex-col md:flex-row items-center justify-between gap-10 cursor-pointer group relative overflow-hidden border-metal-gold/30 hover:border-metal-gold/60 hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] transition-all duration-500 bg-black/60 backdrop-blur-xl"
                    onClick={() => {
                        if (!isPro && simulationCount >= 3) {
                            if (confirm("🔒 Límite Gratuito Alcanzado\n\nHas completado tus 3 simulacros de prueba. Para continuar tu entrenamiento ilimitado y acceder a analíticas avanzadas, mejora tu plan.\n\n¿Ver Planes Pro?")) {
                                router.push('/pricing');
                            }
                            return;
                        }
                        const sessionId = crypto.randomUUID();
                        sessionStorage.setItem('currentSessionId', sessionId);
                        sessionStorage.setItem('isFullSimulation', 'true');
                        router.push("/simulation/razonamiento_cuantitativo");
                    }}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Timer size={300} className="text-metal-gold -rotate-12" />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <Badge variant="premium" className="mb-4 w-fit animate-pulse">
                            <Zap size={12} fill="currentColor" className="mr-2" /> RECOMENDADO
                        </Badge>
                        <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tight group-hover:text-metal-gold transition-colors">Simulacro Completo</h2>
                        <p className="text-metal-silver text-lg mb-6 leading-relaxed">
                            Enfréntate a la experiencia real. 5 módulos consecutivos, temporizador estricto y resultados consolidados al final.
                        </p>
                        <div className="flex items-center gap-8 text-sm font-bold text-metal-silver/60 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Clock size={16} className="text-metal-gold" /> 4h 48m</span>
                            <span className="flex items-center gap-2"><HelpCircle size={16} className="text-metal-gold" /> 100 Preguntas</span>
                        </div>
                    </div>

                    <Button variant="premium" className="h-16 px-10 text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transform group-hover:scale-105 transition-all">
                        Comenzar Ahora
                    </Button>
                </Card>

                <div className="flex items-center gap-6 mb-12">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <span className="text-metal-silver/30 text-[10px] uppercase tracking-[0.3em] font-black">ENTRENAMIENTO MODULAR</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <Card
                            key={module.id}
                            variant="glass"
                            onClick={() => {
                                if (!isPro && simulationCount >= 3) {
                                    if (confirm("🔒 Límite Gratuito Alcanzado\n\nMejora a Pro para desbloquear simulacros ilimitados.")) {
                                        router.push('/pricing');
                                    }
                                    return;
                                }
                                sessionStorage.removeItem('currentSessionId');
                                sessionStorage.removeItem('isFullSimulation');
                                router.push(`/simulation/${module.id}`);
                            }}
                            className="p-8 hover:border-metal-blue/50 transition-all hover:-translate-y-2 cursor-pointer group flex flex-col h-full justify-between bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-lg border-white/5"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                <module.icon size={120} className="text-metal-blue rotate-12" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:border-metal-blue/30 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
                                    <module.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-metal-blue transition-colors italic uppercase tracking-tight">
                                    {module.label}
                                </h3>
                                <p className="text-sm text-metal-silver/50 mb-8 flex-grow font-medium leading-relaxed">
                                    {module.desc}
                                </p>
                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-metal-blue/20 transition-colors">
                                    <span className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest group-hover:text-white transition-colors">Iniciar Módulo</span>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-metal-blue group-hover:text-black transition-all">
                                        <ArrowLeft className="rotate-180" size={14} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
