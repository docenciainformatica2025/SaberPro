import { Brain, Sparkles, Zap } from "lucide-react";


interface AIProcessingLoaderProps {
    text?: string;
    subtext?: string;
}

export default function AIProcessingLoader({
    text = "Analizando tu respuesta...",
    subtext = "Consultando base de conocimientos y generando retroalimentación personalizada."
}: AIProcessingLoaderProps) {

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full">
            <div className="relative" suppressHydrationWarning>
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-t-metal-gold border-r-transparent border-b-metal-gold border-l-transparent animate-spin duration-[2s] w-24 h-24 blur-[1px]" suppressHydrationWarning></div>

                {/* Inner pulsing circle */}
                <div className="w-24 h-24 rounded-full bg-metal-gold/5 flex items-center justify-center relative overflow-hidden ring-1 ring-metal-gold/20">
                    {/* Brain icon pulsing */}
                    <Brain className="w-10 h-10 text-metal-gold animate-pulse relative z-10" />

                    {/* Scanning effect */}
                    <div className="absolute top-0 w-full h-full bg-gradient-to-b from-transparent via-metal-gold/10 to-transparent animate-scan" style={{ animationDuration: '1.5s' }}></div>
                </div>

                {/* Satellite particles */}
                <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-metal-blue animate-bounce" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                    <Zap className="w-5 h-5 text-purple-400 animate-pulse delay-75" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold animate-shimmer bg-[size:200%_100%]">
                    {text}
                </h3>
                <p className="text-xs text-metal-silver/60 max-w-[200px] mx-auto">
                    {subtext}
                </p>
            </div>
        </div>
    );
}
