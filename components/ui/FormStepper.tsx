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
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-theme-text-secondary/10 -z-10" />

                {/* Progress Line Filled */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-brand-primary transition-all duration-500 ease-out -z-10"
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
                                            ? 'bg-brand-primary text-[var(--theme-bg-base)] scale-110 shadow-[var(--theme-accent-gold-soft)]'
                                            : 'bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-border-soft)] text-[var(--theme-text-quaternary)]'
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
                                        ? 'text-brand-primary'
                                        : isCompleted
                                            ? 'text-green-400'
                                            : 'text-[var(--theme-text-quaternary)]'
                                    }
                                `}>
                                    {step.title}
                                </p>
                                {step.description && isCurrent && (
                                    <p className="text-[10px] text-theme-text-secondary/60 mt-1 max-w-[80px]">
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
