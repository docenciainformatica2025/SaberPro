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
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertTriangle size={48} className="text-red-500" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight">
                        Error de <span className="text-red-500">Sistema</span>
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] text-lg">
                        Ha ocurrido un error inesperado. Nuestros ingenieros han sido notificados.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => reset()}
                        className="metallic-btn bg-white text-black font-semibold py-4 rounded-xl hover:scale-[1.02] transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={16} /> Reintentar Operación
                    </button>
                    <Link href="/" className="block">
                        <button
                            className="w-full text-[var(--theme-text-tertiary)] hover:text-red-400 transition-colors flex items-center gap-2 justify-center text-sm font-bold uppercase tracking-wider"
                        >
                            <Home size={16} /> Volver al Inicio
                        </button>
                    </Link>
                </div>

                <div className="text-[10px] text-[var(--theme-text-tertiary)] font-mono uppercase tracking-wider pt-4 opacity-30">
                    Error Digest: {error.digest || 'UNKNOWN_ERROR'}
                </div>
            </div>
        </div>
    );
}
