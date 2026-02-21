'use client';

import React from 'react';
import {
    ArrowLeft,
    Share2,
    Map,
    Timer,
    TrendingUp,
    Info,
    ChevronLeft,
    ChevronRight,
    Home,
    Users
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Link from 'next/link';

const data = [
    { name: 'S1', uv: 20 },
    { name: 'S2', uv: 35 },
    { name: 'S3', uv: 45 },
    { name: 'S4', uv: 60 },
    { name: 'S5', uv: 55 },
    { name: 'S6', uv: 80 },
    { name: 'S7', uv: 95 },
];

export default function PredictiveMapPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-24 font-sans px-6 pt-10">
            {/* TopHeader */}
            <header className="pb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-teal-500 font-bold mb-2">Analítica Avanzada</p>
                <h1 className="font-bold text-3xl leading-tight text-foreground">Tu Mapa de Dominio Predictivo</h1>
            </header>

            {/* HeatmapVisualization */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-muted-foreground italic">Distribución de Maestría</h2>
                    <span className="text-[10px] text-muted-foreground/60">Hoy vs. Histórico</span>
                </div>
                <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-7 gap-1.5 mb-4">
                        {/* Labels */}
                        <div className="col-span-7 flex justify-between text-[8px] text-muted-foreground/60 uppercase tracking-widest mb-2 px-1">
                            <span>Madrugada</span><span>Mañana</span><span>Tarde</span><span>Noche</span>
                        </div>

                        {/* Row 1: C. Thinking */}
                        <div className="col-span-7 flex items-center gap-2 mb-1">
                            <span className="w-20 text-[9px] text-muted-foreground font-medium truncate">C. Thinking</span>
                            <div className="flex-1 grid grid-cols-12 gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm transition-all hover:scale-110 ${i % 3 === 0 ? 'bg-teal-500/20' : i % 2 === 0 ? 'bg-primary/40' : 'bg-primary/80'
                                        }`}></div>
                                ))}
                            </div>
                        </div>

                        {/* Row 2: Quant. Reasoning */}
                        <div className="col-span-7 flex items-center gap-2 mb-1">
                            <span className="w-20 text-[9px] text-muted-foreground font-medium truncate">Quant. Reasoning</span>
                            <div className="flex-1 grid grid-cols-12 gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm transition-all hover:scale-110 ${i > 8 ? 'bg-primary' : i > 5 ? 'bg-primary/60' : 'bg-teal-500/30'
                                        }`}></div>
                                ))}
                            </div>
                        </div>

                        {/* Row 3: Data Analysis */}
                        <div className="col-span-7 flex items-center gap-2">
                            <span className="w-20 text-[9px] text-muted-foreground font-medium truncate">Data Analysis</span>
                            <div className="flex-1 grid grid-cols-12 gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm transition-all hover:scale-110 ${i < 4 ? 'bg-teal-500/10' : 'bg-primary/90'
                                        }`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                        <span className="text-[8px] text-muted-foreground/60 uppercase tracking-tighter">Desarrollando</span>
                        <div className="flex gap-0.5">
                            <div className="w-2 h-2 rounded-sm bg-teal-500/20"></div>
                            <div className="w-2 h-2 rounded-sm bg-teal-500/60"></div>
                            <div className="w-2 h-2 rounded-sm bg-teal-500"></div>
                            <div className="w-2 h-2 rounded-sm bg-primary"></div>
                        </div>
                        <span className="text-[8px] text-muted-foreground/60 uppercase tracking-tighter">Maestría</span>
                    </div>
                </div>
            </section>

            {/* HumanizedInsightCard */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="relative overflow-hidden bg-[#1A2B3C] text-white p-7 rounded-3xl shadow-xl">
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl bg-primary/10"></div>
                    <div className="relative z-10">
                        <TrendingUp className="w-6 h-6 mb-4 text-primary" />
                        <p className="text-lg leading-relaxed italic mb-4 font-serif">
                            "Tu potencial es ilimitado. Según tu ritmo actual, estás a solo <span className="text-primary font-semibold">3 sesiones</span> de dominar Razonamiento Cuantitativo."
                        </p>
                        <div className="h-1 w-12 bg-primary/60 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* PredictiveChart */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <h3 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold mb-4 px-2">Ruta Proyectada al Éxito</h3>
                <div className="bg-card p-6 rounded-2xl h-64 relative overflow-hidden border border-border shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#48C9B0" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#48C9B0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="uv"
                                stroke="#48C9B0"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUv)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="absolute bottom-4 right-6 text-right z-10">
                        <p className="text-[10px] text-muted-foreground">Confianza del Algoritmo</p>
                        <p className="text-xl font-light text-foreground">94.8%</p>
                    </div>
                </div>
            </section>

            {/* ActionableTip */}
            <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border shadow-sm transition-all duration-500 ease-in-out hover:scale-[1.01]">
                    <div className="bg-teal-500/10 p-2.5 rounded-xl">
                        <Timer className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest text-teal-500 font-bold mb-1">Momento Óptimo</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Basado en tu mapa de calor, tu mejor momento para aprender es entre las <span className="font-bold text-foreground">10:00 AM y 12:00 PM</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Floating Navigation (Just visual, or functional) */}
            {/* Usually redundant with Layout, but part of the design. I'll omit if Layout has it, but this page looks standalone. */}
            {/* The HTML had a unique floating pill nav. I'll replicate it for "wow" factor if not conflicting. */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[340px] z-40">
                <div className="bg-[#1A2B3C]/95 backdrop-blur-lg rounded-full px-8 py-4 flex justify-between items-center shadow-2xl border border-white/10">
                    <button className="text-teal-500">
                        <TrendingUp className="w-5 h-5" />
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors">
                        <Home className="w-5 h-5" />
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                    </button>
                </div>
            </nav>
        </div>
    );
}
