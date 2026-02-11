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
            "flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/50",
            className
        )}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-transparent flex items-center justify-center mb-6 shadow-2xl">
                <Icon size={32} className="text-brand-primary" />
            </div>

            <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight mb-2">
                {title}
            </h3>

            <p className="text-[var(--theme-text-secondary)] text-sm max-w-[280px] mb-8 font-medium leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="primary"
                    size="sm"
                    className="shadow-xl shadow-brand-primary/10"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
