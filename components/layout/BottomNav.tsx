"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    BookOpen,
    Bot,
    BarChart2,
    User,
    Bell
} from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    const NAV_ITEMS = [
        { label: 'Inicio', path: '/dashboard', icon: Home },
        { label: 'Cursos', path: '/library', icon: BookOpen },
        { label: 'Mentor', path: '/mentor', icon: Bot, isSpecial: true },
        { label: 'Progreso', path: '/achievements', icon: BarChart2 },
        { label: 'Perfil', path: '/evolution', icon: User },
    ];

    // Check if we are in notifications, to maybe highlight something or just show standard
    // Actually, users might want to go to Notifications from here?
    // The previous design in Notifications page had "Alertas" as a middle tab.
    // If we are in /notifications, maybe we should swap Mentor for Alertas?
    // Or just make it a 5th tab?
    // Let's stick to the 5 standard tabs for now. If pathname is /notifications, none will be active unless we map it.

    return (
        <div className="fixed bottom-0 inset-x-0 bg-[var(--theme-bg-base)]/80 backdrop-blur-3xl border-t border-[var(--theme-border-soft)] py-3 px-6 flex justify-between items-center z-50 rounded-t-[2rem] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 group ${active ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                    >
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-brand-primary/10' : 'group-hover:bg-[var(--theme-bg-surface)]'}`}>
                            <Icon
                                size={20}
                                className={`${active ? 'text-brand-primary' : 'text-[var(--theme-text-quaternary)]'}`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest ${active ? 'font-black text-brand-primary' : 'font-bold text-[var(--theme-text-quaternary)]'}`}>
                            {item.label}
                        </span>
                        {active && (
                            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_var(--brand-primary)]" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
