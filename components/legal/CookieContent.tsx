import { Cookie, Eye, Settings } from "lucide-react";
import { AUTHOR_NAME, COMPANY_NAME } from "@/lib/config";

export default function CookieContent() {
    return (
        <div className="space-y-12 text-[var(--theme-text-secondary)]" suppressHydrationWarning>
            {/* Header Section - Premium Audit Theme */}
            <div className="bg-gradient-to-br from-brand-primary/10 via-[var(--theme-bg-base)] to-[var(--theme-bg-base)] p-8 rounded-3xl border border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="text-center md:text-left space-y-1">
                    <h3 className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">Política de Cookies</h3>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold">Auditoría Técnica Maestro v2.5</p>
                </div>
                <div className="text-[11px] space-y-1.5 text-center md:text-right">
                    <div className="font-bold text-[var(--theme-text-primary)] tracking-tight">© {new Date().getFullYear()} {COMPANY_NAME}</div>
                    <div className="text-[var(--theme-text-tertiary)] text-[10px] font-medium">Protección de Datos Activa</div>
                    <div className="pt-2 text-[var(--theme-text-tertiary)] text-[9px] font-mono leading-tight">
                        Protocolo: <span className="text-[var(--theme-text-primary)]">HTTPS/SaberPro-Sec</span><br />
                        <span className="text-brand-primary font-black tracking-widest uppercase">INFRAESTRUCTURA CERTIFICADA</span>
                    </div>
                </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Cookie className="text-brand-primary" size={20} />
                    </div>
                    1. Tecnologías de Rastreo
                </h2>
                <div className="p-8 rounded-3xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors" />
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        Las cookies y el <strong className="text-[var(--theme-text-primary)] font-black">LocalStorage</strong> son herramientas esenciales de la arquitectura SaberPro. Nos permiten recordar tus preferencias, mantener tu túnel de sesión seguro y garantizar una latencia mínima durante los simuladores de alto rendimiento.
                    </p>
                </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-8">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Eye className="text-brand-primary" size={20} />
                    </div>
                    2. Inventario de Datos
                </h2>

                <div className="overflow-hidden rounded-[2rem] border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] shadow-2xl shadow-black/10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--theme-bg-base)] text-[var(--theme-text-tertiary)] text-[9px] uppercase tracking-[0.25em] border-b border-[var(--theme-border-soft)]">
                            <tr>
                                <th className="p-6 font-black">Categoría</th>
                                <th className="p-6 font-black hidden md:table-cell">Origen</th>
                                <th className="p-6 font-black">Propósito Maestro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--theme-border-soft)] text-xs">
                            {[
                                { cat: "Sesión", origin: "Propia", desc: "Mantenimiento del túnel de autentificación persistente.", color: "blue" },
                                { cat: "Seguridad", origin: "Propia", desc: "Protección contra ataques CSRF y validación de tokens SR.", color: "emerald" },
                                { cat: "Analítica", origin: "Terceros", desc: "Métricas de tráfico anónimas para optimización de carga.", color: "purple" },
                                { cat: "Preferencias", origin: "Propia", desc: "Almacenamiento de temas (Elite Dark/Light) y filtros.", color: "amber" }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-brand-primary/[0.02] transition-colors group">
                                    <td className="p-6 font-black text-[var(--theme-text-primary)] uppercase tracking-tight">{row.cat}</td>
                                    <td className="p-6 hidden md:table-cell">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                                            ${row.origin === 'Propia' ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/20' : 'bg-[var(--theme-bg-base)] text-[var(--theme-text-tertiary)] border-[var(--theme-border-soft)]'}`}>
                                            {row.origin}
                                        </span>
                                    </td>
                                    <td className="p-6 text-[var(--theme-text-secondary)] font-medium leading-relaxed">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Settings className="text-brand-primary" size={20} />
                    </div>
                    3. Control de Usuario
                </h2>
                <div className="p-8 rounded-3xl bg-[var(--theme-bg-overlay)]/40 border border-[var(--theme-border-soft)] relative">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        El poder está en tus manos. Puedes gestionar tus preferencias a través de nuestro <strong className="text-brand-primary font-bold">Centro de Privacidad</strong> o desactivarlas en la configuración de tu navegador. <span className="text-[var(--theme-text-tertiary)] italic">Nota: Bloquear cookies técnicas podría degradar la experiencia del simulador.</span>
                    </p>
                </div>
            </section>
        </div>
    );
}
