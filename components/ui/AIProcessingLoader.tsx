import { Brain, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIProcessingLoaderProps {
    text?: string;
    subtext?: string;
}

export default function AIProcessingLoader({
    text = "Analizando tu respuesta...",
    subtext = "Consultando base de conocimientos y generando retroalimentación personalizada."
}: AIProcessingLoaderProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-8 space-y-6 w-full"
        >
            <div className="relative">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-t-brand-primary border-r-transparent border-b-brand-primary border-l-transparent animate-spin duration-[2s] w-24 h-24 blur-[1px]"></div>

                {/* Inner pulsing circle */}
                <div className="w-24 h-24 rounded-full bg-brand-primary/5 flex items-center justify-center relative overflow-hidden ring-1 ring-brand-primary/20 shadow-[var(--theme-accent-gold-soft)]">
                    {/* Brain icon pulsing */}
                    <Brain className="w-10 h-10 text-brand-primary animate-pulse relative z-10" />

                    {/* Scanning effect */}
                    <div className="absolute top-0 w-full h-full bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent animate-scan" style={{ animationDuration: '1.5s' }}></div>
                </div>

                {/* Satellite particles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-metal-blue animate-bounce" />
                    </div>
                </motion.div>

                <div className="absolute -bottom-2 -left-2">
                    <Zap className="w-5 h-5 text-purple-400 animate-pulse delay-75" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-primary animate-shimmer bg-[size:200%_100%] uppercase tracking-tight">
                    {text}
                </h3>
                <p className="text-xs text-[var(--theme-text-secondary)]/60 max-w-[240px] mx-auto font-medium lowercase tracking-wide">
                    {subtext}
                </p>
            </div>
        </motion.div>
    );
}
