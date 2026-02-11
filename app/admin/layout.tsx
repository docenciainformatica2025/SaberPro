"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Users, Settings, LogOut, ShieldAlert, Database, Menu, X } from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import AdminSidebar from "./components/AdminSidebar";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        async function checkRole() {
            if (loading) return;

            if (!user) {
                router.replace("/");
                return;
            }

            try {
                // Check if user has admin privileges (Case Insensitive)
                const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
                    .split(",")
                    .map(e => e.trim().toLowerCase());

                const userEmail = (user.email || "").toLowerCase();

                if (allowedEmails.includes(userEmail)) {
                    setIsCheckingRole(false);
                } else {
                    // Unauthorized
                    console.warn(`Unauthorized admin access attempt: ${user.email}`);
                    router.replace("/dashboard"); // Use replace to avoid history stack issues
                }

            } catch (error) {
                console.error("Error checking admin role:", error);
                router.replace("/dashboard");
            }
        }

        checkRole();
    }, [user, loading, router]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleToggleSidebar = () => setIsMobileMenuOpen(prev => !prev);
        window.addEventListener('saberpro:toggle-admin-sidebar', handleToggleSidebar);
        return () => window.removeEventListener('saberpro:toggle-admin-sidebar', handleToggleSidebar);
    }, []);

    if (loading || isCheckingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg-base)]">
                <AIProcessingLoader text="Verificando Privilegios" subtext="Acceso de Administrador" />
            </div>
        );
    }

    if (!user) return null; // Will redirect via useEffect

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary/30 transition-colors duration-500">
            {/* Background Ambient Effects - Red/Dark for Admin */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/[0.03] dark:bg-red-900/5 rounded-full blur-[120px] mix-blend-screen transition-opacity duration-1000" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-primary/[0.03] dark:bg-brand-primary/5 rounded-full blur-[120px] mix-blend-screen transition-opacity duration-1000" />
            </div>

            <div className="flex relative z-10 transition-all duration-300">
                <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

                {/* Main Content Area - Full Screen Canvas */}
                <div className="flex-1 w-full max-w-[1800px] mx-auto p-4 pb-32 lg:p-8 lg:pb-8">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        {children}
                    </div>
                </div>
            </div>


        </div>
    );
}
