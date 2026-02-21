"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Search,
    Play,
    BookOpen,
    Clock,
    MoreVertical,
    Sparkles,
    Lightbulb,
    Bookmark,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import BottomNav from "@/components/layout/BottomNav";

import { LibraryService, LibraryItem } from "@/services/student/library.service";
import { useEffect } from "react";

export default function LibraryPage() {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState('Todo');
    const [recommended, setRecommended] = useState<LibraryItem[]>([]);
    const [saved, setSaved] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResources = async () => {
            setLoading(true);
            try {
                const [recData, savedData] = await Promise.all([
                    LibraryService.getRecommendedResources(),
                    user ? LibraryService.getSavedResources(user.uid) : Promise.resolve([])
                ]);
                setRecommended(recData);
                setSaved(savedData);
            } catch (error) {
                console.error("Error loading library resources:", error);
            } finally {
                setLoading(false);
            }
        };

        loadResources();
    }, [user]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 font-sans transition-colors duration-500" suppressHydrationWarning>
            {/* Header - Glassmorphism Refined */}
            <div className="px-6 pt-12 pb-6 sticky top-0 bg-[var(--theme-bg-base)]/80 backdrop-blur-2xl z-40 border-b border-[var(--theme-border-soft)]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary border border-brand-primary/10 shadow-sm">
                            <Sparkles size={18} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--theme-text-primary)]">Tu Biblioteca</h1>
                    </div>
                    <div className="p-2 rounded-full hover:bg-[var(--theme-bg-surface)] transition-colors cursor-pointer text-[var(--theme-text-quaternary)]">
                        <Search size={20} />
                    </div>
                </div>

                <p className="text-[11px] font-medium text-[var(--theme-text-tertiary)] mb-6 leading-relaxed bg-[var(--theme-bg-surface)] px-4 py-2 rounded-xl border border-[var(--theme-border-soft)] inline-block">
                    Curado por <span className="text-brand-primary font-bold">Mentor IA</span> • Foco: <span className="text-[var(--theme-text-primary)]">Razonamiento Cuantitativo</span>
                </p>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['Todo', 'Video', 'Lectura', 'Práctica'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`
                                px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all duration-300
                                ${activeFilter === filter
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105'
                                    : 'bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] text-[var(--theme-text-tertiary)] hover:border-brand-primary/30'
                                }
                            `}
                        >
                            {filter === 'Video' && <Play size={10} fill="currentColor" />}
                            {filter === 'Lectura' && <BookOpen size={10} />}
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 space-y-10 mt-8">
                {/* Recommended Section */}
                <div className="overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-[var(--theme-text-primary)] uppercase tracking-tight italic">Recomendaciones</h2>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                        </div>
                        <span className="text-brand-primary text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">Explorar</span>
                    </div>

                    <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
                        {recommended.map(item => (
                            <div key={item.id} className="min-w-[280px] w-[280px] bg-[var(--theme-bg-surface)] rounded-[1.5rem] border border-[var(--theme-border-soft)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col shrink-0 overflow-hidden group">
                                <div className={`aspect-video ${item.image} relative p-4 overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    <Badge className={`${item.type === 'video' ? 'bg-brand-accent' : 'bg-brand-primary'} text-white border-0 text-[10px] uppercase font-black tracking-widest absolute top-3 left-3 shadow-lg ring-1 ring-white/20`}>
                                        {item.priority}
                                    </Badge>
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
                                                <Play size={20} className="text-white fill-white ml-1" />
                                            </div>
                                        </div>
                                    )}
                                    {item.duration && (
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                            <Clock size={12} /> {item.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-[var(--theme-text-primary)] mb-2 text-base leading-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                                    <p className="text-[11px] text-[var(--theme-text-tertiary)] mb-5 line-clamp-2 leading-relaxed">
                                        {item.desc}
                                    </p>
                                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-[var(--theme-border-soft)]">
                                        <Badge variant="ghost" className="bg-[var(--theme-border-soft)]/30 text-[var(--theme-text-tertiary)] text-[9px] font-black px-2 py-1 rounded-md">
                                            {item.match}
                                        </Badge>
                                        <button className="text-brand-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group/btn">
                                            Ingresar <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Saved Section */}
                <div className="pb-10">
                    <div className="flex justify-between items-baseline mb-6 px-2">
                        <h2 className="text-base font-bold text-[var(--theme-text-primary)] uppercase tracking-tight italic">Guardados</h2>
                        <span className="text-[10px] font-bold text-[var(--theme-text-quaternary)] uppercase tracking-widest">{saved.length} Elementos</span>
                    </div>

                    <div className="space-y-4">
                        {saved.map(item => (
                            <div key={item.id} className="bg-[var(--theme-bg-surface)] rounded-2xl p-5 border border-[var(--theme-border-soft)] shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all flex gap-5 items-center group">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--theme-bg-base)] to-[var(--theme-border-soft)] shrink-0 group-hover:scale-105 transition-transform" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[var(--theme-text-primary)] text-sm truncate pr-2 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                        <Bookmark size={16} className="text-brand-primary/30 fill-brand-primary/10 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-[var(--theme-text-quaternary)] uppercase tracking-widest">{item.type}</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--theme-border-soft)]" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${item.status?.toLowerCase() === 'continuar' ? 'text-brand-accent' : 'text-brand-success'}`}>
                                            {item.status?.toLowerCase() === 'completado' || item.status?.toLowerCase() === 'leído' ? <span className="flex items-center gap-1">✓ Completado</span> : 'En curso'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promo Card - Minimalist Premium */}
                <div className="bg-[var(--theme-bg-surface)] rounded-[2.5rem] p-10 border border-[var(--theme-border-soft)] border-dashed text-center relative overflow-hidden mb-12 shadow-inner">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
                    <Lightbulb size={36} className="text-brand-primary/20 mx-auto mb-5 fill-brand-primary/5" />
                    <h3 className="font-bold text-[var(--theme-text-primary)] mb-3 text-base">Ruta de Aprendizaje</h3>
                    <p className="text-[11px] text-[var(--theme-text-tertiary)] leading-relaxed max-w-[260px] mx-auto font-medium">
                        Guarda recursos estratégicos para optimizar tus sesiones de entrenamiento.
                    </p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
