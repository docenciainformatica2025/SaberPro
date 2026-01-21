"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { user, role, loading, isSuperAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && user) {
            // If user has no role and is NOT on onboarding, send them there
            // Exception: Super Admin should NOT be sent to onboarding as they go direct to /admin/dashboard
            if (!role && !isSuperAdmin && pathname !== '/onboarding') {
                router.replace('/onboarding');
            }
            // If user HAS role and IS on onboarding, send them away (prevent stuck)
            if (role && pathname === '/onboarding') {
                if (role === 'teacher') router.replace('/teacher');
                else if (role === 'admin') router.replace('/admin/dashboard');
                else router.replace('/dashboard');
            }
        }
    }, [user, role, loading, pathname, router]);

    return <>{children}</>;
}
