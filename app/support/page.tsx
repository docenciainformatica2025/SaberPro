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
                    <Card variant="glass" className="p-8 md:p-10 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]/20 shadow-[var(--theme-shadow-md)]">
                        <div className="flex items-center gap-2 mb-8">
                            <HelpCircle size={18} className="text-brand-primary" />
                            <h2 className="text-xl font-bold text-[var(--theme-text-primary)] tracking-tight">Preguntas Frecuentes</h2>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { q: "¿Esta App es oficial del ICFES?", a: `No. SaberPro es una herramienta de simulación educativa independiente creada por el Ing. ${AUTHOR_NAME}. No tenemos vinculación con el ICFES ni con el Gobierno Nacional.` },
                                { q: "¿Las preguntas que aparecen aquí saldrán en el examen real?", a: "No podemos garantizarlo. Las preguntas son simulacros diseñados para que practiques la lógica y la estructura del examen, pero no son filtraciones de la prueba oficial." },
                                { q: "La App se cierra sola o va lenta.", a: "Por favor, asegúrate de tener la última versión instalada. Intenta borrar la memoria caché de la App en los ajustes de tu teléfono o prueba reinstalando." },
                                { q: "Olvidé mi contraseña.", a: "Utiliza la opción '¿Olvidaste tu contraseña?' en la pantalla de inicio para restablecerla vía correo electrónico." }
                            ].map((item, i) => (
                                <div key={i} className="bg-[var(--theme-bg-base)] p-6 rounded-xl border border-[var(--theme-border-soft)] hover:border-brand-primary/30 transition-colors group">
                                    <h3 className="font-bold text-[var(--theme-text-primary)] mb-2 text-sm flex items-start gap-2">
                                        <span className="text-brand-primary select-none font-semibold text-xs uppercase tracking-wider">¿</span> {item.q}
                                    </h3>
                                    <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed pl-6 group-hover:text-[var(--theme-text-primary)] transition-colors">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Contact Section */}
                    <Card variant="premium" className="p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-brand-primary/5 to-slate-50 border-brand-primary/20">
                        <div className="flex items-center gap-2 mb-8 relative z-10">
                            <MessageSquare size={18} className="text-brand-primary" />
                            <h2 className="text-xl font-bold text-[var(--theme-text-primary)] tracking-tight">Atención Inmediata</h2>
                        </div>

                        <p className="mb-8 text-sm text-[var(--theme-text-secondary)] leading-relaxed relative z-10 font-medium">
                            Si tu problema persiste no dudes en escribirnos. El equipo de soporte (dirigido por el Ing. {AUTHOR_NAME}) responderá en <strong>24-48 horas hábiles</strong>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {/* WhatsApp Support */}
                            <a 
                                href={`https://wa.me/${SUPPORT_WHATSAPP}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] p-6 rounded-2xl flex items-center gap-6 hover:bg-[var(--theme-bg-base)] transition-all group hover:border-brand-success/50 shadow-sm"
                            >
                                <div className="p-4 bg-brand-success text-white rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-brand-success/20">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-wider font-semibold mb-1">WhatsApp de Soporte</p>
                                    <p className="text-brand-success font-bold text-sm md:text-base">+57 {SUPPORT_WHATSAPP.replace('57', '')}</p>
                                </div>
                            </a>

                            {/* Email Support */}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] p-6 rounded-2xl flex items-center gap-6 hover:bg-[var(--theme-bg-base)] transition-all group hover:border-brand-primary/50 shadow-sm">
                                <div className="p-4 bg-brand-primary text-white rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/20">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase tracking-wider font-semibold mb-1">Correo Electrónico</p>
                                    <p className="text-brand-primary font-bold text-sm md:text-base break-all">{CONTACT_EMAIL}</p>
                                </div>
                            </a>
                        </div>

                        <div className="mt-8 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl relative z-10 transition-all hover:bg-brand-primary/10">
                            <h4 className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase mb-3 tracking-wider">
                                <AlertTriangle size={14} /> Para ayudarte más rápido dinos:
                            </h4>
                            <ul className="text-xs text-[var(--theme-text-secondary)] space-y-1.5 list-disc pl-4 font-medium">
                                <li>¿Qué problema tuviste? (puedes mandarnos una foto)</li>
                                <li>¿Cuál es tu correo y qué celular usas?</li>
                            </ul>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
