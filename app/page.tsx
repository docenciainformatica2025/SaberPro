"use client";

import Link from "next/link";
import { ShieldCheck, TrendingUp, Brain, ArrowRight, CheckCircle2, Zap, Trophy, Users, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BRAND_YEAR } from "@/lib/config";
import { Logo } from "@/components/ui/Logo";
import ProFooter from "@/components/ui/ProFooter";
import NumberTicker from "@/components/ui/NumberTicker";
import { StepCard } from "@/components/ui/StepCard";
import { FeatureValueCard } from "@/components/ui/FeatureValueCard";
import { GridBackground } from "@/components/ui/GridBackground";
import SmartNav from "@/components/layout/SmartNav";

export default function Home() {
  const { user, role } = useAuth();
  const dashboardLink = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--theme-bg-base)] selection:bg-brand-primary/10 overflow-x-hidden transition-colors duration-700" suppressHydrationWarning>
      {/* Navigation — Smart Auto-hide */}
      <SmartNav />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
          {/* Enhanced Background Effects - Elite 2026 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[5%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
          </div>

          <GridBackground size={40} opacity={0.05} className="text-brand-primary absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

          <div className="relative z-10 max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] mb-6 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)]">Convocatoria {BRAND_YEAR} Abierta</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--theme-text-primary)] leading-[1.1] text-balance">
              Entrena para el <span className="text-brand-primary italic">Éxito Total</span>
            </h1>

            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-lg md:text-xl font-medium text-[var(--theme-text-secondary)] leading-relaxed">
                No dejes tu puntaje al azar. Domina las pruebas con el sistema de entrenamiento más avanzado de Colombia.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> IA Adaptativa</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Simulacros 4K</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Mentoría 24/7</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 w-full max-w-xl mx-auto">
              {user ? (
                <Link href={dashboardLink} className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full h-12 px-8 text-[10px] font-bold uppercase tracking-widest bg-brand-primary text-white rounded-xl hover:-translate-y-0.5 transition-all">
                    Entrar al panel
                  </Button>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full h-12 px-8 text-[10px] font-bold uppercase tracking-widest bg-brand-primary text-white rounded-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-primary/20">
                    Prueba gratuita
                  </Button>
                </Link>
              )}
              <Link href="/methodology" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 px-8 text-[10px] font-bold uppercase tracking-widest rounded-xl border-[var(--theme-border-soft)] hover:bg-[var(--theme-bg-surface)] transition-all text-[var(--theme-text-secondary)]">
                  Metodología
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Trust Section */}
        <section className="py-16 border-y border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] backdrop-blur-xl relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-[var(--theme-text-tertiary)] mb-12 opacity-80">
              ESTUDIANTES DE LAS MEJORES INSTITUCIONES CONFÍAN EN NOSOTROS
            </p>
            <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 items-center">
              {["UNAL", "ANDES", "JAVERIANA", "EAFIT", "UNIVALLE"].map((uni) => (
                <span key={uni} className="text-2xl md:text-3xl font-black text-[var(--theme-text-primary)] tracking-widest opacity-25 hover:opacity-100 hover:text-brand-primary transition-all duration-500 cursor-default grayscale hover:grayscale-0">
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Ruta de Excelencia - Refined Cards */}
        <section className="py-32 relative bg-[var(--theme-bg-base)]">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)] mb-4">
                Tu ruta de <span className="text-brand-primary italic">Élite</span>
              </h2>
              <div className="w-12 h-1 bg-brand-primary/20 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <StepCard
                step="01"
                title="ESTRATEGIA"
                description="Personalizamos tu entrenamiento según tu carrera y debilidades detectadas por IA."
                className="transform hover:-translate-y-2 transition-transform duration-500"
              />
              <StepCard
                step="02"
                title="PRECISIÓN"
                description="Practica con simulacros dinámicos que se adaptan a tu nivel real de conocimiento."
                className="transform hover:-translate-y-2 transition-transform duration-500"
              />
              <StepCard
                step="03"
                title="MAESTRÍA"
                description="Domina cada área y asegura un puntaje superior con análisis predictivo de resultados."
                className="transform hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Philosophy - Visual Storytelling */}
        <section className="py-32 relative overflow-hidden bg-[var(--theme-bg-surface)] border-y border-[var(--theme-border-soft)]">
          <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-brand-primary/5 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tightest text-[var(--theme-text-primary)] leading-[0.9] uppercase">
                    FILOSOFÍA DE <br /> <span className="text-brand-primary italic">PODER</span>
                  </h2>
                  <p className="text-xl text-[var(--theme-text-secondary)] font-medium italic border-l-4 border-brand-primary pl-6 py-2">
                    &quot;El problema no es que no sepas. Es que no sabes en qué fallas.&quot;
                  </p>
                </div>

                <p className="text-lg text-[var(--theme-text-secondary)] leading-relaxed max-w-xl">
                  Nuestra plataforma utiliza algoritmos de última generación para mapear tu cerebro académico y entregarte exactamente lo que necesitas reforzar, segundo a segundo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <Zap size={20} className="text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[var(--theme-text-primary)] uppercase tracking-wider">RESPUESTA FLASH</h4>
                      <p className="text-xs text-[var(--theme-text-tertiary)]">Optimización de tiempos por pregunta.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <Star size={20} className="text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[var(--theme-text-primary)] uppercase tracking-wider">RANKING ELITE</h4>
                      <p className="text-xs text-[var(--theme-text-tertiary)]">Compite con los mejores del país.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 relative">
                <div className="absolute -inset-4 bg-brand-primary/5 blur-3xl rounded-full opacity-50" />
                <FeatureValueCard
                  icon={Brain}
                  title="ALGORITMOS ADAPTATIVOS"
                  description="El sistema detecta tus patrones de error en tiempo real."
                  iconColor="text-brand-primary"
                  className="bg-[var(--theme-bg-base)] shadow-2xl border border-brand-primary/5 hover:border-brand-primary/20 transition-all rounded-[2rem]"
                />
                <FeatureValueCard
                  icon={TrendingUp}
                  title="ANALÍTICA PREDICTIVA"
                  description="Proyectamos tu puntaje Icfes con una precisión del 94.2%."
                  iconColor="text-brand-primary"
                  className="bg-[var(--theme-bg-base)] shadow-2xl border border-brand-primary/5 hover:border-brand-primary/20 transition-all rounded-[2rem]"
                />
                <FeatureValueCard
                  icon={ShieldCheck}
                  title="SIMULACIÓN REALISTA"
                  description="Un entorno idéntico al examen para eliminar la ansiedad."
                  iconColor="text-brand-primary"
                  className="bg-[var(--theme-bg-base)] shadow-2xl border border-brand-primary/5 hover:border-brand-primary/20 transition-all rounded-[2rem]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats - Digital Precision - Refined Scale */}
        <section className="py-20 bg-[var(--theme-bg-base)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-brand-primary mb-2">
                  <NumberTicker value={100} suffix="+" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)]">Estudiantes activos</p>
              </div>
              <div className="group">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--theme-text-primary)] mb-2">
                  <NumberTicker value={24} suffix="/7" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)]">Disponibilidad total</p>
              </div>
              <div className="group">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-brand-primary mb-2">
                  <NumberTicker value={100} suffix="%" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)]">Cobertura curricular</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Refined Scale */}
        <section className="py-24 px-6 mb-12">
          <div className="max-w-4xl mx-auto bg-brand-primary rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-brand-primary/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tightest leading-none uppercase">
                EMPIEZA TU CAMINO <br /> A LA EXCELENCIA HOY
              </h2>
              <p className="text-white/70 text-base max-w-lg mx-auto font-medium">
                Únete a la nueva generación de estudiantes que transforman su futuro con tecnología.
              </p>
              <Link href="/register">
                <Button variant="primary" className="h-12 px-8 bg-white text-brand-primary hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-xl border-none">
                  Crear mi cuenta gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ProFooter />
    </div>
  );
}
