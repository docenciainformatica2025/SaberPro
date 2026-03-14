import { Shield, Lock, FileText, Server, Activity, User, Globe, Mail, Landmark } from "lucide-react";
import { AUTHOR_NAME, CONTACT_EMAIL, COMPANY_NAME } from "@/lib/config";

export default function PrivacyContent() {
    return (
        <div className="space-y-10 text-theme-text-secondary" suppressHydrationWarning>

            {/* Header Info - Audit Theme */}
            <div className="bg-gradient-to-r from-brand-primary/5 to-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-brand-primary font-bold mb-1 uppercase tracking-widest text-[10px]">Política de Privacidad (Habeas Data)</h3>
                    <p className="text-[10px] text-slate-500">Este documento cumple con la Ley 1581 de 2012.</p>
                </div>
                <div className="text-xs space-y-1 text-right">
                    <div className="font-bold text-slate-900 text-[11px]">Responsable: {AUTHOR_NAME}</div>
                    <div className="text-brand-primary font-bold">{CONTACT_EMAIL}</div>
                    <div className="pt-1 text-slate-600 text-[10px]">
                        Desarrollado por <strong className="text-slate-800">{AUTHOR_NAME}</strong><br />
                        para <em className="text-slate-800">{COMPANY_NAME}</em>.
                    </div>
                    <div className="pt-1 font-mono text-[9px] text-slate-400">
                        Jurisdicción: Colombia
                    </div>
                </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Política de Tratamiento de Datos Personales</h2>
                <p className="text-[10px] text-theme-text-secondary/60">Versión 2.1 - Estándar Internacional & Colombia</p>
            </div>

            <hr className="border-white/5" />

            {/* 1. Marco Legal */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Landmark className="text-brand-primary" size={18} />
                    1. Marco Legal
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm">
                        En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, el Usuario autoriza a {AUTHOR_NAME} para tratar sus datos personales según esta política.
                    </p>
                </div>
            </section>

            {/* 2. Datos Recolectados */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Server className="text-brand-primary" size={18} />
                    2. ¿Qué datos recolectamos?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <li className="p-4 bg-slate-50 border border-theme-border-soft rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-slate-800 block mb-1 text-sm flex items-center gap-2">
                            <User size={14} className="text-blue-600" /> Identificación
                        </strong>
                        <p className="text-xs text-slate-600">Nombre completo y correo electrónico.</p>
                    </li>
                    <li className="p-4 bg-slate-50 border border-theme-border-soft rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-slate-800 block mb-1 text-sm flex items-center gap-2">
                            <Shield size={14} className="text-green-600" /> Académicos
                        </strong>
                        <p className="text-xs text-slate-600">Institución universitaria (dato estadístico opcional).</p>
                    </li>
                    <li className="p-4 bg-slate-50 border border-theme-border-soft rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-slate-800 block mb-1 text-sm flex items-center gap-2">
                            <Activity size={14} className="text-purple-600" /> Uso
                        </strong>
                        <p className="text-xs text-slate-600">Puntajes en simulacros, estadísticas de errores/aciertos y tiempos.</p>
                    </li>
                </ul>
            </section>

            {/* 3. Finalidad */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Lock className="text-brand-primary" size={18} />
                    3. Finalidad del Tratamiento
                </h2>
                <p className="leading-relaxed mb-4 text-sm">Los datos se usarán exclusivamente para:</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs text-slate-700">Gestionar el acceso y autenticación en la App.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs text-slate-700">Generar reportes de progreso académico para el usuario.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs text-slate-700">Realizar mejoras técnicas y corregir errores de software.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs text-slate-700">Brindar soporte técnico.</span>
                    </div>
                </div>
            </section>

            {/* 4. Derechos */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-brand-primary" size={18} />
                    4. Derechos del Titular
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm text-slate-700">
                        Como usuario, usted tiene derecho a <strong>conocer, actualizar, rectificar y solicitar la supresión</strong> de sus datos.
                    </p>
                </div>
            </section>

            {/* 5. Canal de Atención */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Mail className="text-brand-primary" size={18} />
                    5. Canal de Atención de Habeas Data
                </h2>
                <p className="text-sm">Para ejercer sus derechos, contacte al Responsable:</p>

                <div className="metallic-card p-6 rounded-xl border border-theme-border-soft bg-slate-50 text-center space-y-2 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico Oficial</p>
                    <p className="text-xl md:text-2xl font-bold text-brand-primary select-all">{CONTACT_EMAIL}</p>
                    <p className="text-xs text-slate-400">Asunto sugerido: &quot;Solicitud Habeas Data&quot;</p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 6. Estándares Internacionales (Add-on for World Class app) */}
            <section className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <Globe className="text-brand-primary" />
                    EXTRA: ESTÁNDARES INTERNACIONALES
                </h2>
                <p className="text-[10px] leading-relaxed">
                    Esta política ha sido diseñada para ser compatible con regulaciones globales como GDPR (Europa), garantizando que sus datos están protegidos con los más altos estándares de cifrado y seguridad en infraestructura Google Cloud Platform.
                </p>
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
