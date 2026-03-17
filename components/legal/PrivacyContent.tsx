import { Shield, Lock, FileText, Server, Activity, User, Globe, Mail, Landmark } from "lucide-react";
import { AUTHOR_NAME, CONTACT_EMAIL, COMPANY_NAME } from "@/lib/config";

export default function PrivacyContent() {
    return (
        <div className="space-y-12 text-[var(--theme-text-secondary)]" suppressHydrationWarning>

            {/* Header Info - Audit Theme */}
            <div className="bg-gradient-to-r from-brand-primary/5 via-[var(--theme-bg-base)]/50 to-brand-primary/5 p-8 rounded-3xl border border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="text-center md:text-left space-y-1">
                    <h3 className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">Políticas de Integridad</h3>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-tight">Cumplimiento Estricto Ley 1581 (Colombia)</p>
                </div>
                <div className="text-[11px] space-y-1.5 text-center md:text-right">
                    <div className="font-bold text-[var(--theme-text-primary)] tracking-tight">Responsable: SinapCode SaaS</div>
                    <div className="text-brand-primary font-black tracking-wide truncate max-w-[200px]">{CONTACT_EMAIL}</div>
                    <div className="pt-2 text-[var(--theme-text-tertiary)] text-[10px] leading-relaxed font-medium">
                        Infraestructura: <em className="text-[var(--theme-text-primary)] not-italic font-black">SaberPro Cloud</em><br />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">GCP Certified Environment</span>
                    </div>
                </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-none font-academic">Tratamiento de <span className="text-brand-primary italic">Datos</span></h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)] text-[10px] text-[var(--theme-text-primary)] font-black uppercase tracking-[0.3em] shadow-sm">
                    Versión Maestro 2.5 • {new Date().getFullYear()}
                </div>
            </div>

            {/* 1. Marco Legal */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Landmark size={20} className="text-brand-primary" />
                    </div>
                    1. Marco Jurídico
                </h2>
                <div className="p-8 rounded-3xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors" />
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        En cumplimiento de la <strong className="text-[var(--theme-text-primary)] font-black">Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, autorizas a SinapCode SaaS para el tratamiento de tu información bajo los principios de finalidad, libertad y veracidad suprema.
                    </p>
                </div>
            </section>

            {/* 2. Datos Recolectados */}
            <section className="space-y-8">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Server size={20} className="text-brand-primary" />
                    </div>
                    2. Inventario de Información
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl group hover:border-brand-primary/40 transition-all duration-500 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <User size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-2 text-sm font-black uppercase tracking-wider">Identidad</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed font-medium">Nombre completo y credenciales de acceso institucional.</p>
                    </div>
                    <div className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl group hover:border-brand-primary/40 transition-all duration-500 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Shield size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-2 text-sm font-black uppercase tracking-wider">Académica</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed font-medium">Institución, programa y núcleo de formación profesional.</p>
                    </div>
                    <div className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl group hover:border-brand-primary/40 transition-all duration-500 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Activity size={20} />
                        </div>
                        <strong className="text-[var(--theme-text-primary)] block mb-2 text-sm font-black uppercase tracking-wider">Métricas</strong>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed font-medium">Desempeño predictivo, analíticas de error y tiempos de entrenamiento.</p>
                    </div>
                </div>
            </section>

            {/* 3. Finalidad */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Lock size={20} className="text-brand-primary" />
                    </div>
                    3. Finalidad Superior
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        "Gestión integral de perfiles de alto rendimiento.",
                        "Generación de reportes de evolución con IA.",
                        "Optimización de bancos de preguntas predictivos.",
                        "Soporte técnico y blindaje contra fraude."
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl shadow-sm hover:border-brand-primary/20 transition-all group">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                <CheckIcon size={16} />
                            </div>
                            <span className="text-xs text-[var(--theme-text-secondary)] font-bold leading-tight">{text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Canal de Atención */}
            <section className="space-y-8">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-4">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                        <Mail size={20} className="text-brand-primary" />
                    </div>
                    4. Habeas Data
                </h2>
                <div className="relative p-12 rounded-[2.5rem] overflow-hidden border border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)] text-center shadow-2xl shadow-black/10 transition-transform hover:scale-[1.01] duration-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />

                    <p className="text-[10px] text-brand-primary uppercase font-black tracking-[0.4em] mb-6">Oficial de Privacidad</p>
                    <p className="text-2xl md:text-4xl font-black text-[var(--theme-text-primary)] select-all tracking-tightest leading-none font-academic">{CONTACT_EMAIL}</p>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] mt-8 font-bold uppercase tracking-widest">
                        Respuesta Garantizada Legal: <span className="text-brand-primary">48 Horas Hábiles</span>
                    </p>
                </div>
            </section>

            {/* 6. Estándares Internacionales */}
            <section className="pt-12 border-t border-[var(--theme-border-soft)]">
                <div className="flex items-center gap-6 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-secondary)] transition-colors group">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] flex items-center justify-center shrink-0">
                        <Globe size={24} className="group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="text-[10px] leading-relaxed font-bold uppercase tracking-widest">
                        Infraestructura auditada bajo estándares <strong className="text-[var(--theme-text-primary)] font-black">ISO 27001</strong> y <strong className="text-[var(--theme-text-primary)] font-black">GDPR Compliance</strong>. Cifrado RSA-4096 en reposo y tránsito.
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
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
