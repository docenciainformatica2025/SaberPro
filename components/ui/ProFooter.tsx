import { Shield, Lock, Globe, Heart } from "lucide-react";
import Link from "next/link";

export default function ProFooter() {
    return (
        <footer className="w-full mt-16 pt-8 pb-32 border-t border-metal-silver/5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Trust Badges */}
            <div className="flex items-center gap-6 mb-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500" suppressHydrationWarning>
                {/* Mockup logos for "World Class" feel */}
                <div className="flex items-center gap-1 text-xs font-bold text-metal-silver" suppressHydrationWarning>
                    <Shield size={14} /> SSL SECURE
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-metal-silver" suppressHydrationWarning>
                    <Lock size={14} /> ENCRYPTED DATA
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-metal-silver" suppressHydrationWarning>
                    <Globe size={14} /> GLOBAL ACCESS
                </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] uppercase tracking-widest text-metal-silver/40 font-semibold mb-4 px-6 text-center">
                <Link href="/terms" className="hover:text-metal-gold transition-colors whitespace-nowrap">Términos de Uso</Link>
                <Link href="/privacy" className="hover:text-metal-gold transition-colors whitespace-nowrap">Privacidad de Datos</Link>
                <Link href="/cookies" className="hover:text-metal-gold transition-colors whitespace-nowrap">Política de Cookies</Link>
                <Link href="/support" className="hover:text-metal-gold transition-colors whitespace-nowrap">Centro de Ayuda y Soporte</Link>
            </div>

            {/* Copyright */}
            <div className="text-[10px] text-metal-silver/20 text-center">
                <p>&copy; {new Date().getFullYear()} Saber Pro Suite. Todos los derechos reservados.</p>
                <p className="mt-1">
                    Desarrollado por <a href="https://docenciainformatica.odoo.com/" target="_blank" rel="noopener noreferrer" className="hover:text-metal-gold transition-colors font-bold">Ing. Antonio Rodriguez</a> para Docencia Informática.
                </p>
            </div>
        </footer>
    );
}
