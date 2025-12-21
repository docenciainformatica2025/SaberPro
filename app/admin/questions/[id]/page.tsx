"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    ArrowLeft,
    Save,
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
    Trash2
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

export default function EditQuestionPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

    useEffect(() => {
        const fetchQuestion = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "questions", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Question;
                    setFormData({
                        module: data.module,
                        text: data.text,
                        imageUrl: data.imageUrl || "",
                        optionA: data.options.find(o => o.id === "A")?.text || "",
                        optionB: data.options.find(o => o.id === "B")?.text || "",
                        optionC: data.options.find(o => o.id === "C")?.text || "",
                        optionD: data.options.find(o => o.id === "D")?.text || "",
                        correctAnswer: data.correctAnswer,
                        explanation: data.explanation || "",
                        difficulty: data.difficulty || "media"
                    });
                } else {
                    setStatus({ type: 'error', message: "El reactivo no existe en el sistema." });
                }
            } catch (error) {
                console.error(error);
                setStatus({ type: 'error', message: "Fallo al conectar con la base de datos." });
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const docRef = doc(db, "questions", id);
            const updatedQuestion: Partial<Question> = {
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

            await updateDoc(docRef, updatedQuestion);
            setStatus({ type: 'success', message: "Reactivo actualizado correctamente en el nodo central." });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: "Error al sincronizar cambios con Firestore." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-20 flex flex-col items-center justify-center">
                <AIProcessingLoader text="Cifrando Acceso" subtext="Recuperando activos académicos del servidor..." />
            </div>
        );
    }

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
                            <Database className="text-metal-gold" /> Editor de Reactivo
                        </h1>
                        <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2">
                            UUID: <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded text-metal-gold">{id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleUpdate}
                        disabled={saving}
                        variant="premium"
                        className="h-12 px-8 flex items-center gap-2"
                    >
                        {saving ? <AIProcessingLoader /> : <Save size={18} />}
                        {saving ? "Sincronizando..." : "Actualizar Activo"}
                    </Button>
                </div>
            </div>

            {status && (
                <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in duration-300 ${status.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
                    {status.type === 'error' ? <AlertCircle /> : <CheckCircle2 />}
                    <span className="text-sm font-bold">{status.message}</span>
                </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:col-span-2 space-y-8">
                    <Card variant="solid" className="p-8 space-y-6">
                        <div className="flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-2">
                            <Sparkles className="text-metal-gold" size={18} />
                            <h2 className="text-sm font-black uppercase tracking-widest italic">Contenido Editorial</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Enunciado Principal</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg font-medium focus:ring-1 focus:ring-metal-gold/50 focus:border-metal-gold/50 outline-none transition-all resize-none placeholder:text-white/10"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Imagen de Apoyo (URL)</label>
                            <Input
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                icon={ImageIcon}
                                className="bg-black/40 border-white/5 shadow-inner"
                                placeholder="https://servidor.com/imagen.jpg"
                            />
                            {formData.imageUrl && (
                                <div className="relative rounded-2xl overflow-hidden border border-white/5 mt-2 group aspect-video bg-black/40">
                                    <Image src={formData.imageUrl} alt="Vista previa de la pregunta" fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
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
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-white py-3"
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
                            <h2 className="text-sm font-black uppercase tracking-widest italic">Clasificación</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Módulo</label>
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
                                <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Nivel</label>
                                <Select
                                    required
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Question["difficulty"] })}
                                    icon={Activity}
                                >
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Explicación Académica</label>
                            <textarea
                                rows={4}
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs italic text-metal-silver/60"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            className="w-full h-14 font-black uppercase tracking-widest"
                            icon={Save}
                            disabled={saving}
                        >
                            Guardar Cambios
                        </Button>
                    </Card>

                    <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-widest">
                            <AlertCircle size={14} /> Zona de Precaución
                        </div>
                        <p className="text-[10px] text-red-400/60 leading-relaxed">
                            Las modificaciones en este reactivo afectarán los resultados históricos de los simulacros ya realizados. Proceda con cautela científica.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
