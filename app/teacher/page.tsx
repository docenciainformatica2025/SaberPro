"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function TeacherDashboard() {
    const { user, profile } = useAuth();

    const stats = [
        { title: "Estudiantes Activos", value: "0", icon: Users, color: "text-blue-400" },
        { title: "Clases Creadas", value: "0", icon: BookOpen, color: "text-purple-400" },
        { title: "Promedio Global", value: "--", icon: TrendingUp, color: "text-green-400" },
        { title: "Tiempo de Práctica", value: "0h", icon: Clock, color: "text-orange-400" },
    ];

    const teacherName = profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Profe";

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Hola, {teacherName} 👋
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
                            <div className="text-4xl font-black text-white mb-1 group-hover:text-metal-gold transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-metal-silver">{stat.title}</div>
                        </Card>
                    );
                })}
            </div>

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
                    <Button variant="outline" className="opacity-50 hover:opacity-100">Ver Tutorial</Button>
                </div>
            </Card>
        </div>
    );
}
