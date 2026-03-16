'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/schemas';
import { Mail as MailIcon, Lock as LockIcon, ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon, CheckCircle2 as CheckCircleIcon, RefreshCw as RefreshIcon, Eye as EyeIcon, EyeOff as EyeOffIcon, Chrome } from 'lucide-react';
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
import { BRAND_YEAR, COPYRIGHT_TEXT } from '@/lib/config';

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
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        const passwordArray = new Uint32Array(12);
        
        const cryptoObj = (typeof window !== 'undefined' ? window.crypto : null) || (global as any).crypto || require('crypto');
        if (cryptoObj.getRandomValues) {
            cryptoObj.getRandomValues(passwordArray);
        } else {
            const buf = require('crypto').randomBytes(passwordArray.byteLength);
            passwordArray.set(new Uint32Array(buf.buffer, buf.byteOffset, passwordArray.length));
        }
        
        let password = "";
        // Ensure at least one of each required type
        password += "Ab1!"; 
        
        for (let i = 0; i < passwordArray.length; i++) {
            password += charset[passwordArray[i] % charset.length];
        }
        
        // Shuffle the password
        const shuffled = password.split('').sort(() => 0.5 - Math.random()).join('');
        
        setValue("password", shuffled);
        setValue("confirmPassword", shuffled);
        toast.success("Contraseña de grado militar generada");
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
        <div className="flex min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] selection:bg-brand-primary/20 transition-colors duration-500" suppressHydrationWarning>
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] bg-metal-blue/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Side A: Brand Immersion (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[var(--theme-bg-surface)] relative overflow-hidden flex-col justify-between p-24 border-r border-white-[0.03]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.07] grayscale mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-base)] via-[var(--theme-bg-base)]/90 to-transparent"></div>

                <Link href="/" className="relative z-10 block transition-transform hover:scale-105 duration-700">
                    <Logo variant="full" size="xl" />
                </Link>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-brand-primary/30" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)]">Membresía Vitalicia</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-[var(--theme-text-primary)] leading-[1.1] tracking-tight">
                            Empieza tu <br />
                            <span className="text-brand-primary italic">Viaje Heroico</span>
                        </h2>
                    </div>

                    <p className="text-xl text-[var(--theme-text-secondary)] font-medium leading-relaxed max-w-md opacity-80">
                        Únete a la élite académica y desbloquea herramientas de entrenamiento potenciadas por IA.
                    </p>

                    <div className="space-y-5">
                        {[
                            "Rutas de aprendizaje personalizadas",
                            "Simuladores de alta fidelidad",
                            "Análisis de brechas de conocimiento"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-[var(--theme-text-tertiary)] font-bold uppercase text-[9px] tracking-widest">
                                <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/20">
                                    <CheckCircleIcon size={14} />
                                </div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 opacity-70">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border-soft)]">
                        <LockIcon size={20} className="text-brand-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-text-tertiary)]">
                        Protección de datos nivel bancario
                    </p>
                </div>
            </div>

            {/* Side B: Registration Gateway */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-10">

                    {/* Header: Identity & Navigation */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <Link href="/login">
                                <Button variant="ghost" className="h-10 px-4 text-brand-primary/60 hover:text-brand-primary transition-all rounded-full group">
                                    <ArrowLeftIcon size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ya tengo cuenta</span>
                                </Button>
                            </Link>
                            <div className="lg:hidden">
                                <Link href="/">
                                    <Logo variant="full" size="sm" />
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--theme-text-primary)] tracking-tight font-academic leading-tight">
                                Crear <span className="text-gradient-maestro italic">Cuenta</span>
                            </h1>
                            <p className="text-[var(--theme-text-secondary)] text-base font-medium">Completa tus datos para activar tu acceso premium.</p>
                        </div>
                    </div>

                    {/* Form Container: Advanced Glassmorphism */}
                    <div className="bg-[var(--theme-bg-surface)] backdrop-blur-2xl border border-[var(--theme-border-soft)] p-8 sm:p-10 rounded-[2.5rem] shadow-xl dark:shadow-[var(--shadow-4k)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-brand-primary to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                            <div className="space-y-5">
                                <ValidatedInput
                                    label="CORREO INSTITUCIONAL"
                                    type="email"
                                    icon={MailIcon}
                                    onValidate={validateEmail}
                                    onChange={(value) => setValue('email', value)}
                                    className="bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] focus:border-brand-primary/60 text-sm h-14 rounded-2xl transition-all font-medium"
                                />
                                {errors.email && <p className="text-[10px] text-red-400 font-bold uppercase ml-1 tracking-wider">{errors.email.message}</p>}

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em]">CONTRASEÑA SEGURA</label>
                                        <button type="button" onClick={generatePassword} className="text-[9px] font-black uppercase tracking-tighter text-brand-primary/60 hover:text-brand-primary transition-all flex items-center gap-1.5">
                                            <RefreshIcon size={12} /> Sugerir Clave
                                        </button>
                                    </div>
                                    <div className="relative group/pass">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            icon={LockIcon}
                                            {...register("password")}
                                            error={errors.password?.message}
                                            className="bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] focus:border-brand-primary/60 text-sm h-14 rounded-2xl transition-all font-medium"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400 dark:text-white/20 group-hover/pass:text-brand-primary transition-colors">
                                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group/pass">
                                    <Input
                                        label="CONFIRMAR CONTRASEÑA"
                                        type={showConfirmPassword ? "text" : "password"}
                                        icon={LockIcon}
                                        {...register("confirmPassword")}
                                        error={errors.confirmPassword?.message}
                                        className="bg-[var(--theme-bg-base)]/50 border-[var(--theme-border-soft)] focus:border-brand-primary/60 text-sm h-14 rounded-2xl transition-all font-medium"
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-4 text-slate-400 dark:text-white/20 group-hover/pass:text-brand-primary transition-colors">
                                        {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-[var(--theme-border-soft)] space-y-6">
                                    <div className="flex items-start gap-3 bg-[var(--theme-bg-base)] p-4 rounded-2xl border border-[var(--theme-border-soft)]">
                                        <input type="checkbox" id="terms" {...register("terms")} className="mt-1 h-5 w-5 rounded-lg border-[var(--theme-border-soft)] text-brand-primary focus:ring-brand-primary bg-[var(--theme-bg-surface)] cursor-pointer" />
                                        <label htmlFor="terms" className="text-[11px] text-[var(--theme-text-secondary)] leading-relaxed cursor-pointer select-none">
                                            Acepto los <Link href="/legal/terms" target="_blank" className="text-brand-primary font-bold hover:underline">Términos</Link>, <Link href="/legal/privacy" target="_blank" className="text-brand-primary font-bold hover:underline">Privacidad</Link> y el uso de <Link href="/legal/cookies" target="_blank" className="text-brand-primary font-bold hover:underline">Cookies</Link>.
                                        </label>
                                    </div>
                                    {errors.terms && <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">{errors.terms.message}</p>}

                                    <div className="flex justify-center p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
                                        <Turnstile sitekey="0x4AAAAAACH1Rmabzh7QI6OR" onVerify={(token) => setCaptchaToken(token)} theme="auto" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !captchaToken}
                                isLoading={isSubmitting}
                                className="w-full h-15 mt-4 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-xl shadow-brand-primary/20 text-[11px] font-black uppercase tracking-[0.35em] rounded-2xl transform hover:scale-[1.01] active:scale-[0.98] transition-all"
                                icon={ArrowRightIcon}
                                iconPosition="right"
                            >
                                {isSubmitting ? "Finalizando..." : "Activar mi Acceso"}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                                <span className="bg-[var(--theme-bg-surface)] px-4 text-[var(--theme-text-tertiary)] truncate">O regístrate con</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            variant="outline"
                            className="w-full h-12 text-[10px] font-black uppercase tracking-[0.25em] border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)] hover:bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] rounded-2xl transition-all"
                            isLoading={googleLoading}
                        >
                            <Chrome size={18} className="mr-3" /> Registrar con Google
                        </Button>
                    </div>

                    <div className="pt-8 text-center text-[9px] font-black uppercase tracking-[0.4em] text-[var(--theme-text-tertiary)]">
                        © {BRAND_YEAR} • {COPYRIGHT_TEXT}
                    </div>
                </div>
            </div>
        </div>

    );
}
