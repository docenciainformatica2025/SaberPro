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
        <div className="flex min-h-screen bg-[#050505]">
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497864149936-d7e61461c302?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-[#0A0A0A]"></div>

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-metal-blue/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <Logo variant="full" size="xl" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Accede a tu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-[#ffd700] to-metal-gold">espacio de entrenamiento.</span>
                    </h2>
                    <p className="text-metal-silver/80 text-lg leading-relaxed mb-8">
                        Continúa tu preparación con métodos validados y seguimiento detallado de tu progreso.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Simulación de examen real",
                            "Métricas de desempeño",
                            "Seguimiento de progreso"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-metal-silver">
                                <CheckCircle2 className="text-metal-gold" size={20} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-metal-silver/40 space-y-2">
                    <p>{COPYRIGHT_TEXT}</p>
                    <p>
                        Desarrollado por <span className="text-metal-silver/60">Ing. Antonio Rodriguez</span><br />
                        para Docencia Informática.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8">

                    {/* Mobile Header (Standardized) */}
                    <div className="lg:hidden text-center mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <Link href="/">
                                <Button variant="ghost" icon={ArrowRight} className="rotate-180 p-0 text-metal-silver text-[10px] font-black uppercase tracking-widest">
                                    Inicio
                                </Button>
                            </Link>
                            <Logo variant="full" size="md" />
                            <div className="w-10"></div> {/* Spacer */}
                        </div>
                        <p className="text-[10px] font-black text-metal-silver/40 uppercase tracking-[0.2em]">Entrenamiento Profesional</p>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Bienvenido</h1>
                        <p className="text-metal-silver/60 text-sm">Ingresa tus credenciales para acceder al simulador.</p>
                    </div>

                    {/* Social Login */}
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="silver"
                        className="w-full bg-white text-black hover:bg-gray-100 border-none h-12"
                        isLoading={googleLoading}
                    >
                        Continuar con Google
                    </Button>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            icon={Mail}
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider">Contraseña</label>
                                <Link href="/forgot-password" className="text-xs text-metal-gold hover:text-white transition-colors">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    icon={Lock}
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-metal-silver/40 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" isLoading={isSubmitting} icon={ArrowRight} iconPosition="right" className="w-full h-12 mt-2">
                            {isSubmitting ? "Autenticando..." : "Ingresar al Sistema"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-metal-silver/60">
                            ¿Aún no tienes cuenta?{' '}
                            <Link href="/register" className="text-metal-gold hover:text-white font-medium transition-colors">Crear nueva cuenta</Link>
                        </p>
                    </div>
                </div>
            </div >
        </div >
    );
}
