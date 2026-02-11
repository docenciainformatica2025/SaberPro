"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ClassService } from "@/services/teacher/class.service";
import { Classroom } from "@/types/classroom";
import { Plus, Users, Copy, Trash2, ArrowRight, BookOpen, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

export default function ClassesPage() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newClassName, setNewClassName] = useState("");
    const [newClassSubject, setNewClassSubject] = useState("general");

    const fetchClasses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await ClassService.getClassesByTeacher(user.uid);
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [user]);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newClassName) return;

        try {
            const code = await ClassService.createClass(user.uid, newClassName, newClassSubject);

            setNewClassName("");
            setIsCreating(false);
            fetchClasses(); // Refresh list
            toast.success("¡Clase Creada!", {
                description: `${newClassName} ya está disponible. Código: ${code}`,
                icon: <CheckCircle2 className="text-green-500" size={16} />
            });
        } catch (error) {
            console.error("Error creating class:", error);
            toast.error("Error al crear clase", {
                description: "Por favor intente de nuevo en unos momentos.",
                icon: <AlertCircle className="text-red-500" size={16} />
            });
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.info("Código Copiado", {
            description: "El código de acceso ya está en tu portapapeles.",
            icon: <Copy className="text-brand-primary" size={16} />
        });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--theme-text-primary)] mb-2">Mis Clases</h1>
                    <p className="text-[var(--theme-text-secondary)]">Gestiona tus grupos y asigna códigos de acceso.</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    variant="primary"
                    icon={Plus}
                    className="shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                    Crear Nueva Clase
                </Button>
            </div>

            {/* Create Component */}
            {isCreating && (
                <Card variant="glass" className="mb-8 border-brand-primary/30 animate-in fade-in slide-in-from-top-4 p-8">
                    <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-6 uppercase tracking-tight flex items-center gap-2">
                        <Plus className="text-brand-primary" /> Configurar Nueva Clase
                    </h3>
                    <form onSubmit={handleCreateClass} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Nombre del Grupo"
                                placeholder="Ej: Matemáticas 11-B"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                required
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-[var(--theme-text-tertiary)] uppercase tracking-wider opacity-60 ml-1">Asignatura Principal</label>
                                <select
                                    value={newClassSubject}
                                    onChange={(e) => setNewClassSubject(e.target.value)}
                                    className="w-full h-11 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-xl px-4 text-sm text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="general">General (Todas las áreas)</option>
                                    <option value="lectura_critica">Lectura Crítica</option>
                                    <option value="razonamiento_cuantitativo">Razonamiento Cuantitativo</option>
                                    <option value="competencias_ciudadanas">Competencias Ciudadanas</option>
                                    <option value="ingles">Inglés</option>
                                    <option value="comunicacion_escrita">Comunicación Escrita</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end pt-4 border-t border-[var(--theme-border-soft)]">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="px-10"
                            >
                                Crear Clase
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Class List */}
            {loading ? (
                <div className="text-center py-12 text-[var(--theme-text-tertiary)]">Cargando clases...</div>
            ) : classes.length === 0 ? (
                <Card variant="glass" className="text-center py-24 border-2 border-dashed border-[var(--theme-border-soft)] flex flex-col items-center">
                    <div className="w-20 h-20 bg-[var(--theme-bg-surface)] rounded-full flex items-center justify-center mb-6 text-quaternary">
                        <GraduationCap size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-2">No tienes clases activas</h3>
                    <p className="text-[var(--theme-text-tertiary)] text-sm opacity-60">Crea tu primer grupo para empezar a monitorear estudiantes.</p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <Card key={cls.id} variant="glass" className="p-6 group hover:border-brand-primary/30 transition-all active:scale-[0.98]">
                            <div className="flex justify-between items-start mb-6">
                                <Badge variant="primary" className="text-[10px] font-semibold tracking-wider">
                                    {cls.subject?.replace('_', ' ')}
                                </Badge>
                                <div className="relative group/code cursor-pointer" onClick={() => copyCode(cls.code)}>
                                    <div className="flex items-center gap-2 bg-[var(--theme-bg-base)] px-3 py-1.5 rounded-xl border border-[var(--theme-border-soft)] font-mono text-[var(--theme-text-primary)] group-hover/code:border-brand-primary/50 transition-colors">
                                        <span className="tracking-wider font-semibold text-xs text-brand-primary">{cls.code}</span>
                                        <Copy size={12} className="text-[var(--theme-text-tertiary)] group-hover/code:text-brand-primary" />
                                    </div>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--theme-bg-overlay)] text-[var(--theme-text-primary)] text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity whitespace-nowrap border border-[var(--theme-border-soft)]">
                                        Copiar Código
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-2 group-hover:text-brand-primary transition-colors truncate uppercase tracking-tight">
                                {cls.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[var(--theme-text-tertiary)] text-xs mb-8 font-medium">
                                <Users size={14} className="text-blue-400/60" />
                                <span>{cls.studentCount} Estudiantes inscritos</span>
                            </div>

                            <Link href={`/teacher/classes/${cls.id}`} className="block">
                                <Button variant="outline" className="w-full text-xs font-semibold tracking-[0.1em]" icon={ArrowRight} iconPosition="right">
                                    GESTIONAR GRUPO
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
