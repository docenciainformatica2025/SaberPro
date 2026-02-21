"use client";

import { useAuth } from "@/context/AuthContext";
import {
    X,
    Share2,
    Sparkles,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CelebrationPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ccfbf1]/40 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ffedd5]/40 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex justify-between items-center p-6">
                <Link href="/notifications">
                    <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </Link>
                <h1 className="text-[10px] font-bold text-[#14b8a6] uppercase tracking-[0.2em]">Logro Desbloqueado</h1>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <Share2 size={24} className="text-slate-400" />
                </button>
            </div>

            {/* Main Visual */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center -mt-10">

                {/* Visual Circle */}
                <div className="relative mb-12">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#fdba74] to-[#fb923c] flex items-center justify-center shadow-2xl shadow-orange-200 relative z-10 animate-in zoom-in-50 duration-700">
                        <div className="relative">
                            <Sparkles size={80} className="text-white fill-white absolute -top-8 -left-8 animate-pulse" />
                            <Sparkles size={50} className="text-white fill-white absolute bottom-4 -right-4 animate-bounce" style={{ animationDuration: '3s' }} />
                            <Sparkles size={120} className="text-white/90 fill-white" />
                        </div>
                    </div>
                    {/* Orbiting Elements */}
                    <div className="absolute inset-0 -m-8 border border-orange-100 rounded-full animate-spin-slow-reverse" />
                    <div className="absolute inset-0 -m-4 border border-teal-100 rounded-full" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#14b8a6] rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute bottom-10 left-0 w-3 h-3 bg-[#fdba74] rounded-full border-2 border-white shadow-sm" />
                </div>

                <div className="space-y-6 max-w-sm mx-auto animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <h2 className="text-3xl font-black text-slate-800 leading-tight">
                        Tu disciplina es el puente <span className="text-[#fb923c]">hacia tu maestría.</span>
                    </h2>

                    <p className="text-slate-500 text-lg leading-relaxed">
                        Has cultivado tu estado de flow durante <span className="font-bold text-slate-900">5 días seguidos</span>. Cada sesión es un paso firme hacia la excelencia y la evolución de tu potencial interno.
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 py-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-8 h-1.5 rounded-full bg-[#fb923c]" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 pb-12 space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                <Button className="w-full bg-[#fb923c] hover:bg-[#f97316] text-white font-bold h-14 rounded-2xl text-lg shadow-xl shadow-orange-200 flex items-center justify-center gap-2">
                    Ver mi progreso <TrendingUp size={20} />
                </Button>

                <Link href="/dashboard" className="block text-center">
                    <button className="text-[#14b8a6] font-bold text-sm hover:underline tracking-wide">
                        Continuar
                    </button>
                </Link>
            </div>
        </div>
    );
}
