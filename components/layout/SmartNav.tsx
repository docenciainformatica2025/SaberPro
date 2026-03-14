"use client";

/**
 * SmartNav — Auto-hide on scroll-down, reveal on scroll-up
 * Pattern used by: Apple, Linear, Vercel, Stripe
 *
 * Behavior:
 * - At top of page: always visible, transparent background
 * - Scrolling DOWN > 80px: slides up and hides
 * - Scrolling UP: immediately reveals with frosted-glass background
 */

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function SmartNav() {
    const { user, role } = useAuth();
    const dashboardLink =
        role === "teacher"
            ? "/teacher"
            : role === "admin"
                ? "/admin/dashboard"
                : "/dashboard";

    const [visible, setVisible] = useState(true);
    const [atTop, setAtTop] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    const isAtTop = currentY < 10;
                    const scrollingDown = currentY > lastScrollY.current;
                    const scrollDelta = Math.abs(currentY - lastScrollY.current);

                    setAtTop(isAtTop);

                    // Only react to meaningful scroll (>4px) to avoid micro-jitter
                    if (scrollDelta > 4) {
                        if (isAtTop) {
                            // Always show when at the very top
                            setVisible(true);
                        } else if (scrollingDown && currentY > 80) {
                            // Hide after scrolling 80px down
                            setVisible(false);
                        } else if (!scrollingDown) {
                            // Show immediately on any upward scroll
                            setVisible(true);
                        }
                        lastScrollY.current = currentY;
                    }

                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                // Base layout
                "fixed top-0 w-full z-50",
                // Transition
                "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                // Visibility via transform (GPU-accelerated, no layout reflow)
                visible ? "translate-y-0" : "-translate-y-full",
                // Background changes on scroll
                atTop
                    ? "bg-transparent border-transparent"
                    : "bg-[var(--theme-bg-base)]/90 backdrop-blur-xl border-b border-[var(--theme-border-soft)]",
                // Subtle shadow when visible & scrolled
                !atTop && "shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
            )}
            aria-label="Navegación principal"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo variant="full" size="sm" />
                </Link>

                <div className="flex gap-3 sm:gap-4 items-center">
                    {user ? (
                        <Link href={dashboardLink}>
                            <Button
                                variant="primary"
                                className="text-xs font-bold uppercase tracking-widest h-9 sm:h-10 px-4 sm:px-6 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all hover:-translate-y-0.5"
                            >
                                Mi Panel
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden md:block">
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-[var(--theme-text-secondary)] hover:text-slate-900 dark:hover:text-[var(--theme-text-primary)] transition-colors">
                                    Acceder
                                </span>
                            </Link>
                            <Link href="/register">
                                <Button
                                    variant="primary"
                                    className="text-xs font-bold uppercase tracking-widest h-9 sm:h-10 px-4 sm:px-6 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all hover:-translate-y-0.5"
                                >
                                    Empezar Gratis
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
