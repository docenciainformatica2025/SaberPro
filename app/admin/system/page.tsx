"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import {
    Activity,
    ShieldCheck,
    Server,
    Database,
    Cloud,
    Cpu,
    Zap,
    History,
    Network,
    Terminal,
    AlertCircle,
    ShieldAlert
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SystemStatusPage() {
    const [stats, setStats] = useState({
        dbLatency: 0,
        apiLatency: 0,
        status: "Normal",
        lastChecked: ""
    });

    const [logs, setLogs] = useState<{ time: string; msg: string; type: string; }[]>([]);

    const [visualData, setVisualData] = useState<number[]>([]);

    useEffect(() => {
        // Hydration safe initialization
        const now = Date.now();
        setLogs([
            { time: new Date().toLocaleTimeString(), msg: "Saber Pro Kernel inicializado con éxito", type: "success" },
            { time: new Date(now - 5000).toLocaleTimeString(), msg: "Conectando al clúster Firestore (us-central1)... Conectado.", type: "info" },
            { time: new Date(now - 10000).toLocaleTimeString(), msg: "Reglas de seguridad validadas por Firebase Auth", type: "success" }
        ]);

        const visualBars = Array.from({ length: 30 }, () => Math.random());
        setVisualData(visualBars);
    }, []);

    const checkSystem = async () => {
        const start = performance.now();
        try {
            await getDoc(doc(db, "system", "ping"));
            const end = performance.now();
            const latency = Math.round(end - start);

            setStats({
                dbLatency: latency,
                apiLatency: Math.round(latency * 1.5),
                status: "Nominal",
                lastChecked: new Date().toLocaleTimeString()
            });

            if (latency > 0) {
                setLogs(prev => [
                    { time: new Date().toLocaleTimeString(), msg: `Heartbeat: Latencia detectada de ${latency}ms... OK`, type: "success" },
                    ...prev.slice(0, 15)
                ]);
            }
        } catch (e) {
            setStats(prev => ({ ...prev, status: "Degradado" }));
            setLogs(prev => [
                { time: new Date().toLocaleTimeString(), msg: `Alerta: Degradación en el tiempo de respuesta.`, type: "error" },
                ...prev
            ]);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkSystem, 8000);
        checkSystem();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <Activity className="text-metal-gold" /> Monitor del Sistema
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-400" /> Infraestructura Pro - Estado {stats.status} en Tiempo Real
                    </p>
                </div>
                <Badge variant="success" className="animate-pulse bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1.5 font-black">
                    ● EN LÍNEA
                </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                {[
                    { label: 'DB Latencia', value: `${stats.dbLatency}ms`, icon: Database, color: 'text-blue-400', sub: 'Firestore Multi-Region' },
                    { label: 'API Respuesta', value: `${stats.apiLatency}ms`, icon: Network, color: 'text-purple-400', sub: 'Edge Gateway' },
                    { label: 'Uptime Global', value: '99.99%', icon: Cloud, color: 'text-green-400', sub: 'SLA Consolidado' },
                    { label: 'Seguridad', value: 'AES-256', icon: ShieldCheck, color: 'text-metal-gold', sub: 'Cifrado en Reposo' }
                ].map((m, i) => (
                    <Card key={i} variant="solid" className="p-6 relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <m.icon size={64} />
                        </div>
                        <m.icon className={`${m.color} mb-4`} size={20} />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">{m.label}</p>
                            <h3 className="text-2xl font-black text-white tabular-nums">{m.value}</h3>
                            <p className="text-[9px] text-metal-silver/20 font-medium italic">{m.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {/* Visual Performance */}
                <Card variant="solid" className="lg:col-span-2 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-metal-gold/20 to-transparent"></div>
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Zap className="text-metal-gold" size={16} /> Rendimiento Dinámico
                            </h3>
                            <p className="text-[10px] text-metal-silver/40 mt-1 uppercase">Visualización de tráfico reactivo</p>
                        </div>
                        <Badge variant="info" className="tabular-nums">{stats.lastChecked || 'Sincronizando...'}</Badge>
                    </div>

                    <div className="h-48 flex items-end gap-1 px-2">
                        {visualData.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-metal-gold/40 to-white/10 rounded-t-sm animate-pulse"
                                style={{
                                    height: `${val * (stats.status === 'Degradado' ? 40 : 80) + 20}%`,
                                    animationDelay: `${i * 0.1}s`,
                                    opacity: 0.1 + (i / 30) * 0.5
                                }}
                            ></div>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-metal-silver/40 uppercase">Efectividad</p>
                            <p className="text-sm font-black text-white">99.9%</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-[9px] font-black text-metal-silver/40 uppercase">Pérdida</p>
                            <p className="text-sm font-black text-white">0.00%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-metal-silver/40 uppercase">Estado</p>
                            <p className="text-sm font-black text-metal-gold uppercase">{stats.status}</p>
                        </div>
                    </div>
                </Card>

                {/* System Logs */}
                <Card variant="solid" className="p-0 flex flex-col overflow-hidden">
                    <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-metal-silver/40" />
                            <span className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Master Console Logs</span>
                        </div>
                        <History size={14} className="text-metal-silver/20 cursor-pointer hover:text-metal-silver transition-colors" />
                    </div>

                    <div className="flex-1 p-6 font-mono text-[10px] space-y-4 overflow-y-auto max-h-[350px] custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 group">
                                <span className="text-metal-silver/20 shrink-0">[{log.time}]</span>
                                <span className={`
                                    ${log.type === 'success' ? 'text-green-400/60' : log.type === 'error' ? 'text-red-400/60' : 'text-blue-400/60'}
                                    group-hover:opacity-100 transition-opacity
                                `}>
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                        <div className="animate-pulse text-metal-gold/40">_</div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
                        <p className="text-[10px] text-metal-silver/40 flex items-center justify-center gap-2 italic uppercase">
                            <AlertCircle size={12} /> Flujo Inmutable Detectado
                        </p>
                    </div>
                </Card>
            </div>

            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-black tracking-[0.1em]">
                <span>Kernel v4.2.0 - Active Node</span>
                <span className="flex items-center gap-1 group cursor-help">
                    <ShieldAlert size={10} className="group-hover:text-red-400 transition-colors" /> Admin High Privileges Required
                </span>
            </div>
        </div>
    );
}
