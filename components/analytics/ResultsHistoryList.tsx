"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Result {
    id: string;
    module: string;
    score: number;
    totalQuestions: number;
    completedAt: { toDate: () => Date } | Date | number | string;
    isPartial?: boolean;
}

interface ResultsHistoryListProps {
    results: Result[];
    onViewReport: (result: Result) => void;
}

export default function ResultsHistoryList({ results, onViewReport }: ResultsHistoryListProps) {
    if (results.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-theme-text-secondary/40 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay simulacros completados</h3>
                <p className="text-slate-500 dark:text-theme-text-secondary/60 font-medium">Completa tu primer simulacro para ver tu historial aquí.</p>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-4">
            {/* Mobile Card View */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="md:hidden space-y-4"
            >
                {results.slice().reverse().map((result) => {
                    const date = (result.completedAt && typeof result.completedAt === 'object' && 'toDate' in result.completedAt)
                        ? result.completedAt.toDate()
                        : (result.completedAt instanceof Date ? result.completedAt : new Date());
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);

                    return (
                        <motion.div
                            variants={itemVariants}
                            key={result.id}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-4 space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-slate-500 dark:text-theme-text-secondary font-bold uppercase tracking-wider">
                                    {format(date, "d MMM yyyy, HH:mm", { locale: es })}
                                </span>
                                {result.isPartial ? (
                                    <Badge variant="warning">Parcial</Badge>
                                ) : (
                                    <Badge variant="success">Completado</Badge>
                                )}
                            </div>

                            <div>
                                <h4 className="text-slate-900 dark:text-white font-black capitalize text-lg leading-tight mb-1">
                                    {result.module?.replace(/_/g, " ") || "Prueba General"}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className={`font-black text-2xl ${percentage >= 80 ? "text-emerald-500" :
                                        percentage >= 60 ? "text-amber-500" : "text-red-500"
                                        }`}>
                                        {result.score}/{result.totalQuestions}
                                    </span>
                                    <span className="text-sm text-slate-400 dark:text-theme-text-secondary font-bold">({percentage}%)</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => onViewReport(result)}
                                variant="primary"
                                className="w-full h-12 uppercase text-xs"
                                icon={Eye}
                            >
                                Ver Reporte Detallado
                            </Button>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100 dark:border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 dark:text-theme-text-secondary bg-slate-50 dark:bg-white/5 uppercase tracking-wider font-extrabold text-[10px]">
                        <tr>
                            <th className="px-6 py-4 text-center">Fecha</th>
                            <th className="px-6 py-4 text-center">Módulo</th>
                            <th className="px-6 py-4 text-center">Puntaje</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <motion.tbody
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="divide-y divide-white/5"
                    >
                        {results.slice().reverse().map((result) => {
                            const date = (result.completedAt && typeof result.completedAt === 'object' && 'toDate' in result.completedAt)
                                ? result.completedAt.toDate()
                                : (result.completedAt instanceof Date ? result.completedAt : new Date());
                            const percentage = Math.round((result.score / result.totalQuestions) * 100);

                            return (
                                <motion.tr
                                    variants={itemVariants}
                                    key={result.id}
                                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border-b border-slate-50 dark:border-white/5 last:border-none"
                                >
                                    <td className="px-6 py-6 font-bold text-slate-700 dark:text-white whitespace-nowrap text-center">
                                        {format(date, "d MMM yyyy, HH:mm", { locale: es })}
                                    </td>
                                    <td className="px-6 py-6 text-slate-500 dark:text-theme-text-secondary capitalize text-center font-bold text-base">
                                        {result.module?.replace(/_/g, " ") || "Prueba General"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`font-black text-xl ${percentage >= 80 ? "text-emerald-500" :
                                                percentage >= 60 ? "text-amber-500" : "text-red-500"
                                                }`}>
                                                {result.score}/{result.totalQuestions}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 dark:text-theme-text-secondary/50">({percentage}%)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {result.isPartial ? (
                                            <Badge variant="warning">Parcial</Badge>
                                        ) : (
                                            <Badge variant="success">Completado</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            onClick={() => onViewReport(result)}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs border-brand-primary/20 text-brand-primary"
                                            icon={Eye}
                                        >
                                            Ver Reporte
                                        </Button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
}
