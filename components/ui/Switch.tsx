import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="sr-only peer"
                    ref={ref}
                    {...props}
                />
                <div className="w-11 h-6 bg-[var(--theme-border-soft)] peer-focus:outline-none rounded-full peer peer-checked:bg-brand-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--theme-bg-surface)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-lg border border-[var(--theme-border-soft)] transition-all"></div>
            </label>
        );
    }
);

Switch.displayName = "Switch";

export { Switch };
