"use client";

import React, { useEffect, useState, useMemo } from 'react';
import {
    ArrowLeft,
    Share2,
    TrendingUp,
    Target,
    Flame,
    User,
    Brain,
    Rocket,
    Wand2,
    ChevronRight,
    Lock,
    Award,
    Zap,
    Sparkles,
    Loader2,
    Dna,
    Activity,
    Orbit
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { pdfGenerator } from '@/utils/pdfGenerator';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/types/finance';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function ProfileEvolutionPage() {
    const { user, profile, subscription, isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    
    const isPro = useMemo(() => {
        return subscription?.plan !== SubscriptionPlan.FREE || isSuperAdmin;
    }, [subscription?.plan, isSuperAdmin]);

    const [stats, setStats] = useState({
        hours: 0,
        flow: 0,
        streak: 0,
        xp: 0,
        simulationsCount: 0,
        radarData: [
            { subject: 'Pensamiento Crítico', A: 0, fullMark: 100 },
            { subject: 'Adaptabilidad', A: 0, fullMark: 100 },
            { subject: 'Liderazgo Estratégico', A: 0, fullMark: 100 },
            { subject: 'Empatía Digital', A: 0, fullMark: 100 },
            { subject: 'Solución de Problemas', A: 0, fullMark: 100 },
        ],
        growth: 0,
        focus: 'Cargando...'
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", user.uid),
                    orderBy("completedAt", "desc")
                );
                const snapshot = await getDocs(q);
                
                let totalScore = 0;
                let count = 0;
                let totalQuestions = 0;
                
                const skills = {
                    critical: { sum: 0, count: 0 },
                    adapt: { sum: 0, count: 0 },
                    leadership: { sum: 0, count: 0 },
                    empathy: { sum: 0, count: 0 },
                    problem: { sum: 0, count: 0 }
                };

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const score = (data.score / (data.totalQuestions || 1)) * 100;
                    totalScore += score;
                    totalQuestions += (data.totalQuestions || 0);
                    count++;

                    const type = data.type || 'general';
                    if (type === 'critical') skills.critical.sum += score;
                    else skills.critical.sum += score * 0.8;
                    skills.critical.count++;

                    skills.adapt.sum += score * (0.7 + Math.random() * 0.2);
                    skills.adapt.count++;
                    
                    skills.leadership.sum += score * (0.6 + Math.random() * 0.3);
                    skills.leadership.count++;

                    skills.empathy.sum += score * (0.75 + Math.random() * 0.15);
                    skills.empathy.count++;

                    skills.problem.sum += score * (0.85 + Math.random() * 0.1);
                    skills.problem.count++;
                });

                const avgFlow = count > 0 ? Math.round(totalScore / count) : 0;
                const totalHours = Math.round(totalQuestions * 0.05);

                let growthValue = 0;
                if (count > 1) {
                    const latestScore = (snapshot.docs[0].data().score / snapshot.docs[0].data().totalQuestions) * 100;
                    const previousAvg = (totalScore - latestScore) / (count - 1);
                    growthValue = Math.round(latestScore - previousAvg);
                }

                const radarData = [
                    { subject: 'Pensamiento Crítico', A: Math.round(skills.critical.sum / (skills.critical.count || 1)), fullMark: 100 },
                    { subject: 'Adaptabilidad', A: Math.round(skills.adapt.sum / (skills.adapt.count || 1)), fullMark: 100 },
                    { subject: 'Liderazgo Estratégico', A: Math.round(skills.leadership.sum / (skills.leadership.count || 1)), fullMark: 100 },
                    { subject: 'Empatía Digital', A: Math.round(skills.empathy.sum / (skills.empathy.count || 1)), fullMark: 100 },
                    { subject: 'Solución de Problemas', A: Math.round(skills.problem.sum / (skills.problem.count || 1)), fullMark: 100 },
                ];

                const focusArea = radarData.length > 0 ? [...radarData].sort((a, b) => a.A - b.A)[0].subject : 'N/A';

                setStats({
                    hours: totalHours,
                    flow: avgFlow,
                    streak: profile?.gamification?.streak?.current || 0,
                    xp: profile?.gamification?.xp || 0,
                    simulationsCount: count,
                    radarData,
                    growth: growthValue,
                    focus: focusArea
                });
            } catch (err) {
                console.error("Error fetching evolution stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, profile]);

    const handleGenerateCertificate = async () => {
        if (!user || !profile) return;

        if (!isPro) {
            toast.error("El certificado es una función exclusiva de la versión PRO.");
            return;
        }

        if (stats.simulationsCount === 0) {
            toast.error("Debes completar al menos un simulacro para generar tu certificado.");
            return;
        }

        setGeneratingPdf(true);
        try {
            const userName = profile.fullName || user.displayName || 'Estudiante';
            const level = `Nivel ${profile.gamification?.level || 1} - Solucionador Estratégico`;
            await pdfGenerator.generateAchievementCertificate(userName, level, stats.xp);
            toast.success("¡Certificado generado con éxito!");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el certificado.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--theme-bg-base)]">
                <Orbit className="w-12 h-12 text-brand-primary animate-spin opacity-20" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary/40 animate-pulse">Sincronizando ADN Digital</p>
            </div>
        );
    }

    const displayName = profile?.fullName || user?.displayName || "Estudiante";
    const userRole = profile?.targetCareer || "Líder en Crecimiento";

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 overflow-x-hidden selection:bg-brand-primary/20">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-30" />
            </div>

            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto px-6 py-12 space-y-12 relative z-10"
            >
                {/* Hero Header Section */}
                <motion.header 
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                >
                    <div className="space-y-2">
                        <Link href="/profile" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary/60 hover:text-brand-primary transition-all mb-4">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            VOLVER AL PERFIL
                        </Link>
                        <h1 className="text-5xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-none uppercase">
                            MI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">EVOLUCIÓN</span>
                        </h1>
                        <p className="text-xs text-[var(--theme-text-secondary)] opacity-60 font-medium tracking-wide">Analítica avanzada de crecimiento cognitivo y profesional.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-10 px-4 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-overlay)] transition-all flex items-center gap-2">
                            <Share2 size={14} /> COMPARTIR
                        </button>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Identity & Core Stats */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Identity Card */}
                        <motion.section 
                            variants={itemVariants}
                            className="bg-gradient-to-br from-[var(--theme-bg-surface)] to-[var(--theme-bg-base)] rounded-[2.5rem] p-10 border border-[var(--theme-border-soft)] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            <div className="relative z-10 flex flex-col items-center text-center gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-2 border-brand-primary/20 p-1.5 shadow-[0_0_40px_rgba(30,64,175,0.05)] bg-[var(--theme-bg-surface)]">
                                        <img
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`}
                                        />
                                    </div>
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.5 }}
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--theme-text-primary)] px-4 py-1 rounded-full flex items-center gap-2 shadow-xl border border-white/10"
                                    >
                                        <Dna className="w-3 h-3 text-brand-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-bg-base)]">Lvl {profile?.gamification?.level || 1}</span>
                                    </motion.div>
                                </div>
                                
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-tight uppercase">{displayName}</h2>
                                    <p className="text-brand-primary font-bold text-[9px] uppercase tracking-[0.4em] opacity-80">{userRole}</p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-[var(--theme-divider)]">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-none">{stats.hours}</p>
                                        <p className="text-[8px] text-[var(--theme-text-tertiary)] uppercase font-black tracking-widest leading-none mt-1">Horas de Maestría</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-brand-primary tracking-tightest leading-none">{stats.flow}%</p>
                                        <p className="text-[8px] text-[var(--theme-text-tertiary)] uppercase font-black tracking-widest leading-none mt-1">Estado de Flow</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGenerateCertificate}
                                    disabled={generatingPdf}
                                    className={`mt-6 w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl ${
                                        isPro && stats.simulationsCount > 0 
                                            ? 'bg-[var(--theme-text-primary)] text-[var(--theme-bg-base)]' 
                                            : 'bg-[var(--theme-bg-surface)] text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)] opacity-80'
                                    } disabled:opacity-50`}
                                >
                                    {generatingPdf ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : !isPro ? (
                                        <Lock className="w-4 h-4" />
                                    ) : stats.simulationsCount === 0 ? (
                                        <Target className="w-4 h-4" />
                                    ) : (
                                        <Award className="w-4 h-4" />
                                    )}
                                    {generatingPdf ? 'GENERANDO...' : 
                                     !isPro ? 'EXCLUSIVO PRO' : 
                                     stats.simulationsCount === 0 ? 'REALIZA UN SIMULACRO' : 
                                     'DESCARGAR CERTIFICADO'}
                                </button>
                            </div>
                        </motion.section>

                        {/* Growth Highlights */}
                        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--theme-bg-surface)] p-6 rounded-[2rem] border border-[var(--theme-border-soft)] space-y-4 shadow-sm hover:border-brand-primary/30 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-1">Mayor Impulso</p>
                                    <p className="text-[11px] font-black uppercase text-[var(--theme-text-primary)]">Crítico (+24%)</p>
                                </div>
                            </div>
                            <div className="bg-[var(--theme-bg-surface)] p-6 rounded-[2rem] border border-[var(--theme-border-soft)] space-y-4 shadow-sm hover:border-blue-500/30 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-1">En Enfoque</p>
                                    <p className="text-[11px] font-black uppercase text-[var(--theme-text-primary)]">{stats.focus}</p>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* RIGHT COLUMN: Competency Map & Journey */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Radar Chart Section */}
                        <motion.section 
                            variants={itemVariants}
                            className="bg-[var(--theme-bg-surface)] rounded-[2.5rem] p-10 border border-[var(--theme-border-soft)] shadow-md relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">MAPA INTEGRAL</h3>
                                    <h4 className="text-xl font-black text-[var(--theme-text-primary)] uppercase tracking-tight">Arquitectura Cognitiva</h4>
                                </div>
                                <Activity className="text-brand-primary opacity-20" size={32} />
                            </div>

                            <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                                        <PolarGrid stroke="var(--theme-divider)" strokeOpacity={0.5} />
                                        <PolarAngleAxis 
                                            dataKey="subject" 
                                            tick={{ fill: 'var(--theme-text-tertiary)', fontSize: 9, fontWeight: 900 }} 
                                        />
                                        <PolarRadiusAxis 
                                            angle={90} 
                                            domain={[0, 100]} 
                                            tick={false} 
                                            axisLine={false} 
                                        />
                                        <Radar
                                            name="ADN Digital"
                                            dataKey="A"
                                            stroke="var(--brand-primary)"
                                            strokeWidth={3}
                                            fill="var(--brand-primary)"
                                            fillOpacity={0.15}
                                            animationBegin={300}
                                            animationDuration={2000}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>

                                {/* Center Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary rounded-full blur-xl opacity-20 animate-pulse pointer-events-none" />
                            </div>

                            <div className="mt-10 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {stats.radarData.map((d, i) => (
                                    <div key={i} className="flex-shrink-0 bg-[var(--theme-bg-base)] px-4 py-2 rounded-xl border border-[var(--theme-border-soft)]">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-1">{d.subject}</p>
                                        <p className="text-sm font-black text-brand-primary">{d.A}%</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Consistency Heatmap */}
                        <motion.section 
                            variants={itemVariants}
                            className="bg-[var(--theme-bg-surface)] rounded-[2.5rem] p-8 border border-[var(--theme-border-soft)] relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1 flex items-center gap-2">
                                        RACHA ACTIVA <Activity size={10} />
                                    </p>
                                    <h4 className="text-3xl font-black text-[var(--theme-text-primary)] uppercase leading-none">
                                        {stats.streak} {stats.streak === 1 ? 'DÍA' : 'DÍAS'} DE FLUJO
                                    </h4>
                                </div>
                                <Flame className={`w-12 h-12 ${stats.streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-300 opacity-20'}`} />
                            </div>

                            <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
                                {[...Array(28)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.02) }}
                                        className={`aspect-square rounded-lg border border-black/5 dark:border-white/5 ${
                                            [0, 3, 14, 15, 20].includes(i) ? 'bg-orange-500/10' :
                                            [1, 18].includes(i) ? 'bg-orange-500/20' :
                                            [2, 16, 19].includes(i) ? 'bg-orange-500/40' :
                                            [4, 9, 17, 21].includes(i) ? 'bg-orange-500/60' :
                                            [5, 8, 22, 26].includes(i) ? 'bg-orange-500/80' :
                                            [6, 7, 11, 12, 13, 24, 25].includes(i) ? 'bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]' :
                                            'bg-[var(--theme-bg-base)]'
                                        }`}
                                    />
                                ))}
                            </div>
                        </motion.section>

                        {/* Mindset Transformation */}
                        <motion.section 
                            variants={itemVariants}
                            className="bg-brand-primary rounded-[2.5rem] p-10 text-[var(--theme-bg-base)] shadow-2xl relative overflow-hidden"
                        >
                            <Sparkles className="absolute top-[-20px] left-[-20px] w-40 h-40 opacity-10 rotate-12" />
                            
                            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-60 mb-8 text-center">Transformación Genética</h3>
                            
                            <div className="relative flex justify-between items-center px-4 mb-12">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/10 -translate-y-1/2" />
                                <div className="absolute top-1/2 left-0 w-3/4 h-0.5 bg-[var(--theme-bg-base)] -translate-y-1/2" />

                                {[
                                    { icon: User, label: "Aprendiz", active: true },
                                    { icon: Brain, label: "Curiosidad", active: true },
                                    { icon: Rocket, label: "Solucionador", active: true, pulse: true },
                                    { icon: Wand2, label: "Arquitecto", active: false }
                                ].map((step, idx) => (
                                    <div key={idx} className={`relative z-10 flex flex-col items-center gap-3 transition-all ${!step.active ? 'opacity-30' : 'opacity-100'}`}>
                                        <div className={`w-12 h-12 rounded-full border-4 border-brand-primary flex items-center justify-center ${step.active ? 'bg-[var(--theme-bg-base)] shadow-lg' : 'bg-brand-primary/20'}`}>
                                            <step.icon className={`w-5 h-5 ${step.active ? 'text-brand-primary' : 'text-[var(--theme-bg-base)]'}`} />
                                            {step.pulse && <span className="absolute inset-0 rounded-full border border-[var(--theme-bg-base)] animate-ping opacity-30" />}
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-none">{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--theme-bg-base)]/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <p className="text-sm font-bold italic leading-relaxed text-center">
                                    "Tu capacidad para conectar conceptos complejos ha mejorado un <span className="text-white bg-black/20 px-2 py-0.5 rounded-lg">40%</span> este trimestre."
                                </p>
                            </div>
                        </motion.section>

                        {/* Milestones */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--theme-text-tertiary)] px-4">SIGUIENTES HITOS</h3>
                            <div className="grid gap-4">
                                <div className="bg-[var(--theme-bg-surface)] p-6 rounded-[2rem] border border-[var(--theme-border-soft)] flex items-center gap-6 group hover:border-brand-primary transition-all cursor-pointer">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-105 transition-all">
                                        <Award size={28} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-sm font-black text-[var(--theme-text-primary)] uppercase tracking-tight">LIDERAZGO 4.0</h4>
                                            <span className="text-[9px] font-black text-brand-primary">72%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[var(--theme-bg-base)] rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '72%' }}
                                                transition={{ duration: 2, ease: 'easeOut' }}
                                                className="h-full bg-brand-primary rounded-full shadow-[0_0_10px_rgba(var(--brand-primary),0.5)]" 
                                            />
                                        </div>
                                    </div>
                                    <ChevronRight className="text-[var(--theme-text-tertiary)] group-hover:translate-x-1 transition-transform" />
                                </div>

                                <div className="bg-[var(--theme-bg-surface)] p-6 rounded-[2rem] border border-[var(--theme-border-soft)] flex items-center gap-6 group opacity-60">
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center text-[var(--theme-text-tertiary)]">
                                        <Zap size={28} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="text-sm font-black text-[var(--theme-text-primary)] uppercase tracking-tight">ARQUITECTO DE IA</h4>
                                        <p className="text-[9px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">DESBLOQUEAR A LAS 50H</p>
                                    </div>
                                    <Lock size={20} className="text-[var(--theme-text-tertiary)]" />
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </motion.main>
        </div>
    );
}
