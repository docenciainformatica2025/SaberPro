import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid' | 'premium';
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

        const variants = {
            glass: "bg-white/5 border border-white/10 backdrop-blur-md",
            solid: "bg-[#0f0f0f] border border-white/5",
            premium: "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-metal-gold/20"
        };

        return (
            <motion.div
                ref={ref as any}
                onMouseMove={handleMouseMove}
                whileHover={interactive ? { y: -4, transition: { duration: 0.2 } } : {}}
                className={cn(
                    "rounded-2xl p-6 transition-colors duration-300 relative overflow-hidden group",
                    variants[variant],
                    glow && "shadow-[0_0_30px_rgba(212,175,55,0.05)]",
                    className
                )}
                {...(props as any)}
            >
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(212, 175, 55, 0.07),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {glow && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-metal-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                )}

                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export { Card };
