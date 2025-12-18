import { Shield, Lock, FileText, Server, Monitor, Activity, User, Globe, Mail, Landmark } from "lucide-react";

export default function PrivacyContent() {
    return (
        <div className="space-y-10 text-metal-silver">

            {/* Header Info - Gold Theme */}
            <div className="bg-gradient-to-r from-metal-gold/20 to-black p-6 rounded-xl border border-metal-gold/20 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-metal-gold font-bold mb-2 uppercase tracking-widest text-sm">POLÍTICA DE PRIVACIDAD (HABEAS DATA)</h3>
                    <p className="text-xs text-metal-gold/60">Este documento cumple con la Ley 1581 de 2012.</p>
                </div>
                <div className="text-xs space-y-1 text-right text-metal-silver/80">
                    <div className="font-bold text-white">Responsable: Ing. Antonio Rodríguez</div>
                    <div className="text-metal-gold">docenciainformatica2025@gmail.com</div>
                    <div className="pt-1 opacity-70">
                        Desarrollado por <strong>Ing. Antonio Rodríguez</strong><br />
                        para <em>Docencia Informática</em>.
                    </div>
                    <div className="pt-1 font-mono text-[10px] opacity-50">
                        Jurisdicción: Colombia
                    </div>
                </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest">POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h2>
                <p className="text-xs text-metal-silver/60">Versión 2.1 - Estándar Internacional & Colombia</p>
            </div>

            <hr className="border-white/5" />

            {/* 1. Marco Legal */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Landmark className="text-metal-gold" />
                    1. MARCO LEGAL
                </h2>
                <div className="p-4 rounded-lg bg-metal-gold/5 border border-metal-gold/10">
                    <p className="leading-relaxed text-sm">
                        En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, el Usuario autoriza al Ing. Antonio Rodríguez para tratar sus datos personales según esta política.
                    </p>
                </div>
            </section>

            {/* 2. Datos Recolectados */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Server className="text-metal-gold" />
                    2. ¿QUÉ DATOS RECOLECTAMOS?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-metal-gold/30 transition-colors">
                        <strong className="text-white block mb-1 text-sm flex items-center gap-2">
                            <User size={14} className="text-blue-400" /> Identificación
                        </strong>
                        <p className="text-xs">Nombre completo y correo electrónico.</p>
                    </li>
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-metal-gold/30 transition-colors">
                        <strong className="text-white block mb-1 text-sm flex items-center gap-2">
                            <Shield size={14} className="text-green-400" /> Académicos
                        </strong>
                        <p className="text-xs">Institución universitaria (dato estadístico opcional).</p>
                    </li>
                    <li className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-metal-gold/30 transition-colors">
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
                    <Lock className="text-metal-gold" />
                    3. FINALIDAD DEL TRATAMIENTO
                </h2>
                <p className="leading-relaxed mb-4 text-sm">Los datos se usarán exclusivamente para:</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-metal-gold shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Gestionar el acceso y autenticación en la App.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-metal-gold shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Generar reportes de progreso académico para el usuario.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-metal-gold shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Realizar mejoras técnicas y corregir errores de software.</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <CheckIcon className="text-metal-gold shrink-0 mt-0.5" size={16} />
                        <span className="text-xs">Brindar soporte técnico.</span>
                    </div>
                </div>
            </section>

            {/* 4. Derechos */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-metal-gold" />
                    4. DERECHOS DEL TITULAR
                </h2>
                <div className="p-4 rounded-lg bg-metal-gold/5 border border-metal-gold/10">
                    <p className="leading-relaxed text-sm">
                        Como usuario, usted tiene derecho a <strong>conocer, actualizar, rectificar y solicitar la supresión</strong> de sus datos.
                    </p>
                </div>
            </section>

            {/* 5. Canal de Atención */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Mail className="text-metal-gold" />
                    5. CANAL DE ATENCIÓN DE HABEAS DATA
                </h2>
                <p className="text-sm">Para ejercer sus derechos, contacte al Responsable:</p>

                <div className="metallic-card p-6 rounded-xl border border-metal-gold/30 bg-black text-center space-y-2">
                    <p className="text-xs text-metal-silver uppercase tracking-widest mb-1">Correo Electrónico Oficial</p>
                    <p className="text-xl md:text-2xl font-bold text-metal-gold select-all">docenciainformatica2025@gmail.com</p>
                    <p className="text-xs text-white/50">Asunto sugerido: "Solicitud Habeas Data"</p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 6. Estándares Internacionales (Add-on for World Class app) */}
            <section className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <Globe className="text-metal-gold" />
                    EXTRA: ESTÁNDARES INTERNACIONALES
                </h2>
                <p className="text-[10px] leading-relaxed">
                    Esta política ha sido diseñada para ser compatible con regulaciones globales como GDPR (Europa), garantizando que sus datos están protegidos con los más altos estándares de cifrado y seguridad en infraestructura Google Cloud Platform.
                </p>
            </section>

        </div >
    );
}

function CheckIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> }
