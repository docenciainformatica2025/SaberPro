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
    const [trendData, setTrendData] = useState<any[]>([]);
    const [radarData, setRadarData] = useState<any[]>([]);
    const [fullResults, setFullResults] = useState<any[]>([]);
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
                    averageScore: snapshot.size > 0 ? Math.round(totalScoreSum / snapshot.size) : 0,
                    totalSimulations: snapshot.size
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
        <div className="min-h-screen bg-metal-dark p-6 md:p-12 pb-24">
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
                        {/* Header */}
                        <motion.div variants={itemVariant} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/5 pb-8">
                            <div>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-metal-silver hover:text-white uppercase tracking-widest text-[10px] pl-0 mb-4">
                                        Volver al Dashboard
                                    </Button>
                                </Link>
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                                    Analíticas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Rendimiento</span>
                                </h1>
                                <p className="text-metal-silver/60 text-sm mt-2 font-medium">
                                    Monitoreo en tiempo real de tu evolución académica.
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    icon={Download}
                                    onClick={handleDownloadReport}
                                    className="bg-white/5 border-white/10 text-metal-silver hover:text-white"
                                >
                                    Descargar Reporte PDF
                                </Button>
                                <Badge variant="premium" className="px-4 py-2 text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-2">
                                    <Brain size={14} />
                                    Proyección IA: {kpis.averageScore > 0 ? (kpis.averageScore * 3).toString() + " / 300" : "Pendiente"}
                                </Badge>
                            </div>
                        </motion.div>

                        {/* KPIs Grid */}
                        <motion.div variants={itemVariant} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Card variant="glass" className="p-6 border-white/5 bg-white/[0.02] hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                        <Trophy size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-metal-silver">Puntaje Máximo</span>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tight">{kpis.highestScore}%</div>
                            </Card>

                            <Card variant="glass" className="p-6 border-white/5 bg-white/[0.02] hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <Target size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-metal-silver">Promedio Global</span>
                                </div>
                                <div className={`text-4xl font-black tracking-tight ${kpis.averageScore >= 60 ? "text-green-400" : "text-white"}`}>{kpis.averageScore}%</div>
                            </Card>

                            <Card variant="glass" className="p-6 border-white/5 bg-white/[0.02] hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                        <TrendingUp size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-metal-silver">Simulacros</span>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tight">{kpis.totalSimulations}</div>
                            </Card>

                            <Card variant="glass" className="p-6 border-white/5 bg-white/[0.02] hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                        <Brain size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-metal-silver">Preguntas</span>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tight">{kpis.questionsAnswered}</div>
                            </Card>
                        </motion.div>

                        {/* AI Insight - Phase 8: Adaptive Coach */}
                        <motion.div variants={itemVariant}>
                            {aiAnalysis && <AICoachMessage analysis={aiAnalysis} />}
                        </motion.div>

                        {/* Charts Section */}
                        <motion.div variants={itemVariant} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card variant="glass" className="p-8 border-white/5 bg-white/[0.02]">
                                <div className="mb-8 border-b border-white/5 pb-4">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Evolución de Puntaje</h3>
                                    <p className="text-xs font-bold text-metal-silver/50 uppercase tracking-widest mt-1">Tendencia de tus últimos 7 simulacros</p>
                                </div>
                                <div className="h-[300px] w-full">
                                    <PerformanceChart type="line" data={trendData} color="#D4AF37" />
                                </div>
                            </Card>

                            <Card variant="glass" className="p-8 border-white/5 bg-white/[0.02]">
                                <div className="mb-8 border-b border-white/5 pb-4">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Balance de Competencias</h3>
                                    <p className="text-xs font-bold text-metal-silver/50 uppercase tracking-widest mt-1">Fortalezas vs. Debilidades (Promedio)</p>
                                </div>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    <PerformanceChart type="radar" data={radarData} color="#60a5fa" />
                                </div>
                            </Card>
                        </motion.div>

                        {/* History Section */}
                        <motion.div variants={itemVariant}>
                            <Card variant="glass" className="p-8 border-white/5 bg-white/[0.02]">
                                <div className="mb-8 border-b border-white/5 pb-4 flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Historial de Simulacros</h3>
                                        <p className="text-xs font-bold text-metal-silver/50 uppercase tracking-widest mt-1">Registro detallado y reportes de resultados</p>
                                    </div>
                                    <Badge variant="default" className="text-[10px] bg-white/5 text-metal-silver border-white/10">{fullResults.length} REGISTROS</Badge>
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
