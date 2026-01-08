"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import NumberTicker from "@/components/ui/NumberTicker";
import PromotionBanner from "@/components/ui/PromotionBanner";
import { toast } from "sonner";
import { Info } from "lucide-react";

export default function TeacherDashboard() {
    const { user, profile, subscription } = useAuth();

    const stats = [
        { title: "Estudiantes Activos", value: 125, suffix: "+", icon: Users, color: "text-blue-400" },
        { title: "Clases Creadas", value: 8, icon: BookOpen, color: "text-purple-400" },
        { title: "Promedio Global", value: 375, icon: TrendingUp, color: "text-green-400" },
        { title: "Horas de Práctica", value: 1240, icon: Clock, color: "text-orange-400" },
    ];

    const teacherName = profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Profe";

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PromotionBanner />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        Hola, {teacherName} 👋
                        {profile?.role === 'teacher' && <Badge variant="premium" className="text-[10px] font-black tracking-widest px-3 py-1 bg-metal-gold text-black border-none">PRO</Badge>}
                    </h1>
                    <p className="text-metal-silver">
                        Aquí tienes el resumen del rendimiento de tus estudiantes hoy.
                    </p>
                </div>
                <Link href="/teacher/classes">
                    <Button variant="premium" className="px-8 shadow-[0_0_20px_rgba(212,175,55,0.3)]" icon={Plus}>
                        Crear Nueva Clase
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} variant="glass" className="p-6 group hover:border-metal-gold/30 transition-all active:scale-[0.98]">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <Badge variant="default" className="text-[8px] opacity-50">LIVE</Badge>
                            </div>
                            <div className="text-4xl font-black text-white mb-1 group-hover:text-metal-gold transition-colors flex items-center">
                                <NumberTicker value={stat.value} suffix={stat.suffix || ''} />
                            </div>
                            <div className="text-sm font-medium text-metal-silver">{stat.title}</div>
                        </Card>
                    );
                })}
            </div>

            {/* PRO Upgrade Card (Visible to non-pro) */}
            {profile?.role === 'teacher' && subscription?.plan !== 'pro' && (
                <Card variant="premium" className="p-8 bg-gradient-to-r from-metal-gold to-yellow-500 border-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2">Desbloquea el Potencial Elite</h3>
                            <p className="text-black/70 font-medium max-w-xl">
                                Obtén reportes detallados por estudiante, descarga de resultados en PDF masivos y soporte prioritario 24/7.
                            </p>
                        </div>
                        <Link href="/pricing">
                            <Button className="bg-black text-white hover:bg-black/80 px-8 h-12 font-black uppercase tracking-widest shadow-xl">
                                Actualizar a PRO
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Empty State / CTA */}
            <Card variant="glass" className="p-16 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-white/5">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 animate-pulse relative">
                    <div className="absolute inset-0 bg-metal-gold/10 rounded-full blur-xl"></div>
                    <BookOpen size={48} className="text-metal-gold/50 relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">¡Bienvenido a tu Centro de Mando!</h3>
                <p className="text-metal-silver max-w-md mx-auto mb-10 text-sm leading-relaxed">
                    Crea tu primera clase para invitar estudiantes, asignar simulacros y monitorear su progreso en tiempo real con nuestra Analítica Pro.
                </p>
                <div className="flex gap-4">
                    <Link href="/teacher/classes">
                        <Button variant="premium" icon={Plus}>Empezar Ahora</Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="opacity-50 hover:opacity-100"
                        onClick={() => {
                            toast.info("Guía Rápida Docente", {
                                description: "1. Crea una clase. 2. Comparte el código. 3. Asigna simulacros. ¡Listo!",
                                icon: <Info className="text-metal-gold" size={16} />
                            });
                        }}
                    >
                        Ver Tutorial
                    </Button>
                </div>
            </Card>
        </div>
    );
}
