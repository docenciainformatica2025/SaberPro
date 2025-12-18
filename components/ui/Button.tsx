import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button component variants based on the SaberPro "Metal" Design System.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'premium' | 'silver' | 'outline' | 'ghost' | 'danger' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'premium', size = 'md', isLoading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {

        // Base structure and core design system classes
        const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none metallic-btn";

        const variants = {
            premium: "bg-gradient-to-r from-metal-gold to-metal-gold-deep text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110",
            silver: "bg-gradient-to-r from-metal-silver to-metal-silver-deep text-black shadow-lg hover:brightness-110",
            outline: "bg-transparent border border-metal-silver/20 text-metal-silver hover:bg-metal-silver/5 hover:border-metal-silver/40",
            ghost: "bg-transparent text-metal-silver hover:bg-white/5",
            danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
            link: "bg-transparent text-metal-gold hover:underline underline-offset-4"
        };

        const sizes = {
            sm: "px-5 py-3 text-xs min-h-[44px]", // Minimo 44px altura
            md: "px-6 py-3.5 text-sm min-h-[48px]",
            lg: "px-8 py-4 text-base min-h-[56px]",
            xl: "px-10 py-5 text-lg min-h-[64px]",
            icon: "p-3 min-h-[44px] min-w-[44px]"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    Icon && iconPosition === 'left' && <Icon className={cn("inline-block", children ? "mr-2" : "")} size={size === 'sm' ? 14 : 18} />
                )}

                {children}

                {!isLoading && Icon && iconPosition === 'right' && (
                    <Icon className={cn("inline-block", children ? "ml-2" : "")} size={size === 'sm' ? 14 : 18} />
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
