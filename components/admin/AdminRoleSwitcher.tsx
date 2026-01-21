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
        { id: 'admin', label: 'Admin', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10', path: '/admin' },
        { id: 'teacher', label: 'Docente', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/teacher' },
        { id: 'student', label: 'Estudiante', icon: User, color: 'text-metal-gold', bg: 'bg-metal-gold/10', path: '/dashboard' }
    ];

    const currentActiveRole = impersonatedRole || role;

    const handleSwitch = (roleId: 'admin' | 'student' | 'teacher', path: string) => {
        switchRole(roleId === 'admin' ? null : roleId);
        router.push(path);
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-10 duration-700">
            {isMinimized ? (
                <button
                    onClick={() => setIsMinimized(false)}
                    className="p-3 bg-black/80 backdrop-blur-xl border border-metal-gold/30 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.2)] text-metal-gold hover:scale-110 transition-all group"
                >
                    <Zap size={20} className="group-hover:animate-pulse" />
                </button>
            ) : (
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                    <div className="px-4 py-2 border-r border-white/10 hidden md:block">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-metal-gold animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-metal-gold">God Mode</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {roles.map((r) => {
                            const isActive = currentActiveRole === r.id;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => handleSwitch(r.id as 'admin' | 'student' | 'teacher', r.path)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                        ? `${r.bg} ${r.color} ring-1 ring-white/10 shadow-lg`
                                        : 'text-metal-silver/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <r.icon size={14} />
                                    <span className="hidden sm:inline">{r.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 text-metal-silver/20 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
