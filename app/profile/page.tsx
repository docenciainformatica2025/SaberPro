"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, GraduationCap, Target, School, User as UserIcon, Layout, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { BRAND_NAME } from "@/lib/config";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const { user, loading: authLoading, role } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        gradeLevel: "11",
        targetCareer: "",
        dreamUniversity: "",
        institution: "",
        city: "",
        scoreGoal: "350"
    });

    useEffect(() => {
        if (!authLoading && role === 'teacher') {
            router.push('/teacher/settings');
        }
    }, [role, authLoading, router]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchProfile() {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            fullName: data.fullName || "",
                            gradeLevel: data.gradeLevel || "11",
                            targetCareer: data.targetCareer || "",
                            dreamUniversity: data.dreamUniversity || "",
                            institution: data.institution || "",
                            city: data.city || "",
                            scoreGoal: data.scoreGoal || "350"
                        });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
        }
        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase()
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                email: user.email,
                completedProfile: true,
                updatedAt: new Date(),
                createdAt: (await getDoc(doc(db, "users", user.uid))).data()?.createdAt || new Date()
            }, { merge: true });

            toast.success("¡Perfil Actualizado!", {
                description: `Tu identidad digital en ${BRAND_NAME} ha sido sincronizada.`,
                icon: <CheckCircle2 className="text-brand-primary" size={16} />
            });
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error de Sincronización", {
                description: "No se pudieron guardar los cambios. Intente de nuevo.",
                icon: <AlertCircle className="text-red-500" size={16} />
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] py-12 px-6 flex items-center justify-center">
            <div className="max-w-4xl w-full mx-auto animate-in fade-in zoom-in-95 duration-500">

                <div className="mb-8 flex items-center justify-between">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] uppercase tracking-wider text-[10px]">
                            Volver al Dashboard
                        </Button>
                    </Link>
                    <Badge variant="primary" className="px-3 py-1 text-[10px] uppercase font-semibold tracking-wider">
                        Identidad Digital
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Card */}
                    <Card variant="primary" className="p-8 flex flex-col items-center text-center space-y-6 md:col-span-1 h-fit">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary via-yellow-600 to-brand-primary p-1 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <div className="w-full h-full rounded-full bg-[var(--theme-bg-base)] flex items-center justify-center text-3xl font-semibold text-brand-primary">
                                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <UserIcon size={32} />}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--theme-text-primary)] uppercase tracking-tight break-words">{formData.fullName || "Estudiante"}</h2>
                            <p className="text-[var(--theme-text-secondary)]/50 text-xs font-mono mt-2">{user?.email}</p>
                        </div>
                        <div className="w-full h-px bg-[var(--theme-border-soft)]" />
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--theme-text-secondary)] uppercase font-bold text-[10px] tracking-wider">Rol</span>
                                <Badge variant="default" className="text-[9px]">ESTUDIANTE</Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--theme-text-secondary)] uppercase font-bold text-[10px] tracking-wider">Plan</span>
                                <Badge variant="primary" className="text-[9px] animate-pulse">PRO</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Form Card */}
                    <Card variant="glass" className="p-8 md:col-span-2 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[var(--theme-border-soft)]">
                            <Sparkles className="text-brand-primary" size={20} />
                            <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] uppercase italic tracking-tight">Configuración de Perfil</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Nombre Completo</label>
                                    <div className="relative group">
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="TU NOMBRE"
                                            className="pl-10 uppercase transition-all focus:border-brand-primary/50"
                                            required
                                        />
                                        <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Grado Actual</label>
                                    <div className="relative group">
                                        <select
                                            name="gradeLevel"
                                            value={formData.gradeLevel}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl px-4 pl-10 h-10 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:border-brand-primary/50 transition-all appearance-none uppercase"
                                        >
                                            <option value="9" className="bg-[var(--theme-bg-base)]">9° GRADO</option>
                                            <option value="10" className="bg-[var(--theme-bg-base)]">10° GRADO</option>
                                            <option value="11" className="bg-[var(--theme-bg-base)]">11° GRADO</option>
                                            <option value="GRADUADO" className="bg-[var(--theme-bg-base)]">Egresado</option>
                                        </select>
                                        <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Institución Educativa</label>
                                    <div className="relative group">
                                        <Input
                                            name="institution"
                                            value={formData.institution}
                                            onChange={handleChange}
                                            placeholder="NOMBRE DEL COLEGIO"
                                            className="pl-10 uppercase focus:border-brand-primary/50"
                                            required
                                        />
                                        <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Carrera de Interés</label>
                                    <div className="relative group">
                                        <Input
                                            name="targetCareer"
                                            value={formData.targetCareer}
                                            onChange={handleChange}
                                            placeholder="EJ: MEDICINA, INGENIERÍA..."
                                            className="pl-10 uppercase focus:border-brand-primary/50"
                                            required
                                        />
                                        <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Universidad Soñada</label>
                                    <div className="relative group">
                                        <Input
                                            name="dreamUniversity"
                                            value={formData.dreamUniversity}
                                            onChange={handleChange}
                                            placeholder="UNIVERSIDAD..."
                                            className="pl-10 uppercase focus:border-brand-primary/50"
                                        />
                                        <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Ciudad</label>
                                    <div className="relative group">
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="CIUDAD DE RESIDENCIA"
                                            className="pl-10 uppercase focus:border-brand-primary/50"
                                        />
                                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)]/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] ml-1">Meta Puntaje Global</label>
                                    <div className="relative group">
                                        <select
                                            name="scoreGoal"
                                            value={formData.scoreGoal}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl px-4 pl-10 h-10 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:border-brand-primary/50 transition-all appearance-none uppercase"
                                        >
                                            <option value="300" className="bg-[var(--theme-bg-base)]">300+ (BÁSICO)</option>
                                            <option value="350" className="bg-[var(--theme-bg-base)]">350+ (SOBRESALIENTE)</option>
                                            <option value="400" className="bg-[var(--theme-bg-base)]">400+ (BECARIO)</option>
                                            <option value="450" className="bg-[var(--theme-bg-base)]">450+ (ÉLITE NACIONAL)</option>
                                        </select>
                                        <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={saving}
                                    icon={Save}
                                    className="px-8 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all uppercase tracking-wider font-semibold text-xs"
                                >
                                    Guardar Perfil
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
