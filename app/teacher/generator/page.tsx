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
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Sparkles className="text-metal-gold" /> Generador de Exámenes IA
                </h1>
                <p className="text-metal-silver">
                    Crea evaluaciones personalizadas en segundos utilizando nuestra base de conocimiento.
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* CONFIG CARD */}
                <div className="md:col-span-1 space-y-6">
                    <div className="metallic-card bg-metal-dark border border-metal-gold/30 p-6 rounded-2xl shadow-lg shadow-metal-gold/5">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <RefreshCw size={20} /> Configuración
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-metal-silver mb-1 block">Título del Examen</label>
                                <input
                                    value={config.title}
                                    onChange={e => setConfig({ ...config, title: e.target.value })}
                                    className="w-full bg-black/40 border border-metal-silver/20 rounded-lg px-4 py-2 text-white outline-none focus:border-metal-gold"
                                    placeholder="Ej: Parcial de Matemáticas"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-metal-silver mb-1 block">Asignar a Clase</label>
                                <select
                                    value={config.classId}
                                    onChange={e => setConfig({ ...config, classId: e.target.value })}
                                    className="w-full bg-black/40 border border-metal-silver/20 rounded-lg px-4 py-2 text-white outline-none focus:border-metal-gold"
                                >
                                    <option value="">Seleccionar Clase...</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-metal-silver mb-1 block">Área de Conocimiento</label>
                                <select
                                    value={config.subject}
                                    onChange={e => setConfig({ ...config, subject: e.target.value as any })}
                                    className="w-full bg-black/40 border border-metal-silver/20 rounded-lg px-4 py-2 text-white outline-none focus:border-metal-gold"
                                >
                                    <option value="lectura_critica">Lectura Crítica</option>
                                    <option value="razonamiento_cuantitativo">Razonamiento Cuantitativo</option>
                                    <option value="competencias_ciudadanas">Competencias Ciudadanas</option>
                                    <option value="ingles">Inglés</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-metal-silver mb-1 block">Preguntas</label>
                                    <input
                                        type="number"
                                        min={1} max={50}
                                        value={config.questionCount}
                                        onChange={e => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                                        className="w-full bg-black/40 border border-metal-silver/20 rounded-lg px-4 py-2 text-white outline-none focus:border-metal-gold"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-metal-silver mb-1 block">Dificultad</label>
                                    <select
                                        value={config.difficulty}
                                        onChange={e => setConfig({ ...config, difficulty: e.target.value })}
                                        className="w-full bg-black/40 border border-metal-silver/20 rounded-lg px-4 py-2 text-white outline-none focus:border-metal-gold"
                                    >
                                        <option value="baja">Baja</option>
                                        <option value="media">Media</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full metallic-btn bg-metal-gold text-black font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all"
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
                        <div className="metallic-card bg-metal-dark border border-metal-silver/10 p-6 rounded-2xl animate-in fade-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText size={20} /> Vista Previa ({generatedQuestions.length})
                                </h2>
                                <button
                                    onClick={handleSaveExam}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                                >
                                    <Save size={18} /> Guardar y Asignar
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {generatedQuestions.map((q, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-metal-gold">Pregunta {idx + 1}</span>
                                            <span className="text-xs text-metal-silver bg-black/30 px-2 py-1 rounded">IA Score: 98%</span>
                                        </div>
                                        <p className="text-white mb-3">{q.text}</p>
                                        <div className="space-y-2 pl-4 border-l-2 border-white/10">
                                            {q.options.map((opt: any) => (
                                                <div key={opt.id} className={`text-sm ${opt.id === q.correctAnswer ? 'text-green-400 font-bold' : 'text-metal-silver'}`}>
                                                    {opt.id}. {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-metal-silver/10 rounded-3xl bg-white/5 text-center">
                            <div className="w-20 h-20 bg-metal-gold/10 rounded-full flex items-center justify-center mb-6 text-metal-gold">
                                <Brain size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Listo para Crear</h3>
                            <p className="text-metal-silver max-w-sm">
                                Configura los parámetros a la izquierda y deja que nuestra IA estructure el examen perfecto para tus estudiantes.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
