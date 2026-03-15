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
import { adminService, DashboardUser } from "@/services/admin/admin.service";
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

interface ActivityDatum {
    day: string;
    users: number;
    revenue?: number;
    trend?: number;
}

// Real activity data will be fetched from telemetry collection in next update
const activityData: ActivityDatum[] = [];

// La interfaz DashboardUser ahora se importa de @/services/adminService

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
                // 1. Obtener estadísticas y usuarios mediante el servicio centralizado
                const [dashboardStats, users] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getRecentUsers(100)
                ]);

                setStats(dashboardStats);
                setRecentUsers(users.slice(0, 5));

                // 2. Procesamiento de agregaciones (mantenido en cliente para reactividad local)
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
                console.error("Error fetching admin stats via service:", error);
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
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header Pro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--theme-bg-surface)]/50 backdrop-blur-md p-4 rounded-2xl border border-[var(--theme-border-soft)]">
                <div>
                    <h1 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2 tracking-tight">
                        <Activity className="text-brand-primary" size={20} /> Comando Central
                    </h1>
                    <p className="text-[11px] text-[var(--theme-text-tertiary)] mt-0.5 flex items-center gap-1.5 font-medium ml-7">
                        Inteligencia de Negocio & Operaciones
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
                    trend="Calculado"
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
                    trend="En tiempo real"
                    trendUp={true}
                    color="purple"
                />
                <StatCardPremium
                    title="Conversión Pro"
                    value={`${((stats.proUsers / (stats.users || 1)) * 100).toFixed(1)}%`}
                    icon={<TrendingUp size={22} />}
                    trend="Sincronizado"
                    trendUp={true}
                    color="green"
                />
            </div>

            {/* 🧠 Intelligence Central (New Phase 10) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    <h2 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Inteligencia Estratégica</h2>
                </div>

                <div className="py-20 text-center border-2 border-dashed border-[var(--theme-border-soft)] rounded-[2.5rem] bg-[var(--theme-bg-surface)]/30">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--theme-text-primary)] uppercase italic tracking-tight">Sin Alertas Críticas</h3>
                        <p className="text-[var(--theme-text-secondary)] text-sm">
                            El sistema de Inteligencia Estratégica aparecerá aquí cuando se detecten anomalías o picos de actividad en la telemetría global.
                        </p>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <Card variant="solid" className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2 italic uppercase tracking-tight">
                                <TrendingUp className="text-brand-primary" size={18} /> Telemetría de Red
                            </h3>
                            <p className="text-xs text-[var(--theme-text-tertiary)]">Actividad de usuarios en tiempo real</p>
                        </div>
                    </div>
                    {activityData.length > 0 ? (
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
                    ) : (
                        <div className="h-[350px] flex items-center justify-center border-2 border-dashed border-[var(--theme-border-soft)] rounded-3xl bg-[var(--theme-bg-base)]/30">
                            <p className="text-[var(--theme-text-tertiary)] font-bold uppercase text-xs tracking-widest text-center">
                                Esperando Flujo de Datos...
                            </p>
                        </div>
                    )}
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
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(locationData.length > 0 ? locationData : [{ name: 'Sin Datos', value: 1 }]).map((entry: ChartDataItem, index: number) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="outline-none" />
                                    ))}
                                </Pie>
                                <ThemedTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                        {locationData.slice(0, 4).map((entry: ChartDataItem, index: number) => (
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
                        {universityData.length > 0 ? universityData.map((uni: ChartDataItem, idx: number) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider truncate max-w-[70%] group-hover:text-[var(--theme-text-primary)] transition-colors">{uni.name}</span>
                                    <Badge variant="ghost" className="text-[10px] font-bold text-purple-400">{uni.value} Aspirantes</Badge>
                                </div>
                                <div className="h-1.5 bg-[var(--theme-bg-base)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--chart-4)] to-[var(--chart-1)] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                        style={{ width: `${(uni.value / Math.max(...universityData.map((u: ChartDataItem) => u.value))) * 100}%` }}
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

