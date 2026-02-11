"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MasteryProgressProps {
    value: number;
    max?: number;
    label: string;
    subtext?: string;
    className?: string;
}

export const MasteryProgress: React.FC<MasteryProgressProps> = ({
    value,
    max = 100,
    label,
    subtext,
    className
}) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="text-sm font-bold text-theme-text-primary flex items-center gap-2">
                        {label}
                        {percentage === 100 && <CheckCircle2 size={14} className="text-brand-success" />}
                    </h4>
                    {subtext && <p className="text-[10px] text-theme-text-tertiary font-medium">{subtext}</p>}
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold text-brand-primary">{percentage}%</span>
                </div>
            </div>

            <div className="h-2 w-full bg-theme-bg-base/50 rounded-full overflow-hidden border border-theme-border-soft">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full transition-colors",
                        percentage === 100 ? "bg-brand-success" : "bg-brand-primary"
                    )}
                />
            </div>

            {percentage > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-success animate-in fade-in slide-in-from-left-2 duration-500">
                    <TrendingUp size={12} />
                    <span>¡Vas por buen camino, sigamos mejorando!</span>
                </div>
            )}
        </div>
    );
};
