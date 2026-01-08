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
                    <label className="text-[10px] font-bold text-metal-silver/60 uppercase tracking-widest ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver/40 group-focus-within:text-metal-gold transition-colors duration-300">
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-all duration-300",
                            "hover:bg-white/[0.05] hover:border-white/20",
                            "focus:bg-white/[0.08] focus:border-metal-gold/50 focus:ring-4 focus:ring-metal-gold/5 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            Icon && "pl-11",
                            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5",
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
