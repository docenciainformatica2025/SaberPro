'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/schemas';
import { Mail, Lock, ArrowRight, Chrome, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { toast } from 'sonner';
import { BRAND_YEAR, COPYRIGHT_TEXT } from "@/lib/config";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
    const { login, signInWithGoogle, user, role, loading } = useAuth(); // Add role & loading
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    // Validar y redirigir si ya está logueado
    useEffect(() => {
        if (!loading && user) {
            const dashboardLink = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';
            router.push(dashboardLink);
        }
    }, [user, role, loading, router]);

    const onSubmit = async (data: LoginFormValues) => {
        setAuthError('');
        const loadingToast = toast.loading("Iniciando sesión...");
        try {
            await login(data.email, data.password);
            toast.dismiss(loadingToast);
            toast.success("¡Bienvenido de nuevo!");
        } catch (err: any) {
            toast.dismiss(loadingToast);
            console.error(err);
            let msg = "Ocurrió un error al iniciar sesión.";
            if (err.code === "auth/invalid-credential") msg = "Credenciales incorrectas.";
            else if (err.code === "auth/user-not-found") msg = "Cuenta no encontrada.";
            else if (err.code === "auth/wrong-password") msg = "Contraseña incorrecta.";
            else if (err.code === "auth/too-many-requests") msg = "Demasiados intentos. Intenta más tarde.";

            setAuthError(msg);
            toast.error("Error al ingresar", { description: msg });
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setAuthError('');
        const loadingToast = toast.loading("Conectando con Google...");
        try {
            await signInWithGoogle();
            toast.dismiss(loadingToast);
        } catch (err: any) {
            toast.dismiss(loadingToast);
            console.error("Google Login Error:", err);
            let msg = "No se pudo conectar con Google.";
            if (err.code === 'auth/popup-closed-by-user') msg = "Inicio de sesión cancelado.";
            setAuthError(msg);
            toast.error("Error de conexión", { description: msg });
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] selection:bg-brand-primary/20 transition-colors duration-500" suppressHydrationWarning>
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[800px] h-[800px] bg-metal-blue/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Side A: Brand Immersion (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[var(--theme-bg-surface)] relative overflow-hidden flex-col justify-between p-24 border-r border-white-[0.03]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-[0.07] grayscale mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-base)] via-[var(--theme-bg-base)]/90 to-transparent"></div>

                <div className="relative z-10 transition-transform hover:scale-105 duration-700">
                    <Logo variant="full" size="xl" />
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-10 bg-brand-primary/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Elite Learning System</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--theme-text-primary)] leading-[1.1] tracking-tight">
                            Libera tu <br />
                            <span className="text-brand-primary italic">potencial</span>
                        </h2>
                    </div>

                    <p className="text-xl text-[var(--theme-text-secondary)] font-medium leading-relaxed max-w-md opacity-80">
                        La plataforma definitiva para el entrenamiento Saber Pro, rediseñada para ofrecerte una ventaja competitiva real.
                    </p>

                    <div className="flex flex-wrap gap-8 pt-6">
                        <div className="space-y-1">
                            <p className="text-4xl font-black text-[var(--theme-text-primary)] tracking-tight">98%</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary/60">Efectividad Predictiva</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 dark:bg-white/10" />
                        <div className="space-y-1">
                            <p className="text-4xl font-black text-[var(--theme-text-primary)] tracking-tight">2.4x</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary/60">Velocidad de Mejora</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-8 mb-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--theme-bg-surface)] bg-[var(--theme-bg-overlay)] flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/40?img=${i + 20}`} alt="User avatar" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">
                            Únete a más de <span className="text-[var(--theme-text-primary)] font-black">+5,000 estudiantes</span> destacados
                        </p>
                    </div>
                </div>
            </div>

            {/* Side B: Access Gateway */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-12">

                    {/* Header: Identity & Welcome */}
                    <div className="space-y-4">
                        <div className="lg:hidden flex justify-center mb-10">
                            <Logo variant="full" size="md" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                    <CheckCircle2 size={16} className="text-brand-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Acceso Seguro v4.0</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text-primary)] tracking-tight leading-tight">
                                ¡Hola de <span className="text-brand-primary italic">nuevo!</span>
                            </h1>
                            <p className="text-[var(--theme-text-secondary)] text-sm font-medium opacity-60">Entra a tu zona de entrenamiento de alto rendimiento.</p>
                        </div>
                    </div>

                    {/* Form Container: Advanced Glassmorphism */}
                    <div className="bg-[var(--theme-bg-surface)] backdrop-blur-2xl border border-[var(--theme-border-soft)] p-8 sm:p-10 rounded-[2.5rem] shadow-xl dark:shadow-[var(--shadow-4k)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="CORREO ELECTRÓNICO"
                                type="email"
                                icon={Mail}
                                {...register("email")}
                                error={errors.email?.message}
                                className="bg-[var(--theme-bg-base)]/50 border-white/5 focus:border-brand-primary/40 text-sm h-14 rounded-2xl transition-all"
                            />

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">Contraseña</label>
                                    <Link href="/forgot-password" title="Recuperar contraseña" className="text-[10px] font-black uppercase tracking-tighter text-brand-primary/60 hover:text-brand-primary transition-all hover:tracking-normal">¿Olvidaste tu contraseña?</Link>
                                </div>
                                <div className="relative group/pass">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        icon={Lock}
                                        {...register("password")}
                                        error={errors.password?.message}
                                        className="bg-[var(--theme-bg-base)]/50 border-white/5 focus:border-brand-primary/40 text-sm h-14 rounded-2xl transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-[var(--theme-text-quaternary)] group-hover/pass:text-brand-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                icon={ArrowRight}
                                iconPosition="right"
                                className="w-full h-14 mt-4 bg-brand-primary hover:bg-brand-primary/90 text-[var(--theme-text-inverted)] shadow-2xl shadow-brand-primary/30 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transform hover:translate-y-[-2px] active:translate-y-0 transition-all shimmer-gold"
                            >
                                {isSubmitting ? "Autenticando..." : "Ingresar al Sistema"}
                            </Button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--theme-border-soft)]"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                                <span className="bg-[var(--theme-bg-surface)] px-4 text-[var(--theme-text-tertiary)] truncate">O continúa con</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            variant="outline"
                            className="w-full h-12 text-[10px] font-black uppercase tracking-[0.25em] border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)] hover:bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] rounded-2xl transition-all"
                            isLoading={googleLoading}
                        >
                            <Chrome size={18} className="mr-3" /> Google Autenticación
                        </Button>
                    </div>

                    {/* Footer: Redirection & Legal */}
                    <div className="text-center pt-2">
                        <p className="text-xs font-medium text-[var(--theme-text-tertiary)]">
                            ¿Aún no tienes cuenta?{' '}
                            <Link href="/register" className="text-brand-primary hover:text-[var(--theme-text-primary)] font-black uppercase tracking-widest ml-3 transition-all hover:tracking-[0.2em]">ÚNETE AHORA</Link>
                        </p>
                    </div>

                    <div className="pt-12 flex justify-between items-center opacity-70 text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] border-t border-[var(--theme-border-soft)]">
                        <span>{BRAND_YEAR} • {COPYRIGHT_TEXT}</span>
                        <div className="flex gap-4">
                            <Link href="/terms" className="hover:text-[var(--theme-text-primary)] transition-colors">Términos</Link>
                            <Link href="/privacy" className="hover:text-[var(--theme-text-primary)] transition-colors">Privacidad</Link>
                        </div>
                    </div>

                </div>
            </div >
        </div >

    );
}
