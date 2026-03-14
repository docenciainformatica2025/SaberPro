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
        <Card variant="glass" className={cn("p-12 group hover:-translate-y-3 transition-all duration-500 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-theme-bg-surface/5 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5", className)}>
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-theme-bg-base flex items-center justify-center mb-10 group-hover:bg-slate-50 dark:group-hover:bg-theme-bg-base/80 transition-colors shadow-sm ring-1 ring-black/5">
                <Icon className={iconColor} size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-theme-text-primary mb-6 tracking-tight">{title}</h3>
            <p className="text-slate-600 dark:text-theme-text-secondary text-lg font-medium leading-relaxed">{description}</p>
        </Card>
    );
};
