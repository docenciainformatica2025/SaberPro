import { Cookie, Eye, Settings } from "lucide-react";
import { AUTHOR_NAME, COMPANY_NAME } from "@/lib/config";

export default function CookieContent() {
    return (
        <div className="space-y-10 text-theme-text-secondary" suppressHydrationWarning>
            {/* Header Section - Premium Audit Theme */}
            <div className="bg-gradient-to-r from-brand-primary/5 to-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-brand-primary font-bold mb-1 uppercase tracking-widest text-[10px]">Política de Cookies</h3>
                    <p className="text-[10px] text-slate-500">Tecnologías de rastreo y almacenamiento local.</p>
                </div>
                <div className="text-xs space-y-1 text-right">
                    <div className="font-bold text-slate-900 text-[11px]">© 2025 {COMPANY_NAME}.</div>
                    <div className="text-slate-500 text-[10px]">Todos los derechos reservados.</div>
                    <div className="pt-1 text-slate-600 text-[10px]">
                        Desarrollado por <strong className="text-slate-800">{AUTHOR_NAME}</strong><br />
                        para <em className="text-slate-800">{COMPANY_NAME}</em>.
                    </div>
                    <div className="pt-1 font-mono text-[9px] text-slate-400">
                        Jurisdicción: Colombia
                    </div>
                    <div className="pt-1 font-mono text-[9px] text-brand-primary font-bold">
                        v2.1 (Tech Audit)
                    </div>
                </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Cookie className="text-brand-primary" size={18} />
                    1. ¿Qué son las cookies?
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm text-slate-700">
                        Una cookie es un pequeño archivo de texto que se almacena en su navegador. El &quot;Local Storage&quot; permite almacenar datos en su dispositivo de manera más persistente y segura.
                    </p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* Section 2 */}
            <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Eye className="text-brand-primary" size={18} />
                    2. Tipos de cookies utilizadas
                </h2>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-bold">Tipo</th>
                                <th className="p-4 font-bold hidden md:table-cell">Propiedad</th>
                                <th className="p-4 font-bold">Finalidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-slate-800">Sesión</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-xs">Propia</span></td>
                                <td className="p-4 text-slate-600">Gestionar el login y mantener la sesión activa.</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">Seguridad</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-xs">Propia</span></td>
                                <td className="p-4 text-slate-600">Prevenir ataques y proteger tus datos.</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">Analítica</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-purple-500/10 text-purple-600 text-xs">Terceros</span></td>
                                <td className="p-4 text-slate-600">Estadísticas de uso anónimas.</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">Preferencias</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-xs">Propia</span></td>
                                <td className="p-4 text-slate-600">Recordar configuración (tema, idioma).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* Section 3 */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="text-brand-primary" size={18} />
                    3. Gestión
                </h2>
                <p className="leading-relaxed text-sm">
                    Puede permitir, bloquear o eliminar las cookies mediante la configuración de su navegador. Tenga en cuenta que desactivar cookies técnicas puede afectar el funcionamiento de la plataforma.
                </p>
            </section>
        </div>
    );
}
