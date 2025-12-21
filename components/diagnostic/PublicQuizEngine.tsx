"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Brain, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Preguntas Micro-Diagnóstico (Hardcoded para velocidad)
const QUESTIONS = [
    {
        id: 1,
        category: "Razonamiento Cuantitativo",
        question: "Si el 30% de X es 45, ¿cuánto es el 50% de X?",
        options: ["60", "75", "90", "150"],
        correct: 1, // 75
        explanation: "Si 30% = 45, entonces 10% = 15. Por tanto 100% = 150. El 50% de 150 es 75."
    },
    {
        id: 2,
        category: "Lectura Crítica",
        question: "¿Cuál es la intención principal del autor en un texto argumentativo?",
        options: ["Narrar una historia", "Describir una escena", "Persuadir al lector", "Exponer datos"],
        correct: 2,
        explanation: "El propósito central de la argumentación es convencer o persuadir."
    },
    {
        id: 3,
        category: "Inglés (B1)",
        question: "Select the correct sentence:",
        options: ["She have two cats.", "She has two cats.", "She is having two cats.", "She had have two cats."],
        correct: 1,
        explanation: "Third person singular (She) uses 'has'."
    },
    {
        id: 4,
        category: "Competencias Ciudadanas",
        question: "¿Qué mecanismo protege los derechos fundamentales en Colombia?",
        options: ["Acción de Grupo", "Acción de Tutela", "Habeas Corpus", "Plebiscito"],
        correct: 1,
        explanation: "La Tutela es el mecanismo específico para la protección inmediata de derechos fundamentales."
    },
    {
        id: 5,
        category: "Pensamiento Lógico",
        question: "Completa la serie: 2, 4, 8, 16, ...",
        options: ["20", "24", "30", "32"],
        correct: 3,
        explanation: "Es una progresión geométrica multiplicada por 2. 16 * 2 = 32."
    }
];

export default function PublicQuizEngine() {
    const router = useRouter();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const currentQ = QUESTIONS[currentIdx];

    const handleSelect = (idx: number) => {
        if (showFeedback) return;

        setSelectedOption(idx);
        const correct = idx === currentQ.correct;
        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) setScore(s => s + 1);

        // Save result temporarily
        const result = {
            questionId: currentQ.id,
            category: currentQ.category,
            correct: correct
        };
        setResults(prev => [...prev, result]);
    };

    const handleNext = () => {
        if (currentIdx < QUESTIONS.length - 1) {
            setShowFeedback(false);
            setSelectedOption(null);
            setCurrentIdx(i => i + 1);
        } else {
            // Finish Quiz
            const finalScore = Math.round(((score + (isCorrect ? 0 : 0)) / QUESTIONS.length) * 100);

            // Save to localStorage for migration later
            localStorage.setItem("saberpro_diagnostic_results", JSON.stringify({
                score: finalScore,
                answers: results,
                date: new Date().toISOString()
            }));

            // Redirect to Results Page (Hook visual)
            router.push("/diagnostic/results");
        }
    };

    const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-xl mx-auto space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-metal-silver uppercase font-bold tracking-widest">
                    <span>Progreso</span>
                    <span>{currentIdx + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-metal-gold to-yellow-600"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card variant="glass" className="p-8 border-metal-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
                        <span className="inline-block px-3 py-1 bg-white/5 text-metal-gold text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            {currentQ.category}
                        </span>

                        <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
                            {currentQ.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => {
                                let btnClass = "w-full p-4 rounded-xl text-left border border-white/5 bg-white/5 hover:bg-white/10 transition-all font-medium text-metal-silver flex justify-between items-center group";

                                if (showFeedback) {
                                    if (idx === currentQ.correct) btnClass = "w-full p-4 rounded-xl text-left border border-green-500/50 bg-green-500/10 text-white font-bold";
                                    else if (idx === selectedOption && idx !== currentQ.correct) btnClass = "w-full p-4 rounded-xl text-left border border-red-500/50 bg-red-500/10 text-white opacity-50";
                                    else btnClass = "w-full p-4 rounded-xl text-left border border-white/5 bg-black/20 text-metal-silver opacity-30";
                                } else if (selectedOption === idx) {
                                    btnClass += " ring-2 ring-metal-gold bg-metal-gold/10 text-white";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        disabled={showFeedback}
                                        className={btnClass}
                                    >
                                        <span>{opt}</span>
                                        {showFeedback && idx === currentQ.correct && <CheckCircle2 className="text-green-400" size={20} />}
                                        {showFeedback && idx === selectedOption && idx !== currentQ.correct && <XCircle className="text-red-400" size={20} />}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Immediate Feedback (Micro-Victoria) */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                <Brain size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCorrect ? '✔ Bien, este tema lo dominas.' : '⚠ Aquí suele fallar el 70% de estudiantes.'}
                                </h4>
                                <p className="text-sm text-metal-silver mb-4 leading-relaxed">
                                    {currentQ.explanation}
                                </p>
                                <Button
                                    onClick={handleNext}
                                    variant="premium"
                                    className="w-full text-xs font-black uppercase tracking-widest h-10"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    {currentIdx === QUESTIONS.length - 1 ? 'Ver Diagnóstico Final' : 'Siguiente Pregunta'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
