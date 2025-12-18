"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Save, User, Mail, School, BookOpen } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
            alert("Perfil actualizado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Configuración de Perfil</h1>
                <p className="text-metal-silver">Gestiona tu información personal y profesional.</p>
            </div>

            <div className="metallic-card p-8 rounded-2xl border border-metal-silver/10 bg-black/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-bold text-metal-silver mb-2 flex items-center gap-2">
                                <User size={16} className="text-metal-gold" /> Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-black/40 border border-metal-silver/20 rounded-xl p-3 text-white focus:border-metal-gold outline-none"
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        {/* Institution */}
                        <div>
                            <label className="block text-sm font-bold text-metal-silver mb-2 flex items-center gap-2">
                                <School size={16} className="text-metal-blue" /> Institución Educativa
                            </label>
                            <input
                                type="text"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full bg-black/40 border border-metal-silver/20 rounded-xl p-3 text-white focus:border-metal-blue outline-none"
                                placeholder="Nombre del colegio o universidad"
                            />
                        </div>

                        {/* Subject/Area */}
                        <div>
                            <label className="block text-sm font-bold text-metal-silver mb-2 flex items-center gap-2">
                                <BookOpen size={16} className="text-purple-400" /> Área / Asignatura Principal
                            </label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-black/40 border border-metal-silver/20 rounded-xl p-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="text-metal-silver/50">Selecciona tu área principal</option>
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
                        </div>
                    </div>

                    <div className="pt-4 border-t border-metal-silver/10 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="metallic-btn bg-metal-gold text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
