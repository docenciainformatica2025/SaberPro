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
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-silver/40 group-focus-within:text-metal-gold transition-colors pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <select
                    ref={ref}
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-metal-gold/50 focus:border-metal-gold/50 transition-all cursor-pointer",
                        !Icon && "pl-4",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-silver/20 pointer-events-none">
                    <ChevronDown size={14} />
                </div>
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
