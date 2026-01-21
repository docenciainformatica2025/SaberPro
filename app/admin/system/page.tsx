"use client";

import { useState, useEffect } from "react";
import { Activity, Database, Server, Smartphone, Globe, ShieldCheck, Wifi, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFirestore, doc, getDoc, enableNetwork } from "firebase/firestore";
import { app } from "@/lib/firebase"; // Ensure this import path is correct for your project
import { getAuth } from "firebase/auth";

// ... (imports remain)

export default function SystemStatusPage() {
    const [status, setStatus] = useState<any>({
        database: 'checking',
        auth: 'checking',
        api: 'checking',
        latency: 0,
        server: null // New field for server metrics
    });
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const checkSystem = async () => {
        const start = performance.now();
        const newStatus: any = { ...status };

        // 1. Check Database Connection
        try {
            const db = getFirestore(app);
            await enableNetwork(db);
            newStatus.database = 'online';
        } catch (e) {
            console.error(e);
            newStatus.database = 'offline';
        }

        // 2. Check Auth
        try {
            const auth = getAuth(app);
            if (auth) newStatus.auth = 'online';
            else newStatus.auth = 'offline';
        } catch (e) {
            newStatus.auth = 'error';
        }

        // 3. Server Health & Latency (Real API Call)
        try {
            const res = await fetch('/api/health'); // Ping our new route
            const data = await res.json();
            const end = performance.now();

            newStatus.latency = Math.round(end - start);
            newStatus.server = data; // Store full server metrics

            if (res.ok && newStatus.latency < 500) newStatus.api = 'excellent';
            else if (res.ok) newStatus.api = 'good';
            else newStatus.api = 'error';

        } catch (e) {
            newStatus.api = 'offline';
        }

        setStatus(newStatus);
        setLastCheck(new Date());
    };

    // ... (useEffect remains same)

    // ... (useEffect remains same)

    const StatusIndicator = ({ state }: { state: string }) => {
        const colors: any = {
            online: "bg-green-500",
            excellent: "bg-green-500",
            good: "bg-yellow-500",
            slow: "bg-orange-500",
            offline: "bg-red-500",
            error: "bg-red-500",
            checking: "bg-gray-500 animate-pulse"
        };
        const labels: any = {
            online: "Operativo",
            excellent: "Óptimo",
            good: "Bueno",
            slow: "Lento",
            offline: "Caído",
            error: "Error",
            checking: "Verificando..."
        };

        return (
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${colors[state] || "bg-gray-500"}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${state === 'checking' ? 'text-gray-400' : 'text-white'}`}>
                    {labels[state] || state}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
                        Estado del Sistema
                    </h1>
                    <p className="text-metal-silver text-sm font-medium">
                        Monitoreo en tiempo real de infraestructura, recursos y red.
                    </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 border-metal-gold/30 text-metal-gold">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Actualizado: {lastCheck.toLocaleTimeString()}
                    </span>
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Database Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-blue-500/10 w-fit rounded-xl text-blue-400">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Base de Datos</h3>
                            <StatusIndicator state={status.database} />
                        </div>
                    </div>
                </Card>

                {/* Auth Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-purple-500/10 w-fit rounded-xl text-purple-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Autenticación</h3>
                            <StatusIndicator state={status.auth} />
                        </div>
                    </div>
                </Card>

                {/* API / Latency Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wifi size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-green-500/10 w-fit rounded-xl text-green-400">
                            <Wifi size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Latencia API</h3>
                            <div className="flex items-center gap-2">
                                <StatusIndicator state={status.api} />
                                {status.latency > 0 && (
                                    <span className="text-[10px] text-metal-silver font-mono bg-white/5 px-2 rounded">
                                        {status.latency}ms
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Server Resources (New) */}
                <Card variant="glass" className="p-6 relative overflow-hidden group border-metal-gold/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-metal-gold/10 w-fit rounded-xl text-metal-gold">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Recursos (RAM)</h3>
                            {status.server ? (
                                <div className="flex flex-col">
                                    <span className="text-sm text-white font-mono font-bold">{status.server.memory?.rss || 'N/A'}</span>
                                    <span className="text-[10px] text-metal-silver uppercase tracking-wider">
                                        Uptime: {status.server.uptime ? Math.round(status.server.uptime) + 's' : '0s'}
                                    </span>
                                </div>
                            ) : (
                                <StatusIndicator state="checking" />
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Detailed Logs */}
            <Card variant="glass" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Activity size={20} className="text-metal-gold" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Logs de Diagnóstico Recientes</h3>
                </div>

                <div className="space-y-2 font-mono text-xs">
                    {status.server && (
                        <div className="flex gap-4 p-3 rounded bg-black/40 border-l-2 border-metal-gold">
                            <span className="text-metal-silver">{new Date().toLocaleTimeString()}</span>
                            <span className="text-metal-gold font-bold">[SERVER]</span>
                            <span className="text-gray-300">
                                Health Check OK. Environment: {status.server.env}. Heap Used: {status.server.memory?.heapUsed}.
                            </span>
                        </div>
                    )}
                    <div className="flex gap-4 p-3 rounded bg-black/40 border-l-2 border-green-500">
                        <span className="text-metal-silver">{new Date(lastCheck.getTime() - 100).toLocaleTimeString()}</span>
                        <span className="text-green-400 font-bold">[DB]</span>
                        <span className="text-gray-300">Firebase Firestore Connection Established. Cloud operations ready.</span>
                    </div>
                    {status.auth === 'error' && (
                        <div className="flex gap-4 p-3 rounded bg-red-900/20 border-l-2 border-red-500 animate-pulse">
                            <span className="text-metal-silver">{new Date().toLocaleTimeString()}</span>
                            <span className="text-red-400 font-bold">[CRITICAL]</span>
                            <span className="text-gray-300">Auth Service Unreachable. Check 'Authorized Domains' in Firebase Console.</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4 items-start">
                <Smartphone className="text-blue-400 shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Métricas de Serverless (Vercel)</h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                        Al usar arquitectura Serverless, la métrica de &quot;Carga CPU&quot; es efímera. Se muestra el <strong>Uptime de la Instancia</strong> y el <strong>Uso de Memoria (RSS)</strong> del contenedor actual ejecución. Tiempos de respuesta (Latencia API) bajos indican buena salud del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}
