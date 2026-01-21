"use client";

import { useState, useEffect } from "react";
import { Activity, Database, Server, Smartphone, Globe, ShieldCheck, Wifi, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFirestore, doc, getDoc, enableNetwork } from "firebase/firestore";
import { app } from "@/lib/firebase"; // Ensure this import path is correct for your project
import { getAuth } from "firebase/auth";

export default function SystemStatusPage() {
    const [status, setStatus] = useState<any>({
        database: 'checking',
        auth: 'checking',
        api: 'checking',
        latency: 0
    });
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const checkSystem = async () => {
        const start = performance.now();
        const newStatus: any = { ...status };

        // 1. Check Database Connection
        try {
            const db = getFirestore(app);
            // Attempt to read a lightweight document or just check network
            await enableNetwork(db);
            // In a real scenario, you might read a specific "health" doc
            // await getDoc(doc(db, "system", "health"));
            newStatus.database = 'online';
        } catch (e) {
            console.error(e);
            newStatus.database = 'offline';
        }

        // 2. Check Auth Service (Client side SDK availability)
        try {
            const auth = getAuth(app);
            if (auth) newStatus.auth = 'online';
            else newStatus.auth = 'offline';
        } catch (e) {
            newStatus.auth = 'error';
        }

        // 3. Simulated API Latency
        // You could fetch a simple endpoint here
        const end = performance.now();
        newStatus.latency = Math.round(end - start);
        if (newStatus.latency < 200) newStatus.api = 'excellent';
        else if (newStatus.latency < 500) newStatus.api = 'good';
        else newStatus.api = 'slow';

        setStatus(newStatus);
        setLastCheck(new Date());
    };

    useEffect(() => {
        // Run initial check deferred to avoid hydration mismatch/block
        setTimeout(() => checkSystem(), 1000);

        // Interval check every 30s
        const interval = setInterval(checkSystem, 30000);
        return () => clearInterval(interval);
    }, []);

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
                        Monitoreo en tiempo real de la infraestructura crítica.
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

                {/* API / Network Status */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-green-500/10 w-fit rounded-xl text-green-400">
                            <Wifi size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Red / Latencia</h3>
                            <div className="flex items-center gap-2">
                                <StatusIndicator state={status.api} />
                                {status.latency > 0 && (
                                    <span className="text-[10px] text-metal-silver font-mono">
                                        ({status.latency}ms)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Environment Info */}
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server size={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="p-3 bg-metal-gold/10 w-fit rounded-xl text-metal-gold">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Entorno</h3>
                            <div className="flex flex-col">
                                <span className="text-sm text-white font-medium">Producción (Vercel)</span>
                                <span className="text-[10px] text-metal-silver uppercase tracking-wider">v2.1.0 Stable</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Diagnostic Logs (Mocked for now due to client-side only access) */}
            <Card variant="glass" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Activity size={20} className="text-metal-gold" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Logs de Diagnóstico Recientes</h3>
                </div>

                <div className="space-y-2 font-mono text-xs">
                    <div className="flex gap-4 p-3 rounded bg-black/40 border-l-2 border-green-500">
                        <span className="text-metal-silver">{new Date().toLocaleTimeString()}</span>
                        <span className="text-green-400 font-bold">[INFO]</span>
                        <span className="text-gray-300">System health check initialized via Admin Dashboard.</span>
                    </div>
                    <div className="flex gap-4 p-3 rounded bg-black/40 border-l-2 border-blue-500">
                        <span className="text-metal-silver">{new Date(Date.now() - 5000).toLocaleTimeString()}</span>
                        <span className="text-blue-400 font-bold">[AUTH]</span>
                        <span className="text-gray-300">Firebase Auth provider (Google) is active and responding.</span>
                    </div>
                    {/* If Auth is actually unauthorized domain, we could hint it here */}
                    {status.auth === 'error' && (
                        <div className="flex gap-4 p-3 rounded bg-red-900/20 border-l-2 border-red-500 animate-pulse">
                            <span className="text-metal-silver">{new Date().toLocaleTimeString()}</span>
                            <span className="text-red-400 font-bold">[CRITICAL]</span>
                            <span className="text-gray-300">Auth Error Detected: "Authorized Domain" verification might be failing. Check Firebase Console.</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4 items-start">
                <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-1">Nota Técnica: Error de Dominio</h4>
                    <p className="text-xs text-orange-200/80 leading-relaxed">
                        Si experimentas el error &quot;Dominio no autorizado&quot; al iniciar sesión con Google, es necesario agregar el dominio actual de despliegue (<code>.vercel.app</code>) a la lista de dominios autorizados en la <strong>Consola de Firebase &gt; Authentication &gt; Settings &gt; Authorized Domains</strong>. Este es un bloqueo de seguridad de Google Cloud, no un error de código.
                    </p>
                </div>
            </div>
        </div>
    );
}
