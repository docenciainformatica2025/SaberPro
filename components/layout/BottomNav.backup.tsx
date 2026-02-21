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
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 py-3 px-6 flex justify-between items-center z-50 rounded-t-2xl pb-safe">
            {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center gap-1 transition-colors group ${active ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Icon
                            size={22}
                            className={`${active ? 'text-orange-500 fill-orange-500/10' : 'group-hover:text-slate-600'}`}
                            strokeWidth={active ? 2.5 : 2}
                        />
                        <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
