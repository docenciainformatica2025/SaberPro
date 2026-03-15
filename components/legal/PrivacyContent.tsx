import { Shield, Lock, FileText, Server, Activity, User, Globe, Mail, Landmark } from "lucide-react";
import { AUTHOR_NAME, CONTACT_EMAIL, COMPANY_NAME } from "@/lib/config";

export default function PrivacyContent() {
    return (
        <div className="space-y-12 text-[var(--theme-text-secondary)]" suppressHydrationWarning>

            {/* Header Info - Audit Theme */}
            <div className="bg-gradient-to-r from-brand-primary/5 via-[var(--theme-bg-base)]/50 to-brand-primary/5 p-8 rounded-2xl border border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="text-center md:text-left">
                    <h3 className="text-brand-primary font-black mb-1 uppercase tracking-[0.2em] text-[10px]">Políticas de Integridad</h3>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] font-medium">Cumplimiento Estricto Ley 1581 de 2012 (Colombia)</p>
                </div>
                <div className="text-[11px] space-y-1.5 text-center md:text-right">
                    <div className="font-bold text-[var(--theme-text-primary)]">Responsable: {AUTHOR_NAME}</div>
                    <div className="text-brand-primary font-black tracking-wide">{CONTACT_EMAIL}</div>
                    <div className="pt-1 text-[var(--theme-text-tertiary)] text-[10px] leading-relaxed">
                        Desarrollado para <strong className="text-[var(--theme-text-primary)] font-bold">{COMPANY_NAME}</strong><br />
                        Infraestructura: <em className="text-[var(--theme-text-secondary)] not-italic font-semibold">Google Cloud Platform</em>
                    </div>
                </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-black text-[var(--theme-text-primary)] tracking-tight">Tratamiento de Datos Personales</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)] text-[9px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-widest">
                    Versión 2.5 • Certificada • {new Date().getFullYear()}
                </div>
            </div>

            {/* 1. Marco Legal */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Landmark size={20} className="text-brand-primary" />
                    </div>
                    1. Marco Jurídico
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--theme-bg-overlay)]/40 border border-[var(--theme-border-soft)]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)]">
                        En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, el Usuario autoriza expresamente a {AUTHOR_NAME} para el tratamiento de su información bajo los principios de finalidad, libertad y veracidad.
                    </p>
                </div>
            </section>

            {/* 2. Datos Recolectados */}
            <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Server size={20} className="text-brand-primary" />
                    </div>
                    2. Inventario de Información
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl group hover:border-brand-primary/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                            <User size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-1 text-sm font-bold">Identidad Básica</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed">Nombre completo y credenciales de acceso seguro.</p>
                    </div>
                    <div className="p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl group hover:border-brand-primary/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                            <Shield size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-1 text-sm font-bold">Data Académica</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed">Institución y programas de formación profesional.</p>
                    </div>
                    <div className="p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl group hover:border-brand-primary/40 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                            <Activity size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-1 text-sm font-bold">Métricas de Uso</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed">Desempeño en simulacros, analíticas de error y tiempos de respuesta.</p>
                    </div>
                </div>
            </section>

            {/* 3. Finalidad */}
            <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Lock size={20} className="text-brand-primary" />
                    </div>
                    3. Finalidad del Tratamiento
                </h2>
                <p className="text-sm text-[var(--theme-text-secondary)]">Los datos se procesan con el fin exclusivo de:</p>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        "Gestión integral de perfiles y autenticación.",
                        "Generación de reportes de evolución académica.",
                        "Optimización algorítmica de simulacros basados en IA.",
                        "Soporte técnico y prevención de fraude."
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-xl shadow-sm">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <CheckIcon className="text-brand-primary" size={14} />
                            </div>
                            <span className="text-xs text-[var(--theme-text-secondary)] font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Canal de Atención */}
            <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Mail size={20} className="text-brand-primary" />
                    </div>
                    4. Canales de Habeas Data
                </h2>
                <div className="relative p-8 rounded-3xl overflow-hidden border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-center shadow-xl shadow-black/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase font-black tracking-[0.2em] mb-4">Contacto Directo</p>
                    <p className="text-2xl md:text-3xl font-black text-brand-primary select-all transition-transform hover:scale-105 cursor-pointer">{CONTACT_EMAIL}</p>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] mt-4">
                        Tiempo promedio de respuesta para solicitudes legales: <span className="font-bold text-[var(--theme-text-primary)]">48 horas hábiles</span>.
                    </p>
                </div>
            </section>

            {/* 6. Estándares Internacionales */}
            <section className="pt-8 border-t border-[var(--theme-border-soft)]">
                <div className="flex items-center gap-4 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-secondary)] transition-colors group">
                    <Globe size={20} className="group-hover:text-brand-primary transition-colors" />
                    <p className="text-[10px] leading-relaxed font-medium">
                        Esta infraestructura cumple con protocolos <strong className="text-[var(--theme-text-primary)] font-bold">ISO 27001</strong> y estándares globales de protección de datos, garantizando cifrado de extremo a extremo.
                    </p>
                </div>
            </section>
        </div>
    );
}

function CheckIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
    return (
        <svg
            {...props}
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
