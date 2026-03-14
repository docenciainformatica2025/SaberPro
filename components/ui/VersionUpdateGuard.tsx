"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { APP_VERSION } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SystemConfig {
    latestVersion: string;
    criticalUpdate?: boolean;
    updateMessage?: string;
}

export default function VersionUpdateGuard({ children }: { children: React.ReactNode }) {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Listen to system configuration in real-time
        const configRef = doc(db, "config", "system");

        const unsubscribe = onSnapshot(configRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as SystemConfig;
                setConfig(data);

                // Compare versions
                if (data.latestVersion && data.latestVersion !== APP_VERSION) {
                    setUpdateAvailable(true);
                } else {
                    setUpdateAvailable(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (updateAvailable && !dismissed) {
            // Auto-update after a brief delay
            const timer = setTimeout(() => {
                handleUpdate();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateAvailable, dismissed]);

    const handleUpdate = () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }
        window.location.reload();
    };

    return (
        <>
            {children}

            <AnimatePresence>
                {updateAvailable && !dismissed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-theme-bg-base/80 backdrop-blur-md flex items-center justify-center p-6 text-center"
                    >
                        <div className="max-w-xs w-full space-y-6">
                            <div className="relative mx-auto w-20 h-20">
                                <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" />
                                <div className="relative bg-brand-primary/10 rounded-full w-full h-full flex items-center justify-center text-brand-primary">
                                    <Zap size={32} className="fill-brand-primary/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-theme-text-primary italic uppercase tracking-tight">
                                    Optimizando Experiencia
                                </h4>
                                <p className="text-xs text-theme-text-secondary font-medium leading-relaxed">
                                    Estamos aplicando las últimas mejoras de IA en tu entrenador personal. El proceso tardará solo unos segundos...
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-theme-bg-surface border border-theme-border-soft rounded-full">
                                    <RefreshCw size={14} className="text-brand-primary animate-spin" />
                                    <span className="text-[10px] font-bold text-theme-text-tertiary uppercase tracking-widest">
                                        Instalando v{config?.latestVersion}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
