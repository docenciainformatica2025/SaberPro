"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    X,
    MessageCircle,
    Lightbulb,
    Check,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Mock Data for the Quiz
const QUIZ_DATA = {
    title: "Psychology-Driven Learning Mode",
    currentQuestion: 4,
    totalQuestions: 10,
    question: {
        text: 'Question: What does "Growth Mindset" emphasize?',
        options: [
            { id: 'A', text: 'Fixed intelligence' },
            { id: 'B', text: 'Learning through effort', isCorrect: true },
            { id: 'C', text: 'Immediate success' }
        ],
        feedback: {
            positive: "¡Excelente análisis! Así se hace. El esfuerzo es clave para el aprendizaje.",
            hint: "Tip: Focus on the process, not just the result."
        }
    }
};

export default function LearningPage() {
    const { user } = useAuth();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Simulate selection
    const handleSelect = (id: string) => {
        if (!isConfirmed) {
            setSelectedOption(id);
        }
    };

    // Simulate confirmation (in a real app, this would check against the answer)
    const handleConfirm = () => {
        if (selectedOption) {
            setIsConfirmed(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#ffe4c4] font-sans flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-md px-6 pt-6 pb-2 flex items-center justify-between">
                <Link href="/dashboard">
                    <button className="w-10 h-10 rounded-full bg-[#e6cfb3] flex items-center justify-center text-slate-600 hover:bg-[#dabb9e] transition-colors">
                        <X size={20} />
                    </button>
                </Link>
                <h1 className="font-bold text-slate-800 text-sm md:text-base">Psychology-Driven Learning Mode</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md px-6 mb-6 flex items-center gap-3">
                <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff7e5f] w-[40%] rounded-full" />
                </div>
                <span className="text-slate-500 font-bold text-sm">4/10</span>
            </div>

            {/* Question Card */}
            <div className="w-full max-w-md px-6 flex-1 flex flex-col pb-8">
                <Card className="bg-white rounded-[2rem] p-8 shadow-sm border-0 mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                        {QUIZ_DATA.question.text}
                    </h2>
                </Card>

                {/* Options */}
                <div className="space-y-4 mb-2">
                    {QUIZ_DATA.question.options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const showCorrect = isConfirmed && option.isCorrect;
                        const showIncorrect = isConfirmed && isSelected && !option.isCorrect;

                        return (
                            <div key={option.id}>
                                <button
                                    onClick={() => handleSelect(option.id)}
                                    disabled={isConfirmed}
                                    className={`
                                        w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all relative overflow-hidden
                                        ${isSelected ? 'bg-[#ffe4c4]/30 border-[#ff7e5f]' : 'bg-[#e6cfb3]/20 border-transparent hover:bg-[#e6cfb3]/40'}
                                        ${showCorrect ? '!border-green-500 !bg-green-50' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg ${isSelected || showCorrect ? 'text-[#ff7e5f]' : 'text-slate-400'}`}>
                                            {option.id}.
                                        </span>
                                        <span className="font-bold text-slate-700 text-lg">
                                            {option.text}
                                        </span>
                                    </div>
                                    {showCorrect && <Check className="text-green-500" size={24} />}
                                </button>

                                {/* Owl Feedback (Specific for Option B being correct/selected in mockup) */}
                                {isSelected && option.id === 'B' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300 mt-[-10px] relative z-20">
                                        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100 flex items-start gap-4 ml-8 relative mt-2">
                                            {/* Owl Mascot Icon Placeholder */}
                                            <div className="absolute -left-10 top-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm text-orange-500">
                                                <span className="text-2xl">🦉</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 leading-snug">
                                                {QUIZ_DATA.question.feedback.positive}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Hint / Tip */}
                <div className="mt-auto pt-8 flex flex-col items-end">
                    <div className="relative max-w-[80%]">
                        <div className="bg-white rounded-2xl rounded-br-none p-4 shadow-sm text-center border border-slate-100 relative mb-2">
                            {/* Speech Bubble Tail */}
                            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>

                            <p className="text-sm text-slate-800 font-bold">
                                {QUIZ_DATA.question.feedback.hint}
                            </p>
                        </div>
                        <div className="flex justify-end pr-2 gap-2">
                            <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 shadow-sm border border-slate-100">T hru gtuu:</span>
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm text-orange-500">
                                <span className="text-2xl">🦉</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="mt-8">
                    <Button
                        className="w-full h-14 rounded-full bg-[#ff7e5f] hover:bg-[#eb6f50] text-white font-bold text-lg shadow-lg shadow-orange-200"
                        onClick={handleConfirm}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
