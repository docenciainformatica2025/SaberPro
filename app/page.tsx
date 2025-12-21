"use client";

import Link from "next/link";
import { ShieldCheck, TrendingUp, Brain, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BRAND_YEAR, COPYRIGHT_TEXT } from "@/lib/config";

import { Logo } from "@/components/ui/Logo";

export default function Home() {
  const { user, role } = useAuth();
  const dashboardLink = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] selection:bg-metal-gold/30">

      {/* Navigation (Transparent) */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="md" />
          </Link>
          <div className="flex gap-4">
            {user ? (
              <Link href={dashboardLink}>
                <Button variant="premium" className="text-xs font-black uppercase tracking-widest h-10 px-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest text-metal-silver hover:text-white">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="premium" className="text-xs font-black uppercase tracking-widest h-10 px-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">Comenzar Gratis</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-4 relative overflow-hidden flex flex-col items-center text-center">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-metal-gold/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-metal-blue/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-8 animate-in fade-in zoom-in-95 duration-1000">
          <Badge variant="premium" className="mx-auto px-6 py-2 text-xs font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(212,175,55,0.2)] border-metal-gold/30">
            Plataforma Oficial {BRAND_YEAR}
          </Badge>

          <p className="text-[10px] md:text-xs text-metal-silver/40 font-bold uppercase tracking-[0.15em] mt-2">
            Diseñado y desarrollado por Ing. Antonio Rodríguez
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.0] mb-6">
            <span className="block text-white mb-2 drop-shadow-2xl">
              Prepárate para el
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold animate-gradient-x">
              Saber Pro {BRAND_YEAR}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto font-medium leading-relaxed mb-4">
            con práctica inteligente basada en tu nivel real.
          </p>

          <p className="text-sm md:text-base text-metal-silver/80 uppercase tracking-widest font-bold mb-8">
            Diagnóstico gratuito • Plan personalizado • Resultados medibles
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
            {user ? (
              <Link href={dashboardLink}>
                <Button size="xl" variant="premium" icon={ArrowRight} iconPosition="right" className="h-16 px-10 text-lg font-black uppercase tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] hover:scale-105 transition-all">
                  Continuar Entrenamiento
                </Button>
              </Link>
            ) : (
              <Link href="/diagnostic">
                <Button size="xl" variant="premium" icon={Brain} iconPosition="left" className="h-16 px-10 text-lg font-black uppercase tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] hover:scale-105 transition-all">
                  Probar ahora (3 minutos)
                </Button>
              </Link>
            )}
            <Link href="/methodology">
              <Button variant="outline" size="xl" className="h-16 px-10 text-lg font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 hover:border-white/20 backdrop-blur-md">
                Ver cómo funciona
              </Button>
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="pt-20 pb-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-metal-silver mb-8">Confianza de Estudiantes de</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center">
              <span className="text-xl font-serif font-bold text-white">UNAL</span>
              <span className="text-xl font-serif font-bold text-white">ANDES</span>
              <span className="text-xl font-serif font-bold text-white">JAVERIANA</span>
              <span className="text-xl font-serif font-bold text-white">EAFIT</span>
              <span className="text-xl font-serif font-bold text-white">UNIVALLE</span>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section & Marketing Copy */}
      <section className="py-32 relative bg-black/50 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-6">
            <Badge variant="outline" className="text-metal-gold border-metal-gold/30 px-4 py-1 uppercase tracking-widest text-[10px] font-black">
              Filosofía de Entrenamiento
            </Badge>

            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
              &quot;El problema no es que no sepas.<br />
              <span className="text-metal-silver/50">Es que no sabes qué reforzar.&quot;</span>
            </h2>

            <p className="text-metal-silver max-w-2xl mx-auto text-lg font-medium">
              El Saber Pro no se estudia. <span className="text-white font-bold">Se entrena.</span><br />
              Entrena como los que sí pasan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Algoritmos Adaptativos", desc: "El sistema aprende de tus errores y calibra la dificultad en tiempo real.", color: "text-purple-400" },
              { icon: TrendingUp, title: "Analítica Predictiva", desc: "Proyecciones de puntaje basadas en datos históricos de 10 años.", color: "text-blue-400" },
              { icon: ShieldCheck, title: "Simulación Realista", desc: "Entorno idéntico al examen real: Sin pausas, cronometrado y seguro.", color: "text-green-400" }
            ].map((item, i) => (
              <Card key={i} variant="glass" className="p-10 group hover:-translate-y-2 transition-transform duration-500 border-white/5 bg-white/[0.02]">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors`}>
                  <item.icon className={item.color} size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">{item.title}</h3>
                <p className="text-metal-silver text-base font-medium leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-gradient-to-b from-metal-gold/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">5k+</div>
              <div className="text-xs font-bold text-metal-gold uppercase tracking-widest">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">98%</div>
              <div className="text-xs font-bold text-metal-gold uppercase tracking-widest">Tasa de Aprobación</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">24/7</div>
              <div className="text-xs font-bold text-metal-gold uppercase tracking-widest">Disponibilidad</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">#1</div>
              <div className="text-xs font-bold text-metal-gold uppercase tracking-widest">Plataforma LatAm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col gap-4 text-metal-silver/40 text-[10px] font-bold uppercase tracking-widest mb-8">
            <p>{COPYRIGHT_TEXT}</p>
            <p>
              Desarrollado por <span className="text-metal-silver">Ing. Antonio Rodriguez</span> para Docencia Informática.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-50 px-4">
            <Link href="/terms" className="text-metal-silver hover:text-white text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap">Términos</Link>
            <Link href="/privacy" className="text-metal-silver hover:text-white text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap">Privacidad</Link>
            <a href="mailto:docenciainformatica2025@gmail.com" className="text-metal-silver hover:text-white text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap flex items-center gap-2">
              ✉️ Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
