"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Database,
    LogOut,
    ShieldAlert,
    BarChart3,
    Activity,
    DollarSign
} from "lucide-react";
// import { cn } from "@/lib/utils";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navGroups = [
        {
            title: "General",
            items: [
                { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { href: "/admin/analytics", icon: BarChart3, label: "Analíticas Globales" }
            ]
        },
        {
            title: "Gestión",
            items: [
                { href: "/admin/users", icon: Users, label: "Usuarios & Roles" },
                { href: "/admin/finance", icon: DollarSign, label: "Finanzas" },
                { href: "/admin/questions", icon: FileText, label: "Banco de Preguntas" },
                { href: "/admin/seed", icon: Database, label: "Carga de Datos" }
            ]
        },
        {
            title: "Sistema",
            items: [
                { href: "/admin/audit", icon: ShieldAlert, label: "Auditoría de Acciones" },
                { href: "/admin/settings", icon: Settings, label: "Configuración" },
                { href: "/admin/system", icon: Activity, label: "Estado del Sistema" }
            ]
        }
    ];

    return (
        <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen sticky top-0">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 text-metal-gold animate-in fade-in duration-500">
                    <div className="p-2 bg-metal-gold/10 rounded-lg">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wider text-white">COMMAND</h1>
                        <p className="text-[10px] text-metal-silver uppercase tracking-[0.2em]">Center</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                {navGroups.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="text-[10px] uppercase tracking-widest text-[#404040] font-bold mb-3 pl-3">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                            ${isActive
                                                ? "bg-metal-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                                : "text-metal-silver hover:bg-white/5 hover:text-white"
                                            }
                                        `}
                                    >
                                        <item.icon size={18} className={`${isActive ? "text-black" : "text-metal-silver group-hover:text-white"} transition-colors`} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-metal-silver hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-lg transition-all group"
                >
                    <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-medium">Salir a la App</span>
                </Link>
            </div>
        </aside>
    );
}
