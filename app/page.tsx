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

export default function Home() {
  const { user, role } = useAuth();
  const dashboardLink = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg-base selection:bg-brand-primary/10 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-background/60 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo variant="full" size="md" />
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <Link href={dashboardLink}>
                <Button variant="primary" className="text-xs font-bold uppercase tracking-widest h-10 px-6 shadow-2xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all hover:-translate-y-0.5">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                    Acceder
                  </span>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="text-xs font-bold uppercase tracking-widest h-10 px-6 shadow-2xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-light">
                    Empezar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-4 flex flex-col items-center text-center overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-background to-background pointer-events-none" />
          <GridBackground size={40} opacity={0.03} className="text-brand-primary absolute inset-0 mask-gradient-to-b" />

          <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground text-balance mb-6">
              Domina tu Futuro en el
              <span className="block text-brand-primary mt-2">Saber Pro {BRAND_YEAR}</span>
            </h1>

            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl font-medium text-foreground">
                El Saber Pro no se estudia. <span className="text-brand-primary font-bold">Se entrena.</span>
              </p>
              <p className="text-lg text-muted-foreground font-medium">
                Diagnóstico Gratuito + Plan Personalizado + Resultados Medibles
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 w-full max-w-lg mx-auto">
              {user ? (
                <Link href={dashboardLink} className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full h-12 px-6 text-[12px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 transition-all bg-brand-primary text-white rounded-full">
                    Ir a mi el Entrenamiento
                  </Button>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full h-12 px-6 text-[12px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 transition-all bg-brand-primary text-white rounded-full">
                    Prueba Gratuita
                  </Button>
                </Link>
              )}
              <Link href="/methodology" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 px-6 text-[12px] font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 rounded-full bg-white text-slate-600">
                  Saber más
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 border-y border-border/40 bg-muted/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
              Confianza de Estudiantes de
            </p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {["UNAL", "ANDES", "JAVERIANA", "EAFIT", "UNIVALLE"].map((uni) => (
                <span key={uni} className="text-lg md:text-xl font-serif font-bold text-foreground tracking-widest hover:text-brand-primary transition-colors cursor-default">
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Ruta de Excelencia Section */}
        <section className="py-24 relative bg-theme-bg-surface/30">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
                Ruta de Excelencia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
              <StepCard
                step="01"
                title="Crea tu Cuenta"
                description="Accede a la plataforma y personaliza tu perfil según tu carrera y objetivos académicos."
              />
              <StepCard
                step="02"
                title="Diagnóstico IA"
                description="Realiza una prueba inicial adaptativa para identificar tus fortalezas y áreas de mejora con precisión."
              />
              <StepCard
                step="03"
                title="Entrena y Domina"
                description="Sigue tu plan personalizado, practica con simulacros reales y asegura tu puntaje superior."
              />
            </div>
          </div>
        </section>

        {/* Filosofía de Entrenamiento Section */}
        <section className="py-24 relative overflow-hidden bg-[#0B0F19] text-white">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                Filosofía de Entrenamiento
              </h2>
              <p className="text-xl text-gray-400 italic font-serif">
                &quot;El problema no es que no sepas. Es que no sabes qué reforzar.&quot;
              </p>
              <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                La plataforma de Saber Pro {BRAND_YEAR} está diseñada con una metodología única basada en datos, adaptando el contenido a tu ritmo de aprendizaje real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureValueCard
                icon={Brain}
                title="Algoritmos Adaptativos"
                description="El sistema aprende de tus errores y ajusta la dificultad para optimizar tu tiempo de estudio."
                iconColor="text-brand-primary"
                className="bg-white text-foreground shadow-xl shadow-black/5 border-0"
              />
              <FeatureValueCard
                icon={TrendingUp}
                title="Analítica Predictiva"
                description="Conoce tu probabilidad de éxito antes del examen con proyecciones basadas en data histórica."
                iconColor="text-brand-accent"
                className="bg-white text-foreground shadow-xl shadow-black/5 border-0"
              />
              <FeatureValueCard
                icon={ShieldCheck}
                title="Simulación Realista"
                description="Entrena en un entorno idéntico al del examen real para eliminar la ansiedad y mejorar tu rendimiento."
                iconColor="text-brand-success"
                className="bg-white text-foreground shadow-xl shadow-black/5 border-0"
              />
            </div>
          </div>
        </section>

        {/* Light Stats Section */}
        <section className="py-20 bg-theme-bg-surface border-t border-border/40">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border/40">
              <div className="px-4 py-4 md:py-0">
                <p className="text-5xl font-black tracking-tight mb-2 text-foreground">
                  <NumberTicker value={1240} suffix="+" />
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Estudiantes Activos</p>
              </div>
              <div className="px-4 py-4 md:py-0">
                <p className="text-5xl font-black tracking-tight mb-2 text-foreground">
                  <NumberTicker value={94} suffix="%" />
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tasa de Aprobación</p>
              </div>
              <div className="px-4 py-4 md:py-0">
                <p className="text-5xl font-black tracking-tight mb-2 text-foreground">
                  <NumberTicker value={4.8} suffix="/5" />
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Valoración Global</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ProFooter />
    </div>
  );
}
