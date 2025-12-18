
"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Lock, Trash2, CheckCircle, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import CreateAssignmentModal from "@/components/teacher/CreateAssignmentModal";
import { Assignment } from "@/types/assignment";

export default function AssignmentsPage() {
    const { user, subscription } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAssignments();
        }
    }, [user]);

    const fetchAssignments = async () => {
        try {
            const q = query(
                collection(db, "assignments"),
                where("teacherId", "==", user?.uid),
                where("isActive", "==", true)
                // orderBy("createdAt", "desc") -> Removed to avoid Index Error
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
            // Sort client-side
            data.sort((a, b) => {
                const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any).toDate();
                const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any).toDate();
                return dateB - dateA;
            });
            setAssignments(data);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta tarea? Los estudiantes ya no podrán verla.")) {
            try {
                await deleteDoc(doc(db, "assignments", id));
                setAssignments(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error("Error deleting assignment:", error);
                alert("Error al eliminar.");
            }
        }
    };

    const formatDate = (date: any) => {
        if (!date) return 'Sin fecha';

        // Priority 1: Firestore Timestamp with toDate()
        if (typeof date.toDate === 'function') {
            return date.toDate().toLocaleDateString();
        }

        // Priority 2: Serialized Timestamp (seconds)
        if (date.seconds !== undefined) {
            return new Date(date.seconds * 1000).toLocaleDateString();
        }

        // Priority 3: Standard Date or String
        try {
            const d = new Date(date);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString();
            }
        } catch (e) {
            return 'Error fecha';
        }

        return 'Fecha inválida';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Gestión de Tareas
                    </h1>
                    <p className="text-metal-silver max-w-2xl">
                        Asigna simulacros y prácticas a tus clases.
                        {subscription?.plan === 'free' && (
                            <span className="text-yellow-500 ml-2 font-bold">
                                (Plan Gratuito: Máximo 3 tareas activas)
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="metallic-btn bg-metal-gold text-black font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center gap-2 transform hover:scale-105 transition-all"
                >
                    <Plus size={20} /> Crear Nueva Tarea
                </button>
            </div>

            {/* Assignments Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <div className="w-16 h-16 bg-metal-silver/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-metal-silver" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No hay tareas activas</h3>
                    <p className="text-metal-silver mb-6">Crea tu primera asignación para tus estudiantes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="group relative bg-metal-dark border border-metal-silver/10 p-6 rounded-2xl hover:border-metal-gold/30 transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${assignment.requiresPro
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-metal-silver/10 text-metal-silver border border-metal-silver/20'
                                    }`}>
                                    {assignment.requiresPro ? 'Simulacro Pro' : 'Práctica Standard'}
                                </div>
                                <button
                                    onClick={() => handleDelete(assignment.id)}
                                    className="text-metal-silver/50 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                {assignment.title}
                            </h3>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-2 text-sm text-metal-silver">
                                    <Clock size={16} className="text-metal-gold" />
                                    <span>Vence: {formatDate(assignment.dueDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-metal-silver">
                                    <Users size={16} className="text-metal-blue" />
                                    <span>Asignado a clase (ID: {assignment.classId.substring(0, 4)}...)</span>
                                </div>
                            </div>

                            {assignment.requiresPro && (
                                <div className="mt-4 p-2 bg-purple-500/10 rounded-lg flex items-center gap-2 text-xs text-purple-300">
                                    <Lock size={12} />
                                    Solo accesible para Estudiantes Pro
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CreateAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssignmentCreated={fetchAssignments}
            />
        </div>
    );
}
