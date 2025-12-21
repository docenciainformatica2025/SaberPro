import { DEVELOPER_COPYRIGHT } from "@/lib/config";

export function Footer() {
    return (
        <footer suppressHydrationWarning className="w-full py-12 mt-auto border-t border-white/5 bg-black text-center z-10 relative">
            <div suppressHydrationWarning className="container mx-auto px-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-black text-metal-silver/60 uppercase tracking-[0.2em]">
                            {DEVELOPER_COPYRIGHT}
                        </p>
                        <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-widest">
                            Desarrollado por <span className="text-metal-gold">Ing. Antonio Rodríguez</span>
                        </p>
                    </div>

                    <div className="flex gap-6 mt-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <a href="mailto:docenciainformatica2025@gmail.com" className="text-metal-silver hover:text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                            ✉️ Contacto
                        </a>
                        <span className="text-metal-silver/20">|</span>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-metal-silver hover:text-white text-[10px] uppercase tracking-widest font-bold">
                            LinkedIn
                        </a>
                        <a href="/credits" className="text-metal-silver hover:text-white text-[10px] uppercase tracking-widest font-bold ml-4">
                            Créditos
                        </a>
                    </div>

                    <div className="flex gap-6 mt-8 pt-8 border-t border-white/5 w-full justify-center max-w-xs mx-auto">
                        <a href="/terms" className="text-metal-silver/30 hover:text-white text-[9px] uppercase tracking-widest">Términos</a>
                        <a href="/privacy" className="text-metal-silver/30 hover:text-white text-[9px] uppercase tracking-widest">Privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
