"use client";

import {
    Users,
    FileQuestion,
    BookOpen,
    Activity,
    Database,
    TrendingUp,
    Clock,
    AlertCircle,
    School,
    DollarSign,
    Target,
    ShieldAlert
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { ThemedGrid, ThemedXAxis, ThemedYAxis, ThemedTooltip } from "@/components/ui/ThemedChart";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCardPremium } from "@/components/ui/StatCardPremium";

const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)'
];

// Enhanced Mock Data for "World Class" Feel
// Enhanced Mock Data for "World Class" Feel
// Mock data adjusted for COP scale
interface ActivityDatum {
    day: string;
    users: number;
    revenue?: number;
    trend?: number;
}

const activityData: ActivityDatum[] = [
    { day: 'LUN', users: 120, revenue: 5988000 },
    { day: 'MAR', users: 190, revenue: 9481000 },
    { day: 'MIÉ', users: 150, revenue: 7485000 },
    { day: 'JUE', users: 250, revenue: 12475000 },
    { day: 'VIE', users: 320, revenue: 15968000 },
    { day: 'SÁB', users: 450, revenue: 22455000 }, // Fixed key from 'trend' to 'revenue' for consistency if needed, assuming chart logic
    { day: 'DOM', users: 380, revenue: 18962000 },
];

interface DashboardUser {
    id: string;
    city?: string;
    targetCareer?: string;
    dreamUniversity?: string;
    [key: string]: unknown;
}

interface ChartDataItem {
    name: string;
    value: number;
    [key: string]: string | number;
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        users: 0,
        questions: 0,
        simulations: 0,
        proUsers: 0
    });
    const [recentUsers, setRecentUsers] = useState<DashboardUser[]>([]);
    const [locationData, setLocationData] = useState<ChartDataItem[]>([]);
    const [careerData, setCareerData] = useState<ChartDataItem[]>([]);
    const [universityData, setUniversityData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                // 1. Core Counts
                const usersColl = collection(db, "users");
                const questionsColl = collection(db, "questions");
                const resultsColl = collection(db, "results");

                // Count Pro Users
                const qPro = query(usersColl, where("subscription.plan", "==", "pro"));
                const qUsers = query(usersColl, limit(100));

                const [usersSnapshot, questionsSnapshot, resultsSnapshot, proSnapshot, userDocs] = await Promise.all([
                    getCountFromServer(usersColl),
                    getCountFromServer(questionsColl),
                    getCountFromServer(resultsColl),
                    getCountFromServer(qPro),
                    getDocs(qUsers)
                ]);

                setStats({
                    users: usersSnapshot.data().count,
                    questions: questionsSnapshot.data().count,
                    simulations: resultsSnapshot.data().count,
                    proUsers: proSnapshot.data().count
                });

                // 2. Analytics Data (Sample)
                const users = userDocs.docs.map(d => ({ id: d.id, ...d.data() } as DashboardUser));

                setRecentUsers(users.slice(0, 5));

                // Aggregations
                const cityCounts: Record<string, number> = {};
                const careerCounts: Record<string, number> = {};
                const uniCounts: Record<string, number> = {};

                users.forEach((u) => {
                    const city = u.city?.trim() || "Desconocido";
                    cityCounts[city] = (cityCounts[city] || 0) + 1;

                    const career = u.targetCareer || "No definido";
                    careerCounts[career] = (careerCounts[career] || 0) + 1;

                    if (u.dreamUniversity) {
                        uniCounts[u.dreamUniversity] = (uniCounts[u.dreamUniversity] || 0) + 1;
                    }
                });

                setLocationData(transformForChart(cityCounts));
                setCareerData(transformForChart(careerCounts));
                setUniversityData(transformForChart(uniCounts));

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const transformForChart = (counts: Record<string, number>) => {
        return Object.entries(counts)
            .map(([name, value]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Pro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-theme-hero flex items-center gap-4 tracking-tighter uppercase italic">
                        <Activity className="text-brand-primary" size={36} /> Comando Central
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-sm mt-1 flex items-center gap-2 font-medium">
                        <ShieldAlert size={14} className="text-brand-primary" /> Monitor de Operaciones e Inteligencia de Negocio
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/audit">
                        <Button variant="outline" size="sm" icon={ShieldAlert} className="border-[var(--theme-border-soft)] hover:border-[var(--theme-border-medium)] px-6 font-bold uppercase tracking-wider text-[10px]">
                            Auditoría
                        </Button>
                    </Link>
                    <Link href="/admin/seed">
                        <Button variant="primary" size="sm" icon={Database} className="shadow-lg shadow-brand-primary/10 px-6 font-bold uppercase tracking-wider text-[10px]">
                            Cargar Datos
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Grid Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCardPremium
                    title="Revenue Estimado (M)"
                    value={`$${(stats.proUsers * 49900).toLocaleString('es-CO')}`}
                    icon={<DollarSign size={22} />}
                    trend="+18.4% MRR"
                    trendUp={true}
                    color="gold"
                />
                <StatCardPremium
                    title="Usuarios Totales"
                    value={stats.users.toLocaleString('es-CO')}
                    icon={<Users size={22} />}
                    trend={`${stats.proUsers} Premium`}
                    trendUp={true}
                    color="blue"
                />
                <StatCardPremium
                    title="Simulacros Ejecutados"
                    value={stats.simulations.toLocaleString('es-CO')}
                    icon={<Target size={22} />}
                    trend="+500 hoy"
                    trendUp={true}
                    color="purple"
                />
                <StatCardPremium
                    title="Conversión Pro"
                    value={`${((stats.proUsers / (stats.users || 1)) * 100).toFixed(1)}%`}
                    icon={<TrendingUp size={22} />}
                    trend="Meta: 15%"
                    trendUp={true}
                    color="green"
                />
            </div>

            {/* 🧠 Intelligence Central (New Phase 10) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    <h2 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Intelligence Central</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card variant="premium" className="p-8 space-y-4 border-l-4 border-l-brand-primary">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <Target size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Alerta de Rendimiento</span>
                        </div>
                        <h4 className="text-lg font-bold text-[var(--theme-text-primary)]">Detección de Brecha: Razonamiento</h4>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                            El 35% de los estudiantes de <strong>Ingeniería</strong> han mostrado un descenso en Razonamiento Cuantitativo. Se recomienda activar refuerzo modular.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-[10px] font-bold">Ver Análisis de Cohorte</Button>
                    </Card>

                    <Card variant="premium" className="p-8 space-y-4 border-l-4 border-l-brand-accent">
                        <div className="flex items-center gap-3 text-brand-accent">
                            <TrendingUp size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Oportunidad de Crecimiento</span>
                        </div>
                        <h4 className="text-lg font-bold text-[var(--theme-text-primary)]">Pico de Engagament: Bogotá</h4>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                            Aumento del 42% en actividad nocturna durante la última semana. Oportunidad para lanzar campaña de "Examen Mañana".
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-[10px] font-bold">Lanzar Notificación IA</Button>
                    </Card>

                    <Card variant="premium" className="p-8 space-y-4 border-l-4 border-l-brand-success">
                        <div className="flex items-center gap-3 text-brand-success">
                            <ShieldAlert size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Salud del Producto</span>
                        </div>
                        <h4 className="text-lg font-bold text-[var(--theme-text-primary)]">Tasa de Éxito: Onboarding</h4>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                            El nuevo flujo de onboarding ha incrementado la retención de primer día a un <strong>68%</strong>. Sincronización exitosa con Firebase.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-[10px] font-bold">Ver Embudo de Conversión</Button>
                    </Card>
                </div>
            </section>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <Card variant="solid" className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2 italic uppercase tracking-tight">
                                <TrendingUp className="text-brand-primary" size={18} /> Rendimiento de Red
                            </h3>
                            <p className="text-xs text-[var(--theme-text-tertiary)]">Actividad de usuarios vs Proyecciones de ingresos</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--chart-1)]"></div>
                                <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)]">TRÁFICO</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--chart-2)]"></div>
                                <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)]">CAPITAL</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <ThemedGrid />
                                <ThemedXAxis dataKey="day" />
                                <ThemedYAxis yAxisId="left" />
                                <ThemedYAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${((v as number) / 1000000).toFixed(1)}M`} />
                                <ThemedTooltip />
                                <Line yAxisId="left" type="monotone" dataKey="users" stroke="var(--chart-1)" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Geography Chart */}
                <Card variant="solid" className="p-8 flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-brand-primary/10" />

                    <div className="w-full text-center border-b border-[var(--theme-border-soft)] pb-6 mb-6">
                        <h3 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Geolocalización</h3>
                        <p className="text-[10px] text-[var(--theme-text-quaternary)] font-bold uppercase tracking-wider">Nodos de mayor actividad</p>
                    </div>

                    <div className="h-[240px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={locationData.length > 0 ? locationData : [{ name: 'Sin Datos', value: 1 }]}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    cornerRadius={6}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(locationData.length > 0 ? locationData : [{ name: 'Sin Datos', value: 1 }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="outline-none" />
                                    ))}
                                </Pie>
                                <ThemedTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                        {locationData.slice(0, 4).map((entry, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)] hover:bg-[var(--theme-bg-surface)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">{entry.name}</span>
                                </div>
                                <span className="text-sm font-bold text-[var(--theme-text-primary)]">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Sub-Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="solid" className="p-8">
                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-8 flex items-center gap-3 italic uppercase tracking-tight">
                        < BookOpen className="text-brand-primary" size={18} /> Nicho Profesional
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={careerData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                <ThemedGrid horizontal={false} />
                                <ThemedXAxis type="number" hide />
                                <ThemedYAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9 }} />
                                <ThemedTooltip cursor={{ fill: 'var(--theme-border-soft)', opacity: 0.5 }} />
                                <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={20} className="drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card variant="solid" className="p-8">
                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-8 flex items-center gap-3 italic uppercase tracking-tight">
                        <School className="text-[var(--chart-4)]" size={18} /> Top Aspiraciones
                    </h3>
                    <div className="space-y-6">
                        {universityData.length > 0 ? universityData.map((uni, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider truncate max-w-[70%] group-hover:text-[var(--theme-text-primary)] transition-colors">{uni.name}</span>
                                    <Badge variant="ghost" className="text-[10px] font-bold text-purple-400">{uni.value} Aspirantes</Badge>
                                </div>
                                <div className="h-1.5 bg-[var(--theme-bg-base)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--chart-4)] to-[var(--chart-1)] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                        style={{ width: `${(uni.value / Math.max(...universityData.map(u => u.value))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center border-2 border-dashed border-[var(--theme-border-soft)] rounded-3xl bg-[var(--theme-bg-base)]/30">
                                <p className="text-[var(--theme-text-tertiary)] font-bold uppercase text-xs tracking-wider">Esperando Telemetría de Aspiraciones</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}

