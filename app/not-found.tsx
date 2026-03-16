"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ArrowLeft, Sparkles, Brain, Search, BookOpen, MessageCircle, Zap, Compass, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const quickLinks = [
        { icon: LayoutDashboardIcon, label: "Panel", href: "/dashboard", color: "text-brand-primary" },
        { icon: Zap, label: "Simulación", href: "/simulation", color: "text-blue-400" },
        { icon: BookOpen, label: "Biblioteca", href: "/library", color: "text-purple-400" },
        { icon: MessageCircle, label: "Soporte", href: "/support", color: "text-emerald-400" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--theme-bg-base)] p-6 text-center relative overflow-hidden selection:bg-brand-primary/20">

            {/* --- CORE DESIGN SYSTEM: BACKGROUND ARCHITECTURE --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Dynamic Surface Fog */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--brand-primary-rgb),0.03)_0%,transparent_70%)]" />

                {/* Animated Orbital Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
                />

                {/* Stardust Grid Interaction */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* --- HERO: THE 3D GLITCH 404 --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mb-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative group cursor-none">
                    {/* Main Shadow Typography */}
                    <h1 className="text-[140px] md:text-[220px] font-black tracking-tighter leading-none select-none opacity-5 blur-sm transition-all duration-700 group-hover:blur-md">
                        404
                    </h1>

                    {/* The "Golden Glitch" Layer */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h1 className="text-[140px] md:text-[220px] font-black tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-brand-primary via-yellow-500 to-brand-primary drop-shadow-[0_20px_50px_rgba(var(--brand-primary-rgb),0.3)] filter contrast-125">
                            404
                        </h1>
                    </motion.div>

                    {/* Interactive Compass Icon Overlay */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 2, ease: "anticipate" }}
                    >
                        <Compass size={48} strokeWidth={1} className="text-brand-primary/40 animate-pulse" />
                    </motion.div>
                </div>

                {/* Status Indicator Pill */}
                <div className="mt-[-20px] relative z-30">
                    <Badge variant="premium" className="px-6 py-2 rounded-2xl shadow-premium border-white/20 backdrop-blur-xl scale-110">
                        <RefreshCw size={10} className="mr-2 animate-spin-slow" /> RUTA NO ENCONTRADA
                    </Badge>
                </div>
            </motion.div>

            {/* --- CONTENT ARCHITECTURE --- */}
            <div className="relative z-20 space-y-10 max-w-4xl mx-auto px-4">
                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl font-black text-[var(--theme-text-primary)] tracking-tight italic"
                    >
                        Has llegado a un <span className="text-brand-primary">punto muerto</span> cognitivo.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[var(--theme-text-secondary)] text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed border-l-2 border-brand-primary/20 pl-6"
                    >
                        La página que buscas ha sido reubicada o eliminada del sistema.
                        No te preocupes, tu progreso sigue intacto en los módulos principales.
                    </motion.p>
                </div>

                {/* Quick Navigation Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {quickLinks.map((link, i) => (
                        <Link key={i} href={link.href}>
                            <div className="bg-[var(--theme-bg-surface)]/40 backdrop-blur-sm border border-[var(--theme-border-soft)] rounded-3xl p-6 hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group active:scale-95">
                                <link.icon className={`${link.color} mx-auto mb-3 transition-transform group-hover:scale-110 group-hover:rotate-6`} size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] group-hover:text-brand-primary">{link.label}</span>
                            </div>
                        </Link>
                    ))}
                </motion.div>

                {/* Footer Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4"
                >
                    <Link href="/dashboard">
                        <Button
                            variant="maestro"
                            size="lg"
                            className="h-16 px-10 rounded-2xl shadow-4k animate-shimmer"
                            icon={Home}
                        >
                            RETOMAR ENTRENAMIENTO
                        </Button>
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="group py-3 px-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        VOLVER AL ESTADO ANTERIOR
                    </button>
                </motion.div>
            </div>

            {/* Ambient Particles Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-20, -100],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-brand-primary rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            bottom: `-10%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

const LayoutDashboardIcon = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

const Badge = ({ children, className, variant = "default" }: any) => {
    const variants: any = {
        default: "bg-[var(--theme-bg-surface)] text-[var(--theme-text-secondary)] border-[var(--theme-border-soft)]",
        premium: "bg-brand-primary text-white border-brand-primary shadow-sm",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-[0.15em] transition-all duration-300 ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
