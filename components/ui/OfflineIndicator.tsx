"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Definir estado inicial (si window existe)
        if (typeof window !== "undefined") {
            setIsOnline(navigator.onLine);
        }

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-metal-dark/90 backdrop-blur-md border border-red-500/30 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
                <WifiOff size={16} className="text-red-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Modo Offline (Datos Cacheados)</span>
            </div>
        </div>
    );
}
