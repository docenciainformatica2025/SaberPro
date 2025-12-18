'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Chrome, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signInWithGoogle, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            console.error(err);
            let msg = "Ocurrió un error al iniciar sesión.";
            if (err.code === "auth/invalid-credential") msg = "Credenciales incorrectas.";
            else if (err.code === "auth/user-not-found") msg = "Cuenta no encontrada.";
            else if (err.code === "auth/wrong-password") msg = "Contraseña incorrecta.";
            else if (err.code === "auth/too-many-requests") msg = "Demasiados intentos. Intenta más tarde.";
            setError(msg);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error("Google Login Error:", err);

            let msg = "No se pudo conectar con Google.";

            if (err.code === 'auth/popup-closed-by-user') {
                msg = "Inicio de sesión cancelado.";
            } else if (err.code === 'auth/popup-blocked') {
                msg = "El navegador bloqueó la ventana emergente. Por favor permítela.";
            } else if (err.code === 'auth/cancelled-popup-request') {
                msg = "Se canceló la solicitud.";
            } else if (err.code === 'auth/unauthorized-domain') {
                msg = "Dominio no autorizado en Firebase (Configuración).";
            }

            setError(msg);
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497864149936-d7e61461c302?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-metal-gold/5"></div>

                {/* Decoration Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-metal-blue/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-metal-gold to-[#B8860B] rounded-lg flex items-center justify-center shadow-lg shadow-metal-gold/20">
                            <span className="font-bold text-black text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-wide">SaberPro<span className="text-metal-gold">2026</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Prepárate para <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-[#ffd700] to-metal-gold">tu futuro profesional.</span>
                    </h2>
                    <p className="text-metal-silver/80 text-lg leading-relaxed mb-8">
                        Únete a miles de estudiantes que ya están mejorando sus resultados en las pruebas de estado con nuestra tecnología de simulación avanzada.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Simulacros ilimitados con IA",
                            "Análisis detallado de rendimiento",
                            "Comparativa nacional en tiempo real"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-metal-silver">
                                <CheckCircle2 className="text-metal-gold" size={20} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-metal-silver/40 space-y-2">
                    <p>© 2025 Saber Pro Suite. Todos los derechos reservados.</p>
                    <p>
                        Desarrollado por <span className="text-metal-silver/60">Ing. Antonio Rodriguez</span><br />
                        para Docencia Informática.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">SaberPro<span className="text-metal-gold">2026</span></h1>
                        <p className="text-metal-silver/60">Tu compañero de estudio inteligente</p>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido de nuevo</h1>
                        <p className="text-metal-silver/60">Ingresa tus credenciales para acceder al simulador.</p>
                    </div>

                    {/* Social Login */}
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="silver"
                        className="w-full bg-white text-black hover:bg-gray-100 border-none h-12"
                        isLoading={googleLoading}
                        aria-label="Iniciar sesión con Google"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar con Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-metal-silver/10"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#050505] px-2 text-metal-silver/40">O continúa con correo</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@ejemplo.com"
                            required
                        />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider">
                                    Contraseña
                                </label>
                                <Link href="/forgot-password" className="text-xs text-metal-gold hover:text-white transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                icon={Lock}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full h-12 mt-2"
                        >
                            {loading ? "Autenticando..." : "Ingresar al Sistema"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-metal-silver/60">
                            ¿Aún no tienes cuenta?{' '}
                            <Link href="/register" className="text-metal-gold hover:text-white font-medium transition-colors">
                                Crear nueva cuenta
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Legal Links (Absolute Bottom) */}
                <div className="absolute bottom-6 w-full text-center px-4">
                    <p className="text-[10px] text-metal-silver/30">
                        Protegido por reCAPTCHA y sujeto a la <Link href="/privacy" className="hover:text-metal-gold underline">Política de Privacidad</Link> y <Link href="/terms" className="hover:text-metal-gold underline">Términos del Servicio</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
