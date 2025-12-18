import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium' | 'ghost' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: "bg-white/20 text-metal-silver border-white/20",
            success: "bg-green-500/20 text-green-400 border-green-500/30",
            warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            error: "bg-red-500/20 text-red-400 border-red-500/30",
            info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            premium: "bg-metal-gold/20 text-metal-gold border-metal-gold/30",
            ghost: "bg-transparent text-metal-silver border-metal-silver/30",
            outline: "bg-transparent border border-white/10 text-metal-silver"
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
