"use client";

import { Check } from "lucide-react";

interface Step {
    id: string;
    title: string;
    description?: string;
}

interface FormStepperProps {
    steps: Step[];
    currentStep: number;
}

/**
 * FormStepper - Progressive Disclosure Pattern
 * Visual indicator for multi-step forms (reduces cognitive load)
 * Follows Material Design stepper guidelines
 */
export default function FormStepper({ steps, currentStep }: FormStepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-metal-silver/10 -z-10" />

                {/* Progress Line Filled */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-metal-gold transition-all duration-500 ease-out -z-10"
                    style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`
                    }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                            {/* Step Circle */}
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    font-bold text-sm transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-green-500 text-white scale-110'
                                        : isCurrent
                                            ? 'bg-metal-gold text-black scale-110 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                                            : 'bg-metal-dark border-2 border-metal-silver/20 text-metal-silver/40'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={18} strokeWidth={3} />
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Step Label */}
                            <div className="text-center">
                                <p className={`
                                    text-xs font-bold uppercase tracking-wider transition-colors
                                    ${isCurrent
                                        ? 'text-metal-gold'
                                        : isCompleted
                                            ? 'text-green-400'
                                            : 'text-metal-silver/40'
                                    }
                                `}>
                                    {step.title}
                                </p>
                                {step.description && isCurrent && (
                                    <p className="text-[10px] text-metal-silver/60 mt-1 max-w-[80px]">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
