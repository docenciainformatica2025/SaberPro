"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { ShieldAlert, Clock, User, Activity, Search, Filter, Terminal, Database } from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface AuditLog {
    id: string;
    adminEmail: string;
    action: string;
    target: string;
    details: string;
    timestamp: Timestamp;
}

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "admin_audit"),
            orderBy("timestamp", "desc"),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as AuditLog));
            setLogs(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTime = (ts: Timestamp) => {
        if (!ts) return "Reciente";
        return ts.toDate().toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'medium'
        });
    };

    const getActionVariant = (action: string): "default" | "success" | "warning" | "error" | "premium" | "info" => {
        const act = action.toUpperCase();
        if (act.includes("DELETE") || act.includes("REMOVE")) return "error";
        if (act.includes("UPDATE") || act.includes("EDIT")) return "warning";
        if (act.includes("CREATE") || act.includes("ADD")) return "success";
        if (act.includes("RESET") || act.includes("PASSWORD")) return "info";
        return "default";
    };

    const filteredLogs = logs.filter(log =>
        log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <AIProcessingLoader text="Sincronizando Auditoría" subtext="Obteniendo registros inmutables..." />;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <Terminal className="text-brand-primary" size={48} /> Auditoría Central
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 flex items-center gap-2 font-black uppercase tracking-widest opacity-70">
                        <ShieldAlert size={14} className="text-brand-primary" /> Ledger Inmutable v4.5 • Trazabilidad Total
                    </p>
                </div>
                <Badge variant="success" className="bg-green-500/10 text-green-400 border-green-500/20 animate-pulse font-black uppercase tracking-widest text-[10px] px-6 py-2.5 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    ● Monitoreo en Tiempo Real
                </Badge>
            </div>

            {/* Quick Stats / Filter Bar */}
            <Card variant="solid" className="p-3 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 bg-[var(--theme-bg-surface)] backdrop-blur-xl border-[var(--theme-border-soft)] shadow-2xl">
                <div className="flex-1 relative group">
                    <Input
                        placeholder="Buscar por administrador, acción o detalle técnico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] focus:border-brand-primary/30 h-14 text-sm font-medium transition-all"
                        aria-label="Buscar en el registro de auditoría"
                    />
                </div>
                <div className="flex items-center px-8 text-xs font-black text-brand-primary uppercase tracking-[0.3em] border-l border-[var(--theme-border-soft)] ml-2 italic">
                    {filteredLogs.length} Entradas
                </div>
            </Card>

            {/* Audit Feed Table */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--theme-text-secondary)]">
                        <thead className="bg-[var(--theme-bg-base)] text-[10px] uppercase font-semibold tracking-[0.2em] text-brand-primary border-b border-[var(--theme-border-soft)]">
                            <tr>
                                <th className="p-4 pl-6">Marca de Tiempo</th>
                                <th className="p-4">Administrador</th>
                                <th className="p-4">Acción Ejecutada</th>
                                <th className="p-4">Detalle Académico/Técnico</th>
                                <th className="p-4 text-right pr-6">ID Destino</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--theme-border-soft)]">
                            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-[var(--theme-bg-surface)]/20 transition-colors">
                                    <td className="p-4 pl-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-[11px] font-mono text-theme-text-secondary/70">
                                            <Clock size={12} className="text-brand-primary/40" />
                                            {formatTime(log.timestamp)}
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center text-[10px] text-[var(--theme-bg-base)] font-semibold ring-2 ring-[var(--theme-border-soft)]">
                                                {log.adminEmail[0].toUpperCase()}
                                            </div>
                                            <span className="text-[var(--theme-text-primary)] font-medium group-hover:text-brand-primary transition-colors">{log.adminEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <Badge variant={getActionVariant(log.action)} className="font-semibold text-[9px] uppercase tracking-tight">
                                            {log.action.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-[var(--theme-text-secondary)]/70 max-w-xs xl:max-w-md">
                                        <p className="line-clamp-2 leading-tight italic">&quot;{log.details}&quot;</p>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <span className="font-mono text-[10px] text-theme-text-secondary/30 bg-[var(--theme-bg-base)] px-2 py-1 rounded select-all hover:text-[var(--theme-text-primary)] transition-colors">
                                            {log.target}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <ShieldAlert size={64} className="mb-4 text-brand-primary opacity-10 animate-pulse" />
                                            <p className="text-theme-text-secondary/40 text-[10px] uppercase font-semibold tracking-wider leading-none">Protocolo &quot;Confiar pero Verificar&quot; Activo</p>
                                            <p className="text-[10px] text-[var(--theme-text-tertiary)] mt-1">La base de datos de auditoría está vacía para estos criterios.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-theme-text-secondary/30 px-2 uppercase font-bold tracking-wider">
                <span>Concepto de Certificación ISO/IEC 27001</span>
                <span>Saber Pro Suite v2.0</span>
            </div>
        </main>
    );
}
