export function Footer() {
    return (
        <footer suppressHydrationWarning className="w-full py-8 mt-auto border-t border-metal-silver/10 bg-black/40 backdrop-blur-md">
            <div suppressHydrationWarning className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p className="text-sm text-metal-silver/60 font-light">
                        Copyright &copy; Ing. Antonio Rodríguez 2024-2025
                    </p>
                    <p className="text-xs text-metal-silver/30 mt-1">
                        Todos los derechos reservados.
                    </p>
                </div>
                <div className="flex gap-6 text-xs text-metal-silver/50 uppercase tracking-wider">
                    <a href="/terms" className="hover:text-metal-gold transition-colors">Términos de Uso</a>
                    <a href="/support" className="hover:text-metal-gold transition-colors">Soporte</a>
                </div>
            </div>
        </footer>
    );
}
