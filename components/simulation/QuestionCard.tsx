import { Question, QuestionOption } from "@/types/question";
import { CheckCircle2, Circle } from "lucide-react";

interface QuestionCardProps {
    question: Question;
    selectedOptionId: string | null;
    onSelectOption: (optionId: string) => void;
    showResult?: boolean;
    aiUsageCount?: number;
    onAiUsed?: () => void;
}

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import PremiumGuard from "@/components/ui/PremiumGuard";
import { useAuth } from "@/context/AuthContext";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function QuestionCard({ question, selectedOptionId, onSelectOption, showResult = false, aiUsageCount = 0, onAiUsed }: QuestionCardProps) {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loadingExpl, setLoadingExpl] = useState(false);
    const { user, subscription } = useAuth(); // Ensure subscription is pulled

    const handleExplain = async () => {
        setLoadingExpl(true);
        if (onAiUsed) onAiUsed(); // Increment usage counter

        try {
            const res = await fetch('/api/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    selectedOption: question.options.find(o => o.id === selectedOptionId)?.text || "Ninguna",
                    correctAnswer: question.options.find(o => o.id === question.correctAnswer)?.text,
                    userProfile: { targetCareer: "Ingeniería" } // TODO: Fetch real profile if needed, or pass it down
                })
            });
            const data = await res.json();
            setExplanation(data.explanation);
        } catch (error) {
            console.error("Failed to explain", error);
        } finally {
            setLoadingExpl(false);
        }
    };

    // LOGIC:
    // If Pro -> Always Allowed
    // If Free -> Allowed only if aiUsageCount < 5
    // If Free AND aiUsageCount >= 5 -> Blocked (Show PremiumGuard)

    const isPro = subscription?.plan === 'pro';
    const isSimulatedPro = !isPro && aiUsageCount < 5; // Allow free users up to 5 times
    const showPaywall = !isPro && !isSimulatedPro;

    return (
        <Card variant="glass" className="p-6 md:p-10 w-full max-w-3xl mx-auto shadow-sm border-[var(--theme-border-soft)]">
            <div className="mb-8 flex justify-between items-center">
                <div className="flex gap-2">
                    <Badge variant="outline" className="h-6 px-2 text-[10px] uppercase font-bold tracking-wider opacity-50 border-[var(--theme-border-soft)]">
                        {(question.module || "General").replace("_", " ")}
                    </Badge>
                </div>
                <Badge
                    variant="ghost"
                    className={cn(
                        "h-6 px-2 text-[10px] font-bold uppercase tracking-widest",
                        question.difficulty === 'alta' ? 'text-red-400' : question.difficulty === 'media' ? 'text-amber-400' : 'text-emerald-400'
                    )}
                >
                    {question.difficulty}
                </Badge>
            </div>

            <h2 className="text-2xl md:text-3xl font-medium text-[var(--theme-text-primary)] leading-relaxed mb-10 tracking-tight">
                {question.text}
            </h2>

            {/* ... Options or Prompt ... */}
            {question.isPromptOnly ? (
                <div className="space-y-4 mb-8">
                    <textarea
                        className="w-full h-48 p-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-all duration-180 ease-out placeholder:text-[var(--theme-text-secondary)]/30"
                        placeholder="Escribe tu análisis aquí..."
                        disabled={showResult}
                    />
                    <p className="text-xs text-[var(--theme-text-secondary)]/40 italic pl-2">
                        * Esta es una tarea de respuesta abierta para desarrollar tus habilidades de argumentación.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 mb-10">
                    {question.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.id === question.correctAnswer;

                        let optionStyle = "bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)] hover:border-brand-primary/50 hover:bg-brand-primary/[0.02]";

                        if (showResult) {
                            if (isCorrect) {
                                optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-500";
                            } else if (isSelected) {
                                optionStyle = "bg-red-500/10 border-red-500 text-red-500";
                            } else {
                                optionStyle = "opacity-30 grayscale pointer-events-none";
                            }
                        } else if (isSelected) {
                            optionStyle = "bg-brand-primary/10 border-brand-primary text-[var(--theme-text-primary)] shadow-sm";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => !showResult && onSelectOption(option.id)}
                                disabled={showResult}
                                className={cn(
                                    "w-full text-left p-5 rounded-2xl border transition-all duration-120 flex items-center gap-5 group",
                                    "hover:scale-[1.01] active:scale-[0.99]",
                                    optionStyle
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-120",
                                    isSelected ? "border-brand-primary bg-brand-primary text-white" : "border-[var(--theme-border-soft)] text-transparent group-hover:border-brand-primary/40"
                                )}>
                                    {isSelected && <CheckCircle2 size={14} className="stroke-[3]" />}
                                </div>
                                <span className="text-lg font-medium leading-snug">{option.text}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* AI Explanation Section */}
            {showResult && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {showPaywall ? (
                        <Card variant="glass" className="p-5 flex items-center gap-4 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                            <div className="bg-slate-900/50 p-3 rounded-full relative z-10 transition-colors group-hover:bg-brand-primary/20">
                                <Brain className="text-theme-text-secondary group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Límite de IA Alcanzado (5/5)</h4>
                                <p className="text-sm text-theme-text-secondary">Pásate a PRO para explicaciones ilimitadas.</p>
                            </div>
                            <Link href="/pricing" aria-label="Ver planes de precios" className="absolute inset-0 z-20" />
                        </Card>
                    ) : (
                        <div className="bg-slate-900/30 rounded-xl border border-theme-text-secondary/10 overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-transparent flex items-center gap-2 border-b border-theme-text-secondary/10">
                                <Brain className="text-brand-primary w-5 h-5" />
                                <h3 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">
                                    Análisis Inteligente {(!isPro) && <span className="opacity-50 text-[10px] ml-2">({aiUsageCount}/5 Usos Gratuitos)</span>}
                                </h3>
                            </div>

                            <div className="p-6">
                                {!explanation ? (
                                    loadingExpl ? (
                                        <AIProcessingLoader />
                                    ) : (
                                        <Button
                                            onClick={handleExplain}
                                            variant="ghost"
                                            className="w-full h-12 border border-metal-blue/30 text-metal-blue hover:bg-metal-blue/10 font-semibold tracking-wider uppercase text-xs"
                                            icon={Brain}
                                        >
                                            Solicitar Explicación
                                        </Button>
                                    )
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="text-theme-text-secondary leading-exam prose-optimal mx-auto whitespace-pre-line animate-in fade-in">
                                            {explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
