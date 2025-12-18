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
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <Terminal className="text-metal-gold" /> Registro de Auditoría
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2">
                        <Database size={14} /> Control central de trazabilidad administrativa (Ley 1581)
                    </p>
                </div>
                <Badge variant="success" className="bg-green-500/10 text-green-400 border-green-500/20 animate-pulse">
                    ● Monitoreo en Tiempo Real
                </Badge>
            </div>

            {/* Quick Stats / Filter Bar */}
            <Card variant="solid" className="p-2 flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <div className="flex-1">
                    <Input
                        placeholder="Buscar por admin, acción o detalle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        className="bg-black/40 border-transparent focus:bg-black/60"
                    />
                </div>
                <div className="flex items-center px-4 text-xs font-bold text-metal-gold uppercase tracking-widest border-l border-white/5 ml-2">
                    {filteredLogs.length} Entradas
                </div>
            </Card>

            {/* Audit Feed Table */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-metal-silver">
                        <thead className="bg-black/40 text-[10px] uppercase font-black tracking-[0.2em] text-metal-gold border-b border-white/5">
                            <tr>
                                <th className="p-4 pl-6">Marca de Tiempo</th>
                                <th className="p-4">Administrador</th>
                                <th className="p-4">Acción Ejecutada</th>
                                <th className="p-4">Detalle Académico/Técnico</th>
                                <th className="p-4 text-right pr-6">ID Destino</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 pl-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-[11px] font-mono text-metal-silver/70">
                                            <Clock size={12} className="text-metal-gold/40" />
                                            {formatTime(log.timestamp)}
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-metal-gold to-yellow-600 flex items-center justify-center text-[10px] text-black font-black ring-2 ring-white/5">
                                                {log.adminEmail[0].toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium group-hover:text-metal-gold transition-colors">{log.adminEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <Badge variant={getActionVariant(log.action)} className="font-black text-[9px] uppercase tracking-tighter">
                                            {log.action.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-white/70 max-w-xs xl:max-w-md">
                                        <p className="line-clamp-2 leading-tight italic">"{log.details}"</p>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <span className="font-mono text-[10px] text-metal-silver/30 bg-white/5 px-2 py-1 rounded select-all hover:text-white transition-colors">
                                            {log.target}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <ShieldAlert size={64} className="mb-4 text-metal-gold opacity-10 animate-pulse" />
                                            <p className="text-metal-silver/40 text-[10px] uppercase font-black tracking-widest leading-none">&quot;Trust but Verify&quot; Protocol Active</p>
                                            <p className="text-[10px] text-metal-silver/20 mt-1">La base de datos de auditoría está vacía para estos criterios.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-bold tracking-widest">
                <span>Certificación ISO/IEC 27001 Concept</span>
                <span>Saber Pro Suite v2.0</span>
            </div>
        </div>
    );
}
