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
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                    <Link href="/admin/questions">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="rounded-full w-10 h-10 p-0" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                            <Sparkles className="text-metal-gold" /> Nuevo Reactivo Académico
                        </h1>
                        <p className="text-metal-silver/60 text-sm mt-1">Crea o importa contenido inmutable para la plataforma Saber Pro</p>
                    </div>
                </div>
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <button
                        onClick={() => setMode("manual")}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${mode === "manual" ? "bg-metal-gold text-black shadow-lg" : "text-metal-silver/40 hover:text-metal-silver"}`}
                    >
                        <Type size={14} /> Manual
                    </button>
                    <button
                        onClick={() => setMode("json")}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${mode === "json" ? "bg-blue-500 text-white shadow-lg" : "text-metal-silver/40 hover:text-metal-silver"}`}
                    >
                        <FileJson size={14} /> Importar
                    </button>
                </div>
            </div>

            {status && (
                <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in duration-300 ${status.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
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
                            <div className="flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-2">
                                <Database className="text-metal-gold" size={18} />
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Contenido del Reactivo</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Enunciado Principal</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg font-medium focus:ring-1 focus:ring-metal-gold/50 focus:border-metal-gold/50 outline-none transition-all resize-none placeholder:text-white/10"
                                    placeholder="Escribe el enunciado de la pregunta aquí..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Imagen de Apoyo (URL)</label>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    icon={ImageIcon}
                                    className="bg-black/40 border-white/5 shadow-inner"
                                    placeholder="https://servidor.com/esquema.png"
                                />
                                {formData.imageUrl && (
                                    <div className="relative rounded-2xl overflow-hidden border border-white/5 mt-2 group aspect-video bg-black/40">
                                        <img src={formData.imageUrl} alt="Vista previa de la pregunta" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                            <Badge variant="info" className="bg-blue-500/20 text-blue-400">Vista Previa del Activo</Badge>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card variant="solid" className="p-8 space-y-8">
                            <div className="flex items-center gap-2 text-white border-b border-white/5 pb-4">
                                <Layers className="text-metal-blue" size={18} />
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Opciones de Respuesta</h2>
                            </div>

                            <div className="grid gap-4">
                                {["A", "B", "C", "D"].map((opt) => (
                                    <div key={opt} className={`flex gap-4 items-center p-3 rounded-2xl bg-black/40 border transition-all ${formData.correctAnswer === opt ? "border-green-500/30 bg-green-500/[0.02]" : "border-white/5"}`}>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all ${formData.correctAnswer === opt ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-white/5 text-metal-silver/40 hover:text-white"}`}
                                        >
                                            {opt}
                                        </button>
                                        <input
                                            required
                                            type="text"
                                            value={(formData as any)[`option${opt}`]}
                                            onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/10 py-3"
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
                            <div className="flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-2">
                                <Settings className="text-metal-gold" size={18} />
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Metadatos</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Módulo Académico</label>
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
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Nivel de Dificultad</label>
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
                                <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Retroalimentación / IA (Opcional)</label>
                                <textarea
                                    rows={4}
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-medium focus:border-metal-gold/50 outline-none transition-all resize-none italic text-metal-silver/60"
                                    placeholder="Explica la lógica de resolución..."
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="premium"
                                className="w-full h-14 text-sm font-black uppercase tracking-widest"
                                icon={Save}
                            >
                                Publicar Reactivo
                            </Button>
                        </Card>

                        <div className="bg-metal-gold/5 p-6 rounded-3xl border border-metal-gold/10 flex gap-4">
                            <HelpCircle className="text-metal-gold shrink-0" size={20} />
                            <p className="text-[10px] text-metal-gold/60 leading-relaxed font-bold uppercase tracking-tight">
                                Cada pregunta guardada se integra inmediatamente en el motor de simulacros para miles de usuarios. Asegure la precisión académica.
                            </p>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all">
                    <Card variant="solid" className="lg:col-span-2 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-2">
                            <FileJson className="text-blue-400" size={18} />
                            <h2 className="text-sm font-black uppercase tracking-widest italic">Buffer de Importación JSON</h2>
                        </div>

                        <textarea
                            rows={20}
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl p-8 font-mono text-[11px] text-blue-400 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner"
                            placeholder="[ { 'module': '...', 'text': '...' }, ... ]"
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleJsonOverview}
                                disabled={!jsonInput}
                                variant="premium"
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
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Especificación Estándar</h2>
                            </div>

                            <div className="space-y-4 font-mono text-[10px]">
                                <p className="text-blue-400/60 uppercase font-black">Esquema Requerido:</p>
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-metal-silver/40">
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
                                <p className="text-[9px] italic text-metal-silver/20 italic">
                                    * El sistema rechazará entradas que no cumplan con el tipado estricto `Question`.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
