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
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Configuración de Colores de Marca (Consistencia Global)
const BRAND_COLORS = {
    gold: '#D4AF37',
    silver: '#E5E4E2',
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#22c55e',
    dark: '#0A0A0A'
};

const CHART_COLORS = [BRAND_COLORS.gold, BRAND_COLORS.blue, BRAND_COLORS.purple, BRAND_COLORS.silver];

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

                const [usersSnapshot, questionsSnapshot, resultsSnapshot, proSnapshot] = await Promise.all([
                    getCountFromServer(usersColl),
                    getCountFromServer(questionsColl),
                    getCountFromServer(resultsColl),
                    getCountFromServer(qPro)
                ]);

                setStats({
                    users: usersSnapshot.data().count,
                    questions: questionsSnapshot.data().count,
                    simulations: resultsSnapshot.data().count,
                    proUsers: proSnapshot.data().count
                });

                // 2. Analytics Data (Sample)
                const qUsers = query(usersColl, limit(100));
                const userDocs = await getDocs(qUsers);
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

    if (loading) return <AIProcessingLoader text="Cargando Inteligencia" subtext="Analizando Big Data..." />;

    return (
        <div className="space-y-12 pb-44">
            {/* Header Pro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white flex items-center gap-4 tracking-tighter">
                        <Activity className="text-metal-gold" size={36} /> Comando Central
                    </h1>
                    <p className="text-metal-silver/40 text-sm mt-1 flex items-center gap-2 font-medium">
                        <ShieldAlert size={14} className="text-metal-gold" /> Monitor de Operaciones e Inteligencia de Negocio
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/audit">
                        <Button variant="outline" size="sm" icon={ShieldAlert} className="border-white/5 hover:border-white/10 px-6 font-bold uppercase tracking-widest text-[10px]">
                            Auditoría
                        </Button>
                    </Link>
                    <Link href="/admin/seed">
                        <Button variant="premium" size="sm" icon={Database} className="shadow-lg shadow-metal-gold/10 px-6 font-bold uppercase tracking-widest text-[10px]">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <Card variant="solid" className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-2 italic uppercase tracking-tighter">
                                <TrendingUp className="text-metal-gold" size={18} /> Rendimiento de Red
                            </h3>
                            <p className="text-xs text-metal-silver/40">Actividad de usuarios vs Proyecciones de ingresos</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-bold text-metal-silver/60">TRÁFICO</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-metal-gold"></div>
                                <span className="text-[10px] font-bold text-metal-silver/60">CAPITAL</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="day" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} dy={10} fontStyle="italic" fontWeight="bold" />
                                <YAxis yAxisId="left" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" />
                                <YAxis yAxisId="right" orientation="right" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} fontWeight="bold" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="users" stroke={BRAND_COLORS.blue} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={BRAND_COLORS.gold} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Geography Chart */}
                <Card variant="solid" className="p-8 flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-metal-gold/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-metal-gold/10" />

                    <div className="w-full text-center border-b border-white/5 pb-6 mb-6">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Geolocalización</h3>
                        <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-widest">Nodos de mayor actividad</p>
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
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                        {locationData.slice(0, 4).map((entry, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                    <span className="text-[10px] font-black text-metal-silver/60 uppercase tracking-widest">{entry.name}</span>
                                </div>
                                <span className="text-sm font-black text-white">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Sub-Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="solid" className="p-8">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                        <BookOpen className="text-metal-gold" size={18} /> Nicho Profesional
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={careerData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#666" fontSize={10} width={120} tickLine={false} axisLine={false} fontWeight="bold" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" fill={BRAND_COLORS.gold} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card variant="solid" className="p-8">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                        <School className="text-purple-400" size={18} /> Top Aspiraciones
                    </h3>
                    <div className="space-y-6">
                        {universityData.length > 0 ? universityData.map((uni, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest truncate max-w-[70%] group-hover:text-metal-silver transition-colors">{uni.name}</span>
                                    <Badge variant="ghost" className="text-[10px] font-black text-purple-400">{uni.value} Aspirantes</Badge>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                        style={{ width: `${(uni.value / Math.max(...universityData.map(u => u.value))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                <p className="text-metal-silver/20 font-black uppercase text-xs tracking-widest">Esperando Telemetría de Aspiraciones</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendUp: boolean;
    color: 'gold' | 'blue' | 'purple' | 'green';
}

function StatCardPremium({ title, value, icon, trend, trendUp, color }: StatCardProps) {
    const theme = {
        gold: { bg: 'bg-metal-gold/10', text: 'text-metal-gold', border: 'border-metal-gold/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
        green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    }[color] || { bg: 'bg-white/5', text: 'text-white', border: 'border-white/10' };

    return (
        <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-60 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} border ${theme.border} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <Badge variant={trendUp ? 'success' : 'error'} className="text-[10px] font-black tracking-widest uppercase">
                    {trend}
                </Badge>
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums mb-1">{value}</h3>
                <p className="text-metal-silver/40 text-[10px] font-black uppercase tracking-widest leading-none">{title}</p>
            </div>
        </Card>
    );
}
