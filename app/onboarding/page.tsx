"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, BookOpen, Target, Sparkles, GraduationCap, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";
import { formatDBInfo, formatFullName } from "@/utils/formatters";

interface OnboardingProfile {
    fullName: string;
    career: string;
    university: string;
    examDate: string;
    goal: string;
    selectedRole: "student" | "teacher" | "";
}

type Step = "welcome" | "profile" | "goals" | "diagnostic" | "generating";

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>("welcome");
    const { user, profile: authProfile, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<OnboardingProfile>({
        fullName: "",
        career: "",
        university: "",
        examDate: "",
        goal: "excellence",
        selectedRole: "",
    });

    // Protect route: Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    // State recovery: sync authProfile to local state and advance steps if data exists
    useEffect(() => {
        if (!loading) {
            // Prevent redirection loop: if they ALREADY have a role, get out of here
            if (authProfile?.role || authProfile?.completedProfile) {
                const homeHref = authProfile.role === 'teacher' ? '/teacher' : authProfile.role === 'admin' ? '/admin/dashboard' : '/dashboard';
                router.replace(homeHref);
                return;
            }

            setProfile(prev => ({
                ...prev,
                fullName: authProfile?.fullName || user?.displayName || prev.fullName,
                career: authProfile?.career || prev.career,
                university: authProfile?.university || prev.university,
                examDate: authProfile?.examDate || prev.examDate,
                goal: authProfile?.goal || prev.goal,
            }));

            // Auto-advance logic: If profile is mostly done, don't show welcome
            if (step === "welcome" && authProfile?.career) setStep("goals");
            if (step === "goals" && authProfile?.goal && authProfile?.career) setStep("diagnostic");
        }
    }, [authProfile, loading, step, router, user]);

    const nextStep = (next: Step) => {
        setStep(next);
        if (next === "generating") {
            handleSaveAndComplete();
        }
    };

    const handleSaveAndComplete = async (skipDiagnostic = false, forceRole?: "student" | "teacher") => {
        if (!user) return;
        setIsSaving(true);
        // Important: Preserve admin role if they are already identified as such
        const currentRole = authProfile?.role || null;
        const finalRole = currentRole === 'admin' ? 'admin' : (forceRole || profile.selectedRole || 'student');

        try {
            const userRef = doc(db, "users", user.uid);

            const saveData: Partial<UserProfile> = {
                uid: user.uid,
                email: user.email || "",
                fullName: formatFullName(profile.fullName || user.displayName || authProfile?.fullName || ""),
                targetCareer: formatDBInfo(profile.career),
                dreamUniversity: formatDBInfo(profile.university),
                examDate: profile.examDate,
                scoreGoal: profile.goal,
                role: finalRole,
                selectedRole: finalRole as any,
                completedProfile: true,
                onboardingCompleted: true,
                updatedAt: serverTimestamp(),
            };

            // Use setDoc with merge: true to handle non-existent documents (common for new admins)
            await setDoc(userRef, saveData, { merge: true });

            if (skipDiagnostic) {
                setStep("generating");
            }
        } catch (err) {
            console.error("Error saving onboarding data", err);
            toast.error("Error al guardar tu perfil. Revisa tu conexión.");
            setStep("goals");
        } finally {
            setIsSaving(false);
        }
    };

    const isProfileValid = profile.career.trim().length > 3 && profile.university.trim().length > 3;

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative pt-[var(--header-safe-zone)]">
            <AnimatePresence mode="wait">
                {step === "welcome" && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                        className="max-w-2xl w-full text-center space-y-8"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-brand-primary/10 rounded-3xl text-brand-primary animate-bounce-subtle">
                                <Sparkles size={48} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Badge variant="ghost" className="text-[var(--theme-text-tertiary)] font-bold tracking-widest uppercase px-3 h-7 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)]">
                                Bienvenido a Saber Pro
                            </Badge>
                            <h1 className="text-3xl md:text-5xl font-bold text-[var(--theme-text-primary)] tracking-tight text-pretty">
                                Tu mejor resultado empieza hoy.
                            </h1>
                            <p className="text-lg md:text-xl text-[var(--theme-text-secondary)] font-medium max-w-lg mx-auto leading-relaxed">
                                Hemos diseñado un mapa de aprendizaje inteligente pensado para ti.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto pt-8">
                            <button
                                onClick={() => {
                                    setProfile({ ...profile, selectedRole: 'student' });
                                    nextStep("profile");
                                }}
                                className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl hover:border-brand-primary transition-all text-left space-y-3 group"
                            >
                                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary w-fit group-hover:scale-110 transition-transform">
                                    <Target size={24} />
                                </div>
                                <h3 className="font-bold text-[var(--theme-text-primary)]">Soy Estudiante</h3>
                                <p className="text-xs text-[var(--theme-text-secondary)]">Quiero entrenar y mejorar mi puntaje.</p>
                            </button>

                            <button
                                onClick={() => {
                                    setProfile(prev => ({ ...prev, selectedRole: 'teacher' }));
                                    handleSaveAndComplete(true, 'teacher');
                                }}
                                className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl hover:border-brand-primary transition-all text-left space-y-3 group"
                            >
                                <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent w-fit group-hover:scale-110 transition-transform">
                                    <GraduationCap size={24} />
                                </div>
                                <h3 className="font-bold text-[var(--theme-text-primary)]">Soy Docente</h3>
                                <p className="text-xs text-[var(--theme-text-secondary)]">Quiero gestionar mis clases y simulacros.</p>
                            </button>
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="opacity-60 hover:opacity-100 text-xs font-bold uppercase tracking-widest"
                            >
                                Regresar al inicio
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "profile" && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl w-full space-y-10"
                    >
                        <header className="space-y-2">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--theme-text-tertiary)]">Paso 1 de 3</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-text-primary)] tracking-tight">Cuéntanos sobre ti</h2>
                            <p className="text-[var(--theme-text-secondary)] font-medium">Esto nos ayuda a calibrar la dificultad y los módulos.</p>
                        </header>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <User size={16} className="text-brand-primary" /> Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre y apellidos"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <GraduationCap size={16} className="text-brand-primary" /> Carrera Universitaria
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Ingeniería de Sistemas"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    value={profile.career}
                                    onChange={(e) => setProfile({ ...profile, career: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <BookOpen size={16} className="text-brand-primary" /> Universidad
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Universidad Nacional"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    value={profile.university}
                                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-brand-primary" /> Fecha de tu examen
                                </label>
                                <input
                                    type="date"
                                    className="w-full h-16 px-6 rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-lg focus:border-brand-primary transition-all outline-none"
                                    value={profile.examDate}
                                    onChange={(e) => setProfile({ ...profile, examDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" className="flex-1 h-14" onClick={() => nextStep("welcome")}>Atrás</Button>
                            <Button
                                className="flex-[2] h-14 font-bold"
                                onClick={() => nextStep("goals")}
                                disabled={!isProfileValid}
                            >
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "goals" && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl w-full space-y-10"
                    >
                        <header className="space-y-2">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--theme-text-tertiary)]">Paso 2 de 3</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-text-primary)] tracking-tight">¿Cuál es tu meta?</h2>
                            <p className="text-[var(--theme-text-secondary)] font-medium">Personalizaremos tu camino según tu ambición.</p>
                        </header>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: "excellence", label: "Excelencia", desc: "Quiero el mejor puntaje del país", icon: Sparkles, color: "text-brand-accent", bg: "bg-brand-accent/5" },
                                { id: "improve", label: "Mejorar", desc: "Superar mi promedio actual", icon: Target, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                                { id: "pass", label: "Asegurar", desc: "Cumplir con los requisitos básicos", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/5" }
                            ].map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setProfile({ ...profile, goal: g.id })}
                                    className={cn(
                                        "w-full text-left p-6 rounded-2xl border transition-all duration-120 flex items-center gap-6 group",
                                        profile.goal === g.id ? "border-brand-primary ring-1 ring-brand-primary bg-brand-primary/[0.02]" : "border-[var(--theme-border-soft)] hover:border-brand-primary/30"
                                    )}
                                >
                                    <div className={cn("p-4 rounded-xl transition-colors", g.bg, g.color)}>
                                        <g.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[var(--theme-text-primary)]">{g.label}</h3>
                                        <p className="text-sm text-[var(--theme-text-secondary)]">{g.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" className="flex-1 h-14" onClick={() => nextStep("profile")}>Atrás</Button>
                            <Button className="flex-[2] h-14 font-bold" onClick={() => nextStep("diagnostic")}>Continuar</Button>
                        </div>
                    </motion.div>
                )}

                {step === "diagnostic" && (
                    <motion.div
                        key="diagnostic"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-xl w-full text-center space-y-8"
                    >
                        <div className="p-6 bg-brand-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-brand-primary">
                            <Target size={40} />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-text-primary)] tracking-tight">¿Deseas un diagnóstico rápido?</h2>
                            <p className="text-lg text-[var(--theme-text-secondary)] leading-relaxed max-w-md mx-auto">
                                Solo 5 preguntas para entender tu nivel actual y crear un plan adaptativo.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="h-16 text-lg font-bold shadow-gold"
                                size="xl"
                                isLoading={isSaving}
                                onClick={async () => {
                                    // Auto-check if they already have results in localStorage (from public flow)
                                    const savedResults = localStorage.getItem("saberpro_diagnostic_results");
                                    if (savedResults) {
                                        await handleSaveAndComplete(true);
                                    } else {
                                        await handleSaveAndComplete(false);
                                        router.push("/diagnostic");
                                    }
                                }}
                            >
                                Iniciar Diagnóstico (2 min)
                            </Button>
                            <Button variant="ghost" className="h-14 opacity-60 hover:opacity-100" onClick={() => handleSaveAndComplete(true)}>
                                Omitir por ahora
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "generating" && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-md w-full text-center space-y-12"
                    >
                        <div className="relative flex justify-center items-center h-48">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute w-40 h-40 border-4 border-dashed border-brand-primary/20 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                className="absolute w-32 h-32 border-4 border-dashed border-brand-accent/20 rounded-full"
                            />
                            <Sparkles className="text-brand-primary animate-pulse" size={48} />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-[var(--theme-text-primary)]">Generando tu Plan Maestro</h2>
                            <p className="text-[var(--theme-text-secondary)] animate-pulse">
                                Analizando para {profile.selectedRole === 'teacher' ? 'Docente' : `Carrera: ${profile.career}`} y meta ({profile.goal})...
                            </p>
                        </div>

                        <GeneratingProgress onComplete={() => router.replace(profile.selectedRole === 'teacher' ? '/teacher' : '/dashboard')} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full -z-10" />
        </div>
    );
}

function GeneratingProgress({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + 1.2;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="w-full space-y-4">
            <div className="h-2 w-full bg-[var(--theme-bg-surface)] rounded-full overflow-hidden border border-[var(--theme-border-soft)]">
                <motion.div
                    className="h-full bg-brand-primary"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[var(--theme-text-secondary)]/50">
                <span>Calibrando</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
