"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Question } from "@/types/question";
import { Plus, Trash2, Edit3, Search, Filter, BookOpen, Layers, Target, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function QuestionsPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("todos");

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const q = query(collection(db, "questions"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer y afectará a los simulacros activos.")) {
            try {
                await deleteDoc(doc(db, "questions", id));
                setQuestions(prev => prev.filter(q => q.id !== id));
            } catch (error) {
                console.error("Error deleting question:", error);
                alert("Error al eliminar");
            }
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === "todos" || q.module === selectedModule;
        return matchesSearch && matchesModule;
    });

    const getModuleIcon = (moduleName: string) => {
        switch (moduleName) {
            case "razonamiento_cuantitativo": return Target;
            case "lectura_critica": return BookOpen;
            case "ingles": return HelpCircle;
            default: return Layers;
        }
    };

    if (loading) return <AIProcessingLoader text="Accediendo al Banco Maestro" subtext="Cargando contenido académico..." />;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <BookOpen className="text-brand-primary" size={48} /> Banco de Reactivos
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 flex items-center gap-2 font-black uppercase tracking-widest opacity-70">
                        <Target size={14} className="text-brand-primary" /> Curaduría Académica v9.0 • Control Maestro
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => router.push('/admin/questions/new')}
                    className="shadow-[var(--shadow-premium)] px-10 h-14 text-xs font-black uppercase tracking-widest ring-1 ring-white/10"
                >
                    <Plus className="mr-2" size={18} /> Crear Pregunta
                </Button>
            </div>

            {/* Matrix Filters */}
            <Card variant="solid" className="p-3 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 bg-[var(--theme-bg-surface)] backdrop-blur-xl border-[var(--theme-border-soft)] shadow-2xl">
                <div className="flex-1 relative group">
                    <Input
                        type="text"
                        placeholder="Buscar por enunciado o fragmentos de texto maestro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] focus:border-brand-primary/30 transition-all h-14 text-sm font-medium placeholder:text-[var(--theme-text-tertiary)]/30"
                    />
                </div>
                <div className="relative w-full md:w-80">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/60 pointer-events-none" size={18} />
                    <select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-2xl pl-12 pr-10 h-14 text-xs text-[var(--theme-text-secondary)] focus:text-[var(--theme-text-primary)] focus:border-brand-primary/30 outline-none appearance-none cursor-pointer transition-all font-black uppercase tracking-widest"
                    >
                        <option value="todos">Todos los Módulos</option>
                        <option value="razonamiento_cuantitativo">Razonamiento Cuantitativo</option>
                        <option value="lectura_critica">Lectura Crítica</option>
                        <option value="competencias_ciudadanas">Competencias Ciudadanas</option>
                        <option value="ingles">Inglés</option>
                        <option value="comunicacion_escrita">Comunicación Escrita</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/30 rotate-90" size={16} />
                </div>
            </Card>

            {/* List with Premium Aesthetics */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 shadow-2xl">
                {/* Mobile View (Cards) */}
                <div className="md:hidden p-4 space-y-4">
                    {filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-center">
                            <Search size={40} className="mb-4 text-brand-primary opacity-30" />
                            <p className="text-theme-text-secondary/40 font-bold uppercase tracking-wider text-xs">Sin coincidencias académicas</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q) => {
                            const ModuleIcon = getModuleIcon(q.module!);
                            return (
                                <div key={q.id} className="bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-2xl p-5 space-y-4 shadow-sm">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2 text-brand-primary">
                                                <ModuleIcon size={12} />
                                                <span className="text-[9px] font-semibold uppercase tracking-tight">
                                                    {q.module?.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--theme-text-primary)] font-bold leading-relaxed line-clamp-3 italic">
                                                &quot;{q.text}&quot;
                                            </p>
                                        </div>
                                        {q.imageUrl && <Badge variant="info" className="text-[8px] h-5 px-2 shrink-0">IMG</Badge>}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[var(--theme-border-soft)] pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-[var(--theme-bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--theme-border-soft)]">
                                                <span className="text-[var(--theme-text-primary)] font-semibold text-xs">{q.options?.length || 0}</span>
                                                <span className="text-[8px] uppercase font-semibold text-[var(--theme-text-secondary)] ml-1">Opc</span>
                                            </div>
                                            <span className="text-[8px] text-[var(--theme-text-tertiary)] font-mono tracking-tight bg-[var(--theme-bg-surface)] px-2 py-1 rounded border border-[var(--theme-border-soft)]">ID: {(q.id || "").substring(0, 6)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/questions/${q.id}`}>
                                                <Button variant="ghost" size="sm" icon={Edit3} className="h-8 w-8 p-0 hover:text-brand-primary" />
                                            </Link>
                                            <Button
                                                variant="error"
                                                size="sm"
                                                icon={Trash2}
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDelete(q.id!)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--theme-text-secondary)]">
                        <thead className="bg-[var(--theme-bg-base)] text-[10px] uppercase font-semibold tracking-[0.2em] text-brand-primary border-b border-[var(--theme-border-soft)]">
                            <tr>
                                <th className="p-4 pl-6">Contenido / Enunciado</th>
                                <th className="p-4">Módulo Académico</th>
                                <th className="p-4 text-center">Opciones</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--theme-border-soft)]">
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search size={50} className="mb-4 text-brand-primary opacity-10 animate-pulse" />
                                            <p className="text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider">Sin coincidencias académicas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <tr key={q.id} className="group hover:bg-[var(--theme-bg-base)] transition-colors border-l-2 border-transparent hover:border-brand-primary">
                                        <td className="p-5 pl-7">
                                            <div className="max-w-xl">
                                                <p className="line-clamp-2 text-[var(--theme-text-primary)] font-bold leading-relaxed mb-1 group-hover:text-brand-primary transition-colors italic">
                                                    &quot;{q.text}&quot;
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-[var(--theme-text-tertiary)] font-mono tracking-tight bg-[var(--theme-bg-base)] px-2 py-0.5 rounded border border-[var(--theme-border-soft)]">UUID: {q.id}</span>
                                                    {q.imageUrl && <Badge variant="info" className="text-[8px] h-4">Imagen Adjunta</Badge>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-brand-primary">
                                                    {(() => {
                                                        const Icon = getModuleIcon(q.module!);
                                                        return <Icon size={12} />;
                                                    })()}
                                                    <span className="text-[10px] font-semibold uppercase tracking-tight">
                                                        {q.module?.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[var(--theme-bg-base)] h-1 rounded-full overflow-hidden mt-1 ring-1 ring-[var(--theme-border-soft)]">
                                                    <div className="h-full bg-[var(--theme-text-secondary)]/20 w-full"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="inline-flex flex-col items-center justify-center bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] p-2 rounded-xl min-w-[50px] shadow-sm">
                                                <span className="text-[var(--theme-text-primary)] font-semibold text-xs">{q.options?.length || 0}</span>
                                                <span className="text-[8px] uppercase font-semibold text-[var(--theme-text-tertiary)]">Opc</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right pr-6">
                                            <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Link href={`/admin/questions/${q.id}`}>
                                                    <Button variant="ghost" size="sm" icon={Edit3} className="hover:text-brand-primary" />
                                                </Link>
                                                <Button
                                                    variant="error"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => handleDelete(q.id!)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-theme-text-secondary/30 px-2 uppercase font-semibold tracking-[0.1em]">
                <span>Total Maestro: {questions.length} Objetos Académicos</span>
                <span>Visualizando {filteredQuestions.length} resultados filtrados</span>
            </div>
        </main>
    );
}
