"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Send, 
    Bot, 
    User, 
    MessageSquare, 
    X, 
    Phone, 
    Mail, 
    Sparkles,
    CheckCircle2,
    Loader2,
    ChevronDown,
    ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL, SUPPORT_WHATSAPP, PAYMENTS_WHATSAPP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { saveGabrielaLead } from "@/services/marketing/leads.service";

interface Message {
    id: string;
    role: 'bot' | 'user';
    content: string;
    timestamp: Date;
    type?: 'text' | 'options' | 'form';
    options?: { label: string; value: string; action?: string }[];
}

export default function SupportChat({ isGlobal = false }: { isGlobal?: boolean }) {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(!isGlobal);
    const [step, setStep] = useState<'initial' | 'asking_name' | 'asking_need' | 'ready' | 'capturing_email'>('initial');
    const [userData, setUserData] = useState({ name: '', need: '', email: '' });
    const [leadCaptured, setLeadCaptured] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'bot',
            content: "¡Hola! Soy Gabriela, tu guía en SaberPro. 😊 ¿Cómo te va hoy? Cuéntame en qué puedo darte una mano.",
            timestamp: new Date(),
            type: 'options',
            options: [
                { label: "🎯 Practicar simulacro", value: "simulacro" },
                { label: "💎 Saber del plan Pro", value: "suscripcion" },
                { label: "💳 Pagos por Nequi", value: "pago" },
                { label: "🙋 Charlar con alguien", value: "humano_flow" }
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleOptionClick = (option: { label: string; value: string; action?: string }) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: option.label,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        processBotResponse(option.value);
    };

    const addBotMessage = (content: string, type: 'text' | 'options' = 'text', options?: any[]) => {
        const msg: Message = {
            id: Date.now().toString(),
            role: 'bot',
            content,
            timestamp: new Date(),
            type,
            options
        };
        setMessages(prev => [...prev, msg]);
    };

    const matchIntent = (text: string) => {
        const t = text.toLowerCase();
        if (t.includes("pago") || t.includes("nequi") || t.includes("comprar") || t.includes("pagar") || t.includes("precio") || t.includes("costo") || t.includes("valor") || t.includes("membresia") || t.includes("tarjeta")) return "pago";
        if (t.includes("simulacro") || t.includes("practicar") || t.includes("entrenar") || t.includes("examen") || t.includes("prueba") || t.includes("diagnostico") || t.includes("preguntas")) return "simulacro";
        if (t.includes("pro") || t.includes("premium") || t.includes("ventajas") || t.includes("beneficios") || t.includes("mejorar") || t.includes("suscripcion")) return "suscripcion";
        if (t.includes("ayuda") || t.includes("persona") || t.includes("humano") || t.includes("asesor") || t.includes("soporte") || t.includes("contacto") || t.includes("hablar")) return "humano_flow";
        if (t.includes("hola") || t.includes("buenos") || t.includes("saludos") || t.includes("hey")) return "restart";
        if (t.includes("gracias") || t.includes("listo") || t.includes("vale") || t.includes("entendido")) return "final_thanks";
        return "unknown";
    };

    const processBotResponse = (value: string) => {
        setIsTyping(true);
        setTimeout(() => {
            const lowercaseValue = value.toLowerCase();

            if (value === "humano_flow") {
                setStep('asking_name');
                addBotMessage("¡Claro! Me encantaría presentarte con alguien del equipo. Para empezar, ¿me dices cómo te llamas?");
            } else if (lowercaseValue.includes("simulacro")) {
                addBotMessage("Nuestros ejercicios son igualitos a los del examen real. Te aconsejo empezar con el Diagnóstico para que sepas qué repasar primero.", 'options', [
                    { label: "🚀 Empezar ahora", value: "start_diagnostic" },
                    { label: "📚 Guías de estudio", value: "help_center" },
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("suscripcion") || lowercaseValue.includes("pro")) {
                addBotMessage("Con el plan PRO puedes practicar todas las veces que quieras y ver tus fallos explicados. ¡Es la clave para un buen puntaje!", 'options', [
                    { label: "💎 Ver el plan Pro", value: "pricing" },
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("pago")) {
                addBotMessage("¡Súper fácil! Recibimos Nequi, tarjetas y PSE. Si prefieres Nequi, te paso los datos por WhatsApp de una.", 'options', [
                    { label: "📲 Pagar por Nequi", value: "whatsapp_payment" },
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            } else if (value === "final_thanks") {
                addBotMessage("¡Con gusto! ✨ Estaré aquí si necesitas algo más. ¡A darle con toda al estudio!", 'options', [
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            } else if (value === "start_diagnostic") {
                window.location.href = "/diagnostic";
                addBotMessage("¡Listo! Te estoy llevando al diagnóstico. ¡Dale con toda!");
            } else if (value === "whatsapp_support") {
                const text = userData.name ? `Hola,%20soy%20${userData.name}.%20Necesito%20ayuda%20con:%20${userData.need || 'la app'}` : 'Hola,%20necesito%20ayudita%20con%20SaberPro';
                window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`, '_blank');
                addBotMessage("Ya te abrí el chat. ¡En un momento te atienden!", 'options', [{ label: "🏠 Menú principal", value: "restart" }]);
            } else if (value === "whatsapp_payment") {
                window.open(`https://wa.me/${PAYMENTS_WHATSAPP}?text=Hola,%20quiero%20pagar%20mi%20suscripción%20por%20Nequi`, '_blank');
                addBotMessage("Escríbenos por WhatsApp para darte los datos y activarte rápido.", 'options', [{ label: "🏠 Menú principal", value: "restart" }]);
            } else if (value === "restart") {
                setStep('initial');
                addBotMessage("¿En qué más puedo ayudarte hoy? Recuerda que soy tu guía 24/7.", 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "💎 Plan Pro", value: "suscripcion" },
                    { label: "🙋 Charla Humana", value: "humano_flow" }
                ]);
            } else if (value.startsWith("custom_")) {
                const userQuery = value.replace("custom_", "");
                const intent = matchIntent(userQuery);
                
                // Track intent for marketing if possible
                if (intent !== "unknown" && !leadCaptured && step === 'initial') {
                    setStep('capturing_email');
                    addBotMessage(`¡Excelente pregunta sobre ${intent}! 😊 Me encantaría darte una asesoría premium. ¿Me regalas tu nombre y tu mejor correo para enviarte información exclusiva?`);
                } else if (intent !== "unknown") {
                    processBotResponse(intent);
                } else {
                    addBotMessage("¡Qué buena pregunta! 😊 Aún estoy aprendiendo, pero puedo ayudarte con simulacros, planes PRO o comunicarte con el equipo. ¿Qué prefieres?", 'options', [
                        { label: "🎯 Simulacros", value: "simulacro" },
                        { label: "💎 Plan Pro", value: "suscripcion" },
                        { label: "🙋 Charla Humana", value: "humano_flow" }
                    ]);
                }
            } else {
                addBotMessage("¡Entendido! 😊 ¿Qué más te gustaría saber para lograr tu éxito hoy?", 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            }
            setIsTyping(false);
        }, 800);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const msg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
        const currentInput = inputValue;
        setInputValue("");

        if (step === 'asking_name') {
            setUserData(prev => ({ ...prev, name: currentInput }));
            setStep('asking_need');
            setIsTyping(true);
            setTimeout(() => {
                addBotMessage(`¡Mucho gusto, ${currentInput}! ✨ ¿Cuéntame qué necesitas para conectarte con la persona adecuada?`);
                setIsTyping(false);
            }, 600);
        } else if (step === 'asking_need') {
            setUserData(prev => ({ ...prev, need: currentInput }));
            setStep('ready');
            setIsTyping(true);
            setTimeout(() => {
                addBotMessage("¡Entendido! Ya tengo todo. ¿Por dónde prefieres que hablemos?", 'options', [
                    { label: "📲 Por WhatsApp", value: "whatsapp_support" },
                    { label: "📧 Por Correo", value: "email_form" }
                ]);
                setIsTyping(false);
            }, 600);
        } else if (step === 'capturing_email' || (currentInput.includes('@') && !leadCaptured)) {
            // Subtle capture
            const emailMatch = currentInput.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const capturedEmail = emailMatch ? emailMatch[0] : '';
            
            if (capturedEmail) {
                setUserData(prev => ({ ...prev, email: capturedEmail }));
                setLeadCaptured(true);
                setStep('initial');
                saveGabrielaLead({
                    name: userData.name || 'Anónimo',
                    email: capturedEmail,
                    intent: 'general_inquiry'
                });
                addBotMessage("¡Listo! Ya te tengo en mi lista VIP. ✨ ¿En qué estábamos? Ah sí, cuéntame más sobre tu duda.");
            } else {
                setUserData(prev => ({ ...prev, name: currentInput }));
                addBotMessage("¡Genial! Y ahora, ¿a qué correo te puedo enviar las guías?");
            }
        } else {
            processBotResponse("custom_" + currentInput.toLowerCase());
        }
    };

    if (!mounted) return null;

    return (
        <>
            {isGlobal && (
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "fixed bottom-24 right-4 z-[60] w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 md:w-16 md:h-16 md:bottom-8 md:right-8 overflow-hidden border-4 border-white dark:border-slate-800 group",
                        isOpen && "scale-0 opacity-0 pointer-events-none"
                    )}
                >
                    <img 
                        src="/gabriela-avatar.png?v=2" 
                        alt="Gabriela" 
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand-success rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                    
                    {/* Floating Help Label */}
                    <div className="absolute -top-12 right-0 bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl animate-bounce md:group-hover:flex">
                        ¿Tienes dudas? ¡Pregúntame!
                        <div className="absolute bottom-[-4px] right-6 w-2 h-2 bg-brand-primary rotate-45" />
                    </div>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={isGlobal ? { opacity: 0, scale: 0.9, y: 50, x: 20 } : { opacity: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        className={cn(
                            "z-[100] flex flex-col",
                            isGlobal 
                                ? "fixed bottom-0 right-0 w-full h-full md:bottom-24 md:right-8 md:w-[380px] md:h-[550px] shadow-4k md:rounded-3xl" 
                                : "w-full h-full"
                        )}
                    >
                        <Card variant="primary" className="flex-1 flex flex-col p-0 overflow-hidden border-brand-primary/20 backdrop-blur-3xl bg-[var(--theme-bg-surface)]/90 md:rounded-3xl shadow-2xl">
                            {/* Header */}
                            <div className="bg-brand-primary p-5 text-white flex justify-between items-center shadow-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 animate-pulse" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center relative shadow-inner rotate-3 overflow-hidden">
                                        <img 
                                            src="/gabriela-avatar.png?v=2" 
                                            alt="Gabriela" 
                                            className="w-full h-full object-cover -rotate-3 scale-110"
                                        />
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-success border-2 border-brand-primary rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-tighter">Gabriela</h3>
                                        <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                                            En línea contigo
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        console.log("Cerrando chat...");
                                        setIsOpen(false);
                                    }} 
                                    className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition-all active:scale-95 shadow-lg group z-[110] touch-none"
                                    aria-label="Cerrar chat"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300 pointer-events-none" />
                                </button>
                            </div>

                            {/* Chat Body */}
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-[var(--theme-bg-base)]/50 to-[var(--theme-bg-surface)]/50 scroll-smooth"
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            >
                                {messages.map(msg => (
                                    <div key={msg.id} className={cn(
                                        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        msg.role === 'bot' ? "items-start" : "items-end flex-row-reverse"
                                    )}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex-shrink-0 overflow-hidden mt-1 border border-brand-primary/10">
                                                <img src="/gabriela-avatar.png?v=2" alt="G" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1.5 max-w-[85%]">
                                            <div className={cn(
                                                "p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm",
                                                msg.role === 'bot' 
                                                    ? "bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)] rounded-tl-none border border-[var(--theme-border-soft)]" 
                                                    : "bg-brand-primary text-white rounded-tr-none shadow-brand-primary/20 shadow-lg"
                                            )}>
                                                {msg.content}
                                            </div>
                                            
                                            {msg.type === 'options' && msg.options && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {msg.options.map((opt, i) => (
                                                        <button 
                                                            key={i}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all bg-[var(--theme-bg-surface)] shadow-sm active:scale-95"
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-center gap-2 text-brand-primary/60">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Escribiendo...</span>
                                    </div>
                                )}
                            </div>

                            {/* Input Footer */}
                            <div className="p-4 bg-[var(--theme-bg-surface)] border-t border-[var(--theme-border-soft)] relative z-20 mt-auto">
                                {/* Suggestion Chips */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1 -mx-2 px-2 scroll-smooth">
                                    {[
                                        "¿Cuánto vale el Plan Pro?", 
                                        "¿Cómo pago por Nequi?", 
                                        "¿Tienen simulacros gratis?",
                                        "Quiero hablar con alguien"
                                    ].map((hint, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => {
                                                setInputValue(hint);
                                            }}
                                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-[9px] font-bold text-brand-primary hover:bg-brand-primary/10 transition-colors active:scale-95 shadow-sm"
                                        >
                                            {hint}
                                        </button>
                                    ))}
                                </div>

                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex items-center gap-2 relative"
                                >
                                    <input 
                                        type="text" 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Escribe tu duda aquí..."
                                        className="flex-1 h-12 bg-[var(--theme-bg-base)] rounded-2xl px-5 text-sm font-semibold border border-[var(--theme-border-soft)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:opacity-50"
                                        autoComplete="off"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/25 disabled:opacity-50 disabled:scale-100 disabled:shadow-none shrink-0"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                                
                                <div className="mt-4 flex justify-around border-t border-[var(--theme-border-soft)] pt-3 opacity-70">
                                    <button onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank')} className="flex flex-col items-center gap-1 group">
                                        <Phone size={14} className="text-brand-success group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] font-black uppercase text-[var(--theme-text-tertiary)]">Ventas</span>
                                    </button>
                                    <button onClick={() => window.location.href = `mailto:${CONTACT_EMAIL}`} className="flex flex-col items-center gap-1 group">
                                        <Mail size={14} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] font-black uppercase text-[var(--theme-text-tertiary)]">Correo</span>
                                    </button>
                                    <button onClick={() => window.open(`https://wa.me/${PAYMENTS_WHATSAPP}`, '_blank')} className="flex flex-col items-center gap-1 group">
                                        <Sparkles size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] font-black uppercase text-[var(--theme-text-tertiary)]">Pagar</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
