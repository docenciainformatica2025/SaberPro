import { Shield, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { COPYRIGHT_TEXT, DEVELOPER_COPYRIGHT } from "@/lib/config";

export default function ProFooter() {
    return (
        <footer className="w-full mt-8 pt-8 pb-12 border-t border-metal-silver/5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Trust Badges */}
            <div className="flex items-center gap-6 mb-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500" suppressHydrationWarning>
                <div className="flex items-center gap-1 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Shield size={12} /> SSL SECURE
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Lock size={12} /> ENCRYPTED DATA
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Globe size={12} /> GLOBAL ACCESS
                </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] uppercase tracking-[0.2em] text-metal-silver/40 font-bold mb-4 px-6 text-center">
                <Link href="/terms" className="hover:text-metal-gold transition-colors whitespace-nowrap">Términos de Uso</Link>
                <Link href="/privacy" className="hover:text-metal-gold transition-colors whitespace-nowrap">Privacidad de Datos</Link>
                <Link href="/cookies" className="hover:text-metal-gold transition-colors whitespace-nowrap">Política de Cookies</Link>
                <Link href="/support" className="hover:text-metal-gold transition-colors whitespace-nowrap">Centro de Ayuda y Soporte</Link>
            </div>

            {/* Copyright & Version */}
            <div className="text-[9px] text-metal-silver/30 text-center uppercase tracking-widest leading-relaxed">
                <p>{COPYRIGHT_TEXT}</p>
                <p className="mt-1 font-black text-metal-silver/50">
                    {DEVELOPER_COPYRIGHT}
                </p>
            </div>
        </footer>
    );
}
