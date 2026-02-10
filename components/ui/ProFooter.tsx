import Link from "next/link";

export default function ProFooter() {
    return (
        <footer className="border-t border-white/5 bg-metal-black">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Top links */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    {/* Legal */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                        <Link href="/legal/terms" className="hover:text-white transition-colors">
                            Términos de Uso
                        </Link>
                        <Link href="/legal/privacy" className="hover:text-white transition-colors">
                            Privacidad de Datos
                        </Link>
                        <Link href="/legal/cookies" className="hover:text-white transition-colors">
                            Política de Cookies
                        </Link>
                    </nav>

                    {/* Support */}
                    <Link
                        href="/support"
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        Centro de Ayuda y Soporte
                    </Link>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/10"></div>

                {/* Bottom */}
                <div className="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center md:justify-between font-medium">

                    {/* Product */}
                    <p>
                        © 2026 <span className="font-bold text-white">Saber Pro Suite</span>.
                        Todos los derechos reservados.
                    </p>

                    {/* Company & version */}
                    <p className="flex items-center gap-2">
                        Powered by <span className="font-bold text-white">SINAPCODE</span> ·
                        Saber Pro Trainer <span className="tabular-nums text-metal-gold">v4.1.29</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
