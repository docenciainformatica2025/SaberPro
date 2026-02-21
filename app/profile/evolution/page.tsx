import React from 'react';
import {
    ArrowLeft,
    Share2,
    Bell,
    TrendingUp,
    Target,
    Flame,
    User,
    Brain,
    Rocket,
    Wand2,
    ChevronRight,
    Lock,
    Award,
    Zap,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileEvolutionPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="p-1 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </Link>
                    <h1 className="text-lg font-bold tracking-tight">Tu Evolución Humana</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-1 hover:bg-muted rounded-full transition-colors">
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors">
                        <Bell className="w-4 h-4 text-primary" />
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6" suppressHydrationWarning>
                {/* Section 1: Hero Profile */}
                <section className="relative overflow-hidden rounded-xl bg-[#1A2B3C] p-6 text-white shadow-xl animate-in fade-in zoom-in duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border border-primary/30 p-1">
                                <img
                                    alt="Avatar de Usuario"
                                    className="w-full h-full rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmxjqBUZ01kmyKikUg1xiTQC55DBaTCJMpmCC9gruCwpHVDiJSLzuNqh47_QhKx26F2slSjgKMmFYFR6szpojJNbQjv0UTA9zwO1VYnHT5Hj_yplLdoKYBcBi9hDV2-_FgcNV9in6Hbc5NGiA7H9Az6kanS6DrHDYh6lHaxCtie8Qg8Kxvz8nrVlIzrlU9ID42PpBJX_suGU_Vsvgy3Vl_OBmWWnPPJnoIm8nyxQQ03SzmJqDwOPAXjLVxLOWAWyS3dlBO_0Tkcv8"
                                />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-primary px-3 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Mentalidad de Crecimiento</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight">Alejandro Martínez</h2>
                            <p className="text-brand-primary font-semibold text-xs mt-1 uppercase tracking-widest">Líder en Transformación Estratégica</p>
                        </div>
                        <div className="flex gap-8 mt-2">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">342</p>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Horas de Maestría</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-brand-primary font-semibold text-xs mt-1 uppercase tracking-widest">85%</p>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Estado de Flow</p>
                            </div>
                        </div>
                        <button className="mt-4 w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
                            Ver Certificaciones Obtenidas
                        </button>
                    </div>
                </section>

                {/* Section 2: Evolution of Competencies */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Mapa de Competencias</h3>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold">Últimos 6 meses</span>
                    </div>
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                        {/* Decorative Radial Background */}
                        <div className="absolute inset-0 border border-border rounded-full scale-100 opacity-20"></div>
                        <div className="absolute inset-0 border border-border rounded-full scale-75 opacity-40"></div>
                        <div className="absolute inset-0 border border-border rounded-full scale-50 opacity-60"></div>

                        {/* Axis Labels */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-center text-muted-foreground uppercase">Pensamiento<br />Crítico</div>
                        <div className="absolute top-1/4 -right-12 text-[10px] font-bold text-center text-muted-foreground uppercase">Adaptabilidad</div>
                        <div className="absolute bottom-0 right-0 text-[10px] font-bold text-center text-muted-foreground uppercase">Liderazgo<br />Estratégico</div>
                        <div className="absolute bottom-0 left-0 text-[10px] font-bold text-center text-muted-foreground uppercase">Empatía<br />Digital</div>
                        <div className="absolute top-1/4 -left-12 text-[10px] font-bold text-center text-muted-foreground uppercase">Solución de<br />Problemas</div>

                        {/* Representative Shape */}
                        <div
                            className="w-4/5 h-4/5 bg-teal-500/5 border border-teal-500/40 relative animate-in zoom-in duration-1000"
                            style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_12px_rgba(72,201,176,0.6)]"></div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Mayor Crecimiento</p>
                            <div className="text-xs font-bold flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span>Pensamiento Crítico (+24%)</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">En Enfoque</p>
                            <div className="text-xs font-bold flex items-center gap-1">
                                <Target className="w-4 h-4 text-yellow-500" />
                                <span>Liderazgo Estratégico</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Habit Tracking */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Racha de Consistencia</h3>
                            <p className="text-xl font-black mt-1 flex items-baseline gap-2">
                                15 Días <span className="text-brand-primary text-sm font-medium">Llamarada Activa</span>
                            </p>
                        </div>
                        <Flame className="w-8 h-8 text-primary fill-primary" />
                    </div>

                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                        {[...Array(28)].map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-sm animate-in zoom-in duration-300 delay-[${i * 10}ms] ${
                                    // Random-ish heatmap pattern
                                    [0, 3, 14, 15, 20].includes(i) ? 'bg-primary/5' :
                                        [1, 18].includes(i) ? 'bg-primary/10' :
                                            [2, 16, 19].includes(i) ? 'bg-primary/20' :
                                                [4, 9, 17, 21].includes(i) ? 'bg-primary/40' :
                                                    [5, 8, 22, 26].includes(i) ? 'bg-primary/60' :
                                                        [6, 7, 11, 12, 13, 24, 25].includes(i) ? 'bg-primary' :
                                                            'bg-primary/80'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Estado Base</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-brand-primary/10 rounded-sm"></div>
                            <div className="w-3 h-3 bg-brand-primary/40 rounded-sm"></div>
                            <div className="w-3 h-3 bg-brand-primary/70 rounded-sm"></div>
                            <div className="w-3 h-3 bg-brand-primary rounded-sm"></div>
                        </div>
                        <span className="text-[10px] text-brand-primary font-bold uppercase">Estado de Flow Máximo</span>
                    </div>
                </section>

                {/* Section 4: Mindset Timeline */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center">Tu Transformación de Mentalidad</h3>
                    <div className="relative flex justify-between items-start pt-4">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 w-3/4 h-0.5 bg-primary -translate-y-1/2"></div>

                        {/* Steps */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground text-center uppercase">Aprendiz<br />Pasivo</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[9px] font-bold text-primary text-center uppercase">Curiosidad<br />Activa</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-sm">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[9px] font-extrabold text-primary text-center uppercase">Solucionador<br />Estratégico</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2 opacity-30">
                            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <Wand2 className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground text-center uppercase">Arquitecto<br />de Sistemas</span>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-brand-primary/5 rounded-xl border-l-2 border-brand-primary">
                        <p className="text-xs italic leading-relaxed text-muted-foreground">
                            "Has pasado de consumir contenido a conectar conceptos complejos. Tu capacidad para aplicar la teoría en escenarios críticos ha mejorado un 40% este trimestre."
                        </p>
                    </div>
                </section>

                {/* Section 5: Future Milestones */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2">Próximos Saltos</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 flex items-center gap-4 group cursor-pointer hover:bg-muted/50 transition-all border border-border">
                            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-foreground">Certificación Élite: Liderazgo 4.0</h4>
                                <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary w-[72%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[10px] text-muted-foreground font-medium">Progreso: 72%</span>
                                    <span className="text-[10px] font-bold text-brand-primary">12h restantes</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                        </div>

                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 flex items-center gap-4 group cursor-pointer hover:bg-muted/50 transition-all border border-border">
                            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-foreground">Maestría en IA Generativa</h4>
                                <p className="text-[10px] text-muted-foreground font-medium mt-1">Desbloquea el nivel 'Arquitecto' al completar 50h de práctica.</p>
                            </div>
                            <Lock className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}


