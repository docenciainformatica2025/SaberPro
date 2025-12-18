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
                    <label className="text-xs font-bold text-metal-silver/70 uppercase tracking-widest ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver/40 group-focus-within:text-metal-gold transition-colors">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "w-full bg-metal-dark/50 border border-metal-silver/10 rounded-xl px-4 py-3 text-white placeholder-metal-silver/30 outline-none transition-all",
                            "focus:border-metal-gold/50 focus:ring-4 focus:ring-metal-gold/5",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            Icon && "pl-11",
                            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
