"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    GraduationCap,
    Sparkles,
    Timer,
    CreditCard,
    Brain,
    ShieldAlert,
    Database,
    FileText,
    Home,
    User,
    Trophy,
    Calendar,
    DollarSign
} from "lucide-react";
import StreakCounter from "@/components/gamification/StreakCounter";
import GlobalExitModal from "@/components/auth/GlobalExitModal";
import { Logo } from "@/components/ui/Logo";

export default function RoleBasedNavigation() {
    const { user, profile, role, logout, loading, activeActivity } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'logout' | 'navigation'; target?: string }>({
        isOpen: false,
        type: 'logout'
    });

    // 1. Hide on public pages or authenticating
    if (loading) return null;
    if (!user) return null;
    if (pathname === '/onboarding') return null;

    // Hide on specific landing/login routes if needed, 
    // but AuthProvider usually handles protection. 
    // We definitely don't want this on "/" (Landing) if the user happens to be logged in but viewing landing? 
    // Usually logged in users redirect to dashboard.
    // Let's assume standard behavior.

    // 2. Define Menus per Role
    const teacherItems = [
        { name: "Panel", href: "/teacher", icon: LayoutDashboard },
        { name: "Clases", href: "/teacher/classes", icon: Users },
        { name: "Tareas", href: "/teacher/assignments", icon: BookOpen },
        { name: "IA", href: "/teacher/generator", icon: Brain },
        { name: "Entrenar", href: "/training", icon: Sparkles },
        { name: "Simulacros", href: "/simulation", icon: Timer },
        { name: "Analíticas", href: "/teacher/analytics", icon: BarChart3 },
        { name: "Facturación", href: "/dashboard/billing", icon: CreditCard },
        // Settings is handled separately
    ];

    const adminItems = [
        { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Finanzas", href: "/admin/finance", icon: DollarSign },
        { name: "Usuarios", href: "/admin/users", icon: Users },
        { name: "Preguntas", href: "/admin/questions", icon: Database },
        { name: "Analíticas", href: "/admin/analytics", icon: FileText },
        { name: "Sistema", href: "/admin/system", icon: ShieldAlert },
    ];

    const studentItems = [
        { name: "Inicio", href: "/dashboard", icon: Home },
        { name: "Entrenar", href: "/training", icon: Sparkles },
        { name: "Simulacros", href: "/simulation", icon: Timer },
        { name: "Analíticas", href: "/analytics", icon: BarChart3 },
        { name: "Ranking", href: "/leaderboard", icon: Trophy },
        { name: "Planificador", href: "/planner", icon: Calendar },
        { name: "Suscripción", href: "/dashboard/billing", icon: CreditCard },
    ];

    let navItems = [];
    let brandSubtext = "Estudiante";
    let brandIcon = <GraduationCap size={18} strokeWidth={2.5} className="text-black" />;

    // Theme Configuration
    if (role === 'teacher') {
        navItems = teacherItems;
        brandSubtext = "Docente";
        brandIcon = (
            <div className="p-1.5 bg-gradient-to-br from-metal-gold to-yellow-600 rounded-lg shadow-lg shadow-metal-gold/20">
                <GraduationCap className="text-black" size={18} strokeWidth={2.5} />
            </div>
        );
    } else if (role === 'admin' || (user.email && (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").includes(user.email))) {
        // Fallback for role='admin' or explicit email check if context not fully updated
        navItems = adminItems;
        brandSubtext = "Admin Isotope";
        brandIcon = (
            <div className="p-1.5 bg-gradient-to-br from-red-600 to-red-900 rounded-lg shadow-lg shadow-red-500/20">
                <ShieldAlert className="text-white" size={18} strokeWidth={2.5} />
            </div>
        );
    } else {
        // Default Student
        navItems = studentItems;
        brandSubtext = "Estudiante";
        brandIcon = (
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg shadow-blue-500/20">
                <User className="text-white" size={18} strokeWidth={2.5} />
            </div>
        );
    }

    // Settings Link Logic (Standardized)
    const settingsHref = role === 'teacher' ? "/teacher/settings" : role === 'admin' ? "/admin/settings" : "/profile";

    const handleProtectedNavigation = (href: string, isLogout = false) => {
        if (activeActivity || isLogout) {
            setModalState({
                isOpen: true,
                type: isLogout ? 'logout' : 'navigation',
                target: href
            });
            return;
        }
        router.push(href);
    };

    const confirmExit = async () => {
        const type = modalState.type;
        const target = modalState.target;
        setModalState({ ...modalState, isOpen: false });

        if (type === 'logout') {
            await logout();
            // Logout redirects to home automatically in AuthContext
        } else if (target) {
            router.push(target);
        }
    };

    return (
        <>
            {/* 1. Top Floating Status Bar - Scaled Up */}
            <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
                {/* Brand Pill */}
                <div
                    onClick={() => handleProtectedNavigation('/')}
                    className="flex items-center gap-4 pointer-events-auto bg-[#111]/90 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 cursor-pointer hover:border-metal-gold/30 transition-all"
                >
                    {brandIcon}
                    <div>
                        <h1 className="font-bold text-base tracking-tight leading-none text-white">SaberPro</h1>
                        <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${role === 'admin' ? 'text-red-500' : role === 'teacher' ? 'text-metal-gold' : 'text-blue-400'}`}>
                            {brandSubtext}
                        </p>
                    </div>
                </div>

                {/* Gamification Status */}
                <div className="hidden md:block pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-700 delay-75">
                    <StreakCounter />
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-4 pointer-events-auto bg-[#111]/90 backdrop-blur-2xl border border-white/10 pl-6 pr-3 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 delay-100 group hover:border-white/20 transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none">
                            {profile?.fullName || user?.displayName || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-metal-silver font-mono mt-0.5">{role?.toUpperCase() || "ESTUDIANTE"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {(profile?.fullName || user?.displayName || user?.email)?.[0].toUpperCase()}
                    </div>
                    <button
                        onClick={() => handleProtectedNavigation('/', true)}
                        className="p-2.5 rounded-full hover:bg-red-500/20 text-metal-silver hover:text-red-400 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <GlobalExitModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                isActiveActivity={!!activeActivity}
                onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmExit}
            />

            {/* 2. The "World Class" Floating Dock - Scaled Up */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 px-6 py-4 bg-[#111]/90 backdrop-blur-3xl [-webkit-backdrop-filter:blur(64px)] border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-t-white/20 transition-all hover:scale-[1.01] hover:bg-[#151515] max-w-[90vw] overflow-x-auto no-scrollbar touch-pan-x">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    let isActive = pathname === item.href;
                    if (item.href !== '/dashboard' && pathname?.startsWith(item.href)) {
                        isActive = true;
                    }
                    if (item.href === '/dashboard' && pathname === '/dashboard') {
                        isActive = true;
                    }

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleProtectedNavigation(item.href)}
                            className={`group relative flex items-center justify-center p-4 rounded-3xl transition-all duration-300 ease-out 
                                ${isActive
                                    ? `bg-white text-black -translate-y-4 shadow-[0_20px_30px_-10px_rgba(255,255,255,0.3)] scale-110 mx-2`
                                    : `text-metal-silver hover:text-white hover:bg-white/10 hover:-translate-y-2 hover:scale-110`
                                }
                            `}
                        >
                            {/* Tooltip - Larger & Higher */}
                            <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl translate-y-2 group-hover:translate-y-0">
                                {item.name}
                            </span>

                            <Icon size={isActive ? 28 : 26} strokeWidth={isActive ? 2.5 : 2} />

                            {/* Active Dot */}
                            {isActive && (
                                <span className={`absolute -bottom-2.5 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${role === 'admin' ? 'bg-red-500' : role === 'teacher' ? 'bg-metal-gold' : 'bg-blue-500'}`}></span>
                            )}
                        </button>
                    );
                })}

                <div className="w-px h-10 bg-white/10 mx-3 self-center" />

                <button
                    onClick={() => handleProtectedNavigation(settingsHref)}
                    className={`group relative p-4 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 text-metal-silver hover:text-white ${pathname === settingsHref ? 'text-white' : ''}`}
                >
                    <Settings size={26} />
                    <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl translate-y-2 group-hover:translate-y-0">
                        Configuración
                    </span>
                </button>
            </nav>
        </>
    );
}
