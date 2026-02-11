
"use client";

import { useState, useEffect } from "react";
import { X, Calendar, BookOpen, Brain, Zap, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, getCountFromServer } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssignmentCreated: () => void;
}

export default function CreateAssignmentModal({ isOpen, onClose, onAssignmentCreated }: CreateAssignmentModalProps) {
    const { user, subscription } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);

    // Form Stats
    const [selectedClass, setSelectedClass] = useState("");
    const [assignmentType, setAssignmentType] = useState("razonamiento_cuantitativo");
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");

    const isPro = subscription?.plan === 'pro';

    useEffect(() => {
        if (isOpen && user) {
            fetchClasses();
            checkAssignmentQuota();
        }
    }, [isOpen, user]);

    const fetchClasses = async () => {
        if (!user) return;
        const q = query(collection(db, "classrooms"), where("teacherId", "==", user.uid));
        const snapshot = await getDocs(q);
        setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const checkAssignmentQuota = async () => {
        if (!user) return;
        // Count active assignments for this teacher
        const q = query(
            collection(db, "assignments"),
            where("teacherId", "==", user.uid),
            where("isActive", "==", true)
        );
        const snapshot = await getCountFromServer(q);
        setActiveAssignmentsCount(snapshot.data().count);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedClass) return;

        // Basic Plan Restrictions
        if (!isPro) {
            if (activeAssignmentsCount >= 3) {
                alert("Has alcanzado el límite de 3 tareas activas del Plan Gratuito. Mejora a Pro para tareas ilimitadas.");
                return;
            }
            if (assignmentType === 'simulation_full' || assignmentType === 'ai_practice') {
                alert("Este tipo de tarea es exclusivo para Docentes Pro.");
                return;
            }
        }

        setSubmitting(true);

        try {
            await addDoc(collection(db, "assignments"), {
                classId: selectedClass,
                teacherId: user.uid,
                type: assignmentType,
                title: title || getTitleForType(assignmentType),
                moduleId: assignmentType === 'simulation_full' ? 'full_simulation' : assignmentType,
                dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
                createdAt: serverTimestamp(),
                isActive: true,
                requiresPro: assignmentType === 'simulation_full' // Flag for student restrictions
            });

            onAssignmentCreated();
            onClose();
            // Reset form
            setTitle("");
            setAssignmentType("razonamiento_cuantitativo");
        } catch (error) {
            console.error("Error creating assignment:", error);
            alert("Error al crear la tarea.");
        } finally {
            setSubmitting(false);
        }
    };

    const getTitleForType = (type: string) => {
        const types: any = {
            'razonamiento_cuantitativo': 'Práctica de Razonamiento Cuantitativo',
            'lectura_critica': 'Práctica de Lectura Crítica',
            'competencias_ciudadanas': 'Práctica de Competencias Ciudadanas',
            'ingles': 'Práctica de Inglés',
            'simulation_full': 'Simulacro Completo Saber Pro'
        };
        return types[type] || 'Nueva Tarea';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-bg-base)]/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[var(--theme-shadow-lg)] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[var(--theme-border-soft)] flex justify-between items-center sticky top-0 bg-[var(--theme-bg-surface)]/95 backdrop-blur-sm z-10">
                    <h2 className="text-2xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2 tracking-tight">
                        <BookOpen className="text-brand-primary" /> Nueva Asignación
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        icon={X}
                        className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)]/10"
                    />
                </div>

                <div className="p-6">
                    {!isPro && activeAssignmentsCount >= 3 && (
                        <div className="mb-6 p-4 bg-[var(--theme-bg-warning-soft)] border border-[var(--theme-border-warning)] rounded-xl flex items-start gap-3">
                            <AlertTriangle className="text-[var(--theme-text-warning)] shrink-0" />
                            <div>
                                <h4 className="font-bold text-[var(--theme-text-warning)]">Límite de Tareas Alcanzado</h4>
                                <p className="text-sm text-[var(--theme-text-warning)]/80 mt-1">
                                    En el plan gratuito solo puedes tener 3 tareas activas.
                                    <Link href="/pricing" className="text-[var(--theme-text-primary)] underline ml-2 font-bold hover:text-brand-primary">
                                        Mejorar a Pro
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Class Selector */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--theme-text-secondary)] mb-2 uppercase tracking-wide">Asignar a Clase</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl p-3 text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-all"
                                required
                            >
                                <option value="">Seleccionar Clase...</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Module Type Selector */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--theme-text-secondary)] mb-2 uppercase tracking-wide">Tipo de Actividad</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Basic Options */}
                                {['razonamiento_cuantitativo', 'lectura_critica', 'competencias_ciudadanas', 'ingles'].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setAssignmentType(type)}
                                        className={`cursor-pointer p-4 rounded-xl border transition-all ${assignmentType === type
                                            ? 'bg-brand-primary/10 border-brand-primary text-[var(--theme-text-primary)] shadow-sm'
                                            : 'bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-overlay)]'
                                            }`}
                                    >
                                        <div className="font-bold capitalize mb-1">
                                            {type.replace('_', ' ')}
                                        </div>
                                    </div>
                                ))}

                                {/* Pro Options */}
                                <div
                                    onClick={() => isPro && setAssignmentType('simulation_full')}
                                    className={`relative cursor-pointer p-4 rounded-xl border transition-all ${assignmentType === 'simulation_full'
                                        ? 'bg-purple-500/10 border-purple-500 text-[var(--theme-text-primary)] shadow-sm'
                                        : 'bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)]'
                                        } ${!isPro ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-500/5'}`}
                                >
                                    <div className="font-bold flex items-center justify-between">
                                        Simulacro Completo
                                        {!isPro && <Lock size={16} className="text-[var(--theme-text-tertiary)]" />}
                                    </div>
                                    <div className="text-xs mt-1 text-purple-500 font-medium flex items-center gap-1">
                                        <Zap size={10} className="fill-purple-500" />
                                        Exclusivo Premium: Incluye IA y Resultados Globales
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[var(--theme-text-secondary)] mb-2 uppercase tracking-wide">Título Personalizado (Opcional)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={getTitleForType(assignmentType)}
                                    className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl p-3 text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-all placeholder:text-[var(--theme-text-tertiary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--theme-text-secondary)] mb-2 uppercase tracking-wide">Fecha Límite</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl p-3 text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-all"
                                    />
                                    <Calendar className="absolute right-3 top-3.5 text-[var(--theme-text-tertiary)] pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--theme-border-soft)]">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="shadow-gold font-bold uppercase tracking-wide text-xs h-10"
                                isLoading={submitting}
                                disabled={submitting || (!isPro && activeAssignmentsCount >= 3)}
                            >
                                {submitting ? 'Asignando...' : 'Crear Asignación'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

