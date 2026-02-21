"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Clock,
    Star,
    User,
    TrendingUp,
    Zap,
    Award,
    ChevronRight,
    Lock,
    Share2,
    Bell
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import BottomNav from "@/components/layout/BottomNav";

export default function EvolutionPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
                <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors">
                    <div className="flex items-center gap-1 font-bold text-sm">
                        ← Tu Evolución Humana
                    </div>
                </Link>
                <div className="flex gap-4 text-orange-500">
                    <Share2 size={20} />
                    <Bell size={20} className="fill-orange-100" />
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-[#1e293b] text-white p-8 rounded-b-[2.5rem] relative overflow-hidden text-center shadow-2xl shadow-slate-900/20 mb-8">
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden relative mx-auto">
                        <User size={64} className="text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/50">
                        Growth Mindset
                    </Badge>
                </div>

                <h1 className="text-xl font-bold mt-4 mb-1">Alejandro Martínez</h1>
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Líder en Transformación Estratégica</p>

                <div className="flex justify-center gap-8 mb-6 border-t border-white/10 pt-6">
                    <div className="text-center">
                        <span className="block text-2xl font-bold">342</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-1">Horas de Maestría</span>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                        <span className="block text-lg font-bold text-teal-400">85%</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-1">Estado de Flow</span>
                    </div>
                </div>

                <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest border border-white/20 h-10 rounded-xl backdrop-blur-md transition-all">
                    Ver Certificaciones Obtenidas
                </Button>
            </div>


            <div className="px-6 space-y-8 -mt-12 relative z-10">
                {/* Competency Map (Radar Mockup) */}
                <Card className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border-0">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Mapa de Competencias</h3>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 text-[9px] font-bold">Últimos 6 meses</Badge>
                    </div>

                    <div className="relative aspect-square max-w-[280px] mx-auto my-4">
                        {/* Radar Chart SVG Mockup */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <polygon points="50,10 90,40 70,90 30,90 10,40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                            <polygon points="50,20 80,45 65,80 35,80 20,45" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="50" cy="20" r="2" fill="#0f766e" /> {/* Top point */}
                        </svg>

                        {/* Labels positioned roughly */}
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-bold text-center w-20 leading-tight">PENSAMIENTO CRÍTICO</span>
                        <span className="absolute top-[35%] right-0 translate-x-1/2 text-[8px] font-bold text-center w-20 text-slate-400">ADAPTABILIDAD</span>
                        <span className="absolute top-[35%] left-0 -translate-x-1/2 text-[8px] font-bold text-center w-20 text-slate-400">SOLUCIÓN DE PROBLEMAS</span>
                        <span className="absolute bottom-[10%] right-[10%] text-[8px] font-bold text-center w-20 text-slate-800">LIDERAZGO ESTRATÉGICO</span>
                        <span className="absolute bottom-[10%] left-[10%] text-[8px] font-bold text-center w-20 text-slate-800">EMPATÍA DIGITAL</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block mb-1">Mayor Crecimiento</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-orange-500" />
                                <span className="text-[10px] font-bold text-slate-800 leading-tight">Pensamiento Crítico (+24%)</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block mb-1">En Enfoque</span>
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-800 leading-tight">Liderazgo Estratégico</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Consistency Streak */}
                <Card className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100/50">
                    <div className="flex justify-between items-baseline mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Racha de Consistencia</h3>
                        <Zap size={16} className="text-orange-500 fill-orange-500" />
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-slate-900">15 Días</span>
                        <span className="text-sm font-medium text-orange-500">Llamarada Activa</span>
                    </div>

                    {/* Heatmap Grid Mockup */}
                    <div className="grid grid-cols-7 gap-1.5 opacity-90">
                        {[...Array(28)].map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    aspect-square rounded-md 
                                    ${i > 18 ? 'bg-orange-400' : i > 10 ? 'bg-orange-200' : 'bg-orange-50'}
                                `}
                            />
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <span className="text-[8px] font-bold text-slate-300 uppercase">Estado Base</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-orange-50 rounded-sm"></div>
                            <div className="w-2 h-2 bg-orange-200 rounded-sm"></div>
                            <div className="w-2 h-2 bg-orange-400 rounded-sm"></div>
                            <div className="w-2 h-2 bg-orange-600 rounded-sm"></div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-300 uppercase text-orange-500">Estado de Flow Máximo</span>
                    </div>
                </Card>


                {/* Mindset Transformation */}
                <Card className="bg-white rounded-[2rem] p-6 shadow-sm text-center">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 px-8 leading-relaxed">
                        Tu Transformación de Mentalidad
                    </h3>

                    <div className="relative flex justify-between items-center mb-8 px-2">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-0" />

                        {/* Steps */}
                        {['Aprendiz Pasivo', 'Curiosidad Activa', 'Solucionador Estratégico', 'Arquitecto de Sistemas'].map((step, i) => (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-3 w-16">
                                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${i === 2 ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                                    {i === 2 ? <Zap size={14} fill="currentColor" /> : <Star size={12} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between px-2 text-[8px] font-bold uppercase tracking-tight text-slate-400 mb-6">
                        <span className="w-16 text-center">Aprendiz Pasivo</span>
                        <span className="w-16 text-center text-orange-500">Curiosidad Activa</span>
                        <span className="w-16 text-center text-orange-500">Solucionador Estratégico</span>
                        <span className="w-16 text-center">Arquitecto de Sistemas</span>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 text-left border-l-2 border-orange-500 relative">
                        <p className="font-serif italic text-slate-600 text-xs leading-relaxed">
                            &quot;Has pasado de consumidor contenido a conectar conceptos complejos. Tu capacidad para aplicar la teoría en escenarios de crisis ha mejorado un 40% este trimestre.&quot;
                        </p>
                    </div>
                </Card>

                {/* Next Leaps */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">Próximos Saltos</h3>
                    <div className="space-y-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                <Award size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-900">Certificación Elite: Liderazgo 4.0</h4>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-teal-400 h-full w-[72%] rounded-full" />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[9px] text-slate-400">Progreso: 72%</span>
                                    <span className="text-[9px] font-bold text-slate-800">12h restantes</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>

                        <div className="bg-white/50 rounded-2xl p-4 border border-dashed border-slate-200 flex items-center gap-4 opacity-70">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <Lock size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-800">Maestría en IA Generativa</h4>
                                <p className="text-[10px] text-slate-400 leading-tight mt-1">
                                    Desbloquea el nivel &apos;Arquitecto&apos; al completar 50h de práctica.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
