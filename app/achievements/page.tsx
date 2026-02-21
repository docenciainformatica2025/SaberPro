"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Crown,
    Brain,
    Calculator,
    Search,
    Award,
    Briefcase,
    Scale,
    Share2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import BottomNav from "@/components/layout/BottomNav";

// Mock Data matching the screenshot
const SKILL_HEXAGONS = [
    { title: "Critical Thinking", icon: Brain, score: null, color: "text-blue-200" },
    { title: "Quantitative Reasoning", icon: Calculator, score: null, color: "text-blue-200" },
    { title: "Data Analysis", icon: Search, score: null, color: "text-blue-200" },
    { title: "Strategic Leadership", icon: Award, score: "90%", color: "text-amber-400" },
    { title: "Project Management", icon: Briefcase, score: "75%", color: "text-amber-400" },
    { title: "Ethical Decision-Making", icon: Scale, score: "82%", color: "text-amber-400" },
];

const CERTIFICATES = [
    {
        title: "Advanced Data Analysis",
        issued: "Oct 26, 2023",
        id: "cert_001"
    },
    {
        title: "Strategic Leadership",
        issued: "Sept 15, 2023",
        id: "cert_002"
    }
];

export default function AchievementsPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Dark Header Section */}
            <div className="bg-[#0B1221] pt-8 pb-12 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-2xl">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Professional Mastery<br />& Achievements
                        </h1>
                        <p className="text-blue-200/80 text-sm mt-1">Tu Nivel de Maestría</p>
                    </div>

                    {/* Master Level Card */}
                    <div className="bg-[#151F32] border border-blue-800/50 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Master Level</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-blue-200">88% Complete</span>
                                <Crown size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-4 bg-[#0B1221] rounded-full overflow-hidden border border-blue-900/50 relative">
                            {/* Gold Gradient Bar */}
                            <div
                                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 rounded-full relative shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                style={{ width: "88%" }}
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-6 relative z-20 space-y-8">
                {/* City Ranking Pill */}
                <div className="bg-white shadow-xl shadow-blue-900/5 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 border border-slate-100">
                    <span className="text-brand-primary">↗</span>
                    Estás en el top <span className="font-bold text-slate-900">5%</span> de tu ciudad
                </div>

                {/* Hexagonal Grid */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 justify-items-center sm:gap-x-6">
                    {SKILL_HEXAGONS.map((skill, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            {/* Hexagon Shape */}
                            <div className="w-[88px] h-[100px] relative flex items-center justify-center group cursor-pointer transition-transform hover:-translate-y-1">
                                <svg
                                    viewBox="0 0 88 100"
                                    className="absolute inset-0 w-full h-full drop-shadow-lg"
                                    style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
                                >
                                    <path
                                        d="M44 0 L88 25 L88 75 L44 100 L0 75 L0 25 Z"
                                        fill="#1E293B"
                                        stroke={skill.score ? "#D97706" : "#475569"}
                                        strokeWidth="3"
                                        className="transition-colors duration-300 group-hover:fill-[#0F172A]"
                                    />
                                </svg>

                                <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
                                    <skill.icon size={20} className={`${skill.color} mb-1`} />
                                    <span className="text-[9px] font-bold text-white/90 leading-tight line-clamp-2 w-16">
                                        {skill.title}
                                    </span>
                                    {skill.score && (
                                        <div className="mt-1 w-8 h-8 rounded-full border border-amber-500/50 flex items-center justify-center bg-amber-950/50 backdrop-blur-sm">
                                            <span className="text-[8px] font-bold text-amber-400">{skill.score}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certificates Section */}
                <div className="space-y-4">
                    {CERTIFICATES.map((cert, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden relative group">
                            {/* Decorative Borders */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

                            <div className="p-6 text-center space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Certificate of Competency</p>

                                <div className="relative inline-block">
                                    <h3 className="font-serif text-xl italic text-slate-900 border-b border-slate-200 pb-2 px-4">
                                        - {cert.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between mt-4 md:px-8">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50 mb-1">
                                            <CheckCircle2 size={24} className="text-white" />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Issued: {cert.issued}</p>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 h-8 text-[10px] font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600 gap-2 rounded-full"
                                        >
                                            Share on LinkedIn <Share2 size={10} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
