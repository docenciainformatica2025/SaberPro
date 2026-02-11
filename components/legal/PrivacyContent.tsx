import { Shield, Lock, FileText, Server, Activity, User, Globe, Mail, Landmark } from "lucide-react";
import { AUTHOR_NAME, CONTACT_EMAIL, COMPANY_NAME } from "@/lib/config";

export default function PrivacyContent() {
    return (
        <div className="space-y-10 text-theme-text-secondary">

            {/* Header Info - Gold Theme */}
            <div className="bg-gradient-to-r from-brand-primary/20 to-black p-6 rounded-xl border border-brand-primary/20 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-brand-primary font-bold mb-2 uppercase tracking-wider text-sm">POLÍTICA DE PRIVACIDAD (HABEAS DATA)</h3>
                    <p className="text-xs text-brand-primary/60">Este documento cumple con la Ley 1581 de 2012.</p>
                </div>
                <div className="text-xs space-y-1 text-right text-theme-text-secondary/80">
                    <div className="font-bold text-white">Responsable: {AUTHOR_NAME}</div>
                    <div className="text-brand-primary">{CONTACT_EMAIL}</div>
                    <div className="pt-1 opacity-70">
                        Desarrollado por <strong>{AUTHOR_NAME}</strong><br />
                        para <em>{COMPANY_NAME}</em>.
                    </div>
                    <div className="pt-1 font-mono text-[10px] opacity-50">
                        Jurisdicción: Colombia
                    </div>
                </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h2>
                <p className="text-xs text-theme-text-secondary/60">Versión 2.1 - Estándar Internacional & Colombia</p>
            </div>

            <hr className="border-white/5" />

            {/* 1. Marco Legal */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Landmark className="text-brand-primary" />
                    1. MARCO LEGAL
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm">
                        En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, el Usuario autoriza a {AUTHOR_NAME} para tratar sus datos personales según esta política.
                    </p>
                </div>
            </section>

            {/* 2. Datos Recolectados */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Server className="text-brand-primary" />
                    2. ¿QUÉ DATOS RECOLECTAMOS?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-white block mb-1 text-sm flex items-center gap-2">
                            <User size={14} className="text-blue-400" /> Identificación
                        </strong>
                        <p className="text-xs">Nombre completo y correo electrónico.</p>
                    </li>
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-white block mb-1 text-sm flex items-center gap-2">
                            <Shield size={14} className="text-green-400" /> Académicos
                        </strong>
                        <p className="text-xs">Institución universitaria (dato estadístico opcional).</p>
                    </li>
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-brand-primary/30 transition-colors">
                        <strong className="text-white block mb-1 text-sm flex items-center gap-2">
                            <Activity size={14} className="text-purple-400" /> Uso
                        </strong>
                        <p className="text-xs">Puntajes en simulacros, estadísticas de errores/aciertos y tiempos.</p>
                    </li>
                </ul>
            </section>

            {/* 3. Finalidad */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Lock className="text-brand-primary" />
                    3. FINALIDAD DEL TRATAMIENTO
                </h2>
                <p className="leading-relaxed mb-4 text-sm">Los datos se usarán exclusivamente para:</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Gestionar el acceso y autenticación en la App.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Generar reportes de progreso académico para el usuario.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Realizar mejoras técnicas y corregir errores de software.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-brand-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Brindar soporte técnico.</span>
                    </div>
                </div>
            </section>

            {/* 4. Derechos */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-brand-primary" />
                    4. DERECHOS DEL TITULAR
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm">
                        Como usuario, usted tiene derecho a <strong>conocer, actualizar, rectificar y solicitar la supresión</strong> de sus datos.
                    </p>
                </div>
            </section>

            {/* 5. Canal de Atención */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Mail className="text-brand-primary" />
                    5. CANAL DE ATENCIÓN DE HABEAS DATA
                </h2>
                <p className="text-sm">Para ejercer sus derechos, contacte al Responsable:</p>

                <div className="metallic-card p-6 rounded-xl border border-brand-primary/30 bg-black text-center space-y-2">
                    <p className="text-xs text-theme-text-secondary uppercase tracking-wider mb-1">Correo Electrónico Oficial</p>
                    <p className="text-xl md:text-2xl font-bold text-brand-primary select-all">{CONTACT_EMAIL}</p>
                    <p className="text-xs text-white/50">Asunto sugerido: &quot;Solicitud Habeas Data&quot;</p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 6. Estándares Internacionales (Add-on for World Class app) */}
            <section className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
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
