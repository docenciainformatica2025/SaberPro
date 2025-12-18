"use client";

import { useState, useEffect } from "react";
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
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <BookOpen className="text-metal-gold" /> Banco de Preguntas
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1">
                        Gestión centralizada del conocimiento y curaduría académica.
                    </p>
                </div>
                <Link href="/admin/questions/new">
                    <Button icon={Plus} variant="premium" className="shadow-metal-gold/20">
                        Crear Nueva Pregunta
                    </Button>
                </Link>
            </div>

            {/* Matrix Filters */}
            <Card variant="solid" className="p-2 flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por enunciado o fragmentos de texto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        className="bg-black/40 border-transparent focus:bg-black/60 focus:border-white/10"
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-silver/40 pointer-events-none" size={16} />
                    <select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        className="w-full bg-black/40 border border-transparent rounded-xl pl-10 pr-8 py-3.5 text-sm text-metal-silver focus:text-white focus:bg-black/60 focus:border-white/10 outline-none appearance-none cursor-pointer transition-all font-bold uppercase tracking-tighter"
                    >
                        <option value="todos">Todos los Módulos</option>
                        <option value="razonamiento_cuantitativo">Razonamiento Cuantitativo</option>
                        <option value="lectura_critica">Lectura Crítica</option>
                        <option value="competencias_ciudadanas">Competencias Ciudadanas</option>
                        <option value="ingles">Inglés</option>
                        <option value="comunicacion_escrita">Comunicación Escrita</option>
                    </select>
                </div>
            </Card>

            {/* List with Premium Aesthetics */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-metal-silver">
                        <thead className="bg-black/40 text-[10px] uppercase font-black tracking-[0.2em] text-metal-gold border-b border-white/5">
                            <tr>
                                <th className="p-4 pl-6">Contenido / Enunciado</th>
                                <th className="p-4">Módulo Académico</th>
                                <th className="p-4 text-center">Opciones</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search size={50} className="mb-4 text-metal-gold opacity-10 animate-pulse" />
                                            <p className="text-metal-silver/40 font-bold uppercase tracking-widest">Sin coincidencias académicas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <tr key={q.id} className="group hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-metal-gold">
                                        <td className="p-5 pl-7">
                                            <div className="max-w-xl">
                                                <p className="line-clamp-2 text-white font-bold leading-relaxed mb-1 group-hover:text-metal-gold transition-colors italic">
                                                    "{q.text}"
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-metal-silver/30 font-mono tracking-tighter bg-white/5 px-2 py-0.5 rounded">UUID: {q.id}</span>
                                                    {q.imageUrl && <Badge variant="info" className="text-[8px] h-4">Imagen Adjunta</Badge>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-metal-gold">
                                                    {(() => {
                                                        const Icon = getModuleIcon(q.module!);
                                                        return <Icon size={12} />;
                                                    })()}
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                                        {q.module?.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                                                    <div className="h-full bg-metal-silver/20 w-full"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="inline-flex flex-col items-center justify-center bg-black/40 border border-white/5 p-2 rounded-xl min-w-[50px]">
                                                <span className="text-white font-black text-xs">{q.options?.length || 0}</span>
                                                <span className="text-[8px] uppercase font-black text-metal-silver/40">Opc</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right pr-6">
                                            <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Link href={`/admin/questions/${q.id}`}>
                                                    <Button variant="ghost" size="sm" icon={Edit3} className="hover:text-metal-gold" />
                                                </Link>
                                                <Button
                                                    variant="danger"
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

            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-black tracking-[0.1em]">
                <span>Total Maestro: {questions.length} Objetos Académicos</span>
                <span>Visualizando {filteredQuestions.length} resultados filtrados</span>
            </div>
        </div>
    );
}
