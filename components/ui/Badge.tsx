import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface BadgeProps extends HTMLMotionProps<"span"> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'premium' | 'ghost' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants: Record<string, string> = {
            default: "bg-surface-card text-theme-text-secondary border-theme-border-soft",
            primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
            success: "bg-brand-success/10 text-brand-success border-brand-success/20",
            warning: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
            error: "bg-brand-error/10 text-brand-error border-brand-error/20",
            info: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
            premium: "bg-brand-primary text-white border-brand-primary shadow-sm",
            ghost: "bg-transparent text-theme-text-tertiary border-theme-border-soft",
            outline: "bg-transparent border border-theme-border-soft text-theme-text-secondary"
        };

        return (
            <motion.span
                ref={ref as any}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border-[0.5px] uppercase tracking-wider transition-all duration-300 ring-1 ring-black/5",
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
