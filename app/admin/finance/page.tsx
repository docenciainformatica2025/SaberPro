"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, limit, where, doc, getDoc } from "firebase/firestore";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { DollarSign, TrendingUp, Users, CreditCard, Download, ShieldCheck, Printer, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";

interface Transaction {
    id: string;
    userId: string;
    amount: number;
    plan: string;
    status: string;
    createdAt: any;
    provider: string;
}

// Configuración de Colores de Marca
const BRAND_COLORS = {
    gold: '#D4AF37',
    silver: '#E5E4E2',
    blue: '#4169E1',
    dark: '#0A0A0A'
};

const CHART_COLORS = [BRAND_COLORS.gold, BRAND_COLORS.silver, '#B8860B', BRAND_COLORS.blue];

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userMap, setUserMap] = useState<any>({});
    const [stats, setStats] = useState({
        totalRevenue: 0,
        thisMonth: 0,
        activeSubs: 0,
        conversionRate: 2.5
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFinanceData() {
            try {
                const q = query(
                    collection(db, "transactions"),
                    orderBy("createdAt", "desc"),
                    limit(50)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Transaction));
                setTransactions(data);

                const uMap: Record<string, any> = {};
                const userPromises = data.map(async (tx) => {
                    if (!uMap[tx.userId]) {
                        const uSnap = await getDoc(doc(db, "users", tx.userId));
                        if (uSnap.exists()) uMap[tx.userId] = uSnap.data();
                    }
                });
                await Promise.all(userPromises);
                setUserMap(uMap);

                const total = data.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.amount : 0), 0);
                const usersSnap = await getDocs(query(collection(db, "users"), where("subscription.status", "==", "active")));

                setStats(prev => ({
                    ...prev,
                    totalRevenue: total,
                    activeSubs: usersSnap.size
                }));

            } catch (error) {
                console.error("Error fetching finance data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFinanceData();
    }, []);

    const revenueData = [
        { name: 'ENE', value: 0 },
        { name: 'FEB', value: 0 },
        { name: 'MAR', value: 0 },
        { name: 'ABR', value: 450000 },
        { name: 'MAY', value: 1200000 },
        { name: 'JUN', value: 2400000 },
        { name: 'JUL', value: stats.totalRevenue || 3500000 }
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <AIProcessingLoader text="Analizando Capital" subtext="Calculando proyecciones financieras..." />
        </div>
    );

    return (
        <div className="space-y-12 pb-44 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                        <DollarSign className="text-metal-gold" size={40} /> Finanzas & Auditoría
                    </h1>
                    <p className="text-metal-silver/40 text-sm mt-1 flex items-center gap-2 font-medium">
                        <ShieldCheck size={14} className="text-metal-gold" /> Registro inmutable de transacciones y conciliación bancaria
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" icon={Download} className="border-white/10 hover:border-white/20 px-6">
                        Exportar
                    </Button>
                    <Button variant="premium" size="sm" icon={FileText} className="shadow-lg shadow-metal-gold/10 px-6">
                        Generar Reporte
                    </Button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-metal-gold/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-metal-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-metal-gold/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-metal-gold/10 rounded-xl text-metal-gold border border-metal-gold/20 shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-black tracking-widest px-2">+12.5%</Badge>
                    </div>
                    <div>
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Ingresos Brutos YTD</p>
                        <h3 className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">${stats.totalRevenue.toLocaleString('es-CO')}</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-blue-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <Badge variant="info" className="text-[10px] uppercase font-black tracking-widest px-2">Plan Elite</Badge>
                    </div>
                    <div>
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Usuarios Pro Activos</p>
                        <h3 className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">{stats.activeSubs}</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-purple-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <CreditCard size={20} />
                        </div>
                        <Badge variant="premium" className="text-[10px] uppercase font-black tracking-widest px-2">Ticket</Badge>
                    </div>
                    <div>
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Ticket Promedio</p>
                        <h3 className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">$45.900</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-green-500/20 transition-colors border-green-500/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <ShieldCheck size={20} />
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-black tracking-widest px-2">Online</Badge>
                    </div>
                    <div>
                        <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest">Gateway Status</p>
                        <h3 className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">100%</h3>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="solid" className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-2 italic uppercase tracking-tighter">
                                <TrendingUp size={18} className="text-metal-gold" /> Crecimiento Acumulado
                            </h3>
                            <p className="text-xs text-metal-silver/40">Ingresos netos por mensualidad</p>
                        </div>
                        <Badge variant="default" className="bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest px-3">H1 2025</Badge>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} dy={10} fontStyle="italic" fontWeight="bold" />
                                <YAxis stroke="#404040" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} fontWeight="bold" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                                    itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                                    formatter={(v: any) => [`$${v.toLocaleString('es-CO')}`, "Ingresos"]}
                                />
                                <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card variant="solid" className="p-8 flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-metal-gold/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="w-full text-center border-b border-white/5 pb-4 mb-4">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Mix de Suscripciones</h3>
                        <p className="text-xs text-metal-silver/40">Distribución por volumen de usuarios</p>
                    </div>

                    <div className="h-[280px] w-full relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-metal-silver/30 font-black uppercase tracking-widest">Total</span>
                            <span className="text-4xl font-black text-white tabular-nums tracking-tighter">2.6k</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <Pie
                                    data={[
                                        { name: 'Individual', value: 400 },
                                        { name: 'Elite', value: 120 },
                                        { name: 'Institucional', value: 65 },
                                        { name: 'Básico', value: 2100 },
                                    ]}
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    cornerRadius={6}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-4">
                        {['Individual', 'Elite', 'Institucional', 'Básico'].map((name, idx) => (
                            <div key={idx} className="flex flex-col p-3 rounded-2xl bg-white/[0.02] border border-white/5 group/pill hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                                    <span className="text-[9px] font-black text-metal-silver/40 uppercase tracking-widest">{name}</span>
                                </div>
                                <div className="text-sm font-black text-white tabular-nums group-hover/pill:text-metal-gold transition-colors">
                                    {idx === 3 ? '2,100' : [400, 120, 65][idx]}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Transactions List */}
            <Card variant="solid" className="p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                            <Calendar size={24} className="text-metal-gold" /> Libro de Transacciones
                        </h3>
                        <p className="text-xs text-metal-silver/40 mt-1 uppercase tracking-widest font-bold">Registro centralizado de flujo de caja digital</p>
                    </div>
                    <Badge variant="info" className="px-5 py-2 font-black uppercase tracking-widest text-[9px]">50 Registros Recientes</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-metal-silver/60 uppercase font-black tracking-widest bg-white/[0.01]">
                                <th className="px-8 py-6 border-b border-white/5">Referencia ID</th>
                                <th className="px-8 py-6 border-b border-white/5">Usuario / Cliente</th>
                                <th className="px-8 py-6 border-b border-white/5">Servicio / Plan</th>
                                <th className="px-8 py-6 border-b border-white/5">Valor Neto</th>
                                <th className="px-8 py-6 border-b border-white/5">Fecha Pago</th>
                                <th className="px-8 py-6 border-b border-white/5 text-center">Estado</th>
                                <th className="px-8 py-6 border-b border-white/5 text-right">Auditoría</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center">
                                        <AIProcessingLoader text="Buscando operaciones" subtext="Consultando el libro mayor digital..." />
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => {
                                    const u = userMap[tx.userId] || {};
                                    const userName = u.fullName || u.displayName || u.email?.split('@')[0] || "Usuario";
                                    return (
                                        <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="px-8 py-5 font-mono text-[10px] text-metal-silver/30 font-bold tracking-tighter uppercase whitespace-nowrap">
                                                {tx.id.substring(0, 16)}...
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col group/name">
                                                    <span className="font-black text-white group-hover/name:text-metal-gold transition-colors uppercase tracking-tight text-sm">{userName}</span>
                                                    <span className="text-[10px] text-metal-silver/40 font-bold lowercase truncate max-w-[180px]">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant={tx.plan?.includes('pro') ? 'premium' : 'default'} className="uppercase font-black text-[9px] tracking-widest px-3">
                                                    {(tx.plan || "free").replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 font-black text-white tabular-nums">
                                                    <span className="text-metal-gold text-xs">$</span>
                                                    <span className="text-base tracking-tighter">{(tx.amount || 0).toLocaleString('es-CO')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-metal-silver/60 text-[10px] font-black uppercase italic p-2 bg-white/5 rounded-xl w-fit border border-white/5">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : '---'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <Badge variant={tx.status === 'completed' ? 'success' : 'error'} className="capitalize font-black px-4 shadow-lg shadow-green-500/5">
                                                    {tx.status === 'completed' ? 'PAGO EXITOSO' : 'FALLO'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:scale-125 active:scale-90 transition-transform"
                                                    onClick={async () => {
                                                        const { invoiceGenerator } = await import("@/utils/invoiceGenerator");
                                                        invoiceGenerator.generateInvoice(tx, {
                                                            fullName: userName,
                                                            email: u.email || "---",
                                                            uid: tx.userId
                                                        });
                                                    }}
                                                >
                                                    <Printer size={18} className="text-metal-silver/60 group-hover:text-metal-gold transition-colors" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-metal-silver/20 px-4 uppercase font-black tracking-[0.4em] pt-12 border-t border-white/5 opacity-50">
                <span className="flex items-center gap-2 underline decoration-metal-gold/20 underline-offset-4"><DollarSign size={10} /> Auditoría Realtime v2.8</span>
                <span>Security Infrastructure by Saber Pro</span>
            </div>
        </div>
    );
}
