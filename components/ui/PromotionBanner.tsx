"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Sparkles, X, Megaphone, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";

export default function PromotionBanner() {
    const [config, setConfig] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Real-time listener for system config
        const unsub = onSnapshot(doc(db, "system", "config"), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setConfig(data);
                // Only show if promo is active and not manually dismissed in this session
                if (data.monetization?.students?.promoActive && !dismissed) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        });
        return () => unsub();
    }, [dismissed]);

    if (!isVisible || !config) return null;

    const promoText = config.monetization?.students?.promoText || "Estamos contigo en cada paso de tu formación";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative bg-[var(--theme-bg-surface)] border-b border-[var(--theme-border-soft)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-brand-primary/[0.03] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
                            <Zap size={16} strokeWidth={2.5} className="animate-pulse" />
                        </div>
                        <p className="text-[10px] md:text-xs font-black text-[var(--theme-text-primary)] uppercase tracking-[0.15em] leading-none">
                            {promoText}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/pricing" className="hidden md:block">
                            <Button
                                variant="maestro"
                                size="sm"
                                className="h-8 md:h-9 px-5 rounded-full text-[9px] shadow-premium"
                            >
                                Obtener Beneficio
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsVisible(false);
                                setDismissed(true);
                            }}
                            icon={X}
                            className="text-[var(--theme-text-tertiary)] hover:text-brand-error hover:bg-brand-error/5"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
