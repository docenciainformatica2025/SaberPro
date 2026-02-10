'use client';

import { useState, useEffect, Suspense } from 'react';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BRAND_YEAR, COPYRIGHT_TEXT } from '@/lib/config';

function UpdatePasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { confirmPasswordReset } = useAuth();

    // Get the reset code from URL
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (!oobCode) {
            setError("El enlace de recuperación no es válido o está incompleto.");
        }
    }, [oobCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oobCode) return;

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await confirmPasswordReset(oobCode, password);
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            console.error(err);
            let msg = "No se pudo actualizar la contraseña. El enlace puede haber expirado.";
            if (err.code === 'auth/expired-action-code') msg = "El enlace ha expirado. Solicita otro nuevo.";
            if (err.code === 'auth/invalid-action-code') msg = "El enlace no es válido o ya fue usado.";
            if (err.code === 'auth/weak-password') msg = "La contraseña es muy débil.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">¡Contraseña Actualizada!</h2>
                <p className="text-metal-silver/80">Tu contraseña ha sido cambiada exitosamente.</p>
                <p className="text-metal-silver/60 text-sm">Redirigiendo al login en unos segundos...</p>
                <Link href="/login" className="inline-block mt-4 text-metal-gold hover:text-white transition-colors">
                    Ir a Iniciar Sesión ahora
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Nueva Contraseña</h1>
                <p className="text-metal-silver/60">Crea una nueva contraseña para tu cuenta.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!oobCode ? (
                <Link href="/forgot-password" className="block text-center text-metal-gold hover:text-white transition-colors">
                    Solicitar nuevo enlace
                </Link>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider ml-1">
                            Nueva Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-metal-silver group-focus-within:text-metal-gold transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#151515] border border-metal-silver/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-metal-silver/30 outline-none focus:border-metal-gold/50 focus:ring-1 focus:ring-metal-gold/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider ml-1">
                            Confirmar Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-metal-silver group-focus-within:text-metal-gold transition-colors" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#151515] border border-metal-silver/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-metal-silver/30 outline-none focus:border-metal-gold/50 focus:ring-1 focus:ring-metal-gold/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-metal-gold to-[#B8860B] text-black font-bold py-3.5 rounded-xl shadow-lg hover:shadow-metal-gold/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Actualizando...</span>
                        ) : (
                            <>
                                Actualizar Contraseña <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function UpdatePasswordPage() {
    return (
        <div className="flex min-h-screen bg-metal-black" suppressHydrationWarning>
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-metal-gold/5"></div>

                {/* Decoration Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-metal-gold to-[#B8860B] rounded-lg flex items-center justify-center shadow-lg shadow-metal-gold/20">
                            <span className="font-bold text-black text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-wide">SaberPro<span className="text-metal-gold">{BRAND_YEAR}</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Seguridad <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-[#ffd700] to-metal-gold">ante todo.</span>
                    </h2>
                    <p className="text-metal-silver/80 text-lg leading-relaxed mb-8">
                        Mantén tu cuenta segura. Tu progreso y resultados son importantes para nosotros.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-metal-silver/40 space-y-2">
                    <p>{COPYRIGHT_TEXT}</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <Suspense fallback={<div className="text-white">Cargando...</div>}>
                    <UpdatePasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
