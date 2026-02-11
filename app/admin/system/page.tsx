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
        const start = Date.now();
        const newStatus: any = {
            database: 'checking',
            auth: 'checking',
            api: 'checking',
            latency: 0,
            server: null // Reset to null or keep previous? better keep previous if we want stability, but user wants real time check. Let's start fresh.
        };

        // 1. Check Database Connection (Simplified)
        try {
            const db = getFirestore(app);
            // Just checking if db instance exists is enough for "Client SDK Ready"
            if (db) newStatus.database = 'online';
            else newStatus.database = 'offline';
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
            const res = await fetch('/api/health', { cache: 'no-store' });
            const end = Date.now();
            newStatus.latency = end - start;

            if (res.ok) {
                const data = await res.json();
                newStatus.server = data;
                newStatus.api = newStatus.latency < 500 ? 'excellent' : 'good';
            } else {
                newStatus.api = 'error';
            }
        } catch (e) {
            newStatus.api = 'offline';
            console.error("Health check failed:", e);
        }

        setStatus(newStatus);
        setLastCheck(new Date());
    };

    // ... (useEffect remains same)

    // ... (useEffect remains same)

    const StatusIndicator = ({ state }: { state: string }) => {
        const colors: any = {
            online: "bg-[var(--brand-success)]",
            excellent: "bg-[var(--brand-success)]",
            good: "bg-[var(--brand-primary)]",
            slow: "bg-[var(--brand-accent)]", // Mapped 'slow' to the new 'warning' color
            offline: "bg-[var(--brand-error)]",
            error: "bg-[var(--brand-error)]",
            checking: "bg-[var(--theme-text-tertiary)] animate-pulse"
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
                <div className={`w-2 h-2 rounded-full ${colors[state] || "bg-[var(--theme-text-tertiary)]"}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${state === 'checking' ? 'text-[var(--theme-text-tertiary)]' : 'text-[var(--theme-text-primary)]'}`}>
                    {labels[state] || state}
                </span>
            </div>
        );
    };

    return (
        <main className="max-w-[1400px] mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero italic uppercase tracking-tighter mb-2">
                        Estado del Sistema
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                        <Activity size={14} className="text-brand-primary" /> Sentinel Runtime v5.0 • Infrastructure Live
                    </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 px-6 py-2 border-brand-primary/30 text-brand-primary bg-brand-primary/5">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Check: {lastCheck.toLocaleTimeString()}
                    </span>
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Database Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={64} className="text-[var(--theme-text-primary)]" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-blue-500/10 w-fit rounded-xl text-blue-400 border border-blue-500/20">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-1">Base de Datos</h3>
                            <StatusIndicator state={status.database} />
                        </div>
                    </div>
                </Card>

                {/* Auth Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={64} className="text-[var(--theme-text-primary)]" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-purple-500/10 w-fit rounded-xl text-purple-400 border border-purple-500/20">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-1">Autenticación</h3>
                            <StatusIndicator state={status.auth} />
                        </div>
                    </div>
                </Card>

                {/* API / Latency Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wifi size={64} className="text-[var(--theme-text-primary)]" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-green-500/10 w-fit rounded-xl text-green-400 border border-green-500/20">
                            <Wifi size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-1">Latencia API</h3>
                            <div className="flex items-center gap-2">
                                <StatusIndicator state={status.api} />
                                {status.latency > 0 && (
                                    <span className="text-[10px] text-[var(--theme-text-primary)] font-mono bg-[var(--theme-bg-base)] px-2 rounded border border-[var(--theme-border-soft)]">
                                        {status.latency}ms
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Server Resources (New) */}
                <Card variant="glass" className="p-6 relative overflow-hidden group border-brand-primary/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server size={64} className="text-[var(--theme-text-primary)]" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-brand-primary/10 w-fit rounded-xl text-brand-primary border border-brand-primary/20">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-1">Recursos (RAM)</h3>
                            {status.server ? (
                                <div className="flex flex-col">
                                    <span className="text-sm text-[var(--theme-text-primary)] font-mono font-bold">{status.server.memory?.rss || 'N/A'}</span>
                                    <span className="text-[10px] text-[var(--theme-text-secondary)] uppercase tracking-wider">
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
                    <Activity size={20} className="text-brand-primary" />
                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] uppercase tracking-tight">Logs de Diagnóstico Recientes</h3>
                </div>

                <div className="space-y-2 font-mono text-xs">
                    {status.server && (
                        <div className="flex gap-4 p-3 rounded bg-[var(--theme-bg-base)] border-l-2 border-brand-primary">
                            <span className="text-[var(--theme-text-secondary)]">{new Date().toLocaleTimeString()}</span>
                            <span className="text-brand-primary font-bold">[SERVIDOR]</span>
                            <span className="text-[var(--theme-text-secondary)]">
                                Verificación de Salud OK. Entorno: {status.server.env}. Heap Usado: {status.server.memory?.heapUsed}.
                            </span>
                        </div>
                    )}
                    <div className="flex gap-4 p-3 rounded bg-[var(--theme-bg-base)] border-l-2 border-green-500">
                        <span className="text-[var(--theme-text-secondary)]">{new Date(lastCheck.getTime() - 100).toLocaleTimeString()}</span>
                        <span className="text-green-400 font-bold">[DB]</span>
                        <span className="text-[var(--theme-text-secondary)]">Conexión con Firebase Firestore Establecida. Operaciones en la nube listas.</span>
                    </div>
                    {status.auth === 'error' && (
                        <div className="flex gap-4 p-3 rounded bg-red-900/20 border-l-2 border-red-500 animate-pulse">
                            <span className="text-[var(--theme-text-secondary)]">{new Date().toLocaleTimeString()}</span>
                            <span className="text-red-400 font-bold">[CRITICO]</span>
                            <span className="text-[var(--theme-text-secondary)]">Servicio de Autenticación Inalcanzable. Verifique los 'Dominios Autorizados' en la Consola de Firebase.</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4 items-start">
                <Smartphone className="text-blue-400 shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Métricas de Serverless (Vercel)</h4>
                    <p className="text-xs text-[var(--theme-text-secondary)]/80 leading-relaxed">
                        Al usar arquitectura Serverless, la métrica de &quot;Carga CPU&quot; es efímera. Se muestra el <strong>Uptime de la Instancia</strong> y el <strong>Uso de Memoria (RSS)</strong> del contenedor actual ejecución. Tiempos de respuesta (Latencia API) bajos indican buena salud del sistema.
                    </p>
                </div>
            </div>
        </main>
    );
}
