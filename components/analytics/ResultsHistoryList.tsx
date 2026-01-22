"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, FileText } from "lucide-react";

interface Result {
    id: string;
    module: string;
    score: number;
    totalQuestions: number;
    completedAt: any;
    isPartial?: boolean;
}

interface ResultsHistoryListProps {
    results: Result[];
    onViewReport: (result: Result) => void;
}

export default function ResultsHistoryList({ results, onViewReport }: ResultsHistoryListProps) {
    if (results.length === 0) {
        return (
            <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                <FileText className="mx-auto h-12 w-12 text-metal-silver/40 mb-4" />
                <h3 className="text-lg font-medium text-white">No hay simulacros completados</h3>
                <p className="text-metal-silver/60">Completa tu primer simulacro para ver tu historial aquí.</p>
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
                    const date = result.completedAt?.toDate ? result.completedAt.toDate() : new Date();
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);

                    return (
                        <motion.div
                            variants={itemVariants}
                            key={result.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-metal-silver font-medium">
                                    {format(date, "d MMM yyyy, HH:mm", { locale: es })}
                                </span>
                                {result.isPartial ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                                        Parcial
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-400/10 text-green-400 border border-green-400/20">
                                        Completado
                                    </span>
                                )}
                            </div>

                            <div>
                                <h4 className="text-white font-bold capitalize text-lg leading-tight mb-1">
                                    {result.module?.replace(/_/g, " ") || "Prueba General"}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className={`font-black text-2xl ${percentage >= 80 ? "text-green-400" :
                                        percentage >= 60 ? "text-yellow-400" : "text-red-400"
                                        }`}>
                                        {result.score}/{result.totalQuestions}
                                    </span>
                                    <span className="text-sm text-metal-silver font-medium">({percentage}%)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onViewReport(result)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-metal-gold text-black rounded-lg hover:bg-white transition-colors font-bold uppercase tracking-wider text-sm mt-2"
                            >
                                <Eye size={16} /> Ver Reporte Detallado
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="text-metal-silver bg-white/5 uppercase tracking-wider font-bold">
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
                            const date = result.completedAt?.toDate ? result.completedAt.toDate() : new Date();
                            const percentage = Math.round((result.score / result.totalQuestions) * 100);

                            return (
                                <motion.tr
                                    variants={itemVariants}
                                    key={result.id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap text-center">
                                        {format(date, "d MMM yyyy, HH:mm", { locale: es })}
                                    </td>
                                    <td className="px-6 py-4 text-metal-silver capitalize text-center font-medium text-base">
                                        {result.module?.replace(/_/g, " ") || "Prueba General"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`font-bold text-lg ${percentage >= 80 ? "text-green-400" :
                                                percentage >= 60 ? "text-yellow-400" : "text-red-400"
                                                }`}>
                                                {result.score}/{result.totalQuestions}
                                            </span>
                                            <span className="text-xs text-metal-silver/50">({percentage}%)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {result.isPartial ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                                                Parcial
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                                                Completado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onViewReport(result)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-metal-gold/10 hover:bg-metal-gold/20 text-metal-gold border border-metal-gold/20 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Eye size={14} /> Ver Reporte
                                        </button>
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
