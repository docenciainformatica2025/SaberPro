"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-surface-card group-[.toaster]:text-theme-text-primary group-[.toaster]:border-theme-border-soft group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans",
                    description: "group-[.toast]:text-theme-text-secondary font-medium",
                    actionButton:
                        "group-[.toast]:bg-brand-primary group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-theme-bg-base group-[.toast]:text-theme-text-secondary",
                    success: "group-[.toast]:text-brand-success",
                    error: "group-[.toast]:text-brand-error",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
