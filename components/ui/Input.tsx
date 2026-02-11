import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    error?: string;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon: Icon, error, label, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-[10px] font-bold text-theme-text-tertiary uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-quaternary group-focus-within:text-brand-primary transition-colors duration-300">
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "w-full bg-[var(--theme-bg-surface)] border-[0.5px] border-theme-border-soft rounded-[var(--radius-md)] px-4 py-3.5 text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-all duration-300 font-medium",
                            "hover:border-theme-border-medium focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 focus:shadow-[var(--shadow-4k)] ring-1 ring-black/5",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            Icon && "pl-11",
                            error && "border-brand-error/50 focus:border-brand-error/5 focus:ring-brand-error/5",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {/* Active Gradient Border Effect (Optional, kept subtle via ring) */}
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 animate-in fade-in slide-in-from-top-1 flex items-center gap-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
