"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookOpen, Brain, Clock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { User } from "firebase/auth";
import { motion } from "framer-motion";

interface Assignment {
    id: string;
    title: string;
    subject: string;
    createdAt: any;
    questions?: any[];
    classId: string;
    status?: string;
}

interface StudentAssignmentsProps {
    user: User | null;
}

export default function StudentAssignments({ user }: StudentAssignmentsProps) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [classCount, setClassCount] = useState(0);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user) return;
            setLoading(true);
            setError(null);
            try {
                const enrollmentQ = query(collection(db, "class_members"), where("userId", "==", user.uid));
                const enrollmentSnap = await getDocs(enrollmentQ);

                const classIds: string[] = [];
                const completedAssignmentIds: string[] = [];

                enrollmentSnap.docs.forEach(d => {
                    const data = d.data();
                    classIds.push(data.classId);
                    if (data.completedAssignments && Array.isArray(data.completedAssignments)) {
                        data.completedAssignments.forEach((id: string) => completedAssignmentIds.push(id));
                    }
                });

                setClassCount(classIds.length);

                if (classIds.length === 0) {
                    setAssignments([]);
                    setLoading(false);
                    return;
                }

                const chunks = [];
                for (let i = 0; i < classIds.length; i += 10) {
                    chunks.push(classIds.slice(i, i + 10));
                }

                let allAssignments: Assignment[] = [];
                for (const chunk of chunks) {
                    const q = query(collection(db, "assignments"), where("classId", "in", chunk));
                    const snapshot = await getDocs(q);
                    const chunkAssignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Assignment[];
                    allAssignments = [...allAssignments, ...chunkAssignments];
                }

                const validAssignments = allAssignments
                    .filter(a => {
                        const isActive = a.status === 'active' || !a.status;
                        const isNotCompleted = !completedAssignmentIds.includes(a.id!);
                        return isActive && isNotCompleted;
                    })
                    .sort((a: any, b: any) => {
                        const timeA = a.createdAt?.seconds || 0;
                        const timeB = b.createdAt?.seconds || 0;
                        return timeB - timeA;
                    });

                setAssignments(validAssignments);
            } catch (err: any) {
                console.error("Error fetching assignments:", err);
                if (err.message.includes("requires an index")) {
                    setError("Error de índices en DB. Contacte soporte.");
                } else {
                    setError("No se pudieron cargar las tareas.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAssignments();
    }, [user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    if (loading) {
        return (
            <div className="animate-pulse flex items-center gap-2 text-theme-text-secondary mb-8">
                <div className="w-4 h-4 bg-theme-text-secondary/20 rounded-full"></div>
                <span className="text-xs">Buscando tareas asignadas...</span>
            </div>
        );
    }

    if (classCount === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="text-brand-primary" /> Tareas Pendientes ({assignments.length})
                </h2>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs font-bold text-brand-primary hover:underline border border-brand-primary/30 px-3 py-1 rounded-full hover:bg-brand-primary/10 transition-colors">
                    VE A TUS CLASES ACTIVAS
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {assignments.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {assignments.map((assign) => (
                        <motion.div
                            variants={itemVariants}
                            key={assign.id}
                            className="metallic-card bg-slate-900 border border-theme-text-secondary/10 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-primary/30 transition-all shadow-lg hover:shadow-brand-primary/5"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 rounded-lg bg-metal-blue/10 text-metal-blue text-[10px] font-semibold uppercase tracking-wider border border-metal-blue/20">
                                        {assign.subject?.replace('_', ' ') || 'EXAMEN'}
                                    </div>
                                    {assign.createdAt && (
                                        <div className="flex items-center gap-1 text-[10px] text-theme-text-secondary font-mono">
                                            <Clock size={12} />
                                            {new Date(assign.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 min-h-[56px] leading-tight">
                                    {assign.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-theme-text-secondary mb-6 bg-black/20 p-2 rounded-lg w-fit">
                                    <Brain size={14} className="text-brand-primary" />
                                    <span>{assign.questions?.length || 0} Preguntas</span>
                                </div>
                                <a
                                    href={`/simulation?assignmentId=${assign.id}`}
                                    className="w-full relative overflow-hidden group/btn bg-white/5 hover:bg-brand-primary border border-white/10 hover:border-brand-primary text-white hover:text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-brand-primary/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        INICIAR AHORA <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="mb-8 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-theme-text-secondary/10 rounded-full text-theme-text-secondary">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Todo al día</h3>
                        <p className="text-theme-text-secondary text-xs">No tienes evaluaciones pendientes en tus {classCount} clases.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
