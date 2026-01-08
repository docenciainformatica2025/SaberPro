
import Link from 'next/link';
import { LayoutDashboard, DollarSign, Users, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminMobileNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/finance', icon: DollarSign, label: 'Finanzas' },
        { href: '/admin/users', icon: Users, label: 'Usuarios' },
        { href: '/admin/settings', icon: Settings, label: 'Ajustes' },
    ];

    return (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-6 duration-700">
            <nav className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl h-16 flex items-center justify-around shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 relative
                                ${isActive ? 'text-metal-gold -translate-y-2 bg-gradient-to-br from-metal-gold/20 to-transparent border-t border-white/10 shadow-lg' : 'text-metal-silver/50 hover:text-white'}
                            `}
                        >
                            <item.icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} className="transition-all" />
                            {isActive && (
                                <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-metal-gold animate-pulse"></span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}
