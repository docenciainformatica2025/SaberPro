import { Shield, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { COPYRIGHT_TEXT, DEVELOPER_COPYRIGHT } from "@/lib/config";

export default function ProFooter() {
    return (
        <footer className="w-full mt-2 md:mt-4 pt-2 md:pt-4 pb-8 border-t border-metal-silver/5 flex flex-col items-center">
            {/* Trust Badges - High Visibility - Static */}
            <div className="flex items-center gap-4 mb-6 transition-transform hover:scale-105 duration-300">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Shield size={14} className="text-metal-gold" /> SSL SECURE
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Lock size={14} className="text-metal-gold" /> ENCRYPTED DATA
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-metal-silver uppercase tracking-widest" suppressHydrationWarning>
                    <Globe size={14} className="text-metal-gold" /> GLOBAL ACCESS
                </div>
            </div>

            {/* Legal Links - AA Contrast Compliant */}
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-x-6 gap-y-4 text-[10px] md:text-[10px] uppercase tracking-[0.15em] text-metal-silver/70 font-bold mb-6 px-6 text-center">
                <Link href="/terms" className="hover:text-metal-gold transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center">Términos de Uso</Link>
                <Link href="/privacy" className="hover:text-metal-gold transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center">Privacidad de Datos</Link>
                <Link href="/cookies" className="hover:text-metal-gold transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center">Política de Cookies</Link>
                <Link href="/support" className="hover:text-metal-gold transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center">Centro de Ayuda y Soporte</Link>
            </div>

            {/* Copyright & Version */}
            <div className="text-[10px] text-metal-silver/50 text-center uppercase tracking-widest leading-relaxed">
                <p>{COPYRIGHT_TEXT}</p>
                <p className="mt-2 font-black text-metal-silver/60">
                    {DEVELOPER_COPYRIGHT}
                </p>
            </div>
        </footer>
    );
}
