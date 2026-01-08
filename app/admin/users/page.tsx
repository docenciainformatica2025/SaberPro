"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, limit, query, updateDoc, doc, where, orderBy, deleteDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import {
    Shield,
    User,
    GraduationCap,
    Check,
    X,
    Crown,
    Search,
    Filter,
    MoreVertical,
    Mail,
    MapPin,
    School,
    Trash2,
    FileText,
    Download,
    RefreshCw,
    Edit3,
    Key,
    Users as UsersIcon,
    ShieldAlert
} from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { logAdminAction } from "@/lib/adminLogger";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface UserData {
    id: string;
    email: string;
    role: "student" | "teacher" | "admin";
    subscription?: {
        plan: "free" | "pro";
        status: "active" | "expired";
    };
    fullName?: string;
    displayName?: string;
    city?: string;
    institution?: string;
    completedProfile?: boolean;
    createdAt?: any;
    consentLog?: {
        acceptedAt: string;
        type: string;
        version: string;
        ipHash: string;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher" | "admin">("all");
    const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");

    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.email?.toLowerCase().includes(lowerTerm) ||
                u.fullName?.toLowerCase().includes(lowerTerm) ||
                u.id.toLowerCase().includes(lowerTerm)
            );
        }
        if (roleFilter !== "all") {
            result = result.filter(u => (u.role || 'student') === roleFilter);
        }
        if (planFilter !== "all") {
            result = result.filter(u => (u.subscription?.plan || 'free') === planFilter);
        }
        setFilteredUsers(result);
    }, [searchTerm, roleFilter, planFilter, users]);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "teacher" ? "student" : "teacher";
        if (!confirm(`CONFIRMAR ACCIÓN:\n\n¿Cambiar rol de ${currentRole.toUpperCase()} a ${newRole.toUpperCase()}?`)) return;

        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
            await logAdminAction(currentUser?.email || "unknown", "UPDATE_ROLE", userId, `Changed role from ${currentRole} to ${newRole}`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        } catch (error) {
            alert("Error actualizando rol.");
        }
    };

    const togglePlan = async (userId: string, currentPlan: string) => {
        let newPlan = currentPlan === "pro" ? "free" : "pro";
        if (!confirm(`CONFIRMAR ACCIÓN:\n\n¿Cambiar plan de ${currentPlan.toUpperCase()} a ${newPlan.toUpperCase()}?`)) return;

        try {
            await updateDoc(doc(db, "users", userId), {
                "subscription.plan": newPlan,
                "subscription.status": "active"
            });
            await logAdminAction(currentUser?.email || "unknown", "UPDATE_PLAN", userId, `Changed plan from ${currentPlan} to ${newPlan}`);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, subscription: { ...u.subscription, plan: newPlan as any, status: "active" } }
                    : u
            ));
        } catch (error) {
            alert("Error actualizando plan");
        }
    };

    const validateConsentManually = async (userId: string) => {
        if (!confirm("¿Validar legalidad manualmente? (Solo para correcciones)")) return;
        try {
            const logData = {
                acceptedAt: new Date().toISOString(),
                version: "v1.0-2025-MANUAL-ADMIN",
                type: "Manual Override",
                ipHash: "ADMIN_OVERRIDE"
            };
            await updateDoc(doc(db, "users", userId), { consentLog: logData });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, consentLog: logData } : u));
        } catch (e) {
            alert("Error validando");
        }
    };

    const deleteUser = async (userId: string) => {
        const confirmMsg = prompt("PELIGRO: ESTA ACCIÓN ES IRREVERSIBLE.\n\nEscriba 'BORRAR' para confirmar:");
        if (confirmMsg !== "BORRAR") return;

        try {
            setLoading(true);
            await deleteDoc(doc(db, "users", userId));
            await logAdminAction(currentUser?.email || "unknown", "DELETE_USER", userId, "Permanently deleted user");
            setUsers(prev => prev.filter(u => u.id !== userId));
            alert("Usuario eliminado correctamente.");
        } catch (error) {
            alert("Error al eliminar el usuario.");
        } finally {
            setLoading(false);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [editForm, setEditForm] = useState({ fullName: "", role: "student" });

    const openEditModal = (user: UserData) => {
        setEditingUser(user);
        setEditForm({ fullName: user.fullName || "", role: user.role || "student" });
        setIsEditModalOpen(true);
    };

    const saveEditUser = async () => {
        if (!editingUser) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, "users", editingUser.id), {
                fullName: editForm.fullName,
                role: editForm.role
            });
            await logAdminAction(currentUser?.email || "unknown", "UPDATE_USER_DETAILS", editingUser.id, `Updated name/role to ${editForm.fullName} / ${editForm.role}`);
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, fullName: editForm.fullName, role: editForm.role as any } : u));
            setIsEditModalOpen(false);
        } catch (error) {
            alert("Error al actualizar usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700" suppressHydrationWarning>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter italic uppercase">
                        <UsersIcon className="text-metal-gold" size={36} /> Directorio de Usuarios
                    </h1>
                    <p className="text-metal-silver/40 text-sm mt-1 flex items-center gap-2 font-medium">
                        <Shield className="text-metal-gold" size={14} /> Gestión de Nodos Bio-Digitales y Niveles de Suscripción
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchUsers} isLoading={loading} className="border-white/5 hover:border-white/10 px-6 font-bold uppercase tracking-widest text-[10px]">
                        Sincronizar
                    </Button>
                    <Badge variant="premium" className="px-5 py-2.5 text-[10px] font-black tracking-widest uppercase">
                        {filteredUsers.length} REGISTROS ACTIVOS
                    </Badge>
                </div>
            </header>

            {/* Filters Bar */}
            <Card variant="solid" className="p-4 bg-white/[0.02] border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver/40" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-metal-gold/50 focus:ring-1 focus:ring-metal-gold/20 outline-none transition-all"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-metal-silver focus:border-metal-gold outline-none cursor-pointer"
                        >
                            <option value="all">Cualquier Rol</option>
                            <option value="student">Estudiantes</option>
                            <option value="teacher">Docentes</option>
                            <option value="admin">Administradores</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={planFilter}
                            onChange={(e) => setPlanFilter(e.target.value as any)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-metal-silver focus:border-metal-gold outline-none cursor-pointer"
                        >
                            <option value="all">Todos los Planes</option>
                            <option value="free">Básico (Free)</option>
                            <option value="pro">Pro (Premium)</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Users Table / List */}
            <Card variant="solid" className="p-0 overflow-hidden border-white/5">
                {loading && users.length === 0 ? (
                    <div className="p-20 flex justify-center">
                        <AIProcessingLoader text="Buscando perfiles" subtext="Consultando registro civil digital..." />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="text-[10px] text-metal-silver/40 uppercase font-black tracking-widest bg-white/[0.01]">
                                        <th className="px-8 py-6 border-b border-white/5 italic">Identidad Digital</th>
                                        <th className="px-8 py-6 border-b border-white/5 italic">Nivel de Protocolo</th>
                                        <th className="px-8 py-6 border-b border-white/5 italic">Estatus de Capital</th>
                                        <th className="px-8 py-6 border-b border-white/5 text-center italic">Privacidad</th>
                                        <th className="px-8 py-6 border-b border-white/5 text-right italic">Acciones de Comando</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border transition-all duration-500 group-hover:scale-105 ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
                                                        u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-metal-gold/10 text-metal-gold border-metal-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                                        }`}>
                                                        {(u.fullName || u.displayName || u.email || "?")[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-white text-lg tracking-tighter group-hover:text-metal-gold transition-colors">{u.fullName || u.displayName || "Sin Identidad"}</span>
                                                        <span className="text-[10px] text-metal-silver/40 flex items-center gap-1.5 mt-1 font-bold uppercase tracking-widest">
                                                            <Mail size={10} className="text-metal-gold/50" /> {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <Badge
                                                        variant={u.role === 'admin' ? 'error' : u.role === 'teacher' ? 'info' : 'default'}
                                                        className="w-fit uppercase text-[9px] px-3 font-black tracking-widest border-white/5"
                                                    >
                                                        {u.role === 'admin' ? 'SISTEMA' : u.role === 'teacher' ? 'PRO-DOCENTE' : 'ACADÉMICO'}
                                                    </Badge>
                                                    {u.institution && (
                                                        <span className="text-[10px] text-metal-silver/30 flex items-center gap-1.5 font-bold italic">
                                                            <School size={10} className="text-metal-gold/20" /> {u.institution}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge
                                                    variant={u.subscription?.plan === 'pro' ? 'premium' : 'default'}
                                                    className={`flex items-center gap-2 w-fit uppercase font-black tracking-widest text-[9px] px-3 py-1.5 ${u.subscription?.plan === 'pro' ? 'animate-pulse' : ''}`}
                                                >
                                                    {u.subscription?.plan === 'pro' ? (
                                                        <><Crown size={12} className="text-metal-gold" /> ACCESO TOTAL (PRO)</>
                                                    ) : (
                                                        <><Shield size={12} className="text-metal-silver/40" /> ACCESO BÁSICO</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {u.consentLog ? (
                                                    <Tooltip title={`Certificado v${u.consentLog.version} - Firmado: ${new Date(u.consentLog.acceptedAt).toLocaleString('es-CO')}`}>
                                                        <div className="inline-flex flex-col items-center group/legal cursor-help">
                                                            <div className="p-3 bg-green-500/10 rounded-full text-green-500 mb-2 border border-green-500/20 group-hover/legal:bg-green-500/20 transition-all duration-300">
                                                                <Check size={16} strokeWidth={4} />
                                                            </div>
                                                            <span className="text-[9px] text-green-400/30 uppercase font-black tracking-widest">Legal Firmado</span>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <button
                                                        onClick={() => validateConsentManually(u.id)}
                                                        className="inline-flex flex-col items-center opacity-30 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                    >
                                                        <div className="p-3 bg-white/5 rounded-full text-metal-silver mb-2 border border-white/10">
                                                            <Shield size={16} strokeWidth={2} />
                                                        </div>
                                                        <span className="text-[9px] uppercase font-black tracking-widest">Validar</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <Button variant="ghost" size="icon" className="hover:text-blue-400 hover:bg-blue-500/10 border-transparent hover:border-blue-500/20" onClick={() => openEditModal(u)} title="Modificar Datos">
                                                        <Edit3 size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-purple-400 hover:bg-purple-500/10 border-transparent hover:border-purple-500/20" onClick={() => toggleRole(u.id, u.role)} title="Alternar Nivel Docente">
                                                        <GraduationCap size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-metal-gold hover:bg-metal-gold/10 border-transparent hover:border-metal-gold/20" onClick={() => togglePlan(u.id, u.subscription?.plan || 'free')} title="Upgrade a Pro">
                                                        <Crown size={18} />
                                                    </Button>
                                                    <div className="w-px h-6 bg-white/10 mx-1" />
                                                    {u.consentLog && (
                                                        <Button variant="ghost" size="icon" className="hover:text-white hover:bg-white/10 border-transparent hover:border-white/20" onClick={async () => {
                                                            const { pdfGenerator } = await import("@/utils/pdfGenerator");
                                                            pdfGenerator.generateConsentCertificate(u);
                                                        }} title="Consignar Certificado">
                                                            <FileText size={18} />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-red-500/10 border-transparent hover:border-red-500/20" onClick={() => deleteUser(u.id)} title="Purga Permanente">
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="max-w-xs mx-auto">
                                                    <UsersIcon size={64} className="mx-auto mb-6 opacity-5" />
                                                    <p className="text-metal-silver/40 font-black uppercase tracking-widest text-[10px]">No se detectaron registros con estos parámetros en la red.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 p-4">
                            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                <div key={u.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-metal-gold/10 text-metal-gold border-metal-gold/20'
                                                }`}>
                                                {(u.fullName || u.displayName || u.email || "?")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-base leading-tight">{u.fullName || u.displayName || "Sin Identidad"}</h3>
                                                <p className="text-[10px] text-metal-silver/40 truncate max-w-[200px]">{u.email}</p>
                                            </div>
                                        </div>
                                        {/* Status Dot */}
                                        <div className={`w-2 h-2 rounded-full ${u.subscription?.plan === 'pro' ? 'bg-metal-gold animate-pulse' : 'bg-metal-silver/20'}`} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Badge
                                            variant={u.role === 'admin' ? 'error' : u.role === 'teacher' ? 'info' : 'default'}
                                            className="justify-center uppercase text-[9px] py-2 font-black tracking-widest border-white/5"
                                        >
                                            {u.role === 'admin' ? 'SISTEMA' : u.role === 'teacher' ? 'DOCENTE' : 'ESTUDIANTE'}
                                        </Badge>
                                        <Badge
                                            variant={u.subscription?.plan === 'pro' ? 'premium' : 'default'}
                                            className="justify-center uppercase text-[9px] py-2 font-black tracking-widest border-white/5"
                                        >
                                            {u.subscription?.plan === 'pro' ? 'PRO' : 'FREE'}
                                        </Badge>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => openEditModal(u)}>
                                                <Edit3 size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-500/10 hover:text-purple-400" onClick={() => toggleRole(u.id, u.role)}>
                                                <GraduationCap size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-metal-gold/10 hover:text-metal-gold" onClick={() => togglePlan(u.id, u.subscription?.plan || 'free')}>
                                                <Crown size={14} />
                                            </Button>
                                        </div>

                                        {u.consentLog ? (
                                            <Badge variant="success" className="text-[8px] uppercase tracking-widest px-2 py-1">LEGAL OK</Badge>
                                        ) : (
                                            <button onClick={() => validateConsentManually(u.id)} className="text-[8px] text-metal-silver/40 underline uppercase tracking-widest">Validar</button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-metal-silver/30 text-xs font-bold uppercase tracking-widest">
                                    No hay registros
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <Card variant="premium" className="w-full max-w-xl p-0 overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.2)] border-white/10 metallic-card">
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.03] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-metal-gold to-transparent opacity-50"></div>
                            <h2 className="text-3xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Edit3 className="text-metal-gold" size={32} /> Override de Perfil
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/10 rounded-full w-10 h-10">
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-metal-silver/40 uppercase tracking-[0.2em]">
                                    <User size={12} className="text-metal-gold" /> Identificación del Titular
                                </label>
                                <div className="relative group">
                                    <input
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-metal-gold outline-none transition-all shadow-inner group-hover:border-white/20 font-bold text-lg"
                                        placeholder="Nombre y Apellidos"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-metal-gold/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-metal-silver/40 uppercase tracking-[0.2em]">
                                    <Shield size={12} className="text-purple-400" /> Jerarquía de Acceso
                                </label>
                                <div className="relative group">
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-metal-gold outline-none appearance-none cursor-pointer font-bold transition-all group-hover:border-white/20"
                                    >
                                        <option value="student">Estudiante Académico</option>
                                        <option value="teacher">Docente Certificado</option>
                                        <option value="admin">Administrador del Sistema (Root)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-metal-silver/40 group-hover:text-white transition-colors">
                                        <Filter size={20} />
                                    </div>
                                </div>
                                {editForm.role === 'admin' && (
                                    <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 animate-pulse">
                                        <ShieldAlert size={18} className="text-red-500 shrink-0" />
                                        <p className="text-[10px] text-red-200 leading-tight font-black uppercase tracking-wider">Warning: Acceso de Nivel Root Detectado</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex gap-5">
                                <Button variant="outline" className="flex-1 h-16 rounded-2xl border-white/5 hover:border-white/20 font-black text-xs uppercase tracking-widest" onClick={() => setIsEditModalOpen(false)}>
                                    Abortar
                                </Button>
                                <Button variant="premium" className="flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.2)]" onClick={saveEditUser} isLoading={loading}>
                                    Actualizar Nodo
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Simple Tooltip Shim since it's not in the base components
function Tooltip({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="relative group cursor-help">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block bg-black border border-white/20 px-3 py-2 rounded-xl text-[10px] text-white whitespace-nowrap z-50 shadow-2xl">
                {title}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
            </div>
        </div>
    );
}
