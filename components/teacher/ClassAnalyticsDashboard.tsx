import { useMemo } from "react";
import { Users, TrendingUp, AlertTriangle, Target, Download, Lock } from "lucide-react";
import PerformanceChart from "@/components/analytics/PerformanceChart";
import { pdfGenerator } from "@/utils/pdfGenerator";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { SubscriptionPlan } from "@/types/finance";

interface ClassAnalyticsDashboardProps {
    students: any[];
    classroomName: string;
}

export default function ClassAnalyticsDashboard({ students, classroomName }: ClassAnalyticsDashboardProps) {
    const { subscription } = useAuth();
    const router = useRouter();
    const isPro = subscription?.plan === SubscriptionPlan.PRO || subscription?.plan === SubscriptionPlan.TEACHER_PRO; // Robust check

    const handleExportPDF = () => {
        if (!isPro) {
            if (confirm("Esta función es exclusiva para Miembros Pro. ¿Deseas mejorar tu plan?")) {
                router.push('/pricing');
            }
            return;
        }

        pdfGenerator.generateClassReport(classroomName, students);
    };

    // 1. Calculate KPI Metrics
    const metrics = useMemo(() => {
        const activeStudents = students.filter(s => s.lastScore !== undefined);
        const totalActive = activeStudents.length;

        if (totalActive === 0) return {
            average: 0,
            riskCount: 0,
            highCount: 0,
            distribution: [
                { name: "Bajo (<40%)", value: 0, fill: "#ef4444" },
                { name: "Medio (40-80%)", value: 0, fill: "#eab308" },
                { name: "Alto (>80%)", value: 0, fill: "#22c55e" }
            ],
            radar: []
        };

        // Average
        const sum = activeStudents.reduce((acc, s) => {
            // Handle 2/2 -> 100% conversion if needed, or raw score? 
            // Ideally we need percentage. Assuming lastScore is raw and lastTotalQuestions exists.
            const max = s.lastTotalQuestions || 1;
            const score = s.lastScore || 0;
            return acc + ((score / max) * 100);
        }, 0);
        const average = Math.round(sum / totalActive);

        // Risk (Below 40%), Average (40-70%), High (>70%)
        let low = 0, mid = 0, high = 0;
        activeStudents.forEach(s => {
            const max = s.lastTotalQuestions || 1;
            const pct = ((s.lastScore || 0) / max) * 100;
            if (pct < 40) low++;
            else if (pct < 80) mid++;
            else high++;
        });

        // Distribution Data for Chart
        const distribution = [
            { name: "Bajo (<40%)", value: low, fill: "#ef4444" },
            { name: "Medio (40-80%)", value: mid, fill: "#eab308" },
            { name: "Alto (>80%)", value: high, fill: "#22c55e" }
        ];

        // Real Data Aggregation (Snapshot of recent activity)
        const moduleStats: Record<string, { sum: number, count: number }> = {};
        const allModules = ["razonamiento_cuantitativo", "lectura_critica", "competencias_ciudadanas", "ingles", "comunicacion_escrita"]; // known keys

        // Pre-fill to ensure shape
        allModules.forEach(m => moduleStats[m] = { sum: 0, count: 0 });

        activeStudents.forEach(s => {
            if (s.lastModule && s.lastScore !== undefined) {
                const modKey = s.lastModule; // assuming matches keys
                if (moduleStats[modKey]) {
                    const max = s.lastTotalQuestions || 1;
                    const score = (s.lastScore / max) * 100;
                    moduleStats[modKey].sum += score;
                    moduleStats[modKey].count++;
                }
            }
        });

        const radar = Object.keys(moduleStats).map(key => {
            const stat = moduleStats[key];
            const avg = stat.count > 0 ? Math.round(stat.sum / stat.count) : 0;
            // Format Name
            const names: Record<string, string> = {
                "razonamiento_cuantitativo": "Razonamiento",
                "lectura_critica": "Lectura Crítica",
                "competencias_ciudadanas": "Ciudadanas",
                "ingles": "Inglés",
                "comunicacion_escrita": "Escrita"
            };
            return {
                name: names[key] || key,
                value: avg, // Real average of recent attempts
                fullMark: 100
            };
        });

        return {
            average,
            riskCount: low,
            highCount: high,
            distribution,
            radar
        };
    }, [students]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                    <TrendingUp className="text-metal-gold" /> Análisis de Grupo
                </h2>
                <Button
                    onClick={handleExportPDF}
                    variant={isPro ? "outline" : "ghost"}
                    icon={isPro ? Download : Lock}
                    className={!isPro ? "opacity-50" : ""}
                >
                    Exportar Reporte PDF {isPro ? "(Pro)" : "(Premium)"}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="glass" className="p-4 border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="text-metal-silver text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2 opacity-60">
                            <Target size={12} className="text-blue-400" /> Promedio Global
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{metrics.average}%</div>
                    </div>
                    <div className="text-[10px] text-metal-silver/40 font-medium">Base: {students.length} estudiantes</div>
                </Card>

                <Card variant="glass" className="p-4 border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="text-metal-silver text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2 opacity-60">
                            <AlertTriangle size={12} className="text-red-400" /> En Riesgo
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{metrics.riskCount}</div>
                    </div>
                    <div className="text-[10px] text-metal-silver/40 font-medium italic">Requieren refuerzo inmediato</div>
                </Card>

                <Card variant="glass" className="p-4 border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="text-metal-silver text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2 opacity-60">
                            <Users size={12} className="text-green-400" /> Destacados
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{metrics.highCount}</div>
                    </div>
                    <div className="text-[10px] text-metal-silver/40 font-medium">Superan las metas</div>
                </Card>

                <Card variant="glass" className="p-4 border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="text-metal-silver text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2 opacity-60">
                            <TrendingUp size={12} className="text-purple-400" /> Participación
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{Math.round((students.filter(s => s.lastScore !== undefined).length / (students.length || 1)) * 100)}%</div>
                    </div>
                    <div className="text-[10px] text-metal-silver/40 font-medium">Actividad reciente</div>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Distribution Chart (Using Bar Chart visual from library?) 
                     Actually, let's reuse PerformanceChart logic but we might need a specific 'bar' or 'pie' adaptation. 
                     PerformanceChart supports 'line' and 'radar'. Let's stick to Radar for Competency and maybe create a simple custom bar for distribution if needed.
                     Actually, let's just use the Radar for Competencies as the "Hero" chart.
                 */}
                <Card variant="glass" className="p-8 border-white/5">
                    <h3 className="text-white font-black mb-6 uppercase tracking-widest text-xs opacity-60">Perfil de Competencias del Grupo</h3>
                    <div className="h-[300px] w-full">
                        <PerformanceChart type="radar" data={metrics.radar} color="#D4AF37" />
                    </div>
                </Card>

                {/* Distribution Visual (Custom CSS Bar) */}
                <Card variant="glass" className="p-8 border-white/5 flex flex-col justify-center">
                    <h3 className="text-white font-black mb-8 uppercase tracking-widest text-xs opacity-60">Distribución de Rendimiento</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-wider">
                                <span className="text-green-400">Nivel Alto ({metrics.highCount})</span>
                                <span className="text-white">{Math.round((metrics.highCount / (students.length || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(metrics.highCount / (students.length || 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-wider">
                                <span className="text-yellow-400">Nivel Medio ({metrics.distribution[1].value})</span>
                                <span className="text-white">{Math.round((metrics.distribution[1].value / (students.length || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${(metrics.distribution[1].value / (students.length || 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-wider">
                                <span className="text-red-400">Nivel Bajo ({metrics.riskCount})</span>
                                <span className="text-white">{Math.round((metrics.riskCount / (students.length || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(metrics.riskCount / (students.length || 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-200/60 leading-relaxed italic">
                            <strong className="text-blue-400 non-italic mr-1">💡 IA INSIGHT:</strong>
                            {metrics.riskCount > metrics.highCount
                                ? "Se recomienda programar una sesión de refuerzo en conceptos básicos antes de avanzar con simulacros completos."
                                : "El grupo muestra una adaptación sólida. Es el momento ideal para incrementar la complejidad de las preguntas."}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Detailed Student List */}
            <Card variant="glass" className="p-0 border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-white font-black uppercase tracking-tight flex items-center gap-2">
                        <Users size={18} className="text-metal-gold" /> Detalle de Estudiantes
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-metal-silver">
                                <th className="p-4 pl-6">Estudiante</th>
                                <th className="p-4 text-center">Puntaje</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 pr-6 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 pl-6 font-bold text-white text-sm">
                                        {student.studentName || "Estudiante"}
                                    </td>
                                    <td className="p-4 text-center text-metal-silver font-medium">
                                        {student.lastScore !== undefined ? (student.lastTotalQuestions ? `${student.lastScore}/${student.lastTotalQuestions}` : student.lastScore) : "---"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {student.lastScore !== undefined ? (
                                            <Badge variant="success" className="text-[10px]">Activo</Badge>
                                        ) : (
                                            <Badge variant="default" className="text-[10px] opacity-40">Pendiente</Badge>
                                        )}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                pdfGenerator.generateStudentReport(
                                                    student.studentName || "Estudiante",
                                                    classroomName,
                                                    student.lastScore || 0,
                                                    student.lastTotalQuestions || 1,
                                                    student.lastModule || "General"
                                                );
                                            }}
                                            icon={Download}
                                            className="h-8 w-8 p-0"
                                            title="Descargar PDF"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
