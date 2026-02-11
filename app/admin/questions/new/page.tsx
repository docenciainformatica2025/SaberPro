"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    ArrowLeft,
    Save,
    FileJson,
    Type,
    Image as ImageIcon,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Database,
    HelpCircle,
    Layers,
    Settings,
    GraduationCap,
    Activity,
    Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Question } from "@/types/question";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";

export default function NewQuestionPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"manual" | "json">("manual");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Manual Form State
    const [formData, setFormData] = useState<{
        module: Question["module"];
        text: string;
        imageUrl: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctAnswer: string;
        explanation: string;
        difficulty: Question["difficulty"];
    }>({
        module: "razonamiento_cuantitativo",
        text: "",
        imageUrl: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        explanation: "",
        difficulty: "media"
    });

    // JSON Form State
    const [jsonInput, setJsonInput] = useState("");

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const newQuestion: Omit<Question, "id"> = {
                module: formData.module,
                text: formData.text,
                imageUrl: formData.imageUrl || undefined,
                options: [
                    { id: "A", text: formData.optionA },
                    { id: "B", text: formData.optionB },
                    { id: "C", text: formData.optionC },
                    { id: "D", text: formData.optionD }
                ],
                correctAnswer: formData.correctAnswer,
                explanation: formData.explanation,
                difficulty: formData.difficulty
            };

            await addDoc(collection(db, "questions"), newQuestion);
            setStatus({ type: 'success', message: "Reactivo guardado exitosamente en el banco de datos." });
            setFormData(prev => ({ ...prev, text: "", imageUrl: "", optionA: "", optionB: "", optionC: "", optionD: "", explanation: "" }));
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: "Error crítico al persistir el reactivo." });
        } finally {
            setLoading(false);
        }
    };

    const handleJsonOverview = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error("El JSON debe ser un array de objetos reactivos.");

            const batch = writeBatch(db);
            const questionsRef = collection(db, "questions");

            let count = 0;
            parsed.forEach((item: any) => {
                const newDocRef = doc(questionsRef);
                batch.set(newDocRef, item);
                count++;
            });

            await batch.commit();
            setStatus({ type: 'success', message: `Inyección masiva completada: ${count} activos procesados.` });
            setJsonInput("");
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: `Fallo en el protocolo de importación: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/questions">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="rounded-full w-12 h-12 p-0 border border-white/5 hover:border-brand-primary/30" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                            <Sparkles className="text-brand-primary" size={36} /> Nuevo Reactivo Académico
                        </h1>
                        <p className="text-[var(--theme-text-tertiary)] text-sm mt-1 flex items-center gap-2 font-medium">
                            <Database size={14} className="text-brand-primary" /> Creación o importación de contenido inmutable para el Banco Saber Pro
                        </p>
                    </div>
                </div>
                <div className="flex p-1 bg-[var(--theme-bg-surface)]/50 rounded-2xl border border-[var(--theme-border-soft)] backdrop-blur-xl">
                    <button
                        onClick={() => setMode("manual")}
                        className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${mode === "manual" ? "bg-[var(--brand-primary)] text-[var(--theme-bg-base)] shadow-lg" : "text-theme-text-tertiary hover:text-theme-text-secondary"}`}
                    >
                        <Type size={14} /> Manual
                    </button>
                    <button
                        onClick={() => setMode("json")}
                        className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${mode === "json" ? "bg-[var(--brand-primary)] text-[var(--theme-bg-base)] shadow-lg" : "text-theme-text-tertiary hover:text-theme-text-secondary"}`}
                    >
                        <FileJson size={14} /> Importar
                    </button>
                </div>
            </div>

            {status && (
                <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in duration-300 ${status.type === 'error' ? "bg-brand-error/10 border-brand-error/20 text-brand-error" : "bg-brand-success/10 border-brand-success/20 text-brand-success"}`}>
                    {status.type === 'error' ? <AlertCircle /> : <CheckCircle2 />}
                    <span className="text-sm font-bold">{status.message}</span>
                </div>
            )}

            {loading ? (
                <Card variant="solid" className="p-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <AIProcessingLoader
                        text={mode === "manual" ? "Sincronizando Reactivo" : "Procesando Inyección Masiva"}
                        subtext="Interactuando con la red persistente de Saber Pro..."
                    />
                </Card>
            ) : mode === "manual" ? (
                <form onSubmit={handleManualSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-8">
                        <Card variant="solid" className="p-8 space-y-6">
                            <div className="flex items-center gap-2 text-theme-text-primary border-b border-theme-border-soft pb-4 mb-2">
                                <Database className="text-brand-primary" size={18} />
                                <h2 className="text-sm font-semibold tracking-wide">Contenido del reactivo</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Enunciado Principal</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full bg-theme-bg-surface border border-theme-border-soft rounded-2xl p-6 text-theme-text-primary text-lg font-medium focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none transition-all resize-none placeholder:text-theme-text-tertiary"
                                    placeholder="Escribe el enunciado de la pregunta aquí..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Imagen de Apoyo (URL)</label>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    icon={ImageIcon}
                                    className="bg-[var(--theme-bg-surface)]/40 border-[var(--theme-border-soft)] shadow-inner"
                                    placeholder="https://servidor.com/esquema.png"
                                />
                                {formData.imageUrl && (
                                    <div className="relative rounded-2xl overflow-hidden border border-[var(--theme-border-soft)] mt-2 group aspect-video bg-[var(--theme-bg-surface)]/40">
                                        <Image src={formData.imageUrl} alt="Vista previa de la pregunta" fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                            <Badge variant="info" className="bg-blue-500/20 text-blue-400">Vista Previa del Activo</Badge>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card variant="solid" className="p-8 space-y-8">
                            <div className="flex items-center gap-2 text-theme-text-primary border-b border-theme-border-soft pb-4">
                                <Layers className="text-brand-primary" size={18} />
                                <h2 className="text-sm font-semibold tracking-wide">Opciones de respuesta</h2>
                            </div>

                            <div className="grid gap-4">
                                {["A", "B", "C", "D"].map((opt) => (
                                    <div key={opt} className={`flex gap-4 items-center p-3 rounded-2xl bg-[var(--theme-bg-surface)]/40 border transition-all ${formData.correctAnswer === opt ? "border-brand-success/30 bg-brand-success/[0.02]" : "border-[var(--theme-border-soft)]"}`}>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-semibold transition-all ${formData.correctAnswer === opt ? "bg-[var(--brand-success)] text-[var(--theme-bg-base)] shadow-[0_0_20px_rgba(22,163,74,0.3)]" : "bg-[var(--theme-bg-surface)]/10 text-theme-text-secondary/40 hover:text-[var(--theme-text-primary)]"}`}
                                        >
                                            {opt}
                                        </button>
                                        <input
                                            required
                                            type="text"
                                            value={(formData as any)[`option${opt}`]}
                                            onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-theme-text-primary placeholder:text-theme-text-tertiary py-3"
                                            placeholder={`Definir opción ${opt}...`}
                                        />
                                        {formData.correctAnswer === opt && (
                                            <Badge variant="success" className="mr-2">Correcta</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card variant="solid" className="p-8 space-y-8">
                            <div className="flex items-center gap-2 text-theme-text-primary border-b border-theme-border-soft pb-4 mb-2">
                                <Settings className="text-brand-primary" size={18} />
                                <h2 className="text-sm font-semibold tracking-wide">Metadatos</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Módulo Académico</label>
                                    <Select
                                        required
                                        value={formData.module}
                                        onChange={(e) => setFormData({ ...formData, module: e.target.value as Question["module"] })}
                                        icon={GraduationCap}
                                    >
                                        <option value="razonamiento_cuantitativo">Razonamiento Cuantitativo</option>
                                        <option value="lectura_critica">Lectura Crítica</option>
                                        <option value="competencias_ciudadanas">Competencias Ciudadanas</option>
                                        <option value="ingles">Inglés</option>
                                        <option value="comunicacion_escrita">Comunicación Escrita</option>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Nivel de Dificultad</label>
                                    <Select
                                        required
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Question["difficulty"] })}
                                        icon={Activity}
                                    >
                                        <option value="baja">Baja</option>
                                        <option value="media">Media (Estándar)</option>
                                        <option value="alta">Alta</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Retroalimentación / IA (Opcional)</label>
                                <textarea
                                    rows={4}
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    className="w-full bg-theme-bg-surface border border-theme-border-soft rounded-2xl p-4 text-xs font-medium focus:border-brand-primary/50 outline-none transition-all resize-none italic text-theme-text-tertiary"
                                    placeholder="Explica la lógica de resolución..."
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 text-sm font-semibold uppercase tracking-wider"
                                icon={Save}
                            >
                                Publicar Reactivo
                            </Button>
                        </Card>

                        <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/10 flex gap-4">
                            <HelpCircle className="text-brand-primary shrink-0" size={20} />
                            <p className="text-[10px] text-brand-primary/60 leading-relaxed font-bold uppercase tracking-tight">
                                Cada pregunta guardada se integra inmediatamente en el motor de simulacros para miles de usuarios. Asegure la precisión académica.
                            </p>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all">
                    <Card variant="solid" className="lg:col-span-2 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-[var(--theme-text-primary)] border-b border-[var(--theme-border-soft)] pb-4 mb-2">
                            <FileJson className="text-blue-400" size={18} />
                            <h2 className="text-sm font-semibold uppercase tracking-wider italic">Buffer de Importación JSON</h2>
                        </div>

                        <textarea
                            rows={20}
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full bg-[var(--theme-bg-surface)]/60 border border-[var(--theme-border-soft)] rounded-2xl p-8 font-mono text-[11px] text-brand-primary focus:border-brand-primary/50 outline-none transition-all resize-none shadow-inner"
                            placeholder="[ { 'module': '...', 'text': '...' }, ... ]"
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleJsonOverview}
                                disabled={!jsonInput}
                                variant="primary"
                                className="px-10 h-14 bg-blue-600 border-blue-500 hover:bg-blue-500"
                                icon={Database}
                            >
                                Inyectar Datos Masivos
                            </Button>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <Card variant="solid" className="p-8 space-y-6 bg-blue-500/[0.02]">
                            <div className="flex items-center gap-2 text-blue-400 border-b border-blue-500/10 pb-4 mb-2">
                                <Info size={18} />
                                <h2 className="text-sm font-semibold uppercase tracking-wider italic">Especificación Estándar</h2>
                            </div>

                            <div className="space-y-4 font-mono text-[10px]">
                                <p className="text-blue-400/60 uppercase font-semibold">Esquema Requerido:</p>
                                <div className="p-4 bg-[var(--theme-bg-surface)]/80 rounded-xl border border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)]">
                                    <pre className="whitespace-pre-wrap">
                                        {`{
  "module": "slug_string",
  "text": "string",
  "options": [
    { "id": "A", "text": "..." }
  ],
  "correctAnswer": "A",
  "difficulty": "media",
  "imageUrl": "optional_url"
}`}
                                    </pre>
                                </div>
                                <p className="text-[9px] italic text-[var(--theme-text-tertiary)] italic">
                                    * El sistema rechazará entradas que no cumplan con el tipado estricto `Question`.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </main>
    );
}
