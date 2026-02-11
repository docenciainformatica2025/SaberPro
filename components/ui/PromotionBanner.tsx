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
                className="relative bg-brand-primary overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-1.5 rounded-lg">
                            <Megaphone size={16} className="text-white" />
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-white uppercase tracking-tight italic flex items-center gap-2">
                            <Sparkles size={14} className="animate-bounce" /> {promoText}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/pricing" className="hidden md:block">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Zap}
                                className="bg-white text-brand-primary hover:bg-white/90 border-none shadow-sm text-[10px]"
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
                            className="text-white hover:bg-white/10"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
