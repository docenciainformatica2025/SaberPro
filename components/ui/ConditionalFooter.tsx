"use client";

import { usePathname } from "next/navigation";
import ProFooter from "./ProFooter";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on simulation pages to prevent distractions
    if (pathname?.startsWith("/simulation")) {
        return null;
    }

    // Hide global footer on Landing Page (it has its own)
    if (pathname === '/') {
        return null;
    }

    return <ProFooter />;
}
