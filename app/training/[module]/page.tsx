"use client";

import { useState, useEffect, use } from "react";
import { Question } from "@/types/question";
import QuestionCard from "@/components/simulation/QuestionCard";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { ArrowRight, Sparkles, CheckCircle, XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
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


                // --- FALLBACK MOCK DATA IF DB IS EMPTY ---
                if (data.length === 0) {

                    const mockQ: Question[] = [
                        {
                            id: "mock_1",
                            text: "En un texto argumentativo, la tesis se define como:",
                            options: [
                                { id: "A", text: "La opinión central que el autor defiende." },
                                { id: "B", text: "El resumen final del texto." },
                                { id: "C", text: "La evidencia científica presentada." },
                                { id: "D", text: "La biografía del autor." }
                            ],
                            correctAnswer: "A",
                            module: moduleName as any,
                            difficulty: "media",
                            explanation: "La tesis es la columna vertebral de un argumento."
                        },
                        {
                            id: "mock_2",
                            text: "¿Cuál es el propósito de un conector de contraste?",
                            options: [
                                { id: "A", text: "Añadir información similar." },
                                { id: "B", text: "Introducir una oposición." },
                                { id: "C", text: "Concluir el párrafo." },
                                { id: "D", text: "Resaltar una cita." }
                            ],
                            correctAnswer: "B",
                            module: moduleName as any,
                            difficulty: "media",
                            explanation: "Conectores como 'pero' u 'obstante' indican oposición."
                        },
                        {
                            id: "mock_3",
                            text: "Si 5 máquinas hacen 5 artículos en 5 minutos, ¿100 máquinas cuántos minutos tardan en hacer 100 artículos?",
                            options: [
                                { id: "A", text: "100" },
                                { id: "B", text: "5" },
                                { id: "C", text: "20" },
                                { id: "D", text: "1" }
                            ],
                            correctAnswer: "B",
                            module: moduleName as any,
                            difficulty: "alta",
                            explanation: "Cada máquina es independiente y tarda 5 min por unidad."
                        }
                    ];
                    // Duplicate to fill up to limit if needed
                    while (data.length < questionsLimit) {
                        data.push({ ...mockQ[data.length % mockQ.length], id: `mock_${data.length}` });
                    }
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

    const [aiUsageCount, setAiUsageCount] = useState(0);

    const handleExplain = async () => {
        setLoadingExplanation(true);
        try {
            const res = await fetch("/api/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: currentQuestion,
                    selectedOption,
                    correctAnswer: currentQuestion.correctAnswer,
                    userProfile: userProfile
                })
            });
            const data = await res.json();
            setExplanation(data.explanation || "No pudimos generar una explicación en este momento.");
        } catch (error) {
            console.error(error);
            setExplanation("Error de conexión con la IA.");
        } finally {
            setLoadingExplanation(false);
        }
    };

    const [showUpsell, setShowUpsell] = useState(false);

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        setExplanation(null);
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
            <div className="min-h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
                <div className="metallic-card max-w-lg w-full p-8 rounded-2xl border-metal-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-metal-gold via-yellow-200 to-metal-gold animate-shimmer"></div>

                    <div className="w-20 h-20 bg-metal-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-metal-gold animate-in zoom-in spin-in-180 duration-700">
                        <CheckCircle size={40} />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">¡Racha Diaria Completada!</h2>
                    <p className="text-metal-silver mb-8 text-lg">
                        Has completado tus <span className="text-metal-gold font-bold">{questions.length} preguntas</span> de hoy.
                        Tu constancia es clave para el éxito.
                    </p>

                    <div className="bg-metal-dark/50 p-6 rounded-xl border border-metal-silver/10 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-metal-silver">Tu Precisión</span>
                            <span className="text-xl font-bold text-green-400">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-metal-dark h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
                        </div>
                        <p className="mt-4 text-xs text-metal-silver/60 italic">
                            &quot;Los usuarios Pro practican 3x más preguntas y obtienen puntajes 40% más altos.&quot;
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full metallic-btn bg-gradient-to-r from-metal-gold to-yellow-600 text-black font-bold py-4 rounded-xl mb-4 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                        <Sparkles size={20} /> DESBLOQUEAR PRÁCTICA ILIMITADA
                    </button>

                    <button
                        onClick={() => router.push('/training')}
                        className="text-metal-silver hover:text-white text-sm underline decoration-metal-silver/30 hover:decoration-white underline-offset-4"
                    >
                        Volver al menú (Esperar a mañana)
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div className="min-h-screen text-white flex items-center justify-center">No hay preguntas disponibles para este módulo aún.</div>;

    return (
        <div className="min-h-screen bg-metal-dark p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* ... (Existing Render) ... */}
                <div className="flex justify-between items-center mb-8">
                    <Link href={role === 'teacher' ? "/training" : "/training"} className="text-metal-silver hover:text-white flex items-center gap-2">
                        {/* Note: /training handles role-based back link internally, so link to /training is safeish, but let's be explicit if needed. 
                            Actually, /training goes to the selection page. That page has a back link. 
                            Wait, the user wants to go 'Back' from the Question Page. 
                            If they go to /training, that is the selection page. That seems correct for both students and teachers.
                            But wait, let's keep it consistent.
                        */}
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
                    aiUsageCount={aiUsageCount}
                    onAiUsed={() => setAiUsageCount(prev => prev + 1)}
                />

                {feedback && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* ... (Feedback UI) ... */}
                        <div className={`p-4 rounded-xl border ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} flex items-start gap-3`}>
                            {feedback === 'correct' ? (
                                <CheckCircle className="text-green-500 shrink-0 mt-1" />
                            ) : (
                                <XCircle className="text-red-500 shrink-0 mt-1" />
                            )}
                            <div>
                                <h3 className={`font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                    {feedback === 'correct' ? '¡Excelente! Respuesta Correcta' : 'Incorrecto'}
                                </h3>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleNext}
                                className="metallic-btn bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                            >
                                {currentIndex === questions.length - 1 ? "Finalizar Set" : "Siguiente"} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
