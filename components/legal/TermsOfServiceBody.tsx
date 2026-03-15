import { FileText, Shield, AlertTriangle, Scale, Lock, RefreshCw, Gavel, Check, UserX, MousePointerClick } from "lucide-react";
import { AUTHOR_NAME, COMPANY_NAME, CONTACT_EMAIL } from "@/lib/config";

export default function TermsOfServiceBody() {
    return (
        <div className="space-y-12 text-[var(--theme-text-secondary)] text-justify" suppressHydrationWarning>
            {/* Header Section - Premium Audit Theme */}
            <div className="bg-gradient-to-r from-brand-primary/5 via-[var(--theme-bg-surface)] to-[var(--theme-bg-base)]/50 p-8 rounded-3xl border border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between gap-6 shadow-sm">
                <div className="space-y-1">
                    <h3 className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">Términos y Condiciones de Uso</h3>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] font-bold">Regula la relación contractual y el descargo de responsabilidad.</p>
                </div>
                <div className="text-[11px] space-y-1 text-center md:text-right">
                    <div className="font-bold text-[var(--theme-text-primary)] tracking-tight">© 2026 {COMPANY_NAME}.</div>
                    <div className="text-[var(--theme-text-tertiary)] text-[10px]">Todos los derechos reservados.</div>
                    <div className="pt-2 text-[var(--theme-text-tertiary)] text-[10px]">
                        Desarrollado para <strong className="text-[var(--theme-text-primary)] font-bold">{COMPANY_NAME}</strong><br />
                        por <em className="text-[var(--theme-text-primary)] font-semibold not-italic">{AUTHOR_NAME}</em>.
                    </div>
                </div>
            </div>

            {/* 1. Aceptación */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <MousePointerClick className="text-brand-primary" size={18} />
                    </div>
                    1. Aceptación del servicio
                </h2>
                <div className="p-6 rounded-2xl bg-brand-primary/[0.03] border border-brand-primary/10 transition-colors hover:bg-brand-primary/[0.05]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        Al descargar, instalar o utilizar la aplicación móvil o web SaberPro (en adelante, &quot;la App&quot;), el Usuario acepta íntegramente los presentes términos.
                        <span className="block mt-4 font-black text-[var(--theme-text-primary)] underline underline-offset-8 decoration-brand-primary/50 text-xs uppercase tracking-wider">Si no está de acuerdo, debe abstenerse de usar la aplicación.</span>
                    </p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 2. Naturaleza */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <FileText className="text-brand-primary" size={18} />
                    </div>
                    2. Naturaleza del servicio
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl hover:border-brand-primary/30 transition-all shadow-sm group">
                        <strong className="text-[var(--theme-text-primary)] block mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check size={12} className="text-emerald-500" />
                            </div>
                            Finalidad Educativa
                        </strong>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-secondary)] font-medium">
                            La App es una herramienta de simulación y práctica. Su propósito es familiarizar al estudiante con la metodología y estructura de preguntas tipo &quot;Saber Pro&quot;.
                        </p>
                    </div>
                    <div className="p-6 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl hover:border-brand-accent/30 transition-all shadow-sm group">
                        <strong className="text-[var(--theme-text-primary)] block mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                            <div className="w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center">
                                <AlertTriangle size={12} className="text-brand-accent" />
                            </div>
                            Desvinculación del ICFES
                        </strong>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-secondary)] font-medium">
                            Esta App es una iniciativa privada e independiente. <strong className="text-brand-primary">NO existe vínculo alguno</strong> entre el Desarrollador y el ICFES. El uso del nombre &quot;Saber Pro&quot; es descriptivo académica e institucionalmente.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 3. Exención de Responsabilidad */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Shield className="text-brand-primary" size={18} />
                    </div>
                    3. Exención de responsabilidad
                </h2>
                <p className="text-sm font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest text-[10px]">De conformidad con las normas de protección al consumidor en Colombia:</p>

                <div className="space-y-4">
                    <div className="flex gap-4 p-5 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)]">
                        <div className="mt-1 min-w-[6px] h-6 bg-brand-error/40 rounded-full" />
                        <div>
                            <strong className="text-[var(--theme-text-primary)] text-sm font-black uppercase tracking-wider block mb-1">No se garantizan resultados</strong>
                            <p className="text-xs text-[var(--theme-text-secondary)] font-medium leading-relaxed">El uso de esta App NO asegura la aprobación del examen de Estado ni la obtención de un puntaje específico.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-5 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)]">
                        <div className="mt-1 min-w-[6px] h-6 bg-brand-error/40 rounded-full" />
                        <div>
                            <strong className="text-[var(--theme-text-primary)] text-sm font-black uppercase tracking-wider block mb-1">Responsabilidad Limitada</strong>
                            <p className="text-xs text-[var(--theme-text-secondary)] font-medium leading-relaxed">{AUTHOR_NAME} no se hace responsable por los resultados obtenidos por el Usuario en las pruebas reales. El éxito depende exclusivamente de tu preparación individual.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 4. Propiedad Intelectual */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Lock className="text-brand-primary" size={18} />
                    </div>
                    4. Propiedad intelectual
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--theme-bg-overlay)]/50 border border-[var(--theme-border-soft)]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        El código fuente, diseño, algoritmos y base de datos son propiedad exclusiva de <strong className="text-[var(--theme-text-primary)]">{AUTHOR_NAME}</strong>.
                        <span className="block mt-4 text-brand-primary font-black uppercase tracking-widest text-[10px]">Queda prohibida la reproducción, ingeniería inversa o distribución no autorizada.</span>
                    </p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 5. Standard Global Clauses */}
            <section className="space-y-8">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Scale className="text-brand-primary" size={18} />
                    </div>
                    5. Cláusulas internacionales
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] hover:border-brand-primary/40 transition-all shadow-sm group">
                        <h4 className="text-[var(--theme-text-primary)] font-black flex items-center gap-2 text-[10px] mb-4 uppercase tracking-[0.2em]">
                            <RefreshCw size={14} className="text-brand-primary animate-spin-slow" /> MODIFICACIONES
                        </h4>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-tertiary)] font-medium">
                            Nos reservamos el derecho de actualizar estos términos. El uso continuado implica aceptación tácita de los nuevos acuerdos.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] hover:border-brand-error/40 transition-all shadow-sm group">
                        <h4 className="text-[var(--theme-text-primary)] font-black flex items-center gap-2 text-[10px] mb-4 uppercase tracking-[0.2em]">
                            <UserX size={14} className="text-brand-error" /> TERMINACIÓN
                        </h4>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-tertiary)] font-medium">
                            Podemos suspender cuentas por fraude, hacking o compartir credenciales personales sin previo aviso.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] hover:border-brand-primary/40 transition-all shadow-sm group">
                        <h4 className="text-[var(--theme-text-primary)] font-black flex items-center gap-2 text-[10px] mb-4 uppercase tracking-[0.2em]">
                            <Lock size={14} className="text-brand-primary" /> SEGURIDAD
                        </h4>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-tertiary)] font-medium">
                            Usted es responsable de custodiar su identidad digital. Reporte accesos sospechosos en menos de 24h.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 6. Derecho de Retracto */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Scale className="text-brand-primary" size={18} />
                    </div>
                    6. Retracto y reembolsos
                </h2>
                <div className="p-8 bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-3xl space-y-6 shadow-sm">
                    <div className="space-y-2">
                        <strong className="text-[var(--theme-text-primary)] text-sm block font-black uppercase tracking-wider">6.1 Normatividad (Ley 1480)</strong>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-secondary)] font-medium">
                            De acuerdo con el Artículo 47 del Estatuto del Consumidor de Colombia, tienes derecho a retractarte dentro de los cinco (5) días hábiles siguientes a la compra digital.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <strong className="text-[var(--theme-text-primary)] text-sm block font-black uppercase tracking-wider">6.2 Excepción (Servicios Digitales)</strong>
                        <p className="text-xs leading-relaxed text-[var(--theme-text-secondary)] font-medium">
                            Debido a la naturaleza de consumo inmediato de los simulacros, aplica la excepción del numeral 1 del Artículo 47:
                        </p>
                        <blockquote className="mt-3 pl-4 border-l-4 border-brand-primary/40 text-xs italic text-[var(--theme-text-tertiary)] font-academic">
                            &quot;Se exceptúan del derecho de retracto [...] los contratos de prestación de servicios cuya prestación haya comenzado con el acuerdo del consumidor.&quot;
                        </blockquote>
                    </div>

                    <div className="space-y-2">
                        <strong className="text-brand-error text-sm block font-black uppercase tracking-wider">6.3 Renuncia y Aceptación</strong>
                        <ul className="list-none space-y-3 text-xs text-[var(--theme-text-secondary)] font-medium">
                            <li className="flex gap-3 items-start italic">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                                El servicio comienza de manera inmediata al validar tus credenciales de acceso.
                            </li>
                            <li className="flex gap-3 items-start italic">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                                Al acceder al contenido, el Usuario pierde el derecho de retracto por consumo instantáneo de información.
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                        <p className="text-[10px] leading-relaxed text-brand-primary font-black uppercase tracking-widest text-center">
                            Contacto para reversión (Art. 51): {CONTACT_EMAIL}
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 7. Ley Aplicable */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Gavel className="text-brand-primary" size={18} />
                    </div>
                    7. Ley aplicable
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)]">
                    <p className="leading-relaxed text-sm text-[var(--theme-text-secondary)] font-medium">
                        Estos términos se rigen por las leyes de la <strong className="text-[var(--theme-text-primary)]">República de Colombia</strong>. Cualquier controversia será sometida a los jueces competentes de la República.
                    </p>
                </div>
            </section>
        </div>
    );
}
