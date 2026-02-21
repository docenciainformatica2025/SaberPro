"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Sparkles,
    Timer,
    BarChart3,
    Trophy,
    Home,
    Users,
    BookOpen,
    Brain
} from "lucide-react";
import { useState } from "react";
import GlobalExitModal from "@/components/auth/GlobalExitModal";
import { useRouter } from "next/navigation";

/**
 * Mobile Tab Bar - Bottom Navigation (Thumb Zone Optimized)
 * Follows iOS/Android patterns for mobile-first UX
 * Touch targets: 48x48px minimum (WCAG 2.2 + Apple HIG)
 */
export default function MobileTabBar() {
    const { user, role, loading, activeActivity, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'logout' | 'navigation'; target?: string }>({
        isOpen: false,
        type: 'logout'
    });

    // Hide on desktop, public pages, or auth states
    if (loading || !user) return null;
    if (pathname === '/onboarding' || pathname === '/') return null;

    // Define navigation per role (max 5 items for mobile thumb reach)
    const getNavItems = () => {
        if (role === 'teacher') {
            return [
                { name: "Panel", href: "/teacher", icon: LayoutDashboard },
                { name: "Clases", href: "/teacher/classes", icon: Users },
                { name: "IA", href: "/teacher/generator", icon: Brain },
                { name: "Simulacro", href: "/simulation", icon: Timer },
                { name: "Analíticas", href: "/teacher/analytics", icon: BarChart3 },
            ];
        }

        if (role === 'admin') {
            return [
                { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
                { name: "Usuarios", href: "/admin/users", icon: Users },
                { name: "Analíticas", href: "/admin/analytics", icon: BarChart3 },
                { name: "Sistema", href: "/admin/system", icon: Trophy },
            ];
        }

        // Student (default)
        return [
            { name: "Inicio", href: "/dashboard", icon: Home },
            { name: "Entrenar", href: "/training", icon: Sparkles },
            { name: "Simulacro", href: "/simulation", icon: Timer },
            { name: "Analíticas", href: "/analytics", icon: BarChart3 },
            { name: "Ranking", href: "/leaderboard", icon: Trophy },
        ];
    };

    const navItems = getNavItems();

    const handleProtectedNavigation = (href: string) => {
        if (activeActivity) {
            setModalState({
                isOpen: true,
                type: 'navigation',
                target: href
            });
            return;
        }
        router.push(href);
    };

    const confirmExit = async () => {
        const target = modalState.target;
        setModalState({ ...modalState, isOpen: false });
        if (target) router.push(target);
    };

    return (
        <>
            {/* Fixed Bottom Tab Bar (Mobile Only) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--theme-bg-overlay)] backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-colors">
                <div className="flex justify-around items-center h-14 px-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.href}
                                onClick={() => handleProtectedNavigation(item.href)}
                                className={`
                                    flex flex-col items-center justify-center gap-0.5
                                    min-w-[48px] h-full px-2
                                    transition-all duration-300 ease-out
                                    active:scale-90 touch-manipulation
                                    ${isActive
                                        ? 'text-brand-primary'
                                        : 'text-[var(--theme-text-tertiary)] opacity-60'
                                    }
                                `}
                                aria-label={item.name}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.5)]' : ''}`}
                                />
                                <span className="text-[8px] font-black uppercase tracking-[0.1em] leading-none">
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <GlobalExitModal
                    isOpen={modalState.isOpen}
                    type={modalState.type}
                    isActiveActivity={!!activeActivity}
                    onCancel={() => setModalState({ ...modalState, isOpen: false })}
                    onConfirm={confirmExit}
                />

                {/* Safe Area Inset for iOS Notch */}
                <div className="h-[env(safe-area-inset-bottom)] bg-[var(--theme-bg-surface)]" />
            </nav>
        </>
    );
}
