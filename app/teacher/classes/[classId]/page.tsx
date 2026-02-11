"use client";

import { useAuth } from "@/context/AuthContext";
import { use, useEffect, useState } from "react";
import { ClassService } from "@/services/teacher/class.service";
import { Classroom } from "@/types/classroom";
import { Users, Clock, Trophy, Play, Settings, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import ClassAnalyticsDashboard from "@/components/teacher/ClassAnalyticsDashboard";
import jsPDF from "jspdf";

interface ClassDetailsProps {
    params: Promise<{
        classId: string;
    }>;
}

export default function ClassDetailsPage({ params }: ClassDetailsProps) {
    const { classId } = use(params);
    const { user } = useAuth();
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [students, setStudents] = useState<any[]>([]); // To be defined strictly later
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

    const handleStudentReport = (student: any) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(212, 175, 55);
        doc.text("SaberPro", 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("Reporte Individual de Estudiante", 14, 30);

        // Student Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text(`Estudiante: ${student.studentName || "N/A"}`, 14, 60);
        doc.setFontSize(12);
        doc.text(`Clase: ${classroom?.name || "N/A"}`, 14, 70);

        // Stats
        doc.setFillColor(245, 245, 245);
        doc.rect(14, 85, pageWidth - 28, 40, 'F');

        doc.setFontSize(10);
        doc.text("ULTIMO PUNTAJE", 20, 95);
        doc.setFontSize(24);
        const scoreStr = student.lastScore !== undefined ? `${student.lastScore}/${student.lastTotalQuestions || '?'}` : "---";
        doc.text(scoreStr, 20, 110);

        doc.setFontSize(10);
        doc.text("ESTADO", 100, 95);
        doc.setFontSize(24);
        doc.setTextColor(student.lastScore !== undefined ? 0 : 150);
        doc.text(student.lastScore !== undefined ? "ACTIVO" : "INACTIVO", 100, 110);

        // Footer line
        doc.setDrawColor(200);
        doc.line(14, 150, pageWidth - 14, 150);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Este reporte certifica el progreso actual del estudiante en la plataforma SaberPro.", 14, 160);

        doc.save(`Reporte_${student.studentName || 'Estudiante'}.pdf`);
    };

    useEffect(() => {
        if (!user || !classId) return;



        // 1. Get Class Metadata
        const fetchClass = async () => {
            const data = await ClassService.getClassDetails(classId);
            if (data) {
                setClassroom(data);
            }
            setLoading(false);
        };
        fetchClass();

        // 2. Real-time Student Listener
        const unsubscribe = ClassService.subscribeToClassStudents(classId, (members) => {
            setStudents(members);
        });
        return () => unsubscribe();

    }, [classId, user]);

    if (loading) return <div className="p-8 text-center text-[var(--theme-text-tertiary)]">Cargando aula...</div>;
    if (!classroom) return <div className="p-8 text-center text-red-500">Clase no encontrada</div>;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/teacher/classes" className="p-2 bg-[var(--theme-bg-surface)] rounded-lg text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                        {classroom.name}
                        <span className="text-sm bg-metal-gold/20 text-metal-gold px-3 py-1 rounded-full border border-metal-gold/30">
                            {classroom.code}
                        </span>
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] flex items-center gap-2 mt-1">
                        <Users size={14} /> {students.length} Estudiantes inscritos
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="metallic-btn bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-overlay)] text-[var(--theme-text-primary)] font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-[var(--theme-border-soft)]">
                        <Settings size={18} /> Configurar
                    </button>
                    <button className="metallic-btn bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 active:scale-95 transition-all">
                        <Play size={18} /> Iniciar Sesión en Vivo
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 mb-8 border-b border-[var(--theme-border-soft)]">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'overview'
                        ? 'border-metal-gold text-[var(--theme-text-primary)] bg-[var(--theme-bg-surface)]'
                        : 'border-transparent text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-surface)]'
                        }`}
                >
                    <Users size={16} /> Vista General
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'analytics'
                        ? 'border-metal-gold text-[var(--theme-text-primary)] bg-[var(--theme-bg-surface)]'
                        : 'border-transparent text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-surface)]'
                        }`}
                >
                    <Trophy size={16} /> Analíticas Pro
                </button>
            </div>

            {/* Content Switch */}
            {activeTab === 'overview' ? (
                /* Content Grid */
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
                    {/* Main: Student List / Leaderboard */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl overflow-hidden">
                            <div className="p-4 bg-[var(--theme-bg-overlay)] border-b border-[var(--theme-border-soft)] flex justify-between items-center">
                                <h3 className="font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
                                    <Trophy className="text-metal-gold" size={18} /> Tabla de Posiciones
                                </h3>
                                <span className="text-xs text-[var(--theme-text-tertiary)] uppercase tracking-wider">Actualización en tiempo real</span>
                            </div>

                            {students.length === 0 ? (
                                <div className="p-12 text-center text-[var(--theme-text-tertiary)] italic flex flex-col items-center gap-4">
                                    <Users size={48} className="opacity-20" />
                                    <div>
                                        Esperando a que los estudiantes se unan.<br />
                                        Comparte el código: <strong className="text-[var(--theme-text-primary)] text-xl bg-[var(--theme-bg-base)] px-2 py-1 rounded ml-2">{classroom.code}</strong>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[var(--theme-border-soft)] text-xs uppercase tracking-wider text-[var(--theme-text-tertiary)] font-bold">
                                                <th className="p-4 w-16 text-center">#</th>
                                                <th className="p-4">Estudiante</th>
                                                <th className="p-4 text-center">Progreso</th>
                                                <th className="p-4 text-center">Puntaje</th>
                                                <th className="p-4 text-center">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--theme-border-soft)]">
                                            {students.map((student, index) => (
                                                <tr key={index} className="hover:bg-[var(--theme-bg-overlay)] transition-colors group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                                                    <td className="p-4 text-center font-mono font-bold text-[var(--theme-text-primary)]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold uppercase">
                                                                {student.studentName?.charAt(0) || "E"}
                                                            </div>
                                                            {student.studentName || "Estudiante"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {/* Mock Progress Bar */}
                                                        <div className="w-24 h-1.5 bg-[var(--theme-border-soft)] rounded-full mx-auto overflow-hidden">
                                                            <div
                                                                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${student.lastTotalQuestions ? Math.round((student.lastScore / student.lastTotalQuestions) * 100) : 0}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-[var(--theme-text-primary)]">
                                                        {student.lastScore !== undefined ? (student.lastTotalQuestions ? `${student.lastScore}/${student.lastTotalQuestions}` : student.lastScore) : "---"}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {student.lastScore !== undefined ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-bg-success-soft)] text-[var(--theme-text-success)] border border-[var(--theme-border-success)]">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-text-success)] animate-pulse"></span>
                                                                Completado
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-bg-base)] text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)]">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleStudentReport(student)}
                                                            className="p-2 bg-[var(--theme-bg-base)] hover:bg-[var(--theme-bg-surface)] rounded-lg text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] transition-colors border border-transparent hover:border-[var(--theme-border-soft)]"
                                                            title="Descargar Reporte Individual"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Activity Feed */}
                    <div className="space-y-6">
                        <div className="metallic-card p-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                            <h3 className="font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-blue-400" /> Actividad Reciente
                            </h3>
                            <div className="space-y-4">
                                {students.filter(s => s.lastActivity).length > 0 ? (
                                    students
                                        .filter(s => s.lastActivity)
                                        .sort((a, b) => (b.lastActivity?.seconds || 0) - (a.lastActivity?.seconds || 0))
                                        .slice(0, 5)
                                        .map((student, i) => (
                                            <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4 border-b border-[var(--theme-border-soft)] pb-3 last:border-0">
                                                <div className="w-8 h-8 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] flex items-center justify-center text-xs font-bold text-[var(--theme-text-tertiary)] shrink-0">
                                                    {student.studentName?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-[var(--theme-text-secondary)]">
                                                        <span className="font-bold text-[var(--theme-text-primary)]">{student.studentName}</span> completó el módulo <span className="text-[var(--theme-text-primary)] capitalize">{student.lastModule?.replace('_', ' ') || 'Examen'}</span>.
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-mono bg-[var(--theme-bg-base)] px-2 py-0.5 rounded text-[var(--theme-text-tertiary)]">
                                                            Nota: {student.lastScore}/{student.lastTotalQuestions}
                                                        </span>
                                                        <span className="text-[10px] text-[var(--theme-text-tertiary)]/50 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {student.lastActivity?.seconds ? new Date(student.lastActivity.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-sm text-[var(--theme-text-tertiary)] text-center py-4 italic opacity-50">
                                        Sin actividad reciente.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ClassAnalyticsDashboard students={students} classroomName={classroom.name} />
            )}
        </div>
    );
}
