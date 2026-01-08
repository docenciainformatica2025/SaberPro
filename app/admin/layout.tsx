"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Users, Settings, LogOut, ShieldAlert, Database, Menu, X } from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import AdminSidebar from "./components/AdminSidebar";
import AdminMobileNav from "./components/AdminMobileNav";

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

    if (loading || isCheckingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-metal-dark">
                <AIProcessingLoader text="Verificando Privilegios" subtext="Acceso de Administrador" />
            </div>
        );
    }

    if (!user) return null; // Will redirect via useEffect

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-metal-gold/30">
            {/* Background Ambient Effects - Red/Dark for Admin */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-metal-gold/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/5 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-metal-gold">
                    <ShieldAlert size={20} />
                    <span className="font-bold tracking-wider text-white">COMMAND</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-metal-silver hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex relative z-10 pt-16 lg:pt-0">
                <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

                {/* Main Content Area - Full Screen Canvas */}
                <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 lg:p-8">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        {children}
                    </div>
                </main>
            </div>

            <AdminMobileNav />
        </div>
    );
}
