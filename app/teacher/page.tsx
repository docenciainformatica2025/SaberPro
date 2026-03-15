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
        { title: "Misiones Asignadas", value: 0, trend: "Real-time", trendUp: true, icon: <Clock />, color: "purple" as const },
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

                // 2. Students Count & Scores
                const classDocs = await getDocs(qClasses);
                const classIds = classDocs.docs.map(d => d.id);

                let totalStudents = 0;
                let sumPercentages = 0;
                let countWithScores = 0;

                if (classIds.length > 0) {
                    // Fetch members for these classes (limit to 10 classes as per Firestore IN limit)
                    const qMembers = query(collection(db, "class_members"), where("classId", "in", classIds.slice(0, 10)));
                    const membersSnap = await getDocs(qMembers);
                    totalStudents = membersSnap.size;

                    membersSnap.forEach(doc => {
                        const data = doc.data();
                        if (data.lastScore !== undefined && data.lastTotalQuestions > 0) {
                            sumPercentages += (data.lastScore / data.lastTotalQuestions) * 100;
                            countWithScores++;
                        }
                    });
                }

                // 3. Assignments Count
                const qAssignments = query(collection(db, "assignments"), where("teacherId", "==", user.uid), where("isActive", "==", true));
                const assignmentsSnap = await getCountFromServer(qAssignments);
                const assignmentCount = assignmentsSnap.data().count;

                const avgGlobal = countWithScores > 0 ? Math.round((sumPercentages / countWithScores) * 3) : 0;

                setStats([
                    { title: "Estudiantes Activos", value: totalStudents, trend: "Desde tus clases", trendUp: true, icon: <Users />, color: "blue" as const },
                    { title: "Clases Creadas", value: classCount, trend: "En meta", trendUp: true, icon: <BookOpen />, color: "blue" as const },
                    { title: "Promedio Global", value: avgGlobal, trend: avgGlobal > 200 ? "+4.2%" : "Analizando", trendUp: true, icon: <TrendingUp />, color: "green" as const },
                    { title: "Misiones Asignadas", value: assignmentCount, trend: "Sincronizado", trendUp: true, icon: <Clock />, color: "purple" as const },
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
            {/* Header - Maestro Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[9px] font-black tracking-[0.2em] uppercase shadow-sm">
                        Sistema Sincronizado v4.1 • Pro
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl md:text-7xl font-academic font-bold text-[var(--theme-text-primary)] tracking-tight leading-none">
                            Hola de nuevo, <span className="text-theme-hero italic">{teacherName}.</span>
                        </h1>
                        <p className="text-lg font-academic italic text-[var(--theme-text-secondary)] opacity-80">Respira hondo. Estás guiando el futuro.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/teacher/classes">
                        <Button variant="primary" size="lg" className="px-8 h-14 shadow-2xl shadow-brand-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] organic-border-reverse shimmer-gold kinesthetic-bounce" icon={Plus}>
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
                        className={i % 2 === 0 ? "organic-border" : "organic-border-reverse"}
                    />
                ))}
            </div>

            {/* Empty State / CTA - Maestro "Lighthouse" Style */}
            <Card variant="glass" className="p-20 text-center flex flex-col items-center justify-center min-h-[500px] border-[1px] border-[var(--theme-border-soft)] bg-white/40 backdrop-blur-3xl organic-border relative overflow-hidden group shadow-2xl shadow-black/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="w-32 h-32 bg-white rounded-full shadow-2xl shadow-brand-primary/10 flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 relative z-10 border border-brand-primary/5 floating-buoy">
                    <BookOpen size={56} className="text-brand-primary opacity-80" strokeWidth={1} />
                </div>

                <h3 className="text-4xl font-academic font-bold text-[var(--theme-text-primary)] mb-4 tracking-tight relative z-10">Tu Ecosistema de Saberes</h3>
                <p className="text-[var(--theme-text-secondary)] font-academic italic max-w-lg mx-auto mb-12 text-lg leading-relaxed opacity-60 relative z-10">
                    &quot;Un faro no corre por toda la isla buscando botes que salvar; simplemente permanece allí, brillando.&quot;
                </p>

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <Link href="/teacher/classes">
                        <Button variant="primary" size="lg" className="px-10 h-16 organic-border-reverse shadow-xl shadow-brand-primary/20 font-bold text-[10px] uppercase tracking-[0.2em] kinesthetic-bounce" icon={Plus}>Empezar Ahora</Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-10 h-16 organic-border font-bold text-[10px] uppercase tracking-[0.2em] border-[var(--theme-border-soft)] bg-white/50 hover:bg-white transition-all kinesthetic-bounce"
                        onClick={() => {
                            toast.info("Guía Rápida", {
                                description: "La clave está en la calma. Crea tu primera clase y deja que la IA se encargue del resto.",
                                icon: <Plus className="text-brand-primary" size={16} />
                            });
                        }}
                    >
                        Ver Filosofía
                    </Button>
                </div>
            </Card>
        </main>
    );
}
