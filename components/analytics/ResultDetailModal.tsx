"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Download, CheckCircle, AlertCircle, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

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
            toast("Función Exclusiva Pro", {
                description: "Obtén certificados oficiales y análisis detallado con Premium.",
                action: {
                    label: "Mejorar Plan",
                    onClick: () => router.push('/pricing'),
                },
                duration: 5000,
            });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl shadow-[var(--theme-shadow-lg)] overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)]/40">
                    <h3 className="text-[var(--theme-text-primary)] font-bold text-lg flex items-center gap-2">
                        <FileTextIcon /> Reporte de Resultados
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            variant={isPro ? "premium" : "outline"}
                            size="sm"
                            className={!isPro ? "text-[var(--theme-text-tertiary)] border-[var(--theme-border-soft)]" : "shadow-gold"}
                            icon={isPro ? Download : Lock}
                            iconPosition="right"
                        >
                            {isDownloading ? "Generando..." : "Descargar PDF"}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            icon={X}
                            className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)]/10"
                        />
                    </div>
                </div>

                {/* Report Content - Scrollable View */}
                <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)]">
                    {/* The Printable Area - Letter Dimensions (roughly 216mm x 279mm) */}
                    <div
                        ref={reportRef}
                        className="bg-white p-8 md:p-12 mx-auto rounded-xl max-w-[216mm] min-h-[279mm] relative flex flex-col justify-between"
                        style={{ fontFamily: 'Inter, sans-serif', color: '#000000', boxShadow: 'none' }}
                    >
                        {/* Report Header */}
                        <div className="border-b-2 pb-8 mb-8 flex justify-between items-start" style={{ borderColor: '#f3f4f6' }}>
                            <div>
                                <h1 className="text-3xl font-semibold mb-2 uppercase tracking-tight" style={{ color: '#111827' }}>Reporte Individual</h1>
                                <p className="font-medium" style={{ color: '#6b7280' }}>Simulacro Saber Pro 2026</p>
                            </div>
                            <div className="text-right">
                                <div className="px-4 py-1 font-bold text-sm uppercase tracking-wider inline-block mb-2" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
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

                        {/* Main Score & Meaning */}
                        <div className="mb-12">
                            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-[var(--theme-text-primary)]">
                                <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                                Resumen de {result.module?.replace(/_/g, " ") || "Prueba General"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                                <div className="p-10 rounded-3xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] flex flex-col items-center justify-center text-center">
                                    <span className="text-6xl font-bold text-[var(--theme-text-primary)] mb-2 tracking-tighter">
                                        {result.score} <span className="text-2xl font-light text-[var(--theme-text-secondary)]/30">/ {result.totalQuestions}</span>
                                    </span>
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">Aciertos Reales</p>
                                </div>

                                <div className="p-8 rounded-3xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] flex flex-col justify-center">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--theme-text-secondary)]">Significado</span>
                                        <Badge
                                            variant="ghost"
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase"
                                            style={{ color: level.color, backgroundColor: `${level.color}10` }}
                                        >
                                            Nivel {level.level}
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3 tracking-tight" style={{ color: level.color }}>
                                        {percentage >= 80 ? "Dominio Avanzado" : percentage >= 60 ? "Nivel Competitivo" : percentage >= 40 ? "Base Estable" : "Falta Refuerzo"}
                                    </h3>
                                    <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                                        De cada 10 preguntas, sueles acertar aproximandamente <strong>{Math.round(percentage / 10)}</strong>. {level.level === 4 ? "Excelente." : "Se recomienda práctica enfocada."}
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
                                <p className="font-bold" style={{ color: '#111827' }}>Copyright © {process.env.NEXT_PUBLIC_AUTHOR_NAME || "SaberPro"} 2024-2025</p>
                                <p className="font-medium mb-1" style={{ color: '#9ca3af' }}>© 2026 SaberPro Platform</p>
                                <p className="leading-tight text-justify" style={{ color: '#9ca3af' }}>
                                    Este documento es un reporte de simulacro generado exclusivamente con fines académicos y de entrenamiento.
                                    No sustituye ni tiene validez oficial ante el Instituto Colombiano para la Evaluación de la Educación (ICFES).
                                </p>
                            </div>
                            <div className="text-right flex flex-col gap-1">
                                <span className="block font-bold uppercase tracking-wider text-[9px]" style={{ color: '#374151' }}>Fecha de Generación</span>
                                <span className="block font-mono" style={{ color: '#4b5563' }}>{date.toLocaleString("es-CO")}</span>
                                <div className="mt-2 text-[9px] uppercase tracking-wider" style={{ color: '#d1d5db' }}>
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
