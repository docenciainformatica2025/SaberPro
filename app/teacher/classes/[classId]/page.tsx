"use client";

import { useAuth } from "@/context/AuthContext";
import { use, useEffect, useState } from "react";
import { ClassService } from "@/services/teacher/class.service";
import { Classroom } from "@/types/classroom";
import { Users, Clock, Trophy, Play, Settings, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import ClassAnalyticsDashboard from "@/components/teacher/ClassAnalyticsDashboard";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                <Link href="/teacher/classes" className="p-3 bg-[var(--theme-bg-surface)] rounded-2xl text-[var(--theme-text-secondary)] hover:text-brand-primary transition-all border border-[var(--theme-border-soft)] shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-[var(--theme-text-primary)] tracking-tightest flex flex-wrap items-center gap-4 uppercase italic">
                        {classroom.name}
                        <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full border border-brand-primary/20 tracking-[0.2em] font-black not-italic">
                            COD: {classroom.code}
                        </span>
                    </h1>
                    <p className="text-xs font-medium text-[var(--theme-text-tertiary)] flex items-center gap-2 mt-2 uppercase tracking-widest leading-none">
                        <Users size={14} className="text-brand-primary" /> {students.length} Estudiantes inscritos
                    </p>
                </div>
                <div className="md:ml-auto flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-overlay)] text-[var(--theme-text-primary)] font-black text-[10px] uppercase tracking-[0.2em] px-6 py-4 rounded-xl flex items-center justify-center gap-3 border border-[var(--theme-border-soft)] transition-all">
                        <Settings size={18} /> Configurar
                    </button>
                    <button className="flex-[2] md:flex-none bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all shimmer-gold">
                        <Play size={18} /> Clase en Vivo
                    </button>
                </div>
            </div>

            {/* Navigation Tabs - Elite Style */}
            <div className="flex items-center gap-2 mb-10 p-1.5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 rounded-xl transition-all ${activeTab === 'overview'
                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                        : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)]'
                        }`}
                >
                    <Users size={16} /> Vista General
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 rounded-xl transition-all ${activeTab === 'analytics'
                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                        : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)]'
                        }`}
                >
                    <Trophy size={16} /> Analíticas Pro
                </button>
            </div>

            {/* Content Switch */}
            {activeTab === 'overview' ? (
                /* Content Grid */
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Main: Student List / Leaderboard */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5">
                            <div className="p-6 bg-[var(--theme-bg-overlay)] border-b border-[var(--theme-border-soft)] flex justify-between items-center">
                                <h3 className="font-black text-[var(--theme-text-primary)] flex items-center gap-3 uppercase tracking-tighter italic">
                                    <Trophy className="text-brand-primary" size={20} /> Cuadro de Honor
                                </h3>
                                <div className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)]">
                                    Live Sync
                                </div>
                            </div>

                            {students.length === 0 ? (
                                <div className="p-24 text-center text-[var(--theme-text-tertiary)] italic flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 bg-[var(--theme-bg-base)] rounded-3xl flex items-center justify-center border border-[var(--theme-border-soft)]">
                                        <Users size={40} className="opacity-20 text-brand-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-bold text-[var(--theme-text-primary)] not-italic uppercase tracking-tight">Sin estudiantes registrados</p>
                                        <p className="text-xs uppercase tracking-widest font-medium">Comparte el código con tu grupo:</p>
                                        <div className="mt-4 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl">
                                            <span className="text-4xl font-black text-brand-primary tracking-widest">{classroom.code}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[var(--theme-border-soft)] text-[9px] uppercase tracking-[0.25em] text-[var(--theme-text-tertiary)] font-black">
                                                <th className="p-6 w-20 text-center">Rango</th>
                                                <th className="p-6">Estudiante</th>
                                                <th className="p-6 text-center">Consistencia</th>
                                                <th className="p-6 text-center">Resultado</th>
                                                <th className="p-6 text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--theme-border-soft)]">
                                            {students.map((student, index) => (
                                                <tr key={index} className="hover:bg-[var(--theme-bg-overlay)] transition-all group duration-300">
                                                    <td className="p-6 text-center">
                                                        <span className={cn(
                                                            "inline-flex w-8 h-8 rounded-lg items-center justify-center font-black text-xs",
                                                            index === 0 ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "bg-[var(--theme-bg-base)] text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)]"
                                                        )}>
                                                            {index + 1}
                                                        </span>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] flex items-center justify-center text-xs font-black uppercase text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                                                {student.studentName?.charAt(0) || "E"}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black tracking-tight uppercase italic">{student.studentName || "Estudiante"}</span>
                                                                <span className="text-[9px] text-[var(--theme-text-tertiary)] uppercase font-bold tracking-widest">Activo hoy</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="max-w-[120px] mx-auto space-y-2">
                                                            <div className="flex justify-between text-[9px] font-black uppercase text-[var(--theme-text-tertiary)] px-0.5">
                                                                <span>Nivel</span>
                                                                <span>{student.lastTotalQuestions ? Math.round((student.lastScore / (student.lastTotalQuestions || 1)) * 100) : 0}%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-[var(--theme-bg-base)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                                                                <div
                                                                    className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                                                                    style={{
                                                                        width: `${student.lastTotalQuestions ? Math.round((student.lastScore / student.lastTotalQuestions) * 100) : 0}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-lg font-black text-[var(--theme-text-primary)] tracking-tightest">
                                                                {student.lastScore !== undefined ? (student.lastTotalQuestions ? `${student.lastScore}/${student.lastTotalQuestions}` : student.lastScore) : "---"}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Puntos</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <button
                                                            onClick={() => handleStudentReport(student)}
                                                            className="p-3 bg-[var(--theme-bg-base)] hover:bg-brand-primary hover:text-white rounded-xl text-[var(--theme-text-tertiary)] transition-all border border-[var(--theme-border-soft)] group-hover:shadow-lg shadow-black/5"
                                                            title="Generar Reporte PDF"
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
                    <div className="space-y-8">
                        <div className="bg-[var(--theme-bg-surface)] p-8 rounded-[2rem] border border-[var(--theme-border-soft)] shadow-2xl shadow-black/5">
                            <h3 className="font-black text-[var(--theme-text-primary)] mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
                                <Clock size={20} className="text-brand-primary" /> Pulso en Vivo
                            </h3>
                            <div className="space-y-6">
                                {students.filter(s => s.lastActivity).length > 0 ? (
                                    students
                                        .filter(s => s.lastActivity)
                                        .sort((a, b) => (b.lastActivity?.seconds || 0) - (a.lastActivity?.seconds || 0))
                                        .slice(0, 5)
                                        .map((student, i) => (
                                            <div key={i} className="flex gap-4 items-start border-b border-[var(--theme-border-soft)] pb-6 last:border-0 last:pb-0 group">
                                                <div className="w-10 h-10 rounded-xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] flex items-center justify-center text-xs font-black text-brand-primary group-hover:scale-110 transition-transform shadow-sm">
                                                    {student.studentName?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed font-bold">
                                                        <span className="font-black text-[var(--theme-text-primary)] uppercase italic tracking-tight">{student.studentName}</span> completó el módulo <span className="text-brand-primary uppercase tracking-wider">{student.lastModule?.replace('_', ' ') || 'Examen'}</span>.
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-[9px] font-black bg-brand-primary/5 px-2.5 py-1 rounded text-brand-primary uppercase tracking-widest border border-brand-primary/10">
                                                            SCORE: {student.lastScore}/{student.lastTotalQuestions}
                                                        </span>
                                                        <span className="text-[9px] text-[var(--theme-text-quaternary)] font-black uppercase flex items-center gap-1.5">
                                                            <Clock size={10} />
                                                            {student.lastActivity?.seconds ? new Date(student.lastActivity.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="py-12 text-center text-[var(--theme-text-tertiary)] italic flex flex-col items-center gap-4 opacity-30">
                                        <Clock size={32} />
                                        <p className="text-[10px] uppercase font-black tracking-widest leading-loose">Escaneando actividad<br />en tiempo real...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-brand-primary p-8 rounded-[2rem] text-white shadow-2xl shadow-brand-primary/30 relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                <Trophy size={160} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Promedio General</h4>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black tracking-tightest">
                                    {students.length > 0
                                        ? Math.round(students.reduce((acc, s) => acc + (s.lastScore || 0), 0) / (students.reduce((acc, s) => acc + (s.lastTotalQuestions || 0), 0) || 1) * 300)
                                        : 0}
                                </span>
                                <span className="text-sm font-black opacity-60 uppercase tracking-widest">Pts</span>
                            </div>
                            <p className="text-xs font-medium opacity-80 leading-relaxed">
                                Puntaje proyectado del grupo basado en simulacros recientes.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <ClassAnalyticsDashboard students={students} classroomName={classroom.name} />
            )}
        </div>
    );
}
