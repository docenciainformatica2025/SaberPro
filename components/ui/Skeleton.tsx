import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)]",
                className
            )}
            {...props}
        />
    );
}
