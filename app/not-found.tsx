"use client";

import Link from "next/link";
import { Home, ArrowLeft, Sparkles, Brain, Search, BookOpen, MessageCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState("");

    const quickLinks = [
        { icon: Home, label: "Dashboard", href: "/dashboard", color: "text-metal-gold" },
        { icon: Zap, label: "Simulación", href: "/simulation", color: "text-blue-400" },
        { icon: BookOpen, label: "Recursos", href: "/methodology", color: "text-purple-400" },
        { icon: MessageCircle, label: "Soporte", href: "/support", color: "text-green-400" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-metal-black p-6 text-center relative overflow-hidden">

            {/* Enhanced Background with Neural Network Effect */}
            <div className="absolute inset-0 z-0">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-metal-gold/5 rounded-full blur-[120px] opacity-50 animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
            </div>

            {/* Floating 3D Brain Hologram */}
            {/* Pure CSS 3D "404" - No Background Image */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 mb-12 md:mb-16"
            >
                <div className="relative">
                    {/* Main 3D 404 Number */}
                    <motion.h1
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-[120px] md:text-[180px] lg:text-[240px] font-black tracking-tighter select-none"
                        style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFA500 50%, #D4AF37 75%, #FFD700 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
                            filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 80px rgba(212, 175, 55, 0.3))',
                        }}
                    >
                        404
                    </motion.h1>

                    {/* Glowing rings around 404 */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full border-2 border-metal-gold/20 animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full border border-metal-gold/30" />
                    </div>

                    {/* Orbiting particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-metal-gold rounded-full"
                            style={{
                                top: '50%',
                                left: '50%',
                            }}
                            animate={{
                                x: [0, Math.cos(i * Math.PI / 3) * 180, 0],
                                y: [0, Math.sin(i * Math.PI / 3) * 180, 0],
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.5, 1.2, 0.5]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Content Section with Enhanced Typography */}
            <div className="relative z-20 space-y-8 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="px-4"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic mb-4 leading-tight">
                        <span className="text-white">Tu conocimiento no se ha perdido,</span>{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-metal-gold to-yellow-500 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                            solo tomó un camino diferente
                        </span>
                    </h2>
                    <p className="text-metal-silver text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto px-4">
                        Cada error es una oportunidad para aprender algo nuevo.
                        <br className="hidden md:block" />
                        {" "}El camino al éxito sigue abierto.
                    </p>
                </motion.div>

                {/* Interactive Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="max-w-md mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver/40" size={20} />
                        <input
                            type="text"
                            placeholder="Busca lo que necesitas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
                                }
                            }}
                            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-metal-silver/40 focus:outline-none focus:border-metal-gold/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Quick Links Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                >
                    {quickLinks.map((link, i) => (
                        <Link key={i} href={link.href}>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-metal-gold/30 transition-all group cursor-pointer"
                            >
                                <link.icon className={`${link.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} size={24} />
                                <p className="text-xs font-bold text-metal-silver group-hover:text-white transition-colors uppercase tracking-wider">
                                    {link.label}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* Primary CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link href="/dashboard">
                        <Button
                            variant="premium"
                            size="lg"
                            icon={Home}
                            className="px-10 h-14 text-sm font-black tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]"
                        >
                            VOLVER AL ENTRENAMIENTO
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-3 text-metal-silver hover:text-white transition-all text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white/5 active:scale-95 border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Volver Atrás
                    </button>
                </motion.div>

                {/* Elite Footer Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 2 }}
                    className="flex items-center justify-center gap-4 text-[10px] text-metal-silver font-bold tracking-[0.3em] uppercase pt-8"
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

            {/* Decorative Corner Effects */}
            <div className="fixed bottom-0 right-0 p-12 pointer-events-none opacity-20">
                <div className="w-64 h-64 border border-metal-gold/20 rounded-full scale-150 rotate-45 -mr-32 -mb-32 blur-3xl" />
            </div>
        </div>
    );
}
