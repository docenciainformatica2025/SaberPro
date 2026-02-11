import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid' | 'premium' | 'primary';
    glow?: boolean;
    interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', glow = false, interactive = false, children, ...props }, ref) => {
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

        const variants: Record<string, string> = {
            glass: "bg-[var(--theme-bg-surface)]/80 border border-[var(--theme-border-soft)] backdrop-blur-2xl shadow-[var(--shadow-4k)] ring-1 ring-white/5",
            solid: "bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] shadow-[var(--shadow-4k)] ring-1 ring-black/5",
            premium: "bg-[var(--theme-bg-surface)] border border-brand-primary/15 shadow-[0_8px_40px_rgba(30,64,175,0.08)] ring-1 ring-brand-primary/5",
            primary: "bg-brand-primary/[0.02] border border-brand-primary/20 shadow-sm ring-1 ring-brand-primary/5"
        };

        return (
            <motion.div
                ref={ref as any}
                onMouseMove={handleMouseMove}
                whileHover={interactive ? { y: -3, scale: 1.005 } : {}}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                    "rounded-[var(--radius-lg)] p-6 transition-colors duration-180 relative overflow-hidden group",
                    variants[variant],
                    className
                )}
                {...(props as any)}
            >
                {/* Spotlight Effect (Subtle Blue) */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[var(--radius-lg)] opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                800px circle at ${mouseX}px ${mouseY}px,
                                rgba(30, 64, 175, 0.08),
                                transparent 65%
                            )
                        `,
                    }}
                />

                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export { Card };
