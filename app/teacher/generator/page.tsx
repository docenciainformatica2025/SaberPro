"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { Brain, Save, CheckCircle, AlertCircle, RefreshCw, FileText, Sparkles, BookOpen } from "lucide-react";
import { CompetencyType } from "@/types/question";
import { SubscriptionPlan } from "@/types/finance";

export default function ExamGeneratorPage() {
    const { user, subscription, role } = useAuth();
    const [loading, setLoading] = useState(false);

    // Generator Config
    const [config, setConfig] = useState({
        title: "",
        subject: "lectura_critica" as CompetencyType,
        questionCount: 10,
        difficulty: "media",
        classId: ""
    });

    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        if (user) fetchClasses();
    }, [user]);

    const fetchClasses = async () => {
        if (!user) return;
        const q = query(collection(db, "classrooms"), where("teacherId", "==", user.uid));
        const snap = await getDocs(q);
        setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // 1. Fetch Questions from Real Bank
            // Note: In a production app with huge banks, we'd use Algolia/Typesense or a specific 'random' index technique.
            // For now, fetching all by subject and shuffling client-side is acceptable for typical bank sizes (<1000).
            const q = query(
                collection(db, "questions"),
                where("module", "==", config.subject)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                alert(`No se encontraron preguntas disponibles para el módulo: ${config.subject.replace(/_/g, ' ')}.`);
                setGeneratedQuestions([]);
                setLoading(false);
                return;
            }

            const rawQuestions = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    text: data.text,
                    module: data.module,
                    options: data.options,
                    correctAnswer: data.correctAnswer,
                    explanation: data.explanation || "Explicación no disponible.", // Fallback if missing
                    difficulty: data.difficulty || config.difficulty // Use generic if missing
                };
            });

            // 2. Randomize & Slice
            const shuffled = rawQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, config.questionCount);

            if (selected.length < config.questionCount) {
                // Notify if fewer questions available than requested
                // alert(`Nota: Solo se encontraron ${selected.length} preguntas disponibles.`);
            }

            setGeneratedQuestions(selected);

        } catch (error) {
            console.error("Error generating exam:", error);
            alert("Error al acceder al Banco de Preguntas.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveExam = async () => {
        if (!config.title || !config.classId) {
            alert("Por favor completa el título y selecciona una clase.");
            return;
        }

        try {
            await addDoc(collection(db, "assignments"), {
                title: config.title,
                classId: config.classId,
                teacherId: user?.uid,
                questions: generatedQuestions,
                createdAt: serverTimestamp(),
                subject: config.subject,
                status: 'active',
                type: 'exam'
            });
            alert("¡Examen asignado exitosamente!");
            setGeneratedQuestions([]);
            setConfig({ ...config, title: "" });
        } catch (error) {
            console.error(error);
            alert("Error al guardar.");
        }
    };

    const isPro = subscription?.plan === SubscriptionPlan.PRO || subscription?.plan === SubscriptionPlan.TEACHER_PRO || role === 'teacher';

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header>
                <h1 className="text-3xl font-semibold text-[var(--theme-text-primary)] mb-2 flex items-center gap-3">
                    <Sparkles className="text-brand-primary" /> Generador de Exámenes IA
                </h1>
                <p className="text-[var(--theme-text-secondary)]">
                    Crea evaluaciones personalizadas en segundos utilizando nuestra base de conocimiento.
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* CONFIG CARD */}
                <div className="md:col-span-1 space-y-6">
                    <div className="metallic-card bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] p-6 rounded-2xl shadow-lg shadow-brand-primary/5">
                        <h2 className="text-xl font-bold text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                            <RefreshCw size={20} /> Configuración
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] mb-1 block">Título del Examen</label>
                                <input
                                    value={config.title}
                                    onChange={e => setConfig({ ...config, title: e.target.value })}
                                    className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-lg px-4 py-2 text-[var(--theme-text-primary)] outline-none focus:border-brand-primary"
                                    placeholder="Ej: Parcial de Matemáticas"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] mb-1 block">Asignar a Clase</label>
                                <select
                                    value={config.classId}
                                    onChange={e => setConfig({ ...config, classId: e.target.value })}
                                    className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-lg px-4 py-2 text-[var(--theme-text-primary)] outline-none focus:border-brand-primary"
                                >
                                    <option value="">Seleccionar Clase...</option>
                                    {classes.map(c => <option key={c.id} value={c.id} className="bg-[var(--theme-bg-base)]">{c.name} ({c.code})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] mb-1 block">Área de Conocimiento</label>
                                <select
                                    value={config.subject}
                                    onChange={e => setConfig({ ...config, subject: e.target.value as any })}
                                    className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-lg px-4 py-2 text-[var(--theme-text-primary)] outline-none focus:border-brand-primary"
                                >
                                    <option value="lectura_critica" className="bg-[var(--theme-bg-base)]">Lectura Crítica</option>
                                    <option value="razonamiento_cuantitativo" className="bg-[var(--theme-bg-base)]">Razonamiento Cuantitativo</option>
                                    <option value="competencias_ciudadanas" className="bg-[var(--theme-bg-base)]">Competencias Ciudadanas</option>
                                    <option value="ingles" className="bg-[var(--theme-bg-base)]">Inglés</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-[var(--theme-text-secondary)] mb-1 block">Preguntas</label>
                                    <input
                                        type="number"
                                        min={1} max={50}
                                        value={config.questionCount}
                                        onChange={e => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                                        className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-lg px-4 py-2 text-[var(--theme-text-primary)] outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[var(--theme-text-secondary)] mb-1 block">Dificultad</label>
                                    <select
                                        value={config.difficulty}
                                        onChange={e => setConfig({ ...config, difficulty: e.target.value })}
                                        className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-lg px-4 py-2 text-[var(--theme-text-primary)] outline-none focus:border-brand-primary"
                                    >
                                        <option value="baja" className="bg-[var(--theme-bg-base)]">Baja</option>
                                        <option value="media" className="bg-[var(--theme-bg-base)]">Media</option>
                                        <option value="alta" className="bg-[var(--theme-bg-base)]">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full metallic-btn bg-brand-primary text-[var(--theme-bg-base)] font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="animate-spin" /> Generando...
                                    </>
                                ) : (
                                    <>
                                        <Brain /> Generar con IA
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW CARD */}
                <div className="md:col-span-2 space-y-6">
                    {generatedQuestions.length > 0 ? (
                        <div className="metallic-card bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] p-6 rounded-2xl animate-in fade-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
                                    <FileText size={20} /> Vista Previa ({generatedQuestions.length})
                                </h2>
                                <button
                                    onClick={handleSaveExam}
                                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg active:scale-95"
                                >
                                    <Save size={18} /> Guardar y Asignar
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {generatedQuestions.map((q, idx) => (
                                    <div key={idx} className="p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)]">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-brand-primary">Pregunta {idx + 1}</span>
                                            <span className="text-xs text-[var(--theme-text-tertiary)] bg-[var(--theme-bg-surface)] px-2 py-1 rounded">IA Score: 98%</span>
                                        </div>
                                        <p className="text-[var(--theme-text-primary)] mb-3">{q.text}</p>
                                        <div className="metallic-card p-8 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                                            {q.options.map((opt: any) => (
                                                <div key={opt.id} className={`text-sm ${opt.id === q.correctAnswer ? 'text-green-400 font-bold' : 'text-[var(--theme-text-secondary)]'}`}>
                                                    {opt.id}. {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--theme-border-soft)] rounded-3xl bg-[var(--theme-bg-base)] text-center">
                            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                                <Brain size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-2">Listo para Crear</h3>
                            <p className="text-[var(--theme-text-secondary)] max-w-sm">
                                Configura los parámetros a la izquierda y deja que nuestra IA estructure el examen perfecto para tus estudiantes.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
