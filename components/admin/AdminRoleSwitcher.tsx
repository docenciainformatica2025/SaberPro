"use client";

import { useAuth } from "@/context/AuthContext";
import { Shield, User, GraduationCap, Zap, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoleSwitcher() {
    const { isSuperAdmin, impersonatedRole, switchRole, role } = useAuth();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Only show if Super Admin
    if (!isSuperAdmin) return null;

    const roles = [
        { id: 'admin', label: 'Admin', icon: Shield, color: 'text-brand-primary', bg: 'bg-brand-primary/10', path: '/admin/dashboard' },
        { id: 'teacher', label: 'Docente', icon: GraduationCap, color: 'text-[var(--theme-text-primary)]', bg: 'bg-[var(--theme-text-primary)]/5', path: '/teacher' },
        { id: 'student', label: 'Estudiante', icon: User, color: 'text-[var(--theme-text-primary)]', bg: 'bg-[var(--theme-text-primary)]/5', path: '/dashboard' }
    ];

    const currentActiveRole = impersonatedRole || role;

    const handleSwitch = (roleId: 'admin' | 'student' | 'teacher', path: string) => {
        switchRole(roleId === 'admin' ? null : roleId);
        router.push(path);
    };

    return (
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[99999] animate-in slide-in-from-bottom-10 duration-700">
            {isMinimized ? (
                <button
                    onClick={() => setIsMinimized(false)}
                    className="p-4 bg-[var(--theme-bg-overlay)] backdrop-blur-3xl border border-brand-primary/30 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.2)] text-brand-primary hover:scale-110 transition-all group"
                >
                    <Zap size={24} className="group-hover:animate-pulse" />
                </button>
            ) : (
                <div className="bg-[var(--theme-bg-overlay)] backdrop-blur-3xl border border-[var(--theme-border-soft)] rounded-2xl p-2.5 flex items-center gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-all">
                    <div className="px-5 py-2 border-r border-[var(--theme-border-soft)] hidden md:block">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-brand-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">GOD MODE</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {roles.map((r) => {
                            const isActive = currentActiveRole === r.id;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => handleSwitch(r.id as 'admin' | 'student' | 'teacher', r.path)}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isActive
                                        ? `${r.bg} ${r.color} ring-1 ring-brand-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]`
                                        : 'text-[var(--theme-text-secondary)]/50 hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-text-primary)]/10'
                                        }`}
                                >
                                    <r.icon size={16} />
                                    <span className="hidden sm:inline">{r.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-px h-8 bg-[var(--theme-border-soft)] mx-2" />

                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2.5 text-[var(--theme-text-quaternary)] hover:text-brand-primary transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
