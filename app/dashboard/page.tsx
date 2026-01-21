"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Zap, History, Crown, Target, Brain, BookOpen, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { StudentService } from "@/services/student/student.service";
import ResultsHistoryList from "@/components/analytics/ResultsHistoryList";
import ResultDetailModal from "@/components/analytics/ResultDetailModal";
import StudentAssignments from "@/components/dashboard/StudentAssignments";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import StatCardPremium from "@/components/ui/StatCardPremium";
import { Skeleton } from "@/components/ui/Skeleton"; // Import Skeleton
import PromotionBanner from "@/components/ui/PromotionBanner";
import { driver } from "driver.js"; // Import Driver
import "driver.js/dist/driver.css"; // Import Driver CSS

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
    const [isLoadingData, setIsLoadingData] = useState(true); // New loading state for data

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

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoadingData(true);
            try {
                // Fetch Results Stats
                const q = query(collection(db, "results"), where("userId", "==", user.uid), orderBy("completedAt", "desc"), limit(5));
                const snapshot = await getDocs(q);
                let totalScore = 0;
                const results: any[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const score = Math.round((data.score / data.totalQuestions) * 100);
                    totalScore += score;
                    results.push({ id: doc.id, ...data });
                });

                if (snapshot.size > 0) {
                    setStats({
                        averageScore: Math.round(totalScore / snapshot.size),
                        completedSimulations: snapshot.size
                    });
                    setRecentResults(results);
                }

                // Fetch Enrollments (Classes)
                const enrollmentQ = query(collection(db, "class_members"), where("userId", "==", user.uid));
                const enrollmentSnap = await getDocs(enrollmentQ);
                const classIds = enrollmentSnap.docs.map(d => d.data().classId);

                if (classIds.length > 0) {
                    const classesQ = query(collection(db, "classrooms"), where("__name__", "in", classIds.slice(0, 10)));
                    const classesSnap = await getDocs(classesQ);
                    setMyClasses(classesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                }

            } catch (error: any) {
                // Suppress console error for known index issue to avoid Next.js Error Overlay
                const isIndexError = error?.message && error.message.includes("requires an index");
                if (!isIndexError) {
                    console.error("Error fetching dashboard data:", error);
                }
                if (isIndexError) {
                    setFirestoreError(error.message);
                }
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();

        // Quote rotation
        const interval = setInterval(() => {
            setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }, 15000);
        return () => clearInterval(interval);
    }, [user]);

    // Handle Join Class
    const handleJoinClass = async () => {
        if (!joinCode || !user) return;
        setJoining(true);
        try {
            const result = await StudentService.joinClassByCode(user.uid, joinCode, userName);

            if (result.success) {
                alert(result.message);
                setJoinCode("");
                if (result.classData) {
                    setMyClasses(prev => [...prev, result.classData]);
                }
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

    // Driver.js Tour
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

                // Small delay to ensure everything rendered
                setTimeout(() => driverObj.drive(), 1000);
            }
        }
    }, [loading, isLoadingData, user]);


    if (loading) return <AIProcessingLoader text="Cargando Perfil" subtext="Analizando progreso..." />;

    return (
        <div className="space-y-12 pb-44 px-6 md:px-12 animate-in fade-in duration-700">
            <PromotionBanner />
            {firestoreError && (
                <div className="fixed top-0 left-0 w-full bg-red-600/90 text-white z-50 p-4 text-center backdrop-blur-md">
                    <p className="font-bold mb-2">⚠️ ATENCIÓN: Se requiere configuración de base de datos</p>
                    <p className="text-sm opacity-90 mb-2">Para ver tus resultados, el administrador debe hacer clic en el siguiente enlace generado por Firebase:</p>
                    <a href={firestoreError.match(/https?:\/\/[^\s]+/)?.[0]} target="_blank" rel="noopener noreferrer" className="underline font-mono bg-black/20 px-2 py-1 rounded">
                        CREAR ÍNDICE DE BASE DE DATOS
                    </a>
                </div>
            )}

            {/* Header Premium */}
            <div id="tour-welcome" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white flex items-center gap-4 tracking-tighter italic uppercase animate-in slide-in-from-left-4 duration-700">
                        <Sparkles className="text-metal-gold" size={36} /> Hola, {userName?.split(' ')[0]}
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-2 flex items-center gap-2 font-medium italic animate-in slide-in-from-left-4 duration-700 delay-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-metal-gold animate-pulse"></span>
                        &quot;{quote}&quot;
                    </p>
                </div>
                <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-700 delay-200">
                    <Link href="/simulation" id="tour-start-sim">
                        <Button variant="premium" size="lg" icon={Brain} className="shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest font-black text-xs">
                            Iniciar Simulacro
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div id="tour-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                {isLoadingData ? (
                    <>
                        <Skeleton className="h-32 rounded-2xl bg-white/5" />
                        <Skeleton className="h-32 rounded-2xl bg-white/5" />
                        <Skeleton className="h-32 rounded-2xl bg-white/5" />
                    </>
                ) : (
                    <>
                        <StatCardPremium
                            title="Puntaje Global"
                            value={stats.averageScore}
                            icon={<Target size={22} />}
                            trend={stats.averageScore > 300 ? "Nivel Avanzado" : "En Progreso"}
                            trendUp={stats.averageScore > 300}
                            color="gold"
                        />
                        <StatCardPremium
                            title="Simulacros Ejecutados"
                            value={stats.completedSimulations}
                            icon={<Brain size={22} />}
                            trend="+2 esta semana"
                            trendUp={true}
                            color="purple"
                        />
                        <StatCardPremium
                            title="Nivel de Preparación"
                            value={`${Math.min(100, Math.round((stats.completedSimulations * 10) + (stats.averageScore / 5)))}%`}
                            icon={<Zap size={22} />}
                            trend="Listo para el examen"
                            trendUp={true}
                            color="green"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                {/* Assignments Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card id="tour-assignments" variant="solid" className="p-8 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-metal-gold/5 rounded-full blur-[100px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-80" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <BookOpen className="text-metal-gold" size={20} /> Asignaciones Académicas
                            </h3>
                            <Badge variant="premium" className="px-3 py-1 text-[10px] uppercase font-black tracking-widest">Activas</Badge>
                        </div>

                        {isLoadingData ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
                                <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
                            </div>
                        ) : (
                            <StudentAssignments user={user} />
                        )}
                    </Card>

                    <Card variant="solid" className="p-8 border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <History className="text-blue-400" size={20} /> Resultados Recientes
                            </h3>
                            <Link href="/analytics">
                                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider text-metal-silver hover:text-white">
                                    Ver Todos <ArrowRight size={14} className="ml-1" />
                                </Button>
                            </Link>
                        </div>

                        {isLoadingData ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
                                <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
                                <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
                            </div>
                        ) : (
                            recentResults.length > 0 ? (
                                <ResultsHistoryList
                                    results={recentResults}
                                    onViewReport={(r: any) => { setSelectedResult(r); setIsModalOpen(true); }}
                                />
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl bg-black/20">
                                    <Brain className="mx-auto text-metal-silver/20 mb-3" size={48} />
                                    <p className="text-metal-silver/40 font-bold uppercase text-xs tracking-widest">Sin data de simulacros</p>
                                    <Button variant="ghost" onClick={() => router.push('/simulation')} className="mt-2 text-metal-gold font-bold hover:underline hover:bg-transparent">
                                        Realizar Primer Test
                                    </Button>
                                </div>
                            )
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Join Class Card */}
                    <Card id="tour-join-class" variant="solid" className="p-8 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
                            <Users className="text-purple-400" size={18} /> Unirse a Clase
                        </h3>
                        <div className="space-y-4">
                            <div className="relative group">
                                <Input
                                    placeholder="CÓDIGO DE ACCESO"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="bg-black/40 border-white/10 text-center font-mono tracking-[0.2em] text-lg uppercase placeholder:text-metal-silver/20 focus:border-purple-500/50 transition-all rounded-xl py-6"
                                    maxLength={6}
                                />
                                <div className="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <Button
                                variant="premium"
                                className="w-full font-black uppercase tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gradient-to-r from-purple-600 to-indigo-600 border-none"
                                onClick={handleJoinClass}
                                isLoading={joining}
                                disabled={!joinCode}
                            >
                                Validar Acceso
                            </Button>
                        </div>

                        {myClasses.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest mb-4">Membresías Activas</p>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {myClasses.map(cls => (
                                        <div key={cls.id} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors group cursor-default">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{cls.name}</p>
                                                    <p className="text-[10px] text-metal-silver/50 font-mono mt-1">{cls.grade || 'Sin grado'} • {cls.subject || 'General'}</p>
                                                </div>
                                                <Badge variant="ghost" className="text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/20">ACTIVO</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Pro Banner */}
                    {(!subscription || subscription.plan === 'free') && (
                        <Card variant="premium" className="p-8 relative overflow-hidden text-center border-metal-gold/30">
                            <div className="absolute inset-0 bg-gradient-to-br from-metal-gold/20 via-black to-black opacity-80" />
                            <div className="relative z-10">
                                <Crown className="mx-auto text-metal-gold mb-4 animate-bounce" size={32} />
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Plan Profesional</h3>
                                <p className="text-xs text-metal-silver/80 mb-6 font-medium leading-relaxed">
                                    Habilita todas las herramientas de análisis y práctica.
                                </p>
                                <Link href="/pricing">
                                    <Button variant="premium" className="w-full font-black uppercase tracking-widest text-xs h-10 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                        Obtener Pro
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {isModalOpen && selectedResult && (
                <ResultDetailModal
                    result={selectedResult}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userName={userName}
                />
            )}
        </div>
    );
}
