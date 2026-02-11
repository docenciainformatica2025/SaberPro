"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, limit, where, doc, getDoc } from "firebase/firestore";
import {
    PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer
} from "recharts";
import { ThemedGrid, ThemedXAxis, ThemedYAxis, ThemedTooltip } from "@/components/ui/ThemedChart";
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
    createdAt: { seconds: number; nanoseconds: number }; // Firebase Timestamp
    provider: string;
}

interface FinanceUserProfile {
    fullName?: string;
    displayName?: string;
    email?: string;
}

// Configuración de Colores de Marca (Inteligente)
const BRAND_COLORS = {
    gold: 'var(--brand-primary)',
    silver: 'var(--theme-text-secondary)',
    blue: 'var(--theme-text-info)',
    dark: 'var(--theme-bg-base)'
};

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userMap, setUserMap] = useState<Record<string, FinanceUserProfile>>({});
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

                const uMap: Record<string, FinanceUserProfile> = {};
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
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase animate-in fade-in slide-in-from-left-8 duration-700">
                        <DollarSign className="text-brand-primary" size={48} /> Finanzas & Auditoría
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 flex items-center gap-2 font-black uppercase tracking-widest opacity-70">
                        <ShieldCheck size={14} className="text-brand-primary" /> Ledger Inmutable v4.2 • Transacciones Seguras
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        className="border-[var(--theme-border-soft)] hover:border-brand-primary/30 px-8 h-12 text-[10px] font-black uppercase tracking-widest bg-[var(--theme-bg-base)]"
                    >
                        Exportar
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={FileText}
                        className="shadow-[var(--shadow-premium)] px-8 h-12 text-[10px] font-black uppercase tracking-widest ring-1 ring-white/10"
                    >
                        Generar Reporte
                    </Button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-brand-primary/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary border border-brand-primary/20 shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-semibold tracking-wider px-2">+12.5%</Badge>
                    </div>
                    <div>
                        <p className="text-[var(--theme-text-tertiary)] text-[10px] uppercase font-bold tracking-wider">Ingresos Brutos YTD</p>
                        <h3 className="text-3xl font-bold text-[var(--theme-text-primary)] mt-1 tabular-nums tracking-tight">${stats.totalRevenue.toLocaleString('es-CO')}</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-blue-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-bg-info-soft)] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-bg-info-soft)]/20 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                        <div className="p-3 bg-[var(--theme-bg-info-soft)] rounded-xl text-[var(--theme-text-info)] border border-[var(--theme-border-info)] shadow-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <Badge variant="info" className="text-[10px] uppercase font-bold tracking-wider px-2">Plan Elite</Badge>
                    </div>
                    <div>
                        <p className="text-[var(--theme-text-tertiary)] text-[10px] uppercase font-bold tracking-wider">Usuarios Pro Activos</p>
                        <h3 className="text-3xl font-bold text-[var(--theme-text-primary)] mt-1 tabular-nums tracking-tight">{stats.activeSubs}</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-purple-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 shadow-lg group-hover:scale-110 transition-transform">
                            <CreditCard size={20} />
                        </div>
                        <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider px-2">Ticket</Badge>
                    </div>
                    <div>
                        <p className="text-[var(--theme-text-tertiary)] text-[10px] uppercase font-bold tracking-wider">Ticket Promedio</p>
                        <h3 className="text-3xl font-bold text-[var(--theme-text-primary)] mt-1 tabular-nums tracking-tight">$45.900</h3>
                    </div>
                </Card>

                <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-green-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-bg-success-soft)] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-bg-success-soft)]/20 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                        <div className="p-3 bg-[var(--theme-bg-success-soft)] rounded-xl text-[var(--theme-text-success)] border border-[var(--theme-border-success)] shadow-lg group-hover:scale-110 transition-transform">
                            <ShieldCheck size={20} />
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider px-2">Online</Badge>
                    </div>
                    <div>
                        <p className="text-theme-text-secondary/60 text-xs uppercase font-black tracking-widest leading-none mb-1">Estado de Pasarela</p>
                        <h3 className="text-4xl font-black text-[var(--theme-text-primary)] tabular-nums tracking-tighter drop-shadow-xl">100%</h3>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="solid" className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2 italic uppercase tracking-tight">
                                <TrendingUp size={18} className="text-brand-primary" /> Crecimiento Acumulado
                            </h3>
                            <p className="text-xs text-[var(--theme-text-tertiary)]">Ingresos netos por mensualidad</p>
                        </div>
                        <Badge variant="default" className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] text-[10px] font-bold uppercase tracking-wider px-3">H1 2025</Badge>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <ThemedGrid vertical={false} />
                                <ThemedXAxis dataKey="name" />
                                <ThemedYAxis tickFormatter={(v) => `$${(v as number) / 1000}k`} />
                                <ThemedTooltip
                                    formatter={(v: any) => [`$${v?.toLocaleString('es-CO') || 0}`, "Ingresos"]}
                                />
                                <Area type="monotone" dataKey="value" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card variant="solid" className="p-8 flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="w-full text-center border-b border-[var(--theme-border-soft)] pb-4 mb-4">
                        <h3 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Mix de Suscripciones</h3>
                        <p className="text-xs text-[var(--theme-text-tertiary)]">Distribución por volumen de usuarios</p>
                    </div>

                    <div className="h-[280px] w-full relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-[var(--theme-text-quaternary)] font-bold uppercase tracking-wider">Total</span>
                            <span className="text-4xl font-bold text-[var(--theme-text-primary)] tabular-nums tracking-tight">2.6k</span>
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
                                <ThemedTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-4">
                        {['Individual', 'Elite', 'Institucional', 'Básico'].map((name, idx) => (
                            <div key={idx} className="flex flex-col p-3 rounded-2xl bg-[var(--theme-bg-surface)]/10 border border-[var(--theme-border-soft)] group/pill hover:bg-[var(--theme-bg-surface)]/20 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length].startsWith('var') ? `var(${CHART_COLORS[idx % CHART_COLORS.length].match(/\(([^)]+)\)/)?.[1]})` : CHART_COLORS[idx % CHART_COLORS.length] }} />
                                    <span className="text-[9px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">{name}</span>
                                </div>
                                <div className="text-sm font-bold text-[var(--theme-text-primary)] tabular-nums group-hover/pill:text-brand-primary transition-colors">
                                    {idx === 3 ? '2,100' : [400, 120, 65][idx]}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Transactions List */}
            <Card variant="solid" className="p-0 overflow-hidden border-[var(--theme-border-soft)] shadow-2xl">
                <div className="p-8 bg-[var(--theme-bg-surface)] border-b border-[var(--theme-border-soft)] flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3 italic uppercase tracking-tight">
                            <Calendar size={24} className="text-brand-primary" /> Libro de Transacciones
                        </h3>
                        <p className="text-xs text-[var(--theme-text-tertiary)] mt-1 uppercase tracking-wider font-bold">Registro centralizado de flujo de caja digital</p>
                    </div>
                    <Badge variant="info" className="px-5 py-2 font-bold uppercase tracking-wider text-[9px]">50 Registros Recientes</Badge>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden p-4 space-y-4">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <AIProcessingLoader text="Buscando operaciones" subtext="Consultando el libro mayor digital..." />
                        </div>
                    ) : (
                        transactions.map(tx => {
                            const u = userMap[tx.userId] || {};
                            const userName = u.fullName || u.displayName || u.email?.split('@')[0] || "Usuario";
                            return (
                                <div key={tx.id} className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-mono text-theme-text-secondary/50 tracking-wider uppercase">REF: {tx.id.substring(0, 8)}</p>
                                            <h4 className="text-[var(--theme-text-primary)] font-bold uppercase tracking-tight">{userName}</h4>
                                            <p className="text-xs text-theme-text-secondary/50 truncate max-w-[200px]">{u.email}</p>
                                        </div>
                                        <Badge variant={tx.status === 'completed' ? 'success' : 'error'} className="shadow-none text-[9px] px-2 py-1">
                                            {tx.status === 'completed' ? 'EXITOSO' : 'FALLO'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[var(--theme-border-soft)] pt-4">
                                        <div>
                                            <p className="text-[9px] text-theme-text-secondary/40 uppercase font-bold tracking-wider mb-1">Servicio</p>
                                            <Badge variant={tx.plan?.includes('pro') ? 'premium' : 'default'} className="uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">
                                                {(tx.plan || "free").replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-theme-text-secondary/40 uppercase font-bold tracking-wider mb-1">Monto</p>
                                            <div className="flex items-center gap-1 font-bold text-[var(--theme-text-primary)] tabular-nums">
                                                <span className="text-brand-primary text-xs">$</span>
                                                <span className="text-lg tracking-tight">{(tx.amount || 0).toLocaleString('es-CO')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-theme-text-secondary/40 text-[10px] font-bold uppercase">
                                            <Calendar size={12} />
                                            {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-[10px] uppercase font-bold tracking-wider hover:text-brand-primary hover:bg-[var(--theme-bg-surface)]/20"
                                            onClick={async () => {
                                                const { invoiceGenerator } = await import("@/utils/invoiceGenerator");
                                                invoiceGenerator.generateInvoice(tx, {
                                                    fullName: userName,
                                                    email: u.email || "---",
                                                    uid: tx.userId
                                                });
                                            }}
                                        >
                                            <Printer size={14} className="mr-2" /> Recibo
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-theme-text-secondary/60 uppercase font-bold tracking-wider bg-[var(--theme-bg-base)]">
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Referencia ID</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Usuario / Cliente</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Servicio / Plan</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Valor Neto</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Fecha Pago</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] text-center">Estado</th>
                                <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] text-right">Auditoría</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--theme-border-soft)]">
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
                                        <tr key={tx.id} className="group hover:bg-[var(--theme-bg-surface)]/20 transition-all">
                                            <td className="px-8 py-5 font-mono text-[10px] text-theme-text-secondary/30 font-bold tracking-tight uppercase whitespace-nowrap">
                                                {tx.id.substring(0, 16)}...
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col group/name">
                                                    <span className="font-bold text-[var(--theme-text-primary)] group-hover/name:text-brand-primary transition-colors uppercase tracking-tight text-sm">{userName}</span>
                                                    <span className="text-[10px] text-theme-text-secondary/40 font-bold lowercase truncate max-w-[180px]">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant={tx.plan?.includes('pro') ? 'premium' : 'default'} className="uppercase font-bold text-[9px] tracking-wider px-3">
                                                    {(tx.plan || "free").replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 font-bold text-[var(--theme-text-primary)] tabular-nums">
                                                    <span className="text-brand-primary text-xs">$</span>
                                                    <span className="text-base tracking-tight">{(tx.amount || 0).toLocaleString('es-CO')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-theme-text-secondary/60 text-[10px] font-bold uppercase italic p-2 bg-[var(--theme-bg-base)] rounded-xl w-fit border border-[var(--theme-border-soft)]">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : '---'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <Badge variant={tx.status === 'completed' ? 'success' : 'error'} className="capitalize font-bold px-4 shadow-lg shadow-green-500/5">
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
                                                    <Printer size={18} className="text-theme-text-secondary/60 group-hover:text-brand-primary transition-colors" />
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

            <div className="flex justify-between items-center text-[10px] text-tertiary px-4 uppercase font-semibold tracking-[0.4em] pt-12 border-t border-[var(--theme-border-soft)] opacity-50">
                <span className="flex items-center gap-2 underline decoration-brand-primary/20 underline-offset-4"><DollarSign size={10} /> Auditoría en Tiempo Real v2.8</span>
                <span>Infraestructura de Seguridad por Saber Pro</span>
            </div>
        </main>
    );
}
