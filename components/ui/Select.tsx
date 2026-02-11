import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    icon?: React.ElementType;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, icon: Icon, ...props }, ref) => {
        return (
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-quaternary)] group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <select
                    ref={ref}
                    className={cn(
                        "w-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-xl py-3 pl-10 pr-10 text-[var(--theme-text-primary)] appearance-none focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all cursor-pointer",
                        !Icon && "pl-4",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-quaternary)]/50 pointer-events-none">
                    <ChevronDown size={14} />
                </div>
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
