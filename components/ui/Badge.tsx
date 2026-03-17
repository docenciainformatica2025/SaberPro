"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface BadgeProps extends HTMLMotionProps<"span"> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'premium' | 'ghost' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants: Record<string, string> = {
            default: "bg-[var(--theme-bg-surface)] text-[var(--theme-text-secondary)] border-[var(--theme-border-soft)]",
            primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/30",
            secondary: "bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] border-[var(--theme-border-soft)]",
            success: "bg-brand-success/15 text-brand-success border-brand-success/30",
            warning: "bg-brand-accent/15 text-brand-accent border-brand-accent/30",
            error: "bg-brand-error/15 text-brand-error border-brand-error/30",
            info: "bg-brand-primary/15 text-brand-primary border-brand-primary/30",
            premium: "bg-brand-primary text-white border-brand-primary shadow-sm",
            ghost: "bg-transparent text-[var(--theme-text-tertiary)] border-[var(--theme-border-soft)]",
            outline: "bg-transparent border border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)]"
        };

        return (
            <motion.span
                ref={ref}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.15em] transition-all duration-300",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </motion.span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
