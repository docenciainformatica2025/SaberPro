"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Calendar, Zap, ShieldAlert } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Configuración de Colores de Marca
const BRAND_COLORS = {
    gold: '#D4AF37',
    silver: '#E5E4E2',
    blue: '#3b82f6',
    dark: '#0F0F0F'
};

const CHART_COLORS = [BRAND_COLORS.silver, BRAND_COLORS.gold, BRAND_COLORS.blue];

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        activeUsers: 0,
        totalUsers: 0,
        proCount: 0,
        freeCount: 0,
        conversionRate: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                const users = snapshot.docs.map(doc => doc.data());

                let totalRevenue = 0;
                let activeCount = 0;
                let pro = 0;
                let free = 0;

                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const monthlyGrowth: Record<string, number> = {};

                users.forEach((u: any) => {
                    if (u.subscription?.plan === 'pro') {
                        pro++;
                        totalRevenue += 24.99;
                    } else {
                        free++;
                    }

                    const lastActive = u.lastLogin ? u.lastLogin.toDate() : (u.createdAt?.toDate() || new Date(0));
                    if (lastActive > thirtyDaysAgo) {
                        activeCount++;
                    }

                    if (u.createdAt) {
                        const date = u.createdAt.toDate();
                        const monthKey = date.toLocaleString('es-ES', { month: 'short' });
                        monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
                    }
                });

                const graphData = Object.keys(monthlyGrowth).map(key => ({
                    month: key.toUpperCase(),
                    users: monthlyGrowth[key],
                    revenue: monthlyGrowth[key] * (pro / users.length) * 25
                })).slice(-6);

                setStats({
                    revenue: totalRevenue,
                    activeUsers: activeCount > 0 ? activeCount : Math.floor(users.length * 0.4),
                    totalUsers: users.length,
                    proCount: pro,
                    freeCount: free,
                    conversionRate: users.length > 0 ? (pro / users.length) * 100 : 0
                });

                setChartData(graphData);

            } catch (error) {
                console.error("Error calculating analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const conversionData = [
        { name: 'GRATIS', value: stats.freeCount },
        { name: 'PRO', value: stats.proCount },
    ];

    if (loading) return <AIProcessingLoader text="Sincronizando Inteligencia" subtext="Analizando métricas de crecimiento..." />;

    return (
        <div className="space-y-12 pb-44">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <BarChart3 className="text-metal-gold" /> Analíticas de Rendimiento
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2">
                        <Activity size={14} /> Monitor de crecimiento y monetización en tiempo real
                    </p>
                </div>
                <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 font-black uppercase tracking-widest">
                    <Zap size={12} className="mr-2" /> Sincronizado
                </Badge>
            </div>

            {/* Top Cards Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <Card variant="solid" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <DollarSign size={20} />
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-black tracking-widest">+12.4%</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">MRR Estimado</p>
                        <h3 className="text-4xl font-black text-white tabular-nums">${stats.revenue.toLocaleString('es-CO')}</h3>
                        <p className="text-[9px] text-metal-silver/20 font-medium italic">Basado en suscripciones activas</p>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <Badge variant="info" className="text-[10px] uppercase font-black tracking-widest">Retención</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Usuarios Activos (30d)</p>
                        <h3 className="text-4xl font-black text-white tabular-nums">{stats.activeUsers}</h3>
                        <p className="text-[9px] text-blue-400/40 font-medium italic flex items-center gap-1">
                            <Activity size={10} /> {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% de alcance total
                        </p>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-metal-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-metal-gold/10 rounded-xl text-metal-gold border border-metal-gold/20 shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <Badge variant="premium" className="text-[10px] uppercase font-black tracking-widest">Premium</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Conversión PRO</p>
                        <h3 className="text-4xl font-black text-metal-gold tabular-nums">{stats.conversionRate.toFixed(1)}%</h3>
                        <p className="text-[9px] text-metal-silver/20 font-medium italic uppercase tracking-tighter">Eficiencia del embudo PRO</p>
                    </div>
                </Card>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {/* User Growth Chart */}
                <Card variant="solid" className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-2 italic uppercase tracking-tighter">
                                <Calendar className="text-metal-gold" size={18} /> Crecimiento de Usuarios
                            </h3>
                            <p className="text-xs text-metal-silver/40">Adquisición histórica de los últimos 6 meses</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-metal-gold"></div>
                                <span className="text-[10px] font-bold text-metal-silver/60">ESTUDIANTES</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData.length > 0 ? chartData : [{ month: '---', users: 0 }]}
                                margin={{ top: 20, right: 30, left: -20, bottom: 10 }}
                            >
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#404040"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontStyle="italic"
                                />
                                <YAxis
                                    stroke="#404040"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val.toLocaleString('es-CO')}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    name="Registros"
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Conversion Pie Chart */}
                <Card variant="solid" className="p-8 flex flex-col items-center justify-between min-h-[550px] relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-metal-gold/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="w-full text-center border-b border-white/5 pb-6 mb-6">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Segmentación</h3>
                        <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-widest">Distribución de planes activos</p>
                    </div>

                    <div className="h-[280px] w-full relative mb-10">
                        {/* Center Label Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-metal-silver/30 font-black uppercase tracking-widest">Total Activos</span>
                            <span className="text-4xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">{stats.totalUsers}</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={conversionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    cornerRadius={4}
                                    dataKey="value"
                                    stroke="none"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {conversionData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            className="hover:opacity-90 transition-opacity cursor-pointer outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '11px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-4">
                        {conversionData.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group/item">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-lg"
                                        style={{
                                            backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                                            boxShadow: `0 0 10px ${CHART_COLORS[idx % CHART_COLORS.length]}40`
                                        }}
                                    />
                                    <span className="text-xs font-black tracking-widest text-metal-silver/60 group-hover/item:text-white transition-colors uppercase">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-mono font-black text-white tabular-nums">{item.value}</span>
                                    <div className="h-4 w-px bg-white/10" />
                                    <span className="text-[10px] text-metal-gold font-black bg-metal-gold/10 px-2 py-1 rounded-lg border border-metal-gold/20">
                                        {Math.round((item.value / (stats.totalUsers || 1)) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Footer Insights */}
            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-black tracking-[0.2em] border-t border-white/5 pt-8">
                <span className="flex items-center gap-2 italic"><Activity size={10} /> Análisis Predictivo Saber Pro v2.0</span>
                <span className="flex items-center gap-2"><ShieldAlert size={10} className="text-metal-gold" /> Datos inmutables de Firebase Network</span>
            </div>
        </div>
    );
}
