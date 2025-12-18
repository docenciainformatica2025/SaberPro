'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
        <div className="flex min-h-screen bg-[#050505]" suppressHydrationWarning>
            {/* Left Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-metal-gold/5"></div>

                {/* Decoration Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[100px]"></div>

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
                        Recupera tu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-[#ffd700] to-metal-gold">acceso al éxito.</span>
                    </h2>
                    <p className="text-metal-silver/80 text-lg leading-relaxed mb-8">
                        No te preocupes, es común olvidar credenciales. Te enviaremos un enlace seguro para que puedas continuar tu preparación sin interrupciones.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-metal-silver/40 space-y-2">
                    <p>© 2025 Saber Pro Suite. Todos los derechos reservados.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="space-y-2">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-metal-silver hover:text-metal-gold transition-colors mb-4 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Restablecer Contraseña</h1>
                        <p className="text-metal-silver/60">Ingresa tu correo para recibir las instrucciones.</p>
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
                            <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider ml-1">
                                Correo Electrónico
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-metal-silver group-focus-within:text-metal-gold transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#151515] border border-metal-silver/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-metal-silver/30 outline-none focus:border-metal-gold/50 focus:ring-1 focus:ring-metal-gold/20 transition-all"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full bg-gradient-to-r from-metal-gold to-[#B8860B] text-black font-bold py-3.5 rounded-xl shadow-lg hover:shadow-metal-gold/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
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
