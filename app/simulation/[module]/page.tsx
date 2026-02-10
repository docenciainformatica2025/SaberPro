"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { Question } from "@/types/question";
import QuizEngine from "@/components/simulation/QuizEngine";
import ModuleIntro from "@/components/simulation/ModuleIntro";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertCircle } from "lucide-react";

const SimulationContent = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get('assignmentId');
    const { user, loading: authLoading, subscription, role } = useAuth();

    // Check if we are in "Full Simulation" mode
    // If so, we might need special handling, but currently logic seems to rely on 'nextModule' prop in QuizEngine
    // Note: The original code had some commented out logic about full simulation, but let's stick to the core logic.

    const moduleName = params.module as string;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Retrieve or create session ID
        const storedSession = sessionStorage.getItem('currentSessionId');
        if (storedSession) {
            setSessionId(storedSession);
        } else {
            setSessionId(crypto.randomUUID());
        }
    }, []);

    // Configuration for "Realistic" distribution (Total: 100 questions, 240 mins)
    const MODULE_CONFIG: Record<string, { questions: number; time: number }> = {
        "ingles": { questions: 30, time: 4320 }, // 72 mins (Heaviest weight)
        "lectura_critica": { questions: 20, time: 2880 }, // 48 mins
        "razonamiento_cuantitativo": { questions: 20, time: 2880 }, // 48 mins
        "competencias_ciudadanas": { questions: 20, time: 2880 }, // 48 mins
        "comunicacion_escrita": { questions: 10, time: 1440 }, // 24 mins (Lightest weight)
    };

    const currentConfig = MODULE_CONFIG[moduleName] || { questions: 20, time: 2880 };

    // Determine Next Module for Full Simulation Flow
    const MODULE_ORDER = [
        "razonamiento_cuantitativo",
        "lectura_critica",
        "competencias_ciudadanas",
        "ingles",
        "comunicacion_escrita"
    ];

    const currentModuleIndex = MODULE_ORDER.indexOf(moduleName);
    const nextModuleId = currentModuleIndex !== -1 && currentModuleIndex < MODULE_ORDER.length - 1
        ? MODULE_ORDER[currentModuleIndex + 1]
        : undefined;

    useEffect(() => {
        async function fetchData() {
            if (authLoading) return;
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                // 1. Check Session Cache first
                const cacheKey = `cache_questions_${moduleName}_${subscription?.plan || 'free'}`;
                const cached = sessionStorage.getItem(cacheKey);

                if (cached && !assignmentId) {
                    const parsed = JSON.parse(cached);
                    setQuestions(parsed);
                    setLoading(false);
                    // Still trigger prefetch for next module
                    prefetchNextModule();
                    return;
                }

                // 2. Verify Profile (Career) - OPTIMIZATION: Skipped to avoid waterfall. 
                // Profile is already verified in selection screen.
                // const docSnap = await getDoc(doc(db, "users", user.uid));

                // 3. Fetch Questions
                let loadedQuestions: Question[] = [];
                if (assignmentId) {
                    const assignSnap = await getDoc(doc(db, "assignments", assignmentId));
                    if (assignSnap.exists()) {
                        const assignData = assignSnap.data();
                        if (assignData.questions && Array.isArray(assignData.questions)) {
                            loadedQuestions = assignData.questions;
                        }
                    }
                } else {
                    const limitCount = subscription?.plan === 'pro' ? 50 : 10;
                    const q = query(collection(db, "questions"), where("module", "==", moduleName));
                    const querySnapshot = await getDocs(q);

                    querySnapshot.forEach((doc) => {
                        loadedQuestions.push({ id: doc.id, ...doc.data() } as Question);
                    });

                    // Fisher-Yates Shuffle (Randomness Perfection)
                    for (let i = loadedQuestions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [loadedQuestions[i], loadedQuestions[j]] = [loadedQuestions[j], loadedQuestions[i]];
                    }
                    loadedQuestions = loadedQuestions.slice(0, limitCount);
                }

                if (loadedQuestions.length === 0) {
                    setError("No hay preguntas disponibles para este módulo aún.");
                } else {
                    setQuestions(loadedQuestions);
                    if (!assignmentId) {
                        sessionStorage.setItem(cacheKey, JSON.stringify(loadedQuestions));
                    }
                    prefetchNextModule();
                }
            } catch (err) {
                console.error(err);
                setError("Error cargando el simulacro.");
            } finally {
                setLoading(false);
            }
        }

        async function prefetchNextModule() {
            if (!nextModuleId || assignmentId) return;

            const nextCacheKey = `cache_questions_${nextModuleId}_${subscription?.plan || 'free'}`;
            if (sessionStorage.getItem(nextCacheKey)) return;

            try {
                const limitCount = subscription?.plan === 'pro' ? 50 : 10;
                const q = query(
                    collection(db, "questions"),
                    where("module", "==", nextModuleId),
                    limit(limitCount)
                );
                const querySnapshot = await getDocs(q);
                const prefetched: Question[] = [];
                querySnapshot.forEach((doc) => {
                    prefetched.push({ id: doc.id, ...doc.data() } as Question);
                });

                if (prefetched.length > 0) {
                    sessionStorage.setItem(nextCacheKey, JSON.stringify(prefetched));
                }
            } catch (e) {
                console.warn("Prefetch failed:", e);
            }
        }

        if (moduleName) {
            fetchData();
        }
    }, [moduleName, user, authLoading, router, currentConfig.questions, assignmentId, subscription, nextModuleId]);

    const [hasStarted, setHasStarted] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-metal-dark">
                <AIProcessingLoader text="Cargando Simulacro" subtext="Preparando entorno de examen real..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-metal-dark">
                <Card variant="solid" className="p-10 max-w-md border-red-500/30 bg-red-500/5 backdrop-blur-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-red-400 font-bold text-2xl mb-4 uppercase tracking-tight">Error de Carga</h2>
                    <p className="text-metal-silver mb-8 font-medium">{error}</p>
                    <Link href={role === 'teacher' ? "/teacher" : "/dashboard"} className="block w-full">
                        <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10" icon={ArrowLeft}>
                            {role === 'teacher' ? "Volver al Panel" : "Regresar al Inicio"}
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // Recalculate time based on actual number of questions loaded
    // Standard: 2 minutes (120 seconds) per question
    const timePerQuestion = 120;
    const finalTimeLimit = questions.length > 0 ? questions.length * timePerQuestion : currentConfig.time;

    if (!hasStarted) {
        return (
            <ModuleIntro
                moduleName={moduleName}
                questionCount={questions.length > 0 ? questions.length : currentConfig.questions}
                timeLimitSeconds={finalTimeLimit}
                onStart={() => setHasStarted(true)}
            />
        );
    }

    const isStudyMode = searchParams.get('mode') === 'study';

    return (
        <div className="min-h-screen py-6 md:py-12 bg-metal-dark text-white selection:bg-metal-gold/30">
            <QuizEngine
                questions={questions}
                moduleName={moduleName}
                nextModule={nextModuleId}
                timeLimit={finalTimeLimit}
                sessionId={sessionId}
                assignmentId={assignmentId as string}
                studyMode={isStudyMode}
            />
        </div>
    );
}

export default function SimulationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-metal-dark"><AIProcessingLoader text="Iniciando..." /></div>}>
            <SimulationContent />
        </Suspense>
    );
}
