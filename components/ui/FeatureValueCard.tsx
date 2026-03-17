import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface FeatureValueCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
    className?: string;
}

export const FeatureValueCard: React.FC<FeatureValueCardProps> = ({
    icon: Icon,
    title,
    description,
    iconColor = "text-brand-primary",
    className
}) => {
    return (
        <Card variant="glass" className={cn("p-8 md:p-12 group hover:-translate-y-3 transition-all duration-500 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/50 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5", className)}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-[var(--theme-bg-surface)] transition-colors shadow-sm ring-1 ring-white/5">
                <Icon className={iconColor} size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)] mb-4 md:mb-6 tracking-tight">{title}</h3>
            <p className="text-[var(--theme-text-secondary)] text-base md:text-lg font-medium leading-relaxed">{description}</p>
        </Card>
    );
};
