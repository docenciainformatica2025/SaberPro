"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Save, User, Mail, School, BookOpen } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function TeacherSettingsPage() {
    const { user, role } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        institution: "",
        subject: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    fullName: data.fullName || "",
                    institution: data.institution || "",
                    subject: data.subject || "",
                    phone: data.phone || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                updatedAt: new Date()
            }, { merge: true });
            toast.success("¡Configuración Guardada!", {
                description: "Tu perfil profesional ha sido actualizado correctamente.",
                icon: <CheckCircle2 className="text-brand-primary" size={16} />
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al Guardar", {
                description: "Hubo un problema al procesar la solicitud. Intenta de nuevo.",
                icon: <AlertCircle className="text-red-500" size={16} />
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-[var(--theme-text-primary)] mb-2">Configuración de Perfil</h1>
                <p className="text-[var(--theme-text-secondary)]">Gestiona tu información personal y profesional.</p>
            </div>

            <div className="bg-[var(--theme-bg-surface)] backdrop-blur-xl p-8 rounded-2xl border border-[var(--theme-border-soft)] shadow-xl shadow-black/5">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)] flex items-center gap-2">
                                <User size={14} className="text-brand-primary" /> Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] rounded-xl p-4 text-sm font-medium text-[var(--theme-text-primary)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        {/* Institution */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)] flex items-center gap-2">
                                <School size={14} className="text-brand-primary" /> Institución Educativa
                            </label>
                            <input
                                type="text"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] rounded-xl p-4 text-sm font-medium text-[var(--theme-text-primary)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                                placeholder="Nombre del colegio o universidad"
                            />
                        </div>

                        {/* Subject/Area */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)] flex items-center gap-2">
                                <BookOpen size={14} className="text-brand-primary" /> Área / Asignatura Principal
                            </label>
                            <div className="relative group">
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] rounded-xl p-4 text-sm font-medium text-[var(--theme-text-primary)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="" disabled className="text-[var(--theme-text-tertiary)]">Selecciona tu área principal</option>
                                    <option value="Matemáticas y Cuantitativo">Matemáticas y Razonamiento Cuantitativo</option>
                                    <option value="Lectura Crítica y Lenguaje">Lectura Crítica y Lenguaje</option>
                                    <option value="Ciencias Sociales y Ciudadanas">Ciencias Sociales y Competencias Ciudadanas</option>
                                    <option value="Inglés">Inglés</option>
                                    <option value="Ciencias Naturales">Ciencias Naturales</option>
                                    <option value="Ingeniería">Ingeniería</option>
                                    <option value="Salud y Medicina">Salud y Medicina</option>
                                    <option value="Humanidades y Artes">Humanidades y Artes</option>
                                    <option value="Derecho y Leyes">Derecho y Leyes</option>
                                    <option value="Económicas y Administrativas">Económicas y Administrativas</option>
                                    <option value="Otra">Otra</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--theme-text-quaternary)] group-hover:text-brand-primary transition-colors">
                                    <Save size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--theme-border-soft)] flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-primary text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-xl flex items-center gap-3 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/20 shimmer-gold"
                        >
                            <Save size={16} />
                            {loading ? 'Guardando...' : 'Actualizar Perfil Profesional'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
