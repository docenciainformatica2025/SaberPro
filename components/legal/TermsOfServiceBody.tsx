import { FileText, Shield, AlertTriangle, Scale, Lock, RefreshCw, Gavel, Check, UserX, MousePointerClick } from "lucide-react";
import { AUTHOR_NAME, COMPANY_NAME, CONTACT_EMAIL } from "@/lib/config";

export default function TermsOfServiceBody() {
    return (
        <div className="space-y-10 text-theme-text-secondary text-justify">
            {/* Header Section - Premium Gold Theme */}
            <div className="bg-gradient-to-r from-brand-primary/20 to-black p-6 rounded-xl border border-brand-primary/20 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-brand-primary font-bold mb-2 uppercase tracking-wider text-sm">TÉRMINOS Y CONDICIONES DE USO</h3>
                    <p className="text-xs text-brand-primary/60">Regula la relación contractual y el descargo de responsabilidad.</p>
                </div>
                <div className="text-xs space-y-1 text-right text-theme-text-secondary/80">
                    <div className="font-bold text-white">© 2025 {COMPANY_NAME}.</div>
                    <div>Todos los derechos reservados.</div>
                    <div className="pt-1 opacity-70">
                        Desarrollado por <strong>{AUTHOR_NAME}</strong><br />
                        para <em>{COMPANY_NAME}</em>.
                    </div>
                    <div className="pt-1 font-mono text-[10px] opacity-50">
                        Jurisdicción: Colombia
                    </div>
                    <div className="pt-1 font-mono text-[10px] text-brand-primary">
                        v2.1 (International Audit)
                    </div>
                </div>
            </div>

            {/* 1. Aceptación */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <MousePointerClick className="text-brand-primary" />
                    1. ACEPTACIÓN DEL SERVICIO
                </h2>
                <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <p className="leading-relaxed text-sm">
                        Al descargar, instalar o utilizar la aplicación móvil o web SaberPro (en adelante, &quot;la App&quot;), el Usuario acepta íntegramente los presentes términos.
                        <span className="block mt-2 font-bold text-white">Si no está de acuerdo, debe abstenerse de usar la aplicación.</span>
                    </p>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 2. Naturaleza */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-brand-primary" />
                    2. NATURALEZA DEL SERVICIO (IMPORTANTE)
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-black/40 border border-white/5 rounded-xl hover:border-brand-primary/30 transition-colors">
                        <strong className="text-white block mb-2 flex items-center gap-2 text-sm">
                            <Check size={16} className="text-green-400" /> Finalidad Educativa
                        </strong>
                        <p className="text-xs leading-relaxed">
                            La App es una herramienta de simulación y práctica. Su propósito es familiarizar al estudiante con la metodología y estructura de preguntas tipo &quot;Saber Pro&quot;.
                        </p>
                    </div>
                    <div className="p-5 bg-black/40 border border-white/5 rounded-xl hover:border-orange-500/30 transition-colors">
                        <strong className="text-white block mb-2 flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} className="text-orange-400" /> Desvinculación del ICFES
                        </strong>
                        <p className="text-xs leading-relaxed">
                            Esta App es una iniciativa privada e independiente. <strong>NO existe vínculo alguno</strong> (laboral, contractual o de representación) entre el Desarrollador y el ICFES o el Ministerio de Educación Nacional. El uso del nombre &quot;Saber Pro&quot; es descriptivo (uso justo).
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 3. Exención de Responsabilidad */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <Shield className="text-brand-primary" />
                    3. EXENCIÓN DE RESPONSABILIDAD
                </h2>
                <p className="text-sm mb-2">De conformidad con las normas de protección al consumidor en Colombia:</p>

                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="mt-1 min-w-[4px] h-4 bg-red-500/50 rounded-full" />
                        <div>
                            <strong className="text-white text-sm">No se garantizan resultados:</strong>
                            <p className="text-xs mt-1">El uso de esta App NO asegura la aprobación del examen de Estado ni la obtención de un puntaje específico.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="mt-1 min-w-[4px] h-4 bg-red-500/50 rounded-full" />
                        <div>
                            <strong className="text-white text-sm">Responsabilidad Limitada:</strong>
                            <p className="text-xs mt-1">{AUTHOR_NAME} no se hace responsable por los resultados obtenidos por el Usuario en las pruebas reales. El éxito depende exclusivamente de la preparación individual del estudiante.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 4. Propiedad Intelectual */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <Lock className="text-brand-primary" />
                    4. PROPIEDAD INTELECTUAL
                </h2>
                <p className="leading-relaxed text-sm">
                    El código fuente, diseño, algoritmos y base de datos son propiedad exclusiva de {AUTHOR_NAME} (Copyright © 2024-2025).
                    <span className="text-white"> Queda prohibida la reproducción, ingeniería inversa o distribución no autorizada.</span> Las preguntas se utilizan con fines académicos.
                </p>
            </section>

            <hr className="border-white/5" />

            {/* 5. Standard Global Clauses */}
            <section className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <Scale className="text-brand-primary" />
                    5. CLÁUSULAS INTERNACIONALES (SaaS Estándar)
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-brand-primary/5 border border-white/5 hover:border-brand-primary/30 transition-all">
                        <h4 className="text-white font-bold flex items-center gap-2 text-xs mb-2">
                            <RefreshCw size={12} className="text-brand-primary" /> MODIFICACIONES
                        </h4>
                        <p className="text-[10px] leading-relaxed">
                            Nos reservamos el derecho de actualizar estos términos. El uso continuado tras una actualización implica aceptación.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-brand-primary/5 border border-white/5 hover:border-brand-primary/30 transition-all">
                        <h4 className="text-white font-bold flex items-center gap-2 text-xs mb-2">
                            <UserX size={12} className="text-brand-primary" /> TERMINACIÓN
                        </h4>
                        <p className="text-[10px] leading-relaxed">
                            Podemos suspender cuentas por fraude, hacking o compartir credenciales (cuentas personales).
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-brand-primary/5 border border-white/5 hover:border-brand-primary/30 transition-all">
                        <h4 className="text-white font-bold flex items-center gap-2 text-xs mb-2">
                            <Lock size={12} className="text-brand-primary" /> SEGURIDAD
                        </h4>
                        <p className="text-[10px] leading-relaxed">
                            Usted es responsable de custodiar su contraseña. Reporte cualquier acceso sospechoso.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 6. Derecho de Retracto */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <Scale className="text-brand-primary" />
                    6. DERECHO DE RETRACTO Y POLÍTICA DE REEMBOLSOS
                </h2>
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4">
                    <div>
                        <strong className="text-white text-sm block mb-1">6.1 Normatividad Aplicable (Ley 1480 de 2011)</strong>
                        <p className="text-xs leading-relaxed">
                            De acuerdo con el Artículo 47 del Estatuto del Consumidor de Colombia, en los contratos celebrados a distancia (compras online), el consumidor tiene derecho a retractarse de la compra dentro de los cinco (5) días hábiles siguientes.
                        </p>
                    </div>

                    <div>
                        <strong className="text-white text-sm block mb-1">6.2 Excepción al Derecho de Retracto (Servicios Digitales)</strong>
                        <p className="text-xs leading-relaxed">
                            No obstante lo anterior, SaberPro informa al Usuario que, debido a la naturaleza digital y de consumo inmediato del servicio ofrecido, aplica la excepción contemplada en el numeral 1 del Artículo 47 de la Ley 1480 de 2011:
                        </p>
                        <blockquote className="mt-2 pl-3 border-l-2 border-brand-primary text-xs italic opacity-70">
                            &quot;Se exceptúan del derecho de retracto [...] los contratos de prestación de servicios cuya prestación haya comenzado con el acuerdo del consumidor.&quot;
                        </blockquote>
                    </div>

                    <div>
                        <strong className="text-white text-sm block mb-1">6.3 Renuncia y Aceptación</strong>
                        <p className="text-xs leading-relaxed">
                            Al adquirir una suscripción, membresía o acceso a contenido pago dentro de la App, el Usuario reconoce y acepta expresamente que:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                            <li>El servicio de simulación y acceso al banco de preguntas comienza a ejecutarse de manera inmediata en el momento en que se validan las credenciales de acceso o se desbloquea el contenido.</li>
                            <li>Al acceder al contenido digital, el Usuario pierde el derecho de retracto, ya que el servicio se considera consumido y no es posible realizar una &quot;devolución&quot; del conocimiento o la información visualizada.</li>
                            <li>Por lo tanto, no se realizarán reembolsos ni devoluciones de dinero una vez que el Usuario haya ingresado a la plataforma y el servicio esté activo, salvo en casos de fallas técnicas comprobables imputables exclusivamente al Desarrollador que impidan el uso total de la App por más de 72 horas.</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white text-sm block mb-1">6.4 Reversión del Pago (Artículo 51)</strong>
                        <p className="text-xs leading-relaxed">
                            Únicamente procederá la reversión del pago en los casos estrictamente señalados por la Ley (fraude, operación no solicitada o producto no recibido). Para solicitar una reversión por estos motivos, el Usuario deberá notificarlo dentro de los cinco (5) días hábiles siguientes al conocimiento de la operación fraudulenta al correo <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">{CONTACT_EMAIL}</a>.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-white/5" />

            {/* 7. Ley Aplicable */}
            <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <Gavel className="text-brand-primary" />
                    7. LEY APLICABLE
                </h2>
                <p className="leading-relaxed text-sm">
                    Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>. Cualquier controversia se someterá a los jueces de la República.
                </p>
            </section>
        </div>
    );
}
