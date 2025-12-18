"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Sparkles,
    Timer,
    CreditCard,
    Brain
} from "lucide-react";

import ProFooter from "@/components/ui/ProFooter";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const { user, role, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // ...

    // Verify Auth Logic - Hooks must run before any return
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (role !== 'teacher') {
                router.push('/dashboard');
            }
        }
    }, [user, role, loading, router]);

    // Show loader while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-metal-dark flex items-center justify-center">
                <AIProcessingLoader text="Verificando Credenciales" />
            </div>
        );
    }

    if (!user || role !== 'teacher') {
        return (
            <div className="min-h-screen bg-metal-dark flex items-center justify-center">
                <AIProcessingLoader text="Redirigiendo..." />
            </div>
        );
    }

    const navItems = [
        { name: "Panel Principal", href: "/teacher", icon: LayoutDashboard },
        { name: "Mis Clases", href: "/teacher/classes", icon: Users },
        { name: "Asignar Tareas", href: "/teacher/assignments", icon: BookOpen },
        { name: "Generador IA", href: "/teacher/generator", icon: Brain },
        { name: "Entrenamiento IA", href: "/training", icon: Sparkles },
        { name: "Simulacros", href: "/simulation", icon: Timer },
        { name: "Analíticas", href: "/teacher/analytics", icon: BarChart3 },
        { name: "Facturación", href: "/dashboard/billing", icon: CreditCard },
        { name: "Configuración", href: "/teacher/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-metal-gold/30 overflow-x-hidden">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Main Content Area - Full Screen Canvas */}
            <main className="relative z-10 w-[95%] max-w-[1800px] mx-auto">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    {children}
                </div>
            </main>
        </div>
    );
}
