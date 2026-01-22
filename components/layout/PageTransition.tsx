"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    // Disabled animations to prevent FOUC/Opacity issues per user report "se carga y se opaca"
    return (
        <div className="w-full flex-grow flex flex-col">
            {children}
        </div>
    );
}
