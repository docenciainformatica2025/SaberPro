"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-metal-dark group-[.toaster]:text-white group-[.toaster]:border-metal-silver/20 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-metal-silver",
                    actionButton:
                        "group-[.toast]:bg-metal-gold group-[.toast]:text-black",
                    cancelButton:
                        "group-[.toast]:bg-metal-silver/10 group-[.toast]:text-metal-silver",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
