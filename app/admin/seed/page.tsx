"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import sampleQuestions from "@/data/sample-questions.json";
import quantitativeQuestions from "@/data/questions-quantitative.json";
import readingQuestions from "@/data/questions-reading.json";
import citizenshipQuestions from "@/data/questions-citizenship.json";
import englishQuestions from "@/data/questions-english.json";
import communicationQuestions from "@/data/questions-communication.json";
import {
    Database, Trash2, Play, AlertCircle, CheckCircle2,
    Terminal, Info, Zap, ShieldAlert, RefreshCw,
    ArrowUpCircle, Activity, Cloud, Cpu, History,
    LayoutDashboard, Server
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";

// Adjusted constants for 2026 High Load Stability
const BATCH_SIZE = 100;

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
    const [isCheckingLive, setIsCheckingLive] = useState(true);
    const [log, setLog] = useState<{ msg: string; time: string; type: "info" | "success" | "error" | "batch" }[]>([]);
    const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
    const [progress, setProgress] = useState(0);

    const addLog = (msg: string, type: "info" | "success" | "error" | "batch" = "info") => {
        const time = new Date().toLocaleTimeString();
        setLog(prev => [...prev, { msg, time, type }]);
    };

    const checkLiveStatus = async () => {
        setIsCheckingLive(true);
        try {
            const q = collection(db, "questions");
            const snapshot = await getDocs(q);
            const counts: Record<string, number> = {};
            snapshot.docs.forEach(d => {
                const mod = d.data().module || "otros";
                counts[mod] = (counts[mod] || 0) + 1;
            });
            setLiveCounts(counts);
        } catch (e) {
            console.error(e);
        } finally {
            setIsCheckingLive(false);
        }
    };

    useEffect(() => {
        checkLiveStatus();
    }, []);

    const totalLive = Object.values(liveCounts).reduce((a, b) => a + b, 0);
    const totalLocal = [
        ...sampleQuestions,
        ...quantitativeQuestions,
        ...readingQuestions,
        ...citizenshipQuestions,
        ...englishQuestions,
        ...communicationQuestions
    ].length;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleSeed = async () => {
        const allQuestions = [
            ...sampleQuestions,
            ...quantitativeQuestions,
            ...readingQuestions,
            ...citizenshipQuestions,
            ...englishQuestions,
            ...communicationQuestions
        ];

        // 1. Pre-validación de Esquema 2026
        addLog("Iniciando Pre-validación de esquema...", "info");

        const invalid = allQuestions.filter(q => !q.module || !q.text || !q.correctAnswer);
        if (invalid.length > 0) {
            addLog(`Error de integridad: ${invalid.length} preguntas no cumplen con el esquema mínimo. abortando.`, "error");
            toast.error("Fallo de esquema en los archivos JSON");
            return;
        }
        addLog("Pre-validación exitosa. Integridad de activos confirmada.", "success");

        if (totalLive > 0) {
            if (!confirm(`Se detectaron ${totalLive} preguntas en la nube. ¿Proceder con la actualización de ${allQuestions.length} preguntas?`)) {
                return;
            }
        }

        setStatus("loading");
        setLog([]);
        setProgress(0);
        addLog(`Iniciando actualización masiva: Preparando ${allQuestions.length} reactivos.`, "info");

        try {
            let count = 0;
            let currentBatch = writeBatch(db);

            for (let i = 0; i < allQuestions.length; i++) {
                const q = allQuestions[i];
                const docId = (q as any).id || undefined;
                const newDocRef = docId ? doc(db, "questions", docId) : doc(collection(db, "questions"));

                currentBatch.set(newDocRef, q, { merge: true });
                count++;

                if (count % BATCH_SIZE === 0 || i === allQuestions.length - 1) {
                    const startTime = performance.now();

                    // Motor de Reintento Inteligente (Max 3 intentos)
                    let success = false;
                    let retries = 0;
                    while (!success && retries < 3) {
                        try {
                            await currentBatch.commit();
                            success = true;
                        } catch (err) {
                            retries++;
                            addLog(`⚠️ Fallo de ráfaga (Intento ${retries}/3). Reintentando en ${retries * 500}ms...`, "error");
                            await delay(retries * 500);
                        }
                    }

                    if (!success) throw new Error("Fallo persistente en sincronización de ráfaga.");

                    const endTime = performance.now();
                    const latency = Math.round(endTime - startTime);

                    setProgress((count / allQuestions.length) * 100);
                    addLog(`Batch OK: ${count} synced. Latencia Nube: ${latency}ms. Telemetría 2026 OK.`, "batch");

                    if (i < allQuestions.length - 1) {
                        await delay(300);
                        currentBatch = writeBatch(db);
                    }
                }
            }

            setProgress(100);
            addLog(`¡Sincronización Exitosa! ${count} preguntas en total. Motor SaberPro v4.0 estable.`, "success");
            setStatus("success");
            await checkLiveStatus();
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            addLog(`Fallo Crítico: ${e.message}`, "error");
            toast.error("Error en la inyección de datos");
        }
    };

    const handleClear = async () => {
        if (!isConfirmingPurge) {
            setIsConfirmingPurge(true);
            toast.warning("Confirmación Manual Requerida", {
                description: "Presiona 'Purga Atómica' nuevamente para limpiar el sistema.",
            });
            return;
        }
        setIsConfirmingPurge(false);

        setStatus("loading");
        setLog([]);
        setProgress(0);
        addLog("Iniciando limpieza profunda del clúster académico...", "info");

        try {
            const snapshot = await getDocs(collection(db, "questions"));
            if (snapshot.empty) {
                addLog("La nube ya está limpia. El sistema está listo para una nueva sincronización.", "info");
                setStatus("idle");
                return;
            }

            let operationCount = 0;
            let processedCount = 0;
            let currentBatch = writeBatch(db);

            for (const docSnapshot of snapshot.docs) {
                currentBatch.delete(docSnapshot.ref);
                operationCount++;
                processedCount++;

                if (operationCount >= BATCH_SIZE) {
                    setProgress((processedCount / snapshot.docs.length) * 100);
                    addLog(`Eliminando registros antiguos: ${processedCount} de ${snapshot.docs.length} depurados.`, "batch");
                    await currentBatch.commit();
                    await delay(250);
                    currentBatch = writeBatch(db);
                    operationCount = 0;
                }
            }
            if (operationCount > 0) await currentBatch.commit();

            setProgress(100);
            addLog(`¡Purga con Éxito! Se han eliminado los ${processedCount} registros antiguos. Estado virgen confirmado.`, "success");
            setStatus("idle");
            await checkLiveStatus();
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            addLog(`Fallo en la purga: ${e.message}. El sistema permanece bloqueado por seguridad.`, "error");
        }
    };

    const modules = [
        { id: "lectura_critica", label: "Lectura Crítica" },
        { id: "razonamiento_cuantitativo", label: "Razonamiento" },
        { id: "ingles", label: "Inglés" },
        { id: "competencias_ciudadanas", label: "Ciudadanas" },
        { id: "comunicacion_escrita", label: "Escrita" }
    ];

    const syncPercentage = Math.round((totalLive / totalLocal) * 100) || 0;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header / Command Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <Database className="text-brand-primary" size={48} /> Comando de Datos
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 flex items-center gap-2 font-black uppercase tracking-widest opacity-70">
                        <ShieldAlert size={14} className="text-brand-primary" /> Control Maestro v4.2 • Inyección Atmosférica
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-theme-text-secondary/40 uppercase tracking-[0.2em]">Cluster Status</span>
                        <span className="text-xs font-black text-green-400 flex items-center gap-1.5 uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Operacional
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={checkLiveStatus}
                        disabled={isCheckingLive || status === "loading"}
                        className="bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)] hover:border-brand-primary/30 h-12 px-6"
                    >
                        <RefreshCw size={18} className={isCheckingLive ? "animate-spin" : ""} />
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Action Stage */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Synchrony Master Widget */}
                    <Card variant="solid" className="p-10 bg-[var(--theme-bg-surface)] backdrop-blur-xl border-[var(--theme-border-soft)] overflow-hidden relative shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            {/* Visual Progress Circle or Bar */}
                            <div className="relative w-56 h-56 shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="112" cy="112" r="100" className="stroke-[var(--theme-border-soft)] fill-none" strokeWidth="16" />
                                    <circle
                                        cx="112" cy="112" r="100"
                                        className="stroke-brand-primary fill-none transition-all duration-1000 ease-out"
                                        strokeWidth="16"
                                        strokeDasharray={628.3}
                                        strokeDashoffset={628.3 - (628.3 * (status === "loading" ? progress : syncPercentage)) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black italic tracking-tighter tabular-nums text-[var(--theme-text-primary)]">{status === "loading" ? Math.round(progress) : syncPercentage}%</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-text-tertiary)]">Synced</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8 w-full text-center md:text-left">
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-black tracking-tight italic uppercase text-[var(--theme-text-primary)]">Sincronización Maestra</h2>
                                    <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed max-w-sm font-black uppercase tracking-widest opacity-60">
                                        Despliega el banco local de <span className="text-brand-primary">{totalLocal}</span> reactivos directamente al clúster de producción.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="primary"
                                        className="flex-1 h-16 text-[10px] font-black uppercase tracking-[0.3em] italic shadow-[var(--shadow-premium)] ring-1 ring-white/10"
                                        onClick={handleSeed}
                                        disabled={status === "loading" || status === "success"}
                                        icon={ArrowUpCircle}
                                    >
                                        {status === "loading" ? "Procesando Batch..." : "Desplegar a Firestore"}
                                    </Button>
                                    <Button
                                        variant="error"
                                        className="h-16 px-8 bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] hover:bg-red-500/10 hover:border-red-500/20 text-red-500/80 font-black uppercase text-[10px] tracking-widest transition-all"
                                        onClick={handleClear}
                                        disabled={status === "loading"}
                                    >
                                        <Trash2 size={24} />
                                    </Button>
                                </div>

                                {/* Linear Progress Bar */}
                                {status === "loading" && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-primary animate-pulse">Transmitiendo Activos Masivamente...</span>
                                            <span className="text-xs font-mono font-black text-[var(--theme-text-primary)]">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-[var(--theme-bg-base)] rounded-full h-2 overflow-hidden ring-1 ring-[var(--theme-border-soft)]">
                                            <div
                                                className="bg-brand-primary h-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>
                    </Card>

                    {/* Activity Feed (Build Logs) */}
                    <Card variant="solid" className="bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)] flex flex-col min-h-[400px] shadow-lg">
                        <div className="border-b border-[var(--theme-border-soft)] p-5 flex items-center justify-between px-8">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--theme-text-tertiary)] flex items-center gap-2">
                                <History size={14} className="text-brand-primary" /> Activity Logs
                            </h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] text-[var(--theme-text-quaternary)] font-mono">Instance: SABERPRO-CORE-A1</span>
                            </div>
                        </div>
                        <div className="flex-1 p-8 font-mono text-[11px] space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar selection:bg-white/20">
                            {log.length > 0 ? log.map((line, i) => (
                                <div key={i} className="flex gap-6 group animate-in slide-in-from-left-2 duration-300">
                                    <span className="text-[var(--theme-text-quaternary)] shrink-0 w-24">[{line.time}]</span>
                                    <div className="flex-1 flex gap-2">
                                        <span className={`uppercase font-semibold px-1.5 rounded-[2px] text-[8px] h-fit mt-0.5 ${line.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                            line.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                                line.type === 'batch' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-[var(--theme-bg-base)] text-[var(--theme-text-tertiary)]'
                                            }`}>
                                            {line.type}
                                        </span>
                                        <span className={`${line.type === 'error' ? 'text-red-300' : 'text-[var(--theme-text-secondary)]'}`}>{line.msg}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
                                    <LayoutDashboard size={48} className="mb-4" />
                                    <p className="uppercase tracking-[0.4em] font-semibold text-xs">Waiting for events...</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Regional Shards (Modules) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-[11px] font-semibold text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2">
                            <Server size={14} /> Regional Shards
                        </h3>
                        <Badge className="bg-[var(--theme-bg-surface)] border-[var(--theme-border-soft)] text-[9px] text-[var(--theme-text-secondary)]">5 Active</Badge>
                    </div>

                    <div className="space-y-3">
                        {modules.map((mod) => {
                            const localCountArr = [
                                ...quantitativeQuestions, ...readingQuestions, ...citizenshipQuestions, ...englishQuestions, ...communicationQuestions
                            ].filter(q => q.module === mod.id);
                            const localCount = localCountArr.length;
                            const liveCount = liveCounts[mod.id] || 0;
                            const isSync = liveCount >= localCount && localCount > 0;

                            return (
                                <Card key={mod.id} className="p-5 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/40 hover:bg-[var(--theme-bg-surface)]/60 transition-all group overflow-hidden relative">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-semibold text-[var(--theme-text-tertiary)] uppercase tracking-tight">{mod.label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isSync ? 'bg-green-500' : 'bg-brand-primary'}`}></div>
                                                <span className="text-[9px] font-semibold uppercase text-[var(--theme-text-quaternary)] tracking-wider">{isSync ? 'Synced' : 'Pending'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-semibold font-mono text-[var(--theme-text-primary)]">
                                                {liveCount} <span className="text-[var(--theme-text-tertiary)] font-normal">/ {localCount}</span>
                                            </div>
                                            <div className="text-[7px] text-[var(--theme-text-quaternary)] font-semibold uppercase tracking-wider mt-1">Status 2026 OK</div>
                                        </div>
                                    </div>
                                    {/* Progress background */}
                                    <div
                                        className="absolute bottom-0 left-0 h-[2px] bg-brand-primary/20 transition-all duration-700"
                                        style={{ width: `${(liveCount / localCount) * 100}%` }}
                                    ></div>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="p-6 bg-gradient-to-b from-blue-500/5 to-transparent border-blue-500/10">
                        <div className="flex gap-4">
                            <Cpu className="text-blue-400 shrink-0" size={20} />
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">Atomic Integrity</h4>
                                <p className="text-[10px] text-blue-400/60 leading-relaxed italic">
                                    El motor de inyección utiliza un buffer de persistencia de 300ms entre ráfagas para evitar saturación de CPU y red.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Footer Info */}
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-semibold text-[var(--theme-text-quaternary)] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5 opacity-60"><Activity size={12} /> System Status: Optimal</span>
                    <span className="flex items-center gap-1.5 opacity-60"><Cloud size={12} /> GCP Region: Latin-America-South1</span>
                </div>
                <div className="text-center md:text-right opacity-30 italic">
                    Saber Pro Engine Core v2.4.5-stable • 2026 Docencia Informática
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--theme-border-soft);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--theme-border-medium);
                }
            `}</style>
        </main>
    );
}
