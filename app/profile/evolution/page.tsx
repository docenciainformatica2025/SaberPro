import React, { useEffect, useState } from 'react';
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
    Sparkles,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { pdfGenerator } from '@/utils/pdfGenerator';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

export default function ProfileEvolutionPage() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [stats, setStats] = useState({
        hours: 0,
        flow: 0,
        streak: 0,
        xp: 0,
        radarData: [
            { subject: 'Pensamiento Crítico', A: 0, fullMark: 100 },
            { subject: 'Adaptabilidad', A: 0, fullMark: 100 },
            { subject: 'Liderazgo Estratégico', A: 0, fullMark: 100 },
            { subject: 'Empatía Digital', A: 0, fullMark: 100 },
            { subject: 'Solución de Problemas', A: 0, fullMark: 100 },
        ],
        growth: 0,
        focus: 'Cargando...'
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", user.uid),
                    orderBy("completedAt", "desc")
                );
                const snapshot = await getDocs(q);
                
                let totalScore = 0;
                let count = 0;
                let totalQuestions = 0;
                
                // Skill mapping
                const skills = {
                    critical: { sum: 0, count: 0 },
                    adapt: { sum: 0, count: 0 },
                    leadership: { sum: 0, count: 0 },
                    empathy: { sum: 0, count: 0 },
                    problem: { sum: 0, count: 0 }
                };

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const score = (data.score / data.totalQuestions) * 100;
                    totalScore += score;
                    totalQuestions += data.totalQuestions;
                    count++;

                    // Mocking skill distribution based on result type or content
                    // In a real scenario, this would come from per-domain scores
                    const type = data.type || 'general';
                    if (type === 'critical') skills.critical.sum += score;
                    else skills.critical.sum += score * 0.8;
                    skills.critical.count++;

                    skills.adapt.sum += score * (0.7 + Math.random() * 0.2);
                    skills.adapt.count++;
                    
                    skills.leadership.sum += score * (0.6 + Math.random() * 0.3);
                    skills.leadership.count++;

                    skills.empathy.sum += score * (0.75 + Math.random() * 0.15);
                    skills.empathy.count++;

                    skills.problem.sum += score * (0.85 + Math.random() * 0.1);
                    skills.problem.count++;
                });

                const avgFlow = count > 0 ? Math.round(totalScore / count) : 0;
                const totalHours = Math.round(totalQuestions * 0.05); // Estimate 3 mins per question

                // Calculate real growth
                let growthValue = 0;
                if (count > 1) {
                    const latestScore = (snapshot.docs[0].data().score / snapshot.docs[0].data().totalQuestions) * 100;
                    const previousAvg = (totalScore - latestScore) / (count - 1);
                    growthValue = Math.round(latestScore - previousAvg);
                }

                const radarData = [
                    { subject: 'Pensamiento Crítico', A: Math.round(skills.critical.sum / (skills.critical.count || 1)), fullMark: 100 },
                    { subject: 'Adaptabilidad', A: Math.round(skills.adapt.sum / (skills.adapt.count || 1)), fullMark: 100 },
                    { subject: 'Liderazgo Estratégico', A: Math.round(skills.leadership.sum / (skills.leadership.count || 1)), fullMark: 100 },
                    { subject: 'Empatía Digital', A: Math.round(skills.empathy.sum / (skills.empathy.count || 1)), fullMark: 100 },
                    { subject: 'Solución de Problemas', A: Math.round(skills.problem.sum / (skills.problem.count || 1)), fullMark: 100 },
                ];

                // Determine dynamic focus area (the one with lowest score)
                const focusArea = [...radarData].sort((a, b) => a.A - b.A)[0].subject;

                setStats({
                    hours: totalHours,
                    flow: avgFlow,
                    streak: profile?.gamification?.streak?.current || 0,
                    xp: profile?.gamification?.xp || 0,
                    radarData,
                    growth: growthValue,
                    focus: focusArea
                });
            } catch (err) {
                console.error("Error fetching evolution stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, profile]);

    const handleGenerateCertificate = async () => {
        if (!user || !profile) return;
        setGeneratingPdf(true);
        try {
            const userName = profile.fullName || user.displayName || 'Estudiante';
            const level = `Nivel ${profile.gamification?.level || 1} - Solucionador Estratégico`;
            await pdfGenerator.generateAchievementCertificate(userName, level, stats.xp);
            toast.success("¡Certificado generado con éxito!");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el certificado.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const displayName = profile?.fullName || user?.displayName || "Estudiante";
    const userRole = profile?.targetCareer || "Líder en Crecimiento";

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="p-1 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight font-academic">Tu Evolución Humana</h1>
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
                <section className="relative overflow-hidden rounded-xl bg-[var(--theme-bg-surface,#1A2B3C)] p-6 text-white shadow-xl animate-in fade-in zoom-in duration-500 border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border border-primary/30 p-1 bg-white/5">
                                <img
                                    alt="Avatar de Usuario"
                                    className="w-full h-full rounded-full object-cover"
                                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`}
                                />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-primary px-3 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Nivel {profile?.gamification?.level || 1}</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight font-academic">{displayName}</h2>
                            <p className="text-brand-primary font-semibold text-[10px] mt-1 uppercase tracking-[0.2em]">{userRole}</p>
                        </div>
                        <div className="flex gap-8 mt-2">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{stats.hours}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Horas de Maestría</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-brand-primary font-semibold text-xs mt-1 uppercase tracking-widest text-2xl">{stats.flow}%</p>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Estado de Flow</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleGenerateCertificate}
                            disabled={generatingPdf}
                            className="mt-4 w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {generatingPdf ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Award className="w-4 h-4" />
                            )}
                            {generatingPdf ? 'Generando...' : 'Descargar Certificado de Excelencia'}
                        </button>
                    </div>
                </section>

                {/* Section 2: Evolution of Competencies */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-academic">Mapa de Competencias</h3>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold">Últimos 6 meses</span>
                    </div>
                    <div className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }} 
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Nivel"
                                    dataKey="A"
                                    stroke="var(--brand-primary, #48c9b0)"
                                    fill="var(--brand-primary, #48c9b0)"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
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
                                {stats.streak} {stats.streak === 1 ? 'Día' : 'Días'} <span className="text-brand-primary text-sm font-medium">Llamarada Activa</span>
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


