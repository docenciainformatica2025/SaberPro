"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/diagnostic',
    '/pricing',
    '/legal',
    '/credits',
    '/methodology',
    '/forgot-password',
    '/update-password',
];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, role, loading, isSuperAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        const isPublicRoute = PUBLIC_ROUTES.some(route =>
            pathname === route || pathname.startsWith(`${route}/`)
        );

        // 1. Unauthenticated users on private routes -> Redirect to login
        if (!user && !isPublicRoute) {
            router.replace('/login');
            setIsAuthorized(false);
            return;
        }

        // 2. Authenticated users (excluding Super Admins) check for role
        if (user && !isSuperAdmin) {
            const isExcludedFromOnboarding = pathname === '/onboarding' || pathname.startsWith('/diagnostic');

            // Missing role -> Force Onboarding
            if (!role && !isExcludedFromOnboarding) {
                router.replace('/onboarding');
                setIsAuthorized(false);
                return;
            }

            // Already has role but trying to go to onboarding -> Move to dashboard
            if (role && pathname === '/onboarding') {
                const home = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';
                router.replace(home);
                setIsAuthorized(false);
                return;
            }
        }

        // 3. Authenticated users trying to access login/register -> Redirect home
        if (user && (pathname === '/login' || pathname === '/register')) {
            const home = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin/dashboard' : '/dashboard';
            router.replace(home);
            setIsAuthorized(false);
            return;
        }

        setIsAuthorized(true);
    }, [user, role, loading, pathname, router, isSuperAdmin]);

    // Show nothing (blank or loader) while redirecting or checking
    if (loading || (!isAuthorized && !PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`)))) {
        return (
            <div className="min-h-screen bg-theme-bg-base flex items-center justify-center" suppressHydrationWarning>
                <div className="animate-pulse flex flex-col items-center gap-4" suppressHydrationWarning>
                    <div className="w-12 h-12 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" suppressHydrationWarning />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-theme-text-tertiary">
                        Verificando Acceso...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
