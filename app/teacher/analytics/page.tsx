"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, AlertTriangle, Lock, Crown, ChevronRight, Download } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function TeacherAnalyticsPage() {
    const { user, subscription } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        avgScore: 0,
        activeAssignments: 0,
        completionRate: 0
    });

    const isPro = ['pro', 'teacher', 'elite'].includes(subscription?.plan || '');

    // Mock Data for Charts (In real app, fetch from Firestore aggregation)
    const performanceData = [
        { name: 'Sem 1', promedio: 240 },
        { name: 'Sem 2', promedio: 255 },
        { name: 'Sem 3', promedio: 280 },
        { name: 'Sem 4', promedio: 310 }, // Improved
        { name: 'Sem 5', promedio: 305 },
        { name: 'Sem 6', promedio: 340 },
    ];

    const atRiskStudents = [
        { name: "Juan Pérez", score: 210, class: "Matemáticas 11B" },
        { name: "Ana Gomez", score: 225, class: "Lectura 10A" },
        { name: "Carlos Ruiz", score: 190, class: "Inglés A2" },
    ];

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        if (!user) return;
        try {
            // Fetch real counts
            const classesQ = query(collection(db, "classrooms"), where("teacherId", "==", user.uid));
            const classesSnap = await getDocs(classesQ);
            const classIds = classesSnap.docs.map(d => d.id);

            const totalStudents = 0;
            // Note: In a scalable app, use aggregation queries or counter headers. this is a simplified fetch loop.
            // For now, we simulate the "Basic" overview data.
            setStats({
                totalStudents: 45, // Placeholder
                avgScore: 168, // More realistic average (0-300 scale)
                activeAssignments: 3,
                completionRate: 78
            });
        } catch (error) {
            console.error("Error stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        setLoading(true);
        try {
            // Dynamic import to avoid SSR issues with jspdf
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text(`Reporte de Rendimiento - ${user?.displayName || "Docente"}`, 20, 20);

            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
            doc.text(`Estudiantes: ${stats.totalStudents}`, 20, 40);
            doc.text(`Promedio: ${stats.avgScore}`, 20, 50);

            doc.text("Estudiantes en Riesgo:", 20, 70);
            atRiskStudents.forEach((s, i) => {
                doc.text(`- ${s.name} (${s.class}): ${s.score} pts`, 25, 80 + (i * 10));
            });

            doc.save("reporte_clase_elite.pdf");
        } catch (e) {
            console.error(e);
            alert("Error generando reporte.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BarChart3 className="text-metal-gold" /> Analíticas de Rendimiento
                    </h1>
                    <p className="text-metal-silver">
                        Monitorea el progreso y detecta áreas de mejora en tus clases.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadReport}
                        className="metallic-btn bg-metal-gold text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white transition-all font-bold"
                    >
                        <Download size={18} /> Exportar Reporte
                    </button>
                    {!isPro && (
                        <Link href="/pricing" className="metallic-btn bg-metal-gold/10 border border-metal-gold text-metal-gold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-metal-gold hover:text-black transition-all">
                            <Crown size={16} /> Desbloquear
                        </Link>
                    )}
                </div>
            </div>

            {/* Overview Cards (Access for ALL) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Estudiantes Activos"
                    value={stats.totalStudents}
                    icon={<Users size={20} className="text-blue-400" />}
                />
                <StatCard
                    label="Promedio Global"
                    value={stats.avgScore}
                    suffix=" pts"
                    icon={<TrendingUp size={20} className="text-green-400" />}
                />
                <StatCard
                    label="Tasa de Completitud"
                    value={stats.completionRate}
                    suffix="%"
                    icon={<BarChart3 size={20} className="text-purple-400" />}
                />
                <StatCard
                    label="Tareas Activas"
                    value={stats.activeAssignments}
                    icon={<AlertTriangle size={20} className="text-yellow-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart - PRO ONLY */}
                <div className="lg:col-span-2 metallic-card p-6 rounded-2xl border border-metal-silver/10 bg-black/20 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-white">Tendencia de Puntajes</h3>
                        <select className="bg-black/40 border border-metal-silver/20 rounded-lg text-xs text-metal-silver p-1 outline-none">
                            <option>Últimos 6 meses</option>
                        </select>
                    </div>

                    <div className={`h-[300px] w-full ${!isPro ? 'blur-md opacity-30 select-none' : ''}`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="promedio" stroke="#D4AF37" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Lock Overlay for Basic */}
                    {!isPro && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50 backdrop-blur-[2px]">
                            <div className="p-4 bg-metal-dark border border-metal-gold/30 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-xs animate-in zoom-in-95 duration-300">
                                <div className="w-12 h-12 bg-metal-gold/20 rounded-full flex items-center justify-center mb-3 text-metal-gold">
                                    <Lock size={24} />
                                </div>
                                <h4 className="font-bold text-white mb-1">Gráficos Avanzados</h4>
                                <p className="text-xs text-metal-silver mb-4">
                                    Visualiza la evolución detallada de tus estudiantes con el Plan Pro.
                                </p>
                                <Link href="/pricing" className="metallic-btn bg-metal-gold text-black text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110">
                                    Mejorar Plan
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* At Risk List - PRO ONLY */}
                <div className="metallic-card p-6 rounded-2xl border border-metal-silver/10 bg-black/20 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="text-red-400" size={20} />
                            En Riesgo
                        </h3>
                    </div>

                    <div className={`space-y-4 ${!isPro ? 'blur-md opacity-30 select-none' : ''}`}>
                        {atRiskStudents.map((student, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <div>
                                    <div className="font-bold text-white">{student.name}</div>
                                    <div className="text-xs text-metal-silver">{student.class}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-red-400">{student.score}</div>
                                    <div className="text-[10px] text-red-300/50">Promedio</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lock Overlay for Basic */}
                    {!isPro && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50 backdrop-blur-[2px]">
                            <div className="p-4 bg-metal-dark border border-metal-gold/30 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-xs">
                                <div className="w-12 h-12 bg-metal-gold/20 rounded-full flex items-center justify-center mb-3 text-metal-gold">
                                    <Lock size={24} />
                                </div>
                                <h4 className="font-bold text-white mb-1">Alerta de Riesgo</h4>
                                <p className="text-xs text-metal-silver mb-4">
                                    Detecta automáticamente estudiantes que necesitan refuerzo.
                                </p>
                                <Link href="/pricing" className="metallic-btn bg-metal-gold text-black text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110">
                                    Mejorar Plan
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, suffix = "", icon }: { label: string, value: number, suffix?: string, icon: React.ReactNode }) {
    return (
        <div className="metallic-card p-6 rounded-2xl border border-metal-silver/10 bg-black/20 hover:bg-white/5 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {/* Tiny trend indicator mockup */}
                <div className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center">
                    +4% <TrendingUp size={8} className="ml-1" />
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
                {value}{suffix}
            </div>
            <div className="text-sm text-metal-silver font-medium">
                {label}
            </div>
        </div>
    );
}
