"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Brain, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Preguntas Micro-Diagnóstico 2026 (Expert Level)
const QUESTIONS = [
    {
        id: 1,
        category: "Competencias Ciudadanas",
        question: "Un medio de comunicación publica la orientación sexual de un funcionario público alegando 'interés general'. El funcionario demanda alegando su derecho a la intimidad. ¿Qué criterio aplica la Corte Constitucional?",
        options: [
            "Priorizar siempre la libertad de prensa.",
            "El test de proporcionalidad (ponderación).",
            "Darle la razón a quien llegó primero.",
            "Ignorar el caso por ser privado."
        ],
        correct: 1,
        explanation: "En conflictos de derechos constitucionales de igual jerarquía, se aplica la ponderación basada en el test de proporcionalidad."
    },
    {
        id: 2,
        category: "Lectura Crítica",
        question: "Si la justicia es solo el interés del más fuerte, entonces la ley no es un refugio sino una herramienta de dominación. ¿Qué intención tiene el autor?",
        options: [
            "Elogiar la fuerza bruta.",
            "Describir la historia griega.",
            "Criticar la reducción de la moral al poder.",
            "Apoyar la anarquía total."
        ],
        correct: 2,
        explanation: "El autor usa un condicional para mostrar las consecuencias cínicas de reducir la justicia al simple interés del más fuerte."
    },
    {
        id: 3,
        category: "Razonamiento Cuantitativo",
        question: "Inviertes $1.000.000 al 10% E.A. Si la inflación es del 5%, ¿cuál es tu rentabilidad real aproximada?",
        options: ["10%", "15%", "5%", "50%"],
        correct: 2,
        explanation: "La rentabilidad real se calcula restando la inflación de la tasa nominal: 10% - 5% = 5%."
    },
    {
        id: 4,
        category: "Inglés (B2)",
        question: "What can be inferred from: 'Despite digitalization, many elderly people prefer face-to-face interaction since technology feels cold'?",
        options: [
            "Technology is free for everyone.",
            "There is social resistance due to emotional factors.",
            "The government stopped the process.",
            "Elderly people can't learn technology."
        ],
        correct: 1,
        explanation: "The preference for face-to-face due to 'coldness' implies an emotional/generational resistance to the digital shift."
    },
    {
        id: 5,
        category: "Comunicación Escrita",
        question: "Para un ensayo sobre inteligencia artificial, ¿cuál es el orden lógico más adecuado?",
        options: [
            "Conclusiones - Argumentos - Tesis.",
            "Tesis - Argumentos - Contraargumentos - Conclusión.",
            "Ejemplos - Tesis - Bibliografía - Título.",
            "Introducción - Cierre - Desarrollo - Tesis."
        ],
        correct: 1,
        explanation: "Un ensayo académico estándar sigue una estructura deductiva: planteamiento de tesis, sustentación (pros/contras) y síntesis final."
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

    const [shuffledQuestions, setShuffledQuestions] = useState<typeof QUESTIONS>([]);

    useEffect(() => {
        // Randomize questions on mount
        const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
    }, []);

    const currentQ = shuffledQuestions[currentIdx];

    if (shuffledQuestions.length === 0) return null; // Avoid render before shuffle

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
        if (currentIdx < shuffledQuestions.length - 1) {
            setShowFeedback(false);
            setSelectedOption(null);
            setCurrentIdx(i => i + 1);
        } else {
            // Finish Quiz
            const finalScore = Math.round(((score + (isCorrect ? 0 : 0)) / shuffledQuestions.length) * 100);

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

    const progress = ((currentIdx + 1) / shuffledQuestions.length) * 100;

    return (
        <div className="max-w-xl mx-auto space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-metal-silver uppercase font-bold tracking-widest">
                    <span>Progreso</span>
                    <span>{currentIdx + 1} / {shuffledQuestions.length}</span>
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

            {/* Immediate Feedback (Expert Evaluator) */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-elite rounded-xl p-8 transition-all duration-500"
                    >
                        <div className="flex items-start gap-6">
                            <div className={`p-2 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                <Brain size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCorrect ? '✔ Evaluador Experto: Correcto. Tu análisis es coherente con la matriz 2026.' : '⚠ Evaluador Experto: Aquí suele fallar el 70% de aspirantes por falta de rigor técnico.'}
                                </h4>
                                <p className="text-base text-metal-silver mb-6 leading-loose font-medium">
                                    {currentQ.explanation}
                                </p>

                                {/* Tip Saber Pro 2026 */}
                                <div className="mb-6 p-4 bg-metal-gold/5 border-l-2 border-metal-gold rounded-r-lg">
                                    <span className="block text-[10px] font-black text-metal-gold uppercase tracking-widest mb-1">Tip Saber Pro 2026</span>
                                    <p className="text-xs italic text-metal-silver/80">
                                        {isCorrect
                                            ? "Mantén este nivel de detalle. En 2026, las inferencias no son solo literales, requieren entender la intención oculta del autor."
                                            : "No te dejes llevar por la respuesta que suena 'más bonita'. En Competencias Ciudadanas, prioriza siempre el marco constitucional vigente."}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleNext}
                                    variant="premium"
                                    className="w-full text-xs font-black uppercase tracking-widest h-10"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    {currentIdx === shuffledQuestions.length - 1 ? 'Ver Diagnóstico Final' : 'Siguiente Pregunta'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
