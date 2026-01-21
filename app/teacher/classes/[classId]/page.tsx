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
            const docRef = doc(db, "classrooms", classId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setClassroom({ id: docSnap.id, ...docSnap.data() } as Classroom);
            }
            setLoading(false);
        };
        fetchClass();

        // 2. Real-time Student Listener
        const q = query(collection(db, "class_members"), where("classId", "==", classId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const members = snapshot.docs.map(d => d.data());
            setStudents(members);
        });
        return () => unsubscribe();

    }, [classId, user]);

    if (loading) return <div className="p-8 text-center text-metal-silver">Cargando aula...</div>;
    if (!classroom) return <div className="p-8 text-center text-red-500">Clase no encontrada</div>;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/teacher/classes" className="p-2 bg-white/5 rounded-lg text-metal-silver hover:text-white">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        {classroom.name}
                        <span className="text-sm bg-metal-gold/20 text-metal-gold px-3 py-1 rounded-full border border-metal-gold/30">
                            {classroom.code}
                        </span>
                    </h1>
                    <p className="text-metal-silver flex items-center gap-2 mt-1">
                        <Users size={14} /> {students.length} Estudiantes inscritos
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="metallic-btn bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                        <Settings size={18} /> Configurar
                    </button>
                    <button className="metallic-btn bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 animate-pulse">
                        <Play size={18} /> Iniciar Sesión en Vivo
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 mb-8 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'overview'
                        ? 'border-metal-gold text-white bg-white/5'
                        : 'border-transparent text-metal-silver hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users size={16} /> Vista General
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'analytics'
                        ? 'border-metal-gold text-white bg-white/5'
                        : 'border-transparent text-metal-silver hover:text-white hover:bg-white/5'
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
                        <div className="bg-metal-dark border border-metal-silver/10 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-black/20 border-b border-metal-silver/10 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Trophy className="text-metal-gold" size={18} /> Tabla de Posiciones
                                </h3>
                                <span className="text-xs text-metal-silver/50 uppercase tracking-wider">Actualización en tiempo real</span>
                            </div>

                            {students.length === 0 ? (
                                <div className="p-12 text-center text-metal-silver/50 italic flex flex-col items-center gap-4">
                                    <Users size={48} className="opacity-20" />
                                    <div>
                                        Esperando a que los estudiantes se unan.<br />
                                        Comparte el código: <strong className="text-white text-xl bg-white/10 px-2 py-1 rounded ml-2">{classroom.code}</strong>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-metal-silver/10 text-xs uppercase tracking-wider text-metal-silver font-bold">
                                                <th className="p-4 w-16 text-center">#</th>
                                                <th className="p-4">Estudiante</th>
                                                <th className="p-4 text-center">Progreso</th>
                                                <th className="p-4 text-center">Puntaje</th>
                                                <th className="p-4 text-center">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-metal-silver/5">
                                            {students.map((student, index) => (
                                                <tr key={index} className="hover:bg-white/5 transition-colors group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                                                    <td className="p-4 text-center font-mono font-bold text-metal-gold">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-white flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold uppercase">
                                                                {student.studentName?.charAt(0) || "E"}
                                                            </div>
                                                            {student.studentName || "Estudiante"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {/* Mock Progress Bar */}
                                                        <div className="w-24 h-1.5 bg-metal-silver/20 rounded-full mx-auto overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${student.lastTotalQuestions ? Math.round((student.lastScore / student.lastTotalQuestions) * 100) : 0}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-white">
                                                        {student.lastScore !== undefined ? (student.lastTotalQuestions ? `${student.lastScore}/${student.lastTotalQuestions}` : student.lastScore) : "---"}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {student.lastScore !== undefined ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                                Completado
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-metal-silver/10 text-metal-silver border border-metal-silver/20">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleStudentReport(student)}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-metal-silver hover:text-metal-gold transition-colors border border-transparent hover:border-metal-gold/30"
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
                        <div className="metallic-card p-6 rounded-2xl border border-metal-silver/10">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-blue-400" /> Actividad Reciente
                            </h3>
                            <div className="space-y-4">
                                {students.filter(s => s.lastActivity).length > 0 ? (
                                    students
                                        .filter(s => s.lastActivity)
                                        .sort((a, b) => (b.lastActivity?.seconds || 0) - (a.lastActivity?.seconds || 0))
                                        .slice(0, 5)
                                        .map((student, i) => (
                                            <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4 border-b border-metal-silver/5 pb-3 last:border-0">
                                                <div className="w-8 h-8 rounded-full bg-metal-dark border border-metal-silver/20 flex items-center justify-center text-xs font-bold text-metal-silver shrink-0">
                                                    {student.studentName?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white">
                                                        <span className="font-bold text-metal-gold">{student.studentName}</span> completó el módulo <span className="text-metal-blue capitalize">{student.lastModule?.replace('_', ' ') || 'Examen'}</span>.
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-metal-silver">
                                                            Nota: {student.lastScore}/{student.lastTotalQuestions}
                                                        </span>
                                                        <span className="text-[10px] text-metal-silver/50 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {student.lastActivity?.seconds ? new Date(student.lastActivity.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-sm text-metal-silver text-center py-4 italic opacity-50">
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
