"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import sampleQuestions from "@/data/sample-questions.json";
import quantitativeQuestions from "@/data/questions-quantitative.json";
import readingQuestions from "@/data/questions-reading.json";
import citizenshipQuestions from "@/data/questions-citizenship.json";
import englishQuestions from "@/data/questions-english.json";
import communicationQuestions from "@/data/questions-communication.json";
import { Database, Trash2, Play, AlertCircle, CheckCircle2, Terminal, Info, Zap, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";

const TOTAL_QUESTIONS = sampleQuestions.length + quantitativeQuestions.length + readingQuestions.length + citizenshipQuestions.length + englishQuestions.length + communicationQuestions.length;

// Configuration Constants for Batch Processing
// Firestore limit is 500 writes per batch. We use 450 to be safe and allow margin.
const BATCH_SIZE = 450;
const LOG_INTERVAL = 50;

/**
 * SeedPage Component
 * 
 * Provides an administrative interface to inject (seed) or purge the question bank.
 * Implements an Idempotent "Upsert" strategy to prevent data duplication.
 * 
 * @module Admin/Seed
 * @returns {JSX.Element} The rendered admin page.
 */
export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
    const [isCheckingLive, setIsCheckingLive] = useState(true);
    const [log, setLog] = useState<string[]>([]);
    const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);

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

    useState(() => {
        checkLiveStatus();
    });

    const totalLive = Object.values(liveCounts).reduce((a, b) => a + b, 0);

    const handleSeed = async () => {
        if (totalLive > 0) {
            if (!confirm(`Se detectaron ${totalLive} preguntas en la nube. Reinyectar sin purgar puede crear duplicados. ¿Deseas continuar?`)) {
                return;
            }
        }
        setStatus("loading");
        setLog(["[SISTEMA] Iniciando conexión con clúster académico..."]);
        try {
            const questionsRef = collection(db, "questions");

            const allQuestions = [
                ...sampleQuestions,
                ...quantitativeQuestions,
                ...readingQuestions,
                ...citizenshipQuestions,
                ...englishQuestions,
                ...communicationQuestions
            ];

            let count = 0;
            let currentBatch = writeBatch(db);

            for (const q of allQuestions) {
                // Upsert strategy: Use deterministic ID if available, else auto-ID
                const docId = (q as any).id || undefined;
                const newDocRef = docId ? doc(db, "questions", docId) : doc(questionsRef);

                // Merge true ensures we update if exists, create if not
                currentBatch.set(newDocRef, q, { merge: true });
                count++;

                if (count % LOG_INTERVAL === 0) {
                    setLog(prev => [...prev, `[BATCH] Procesando ${count}/${allQuestions.length}...`]);
                }

                if (count % BATCH_SIZE === 0) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                }
            }

            if (count % BATCH_SIZE !== 0) await currentBatch.commit();

            setStatus("success");
            setLog(prev => [...prev, `[EXITO] Se han cargado ${count} reactivos exitosamente.`, "[SISTEMA] Sincronización inmutable completada."]);
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            setLog(prev => [...prev, `[ERROR] Excepción crítica: ${e.message}`]);
        }
    };

    const handleClear = async () => {
        if (!isConfirmingPurge) {
            setIsConfirmingPurge(true);
            toast.warning("Confirmación Requerida", {
                description: "Presiona nuevamente para confirmar la ELIMINACIÓN TOTAL.",
                duration: 3000,
            });
            return;
        }
        setIsConfirmingPurge(false);

        setStatus("loading");
        setLog(["[SEGURIDAD] Autenticando protocolo de borrado masivo...", "[LIMPIEZA] Iniciando purga de la colección 'questions'..."]);
        try {
            const questionsRef = collection(db, "questions");
            const snapshot = await getDocs(questionsRef);

            if (snapshot.empty) {
                setLog(prev => [...prev, "[AVISO] La base de datos ya se encuentra en estado virgen."]);
                setStatus("idle");
                return;
            }

            let operationCount = 0;
            let currentBatch = writeBatch(db);

            for (const doc of snapshot.docs) {
                currentBatch.delete(doc.ref);
                operationCount++;

                if (operationCount >= 450) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                    operationCount = 0;
                    setLog(prev => [...prev, `[SISTEMA] Lote de purga completado...`]);
                }
            }
            if (operationCount > 0) await currentBatch.commit();

            setStatus("idle");
            setLog(prev => [...prev, "[CONFIRMADO] Base de datos purgada. Sistema listo para reinyección."]);
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            setLog(prev => [...prev, `[ERROR] Fallo en protocolo de limpieza: ${e.message}`]);
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <Database className="text-metal-gold" /> Mantenimiento de Datos
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2 italic">
                        <Terminal size={14} /> Centro de inyección y purga de activos académicos
                    </p>
                </div>
                {status === "loading" && (
                    <Badge variant="warning" className="animate-pulse bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        ● Operación de Escritura en Curso
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Control Panel */}
                <Card variant="solid" className="p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="text-metal-gold" size={16} /> Estado del Clúster (Local vs Nube)
                        </h3>
                        <div className="space-y-3">
                            {[
                                { id: "lectura_critica", label: "Lectura" },
                                { id: "razonamiento_cuantitativo", label: "Matemática" },
                                { id: "ingles", label: "Inglés" },
                                { id: "competencias_ciudadanas", label: "Ciudadanas" },
                                { id: "comunicacion_escrita", label: "Escrita" }
                            ].map((mod) => {
                                const localCount = [
                                    ...quantitativeQuestions, ...readingQuestions, ...citizenshipQuestions, ...englishQuestions, ...communicationQuestions
                                ].filter(q => q.module === mod.id).length;
                                const liveCount = liveCounts[mod.id] || 0;
                                return (
                                    <div key={mod.id} className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-[10px] font-black text-metal-silver/40 uppercase">{mod.label}</span>
                                        <div className="flex items-center gap-2 font-mono">
                                            <span className="text-[10px] text-white/40">{localCount}</span>
                                            <span className="text-[8px] text-white/20">/</span>
                                            <span className={`text-[10px] ${liveCount === localCount ? 'text-green-400' : 'text-metal-gold'}`}>{liveCount}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between items-center p-3 bg-metal-gold/5 rounded-lg border border-metal-gold/10 mt-2">
                                <span className="text-[10px] font-black text-metal-gold uppercase">Sincronía Total</span>
                                <span className="text-sm font-mono text-white">{totalLive} / {TOTAL_QUESTIONS}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <Button
                            variant="premium"
                            className="w-full flex items-center justify-center gap-2 h-12"
                            onClick={handleSeed}
                            disabled={status === "loading" || status === "success"}
                        >
                            <Play size={18} /> Reinyectar Base de Datos
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full h-12 group transition-all"
                            onClick={handleClear}
                            disabled={status === "loading"}
                            onMouseLeave={() => setIsConfirmingPurge(false)}
                        >
                            <Trash2 size={18} className={isConfirmingPurge ? "animate-pulse text-red-100" : "group-hover:animate-bounce"} />
                            {isConfirmingPurge ? "CONFIRMAR BORRADO" : "Purga Atómica"}
                        </Button>
                    </div>

                    <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 flex gap-3">
                        <Info className="text-blue-400 shrink-0" size={16} />
                        <p className="text-[10px] text-blue-400 leading-relaxed">
                            Esta herramienta utiliza transacciones por lotes (Atomic Batches) para asegurar la integridad de los datos en Firestore.
                        </p>
                    </div>
                </Card>

                {/* Status/Logs Monitor */}
                <Card variant="solid" className="lg:col-span-2 h-full min-h-[500px] flex flex-col p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
                    <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-metal-silver/40 leading-none">Monitor Master - Console</span>
                        </div>
                        {status === "success" && <Badge variant="success">Protocolo Finalizado</Badge>}
                        {status === "error" && <Badge variant="error">Excepción Detectada</Badge>}
                    </div>

                    <div className="flex-1 p-6 font-mono text-[11px] space-y-2 overflow-y-auto bg-black/20 custom-scrollbar max-h-[400px]">
                        {log.length > 0 ? log.map((line, i) => (
                            <div key={i} className={`flex gap-4 ${line.includes('[ERROR]') ? 'text-red-400' : line.includes('[EXITO]') ? 'text-green-400' : 'text-metal-silver/60'}`}>
                                <span className="text-metal-silver/20 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span className="break-all">{line}</span>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20">
                                <Terminal size={64} className="mb-4" />
                                <p className="uppercase tracking-[0.3em] font-black">Esperando Instrucción</p>
                            </div>
                        )}
                        {status === "loading" && <div className="animate-pulse text-metal-gold pt-2 italic">_ PROCESANDO FLUJO DE DATOS...</div>}
                    </div>

                    {status === "loading" && (
                        <div className="p-8 border-t border-white/5 bg-black/40">
                            <AIProcessingLoader
                                text="Procesando Inyección Atomizada"
                                subtext="Gestionando transacciones persistentes en el clúster regional de Google Cloud..."
                            />
                        </div>
                    )}

                    {!log.length && (
                        <div className="p-8 flex items-center justify-center border-t border-white/5 bg-black/20 text-center">
                            <div className="max-w-xs space-y-4">
                                <AlertCircle className="mx-auto text-metal-gold" size={32} />
                                <p className="text-xs text-metal-silver/60">
                                    Inicie un proceso para monitorizar la ejecución en tiempo real. Se recomienda purgar antes de reinyectar.
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-black tracking-[0.1em]">
                <span>Saber Pro Engine v2.0 - Active Instance</span>
                <span className="flex items-center gap-1 group cursor-help">
                    <ShieldAlert size={10} className="group-hover:text-red-400 transition-colors" /> Admin High Privileges Required
                </span>
            </div>
        </div>
    );
}
