import Link from "next/link";
import {
    BRAND_YEAR,
    APP_VERSION,
    COMPANY_NAME,
    COPYRIGHT_TEXT
} from "@/lib/config";

export default function ProFooter() {
    return (
        <footer className="border-t border-[var(--theme-border-soft)] bg-[var(--theme-bg-overlay)] transition-colors duration-500 pb-24 md:pb-32">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Top links */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    {/* Legal */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--theme-text-secondary)]">
                        <Link href="/legal/terms" className="hover:text-brand-primary transition-colors">
                            Términos de Uso
                        </Link>
                        <Link href="/legal/privacy" className="hover:text-brand-primary transition-colors">
                            Privacidad de Datos
                        </Link>
                        <Link href="/legal/cookies" className="hover:text-brand-primary transition-colors">
                            Política de Cookies
                        </Link>
                    </nav>

                    {/* Support */}
                    <Link
                        href="/support"
                        className="text-sm text-[var(--theme-text-secondary)] hover:text-brand-primary transition-colors"
                    >
                        Centro de Ayuda y Soporte
                    </Link>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-[var(--theme-border-soft)]"></div>

                {/* Bottom */}
                <div className="flex flex-col gap-3 text-sm text-[var(--theme-text-tertiary)] md:flex-row md:items-center md:justify-between font-medium">

                    {/* Product */}
                    <p>
                        {COPYRIGHT_TEXT}
                    </p>

                    {/* Company & version */}
                    <p className="flex items-center gap-2">
                        Powered by <span className="font-bold text-[var(--theme-text-primary)]">SINAPCODE</span> ·
                        Saber Pro Trainer <span className="tabular-nums text-brand-primary">v{APP_VERSION}</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
