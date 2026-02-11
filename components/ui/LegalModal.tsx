import { useEffect } from "react";
import { Button } from "./Button";
import { X } from "lucide-react";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, title, children }: LegalModalProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[var(--theme-bg-base)]/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--theme-bg-surface)] rounded-2xl border border-[var(--theme-border-soft)] shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)]/40">
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)] tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-[var(--theme-bg-base)]/10 hover:bg-[var(--theme-bg-base)]/20 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all transform hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar text-[var(--theme-text-secondary)]">
                    {children}
                </div>

                <div className="p-6 border-t border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)]/40 flex justify-end">
                    <Button
                        onClick={onClose}
                        variant="premium"
                        className="font-bold shadow-gold"
                    >
                        Entendido, volver a la aplicación
                    </Button>
                </div>
            </div>
        </div>
    );
}
