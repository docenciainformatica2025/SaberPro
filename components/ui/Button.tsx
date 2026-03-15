"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

/**
 * Button component variants based on the SaberPro "Metal" Design System.
 */
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
    variant?: 'primary' | 'success' | 'accent' | 'error' | 'outline' | 'ghost' | 'link' | 'premium' | 'maestro';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
        const [mounted, setMounted] = React.useState(false);

        React.useEffect(() => {
            setMounted(true);
        }, []);

        // Base structure and core design system classes
        const baseStyles = cn(
            "inline-flex items-center justify-center rounded-[var(--radius-md)] font-bold",
            "transition-all duration-120 ease-[var(--ease-apple)]",
            "disabled:opacity-50 disabled:grayscale disabled:pointer-events-none select-none",
            "focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2",
            "ring-offset-[var(--theme-bg-base)]"
        );

        const variants = {
            primary: "bg-brand-primary text-white shadow-md hover:shadow-lg active:scale-[0.98]",
            success: "bg-brand-success text-white shadow-md hover:bg-brand-success/90 active:scale-[0.98]",
            accent: "bg-brand-accent text-white shadow-md hover:opacity-90 active:scale-[0.98]",
            error: "bg-brand-error text-white shadow-md hover:bg-brand-error/90 active:scale-[0.98]",
            outline: "bg-transparent border-2 border-[var(--theme-border-soft)] text-[var(--theme-text-primary)] hover:border-brand-primary/50 hover:bg-[var(--theme-bg-base)] active:scale-[0.98]",
            ghost: "bg-transparent text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-surface)] hover:text-[var(--theme-text-primary)] active:scale-[0.98]",
            link: "bg-transparent text-brand-primary hover:underline underline-offset-4 font-bold uppercase tracking-widest text-[10px]",
            premium: "bg-gradient-to-br from-brand-primary via-brand-primary to-[#444] text-white shadow-xl hover:brightness-110 border border-white/20",
            maestro: "btn-maestro text-white font-black uppercase tracking-[0.2em] shadow-premium",
        };

        const sizes = {
            sm: "px-3 h-10 text-xs",
            md: "px-5 h-12 text-sm",
            lg: "px-7 h-14 text-base",
            xl: "px-9 h-16 text-lg",
            icon: "h-12 w-12"
        };

        if (!mounted) {
            return (
                <button
                    ref={ref}
                    className={cn(baseStyles, variants[variant], sizes[size], className)}
                    disabled={isLoading || props.disabled}
                    {...(props as any)}
                >
                    {isLoading ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80" />
                    ) : (
                        Icon && iconPosition === 'left' && <Icon className={cn("inline-block", children ? "mr-2.5" : "")} size={size === 'sm' ? 14 : 18} />
                    )}

                    {children}

                    {!isLoading && Icon && iconPosition === 'right' && (
                        <Icon className={cn("inline-block", children ? "ml-2.5" : "")} size={size === 'sm' ? 14 : 18} />
                    )}
                </button>
            );
        }

        return (
            <motion.button
                ref={ref}
                whileHover={variant !== 'link' ? { scale: 1.01 } : {}}
                whileTap={variant !== 'link' ? { scale: 0.98 } : {}}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...(props as any)}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80" />
                ) : (
                    Icon && iconPosition === 'left' && <Icon className={cn("inline-block", children ? "mr-2.5" : "")} size={size === 'sm' ? 14 : 18} />
                )}

                {children}

                {!isLoading && Icon && iconPosition === 'right' && (
                    <Icon className={cn("inline-block", children ? "ml-2.5" : "")} size={size === 'sm' ? 14 : 18} />
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
