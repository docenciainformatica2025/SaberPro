'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/schemas';
import { Mail, Lock, ArrowRight, CheckCircle2, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Turnstile from 'react-turnstile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { toast } from 'sonner';
import { BRAND_YEAR, COPYRIGHT_TEXT } from "@/lib/config";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
    const { signup, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        let password = "";

        // Ensure at least one of each required type
        password += "A"; // Uppercase
        password += "a"; // Lowercase
        password += "1"; // Number
        password += "@"; // Symbol

        // Fill the rest (4 chars to reach 8)
        for (let i = 0; i < 4; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Shuffle the password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        setValue("password", password);
        setValue("confirmPassword", password);
        toast.success("Contraseña segura generada", {
            description: "No olvides guardarla en un lugar seguro."
        });
    };

    const passwordValue = watch("password", "");

    const requirements = [
        { regex: /.{8,}/, text: "Mínimo 8 caracteres" },
        { regex: /[A-Z]/, text: "Una mayúscula" },
        { regex: /[0-9]/, text: "Un número" },
        { regex: /[^A-Za-z0-9]/, text: "Un símbolo (@$!%*?&)" },
    ];

    const onSubmit = async (data: RegisterFormValues) => {
        setAuthError('');
        const loadingToast = toast.loading("Creando tu cuenta...");
        try {
            await signup(data.email, data.password);
            toast.dismiss(loadingToast);
            toast.success("¡Cuenta creada exitosamente!", {
                description: "Redirigiendo a la configuración inicial..."
            });
            router.push('/onboarding');
        } catch (err: any) {
            toast.dismiss(loadingToast);
            console.error("Signup Error:", err);
            let msg = `Error al crear cuenta: ${err.message || 'Error desconocido'}`;

            if (err.code === 'auth/email-already-in-use') {
                msg = "Este correo ya está registrado. Intenta iniciar sesión.";
            } else if (err.code === 'auth/weak-password') {
                msg = "La contraseña debe tener al menos 8 caracteres y cumplir los requisitos.";
            } else if (err.code === 'auth/invalid-email') {
                msg = "El formato del correo no es válido.";
            } else if (err.code === 'auth/operation-not-allowed') {
                msg = "El registro con correo está deshabilitado temporalmente.";
            } else if (err.code === 'auth/network-request-failed') {
                msg = "Error de red. Revisa tu conexión a internet.";
            }

            setAuthError(msg);
            toast.error("Error de Registro", {
                description: msg,
                duration: 5000
            });
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setAuthError('');
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error("Google Login Error:", err);
            let msg = "No se pudo conectar con Google.";
            if (err.code === 'auth/popup-closed-by-user') {
                msg = "Inicio de sesión cancelado.";
            } else if (err.code === 'auth/popup-blocked') {
                msg = "El navegador bloqueó la ventana emergente.";
            }
            setAuthError(msg);
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-metal-gold/5"></div>

                {/* Decoration Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-metal-blue/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <Logo variant="full" size="xl" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Crea tu perfil y <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-[#ffd700] to-metal-gold">empieza a entrenar.</span>
                    </h2>
                    <p className="text-metal-silver/80 text-lg leading-relaxed mb-8">
                        Herramientas profesionales para estudiantes que buscan claridad en su preparación.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Diagnóstico de nivel inicial",
                            "Práctica por áreas específicas",
                            "Resultados inmediatos"
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

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Mobile Header (Standardized) */}
                    <div className="lg:hidden text-center mb-6">
                        <div className="flex justify-center mb-2">
                            <Logo variant="full" size="md" />
                        </div>
                        <p className="text-[10px] font-black text-metal-silver/40 uppercase tracking-[0.2em]">Prepárate para el Éxito</p>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Registro</h1>
                        <p className="text-metal-silver/60 text-sm">Crea tu cuenta para comenzar tu preparación.</p>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="silver"
                        className="w-full bg-white text-black hover:bg-gray-100 border-none h-12"
                        isLoading={googleLoading}
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Registrarse con Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-metal-silver/10"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#050505] px-2 text-metal-silver/40">O regístrate con correo</span>
                        </div>
                    </div>

                    {authError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            icon={Mail}
                            placeholder="nombre@ejemplo.com"
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider">
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="text-[10px] text-metal-gold hover:text-white flex items-center gap-1 transition-colors uppercase font-bold tracking-wider"
                                >
                                    <RefreshCw size={10} /> Generar Segura
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    icon={Lock}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-metal-silver/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password Requirements Visualization */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {requirements.map((req, i) => {
                                    const met = req.regex.test(passwordValue);
                                    return (
                                        <div key={i} className={`text-[10px] flex items-center gap-1.5 ${met ? 'text-green-400' : 'text-metal-silver/30'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-400' : 'bg-metal-silver/20'}`} />
                                            {req.text}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            icon={Lock}
                            placeholder="Repite tu contraseña"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                        />

                        {/* Terms */}
                        <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-metal-silver/5 mt-2">
                            <div className="relative flex items-center pt-1">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    {...register("terms")}
                                    className="h-4 w-4 rounded border-metal-silver text-metal-gold focus:ring-metal-gold bg-metal-dark/50 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-metal-silver/70 cursor-pointer select-none leading-relaxed">
                                Acepto los <Link href="/terms" target="_blank" className="text-metal-gold hover:text-white underline">Términos de Uso y Política de Datos</Link>.
                                Entiendo que esta App es un simulador educativo y <strong>no garantiza mis resultados</strong> en el examen oficial.
                            </label>
                        </div>
                        {errors.terms && <span className="text-red-400 text-xs ml-1">{errors.terms.message}</span>}

                        <div className="flex justify-center my-4 overflow-hidden rounded-xl">
                            <Turnstile
                                sitekey="0x4AAAAAACH1Rmabzh7QI6OR"
                                onVerify={(token) => setCaptchaToken(token)}
                                theme="dark"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !captchaToken}
                            isLoading={isSubmitting}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full h-12 mt-4"
                        >
                            {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-metal-silver/60">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="text-metal-gold hover:text-white font-medium transition-colors">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Legal Links (Absolute Bottom) */}
                <div className="absolute bottom-6 w-full text-center px-4">
                    <p className="text-[10px] text-metal-silver/30">
                        Protegido por reCAPTCHA y sujeto a la <Link href="/privacy" className="hover:text-metal-gold underline">Política de Privacidad</Link>.
                    </p>
                </div>
            </div >
        </div >
    );
}

