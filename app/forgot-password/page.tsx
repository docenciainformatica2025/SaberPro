'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BRAND_YEAR, COPYRIGHT_TEXT } from '@/lib/config';
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await resetPassword(email);
            setMessage('Se ha enviado un enlace de recuperación a tu correo.');
        } catch (err: any) {
            console.error(err);
            let msg = "No se pudo enviar el correo.";
            if (err.code === "auth/user-not-found" || err.code === 'custom/user-not-found') {
                msg = "Este correo no se encuentra registrado en nuestro sistema.";
            } else if (err.code === "auth/invalid-email") {
                msg = "El formato del correo no es válido.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--theme-bg-base)]" suppressHydrationWarning>
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[var(--theme-bg-base)] relative overflow-hidden flex-col justify-between p-16 border-r border-[var(--theme-border-soft)]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-base)]/80 via-[var(--theme-bg-base)]/40 to-brand-primary/5"></div>

                {/* Decoration Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <Logo variant="full" size="xl" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-bold text-[var(--theme-text-primary)] mb-6 leading-tight">
                        Recupera tu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[var(--theme-text-primary)] to-brand-primary">acceso al éxito.</span>
                    </h2>
                    <p className="text-[var(--theme-text-secondary)] text-lg leading-relaxed mb-8">
                        No te preocupes, es común olvidar credenciales. Te enviaremos un enlace seguro para que puedas continuar tu preparación sin interrupciones.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-[var(--theme-text-tertiary)] space-y-2">
                    <p>{COPYRIGHT_TEXT}</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="space-y-2">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--theme-text-secondary)] hover:text-brand-primary transition-colors mb-4 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
                        </Link>
                        <h1 className="text-3xl font-bold text-[var(--theme-text-primary)] tracking-tight">Restablecer Contraseña</h1>
                        <p className="text-[var(--theme-text-tertiary)]">Ingresa tu correo para recibir las instrucciones.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 size={16} className="text-green-400" />
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1">
                                Correo Electrónico
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--theme-text-tertiary)] group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-xl py-3.5 pl-10 pr-4 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-tertiary)] outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full bg-brand-primary text-black font-bold py-3.5 rounded-xl shadow-lg hover:shadow-brand-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Enviando...</span>
                            ) : (
                                "Enviar Enlace de Recuperación"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
