"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { UserConsent } from "@/utils/pdfGenerator";
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
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const { user: currentUser } = useAuth();

    const handleDeleteSelected = async () => {
        if (selectedUsers.length === 0) return;
        const confirmMsg = prompt(`¿ESTÁS SEGURO?\n\nEsta acción eliminará ${selectedUsers.length} usuarios seleccionados. Escriba "ELIMINAR" para confirmar:`);
        if (confirmMsg !== "ELIMINAR") return;

        setLoading(true);
        try {
            for (const userId of selectedUsers) {
                await deleteDoc(doc(db, "users", userId));
                await logAdminAction(currentUser?.email || "unknown", "DELETE_USER_BULK", userId, "Bulk deleted user");
            }
            toast.success(`${selectedUsers.length} usuarios eliminados.`);
            setSelectedUsers([]);
            await fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Error en la eliminación masiva.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(200));
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

    const handleProductionPurge = async () => {
        const masterAdmins = [
            process.env.NEXT_PUBLIC_MASTER_ADMIN_1,
            process.env.NEXT_PUBLIC_MASTER_ADMIN_2
        ].filter(Boolean) as string[];

        // Fallback to maintain system integrity if ENV is missing
        if (masterAdmins.length === 0) {
            console.warn("PROTOCOL 2026: No master admins defined in ENV. Using internal emergency fallback.");
            masterAdmins.push("antonio_rburgos@msn.com");
        }

        const confirmation = prompt(`ALERTA DE SEGURIDAD NIVEL 5 - SALIDA A PRODUCCIÓN\n\nEsta acción ELIMINARÁ PERMANENTEMENTE a todos los usuarios excepto a los Administradores Maestros.\n\nPara confirmar, escriba el correo electrónico principal (${masterAdmins[0]}):`);

        if (confirmation !== masterAdmins[0]) {
            toast.error("Confirmación fallida. Operación abortada.");
            return;
        }

        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "users"));
            let deletedCount = 0;

            for (const userDoc of snapshot.docs) {
                const data = userDoc.data();
                if (!masterAdmins.includes(data.email)) {
                    await deleteDoc(userDoc.ref);
                    deletedCount++;
                }
            }

            await logAdminAction(currentUser?.email || "unknown", "PRODUCTION_PURGE", "SYSTEM", `Performed production purge. Deleted ${deletedCount} users. Preserved ${masterAdmins.join(", ")}`);
            toast.success(`Purga de Producción Exitosa: ${deletedCount} usuarios eliminados. Maestros preservados.`);
            await fetchUsers();
        } catch (error: any) {
            console.error(error);
            toast.error(`Error en la purga: ${error.message}`);
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
        const userToUpdate = users.find(u => u.id === userId);
        const masterAdmins = [
            process.env.NEXT_PUBLIC_MASTER_ADMIN_1,
            process.env.NEXT_PUBLIC_MASTER_ADMIN_2
        ].filter(Boolean);

        if (userToUpdate && masterAdmins.includes(userToUpdate.email)) {
            toast.error("SEGURIDAD: No se puede cambiar el rol de un Administrador Maestro.");
            return;
        }

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
                type: "Validación Manual",
                ipHash: "ADMIN_OVERRIDE"
            };
            await updateDoc(doc(db, "users", userId), { consentLog: logData });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, consentLog: logData } : u));
        } catch (e) {
            alert("Error validando");
        }
    };

    const deleteUser = async (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        const masterAdmins = [
            process.env.NEXT_PUBLIC_MASTER_ADMIN_1,
            process.env.NEXT_PUBLIC_MASTER_ADMIN_2
        ].filter(Boolean);

        if (userToDelete && masterAdmins.includes(userToDelete.email)) {
            toast.error("PROTOCOL 2026: No se puede eliminar una cuenta de Administrador Maestro.");
            return;
        }

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
        const masterAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
            .split(",")
            .map(e => e.trim().toLowerCase());

        // Check for 2-Admin limit
        if (editForm.role === 'admin' && editingUser.role !== 'admin') {
            const currentAdmins = users.filter(u => u.role === 'admin').length;
            if (currentAdmins >= 2) {
                toast.error("PROTOCOL 2026: Límite de 2 Administradores alcanzado. No se puede promover más.");
                return;
            }
        }

        // Protect Master Admins from role change
        if (masterAdmins.includes(editingUser.email) && editForm.role !== 'admin') {
            toast.error("BLOQUEO DE SEGURIDAD: Los Administradores Maestros no pueden ser degradados.");
            return;
        }

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
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <h1 className="text-4xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <UsersIcon className="text-brand-primary" size={36} /> Directorio de Usuarios
                    </h1>
                    <p className="text-theme-text-secondary/40 text-sm mt-1 flex items-center gap-2 font-medium">
                        <Shield className="text-brand-primary" size={14} /> Gestión de Nodos Bio-Digitales y Niveles de Suscripción
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchUsers} isLoading={loading} className="border-[var(--theme-border-soft)] hover:border-[var(--theme-border-medium)] px-6 font-bold uppercase tracking-wider text-[10px]">
                        Sincronizar
                    </Button>
                    <Button
                        variant="error"
                        size="sm"
                        icon={ShieldAlert}
                        onClick={handleDeleteSelected}
                        disabled={selectedUsers.length === 0}
                        className="bg-[var(--theme-bg-error-soft)] border-[var(--theme-border-error)] text-[var(--theme-text-error)] hover:bg-[var(--theme-text-error)] hover:text-white px-6 font-semibold uppercase tracking-wider text-[10px] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpieza de Producción
                    </Button>
                    <Badge variant="primary" className="px-5 py-2.5 text-[10px] font-semibold tracking-wider uppercase">
                        {filteredUsers.length} REGISTROS ACTIVOS
                    </Badge>
                </div>
            </header>

            {/* Filters Bar */}
            <Card variant="solid" className="p-4 bg-[var(--theme-bg-surface)]/20 border-[var(--theme-border-soft)]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-secondary/40" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)] rounded-xl py-3 pl-12 pr-4 text-sm text-[var(--theme-text-primary)] focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="w-full bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-medium)] rounded-xl px-4 py-3 text-sm text-[var(--theme-text-secondary)] focus:border-brand-primary outline-none cursor-pointer"
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
                            className="w-full bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-medium)] rounded-xl px-4 py-3 text-sm text-[var(--theme-text-secondary)] focus:border-brand-primary outline-none cursor-pointer"
                        >
                            <option value="all">Todos los Planes</option>
                            <option value="free">Básico (Free)</option>
                            <option value="pro">Pro (Premium)</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Users Table / List */}
            <Card variant="solid" className="p-0 overflow-hidden border-[var(--theme-border-soft)]">
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
                                    <tr className="text-[10px] text-[var(--theme-text-tertiary)] uppercase font-semibold tracking-wider bg-[var(--theme-bg-surface)]/50">
                                        <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] italic">Identidad Digital</th>
                                        <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] italic">Nivel de Protocolo</th>
                                        <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] italic">Estatus de Capital</th>
                                        <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] text-center italic">Privacidad</th>
                                        <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] text-right italic">Acciones de Comando</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--theme-border-soft)]">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u.id} className="group hover:bg-[var(--theme-bg-surface)]/20 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-xl border transition-all duration-500 group-hover:scale-105 ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
                                                        u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                                        }`}>
                                                        {(u.fullName || u.displayName || u.email || "?")[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-[var(--theme-text-primary)] text-lg tracking-tight group-hover:text-brand-primary transition-colors">{u.fullName || u.displayName || "Sin Identidad"}</span>
                                                        <span className="text-[10px] text-theme-text-secondary/40 flex items-center gap-1.5 mt-1 font-bold uppercase tracking-wider">
                                                            <Mail size={10} className="text-brand-primary/50" /> {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <Badge
                                                        variant={u.role === 'admin' ? 'error' : u.role === 'teacher' ? 'info' : 'default'}
                                                        className="w-fit uppercase text-[9px] px-3 font-semibold tracking-wider border-[var(--theme-border-soft)]"
                                                    >
                                                        {u.role === 'admin' ? 'SISTEMA' : u.role === 'teacher' ? 'PRO-DOCENTE' : 'ACADÉMICO'}
                                                    </Badge>
                                                    {u.institution && (
                                                        <span className="text-[10px] text-theme-text-secondary/30 flex items-center gap-1.5 font-bold italic">
                                                            <School size={10} className="text-brand-primary/20" /> {u.institution}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge
                                                    variant={u.subscription?.plan === 'pro' ? 'premium' : 'default'}
                                                    className={`flex items-center gap-2 w-fit uppercase font-semibold tracking-wider text-[9px] px-3 py-1.5 border-[var(--theme-border-soft)] ${u.subscription?.plan === 'pro' ? 'animate-pulse' : ''}`}
                                                >
                                                    {u.subscription?.plan === 'pro' ? (
                                                        <><Crown size={12} className="text-brand-primary" /> ACCESO TOTAL (PRO)</>
                                                    ) : (
                                                        <><Shield size={12} className="text-theme-text-secondary/40" /> ACCESO BÁSICO</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {u.consentLog ? (
                                                    <Tooltip title={`Certificado v${u.consentLog.version} - Firmado: ${new Date(u.consentLog.acceptedAt).toLocaleString('es-CO')}`}>
                                                        <div className="inline-flex flex-col items-center group/legal cursor-help">
                                                            <div className="p-3 bg-[var(--theme-bg-success-soft)] rounded-full text-[var(--theme-text-success)] mb-2 border border-[var(--theme-border-success)] group-hover/legal:bg-[var(--theme-bg-success-soft)]/80 transition-all duration-300">
                                                                <Shield size={20} />
                                                            </div>
                                                            <span className="text-[9px] text-green-400/30 uppercase font-semibold tracking-wider">Legal Firmado</span>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <button
                                                        onClick={() => validateConsentManually(u.id)}
                                                        className="inline-flex flex-col items-center opacity-30 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                    >
                                                        <div className="p-3 bg-[var(--theme-bg-surface)]/10 rounded-full text-theme-text-secondary mb-2 border border-[var(--theme-border-soft)]">
                                                            <Shield size={16} strokeWidth={2} />
                                                        </div>
                                                        <span className="text-[9px] uppercase font-semibold tracking-wider">Validar</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <Button variant="ghost" size="icon" className="hover:text-blue-400 hover:bg-[var(--theme-bg-info-soft)] border-transparent hover:border-[var(--theme-border-info)]" onClick={() => openEditModal(u)} title="Modificar Datos">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-purple-400 hover:bg-purple-500/10 border-transparent hover:border-purple-500/20" onClick={() => toggleRole(u.id, u.role)} title="Alternar Nivel Docente">
                                                        <GraduationCap size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-brand-primary hover:bg-brand-primary/10 border-transparent hover:border-brand-primary/20" onClick={() => togglePlan(u.id, u.subscription?.plan || 'free')} title="Upgrade a Pro">
                                                        <Crown size={18} />
                                                    </Button>
                                                    <div className="w-px h-6 bg-[var(--theme-border-soft)] mx-1" />
                                                    {u.consentLog && (
                                                        <Button variant="ghost" size="icon" className="hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-surface)]/20 border-transparent hover:border-[var(--theme-border-soft)]" onClick={async () => {
                                                            const { pdfGenerator } = await import("@/utils/pdfGenerator");
                                                            pdfGenerator.generateConsentCertificate(u as UserConsent);
                                                        }} title="Consignar Certificado">
                                                            <FileText size={18} />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-[var(--theme-bg-error-soft)] border-transparent hover:border-[var(--theme-border-error)]" onClick={() => deleteUser(u.id)} title="Purga Permanente">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="max-w-xs mx-auto">
                                                    <UsersIcon size={64} className="mx-auto mb-6 opacity-5" />
                                                    <p className="text-theme-text-secondary/40 font-semibold uppercase tracking-wider text-[10px]">No se detectaron registros con estos parámetros en la red.</p>
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
                                <div key={u.id} className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg border ${u.role === 'admin' ? 'bg-[var(--theme-bg-error-soft)] text-[var(--theme-text-error)] border-[var(--theme-border-error)]' :
                                                u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                                }`}>
                                                {(u.fullName || u.displayName || u.email || "?")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[var(--theme-text-primary)] text-base leading-tight">{u.fullName || u.displayName || "Sin Identidad"}</h3>
                                                <p className="text-[10px] text-theme-text-secondary/40 truncate max-w-[200px]">{u.email}</p>
                                            </div>
                                        </div>
                                        {/* Status Dot */}
                                        <div className={`w-2 h-2 rounded-full ${u.subscription?.plan === 'pro' ? 'bg-brand-primary animate-pulse' : 'bg-theme-text-secondary/20'}`} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Badge
                                            variant={u.role === 'admin' ? 'error' : u.role === 'teacher' ? 'info' : 'default'}
                                            className="justify-center uppercase text-[9px] py-2 font-semibold tracking-wider border-[var(--theme-border-soft)]"
                                        >
                                            {u.role === 'admin' ? 'SISTEMA' : u.role === 'teacher' ? 'DOCENTE' : 'ESTUDIANTE'}
                                        </Badge>
                                        <Badge
                                            variant={u.subscription?.plan === 'pro' ? 'premium' : 'default'}
                                            className="justify-center uppercase text-[9px] py-2 font-semibold tracking-wider border-[var(--theme-border-soft)]"
                                        >
                                            {u.subscription?.plan === 'pro' ? 'PRO' : 'FREE'}
                                        </Badge>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center justify-between border-t border-[var(--theme-border-soft)] pt-4 mt-2">
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--theme-bg-surface)]/20" onClick={() => openEditModal(u)}>
                                                <Edit3 size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-500/10 hover:text-purple-400" onClick={() => toggleRole(u.id, u.role)}>
                                                <GraduationCap size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-brand-primary/10 hover:text-brand-primary" onClick={() => togglePlan(u.id, u.subscription?.plan || 'free')}>
                                                <Crown size={14} />
                                            </Button>
                                        </div>

                                        {u.consentLog ? (
                                            <Badge variant="success" className="text-[8px] uppercase tracking-wider px-2 py-1">LEGAL OK</Badge>
                                        ) : (
                                            <button onClick={() => validateConsentManually(u.id)} className="text-[8px] text-theme-text-secondary/40 underline uppercase tracking-wider">Validar</button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-theme-text-secondary/30 text-xs font-bold uppercase tracking-wider">
                                    No hay registros
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--theme-bg-base)]/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <Card variant="solid" className="w-full max-w-xl p-0 overflow-hidden shadow-[var(--theme-shadow-lg)] border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <div className="p-10 border-b border-[var(--theme-border-soft)] flex justify-between items-center bg-[var(--theme-bg-base)]/40 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
                            <h2 className="text-3xl font-black text-[var(--theme-text-primary)] flex items-center gap-4 italic uppercase tracking-tight">
                                <Edit3 className="text-brand-primary" size={32} /> Ajuste de Perfil
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="hover:bg-[var(--theme-bg-base)]/10 rounded-full w-10 h-10">
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-[0.2em]">
                                    <User size={12} className="text-brand-primary" /> Identificación del Titular
                                </label>
                                <div className="relative group">
                                    <input
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-[var(--theme-bg-base)]/60 border border-[var(--theme-border-soft)] rounded-2xl px-6 py-5 text-[var(--theme-text-primary)] focus:border-brand-primary outline-none transition-all shadow-inner group-hover:border-[var(--theme-border-medium)] font-bold text-lg"
                                        placeholder="Nombre y Apellidos"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-[0.2em]">
                                    <Shield size={12} className="text-brand-primary" /> Jerarquía de Acceso
                                </label>
                                <div className="relative group">
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                        className="w-full bg-[var(--theme-bg-base)]/60 border border-[var(--theme-border-soft)] rounded-2xl px-6 py-5 text-[var(--theme-text-primary)] focus:border-brand-primary outline-none appearance-none cursor-pointer font-bold transition-all group-hover:border-[var(--theme-border-medium)]"
                                    >
                                        <option value="student">Estudiante Académico</option>
                                        <option value="teacher">Docente Certificado</option>
                                        <option value="admin">Administrador del Sistema (Root)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-theme-text-secondary/40 group-hover:text-[var(--theme-text-primary)] transition-colors">
                                        <Filter size={20} />
                                    </div>
                                </div>
                                {editForm.role === 'admin' && (
                                    <div className="flex items-center gap-3 p-4 bg-[var(--theme-bg-error-soft)] rounded-2xl border border-[var(--theme-border-error)] animate-pulse">
                                        <ShieldAlert size={18} className="text-[var(--theme-text-error)] shrink-0" />
                                        <p className="text-[10px] text-[var(--theme-text-error)] leading-tight font-semibold uppercase tracking-wider">Aviso: Acceso de Nivel Root Detectado</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex gap-5">
                                <Button variant="outline" className="flex-1 h-16 rounded-2xl border-[var(--theme-border-soft)] hover:border-[var(--theme-border-medium)] font-semibold text-xs uppercase tracking-wider" onClick={() => setIsEditModalOpen(false)}>
                                    Abortar
                                </Button>
                                <Button variant="primary" className="flex-1 h-16 rounded-2xl font-semibold text-xs uppercase tracking-wider shadow-[var(--theme-shadow-md)] shadow-brand-primary/20" onClick={saveEditUser} isLoading={loading}>
                                    Actualizar Nodo
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}

// Simple Tooltip Shim since it's not in the base components
function Tooltip({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="relative group cursor-help">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] px-3 py-2 rounded-xl text-[10px] text-[var(--theme-text-primary)] whitespace-nowrap z-50 shadow-2xl">
                {title}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[var(--theme-bg-base)]" />
            </div>
        </div>
    );
}
