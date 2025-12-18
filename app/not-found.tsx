"use client";

import Link from "next/link";
import { AlertOctagon, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-metal-dark p-8 text-center relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-metal-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <AlertOctagon size={120} className="text-metal-gold opacity-20 absolute top-0 left-0 animate-pulse" />
                        <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-metal-gold to-metal-copper drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            404
                        </span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    Ruta no encontrada
                </h2>
                <p className="text-metal-silver/60 text-lg max-w-md mx-auto mb-12">
                    Parece que te has desviado del camino de aprendizaje. Esta página no existe en nuestra base de conocimientos.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 metallic-btn bg-metal-blue/10 hover:bg-metal-blue/20 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    <Home size={20} />
                    Regresar al Dashboard
                </Link>
            </div>
        </div>
    );
}
