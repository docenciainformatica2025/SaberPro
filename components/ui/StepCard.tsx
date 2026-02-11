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
                "w-28 h-28 rounded-[2rem] bg-theme-bg-base border flex items-center justify-center text-4xl font-bold transition-all duration-500 group-hover:scale-105 group-hover:shadow-md mb-8",
                isPrimary
                    ? "border-brand-primary shadow-xl shadow-brand-primary/10 text-brand-primary"
                    : "border-theme-border-soft shadow-sm text-theme-text-primary"
            )}>
                {step}
            </div>
            <h3 className="text-2xl font-bold text-theme-text-primary uppercase tracking-tighter mb-4 leading-tight">
                <span className="sr-only">Paso {step}: </span>
                {title}
            </h3>
            <p className="text-theme-text-secondary text-base font-medium max-w-xs leading-relaxed opacity-80">
                {description}
            </p>
        </div>
    );
};
