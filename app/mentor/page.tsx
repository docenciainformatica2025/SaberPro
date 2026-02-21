"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Bot,
    History,
    MoreVertical,
    BarChart2,
    ArrowRight,
    Mic,
    Paperclip,
    Send,
    HelpCircle,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import BottomNav from "@/components/layout/BottomNav";

export default function MentorPage() {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="min-h-screen bg-white pb-24 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 relative">
                        <Bot size={24} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800 leading-tight">Mentor IA</h1>
                        <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">ONLINE • ALTA PRECISIÓN</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <History size={20} />
                    <MoreVertical size={20} />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 px-6 py-8 overflow-y-auto space-y-6">

                {/* Time Stamp */}
                <div className="flex justify-center">
                    <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Hoy, 9:42 AM
                    </span>
                </div>

                {/* AI Message */}
                <div className="bg-slate-50 rounded-[2rem] rounded-tl-none p-6 shadow-sm border border-slate-100 relative group animate-in slide-in-from-left-4 duration-500">
                    <p className="text-slate-600 text-lg leading-relaxed font-serif">
                        ¡Hola <span className="text-orange-500 font-bold">Sofía</span>! He analizado tu <span className="italic">Mapa de Dominio Predictivo</span>. Estás a un paso de la maestría en <span className="font-bold text-slate-900 border-b-2 border-orange-200">Razonamiento Cuantitativo</span>.
                    </p>
                    <p className="text-slate-600 text-lg leading-relaxed font-serif mt-4">
                        ¿Quieres que repasemos los <span className="text-orange-500 font-bold">3 conceptos clave</span> que te faltan antes de tu momento óptimo de las <span className="font-bold text-slate-900">10:00 AM</span>?
                    </p>
                </div>

                {/* Progress Card Insight */}
                <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center gap-4 animate-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                        <BarChart2 size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">PROGRESO ACTUAL</p>
                        <p className="font-bold text-slate-900 text-lg">Razonamiento: 92%</p>
                    </div>
                    {/* Placeholder for now; could route to a detailed view or modal */}
                    <button className="text-orange-500 text-xs font-bold hover:underline">
                        Ver Mapa
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Button className="w-auto bg-[#ff7e5f] hover:bg-[#eb6f50] text-white font-bold rounded-full h-12 px-6 shadow-lg shadow-orange-200 flex items-center gap-2">
                        <span className="text-white">⚜️</span> Sí, guíame
                    </Button>

                    <Button variant="outline" className="w-auto rounded-full h-12 px-6 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2">
                        <TrendingUp size={16} /> Ver mi progreso
                    </Button>

                    <Button variant="outline" className="w-auto rounded-full h-12 px-6 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2">
                        <HelpCircle size={16} /> ¿Por qué estos conceptos?
                    </Button>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white sticky bottom-[76px] z-10 w-full">
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <Mic size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Escribe tu duda académica..."
                            className="w-full h-12 bg-slate-50 rounded-full px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-600 placeholder:text-slate-400"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:scale-110 transition-transform">
                            <Send size={20} className="fill-current" />
                        </button>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                        <Paperclip size={20} />
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
