"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logger from "@/utils/logger";

/**
 * SessionWatcher handles automatic logout after a period of inactivity.
 * Standard behavior in security-focused applications.
 */
export default function SessionWatcher() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Timeout duration: 15 minutes of inactivity
    const INACTIVITY_LIMIT = 15 * 60 * 1000;

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (user) {
            timeoutRef.current = setTimeout(async () => {
                try {
                    Logger.warn("Session expired due to inactivity.");
                    toast.warning("Sesión expirada", {
                        description: "Has sido desconectado por inactividad para proteger tu seguridad."
                    });
                    await logout();
                    router.push("/");
                } catch (error) {
                    Logger.error("Auto-logout error:", error);
                }
            }, INACTIVITY_LIMIT);
        }
    };

    useEffect(() => {
        if (!user) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        // List of events to track for activity
        const events = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click"
        ];

        // Initialize timer
        resetTimer();

        // Add event listeners
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [user, logout, router]);

    return null; // This component doesn't render anything
}
