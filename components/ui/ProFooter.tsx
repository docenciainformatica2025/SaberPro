import Link from "next/link";
import {
    BRAND_YEAR,
    APP_VERSION,
    COMPANY_NAME,
    COPYRIGHT_TEXT
} from "@/lib/config";

import { Logo } from "@/components/ui/Logo";

export default function ProFooter() {
    return (
        <footer suppressHydrationWarning className="border-t border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] backdrop-blur-3xl transition-colors duration-500 pb-24 md:pb-32 relative overflow-hidden">
            {/* Ambient Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="hover:opacity-80 transition-opacity block w-fit">
                            <Logo variant="full" size="md" />
                        </Link>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed max-w-xs font-medium">
                            Entrenamiento de élite impulsado por inteligencia artificial para la nueva generación de profesionales en Colombia.
                        </p>
                    </div>

                    {/* Links Sections */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Recursos Legales</h4>
                        <nav className="flex flex-col gap-4 text-sm font-bold text-[var(--theme-text-secondary)]">
                            <Link href="/legal/terms" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" /> Términos de Uso
                            </Link>
                            <Link href="/legal/privacy" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" /> Privacidad
                            </Link>
                            <Link href="/legal/cookies" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" /> Cookies
                            </Link>
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Soporte</h4>
                        <nav className="flex flex-col gap-4 text-sm font-bold text-[var(--theme-text-secondary)]">
                            <Link href="/support" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" /> Centro de Ayuda
                            </Link>
                            <Link href="/contact" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" /> Contacto Directo
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--theme-border-soft)] to-transparent mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between font-medium">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--theme-text-tertiary)] opacity-80">
                            {COPYRIGHT_TEXT}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase tracking-widest flex items-center gap-1.5">
                            Powered by <span className="text-[var(--theme-text-primary)]">SINAPCODE</span>
                        </p>
                        <div className="h-4 w-px bg-[var(--theme-border-soft)]" />
                        <div className="px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10">
                            <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">v{APP_VERSION} GOLD</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
