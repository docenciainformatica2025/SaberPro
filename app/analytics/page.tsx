"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import PerformanceChart from "@/components/analytics/PerformanceChart";
import Link from "next/link";
import ResultsHistoryList from "@/components/analytics/ResultsHistoryList";
import ResultDetailModal from "@/components/analytics/ResultDetailModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { pdfGenerator } from "@/utils/pdfGenerator";
import {
    ArrowLeft,
    Brain,
    Target,
    TrendingUp,
    Trophy,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Download,
    BarChart3,
    History,
    GraduationCap
} from "lucide-react";
import { AnalyticsSkeleton } from "@/components/ui/AnalyticsSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { adaptiveEngine, AdaptiveAdvice } from "@/utils/adaptiveEngine";
import AICoachMessage from "@/components/analytics/AICoachMessage";

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [trendData, setTrendData] = useState<{ name: string; value: number; fullDate: Date }[]>([]);
    const [radarData, setRadarData] = useState<{ name: string; value: number; fullMark: number }[]>([]);
    const [fullResults, setFullResults] = useState<any[]>([]); // Keep as any[] for now as its complex but handle safely
    const [selectedResult, setSelectedResult] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState("Estudiante");
    const [aiAnalysis, setAiAnalysis] = useState<AdaptiveAdvice | null>(null);

    const [kpis, setKpis] = useState({
        totalSimulations: 0,
        averageScore: 0,
        highestScore: 0,
        questionsAnswered: 0
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setUserName(user.displayName || user.email?.split('@')[0] || "Estudiante");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            try {
                const q = query(collection(db, "results"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                let totalScoreSum = 0;
                let maxScore = 0;
                let totalQuestions = 0;
                const trend: any[] = [];
                const moduleScores: { [key: string]: { sum: number, count: number } } = {};
                const resultsList: any[] = [];

                const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                rawData.sort((a: any, b: any) => {
                    const timeA = (a.completedAt || a.date)?.toDate ? (a.completedAt || a.date).toDate().getTime() : 0;
                    const timeB = (b.completedAt || b.date)?.toDate ? (b.completedAt || b.date).toDate().getTime() : 0;
                    return timeA - timeB;
                });

                rawData.forEach((data: any) => {
                    const score = Math.round((data.score / data.totalQuestions) * 100);
                    const timestamp = data.completedAt || data.date;
                    const dateObj = timestamp?.toDate ? timestamp.toDate() : new Date();
                    resultsList.push(data);
                    totalScoreSum += score;
                    if (score > maxScore) maxScore = score;
                    totalQuestions += data.totalQuestions;
                    trend.push({
                        name: dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }),
                        value: score,
                        fullDate: dateObj
                    });
                    if (data.module) {
                        const modKey = data.module;
                        if (!moduleScores[modKey]) moduleScores[modKey] = { sum: 0, count: 0 };
                        moduleScores[modKey].sum += score;
                        moduleScores[modKey].count += 1;
                    }
                });

                const radar = Object.keys(moduleScores).map(modId => ({
                    name: formatModuleName(modId),
                    value: Math.round(moduleScores[modId].sum / moduleScores[modId].count),
                    fullMark: 100
                }));

                if (radar.length === 0) {
                    const defaultModules = ["razonamiento_cuantitativo", "lectura_critica", "competencias_ciudadanas", "ingles", "comunicacion_escrita"];
                    defaultModules.forEach(m => radar.push({ name: formatModuleName(m), value: 0, fullMark: 100 }));
                }

                setTrendData(trend.slice(-7));
                setRadarData(radar);
                setFullResults(resultsList);
                setKpis({
                    totalSimulations: snapshot.size,
                    averageScore: snapshot.size > 0 ? Math.round(totalScoreSum / snapshot.size) : 0,
                    highestScore: maxScore,
                    questionsAnswered: totalQuestions
                });

                // Generate AI Analysis
                const analysis = adaptiveEngine.analyzeProfile(radar, {
                    averageScore: snapshot.size > 0 ? Math.round(totalScoreSum / snapshot.size) : 0
                });
                setAiAnalysis(analysis);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, [user]);

    const formatModuleName = (id: string) => {
        return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('Razonamiento ', 'Raz. ').replace('Competencias ', 'Comp. ');
    };

    const handleViewReport = (result: any) => {
        setSelectedResult(result);
        setIsModalOpen(true);
    };

    const handleDownloadReport = () => {
        if (!user) return;
        const reportData = {
            user: { name: userName, email: user.email || "" },
            kpis: kpis,
            trendData: trendData,
            radarData: radarData
        };
        pdfGenerator.generatePerformanceReport(reportData);
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] p-6 md:p-12 pb-24" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto">
                {isLoadingData ? (
                    <AnalyticsSkeleton />
                ) : fullResults.length === 0 ? (
                    <div className="py-20 flex justify-center">
                        <EmptyState
                            title="Sin Datos de Desempeño"
                            description="Completa tu primer simulacro para ver analíticas detalladas de tu evolución."
                            icon={Trophy}
                            actionLabel="Comenzar Simulacro"
                            onAction={() => window.location.href = '/simulation'}
                        />
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-12"
                    >
                        {/* Header - Elite Style */}
                        <motion.div variants={itemVariant} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-12 border-b border-[var(--theme-border-soft)] pb-12">
                            <div className="space-y-4">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-slate-500 hover:text-brand-primary uppercase tracking-[0.2em] font-black text-[9px] pl-0 mb-2 transition-all">
                                        Volver al Inicio
                                    </Button>
                                </Link>
                                <div className="space-y-2">
                                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                                        Analíticas de <span className="text-brand-primary italic">Rendimiento</span>
                                    </h1>
                                    <p className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase ml-1">
                                        Monitoreo de evolución académica en tiempo real
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    icon={Download}
                                    onClick={handleDownloadReport}
                                    className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl transition-all"
                                >
                                    Reporte PDF
                                </Button>
                                <div className="px-6 py-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 shadow-2xl shadow-brand-primary/5 group transition-all hover:bg-brand-primary/10">
                                    <div className="flex items-center gap-3 text-brand-primary text-[10px] font-black tracking-widest uppercase mb-1">
                                        <Brain size={16} /> Proyección IA
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-[var(--theme-text-primary)] tracking-tighter leading-none">
                                        {kpis.averageScore > 0 ? (kpis.averageScore * 3).toString() + " / 300" : "PROCESANDO..."}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* KPIs Grid - Elite Cards */}
                        <motion.div variants={itemVariant} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card variant="glass" className="p-10 border-[3px] border-brand-primary/5 bg-brand-primary/[0.01] rounded-[2.5rem] hover:-translate-y-2 transition-all group overflow-hidden relative">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shadow-sm">
                                        <Trophy size={20} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Dominio Máximo</span>
                                </div>
                                <div className="text-4xl font-bold text-slate-800 tracking-tight leading-none relative z-10">{kpis.highestScore}%</div>
                            </Card>

                            <Card variant="glass" className="p-10 border-[3px] border-brand-primary/5 bg-brand-primary/[0.01] rounded-[2.5rem] hover:-translate-y-2 transition-all group overflow-hidden relative">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 shadow-sm">
                                        <Target size={20} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Nivel de Maestría</span>
                                </div>
                                <div className={`text-4xl font-bold tracking-tight leading-none relative z-10 ${kpis.averageScore >= 60 ? "text-emerald-500" : "text-slate-800"}`}>{kpis.averageScore}%</div>
                            </Card>

                            <Card variant="glass" className="p-10 border-[3px] border-brand-primary/5 bg-brand-primary/[0.01] rounded-[2.5rem] hover:-translate-y-2 transition-all group overflow-hidden relative">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 shadow-sm">
                                        <TrendingUp size={20} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Desafíos</span>
                                </div>
                                <div className="text-4xl font-bold text-slate-800 tracking-tight leading-none relative z-10">{kpis.totalSimulations}</div>
                            </Card>

                            <Card variant="glass" className="p-10 border-[3px] border-brand-primary/5 bg-brand-primary/[0.01] rounded-[2.5rem] hover:-translate-y-2 transition-all group overflow-hidden relative">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 shadow-sm">
                                        <Brain size={20} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Interacciones</span>
                                </div>
                                <div className="text-4xl font-bold text-slate-800 tracking-tight leading-none relative z-10">{kpis.questionsAnswered}</div>
                            </Card>
                        </motion.div>

                        {/* AI Insight - Phase 8: Adaptive Coach */}
                        <motion.div variants={itemVariant}>
                            {aiAnalysis && <AICoachMessage analysis={aiAnalysis} />}
                        </motion.div>

                        {/* Charts Section */}
                        <motion.div variants={itemVariant} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                                <div className="mb-8 border-b border-[var(--theme-border-soft)] pb-4">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tight">Evolución de Puntaje</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Tendencia de tus últimos 7 simulacros</p>
                                </div>
                                <div className="h-[300px] w-full">
                                    <PerformanceChart
                                        type="line"
                                        data={trendData.map(({ fullDate, ...rest }) => rest)}
                                        color="#D4AF37"
                                    />
                                </div>
                            </Card>

                            <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                                <div className="mb-8 border-b border-[var(--theme-border-soft)] pb-4">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tight">Balance de Competencias</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Fortalezas vs. Debilidades (Promedio)</p>
                                </div>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    <PerformanceChart type="radar" data={radarData} color="#60a5fa" />
                                </div>
                            </Card>
                        </motion.div>

                        {/* History Section */}
                        <motion.div variants={itemVariant}>
                            <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                                <div className="mb-8 border-b border-[var(--theme-border-soft)] pb-4 flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tight">Historial de Simulacros</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Registro detallado y reportes de resultados</p>
                                    </div>
                                    <Badge variant="default" className="text-[10px] bg-slate-50 text-slate-500 border-slate-100">{fullResults.length} REGISTROS</Badge>
                                </div>
                                <ResultsHistoryList results={fullResults} onViewReport={handleViewReport} />
                            </Card>
                        </motion.div>

                        {/* Modals */}
                        <ResultDetailModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            result={selectedResult}
                            userName={userName}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
