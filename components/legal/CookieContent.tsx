import { Cookie, Shield, Eye, Settings } from "lucide-react";

export default function CookieContent() {
    return (
        <div className="space-y-10 text-metal-silver">
            {/* Header Section - Premium Gold Theme */}
            <div className="bg-gradient-to-r from-metal-gold/20 to-black p-6 rounded-xl border border-metal-gold/20 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-metal-gold font-bold mb-2 uppercase tracking-widest text-sm">POLÍTICA DE COOKIES</h3>
                    <p className="text-xs text-metal-gold/60">Tecnologías de rastreo y almacenamiento local.</p>
                </div>
                <div className="text-xs space-y-1 text-right text-metal-silver/80">
                    <div className="font-bold text-white">© 2025 Saber Pro Suite.</div>
                    <div>Todos los derechos reservados.</div>
                    <div className="pt-1 opacity-70">
                        Desarrollado por <strong>Ing. Antonio Rodríguez</strong><br />
                        para <em>Docencia Informática</em>.
                    </div>
                    <div className="pt-1 font-mono text-[10px] opacity-50">
                        Jurisdicción: Colombia
                    </div>
                    <div className="pt-1 font-mono text-[10px] text-metal-gold">
                        v2.1 (Tech Audit)
                    </div>
                </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Cookie className="text-metal-gold" />
                    1. ¿Qué son las Cookies?
                </h2>
                <div className="p-4 rounded-lg bg-metal-gold/5 border border-metal-gold/10">
                    <p className="leading-relaxed text-sm">
                        Una cookie es un pequeño archivo de texto que se almacena en su navegador. El &quot;Local Storage&quot; permite almacenar datos en su dispositivo de manera más persistente y segura.
                    </p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* Section 2 */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Eye className="text-metal-gold" />
                    2. Tipos de cookies utilizadas
                </h2>

                <div className="overflow-hidden rounded-xl border border-metal-gold/10 bg-black/20">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-metal-gold/10 text-metal-gold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-bold">Tipo</th>
                                <th className="p-4 font-bold hidden md:table-cell">Propiedad</th>
                                <th className="p-4 font-bold">Finalidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">Sesión</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Propia</span></td>
                                <td className="p-4">Gestionar el login y mantener la sesión activa.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">Seguridad</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Propia</span></td>
                                <td className="p-4">Prevenir ataques y proteger tus datos.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">Analítica</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs">Terceros</span></td>
                                <td className="p-4">Estadísticas de uso anónimas.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">Preferencias</td>
                                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Propia</span></td>
                                <td className="p-4">Recordar configuración (tema, idioma).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* Section 3 */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Settings className="text-metal-gold" />
                    3. Gestión
                </h2>
                <p className="leading-relaxed text-sm">
                    Puede permitir, bloquear o eliminar las cookies mediante la configuración de su navegador. Tenga en cuenta que desactivar cookies técnicas puede afectar el funcionamiento de la plataforma.
                </p>
            </section>
        </div>
    );
}
