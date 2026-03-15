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
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-secondary group-focus-within:text-brand-primary transition-colors duration-300">
                            <Icon size={18} strokeWidth={2.5} />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "w-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-[var(--radius-md)] px-5 py-4 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-tertiary)] outline-none transition-all duration-300 font-medium",
                            "hover:border-[var(--theme-text-tertiary)] focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 bg-white dark:bg-[var(--theme-bg-surface)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            Icon && "pl-12",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[11px] font-bold text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 flex items-center gap-1.5 uppercase tracking-wide">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
