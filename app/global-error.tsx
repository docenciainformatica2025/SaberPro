"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-black text-white min-h-screen flex items-center justify-center font-sans">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500 w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Algo salió mal.</h2>
                    <p className="text-gray-400 mb-8">
                        Ha ocurrido un error crítico en la aplicación. Nuestro equipo ha sido notificado.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <RefreshCw size={18} /> Intentar de nuevo
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Home size={18} /> Volver al Inicio
                        </Link>
                    </div>

                    {error.digest && (
                        <p className="mt-8 text-xs text-gray-600 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
