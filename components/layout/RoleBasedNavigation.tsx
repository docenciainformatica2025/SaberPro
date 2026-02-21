"use client";

import { useState, memo, useMemo } from "react";
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
    DollarSign,
    Menu,
    TrendingUp
} from "lucide-react";
import StreakCounter from "@/components/gamification/StreakCounter";
import LevelBadge from "@/components/gamification/LevelBadge";
import GlobalExitModal from "@/components/auth/GlobalExitModal";
import { Logo } from "@/components/ui/Logo";

export const RoleBasedNavigation = memo(() => {
    const { user, profile, role, logout, loading, activeActivity } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'logout' | 'navigation'; target?: string }>({
        isOpen: false,
        type: 'logout'
    });

    // 2. Define Menus per Role (Memoized MUST be before early returns)
    const teacherItems = useMemo(() => [
        { name: "Panel", href: "/teacher", icon: LayoutDashboard },
        { name: "Clases", href: "/teacher/classes", icon: Users },
        { name: "Tareas", href: "/teacher/assignments", icon: BookOpen },
        { name: "IA", href: "/teacher/generator", icon: Brain },
        { name: "Entrenar", href: "/training", icon: Sparkles },
        { name: "Simulacros", href: "/simulation", icon: Timer },
        { name: "Analíticas", href: "/teacher/analytics", icon: BarChart3 },
        { name: "Facturación", href: "/dashboard/billing", icon: CreditCard },
    ], []);

    const adminItems = useMemo(() => [
        { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Finanzas", href: "/admin/finance", icon: DollarSign },
        { name: "Usuarios", href: "/admin/users", icon: Users },
        { name: "Preguntas", href: "/admin/questions", icon: FileText },
        { name: "Analíticas", href: "/admin/analytics", icon: BarChart3 },
        { name: "Carga", href: "/admin/seed", icon: Database },
        { name: "Sistema", href: "/admin/system", icon: ShieldAlert },
    ], []);

    const studentItems = useMemo(() => [
        { name: "Inicio", href: "/dashboard", icon: Home },
        { name: "Entrenar", href: "/training", icon: Sparkles },
        { name: "Biblioteca", href: "/library", icon: BookOpen },
        { name: "Simulacros", href: "/simulation", icon: Timer },
        { name: "Analíticas", href: "/analytics", icon: BarChart3 },
        { name: "Evolución", href: "/profile/evolution", icon: TrendingUp },
        { name: "Ranking", href: "/leaderboard", icon: Trophy },
        { name: "Planificador", href: "/planner", icon: Calendar },
        { name: "Suscripción", href: "/dashboard/billing", icon: CreditCard },
    ], []);

    const branding = useMemo(() => {
        if (role === 'teacher') {
            return {
                navItems: teacherItems,
                brandSubtext: "Docente",
                brandIcon: (
                    <div className="p-1.5 bg-brand-primary/10 rounded-lg shadow-sm">
                        <GraduationCap className="text-brand-primary" size={18} strokeWidth={2.5} />
                    </div>
                )
            };
        } else if (role === 'admin' || (user?.email && (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").includes(user.email))) {
            return {
                navItems: adminItems,
                brandSubtext: "Administrador",
                brandIcon: (
                    <div className="p-1.5 bg-brand-primary/10 rounded-lg shadow-sm">
                        <ShieldAlert className="text-brand-primary" size={18} strokeWidth={2.5} />
                    </div>
                )
            };
        } else {
            return {
                navItems: studentItems,
                brandSubtext: "Estudiante",
                brandIcon: (
                    <div className="p-1.5 bg-brand-primary/10 rounded-lg shadow-sm">
                        <User className="text-brand-primary" size={18} strokeWidth={2.5} />
                    </div>
                )
            };
        }
    }, [role, user?.email, teacherItems, adminItems, studentItems]);

    // 1. Hide on public pages or authenticating (After hooks declaration)
    if (loading) return null;
    if (!user) return null;
    if (pathname === '/onboarding') return null;

    // Settings Link Logic (Standardized)
    const settingsHref = role === 'teacher' ? "/teacher/settings" : role === 'admin' ? "/admin/settings" : "/profile";

    const handleProtectedNavigation = (href: string, isLogout = false) => {
        // Bypass activity check for Admins
        if (role === 'admin') {
            if (isLogout) {
                setModalState({ isOpen: true, type: 'logout' });
            } else {
                router.push(href);
            }
            return;
        }

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
            {/* 1. Top Floating Status Bar - Scaled responsively */}
            <header className="fixed top-2 left-2 right-2 md:top-6 md:left-6 md:right-6 z-50 flex items-center justify-between pointer-events-none">
                {/* Brand Pill */}
                <div
                    onClick={() => {
                        if (role === 'admin' && pathname.startsWith('/admin')) {
                            window.dispatchEvent(new CustomEvent('saberpro:toggle-admin-sidebar'));
                        } else {
                            handleProtectedNavigation('/dashboard');
                        }
                    }}
                    className="flex items-center gap-2 md:gap-4 pointer-events-auto bg-surface-card/90 backdrop-blur-2xl border border-theme-border-soft px-2.5 py-1.5 md:px-6 md:py-3 rounded-full shadow-xl animate-in fade-in slide-in-from-top-4 duration-700 cursor-pointer hover:border-brand-primary/30 transition-all"
                >
                    <div className="flex items-center gap-3">
                        {branding.brandIcon}
                        {role === 'admin' && pathname.startsWith('/admin') && (
                            <div className="lg:hidden p-1 bg-brand-error/10 rounded-lg animate-in fade-in zoom-in duration-300">
                                <Menu className="text-brand-error" size={14} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm md:text-base tracking-tight leading-none text-theme-text-primary">SaberPro</h1>
                        <p className={`text-[8px] md:text-[10px] font-bold tracking-wider uppercase leading-none mt-0.5 ${role === 'admin' ? 'text-brand-error' : 'text-brand-primary'}`}>
                            {branding.brandSubtext}
                        </p>
                    </div>
                </div>

                {/* Gamification Status */}
                <div className="hidden md:flex items-center gap-3 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-700 delay-75">
                    <LevelBadge />
                    <StreakCounter />
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 md:gap-4 pointer-events-auto bg-surface-card/90 backdrop-blur-2xl border border-theme-border-soft pl-2.5 md:pl-6 pr-1.5 py-1.5 md:py-3 rounded-full shadow-xl animate-in fade-in slide-in-from-top-4 duration-700 delay-100 group hover:border-brand-primary/10 transition-all">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-theme-text-primary leading-none">
                            {profile?.fullName || user?.displayName || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-theme-text-tertiary font-mono mt-0.5">{role?.toUpperCase() || "ESTUDIANTE"}</p>
                    </div>
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary flex items-center justify-center text-[10px] md:text-sm font-bold shadow-sm">
                        {(profile?.fullName || user?.displayName || user?.email)?.[0].toUpperCase()}
                    </div>
                    <button
                        onClick={() => handleProtectedNavigation('/', true)}
                        className="p-1.5 md:p-2.5 rounded-full hover:bg-brand-error/10 text-theme-text-tertiary hover:text-brand-error transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={14} className="md:w-5 md:h-5" />
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
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-end gap-3 px-6 py-4 bg-surface-card/80 backdrop-blur-3xl border border-theme-border-soft rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all hover:scale-[1.01] max-w-[90vw] overflow-x-auto no-scrollbar touch-pan-x">
                {branding.navItems.map((item) => {
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
                                    ? `bg-brand-primary text-white -translate-y-4 shadow-xl shadow-brand-primary/30 scale-110 mx-2`
                                    : `text-theme-text-tertiary hover:text-brand-primary hover:bg-brand-primary/5 hover:-translate-y-2 hover:scale-110`
                                }
                            `}
                        >
                            {/* Tooltip - Larger & Higher */}
                            <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[var(--theme-border-soft)] shadow-xl translate-y-2 group-hover:translate-y-0">
                                {item.name}
                            </span>

                            <Icon size={isActive ? 28 : 26} strokeWidth={isActive ? 2.5 : 2} />

                            {/* Active Dot */}
                            {isActive && (
                                <span className={`absolute -bottom-2.5 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${role === 'admin' ? 'bg-brand-error' : 'bg-[var(--theme-text-primary)]'}`}></span>
                            )}
                        </button>
                    );
                })}

                <div className="w-px h-10 bg-[var(--theme-border-soft)] mx-3 self-center" />

                <button
                    onClick={() => handleProtectedNavigation(settingsHref)}
                    className={`group relative p-4 rounded-3xl transition-all duration-300 hover:bg-brand-primary/5 hover:-translate-y-2 text-theme-text-tertiary hover:text-brand-primary ${pathname === settingsHref ? 'text-brand-primary' : ''}`}
                >
                    <Settings size={26} />
                    <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-surface-card text-theme-text-primary text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-theme-border-soft shadow-xl translate-y-2 group-hover:translate-y-0">
                        Configuración
                    </span>
                </button>
            </nav>
        </>
    );
});

RoleBasedNavigation.displayName = "RoleBasedNavigation";

export default RoleBasedNavigation;
