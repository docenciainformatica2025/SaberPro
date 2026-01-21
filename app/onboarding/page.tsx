"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, User, ArrowRight, Check } from "lucide-react";
import { BRAND_YEAR } from "@/lib/config";

export default function OnboardingPage() {
    const { user, role } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

    // If already has a role, redirect
    useEffect(() => {
        if (role === 'student') router.replace('/dashboard');
        if (role === 'teacher') router.replace('/teacher');
    }, [role, router]);

    const handleConfirm = async () => {
        if (!user || !selectedRole) return;
        setLoading(true);
        try {
            const { setDoc } = await import("firebase/firestore");
            await setDoc(doc(db, "users", user.uid), {
                role: selectedRole
            }, { merge: true });
            // Force reload manually to refresh context or rely on listener
            // Given listener is fast, we just wait a split second or push
            // Force reload to refresh AuthContext
            // Force reload to refresh AuthContext completely and triggering Guard re-eval
            if (selectedRole === 'student') window.location.href = '/dashboard';
            if (selectedRole === 'teacher') window.location.href = '/teacher';
        } catch (error) {
            console.error("Error setting role:", error);
            alert("Error al guardar tu perfil. Intenta de nuevo.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen bg-metal-dark flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-metal-gold"></div></div>;
    if (!user) return null; // Logic above handles redirect, this prevents flash

    return (
        <div className="min-h-screen bg-metal-dark flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        ¡Bienvenido a <span className="text-gradient-gold">Saber Pro {BRAND_YEAR}</span>!
                    </h1>
                    <p className="text-xl text-metal-silver">
                        Para personalizar tu experiencia, cuéntanos cómo usarás la plataforma.
                    </p>
                </div >

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* STUDENT CARD */}
                    <button
                        onClick={() => setSelectedRole('student')}
                        className={`metallic-card p-8 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group hover:scale-[1.02] ${selectedRole === 'student'
                            ? 'border-metal-gold bg-metal-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                            : 'border-metal-silver/20 hover:border-metal-silver/40'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'student' ? 'bg-metal-gold text-black' : 'bg-metal-silver/10 text-metal-silver'
                            }`}>
                            <User size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Soy Estudiante</h3>
                        <p className="text-metal-silver mb-6">
                            Quiero practicar con simulacros, recibir retroalimentación de IA y mejorar mi puntaje.
                        </p>
                        <ul className="space-y-2 text-sm text-metal-silver/70">
                            <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Simulacros Ilimitados (Pro)</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Tutor IA Personal</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Ranking Global</li>
                        </ul>
                    </button>

                    {/* TEACHER CARD */}
                    <button
                        onClick={() => setSelectedRole('teacher')}
                        className={`metallic-card p-8 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group hover:scale-[1.02] ${selectedRole === 'teacher'
                            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                            : 'border-metal-silver/20 hover:border-metal-silver/40'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'teacher' ? 'bg-purple-500 text-white' : 'bg-metal-silver/10 text-metal-silver'
                            }`}>
                            <GraduationCap size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Soy Docente</h3>
                        <p className="text-metal-silver mb-6">
                            Quiero crear clases, evaluar a mis estudiantes y monitorear su progreso en tiempo real.
                        </p>
                        <ul className="space-y-2 text-sm text-metal-silver/70">
                            <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Gestión de Aulas</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Analíticas de Grupo</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Plan Gratuito (10 estudiantes)</li>
                        </ul>
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedRole || loading}
                        className="metallic-btn bg-gradient-to-r from-metal-gold to-yellow-600 text-black font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-metal-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                    >
                        {loading ? "Configurando..." : "Comenzar Aventura"} <ArrowRight size={20} />
                    </button>
                </div>
            </div >
        </div >
    );
}
