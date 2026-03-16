"use client";

import { useState, useEffect, use } from "react";
import { Question } from "@/types/question";
import QuestionCard from "@/components/simulation/QuestionCard";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { ArrowRight, Sparkles, CheckCircle, XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";

interface TrainingPageProps {
    params: Promise<{
        module: string;
    }>;
}

export default function TrainingModulePage({ params }: TrainingPageProps) {
    const { module: moduleNameParam } = use(params);
    // Normalize module name: replace dashes with underscores to match DB if needed
    // Assuming DB uses "lectura_critica" format
    const moduleName = moduleNameParam;



    const { user, subscription, role } = useAuth();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];

    // Fetch user profile for AI context
    useEffect(() => {
        async function fetchProfile() {
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) setUserProfile(docSnap.data());
            }
        }
        fetchProfile();
    }, [user]);

    // Fetch Questions Effect
    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            try {
                // Determine limit based on subscription
                const questionsLimit = subscription?.plan === 'pro' ? 20 : 5;

                const q = query(
                    collection(db, "questions"),
                    where("module", "==", moduleName)
                    // limit removed to fetch full pool for randomness
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));


                // --- DATABASE EMPTY HANDLING ---
                if (data.length === 0) {
                    setQuestions([]);
                    setLoading(false);
                    return;
                }
                // -----------------------------------------

                // Shuffle existing data
                data.sort(() => Math.random() - 0.5);

                // Set questions with limit applied AFTER shuffle
                setQuestions(data.slice(0, questionsLimit));

            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        } if (moduleName) {
            fetchQuestions();
        }
    }, [moduleName, subscription]);

    // Correct handleSelectOption to update score
    const handleSelectOption = (optionId: string) => {
        if (feedback) return; // Prevent changing after answer
        setSelectedOption(optionId);

        if (optionId === currentQuestion.correctAnswer) {
            setFeedback("correct");
            setScore(prev => prev + 1); // Increment score
        } else {
            setFeedback("incorrect");
        }
    };

    const [showUpsell, setShowUpsell] = useState(false);

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of session logic
            if (subscription?.plan === 'pro') {
                router.push("/training");
            } else {
                // Free Tier: Show Upsell Hook
                setShowUpsell(true);
            }
        }
    };

    if (showUpsell) {
        const accuracy = Math.round((score / questions.length) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--theme-bg-overlay)] backdrop-blur-sm animate-in fade-in duration-500">
                <div className="metallic-card max-w-lg w-full p-8 rounded-2xl border border-[var(--theme-border-medium)] bg-[var(--theme-bg-surface)] shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-metal-gold via-yellow-200 to-metal-gold animate-shimmer"></div>

                    <div className="w-20 h-20 bg-metal-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-metal-gold animate-in zoom-in spin-in-180 duration-700">
                        <CheckCircle size={40} />
                    </div>

                    <h2 className="text-3xl font-bold text-[var(--theme-text-primary)] mb-2">¡Racha Diaria Completada!</h2>
                    <p className="text-[var(--theme-text-secondary)] mb-8 text-lg">
                        Has completado tus <span className="text-metal-gold font-bold">{questions.length} preguntas</span> de hoy.
                        Tu constancia es clave para el éxito.
                    </p>

                    <div className="bg-[var(--theme-bg-base)] p-6 rounded-xl border border-[var(--theme-border-soft)] mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-[var(--theme-text-secondary)]">Tu Precisión</span>
                            <span className="text-xl font-bold text-green-400">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-[var(--theme-bg-surface)] h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
                        </div>
                        <p className="mt-4 text-xs text-[var(--theme-text-tertiary)] italic">
                            &quot;Los usuarios Pro practican 3x más preguntas y obtienen puntajes 40% más altos.&quot;
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full metallic-btn bg-[var(--theme-btn-primary)] text-[var(--theme-btn-primary-text)] font-bold py-4 rounded-xl mb-4 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                        <Sparkles size={20} /> DESBLOQUEAR PRÁCTICA ILIMITADA
                    </button>

                    <button
                        onClick={() => router.push('/training')}
                        className="text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] text-sm underline decoration-[var(--theme-border-soft)] hover:decoration-[var(--theme-text-primary)] underline-offset-4"
                    >
                        Volver al menú (Esperar a mañana)
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] flex items-center justify-center">No hay preguntas disponibles para este módulo aún.</div>;

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* ... (Existing Render) ... */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/training" className="text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] flex items-center gap-2">
                        <ArrowLeft size={20} /> Salir
                    </Link>
                    <div className="text-metal-gold font-bold">
                        Pregunta {currentIndex + 1} / {questions.length}
                    </div>
                </div>

                <QuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    selectedOptionId={selectedOption}
                    onSelectOption={handleSelectOption}
                    showResult={!!feedback}
                />

                {feedback && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className={cn(
                            "p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden",
                            feedback === 'correct'
                                ? "bg-green-500/10 border-green-500/20 shadow-green-500/10"
                                : "bg-red-500/10 border-red-500/20 shadow-red-500/10"
                        )}>
                            {/* Ambient Light */}
                            <div className={cn(
                                "absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20",
                                feedback === 'correct' ? "bg-green-400" : "bg-red-400"
                            )} />

                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-700 animate-in zoom-in",
                                feedback === 'correct' ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            )}>
                                {feedback === 'correct' ? <CheckCircle size={32} strokeWidth={2.5} /> : <XCircle size={32} strokeWidth={2.5} />}
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h3 className={cn(
                                    "text-3xl font-black mb-2 tracking-tightest uppercase italic",
                                    feedback === 'correct' ? "text-green-500" : "text-red-500"
                                )}>
                                    {feedback === 'correct' ? '¡MAESTRÍA DEMOSTRADA!' : 'PUNTO DE APRENDIZAJE'}
                                </h3>
                                <p className="text-[11px] font-black text-[var(--theme-text-primary)] opacity-80 tracking-[0.2em] uppercase mb-6">
                                    {feedback === 'correct' ? 'Has analizado correctamente los parámetros del problema.' : 'La excelencia nace de la persistencia. Revisa la explicación IA.'}
                                </p>
                            </div>

                            <button
                                onClick={handleNext}
                                className="metallic-btn bg-white dark:bg-slate-900 px-12 h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:shadow-brand-primary/20 transition-all hover:-translate-y-1 flex items-center gap-3 border border-slate-200 dark:border-slate-800"
                            >
                                {currentIndex === questions.length - 1 ? "FINALIZAR" : "SIGUIENTE"} <ArrowRight size={20} strokeWidth={3} className="animate-pulse text-brand-primary" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
