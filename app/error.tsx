'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        // In a real app, this would send PII-stripped logs to Sentry/Datadog
        console.error("Global Error Boundary Caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-metal-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(255,0,0,0.1)]">

                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/20">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Algo salió mal
                    </h2>
                    <p className="text-metal-silver text-sm leading-relaxed">
                        Hemos detectado un error inesperado al procesar tu solicitud.
                        Nuestro equipo ha sido notificado automáticamente.
                    </p>
                    {/* Dev Info - Only visible if environment is NOT production ideally, 
                        but for now we hide details to comply with Audit */}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button
                        onClick={() => reset()}
                        variant="premium"
                        className="w-full"
                        icon={RefreshCcw}
                    >
                        Intentar nuevamente
                    </Button>

                    <Link href="/" className="block">
                        <Button
                            variant="outline"
                            className="w-full border-white/5 hover:bg-white/5 text-metal-silver"
                            icon={Home}
                        >
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>

                <div className="text-[10px] text-metal-silver/20 font-mono uppercase tracking-widest pt-4">
                    Error Digest: {error.digest || 'UNKNOWN_ERROR'}
                </div>
            </div>
        </div>
    );
}
