"use client";

import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Activity, 
    Zap, 
    Target, 
    Brain, 
    ArrowRight,
    Sparkles,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

// Distinctive Font System (as per Skill)
// Using Inter for data and a custom look for display

export default function PulseCenter() {
    const { user, profile } = useAuth();
    const [scorePulse, setScorePulse] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        readiness: 0,
        logic: 0,
        focus: 0,
        predictedScore: 0
    });

    useEffect(() => {
        if (!user) return;

        const fetchPulse = async () => {
            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", user.uid),
                    orderBy("timestamp", "desc"),
                    limit(5)
                );
                const snapshot = await getDocs(q);
                
                if (!snapshot.empty) {
                    let total = 0;
                    snapshot.docs.forEach(doc => {
                        const d = doc.data();
                        total += (d.score / d.totalQuestions) * 100;
                    });
                    const avg = Math.round(total / snapshot.size);
                    setScorePulse(avg);
                    
                    // Artificial Intelligence Prediction Logic (Simulation)
                    setStats({
                        readiness: Math.min(avg + 5, 98),
                        logic: Math.min(avg - 2, 95),
                        focus: 85,
                        predictedScore: Math.round((avg / 100) * 500)
                    });
                } else {
                    setScorePulse(0);
                }
            } catch (err) {
                console.error("Pulse Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPulse();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#08090A] text-white selection:bg-brand-primary/30 selection:text-brand-primary overflow-x-hidden font-sans">
            {/* Ambient Background - The "Void" */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-success/5 blur-[100px] rounded-full [animation-delay:2s] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-8 flex justify-between items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all duration-500">
                            <ChevronLeft size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Volver</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-end"
                >
                    <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.4em] mb-1">Status</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-success animate-ping" />
                        <span className="text-xs font-bold font-mono">NEURAL_SYNC_OK</span>
                    </div>
                </motion.div>
            </header>

            <main className="relative z-10 px-8 pt-4 pb-24 max-w-lg mx-auto overflow-visible">
                {/* Titles - Bold Editorial Style */}
                <div className="mb-16">
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] mb-4"
                    >
                        Predictive Analysis
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-academic italic leading-tight tracking-tighter text-[var(--theme-text-primary)]"
                    >
                        El Pulso del <br />
                        <span className="text-white/20">Éxito Académico</span>
                    </motion.h1>
                </div>

                {/* THE PULSE - Differential Hero Component */}
                <div className="relative flex justify-center mb-24 py-12 overflow-visible">
                    {/* Ornamental Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-80 h-80 rounded-full border border-dashed border-white/5" 
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-64 h-64 rounded-full border border-white/5" 
                        />
                    </div>

                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        {/* The Orb */}
                        <div className="relative w-56 h-56 rounded-full flex items-center justify-center">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.6, 0.8, 0.6],
                                    boxShadow: [
                                        "0 0 40px rgba(var(--brand-primary-rgb), 0.2)",
                                        "0 0 80px rgba(var(--brand-primary-rgb), 0.4)",
                                        "0 0 40px rgba(var(--brand-primary-rgb), 0.2)"
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-brand-primary opacity-20 rounded-full blur-2xl" 
                            />
                            
                            <div className="relative z-20 text-center">
                                <motion.span 
                                    key={stats.predictedScore}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="block text-7xl font-academic font-medium tracking-tighter"
                                >
                                    {loading ? "---" : stats.predictedScore}
                                </motion.span>
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] block mt-2">
                                    Puntaje Estimado
                                </span>
                            </div>
                        </div>

                        {/* Floating Labels */}
                        <div className="absolute top-0 -right-8 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                            <span className="text-[9px] font-bold tracking-widest">+5% Este Mes</span>
                        </div>
                    </motion.div>
                </div>

                {/* Metrics Grid - Grid Breaking Layout */}
                <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden mb-12">
                    {[
                        { label: "Readiness", value: stats.readiness + "%", icon: Zap, color: "text-brand-primary" },
                        { label: "Logic Flow", value: stats.logic + "%", icon: Brain, color: "text-blue-400" },
                        { label: "Stability", value: "92%", icon: Activity, color: "text-brand-success" },
                        { label: "Target", value: "Superior", icon: Target, color: "text-brand-accent" }
                    ].map((m, i) => (
                        <motion.div 
                            key={m.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-[#08090A] p-8 hover:bg-white/[0.02] transition-colors group"
                        >
                            <m.icon size={20} className={cn("mb-4 transition-transform duration-500 group-hover:scale-110", m.color)} />
                            <span className="block text-2xl font-academic font-medium mb-1">{m.value}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{m.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* The "Differential" Insight Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="relative group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-transparent opacity-10 rounded-[2.5rem] blur-xl group-hover:opacity-20 transition-opacity" />
                    <div className="relative bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles size={120} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary text-black flex items-center justify-center rotate-3">
                                <Sparkles size={24} />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-academic italic border-l-2 border-brand-primary pl-6 mb-4 leading-tight">
                                    "Tu capacidad analítica ha superado el percentil 90. Estás listo para el nivel Maestro."
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed max-w-xs font-medium">
                                    Basado en tus últimos simulacros, la IA sugiere enfocarse en Lectura Crítica para romper la barrera de los 450 puntos.
                                </p>
                            </div>

                            <button className="flex items-center gap-4 text-brand-primary font-black uppercase tracking-[0.2em] text-[10px] mt-4 group">
                                Iniciar Entrenamiento Maestro
                                <div className="w-8 h-8 rounded-full border border-brand-primary/30 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="mt-24 flex justify-between items-center opacity-20 px-4">
                    <span className="text-[8px] font-mono tracking-widest">SABERPRO_OS_v4.1.30</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 1, 2].map((v, i) => (
                            <div key={i} className="w-1 h-3 bg-white" style={{ height: `${v * 4}px` }} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
