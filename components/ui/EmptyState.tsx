import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    actionLabel,
    onAction,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01]",
            className
        )}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-metal-gold/20 to-transparent flex items-center justify-center mb-6 shadow-2xl">
                <Icon size={32} className="text-metal-gold" />
            </div>

            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">
                {title}
            </h3>

            <p className="text-metal-silver/40 text-sm max-w-[280px] mb-8 font-medium leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="premium"
                    size="sm"
                    className="shadow-xl shadow-metal-gold/10"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
