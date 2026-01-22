"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import QuestionCard from "./QuestionCard";
import { ArrowRight, ArrowLeft, Trophy, Timer, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion, increment, doc } from "firebase/firestore";
import { adaptiveEngine } from "@/utils/adaptiveEngine";
import GlobalExitModal from "@/components/auth/GlobalExitModal";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface QuizEngineProps {
    questions: Question[];
    moduleName: string;
    nextModule?: string;
    timeLimit?: number; // In seconds
    sessionId?: string;
    assignmentId?: string;
    studyMode?: boolean; // 2026: Immediate feedback mode
}

export default function QuizEngine({ questions, moduleName, nextModule, timeLimit, sessionId, assignmentId, studyMode = false }: QuizEngineProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer logic: Use provided limit or default to 2 mins per question
    const [timeLeft, setTimeLeft] = useState(timeLimit || questions.length * 120);

    const router = useRouter();
    const { user, profile, subscription, registerActivity } = useAuth();
    // Register activity on mount
    useEffect(() => {
        registerActivity({ id: sessionId || 'temp', type: 'simulation' });
        return () => registerActivity(null);
    }, [sessionId]);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    // --- RESTORED HELPER FUNCTIONS ---
    useEffect(() => {
        if (finished || isSubmitting) return;

        if (timeLeft <= 0) {
            calculateScoreAndSave();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, finished]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSelectOption = (optionId: string) => {
        if (finished || (studyMode && showFeedback)) return;

        const correct = optionId === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id!]: optionId
        }));

        if (studyMode) {
            setShowFeedback(true);
        }
    };

    const calculateScoreAndSave = async (isPartial = false) => {
        if (isSubmitting || finished) return;
        setIsSubmitting(true);

        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id!] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);

        // Trigger animation before showing results
        setShowSuccess(true);

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowSuccess(false);

        if (user) {
            try {
                // 1. Save standard result
                await addDoc(collection(db, "results"), {
                    userId: user.uid,
                    module: moduleName,
                    score: correctCount,
                    totalQuestions: questions.length,
                    completedAt: serverTimestamp(),
                    isPartial: isPartial,
                    sessionId: sessionId || null,
                    assignmentId: assignmentId || null
                });

                // 2. Update Classroom Stats (if student is in any class)
                const qClasses = query(
                    collection(db, "class_members"),
                    where("userId", "==", user.uid)
                );
                const classSnap = await getDocs(qClasses);

                if (!classSnap.empty) {
                    const updates = classSnap.docs.map(doc => {
                        const updateData: any = {
                            lastScore: correctCount,
                            lastTotalQuestions: questions.length,
                            lastModule: moduleName,
                            lastActivity: serverTimestamp(),
                        };

                        // If this was a specific assignment, mark it as completed
                        if (assignmentId) {
                            updateData.completedAssignments = arrayUnion(assignmentId);
                        }

                        return updateDoc(doc.ref, updateData);
                    });
                    await Promise.all(updates);
                }

                // 3. Update User Gamification (XP & Badges)
                const scorePercentage = (correctCount / questions.length) * 100;
                const earnedXP = adaptiveEngine.calculateXP(scorePercentage, isPartial ? 0 : timeLeft);
                const newBadges = adaptiveEngine.checkNewAchievements(profile, correctCount, questions.length, timeLeft);

                const userRef = doc(db, "users", user.uid);
                const userUpdates: any = {
                    "gamification.xp": increment(earnedXP),
                    "gamification.streak.lastActiveDate": new Date().toISOString().split('T')[0],
                };

                if (newBadges.length > 0) {
                    userUpdates["gamification.badges"] = arrayUnion(...newBadges);
                    // Notify for each new badge
                    newBadges.forEach(badge => {
                        const badgeNames: any = {
                            'first_step': '¡Primer Paso Completado! 🎓',
                            'perfect_score': '¡Puntaje Perfecto! ✨',
                            'speed_demon': '¡Demonio de la Velocidad! ⚡'
                        };
                        toast.success("¡Logro Desbloqueado!", {
                            description: badgeNames[badge] || "Nueva insignia obtenida",
                            duration: 5000,
                        });
                    });
                }

                await updateDoc(userRef, userUpdates);

                // Notification of XP gained
                toast.success(`+${earnedXP} XP Ganados`, {
                    description: isPartial ? "Progreso parcial guardado." : "¡Excelente entrenamiento!",
                });

                // Everything saved successfully
                setFinished(true);

            } catch (error: any) {
                console.error("Error saving result:", error);
                console.error("Error saving result:", error);
                toast.error("Error de Guardado", {
                    description: "No se guardó el resultado. Por favor, toma una captura de este error.",
                });
                // We still show the result screen so they don't lose the score visibility
                setFinished(true);
            }
        } else {
            setFinished(true);
        }
    };

    const [showExitModal, setShowExitModal] = useState(false);

    const handleExitConfirm = async () => {
        setShowExitModal(false);
        await calculateScoreAndSave(true);
        router.push('/dashboard');
    };

    // Browser Guard (Refresh/Close Tab)
    useEffect(() => {
        if (finished) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ""; // Legacy for some browsers
            return "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [finished]);

    const [showReview, setShowReview] = useState(false);

    const handleNext = () => {
        if (studyMode && !showFeedback && currentQuestion.isPromptOnly) {
            setShowFeedback(true);
            setIsCorrect(true); // Always "correct" for prompts as they are self-eval
            return;
        }

        if (studyMode) setShowFeedback(false);

        if (isLastQuestion) {
            setShowReview(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // 2026 Tip Logic - Refined Expert Evaluator Persona
    const getTip = (correct: boolean, module: string) => {
        const personas: Record<string, string> = {
            lectura_critica: "Analista Literario",
            razonamiento_cuantitativo: "Auditor Financiero",
            competencias_ciudadanas: "Consultor Constitucional",
            ingles: "Linguista B2+",
            comunicacion_escrita: "Redactor Jefe"
        };
        const persona = personas[module] || "Evaluador Experto";

        if (correct) {
            return `✔ ${persona}: Respuesta acertada. Has identificado la premisa central bajo la matriz 2026. Excelente razonamiento.`;
        }

        const tips: Record<string, string> = {
            lectura_critica: "Tip 2026: No confundas la opinión del autor con los hechos narrados; busca siempre el sesgo implícito.",
            razonamiento_cuantitativo: "Tip 2026: En problemas financieros, recuerda que el interés compuesto siempre crece más rápido que el simple.",
            competencias_ciudadanas: "Tip 2026: En conflictos de derechos, busca la solución que aplique el principio de proporcionalidad.",
            ingles: "Tip 2026: Focus on the tone of the passage (positive/negative) to infer the author's intent.",
            comunicacion_escrita: "Tip 2026: Un buen argumento debe ser coherente, suficiente y relevante para la postura defendida."
        };

        return `⚠ ${persona}: ${tips[module] || "Este error es común. Relee el enunciado buscando palabras clave de exclusión."}`;
    };

    // ---------------------------------

    if (showReview && !finished) {
        // Calculate status
        const answeredCount = Object.keys(answers).length;
        const unansweredCount = questions.length - answeredCount;

        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <Card variant="glass" className="w-full max-w-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Resumen del Módulo</h2>
                    <p className="text-metal-silver/60 text-center mb-8">Revisa tus respuestas antes de finalizar.</p>

                    <div className="flex gap-4 justify-around mb-8 p-4 bg-black/20 rounded-xl">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-white">{answeredCount}</span>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-metal-silver/60">Contestadas</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-metal-gold">{unansweredCount}</span>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-metal-silver/60">Sin Responder</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-8 max-h-[300px] overflow-y-auto p-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setShowReview(false);
                                }}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${answers[q.id!]
                                    ? 'bg-metal-blue/20 border-metal-blue text-metal-blue hover:bg-metal-blue/40'
                                    : 'bg-transparent border-metal-silver/20 text-metal-silver/40 hover:border-metal-gold hover:text-metal-gold'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => calculateScoreAndSave()}
                            variant="premium"
                            className="w-full h-14 text-lg"
                            isLoading={isSubmitting}
                            icon={Trophy}
                        >
                            {isSubmitting ? "FINALIZANDO..." : "CONFIRMAR Y FINALIZAR"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setShowReview(false)}
                            className="w-full text-metal-silver hover:text-white"
                        >
                            Volver a Revisar
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (finished) {
        if (subscription?.plan !== 'pro') {
            // DIAGNOSTIC UPSELL SCREEN (FREE TIER)
            const percentage = (score / questions.length) * 100;
            const projectedScoreMin = Math.round((percentage * 3) * 0.9); // Rough calc for Saber Pro (0-300 scale)

            // Dynamic Feedback based on score
            const isLowScore = percentage < 40;
            const isMidScore = percentage >= 40 && percentage < 80;

            let feedbackTitle = "Potencial Detectado";
            let feedbackColor = "text-white";
            let feedbackMessage = "Tu resultado sugiere que tienes buen conocimiento base, pero necesitas enfrentarte al <strong>examen completo de 50 preguntas</strong> para confirmar tu puntaje real.";

            if (isLowScore) {
                feedbackTitle = "Oportunidad de Mejora";
                feedbackColor = "text-red-400";
                feedbackMessage = "Hemos detectado brechas importantes en este tema. El <strong>examen completo de 50 preguntas</strong> es crucial para identificar exactamente dónde enfocar tu estudio.";
            } else if (isMidScore) {
                feedbackTitle = "Buen Potencial Base";
                feedbackColor = "text-yellow-400";
                feedbackMessage = "Tienes una base sólida, pero estos resultados preliminares sugieren que necesitas más consistencia. Realiza el <strong>examen completo</strong> para validar tu verdadero nivel.";
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500 p-4">
                    <Card variant="premium" glow className="p-12 max-w-lg w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-gradient-to-br from-black/80 to-metal-dark/90 backdrop-blur-md relative overflow-hidden">
                        <Badge variant="premium" className="mb-6 h-8 px-4 font-black">
                            DIAGNÓSTICO FINALIZADO
                        </Badge>

                        <h2 className={`text-3xl font-black mb-2 uppercase tracking-tight ${feedbackColor}`}>{feedbackTitle}</h2>
                        <p className="text-metal-silver mb-8 text-lg">
                            Has completado el diagnóstico gratuito de <span className="text-white font-bold">{questions.length} preguntas</span>.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-metal-dark/50 p-4 rounded-xl border border-metal-silver/10">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-metal-silver/60 mb-1">Aciertos</span>
                                <span className={`text-3xl font-black ${isLowScore ? 'text-red-400' : isMidScore ? 'text-white' : 'text-green-400'}`}>{score}/{questions.length}</span>
                            </div>
                            <div className="bg-metal-gold/20 p-4 rounded-xl border border-metal-gold/40 relative overflow-hidden">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-metal-gold mb-1">Proyección Global</span>
                                <span className="text-3xl font-black text-metal-gold">{projectedScoreMin} - 300</span>
                            </div>
                        </div>

                        <p className="text-sm text-metal-silver/80 mb-8 italic border-l-2 border-metal-gold/50 pl-4 text-left leading-relaxed" dangerouslySetInnerHTML={{ __html: `"${feedbackMessage}"` }}>
                        </p>

                        <Button
                            onClick={() => router.push('/pricing')}
                            className="w-full h-14 text-lg mb-4"
                            icon={Trophy}
                        >
                            DESBLOQUEAR EXAMEN REAL
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard')}
                            className="w-full text-metal-silver hover:text-white"
                        >
                            Volver al Dashboard
                        </Button>
                    </Card>
                </div>
            );
        }

        // PRO TIER RESULT SCREEN (STANDARD)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
                <Card variant="glass" className="p-12 max-w-md w-full">
                    <Trophy className="w-24 h-24 text-metal-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    <h2 className="text-3xl font-bold mb-2">Simulacro Finalizado</h2>
                    <Badge variant="premium" className="mb-8">{moduleName?.replace(/_/g, ' ') || 'Simulacro General'}</Badge>

                    {timeLeft === 0 && (
                        <div className="mb-6">
                            <Badge variant="error" className="h-8 px-4">
                                <AlertTriangle size={14} className="mr-2" /> ¡Tiempo Agotado!
                            </Badge>
                        </div>
                    )}

                    <div className="bg-metal-dark/50 rounded-2xl p-6 mb-8 border border-metal-silver/10">
                        <span className="block text-xs font-black uppercase tracking-widest text-metal-silver/60 mb-1">Tu Puntaje</span>
                        <span className="text-6xl font-black text-white">
                            {score}/{questions.length}
                        </span>
                    </div>

                    {nextModule ? (
                        <>
                            <Button
                                onClick={() => router.push(`/simulation/${nextModule}`)}
                                className="w-full h-14 mb-4"
                                icon={ArrowRight}
                                iconPosition="right"
                            >
                                Siguiente Módulo
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => setShowExitModal(true)}
                                className="text-metal-silver hover:text-red-400"
                            >
                                Terminar Aquí (Guardar Parcial)
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full h-14"
                        >
                            Volver al Dashboard
                        </Button>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <div className="flex items-center gap-2 text-metal-silver/80">
                    <span className="font-mono text-xl font-bold text-metal-gold">{currentIndex + 1}</span>
                    <span className="text-sm">/ {questions.length}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-mono text-sm font-bold shadow-lg transition-colors ${timeLeft < 60 ? 'text-red-500 border-red-500/50 bg-red-500/10 animate-pulse' : 'text-metal-blue border-metal-blue/20 bg-metal-blue/10'
                    }`}>
                    <Timer size={16} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-metal-dark mb-8 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-metal-gold to-metal-copper transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
            </div>

            <QuestionCard
                key={currentQuestion.id} // Ensure fresh mount for animation/state
                question={currentQuestion}
                selectedOptionId={answers[currentQuestion.id!] || null}
                onSelectOption={handleSelectOption}
                showResult={studyMode && showFeedback}
            />

            {/* Immediate Feedback (Micro-Victoria) 2026 */}
            <AnimatePresence>
                {studyMode && showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-8 glass-elite rounded-xl p-8 transition-all duration-500"
                    >
                        <div className="flex items-start gap-6">
                            <div className={`p-2 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                <Brain size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {getTip(isCorrect, currentQuestion.module)}
                                </h4>
                                <p className="text-base text-metal-silver mb-6 leading-loose font-medium">
                                    {currentQuestion.explanation}
                                </p>
                                <Button
                                    onClick={handleNext}
                                    variant="premium"
                                    className="w-full text-xs font-black uppercase tracking-widest h-10"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    {isLastQuestion ? 'Ver Diagnóstico Final' : 'Siguiente Pregunta'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 gap-4">
                <Button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    variant="ghost"
                    className="h-14 px-8 text-lg touch-target-large touch-manipulation"
                    icon={ArrowLeft}
                >
                    Anterior
                </Button>

                <Button
                    onClick={handleNext}
                    variant="premium"
                    className="h-14 px-12 text-lg touch-target-large touch-manipulation"
                    icon={ArrowRight}
                    iconPosition="right"
                >
                    {studyMode && !showFeedback && currentQuestion.isPromptOnly ? "Confirmar Argumentos" : (isLastQuestion ? "Finalizar Examen" : "Siguiente Pregunta")}
                </Button>
            </div>
            <SuccessAnimation isVisible={showSuccess} message="¡Módulo Completado!" />

            <GlobalExitModal
                isOpen={showExitModal}
                type="navigation"
                isActiveActivity={true}
                onCancel={() => setShowExitModal(false)}
                onConfirm={handleExitConfirm}
            />
        </div >
    );
}


