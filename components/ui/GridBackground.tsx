import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
    className?: string;
    opacity?: number;
    size?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
    className,
    opacity = 0.05,
    size = 40
}) => {
    return (
        <div
            className={cn("absolute inset-0 pointer-events-none -z-10", className)}
            style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: `${size}px ${size}px`,
                opacity: opacity
            }}
            aria-hidden="true"
        />
    );
};
