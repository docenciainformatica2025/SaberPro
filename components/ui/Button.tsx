import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

/**
 * Button component variants based on the SaberPro "Metal" Design System.
 */
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
    variant?: 'primary' | 'success' | 'accent' | 'error' | 'outline' | 'ghost' | 'link' | 'premium';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {

        // Base structure and core design system classes
        const baseStyles = cn(
            "inline-flex items-center justify-center rounded-[var(--radius-md)] font-bold",
            "transition-all duration-120 ease-[var(--ease-apple)]",
            "disabled:opacity-50 disabled:grayscale disabled:pointer-events-none select-none",
            "focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2",
            "ring-offset-[var(--theme-bg-base)]"
        );

        const variants = {
            primary: "bg-brand-primary text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-[0.98] ring-1 ring-white/10",
            success: "bg-brand-success text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-[0.98] ring-1 ring-white/10",
            accent: "bg-brand-accent text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-[0.98] ring-1 ring-white/10",
            error: "bg-brand-error text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-[0.98] ring-1 ring-white/10",
            outline: "bg-transparent border-[0.5px] border-theme-border-soft text-theme-text-primary hover:bg-[var(--theme-bg-surface)] hover:border-brand-primary/30 active:scale-[0.98] ring-1 ring-black/5",
            ghost: "bg-transparent text-theme-text-secondary hover:bg-[var(--theme-bg-surface)] hover:text-theme-text-primary active:scale-[0.98]",
            link: "bg-transparent text-brand-primary hover:underline underline-offset-4",
            premium: "bg-gradient-to-r from-brand-primary to-[#B8860B] text-white shadow-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:brightness-110 border border-yellow-400/20",
        };

        const sizes = {
            sm: "px-3 h-10 text-xs",
            md: "px-5 h-12 text-sm",
            lg: "px-7 h-14 text-base",
            xl: "px-9 h-16 text-lg",
            icon: "h-12 w-12"
        };

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
