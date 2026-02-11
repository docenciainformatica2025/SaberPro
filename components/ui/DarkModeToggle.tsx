"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * DarkModeToggle - Theme switcher with persistent preference
 * Follows Material Design dark theme principles
 * Default: Dark mode (brand identity + reduces eye strain)
 */
export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Read from localStorage or system preference
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');

        setIsDark(theme === 'dark');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.remove('light'); // Clean up legacy class
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    const toggle = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <button
            onClick={toggle}
            className="
                fixed bottom-40 right-6 md:bottom-6 md:right-48 
                w-12 h-12 rounded-full 
                bg-brand-primary hover:bg-brand-primary-deep
                flex items-center justify-center
                shadow-lg hover:shadow-xl hover:scale-110
                transition-all duration-300
                touch-target-large touch-manipulation
                z-50
                animate-in fade-in slide-in-from-bottom-4
            "
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
            {isDark ? (
                <Sun size={20} className="text-black animate-in spin-in-90 duration-300" />
            ) : (
                <Moon size={20} className="text-black animate-in spin-in-90 duration-300" />
            )}
        </button>
    );
}
