"use client";

import Link from "next/link";
import { Home, ArrowLeft, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 text-center relative overflow-hidden">

            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-metal-gold/5 rounded-full blur-[120px] opacity-50 animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
            </div>

            {/* Floating Portal Centerpiece */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 mb-12"
            >
                <div className="relative w-64 h-64 md:w-96 md:h-96">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 2, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Image
                            src="/assets/images/lost_in_knowledge_404.png"
                            alt="Conocimiento Perdido"
                            width={500}
                            height={500}
                            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.3)] select-none pointer-events-none"
                        />
                    </motion.div>

                    {/* Glowing Error Code */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-metal-gold to-metal-copper drop-shadow-2xl select-none opacity-90 italic uppercase">
                            404
                        </h1>
                    </motion.div>
                </div>
            </motion.div>

            {/* Content Section */}
            <div className="relative z-20 space-y-8 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-4">
                        Has entrado en un <span className="text-metal-gold">Vacío Digital</span>
                    </h2>
                    <p className="text-metal-silver/60 text-lg md:text-xl font-light leading-relaxed">
                        Parece que el conocimiento que buscas se ha desvanecido en el laberinto de la plataforma.
                        No te preocupes, el camino al éxito sigue abierto.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4"
                >
                    <Link href="/dashboard">
                        <Button
                            variant="premium"
                            size="lg"
                            icon={Home}
                            className="px-10 h-14 text-xs font-black tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)]"
                        >
                            REGRESAR AL DASHBOARD
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-3 text-metal-silver hover:text-white transition-all text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white/5 active:scale-95 border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Volver Atrás
                    </button>
                </motion.div>

                {/* Footer Micro-details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 2 }}
                    className="flex items-center justify-center gap-4 text-[10px] text-metal-silver font-bold tracking-[0.3em] uppercase pt-12"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-metal-gold" />
                        SABER PRO ELITE
                    </div>
                    <div className="w-1 h-1 rounded-full bg-metal-silver" />
                    <div className="flex items-center gap-2">
                        <Brain size={12} />
                        COGNITIVE RECOVERY MODE
                    </div>
                </motion.div>
            </div>

            {/* Interactive Corner Effects */}
            <div className="fixed bottom-0 right-0 p-12 pointer-events-none opacity-20">
                <div className="w-64 h-64 border border-metal-gold/20 rounded-full scale-150 rotate-45 -mr-32 -mb-32 blur-3xl" />
            </div>
        </div>
    );
}
