'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/schemas';
import { Mail as MailIcon, Lock as LockIcon, ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon, CheckCircle2 as CheckCircleIcon, RefreshCw as RefreshIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import Turnstile from 'react-turnstile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import FormStepper from '@/components/ui/FormStepper';
import ValidatedInput from '@/components/ui/ValidatedInput';
import { toast } from 'sonner';
import { Logo } from "@/components/ui/Logo";

const STEPS = []; // Removed for single-step flow

export default function RegisterPage() {
    // v4.0.0 Restoration - Exact Original State
    const { signup, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        let password = "Aa1@";
        for (let i = 0; i < 4; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        setValue("password", password);
        setValue("confirmPassword", password);
        toast.success("Contraseña segura generada");
    };

    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword", "");
    const emailValue = watch("email", "");

    const requirements = [
        { regex: /.{8,}/, text: "Mínimo 8 caracteres" },
        { regex: /[A-Z]/, text: "Una mayúscula" },
        { regex: /[0-9]/, text: "Un número" },
        { regex: /[^A-Za-z0-9]/, text: "Un símbolo (@$!%*?&)" },
    ];

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? 'valid' : 'invalid';
    };



    const validatePassword = (value: string) => {
        const allMet = requirements.every(req => req.regex.test(value));
        return allMet ? 'valid' : 'invalid';
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setAuthError('');
        const loadingToast = toast.loading("Creando tu cuenta...");
        try {
            await signup(data.email, data.password);
            toast.dismiss(loadingToast);
            toast.success("¡Cuenta creada exitosamente!");
            router.push('/onboarding');
        } catch (err: any) {
            toast.dismiss(loadingToast);
            let msg = `Error al crear cuenta: ${err.message || 'Error desconocido'}`;
            if (err.code === 'auth/email-already-in-use') {
                msg = "Este correo ya está registrado. Intenta iniciar sesión.";
            }
            setAuthError(msg);
            toast.error("Error de Registro", { description: msg, duration: 5000 });
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            let msg = "No se pudo conectar con Google.";
            setAuthError(msg);
            setGoogleLoading(false);
        }
    };



    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-[#0A0A0A]"></div>
                <div className="relative z-10">
                    <div className="mb-8"><Logo variant="full" size="xl" /></div>
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Crea tu perfil y <br />
                        <span className="text-metal-gold">empieza a entrenar.</span>
                    </h2>
                    <div className="space-y-4">
                        {["Diagnóstico de nivel inicial", "Práctica por áreas específicas", "Resultados inmediatos"].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-metal-silver">
                                <CheckCircleIcon className="text-metal-gold" size={20} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8">
                    {/* Public Navigation Pill */}
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/">
                            <Button variant="ghost" icon={ArrowLeftIcon} className="p-0 text-metal-silver text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                Regresar al Inicio
                            </Button>
                        </Link>
                        <div className="lg:hidden">
                            <Logo variant="full" size="sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registro de Usuario</h1>
                        <p className="text-metal-silver/60 text-sm">Crea tu cuenta institucional <span className="text-metal-gold text-[10px] ml-2 border border-metal-gold/30 px-2 py-0.5 rounded-full">v4.1.6 (Legal)</span></p>
                    </div>



                    <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="silver"
                        className="w-full bg-white text-black hover:bg-gray-100 border-none h-12"
                        isLoading={googleLoading}
                    >
                        Registrarse con Google
                    </Button>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <ValidatedInput
                                label="Correo Electrónico"
                                type="email"
                                icon={MailIcon}
                                onValidate={validateEmail}
                                onChange={(value) => setValue('email', value)}
                            />
                            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}

                            {/* Password Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-metal-silver/80 uppercase">Contraseña</label>
                                    <button type="button" onClick={generatePassword} className="text-[10px] text-metal-gold hover:text-white flex items-center gap-1 uppercase font-bold">
                                        <RefreshIcon size={10} /> Generar
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        icon={LockIcon}
                                        {...register("password")}
                                        error={errors.password?.message}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-metal-silver/40 hover:text-white">
                                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                    </button>
                                </div>
                            </div>
                            <Input label="Confirmar" type="password" icon={LockIcon} {...register("confirmPassword")} error={errors.confirmPassword?.message} />

                            {/* Terms & Security Section (Unified) */}
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" id="terms" {...register("terms")} className="mt-1 h-4 w-4 rounded border-metal-silver text-metal-gold focus:ring-metal-gold bg-metal-dark/50" />
                                    <label htmlFor="terms" className="text-xs text-metal-silver/70 leading-relaxed">
                                        Al crear mi cuenta acepto los <Link href="/terms" target="_blank" className="text-metal-gold underline hover:text-white">Términos de Uso</Link>, <Link href="/privacy" target="_blank" className="text-metal-gold underline hover:text-white">Política de Privacidad</Link> y el uso de <Link href="/cookies" target="_blank" className="text-metal-gold underline hover:text-white">Cookies</Link>.
                                    </label>
                                </div>
                                {errors.terms && <p className="text-xs text-red-400 ml-1">{errors.terms.message}</p>}

                                <div className="flex justify-center bg-black/20 p-2 rounded-xl border border-white/5">
                                    <Turnstile sitekey="0x4AAAAAACH1Rmabzh7QI6OR" onVerify={(token) => setCaptchaToken(token)} theme="dark" />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting || !captchaToken} isLoading={isSubmitting} className="h-12 px-8 w-full" icon={ArrowRightIcon} iconPosition="right">
                            Crear Cuenta
                        </Button>
                    </form>
                    <div className="text-center"><p className="text-sm text-metal-silver/60">¿Ya tienes cuenta? <Link href="/login" className="text-metal-gold hover:text-white font-medium">Iniciar Sesión</Link></p></div>
                </div>
            </div>
        </div>
    );
}
