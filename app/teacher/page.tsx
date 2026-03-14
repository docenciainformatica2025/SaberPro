"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCardPremium } from "@/components/ui/StatCardPremium";
import PromotionBanner from "@/components/ui/PromotionBanner";
import { toast } from "sonner";
import { Info } from "lucide-react";

export default function TeacherDashboard() {
    const { user, profile, subscription } = useAuth();

    const [stats, setStats] = useState([
        { title: "Estudiantes Activos", value: 0, trend: "Sincronizado", trendUp: true, icon: <Users />, color: "blue" as const },
        { title: "Clases Creadas", value: 0, trend: "En meta", trendUp: true, icon: <BookOpen />, color: "blue" as const },
        { title: "Promedio Global", value: 0, trend: "Actualizando", trendUp: true, icon: <TrendingUp />, color: "green" as const },
        { title: "Horas de Práctica", value: 0, trend: "Real-time", trendUp: true, icon: <Clock />, color: "purple" as const },
    ]);

    useEffect(() => {
        async function fetchTeacherStats() {
            if (!user) return;
            try {
                const { collection, query, where, getDocs, getCountFromServer } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // 1. Classes Count
                const qClasses = query(collection(db, "classrooms"), where("teacherId", "==", user.uid));
                const classesSnap = await getCountFromServer(qClasses);
                const classCount = classesSnap.data().count;

                // 2. Students Count (Across all classes)
                // Need to fetch classes first, then members
                const classDocs = await getDocs(qClasses);
                const classIds = classDocs.docs.map(d => d.id);

                let totalStudents = 0;
                if (classIds.length > 0) {
                    // Firestore 'in' limit is 10, but usually teachers don't have > 10 classes in this v1
                    // For safety, loop or just query all members with classId in restricted list
                    const qMembers = query(collection(db, "class_members"), where("classId", "in", classIds.slice(0, 10)));
                    const membersSnap = await getCountFromServer(qMembers);
                    totalStudents = membersSnap.data().count;
                }

                setStats([
                    { title: "Estudiantes Activos", value: totalStudents, trend: "Desde tus clases", trendUp: true, icon: <Users />, color: "blue" as const },
                    { title: "Clases Creadas", value: classCount, trend: "En meta", trendUp: true, icon: <BookOpen />, color: "blue" as const },
                    { title: "Promedio Global", value: 0, trend: "Próximamente", trendUp: true, icon: <TrendingUp />, color: "green" as const },
                    { title: "Horas de Práctica", value: 0, trend: "Sincronizado", trendUp: true, icon: <Clock />, color: "purple" as const },
                ]);

            } catch (err) {
                console.error("Error fetching teacher stats:", err);
            }
        }
        fetchTeacherStats();
    }, [user]);

    const teacherName = profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Profe";

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PromotionBanner />
            {/* Header - Unified Elite Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
                        Panel Docente v4.0.0
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl md:text-7xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-none">
                            ¡HOLA, <span className="text-theme-hero italic uppercase">{teacherName}</span>! 👋
                        </h1>
                        <p className="text-xs font-medium text-slate-400 tracking-widest uppercase ml-1">El pulso de tus clases en tiempo real</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/teacher/classes">
                        <Button variant="primary" size="lg" className="px-8 h-14 shadow-2xl shadow-brand-primary/20 text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl shimmer-gold" icon={Plus}>
                            Nueva Clase
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCardPremium
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        trendUp={stat.trendUp}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* PRO Upgrade Card (Visible to non-pro) */}
            {profile?.role === 'teacher' && subscription?.plan !== 'pro' && (
                <Card variant="primary" className="p-8 bg-brand-primary/5 border border-brand-primary/10 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-brand-primary tracking-tight mb-2">Potencia tu enseñanza con herramientas Pro</h3>
                            <p className="text-theme-text-secondary font-medium max-w-xl">
                                Obtén reportes detallados por estudiante, descarga de resultados en PDF masivos y soporte prioritario 24/7.
                            </p>
                        </div>
                        <Link href="/pricing" className="shrink-0">
                            <Button variant="primary" className="px-8 h-12 font-bold tracking-wider shadow-md shadow-brand-primary/10">
                                Actualizar a Pro
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Empty State / CTA - Enhanced Premium Style */}
            <Card variant="glass" className="p-20 text-center flex flex-col items-center justify-center min-h-[500px] border-[3px] border-dashed border-brand-primary/5 bg-brand-primary/[0.01] rounded-[3rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 flex items-center justify-center mb-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 relative z-10 border border-brand-primary/5">
                    <BookOpen size={56} className="text-brand-primary" strokeWidth={1.5} />
                </div>

                <h3 className="text-3xl font-black text-theme-text-primary mb-4 tracking-tightest uppercase relative z-10">Tu Ecosistema de Enseñanza</h3>
                <p className="text-theme-text-tertiary max-w-lg mx-auto mb-12 text-sm font-medium leading-relaxed opacity-60 relative z-10 uppercase tracking-widest">
                    Digitaliza tus clases y desbloquea el potencial real de tus estudiantes con el análisis IA más avanzado.
                </p>

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <Link href="/teacher/classes">
                        <Button variant="primary" size="lg" className="px-10 h-16 rounded-2xl shadow-xl shadow-brand-primary/20 font-black text-[11px] uppercase tracking-[0.2em] shimmer-gold" icon={Plus}>Empezar Ahora</Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-10 h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-all"
                        onClick={() => {
                            toast.info("¡Estamos listos para ayudarte!", {
                                description: "1. Crea una clase. 2. Comparte el código. 3. Observa cómo tus estudiantes brillan.",
                                icon: <Info className="text-brand-primary" size={16} />
                            });
                        }}
                    >
                        Ver Guía Rápida
                    </Button>
                </div>
            </Card>
        </main>
    );
}
