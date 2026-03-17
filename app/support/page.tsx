"use client";

import Link from "next/link";
import { ArrowLeft, Mail, HelpCircle, Shield, AlertTriangle, Check, MessageSquare, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AUTHOR_NAME, CONTACT_EMAIL, SUPPORT_WHATSAPP } from "@/lib/config";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans selection:bg-brand-primary selection:text-black py-24 px-4" suppressHydrationWarning>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-[var(--theme-text-secondary)] hover:text-brand-primary uppercase tracking-[0.2em] font-black text-[9px] mb-2 transition-all">
                            Volver al Inicio
                        </Button>
                    </Link>

                    <Badge variant="ghost" className="mx-auto text-[var(--theme-text-secondary)] font-bold tracking-widest uppercase px-3 h-7 bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)]">
                        Estamos contigo
                    </Badge>

                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--theme-text-primary)] tracking-tight leading-none text-balance">
                        Centro de <span className="text-brand-primary italic">Ayuda</span>
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Queremos que te sientas tranquilo mientras estudias. Si algo no funciona o tienes una duda, cuenta con nosotros para resolverlo.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid gap-12">

                    {/* FAQ Section */}
                    <Card variant="glass" className="p-8 md:p-12 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/[0.03] blur-3xl -mr-16 -mt-16 rounded-full" />
                        
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <HelpCircle size={20} className="text-brand-primary" />
                            </div>
                            <h2 className="text-2xl font-academic font-bold text-[var(--theme-text-primary)] tracking-tight">Preguntas Frecuentes</h2>
                        </div>

                        <div className="grid gap-5 relative z-10">
                            {[
                                { q: "¿Esta App es oficial del ICFES?", a: `No. SaberPro es una herramienta de simulación educativa independiente creada por el Ing. ${AUTHOR_NAME}. No tenemos vinculación con el ICFES ni con el Gobierno Nacional.` },
                                { q: "¿Las preguntas que aparecen aquí saldrán en el examen real?", a: "No podemos garantizarlo. Las preguntas son simulacros diseñados para que practiques la lógica y la estructura del examen, pero no son filtraciones de la prueba oficial." },
                                { q: "La App se cierra sola o va lenta.", a: "Por favor, asegúrate de tener la última versión instalada. Intenta borrar la memoria caché de la App en los ajustes de tu teléfono o prueba reinstalando." },
                                { q: "Olvidé mi contraseña.", a: "Utiliza la opción '¿Olvidaste tu contraseña?' en la pantalla de inicio para restablecerla vía correo electrónico." }
                            ].map((item, i) => (
                                <div key={i} className="bg-[var(--theme-bg-base)]/40 p-7 rounded-2xl border border-[var(--theme-border-soft)] hover:border-brand-primary/40 hover:bg-[var(--theme-bg-base)] transition-all duration-300 group/item">
                                    <h3 className="font-academic font-bold text-[var(--theme-text-primary)] mb-3 text-[13px] flex items-start gap-4">
                                        <span className="text-brand-primary select-none font-black text-[10px] uppercase tracking-widest bg-brand-primary/5 px-2 py-0.5 rounded-md">Q</span> {item.q}
                                    </h3>
                                    <p className="text-[11px] text-[var(--theme-text-secondary)] leading-relaxed pl-10 font-academic opacity-80 group-hover/item:opacity-100 transition-opacity">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Contact Section */}
                    <Card variant="premium" className="p-8 md:p-14 relative overflow-hidden bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-primary/5 border-brand-primary/20 organic-border shadow-4k group">
                        <div className="absolute inset-0 bg-[var(--theme-bg-surface)]/20 backdrop-blur-3xl -z-10" />
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-2.5 bg-brand-primary/10 rounded-xl">
                                <MessageSquare size={20} className="text-brand-primary" strokeWidth={2.5} />
                            </div>
                            <h2 className="text-3xl font-black text-[var(--theme-text-primary)] tracking-tightest font-academic uppercase">Atención Directa</h2>
                        </div>

                        <p className="mb-10 text-lg text-[var(--theme-text-secondary)] leading-relaxed relative z-10 font-academic italic opacity-80">
                            Si tu desafío persiste, nuestro equipo de especialistas (dirigido por el Ing. {AUTHOR_NAME}) responderá en un ciclo de <strong>24-48 horas hábiles</strong>. La excelencia requiere tiempo.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {/* WhatsApp Support */}
                            <a 
                                href={`https://wa.me/${SUPPORT_WHATSAPP}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)] p-8 rounded-3xl flex items-center gap-8 hover:bg-[var(--theme-bg-base)] transition-all group/item hover:border-brand-success/50 hover:shadow-2xl hover:shadow-brand-success/10"
                            >
                                <div className="p-5 bg-brand-success text-black rounded-2xl group-hover/item:scale-110 transition-transform shadow-2xl shadow-brand-success/20 organic-border">
                                    <Phone size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-[0.25em] font-black opacity-60">Canal de Asistencia</p>
                                    <p className="text-brand-success font-black text-xl tracking-tight">VIP WhatsApp</p>
                                </div>
                            </a>

                            {/* Email Support */}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)] p-8 rounded-3xl flex items-center gap-8 hover:bg-[var(--theme-bg-base)] transition-all group/item hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10">
                                <div className="p-5 bg-brand-primary text-black rounded-2xl group-hover/item:scale-110 transition-transform shadow-2xl shadow-brand-primary/20 organic-border-reverse">
                                    <Mail size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-[0.25em] font-black opacity-60">Enlace Institucional</p>
                                    <p className="text-brand-primary font-black text-lg tracking-tight break-all uppercase">{CONTACT_EMAIL}</p>
                                </div>
                            </a>
                        </div>

                        <div className="mt-10 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl relative z-10 transition-all hover:bg-brand-primary/10 backdrop-blur-md">
                            <h4 className="flex items-center gap-2 text-brand-primary font-black text-[11px] uppercase mb-4 tracking-widest">
                                <AlertTriangle size={16} strokeWidth={2.5} /> Protocolo de Diagnóstico Rápido:
                            </h4>
                            <ul className="text-xs text-[var(--theme-text-secondary)] space-y-2 list-none font-academic italic opacity-80 pl-2">
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-primary rounded-full" /> Describe el hallazgo técnico (puedes adjuntar evidencia visual).</li>
                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-primary rounded-full" /> Confirma tu identidad académica (correo/celular).</li>
                            </ul>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
