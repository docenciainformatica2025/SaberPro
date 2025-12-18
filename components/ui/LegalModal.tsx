import { X } from "lucide-react";
import { useEffect } from "react";

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0F0F0F] rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-metal-silver hover:text-white transition-all transform hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-metal-gold transition-colors text-sm"
                    >
                        Entendido, volver a la aplicación
                    </button>
                </div>
            </div>
        </div>
    );
}
