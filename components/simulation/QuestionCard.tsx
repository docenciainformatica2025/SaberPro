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
        <Card variant="glass" className="p-6 md:p-8 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex justify-between items-start">
                <Badge variant="info" className="h-7 px-3 uppercase font-black">
                    {(question.module || "General").replace("_", " ")}
                </Badge>
                <Badge
                    variant={question.difficulty === 'alta' ? 'error' : question.difficulty === 'media' ? 'warning' : 'success'}
                    className="h-7 px-3 font-black"
                >
                    DIFICULTAD {question.difficulty}
                </Badge>
            </div>

            <h2 className="text-xl md:text-2xl font-medium text-metal-silver mb-8 leading-relaxed">
                {question.text}
            </h2>

            {/* ... Existing Options ... */}
            <div className="space-y-4 mb-8">
                {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = option.id === question.correctAnswer;

                    let optionStyle = "bg-metal-dark/50 border-metal-silver/10 text-metal-silver/70 hover:bg-metal-silver/5 hover:border-metal-silver/30";
                    let iconColor = "border-metal-silver/30 text-transparent group-hover:border-metal-silver/60";

                    if (showResult) {
                        if (isCorrect) {
                            optionStyle = "bg-green-500/20 border-green-500/50 text-white";
                            iconColor = "border-green-500 text-green-500";
                        } else if (isSelected) {
                            optionStyle = "bg-red-500/20 border-red-500/50 text-white";
                            iconColor = "border-red-500 text-red-500";
                        } else {
                            optionStyle = "opacity-50 pointer-events-none";
                        }
                    } else if (isSelected) {
                        optionStyle = "bg-metal-gold/10 border-metal-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.1)]";
                        iconColor = "border-metal-gold text-metal-gold";
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => !showResult && onSelectOption(option.id)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${optionStyle}`}
                        >
                            <div className={`p-1 rounded-full border transition-colors ${iconColor}`}>
                                {showResult && isCorrect ? <CheckCircle2 size={20} className="fill-green-500/20" /> :
                                    isSelected ? <CheckCircle2 size={20} className="fill-metal-gold/20" /> : <Circle size={20} />}
                            </div>
                            <span className="text-lg">{option.text}</span>
                        </button>
                    );
                })}
            </div>

            {/* AI Explanation Section */}
            {showResult && (
                <div className="mt-8 pt-8 border-t border-metal-silver/10">
                    {showPaywall ? (
                        <Card variant="solid" className="p-6 flex items-center gap-4 relative overflow-hidden group border-metal-gold/20 bg-metal-gold/5">
                            <div className="bg-metal-dark/50 p-3 rounded-full relative z-10 transition-colors group-hover:bg-metal-gold/20">
                                <Brain className="text-metal-silver group-hover:text-metal-gold transition-colors" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-black text-white text-sm uppercase tracking-widest">Límite de IA Alcanzado (5/5)</h4>
                                <p className="text-sm text-metal-silver">Pásate a PRO para explicaciones ilimitadas.</p>
                            </div>
                            <Link href="/pricing" aria-label="Ver planes de precios" className="absolute inset-0 z-20" />
                        </Card>
                    ) : (
                        <div className="bg-metal-dark/30 rounded-xl border border-metal-silver/10 overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-metal-gold/10 to-transparent flex items-center gap-2 border-b border-metal-silver/10">
                                <Brain className="text-metal-gold w-5 h-5" />
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
                                            className="w-full h-12 border border-metal-blue/30 text-metal-blue hover:bg-metal-blue/10 font-black tracking-widest uppercase text-xs"
                                            icon={Brain}
                                        >
                                            Solicitar Explicación
                                        </Button>
                                    )
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="text-metal-silver leading-relaxed whitespace-pre-line animate-in fade-in">
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
