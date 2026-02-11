"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, History, Crown, Target, Brain, BookOpen, Users, Trophy } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { StudentService } from "@/services/student/student.service";
import ResultsHistoryList from "@/components/analytics/ResultsHistoryList";
import ResultDetailModal from "@/components/analytics/ResultDetailModal";
import StudentAssignments from "@/components/dashboard/StudentAssignments";
import AchievementsGallery from "@/components/gamification/AchievementsGallery";
import { Card } from "@/components/ui/Card";
import { MasteryProgress } from "@/components/ui/MasteryProgress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import StatCardPremium from "@/components/ui/StatCardPremium";
import { Skeleton } from "@/components/ui/Skeleton";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import PromotionBanner from "@/components/ui/PromotionBanner";
import { driver } from "driver.js"; // Import Driver
import "driver.js/dist/driver.css"; // Import Driver CSS
import { adaptiveEngine } from "@/utils/adaptiveEngine";

const MOTIVATIONAL_QUOTES = [
    "La excelencia no es un acto, es un hábito. - Aristóteles",
    "Cree que puedes y estarás a medio camino. - Theodore Roosevelt",
    "El único lugar donde el éxito viene antes del trabajo es en el diccionario.",
    "No te detengas hasta que estés orgulloso.",
    "Tu futuro se crea con lo que haces hoy, no mañana."
];

export default function DashboardPage() {
    const { user, profile, loading, role, subscription } = useAuth();
    const router = useRouter();
    const [firestoreError, setFirestoreError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        averageScore: 0,
        completedSimulations: 0
    });
    const [userName, setUserName] = useState<string>("");
    const [recentResults, setRecentResults] = useState<any[]>([]);
    const [selectedResult, setSelectedResult] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joining, setJoining] = useState(false);
    const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
    const [myClasses, setMyClasses] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && role === 'teacher') {
            router.push('/teacher');
        }
        if (!loading && !user) {
            router.push("/");
        }
        if (user) {
            const realName = profile?.fullName || user.displayName || user.email?.split('@')[0] || "Estudiante";
            setUserName(realName);
        }
    }, [user, profile, role, loading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoadingData(true);
            try {
                // Parallelize independent fetches (Vercel Best Practice: async-parallel)
                const qResults = query(collection(db, "results"), where("userId", "==", user.uid), orderBy("completedAt", "desc"), limit(5));
                const qEnrollments = query(collection(db, "class_members"), where("userId", "==", user.uid));

                const [resultsSnap, enrollmentSnap] = await Promise.all([
                    getDocs(qResults),
                    getDocs(qEnrollments)
                ]);

                // Process Results
                let totalScore = 0;
                const results: any[] = [];
                resultsSnap.forEach(doc => {
                    const data = doc.data();
                    const score = Math.round((data.score / data.totalQuestions) * 100);
                    totalScore += score;
                    results.push({ id: doc.id, ...data });
                });

                if (resultsSnap.size > 0) {
                    setStats({
                        averageScore: Math.round(totalScore / resultsSnap.size),
                        completedSimulations: resultsSnap.size
                    });
                    setRecentResults(results);
                }

                // Process Enrollments
                const classIds = enrollmentSnap.docs.map(d => d.data().classId);

                if (classIds.length > 0) {
                    // This creates a dependent waterfall, but it's unavoidable without a join
                    // The initial parallelization already saves ~150-300ms
                    const classesQ = query(collection(db, "classrooms"), where("__name__", "in", classIds.slice(0, 10)));
                    const classesSnap = await getDocs(classesQ);
                    setMyClasses(classesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                }

            } catch (error: any) {
                const isIndexError = error?.message && error.message.includes("requires an index");
                if (!isIndexError) console.error("Error fetching dashboard data:", error);
                if (isIndexError) setFirestoreError(error.message);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();

        const interval = setInterval(() => {
            setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }, 15000);
        return () => clearInterval(interval);
    }, [user]);

    const handleJoinClass = async () => {
        if (!joinCode || !user) return;
        setJoining(true);
        try {
            const result = await StudentService.joinClassByCode(user.uid, joinCode, userName);
            if (result.success) {
                alert(result.message);
                setJoinCode("");
                if (result.classData) setMyClasses(prev => [...prev, result.classData]);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error joining class:", error);
            alert("Error al unirse a la clase.");
        } finally {
            setJoining(false);
        }
    };

    useEffect(() => {
        if (!loading && !isLoadingData && user) {
            const hasSeenTour = localStorage.getItem('dashboard_tour_seen');
            if (!hasSeenTour) {
                const driverObj = driver({
                    showProgress: true,
                    animate: true,
                    steps: [
                        { element: '#tour-welcome', popover: { title: '¡Bienvenido!', description: 'Este es tu panel de control principal donde verás todo tu progreso.' } },
                        { element: '#tour-start-sim', popover: { title: 'Empieza Aquí', description: 'Haz clic aquí para iniciar un nuevo simulacro de examen.' } },
                        { element: '#tour-stats', popover: { title: 'Tus Métricas', description: 'Aquí verás tu puntaje promedio y nivel de preparación en tiempo real.' } },
                        { element: '#tour-assignments', popover: { title: 'Tareas', description: 'Las tareas asignadas por tus profesores aparecerán aquí.' } },
                        { element: '#tour-join-class', popover: { title: 'Unirse a Clase', description: 'Ingresa el código que te dio tu profesor para unirte a su curso.' } },
                    ],
                    onDestroyStarted: () => {
                        localStorage.setItem('dashboard_tour_seen', 'true');
                        driverObj.destroy();
                    },
                });
                setTimeout(() => driverObj.drive(), 1000);
            }
        }
    }, [loading, isLoadingData, user]);

    if (loading && !user) return null;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {loading || isLoadingData ? (
                <DashboardSkeleton />
            ) : (
                <div className="space-y-12">
                    {/* 🏠 Header & Hero Area (Apple-style) */}
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-theme-hero tracking-tighter italic uppercase">Saber Pro One</h1>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] flex items-center justify-center text-[var(--brand-primary)] font-bold shadow-sm">
                                    {userName?.charAt(0)}
                                </div>
                                <button
                                    onClick={() => router.push('/settings')}
                                    className="p-2 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] transition-colors"
                                >
                                    <Crown size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="py-12 flex flex-col items-center text-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4 max-w-3xl mx-auto"
                            >
                                <h2 className="text-4xl md:text-6xl font-black text-theme-hero tracking-tighter uppercase italic">
                                    Hola, {userName?.split(' ')[0]} 👋
                                </h2>

                                {/* Smart Advice Box */}
                                {(() => {
                                    const radarData = [
                                        { name: 'Lectura', value: profile?.mastery?.lectura || 0 },
                                        { name: 'Razonamiento', value: profile?.mastery?.razonamiento || 0 },
                                        { name: 'Inglés', value: profile?.mastery?.ingles || 0 },
                                        { name: 'Competencias', value: profile?.mastery?.competencias || 0 }
                                    ];
                                    const advice = adaptiveEngine.analyzeProfile(radarData, stats, profile);

                                    return (
                                        <div className="space-y-8">
                                            <p className="text-xl md:text-2xl text-[var(--theme-text-secondary)] font-medium leading-relaxed">
                                                {advice.advice}
                                            </p>

                                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                                                <Link href="/simulation">
                                                    <Button
                                                        variant="primary"
                                                        size="xl"
                                                        icon={Brain}
                                                        className="rounded-full px-12 h-16 text-lg font-bold shadow-gold"
                                                    >
                                                        Iniciar {advice.nextRecommendedModule}
                                                    </Button>
                                                </Link>
                                                <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-3 text-left max-w-xs">
                                                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                                                        <Zap size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold tracking-widest text-brand-primary">Próximo Paso</p>
                                                        <p className="text-sm font-bold text-[var(--theme-text-primary)] leading-tight">{advice.actionStep}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </div>
                    </div>

                    {/* 📊 Progress Area */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                        <Card variant="glass" className="p-10 border-[var(--theme-border-soft)] flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Tu progreso</h3>
                                <p className="text-[var(--theme-text-secondary)] text-sm font-medium">Vas mejorando respecto a tu último intento. ¡Sigue así!</p>
                            </div>
                            <div className="flex-[2] w-full max-w-xl">
                                <MasteryProgress
                                    value={Math.min(100, Math.round((stats.completedSimulations * 10) + (stats.averageScore / 5)))}
                                    label="Dominio Académico"
                                    subtext={`De cada 10 preguntas, aciertas aproximadamente ${Math.round((stats.averageScore || 0) / 10)}`}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* 🧠 Skills Grid */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight px-2">Habilidades</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { name: 'Lectura', icon: BookOpen, mastery: profile?.mastery?.lectura || 0 },
                                { name: 'Razonamiento', icon: Brain, mastery: profile?.mastery?.razonamiento || 0 },
                                { name: 'Inglés', icon: Sparkles, mastery: profile?.mastery?.ingles || 0 },
                                { name: 'Competencias', icon: Users, mastery: profile?.mastery?.competencias || 0 }
                            ].map((skill, i) => {
                                const state = skill.mastery > 80 ? 'verde' : skill.mastery > 20 ? 'azul' : 'gris';
                                const colors = {
                                    verde: 'text-[var(--theme-text-success)] bg-[var(--theme-text-success)]/10 border-[var(--theme-text-success)]/20',
                                    azul: 'text-[var(--theme-text-info)] bg-[var(--theme-text-info)]/10 border-[var(--theme-text-info)]/20',
                                    gris: 'text-[var(--theme-text-tertiary)] bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)]'
                                };
                                return (
                                    <Link key={i} href={`/simulation?skill=${skill.name.toLowerCase()}`}>
                                        <Card
                                            interactive
                                            variant="glass"
                                            className={`p-8 flex flex-col items-center justify-center gap-4 group transition-all duration-180 ${state !== 'gris' ? 'hover:scale-[1.03]' : ''}`}
                                        >
                                            <div className={`p-4 rounded-2xl transition-all duration-180 ${colors[state]}`}>
                                                <skill.icon size={32} />
                                            </div>
                                            <div className="text-center">
                                                <span className="font-bold text-sm text-[var(--theme-text-primary)] block">{skill.name}</span>
                                                <span className={`text-[9px] font-bold uppercase tracking-wider ${colors[state].split(' ')[0]}`}>
                                                    {state === 'verde' ? 'Dominado' : state === 'azul' ? 'En progreso' : 'Pendiente'}
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* 📌 Smart Recommendation & Recent Results */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            <Card variant="premium" className="p-10 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent border-brand-primary/20">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <Badge variant="primary">RECOMENDADO PARA HOY</Badge>
                                        <h3 className="text-3xl font-bold text-[var(--theme-text-primary)]">Refuerza análisis crítico</h3>
                                        <p className="text-[var(--theme-text-secondary)]">Hemos detectado que puedes mejorar en inferencias de texto.</p>
                                    </div>
                                    <Zap className="text-brand-accent animate-pulse" size={40} />
                                </div>
                                <Button variant="primary" className="rounded-xl px-8" onClick={() => router.push('/simulation')}>
                                    Practicar ahora
                                </Button>
                            </Card>

                            <Card variant="solid" className="p-8 border-[var(--theme-border-soft)] shadow-[var(--theme-shadow-md)]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3 italic uppercase tracking-tight">
                                        <History className="text-blue-400" size={20} /> Resultados Recientes
                                    </h3>
                                    <Link href="/analytics">
                                        <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]">
                                            Ver Todos <ArrowRight size={14} className="ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                                {recentResults.length > 0 ? (
                                    <ResultsHistoryList results={recentResults} onViewReport={(r: any) => { setSelectedResult(r); setIsModalOpen(true); }} />
                                ) : (
                                    <div className="py-6">
                                        <EmptyState title="Sin Actividad Reciente" description="Aún no has realizado simulacros." icon={History} actionLabel="Realizar Primer Test" onAction={() => router.push('/simulation')} />
                                    </div>
                                )}
                            </Card>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <Card variant="solid" className="p-8 border-[var(--theme-border-soft)] shadow-[var(--theme-shadow-md)]">
                                <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-6 flex items-center gap-2 italic uppercase tracking-tight text-center justify-center">
                                    <Trophy className="text-brand-accent" size={18} /> Logros Destacados
                                </h3>
                                <AchievementsGallery />
                            </Card>

                            <Card id="tour-join-class" variant="glass" className="p-8 border-[var(--theme-border-soft)]">
                                <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-6 flex items-center gap-2 italic uppercase tracking-tight">
                                    <Users className="text-purple-400" size={18} /> Unirse a Clase
                                </h3>
                                <div className="flex gap-2">
                                    <Input placeholder="CÓDIGO" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="font-mono text-center tracking-widest uppercase" maxLength={6} />
                                    <Button variant="primary" className="px-6" onClick={handleJoinClass} isLoading={joining} disabled={!joinCode}>
                                        <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}


            {isModalOpen && selectedResult && (
                <ResultDetailModal
                    result={selectedResult}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userName={userName}
                />
            )}
        </main>
    );
}
