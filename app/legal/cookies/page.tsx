import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CookieContent from "@/components/legal/CookieContent";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-metal-black text-white font-sans selection:bg-metal-gold selection:text-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-metal-silver hover:text-metal-gold transition-colors mb-4 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white">
                        Política de Cookies
                    </h1>
                    <p className="text-metal-silver max-w-2xl mx-auto leading-relaxed">
                        Transparencia en el uso de tecnologías de rastreo.
                    </p>
                </div>

                {/* Content Card */}
                <div className="metallic-card p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-metal-gold/10 shadow-2xl">
                    <CookieContent />
                </div>
            </div>
        </div>
    );
}
