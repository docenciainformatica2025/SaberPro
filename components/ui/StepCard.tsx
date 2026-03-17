import React from "react";
import { cn } from "@/lib/utils";

interface StepCardProps {
    step: string;
    title: string;
    description: string;
    isPrimary?: boolean;
    className?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
    step,
    title,
    description,
    isPrimary = false,
    className
}) => {
    return (
        <div className={cn("relative z-10 flex flex-col items-center text-center group", className)} role="listitem">
            <div className={cn(
                "w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] bg-[var(--theme-bg-surface)] border flex items-center justify-center text-3xl sm:text-4xl font-bold transition-all duration-500 group-hover:scale-105 group-hover:shadow-md mb-6 sm:mb-8 shadow-sm",
                isPrimary
                    ? "border-brand-primary shadow-xl shadow-brand-primary/10 text-brand-primary"
                    : "border-[var(--theme-border-soft)] text-[var(--theme-text-primary)]"
            )}>
                {step}
            </div>
            <h3 className="text-2xl font-bold text-[var(--theme-text-primary)] uppercase tracking-tighter mb-4 leading-tight">
                <span className="sr-only">Paso {step}: </span>
                {title}
            </h3>
            <p className="text-[var(--theme-text-secondary)] text-base font-medium max-w-xs leading-relaxed">
                {description}
            </p>
        </div>
    );
};
