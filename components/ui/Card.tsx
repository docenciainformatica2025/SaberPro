import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid' | 'premium';
    glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', glow = false, children, ...props }, ref) => {
        const variants = {
            glass: "bg-white/5 border border-white/10 backdrop-blur-md",
            solid: "bg-[#0f0f0f] border border-white/5",
            premium: "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-metal-gold/20"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
                    variants[variant],
                    glow && "shadow-[0_0_30px_rgba(212,175,55,0.05)]",
                    className
                )}
                {...props}
            >
                {glow && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-metal-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                )}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card };
