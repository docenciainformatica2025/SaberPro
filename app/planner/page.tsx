"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Circle, Clock, MoreVertical, Plus, Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Types ---
interface StudySession {
    id: string;
    moduleId: string;
    title: string;
    durationMinutes: number;
    completed: boolean;
}

interface PlannerDay {
    date: string; // ISO YYYY-MM-DD
    type: 'study' | 'rest' | 'simulation';
    sessions: StudySession[];
}

interface PlannerConfig {
    examDate: string;
    studyDays: number[]; // 0=Sun, 1=Mon...
    intensity: 'low' | 'medium' | 'high';
}

// --- Utils (Mock Generators) ---
const generateMonthDays = (year: number, month: number) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Fill previous month padding
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
    }

    // Fill current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    return days;
};

const MODULES = [
    { id: 'math', title: 'Razonamiento Cuantitativo', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'reading', title: 'Lectura Crítica', color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 'citizen', title: 'Competencias Ciudadanas', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 'english', title: 'Inglés', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function PlannerPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [config, setConfig] = useState<PlannerConfig | null>(null);
    const [plannerData, setPlannerData] = useState<Record<string, PlannerDay>>({});
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isGenerating, setIsGenerating] = useState(false);

    // Calendar View State
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        const fetchPlanner = async () => {
            if (!user) return;
            // Mock Fetch
            // In reality: const docSnap = await getDoc(doc(db, "users", user.uid, "planner", "config"));
            // if (docSnap.exists()) setConfig(docSnap.data());
        };
        fetchPlanner();
    }, [user]);

    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        setTimeout(() => {
            // Mock Generation Logic
            const newPlannerData: Record<string, PlannerDay> = {};
            const today = new Date();

            // Generate for next 30 days
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dateKey = date.toISOString().split('T')[0];

                // Randomly assign rest or study
                const isRest = i % 7 === 6; // Sunday rest
                const isSim = i % 14 === 13; // Simulation every 2 weeks

                const sessions = [];
                if (!isRest && !isSim) {
                    sessions.push({
                        id: `s-${i}-1`,
                        moduleId: MODULES[i % MODULES.length].id,
                        title: `Sesión de ${MODULES[i % MODULES.length].title}`,
                        durationMinutes: 45,
                        completed: false
                    });
                    if (Math.random() > 0.5) {
                        sessions.push({
                            id: `s-${i}-2`,
                            moduleId: MODULES[(i + 1) % MODULES.length].id,
                            title: `Práctica de ${MODULES[(i + 1) % MODULES.length].title}`,
                            durationMinutes: 30,
                            completed: false
                        });
                    }
                }

                newPlannerData[dateKey] = {
                    date: dateKey,
                    type: isRest ? 'rest' : isSim ? 'simulation' : 'study',
                    sessions
                };
            }

            setPlannerData(newPlannerData);
            setConfig({ examDate: "2025-11-01", studyDays: [1, 2, 3, 4, 5], intensity: "medium" });
            setIsGenerating(false);
        }, 2000);
    };

    const toggleSession = (dayKey: string, sessionId: string) => {
        setPlannerData(prev => {
            const day = prev[dayKey];
            if (!day) return prev;
            return {
                ...prev,
                [dayKey]: {
                    ...day,
                    sessions: day.sessions.map(s => s.id === sessionId ? { ...s, completed: !s.completed } : s)
                }
            };
        });
    };

    if (loading) return null;

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-metal-dark flex items-center justify-center">
                <AIProcessingLoader text="Diseñando tu Plan de Estudio" subtext="Analizando tus debilidades y optimizando tiempos..." />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="min-h-screen bg-metal-dark flex items-center justify-center p-4">
                <Card variant="premium" className="max-w-lg w-full p-8 text-center space-y-8">
                    <div className="w-20 h-20 bg-metal-gold/20 rounded-full flex items-center justify-center mx-auto text-metal-gold animate-pulse">
                        <Sparkles size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase italic">Planificador IA</h1>
                        <p className="text-metal-silver mt-2">Deja que nuestra Inteligencia Artificial organice tu agenda para maximizar tus resultados en el Saber Pro.</p>
                    </div>

                    <div className="space-y-4 text-left bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <Target className="text-metal-gold" size={20} />
                            <span className="text-sm font-bold text-white">Enfoque en Debilidades</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-blue-400" size={20} />
                            <span className="text-sm font-bold text-white">Horarios Flexibles</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="text-purple-400" size={20} />
                            <span className="text-sm font-bold text-white">Adaptación Automática</span>
                        </div>
                    </div>

                    <Button onClick={handleGeneratePlan} variant="premium" className="w-full h-14 uppercase tracking-widest font-black text-sm">
                        Generar Mi Plan Ahora
                    </Button>
                </Card>
            </div>
        );
    }

    const daysInMonth = generateMonthDays(currentYear, currentMonth);
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    const selectedDayData = plannerData[selectedDateKey];

    // Calculate progress
    const totalSessions = Object.values(plannerData).reduce((acc, day) => acc + day.sessions.length, 0);
    const completedSessions = Object.values(plannerData).reduce((acc, day) => acc + day.sessions.filter(s => s.completed).length, 0);
    const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return (
        <div className="min-h-screen bg-metal-dark p-4 md:p-8 pb-32">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-metal-silver hover:text-white uppercase tracking-widest text-[10px] pl-0">
                                Volver al Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                            Tu Plan de <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Estudio</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-metal-silver uppercase font-bold tracking-widest mb-1">Progreso del Plan</p>
                            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-metal-gold transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-metal-gold flex items-center justify-center text-metal-gold font-black text-xs">
                            {progress}%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Calendar Widget */}
                    <Card variant="glass" className="lg:col-span-2 p-6 md:p-8">
                        {/* Month Nav */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white capitalize">
                                {new Date(currentYear, currentMonth).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentMonth(prev => prev - 1)}>&lt;</Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentMonth(prev => prev + 1)}>&gt;</Button>
                            </div>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                <span key={d} className="text-[10px] uppercase font-bold text-metal-silver/50 tracking-widest">{d}</span>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map((date, idx) => {
                                if (!date) return <div key={`empty-${idx}`} />;

                                const dateKey = date.toISOString().split('T')[0];
                                const dayData = plannerData[dateKey];
                                const isSelected = selectedDate.toDateString() === date.toDateString();
                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                    <button
                                        key={dateKey}
                                        onClick={() => setSelectedDate(date)}
                                        className={`
                                            aspect-square rounded-xl p-2 relative flex flex-col justify-between transition-all group
                                            ${isSelected ? 'bg-metal-gold text-black shadow-lg shadow-metal-gold/20 scale-105 z-10' : 'bg-white/5 text-metal-silver hover:bg-white/10'}
                                            ${isToday ? 'ring-1 ring-metal-gold' : ''}
                                        `}
                                    >
                                        <span className={`text-xs font-bold ${isSelected ? 'text-black' : 'text-metal-silver'}`}>{date.getDate()}</span>

                                        {dayData && (
                                            <div className="flex justify-center gap-0.5 mt-1">
                                                {dayData.type === 'simulation' ? (
                                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-purple-500'}`} />
                                                ) : dayData.type === 'rest' ? (
                                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black/20' : 'bg-white/10'}`} />
                                                ) : dayData.sessions.length > 0 ? (
                                                    <div className="flex gap-0.5">
                                                        {dayData.sessions.slice(0, 3).map((s, i) => (
                                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${s.completed ? 'bg-green-500' : isSelected ? 'bg-black/50' : 'bg-metal-gold'}`} />
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Day Details Panel */}
                    <Card variant="premium" className="p-6 md:p-8 flex flex-col h-full border-t border-metal-gold/50">
                        <div className="mb-6">
                            <p className="text-[10px] bg-black/40 text-metal-gold inline-block px-2 py-1 rounded uppercase font-bold tracking-widest mb-2">
                                {selectedDate.toLocaleDateString('es-CO', { weekday: 'long' })}
                            </p>
                            <h2 className="text-3xl font-black text-white uppercase italic">
                                {selectedDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
                            </h2>
                        </div>

                        <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {!selectedDayData || selectedDayData.type === 'rest' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-white/10 rounded-xl bg-black/20">
                                    <Sparkles className="text-metal-gold mb-4 opacity-50" size={32} />
                                    <h3 className="text-white font-bold mb-1">Día de Descanso</h3>
                                    <p className="text-xs text-metal-silver">Recarga energías. No hay sesiones programadas para hoy.</p>
                                </div>
                            ) : selectedDayData.type === 'simulation' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-purple-500/20 rounded-xl bg-purple-500/10">
                                    <Target className="text-purple-400 mb-4" size={32} />
                                    <h3 className="text-white font-bold mb-1">Simulacro Programado</h3>
                                    <p className="text-xs text-metal-silver mb-4">Es hora de poner a prueba tus conocimientos.</p>
                                    <Link href="/simulation">
                                        <Button variant="premium" className="w-full">Iniciar Simulacro</Button>
                                    </Link>
                                </div>
                            ) : (
                                selectedDayData.sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => toggleSession(selectedDateKey, session.id)}
                                        className={`
                                            p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4 select-none
                                            ${session.completed
                                                ? 'bg-green-500/10 border-green-500/20 opacity-60'
                                                : 'bg-white/5 border-white/10 hover:border-metal-gold/30 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <div className={`mt-0.5 text-metal-gold group-hover:scale-110 transition-transform`}>
                                            {session.completed ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-metal-silver group-hover:text-metal-gold" />}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold mb-1 ${session.completed ? 'text-green-200 line-through' : 'text-white'}`}>
                                                {session.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-metal-silver uppercase font-bold tracking-wider">
                                                <Clock size={10} /> {session.durationMinutes} min
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {selectedDayData?.type === 'study' && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-center text-xs text-metal-silver/50">
                                    Tip: Completa todas las sesiones para mantener tu racha 🔥
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
