import { Cookie, Eye, Settings } from "lucide-react";
import { AUTHOR_NAME, COMPANY_NAME } from "@/lib/config";

export default function CookieContent() {
    return (
        <div className="space-y-12 text-[var(--theme-text-secondary)]" suppressHydrationWarning>
            {/* Header Section - Premium Audit Theme */}
            <div className="bg-gradient-to-br from-brand-primary/10 via-[var(--theme-bg-base)] to-[var(--theme-bg-base)] p-8 rounded-2xl border border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="text-center md:text-left">
                    <h3 className="text-brand-primary font-black mb-1 uppercase tracking-[0.2em] text-[10px]">Política de Cookies</h3>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold">Auditoría Técnica v2.5</p>
                </div>
                <div className="text-[11px] space-y-1 text-center md:text-right">
                    <div className="font-bold text-[var(--theme-text-primary)] tracking-tight">© {new Date().getFullYear()} {COMPANY_NAME}</div>
                    <div className="text-[var(--theme-text-tertiary)] text-[10px]">Protección de Datos Activa</div>
                    <div className="pt-2 text-[var(--theme-text-tertiary)] text-[9px] font-mono leading-tight">
                        Protocolo: HTTPS/SaberPro-Sec<br />
                        <span className="text-brand-primary font-bold">CERTIFIED INFRASTRUCTURE</span>
                    </div>
                </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Cookie className="text-brand-primary" size={20} />
                    </div>
                    1. Definición de Tecnologías
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--theme-bg-overlay)]/40 border border-[var(--theme-border-soft)]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)]">
                        Las cookies y el <strong className="text-[var(--theme-text-primary)]">LocalStorage</strong> son herramientas esenciales que nos permiten recordar tus preferencias y garantizar que tu sesión sea persistente, segura y fluida durante el entrenamiento intensivo.
                    </p>
                </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Eye className="text-brand-primary" size={20} />
                    </div>
                    2. Clasificación de Datos
                </h2>

                <div className="overflow-hidden rounded-2xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] shadow-xl shadow-black/5">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--theme-bg-base)]/50 text-[var(--theme-text-tertiary)] text-[9px] uppercase tracking-[0.2em] border-b border-[var(--theme-border-soft)]">
                            <tr>
                                <th className="p-5 font-black">Categoría</th>
                                <th className="p-5 font-black hidden md:table-cell">Origen</th>
                                <th className="p-5 font-black">Propósito Técnico</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--theme-border-soft)] text-xs">
                            {[
                                { cat: "Sesión", origin: "Propia", desc: "Mantenimiento del túnel de autentificación.", color: "blue" },
                                { cat: "Seguridad", origin: "Propia", desc: "Protección contra ataques CSRF y validación de tokens.", color: "emerald" },
                                { cat: "Analítica", origin: "Terceros", desc: "Métricas de tráfico anónimas para escalabilidad.", color: "purple" },
                                { cat: "Personalización", origin: "Propia", desc: "Almacenamiento de temas, idioma y filtros locales.", color: "amber" }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-[var(--theme-bg-overlay)]/30 transition-colors group">
                                    <td className="p-5 font-bold text-[var(--theme-text-primary)]">{row.cat}</td>
                                    <td className="p-5 hidden md:table-cell">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                                            ${row.origin === 'Propia' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-[var(--theme-text-tertiary)]/10 text-[var(--theme-text-tertiary)]'}`}>
                                            {row.origin}
                                        </span>
                                    </td>
                                    <td className="p-5 text-[var(--theme-text-secondary)] font-medium">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Settings className="text-brand-primary" size={20} />
                    </div>
                    3. Autogestión del Usuario
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--theme-bg-overlay)]/40 border border-[var(--theme-border-soft)]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)]">
                        Tienes el control total. Puedes configurar tus preferencias a través de nuestro <strong className="text-brand-primary">Centro de Privacidad</strong> o desactivarlas directamente en la configuración de tu navegador. Considera que bloquear cookies técnicas podría limitar funcionalidades críticas del simulador.
                    </p>
                </div>
            </section>
        </div>
    );
}
