"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/adminLogger";

export default function ChangePasswordPage() {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.email) return;

        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("La nueva contraseña debe tener al menos 8 caracteres");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Actualizando credenciales de seguridad...");

        try {
            // Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            // Log action
            await logAdminAction(user.email, "CHANGE_PASSWORD", "auth/user", "User updated administrative password");

            toast.dismiss(loadingToast);
            toast.success("Contraseña actualizada con éxito");

            // Clear inputs
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.error(error);
            let msg = "Error al actualizar la contraseña.";
            if (error.code === "auth/wrong-password") {
                msg = "La contraseña actual es incorrecta.";
            } else if (error.code === "auth/too-many-requests") {
                msg = "Demasiados intentos. Intenta de nuevo más tarde.";
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-metal-gold/10 rounded-2xl text-metal-gold border border-metal-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                        <KeyRound size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 tracking-tighter uppercase italic">
                            Seguridad de Acceso
                        </h1>
                        <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-[0.2em] mt-1">Gestión de Credenciales Administrativas</p>
                    </div>
                </div>
            </div>

            <Card variant="solid" className="p-8 border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-metal-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-metal-gold/10 transition-all duration-500" />

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Contraseña Actual</label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    icon={Lock}
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-black/60 border-white/5 focus:border-metal-gold/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-2.5 text-metal-silver/40 hover:text-white transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-4" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    icon={ShieldCheck}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className="bg-black/60 border-white/5 focus:border-metal-gold/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-2.5 text-metal-silver/40 hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    icon={CheckCircle2}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite la nueva contraseña"
                                    className="bg-black/60 border-white/5 focus:border-metal-gold/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-metal-silver/40 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-metal-gold/5 rounded-xl border border-metal-gold/10 flex gap-4 items-start">
                        <AlertCircle className="text-metal-gold shrink-0 mt-0.5" size={16} />
                        <div className="space-y-1">
                            <p className="text-[10px] text-white font-black uppercase tracking-tight">Política de Seguridad 2026</p>
                            <p className="text-[9px] text-metal-silver/60 leading-relaxed italic">
                                Al cambiar tu clave, se cerrarán todas las sesiones activas en otros dispositivos para garantizar la integridad de tu cuenta administrativa.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="premium"
                        className="w-full h-12 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
                        icon={loading ? RefreshCw : ArrowRight}
                        iconPosition="right"
                    >
                        {loading ? "Sincronizando..." : "Aplicar Nuevas Credenciales"}
                    </Button>
                </form>
            </Card>

            <div className="flex justify-between items-center text-[9px] text-metal-silver/20 px-2 uppercase font-black tracking-[0.2em]">
                <span>Módulo de Criptografía v2.1</span>
                <span className="flex items-center gap-1 opacity-50"><ShieldCheck size={10} /> AES-256 Auth Encryption</span>
            </div>
        </div>
    );
}
