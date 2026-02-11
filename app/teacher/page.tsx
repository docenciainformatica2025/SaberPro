"use client";

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

    const stats = [
        { title: "Estudiantes Activos", value: 125, trend: "+4% hoy", trendUp: true, icon: <Users />, color: "blue" as const },
        { title: "Clases Creadas", value: 8, trend: "En meta", trendUp: true, icon: <BookOpen />, color: "blue" as const },
        { title: "Promedio Global", value: 375, trend: "+12 pts", trendUp: true, icon: <TrendingUp />, color: "green" as const },
        { title: "Horas de Práctica", value: 1240, trend: "Estable", trendUp: true, icon: <Clock />, color: "purple" as const },
    ];

    const teacherName = profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Profe";

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PromotionBanner />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-theme-hero mb-2 flex items-center gap-3 text-balance tracking-tighter uppercase italic">
                        ¡Qué bueno verte, {teacherName}! 👋
                        {profile?.role === 'teacher' && <Badge variant="primary" className="text-[10px] font-semibold tracking-wider px-3 py-1 bg-brand-primary text-[var(--theme-bg-base)] border-none normal-case">Pro</Badge>}
                    </h1>
                    <p className="text-theme-text-secondary">
                        Tus estudiantes están progresando. Aquí tienes el pulso de tu clase hoy.
                    </p>
                </div>
                <Link href="/teacher/classes">
                    <Button variant="primary" className="px-8 shadow-md shadow-brand-primary/20" icon={Plus}>
                        Crear Nueva Clase
                    </Button>
                </Link>
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

            {/* Empty State / CTA */}
            <Card variant="glass" className="p-16 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-[var(--theme-border-soft)]">
                <div className="w-24 h-24 bg-[var(--theme-bg-surface)]/10 rounded-full flex items-center justify-center mb-8 animate-pulse relative">
                    <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl shadow-[0_0_40px_rgba(30,64,175,0.1)]"></div>
                    <BookOpen size={48} className="text-brand-primary/50 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-theme-text-primary mb-3 tracking-tight">Tu espacio de enseñanza</h3>
                <p className="text-theme-text-tertiary max-w-md mx-auto mb-10 text-sm leading-relaxed prose-apple">
                    Crea tu primera clase para invitar estudiantes, asignar simulacros y monitorear su progreso en tiempo real con nuestra analítica Pro.
                </p>
                <div className="flex gap-4">
                    <Link href="/teacher/classes">
                        <Button variant="primary" icon={Plus}>Empezar Ahora</Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="opacity-60 hover:opacity-100"
                        onClick={() => {
                            toast.info("¡Estamos listos para ayudarte!", {
                                description: "1. Crea una clase. 2. Comparte el código. 3. Observa cómo tus estudiantes brillan.",
                                icon: <Info className="text-brand-primary" size={16} />
                            });
                        }}
                    >
                        Ver Tutorial
                    </Button>
                </div>
            </Card>
        </main>
    );
}
