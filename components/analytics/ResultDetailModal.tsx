"use client";

import { useRef, useState } from "react";
import { X, Download, CheckCircle, AlertCircle, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Result {
    id: string;
    module: string;
    score: number;
    totalQuestions: number;
    completedAt: any;
    isPartial?: boolean;
}

interface ResultDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: Result | null;
    userName: string;
}

export default function ResultDetailModal({ isOpen, onClose, result, userName }: ResultDetailModalProps) {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const { subscription } = useAuth();
    const router = useRouter();
    const isPro = subscription?.plan === 'pro';

    if (!isOpen || !result) return null;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const date = result.completedAt?.toDate ? result.completedAt.toDate() : new Date();

    // Mock Level Calculation (ICFES uses 1-4 scale) - Using HEX for PDF compatibility
    const getLevel = (pct: number) => {
        if (pct >= 80) return { level: 4, desc: "Avanzado", color: "#22c55e", bg: "#dcfce7" }; // green-500, green-100
        if (pct >= 60) return { level: 3, desc: "Satisfactorio", color: "#3b82f6", bg: "#dbeafe" }; // blue-500, blue-100
        if (pct >= 40) return { level: 2, desc: "Mínimo", color: "#eab308", bg: "#fef9c3" }; // yellow-500, yellow-100
        return { level: 1, desc: "Insuficiente", color: "#ef4444", bg: "#fee2e2" }; // red-500, red-100
    };

    const level = getLevel(percentage);

    const handleDownloadPDF = async () => {
        if (!isPro) {
            if (confirm("Los Certificados de Desempeño son exclusivos del Plan Pro. ¿Deseas obtenerlos?")) {
                router.push('/pricing');
            }
            return;
        }
        setIsDownloading(true);
        try {
            // await new Promise(resolve => setTimeout(resolve, 500)); // Removed mock delay

            // Use the new Pro Generator
            const { pdfGenerator } = await import("@/utils/pdfGenerator");

            pdfGenerator.generateStudentReport(
                userName,
                "", // No class name in individual mode
                result.score,
                result.totalQuestions,
                result.module
            );

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(`Hubo un error generando el PDF.`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-metal-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/20">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FileTextIcon /> Reporte de Resultados
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className={`flex items-center gap-2 px-4 py-2 text-black rounded-lg font-bold transition-colors disabled:opacity-50 ${isPro ? "bg-metal-gold hover:bg-white" : "bg-metal-silver/50 cursor-not-allowed hover:bg-metal-silver/60"}`}
                            title={isPro ? "Descargar Certificado" : "Mejorar a Pro para descargar"}
                        >
                            {isDownloading ? "Generando..." : "Descargar PDF"} {isPro ? <Download size={18} /> : <Lock size={18} />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-metal-silver hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Report Content - Scrollable View */}
                <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-neutral-900">
                    {/* The Printable Area - Letter Dimensions (roughly 216mm x 279mm) */}
                    <div
                        ref={reportRef}
                        className="bg-white p-8 md:p-12 mx-auto rounded-xl max-w-[216mm] min-h-[279mm] relative flex flex-col justify-between"
                        style={{ fontFamily: 'Inter, sans-serif', color: '#000000', boxShadow: 'none' }}
                    >
                        {/* Report Header */}
                        <div className="border-b-2 pb-8 mb-8 flex justify-between items-start" style={{ borderColor: '#f3f4f6' }}>
                            <div>
                                <h1 className="text-3xl font-black mb-2 uppercase tracking-tight" style={{ color: '#111827' }}>Reporte Individual</h1>
                                <p className="font-medium" style={{ color: '#6b7280' }}>Simulacro Saber Pro 2026</p>
                            </div>
                            <div className="text-right">
                                <div className="px-4 py-1 font-bold text-sm uppercase tracking-widest inline-block mb-2" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                                    Simulacro
                                </div>
                                <p className="text-sm" style={{ color: '#9ca3af' }}>ID: {result.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Candidate Info */}
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="p-6 rounded-xl border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                                <span className="block text-xs uppercase font-bold mb-1 tracking-wider" style={{ color: '#9ca3af' }}>Estudiante</span>
                                <span className="block text-xl font-bold capitalize" style={{ color: '#111827' }}>{userName}</span>
                            </div>
                            <div className="p-6 rounded-xl border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                                <span className="block text-xs uppercase font-bold mb-1 tracking-wider" style={{ color: '#9ca3af' }}>Fecha de Presentación</span>
                                <span className="block text-xl font-bold" style={{ color: '#111827' }}>{date.toLocaleDateString("es-CO", { dateStyle: 'long' })}</span>
                            </div>
                        </div>

                        {/* Main Score */}
                        <div className="mb-12">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-wide border-l-4 pl-3" style={{ color: '#111827', borderColor: '#000000' }}>
                                Desempeño General - {result.module.replace(/_/g, " ")}
                            </h2>

                            <div className="flex items-stretch gap-6">
                                <div className="flex-1 p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#111827', color: '#ffffff' }}>
                                    <div className="absolute top-0 right-0 p-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                                    <span className="text-6xl font-black tracking-tighter relative z-10">{result.score}</span>
                                    <span className="text-sm font-medium uppercase tracking-widest relative z-10" style={{ color: '#9ca3af' }}>Puntaje Obtenido</span>
                                    <span className="text-xs mt-2 relative z-10" style={{ color: '#6b7280' }}>De {result.totalQuestions} posibles</span>
                                </div>

                                <div className="flex-1 border-2 rounded-2xl p-8 flex flex-col justify-center" style={{ borderColor: '#f3f4f6' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-medium" style={{ color: '#6b7280' }}>Nivel de Desempeño</span>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-black uppercase"
                                            style={{ backgroundColor: level.bg, color: level.color }}
                                        >
                                            Nivel {level.level}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold mb-2" style={{ color: level.color }}>{level.desc}</p>
                                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                                        {level.level === 4 && "El estudiante demuestra un dominio avanzado de los conceptos evaluados, capaz de aplicar conocimientos en contextos complejos."}
                                        {level.level === 3 && "El estudiante muestra un desempeño satisfactorio, con comprensión sólida de los conceptos fundamentales."}
                                        {level.level === 2 && "El estudiante evidencia un desempeño mínimo aceptable, con dificultades en temas de mayor complejidad."}
                                        {level.level === 1 && "El estudiante no alcanza los competencias mínimas requeridas. Se recomienda refuerzo intensivo."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Detail */}
                        <div className="mb-12">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-wide border-l-4 pl-3" style={{ color: '#111827', borderColor: '#000000' }}>
                                Análisis Detallado
                            </h2>
                            <div className="rounded-xl p-6 border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold" style={{ color: '#374151' }}>Precisión de Respuestas</span>
                                    <span className="font-bold" style={{ color: '#111827' }}>{percentage}%</span>
                                </div>
                                <div className="w-full h-4 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#e5e7eb' }}>
                                    <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: '#111827' }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                                        <CheckCircle size={16} /> <span>{result.score} Correctas</span>
                                    </div>
                                    <div className="flex items-center gap-2" style={{ color: '#9ca3af' }}>
                                        <AlertCircle size={16} /> <span>{result.totalQuestions - result.score} Incorrectas / Omitidas</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-6 items-end text-[10px]" style={{ borderColor: '#f3f4f6', color: '#6b7280' }}>
                            <div className="flex flex-col gap-1 w-full">
                                <p className="font-bold" style={{ color: '#111827' }}>Copyright © Ing. Antonio Rodríguez 2024-2025</p>
                                <p className="font-medium mb-1" style={{ color: '#9ca3af' }}>© 2026 SaberPro Platform</p>
                                <p className="leading-tight text-justify" style={{ color: '#9ca3af' }}>
                                    Este documento es un reporte de simulacro generado exclusivamente con fines académicos y de entrenamiento.
                                    No sustituye ni tiene validez oficial ante el Instituto Colombiano para la Evaluación de la Educación (ICFES).
                                </p>
                            </div>
                            <div className="text-right flex flex-col gap-1">
                                <span className="block font-bold uppercase tracking-widest text-[9px]" style={{ color: '#374151' }}>Fecha de Generación</span>
                                <span className="block font-mono" style={{ color: '#4b5563' }}>{date.toLocaleString("es-CO")}</span>
                                <div className="mt-2 text-[9px] uppercase tracking-widest" style={{ color: '#d1d5db' }}>
                                    Documento No Oficial
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}
