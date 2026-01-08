"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// "Psychologically impactful" easing:
// A custom cubic-bezier that starts slow, accelerates, and lands with "weight".
// This mimics the physics of luxury car doors closing or premium mechanical switches.
const CINEMATIC_EASE = [0.76, 0, 0.24, 1] as const;

const variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(10px)"
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: CINEMATIC_EASE,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: "blur(5px)",
        transition: {
            duration: 0.4,
            ease: "easeIn" as "easeIn"
        }
    }
};

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname} // Triggers animation on route change
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex-grow flex flex-col"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
