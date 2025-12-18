"use client";

import Link from "next/link";
import { ArrowLeft, Mail, HelpCircle, Shield, AlertTriangle, Check, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-metal-dark text-white font-sans selection:bg-metal-gold selection:text-black py-24 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft} className="text-metal-silver hover:text-white uppercase tracking-widest text-[10px]">
                            Volver al Inicio
                        </Button>
                    </Link>

                    <Badge variant="premium" className="mx-auto px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        Soporte 24/7
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-metal-gold via-white to-metal-gold">Ayuda</span>
                    </h1>
                    <p className="text-metal-silver/60 max-w-2xl mx-auto leading-relaxed">
                        Estamos aquí para ayudarte a sacar el máximo provecho de SaberPro.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid gap-12">

                    {/* FAQ Section */}
                    <Card variant="glass" className="p-8 md:p-10 border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-metal-gold/10 text-metal-gold">
                                <HelpCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Preguntas Frecuentes</h2>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { q: "¿Esta App es oficial del ICFES?", a: "No. SaberPro es una herramienta de simulación educativa independiente creada por el Ing. Antonio Rodríguez. No tenemos vinculación con el ICFES ni con el Gobierno Nacional." },
                                { q: "¿Las preguntas que aparecen aquí saldrán en el examen real?", a: "No podemos garantizarlo. Las preguntas son simulacros diseñados para que practiques la lógica y la estructura del examen, pero no son filtraciones de la prueba oficial." },
                                { q: "La App se cierra sola o va lenta.", a: "Por favor, asegúrate de tener la última versión instalada. Intenta borrar la memoria caché de la App en los ajustes de tu teléfono o prueba reinstalando." },
                                { q: "Olvidé mi contraseña.", a: "Utiliza la opción '¿Olvidaste tu contraseña?' en la pantalla de inicio para restablecerla vía correo electrónico." }
                            ].map((item, i) => (
                                <div key={i} className="bg-black/20 p-6 rounded-xl border border-white/5 hover:border-metal-gold/30 transition-colors group">
                                    <h3 className="font-bold text-white mb-2 text-sm flex items-start gap-2">
                                        <span className="text-metal-gold select-none font-black text-xs uppercase tracking-wider">P:</span> {item.q}
                                    </h3>
                                    <p className="text-xs text-metal-silver leading-relaxed pl-6 group-hover:text-white/80 transition-colors">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Contact Section */}
                    <Card variant="premium" className="p-8 md:p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3 rounded-xl bg-white/10 text-white">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Contacto Directo</h2>
                        </div>

                        <p className="mb-8 text-sm text-white/80 leading-relaxed relative z-10 font-medium">
                            Si tu problema persiste no dudes en escribirnos. El equipo de soporte (dirigido por el Ing. Antonio Rodríguez) responderá en <strong>24-48 horas hábiles</strong>.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            <a href="mailto:docenciainformatica2025@gmail.com" className="flex-1 bg-black/40 border border-white/10 p-6 rounded-xl flex items-center gap-6 hover:bg-black/60 transition-colors group hover:border-metal-gold/50">
                                <div className="p-4 bg-metal-gold text-black rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-metal-silver uppercase tracking-widest font-black mb-1">Correo de Soporte</p>
                                    <p className="text-white font-bold text-sm md:text-base break-all">docenciainformatica2025@gmail.com</p>
                                </div>
                            </a>
                        </div>

                        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl relative z-10">
                            <h4 className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase mb-3 tracking-wider">
                                <AlertTriangle size={14} /> Para una atención rápida incluye:
                            </h4>
                            <ul className="text-xs text-red-200/60 space-y-1.5 list-disc pl-4 font-medium">
                                <li>Asunto: "Soporte App SaberPro - [Descripción]"</li>
                                <li>Tu correo registrado y dispositivo (Ej: iPhone 13, Android).</li>
                                <li>Captura de pantalla del error (si aplica).</li>
                            </ul>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
