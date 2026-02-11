import { DEVELOPER_COPYRIGHT } from "@/lib/config";

export function Footer() {
    return (
        <footer suppressHydrationWarning className="w-full py-12 mt-auto border-t border-white/5 dark:border-white/10 bg-[var(--theme-bg-base)] text-center支撑 z-10 relative transition-colors duration-500">
            <div suppressHydrationWarning className="container mx-auto px-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em]">
                            {DEVELOPER_COPYRIGHT}
                        </p>
                        <p className="text-[10px] text-[var(--theme-text-quaternary)] font-bold uppercase tracking-wider">
                            Desarrollado por <span className="text-brand-primary">{process.env.NEXT_PUBLIC_AUTHOR_NAME || "SaberPro Team"}</span>
                        </p>
                    </div>

                    <div className="flex gap-6 mt-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@saberpro.com"}`} className="text-[var(--theme-text-secondary)] hover:text-brand-primary text-[10px] uppercase tracking-wider font-bold flex items-center gap-2">
                            ✉️ Contacto
                        </a>
                        <span className="text-[var(--theme-text-quaternary)]">|</span>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text-secondary)] hover:text-brand-primary text-[10px] uppercase tracking-wider font-bold">
                            LinkedIn
                        </a>
                        <a href="/credits" className="text-[var(--theme-text-secondary)] hover:text-brand-primary text-[10px] uppercase tracking-wider font-bold ml-4">
                            Créditos
                        </a>
                    </div>

                    <div className="flex gap-6 mt-8 pt-8 border-t border-white/5 dark:border-white/10 w-full justify-center max-w-xs mx-auto">
                        <a href="/terms" className="text-[var(--theme-text-quaternary)] hover:text-brand-primary text-[9px] uppercase tracking-wider">Términos</a>
                        <a href="/privacy" className="text-[var(--theme-text-quaternary)] hover:text-brand-primary text-[9px] uppercase tracking-wider">Privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
