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
import { useAuth } from "@/context/AuthContext";
import { SubscriptionPlan } from "@/types/finance";

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
    const [step, setStep] = useState<'initial' | 'asking_name' | 'asking_phone' | 'asking_email' | 'ready' | 'capturing_leads'>('initial');
    const [userData, setUserData] = useState({ name: '', phone: '', email: '', intent: '' });
    const [leadCaptured, setLeadCaptured] = useState(false);

    const { user, profile, subscription } = useAuth();
    const isPro = subscription?.plan === SubscriptionPlan.PRO;
    const userName = profile?.fullName?.split(' ')[0] || "estudiante";

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone: string) => /^[0-9]{10,15}$/.test(phone.replace(/\s/g, ''));

    // Mount handling
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial message based on Auth state
    useEffect(() => {
        if (mounted && messages.length === 0) {
            const welcomeMsg = user 
                ? `¡Hola de nuevo, ${userName}! ✨ Qué alegría verte por aquí. ${isPro ? 'Como usuario PRO, tienes acceso total.' : '¿Listo para llevar tu estudio al siguiente nivel?'} ¿En qué te ayudo hoy?`
                : "¡Hola! Soy Gabriela, tu guía en SaberPro. 😊 ¿Cómo te va hoy? Cuéntame en qué puedo darte una mano.";
            
            setMessages([{
                id: '1',
                role: 'bot',
                content: welcomeMsg,
                timestamp: new Date(),
                type: 'options',
                options: isPro ? [
                    { label: "🚀 Simulacros", value: "simulacro" },
                    { label: "📊 Mi Progreso", value: "progress" },
                    { label: "🙋 Soporte VIP", value: "humano_flow" }
                ] : [
                    { label: "🎯 Practicar simulacro", value: "simulacro" },
                    { label: "💎 Saber del plan Pro", value: "suscripcion" },
                    { label: "💳 Pagos por Nequi", value: "pago" },
                    { label: "🙋 Charlar con alguien", value: "humano_flow" }
                ]
            }]);
        }
    }, [mounted, user, profile, isPro, userName]);

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
        if (t.includes("pago") || t.includes("nequi") || t.includes("comprar") || t.includes("pagar") || t.includes("precio") || t.includes("costo") || t.includes("valor") || t.includes("membresia") || t.includes("tarjeta") || t.includes("cuanto vale")) return "pago";
        if (t.includes("simulacro") || t.includes("practicar") || t.includes("entrenar") || t.includes("examen") || t.includes("prueba") || t.includes("diagnostico") || t.includes("preguntas") || t.includes("test")) return "simulacro";
        if (t.includes("pro") || t.includes("premium") || t.includes("ventajas") || t.includes("beneficios") || t.includes("mejorar") || t.includes("suscripcion") || t.includes("beneficio")) return "suscripcion";
        if (t.includes("ayuda") || t.includes("persona") || t.includes("humano") || t.includes("asesor") || t.includes("soporte") || t.includes("contacto") || t.includes("hablar") || t.includes("chat") || t.includes("numero") || t.includes("whatsapp")) return "humano_flow";
        if (t.includes("como funciona") || t.includes("metodo") || t.includes("metodologia") || t.includes("estudiar") || t.includes("enseñan") || t.includes("paso")) return "methodology";
        if (t.includes("hola") || t.includes("buenos") || t.includes("saludos") || t.includes("hey") || t.includes("que tal")) return "restart";
        if (t.includes("gracias") || t.includes("listo") || t.includes("vale") || t.includes("entendido") || t.includes("chao") || t.includes("adios")) return "final_thanks";
        return "unknown";
    };

    const processBotResponse = (value: string) => {
        setIsTyping(true);
        setTimeout(() => {
            const lowercaseValue = value.toLowerCase();
            
            // INTEL: Anti-loop check. If we already have the data or user is logged in, skip lead steps
            const hasBasicInfo = !!(user || (userData.name && userData.email));

            if (value === "humano_flow") {
                if (user || leadCaptured) {
                    addBotMessage(`¡Claro que sí, ${userName}! Te conecto de inmediato con mi equipo humano. 🚀`, 'options', [
                        { label: "📲 WhatsApp Soporte", value: "whatsapp_support" },
                        { label: "🏠 Menú Principal", value: "restart" }
                    ]);
                } else {
                    setStep('asking_name');
                    addBotMessage("¡Me encantaría presentarte a uno de mis compañeros especialistas! Pero primero, para darte una atención profesional, ¿cuál es tu nombre?");
                }
            } else if (lowercaseValue.includes("methodology")) {
                addBotMessage("Nuestra metodología se basa en la neurociencia aplicada: 1. Diagnóstico preciso, 2. Micro-entrenamientos diarios personalizados y 3. Simulacros de alta fidelidad. ¿Te gustaría ver cómo la IA personaliza tu estudio?", 'options', [
                    { label: "🚀 Probar Diagnóstico", value: "start_diagnostic" },
                    { label: "💎 Ver Plan Pro", value: "pricing" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("simulacro")) {
                const simulacroMsg = isPro 
                    ? `¡A por ese gran puntaje, ${userName}! Tienes acceso total. ¿Quieres iniciar un módulo específico o revisar tus áreas de mejora en el dashboard?`
                    : "Nuestros simulacros replican exactamente la experiencia del examen real. 🎯 Te recomiendo iniciar con el Diagnóstico Gratuito para que identifiquemos tus fortalezas hoy mismo.";
                
                addBotMessage(simulacroMsg, 'options', isPro ? [
                    { label: "🚀 Nuevo Módulo", value: "start_diagnostic" },
                    { label: "📊 Ver Análisis de Fallos", value: "progress" },
                    { label: "🏠 Menú", value: "restart" }
                ] : [
                    { label: "🚀 Diagnóstico Gratis", value: "start_diagnostic" },
                    { label: "📚 Guías de Estudio", value: "help_center" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("suscripcion") || lowercaseValue.includes("pro")) {
                if (isPro) {
                    addBotMessage(`¡Ya eres parte de la élite Premium! ✨ Tienes desbloqueado el motor predictivo de IA. ¿Quieres ver tus proyecciones de puntaje en el dashboard?`, 'options', [
                        { label: "📈 Ver Mi Dashboard", value: "progress" },
                        { label: "🏠 Menú", value: "restart" }
                    ]);
                } else {
                    addBotMessage("El Plan PRO te otorga la ventaja competitiva definitiva: IA explicativa en cada pregunta, simulacros ilimitados y reportes detallados por competencia. ¿Quieres conocer los precios actuales?", 'options', [
                        { label: "💎 Ver Planes y Precios", value: "pricing" },
                        { label: "📲 Consultar en WhatsApp", value: "whatsapp_payment" },
                        { label: "🏠 Menú", value: "restart" }
                    ]);
                }
            } else if (lowercaseValue.includes("pago")) {
                const paymentMsg = isPro 
                    ? "¡Tu suscripción PRO está activa y al día! 💎 Si necesitas ayuda administrativa o una factura especial, aquí estoy." 
                    : "Manejamos Nequi, Tarjetas y PSE de forma 100% segura. Si prefieres un proceso manual por Nequi, te daré los datos directos. ¿Qué prefieres?";
                
                addBotMessage(paymentMsg, 'options', isPro ? [
                    { label: "🙋 Soporte VIP", value: "humano_flow" },
                    { label: "🏠 Menú", value: "restart" }
                ] : [
                    { label: "📲 Datos para Nequi", value: "whatsapp_payment" },
                    { label: "💳 Pagar con Tarjeta", value: "pricing" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (value === "progress") {
                addBotMessage(`¡Entendido! Te estoy redirigiendo a tu análisis de progreso... 📈`);
                setTimeout(() => window.location.href = "/dashboard", 1000);
            } else if (value === "final_thanks") {
                addBotMessage("¡Ha sido un gusto ayudarte! ✨ Estaré aquí si necesitas algo más. ¡Mucho éxito en tu preparación!", 'options', [
                    { label: "🏠 Volver al inicio", value: "restart" }
                ]);
            } else if (value === "start_diagnostic") {
                addBotMessage("Excelente. Preparando tu entorno de diagnóstico... 🎯 Recuerda leer cada pregunta con calma.");
                setTimeout(() => window.location.href = "/diagnostic", 1000);
            } else if (value.startsWith("custom_")) {
                const userQuery = value.replace("custom_", "");
                const intent = matchIntent(userQuery);
                
                // Profesional Logic: Only trigger lead capture if UNKNOWN or specific intent and NO basic info
                if (!hasBasicInfo && !leadCaptured && step === 'initial') {
                    setUserData(prev => ({ ...prev, intent: intent }));
                    setStep('capturing_leads');
                    addBotMessage(`¡Excelente punto! 😊 Para darte una respuesta profesional y enviarte material de apoyo, ¿me regalas tu nombre?`);
                } else if (intent !== "unknown") {
                    processBotResponse(intent);
                } else {
                    addBotMessage("Aún estoy afinando mis conocimientos sobre ese tema en particular. Sin embargo, puedo ayudarte con simulacros, planes PRO o escalarte con mi equipo experto. ¿Qué prefieres?", 'options', [
                        { label: "🎯 Simulacros", value: "simulacro" },
                        { label: "💎 Plan Pro", value: "suscripcion" },
                        { label: "🙋 Charla Humana", value: "humano_flow" }
                    ]);
                }
            } else if (value === "restart") {
                setStep('ready'); // Avoid looping back to questions if restart is clicked
                addBotMessage(`¡Hola de nuevo! Aquí tienes el menú principal. ¿En qué puedo enfocarnos ahora?`, 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "💎 Plan Pro", value: "suscripcion" },
                    { label: "🙋 Charla Humana", value: "humano_flow" }
                ]);
            } else {
                addBotMessage("Perfecto. 😊 ¿Hay algo más en lo que pueda apoyarte para garantizar tu ingreso a la educación superior?", 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "🏠 Menú Principal", value: "restart" }
                ]);
            }
            setIsTyping(false);
        }, 800);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const currentInput = inputValue.trim();
        const msg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: currentInput,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
        setInputValue("");

        if (step === 'asking_name') {
            const name = currentInput.trim();
            setUserData(prev => ({ ...prev, name }));
            setStep('asking_phone');
            setIsTyping(true);
            setTimeout(() => {
                const firstName = name.split(' ')[0];
                addBotMessage(`¡Mucho gusto, ${firstName}! ✨ ¿Me regalas tu número de celular o WhatsApp para que un asesor te contacte si es necesario?`);
                setIsTyping(false);
            }, 600);
        } else if (step === 'asking_phone') {
            if (validatePhone(currentInput)) {
                setUserData(prev => ({ ...prev, phone: currentInput }));
                setStep('asking_email');
                setIsTyping(true);
                setTimeout(() => {
                    addBotMessage("¡Perfecto! Ya casi terminamos. ¿Cuál es tu mejor correo electrónico para enviarte la información?");
                    setIsTyping(false);
                }, 600);
            } else {
                addBotMessage("Ese número no me parece correcto. ¿Podrías escribirlo de nuevo con el código de país o 10 dígitos? (Ej: 3001234567)");
            }
        } else if (step === 'asking_email') {
            if (validateEmail(currentInput)) {
                setUserData(prev => ({ ...prev, email: currentInput }));
                setStep('ready');
                setIsTyping(true);
                setLeadCaptured(true);
                
                saveGabrielaLead({
                    name: userData.name,
                    phone: userData.phone,
                    email: currentInput,
                    intent: userData.intent || 'general_inquiry'
                });

                setTimeout(() => {
                    addBotMessage("¡Excelente! Ya tengo tus datos a salvo. ✨ En breve un experto te contactará. Mientras tanto, ¿por dónde prefieres hablar?", 'options', [
                        { label: "📲 Por WhatsApp", value: "whatsapp_support" },
                        { label: "🏠 Menú Principal", value: "restart" }
                    ]);
                    setIsTyping(false);
                }, 600);
            } else {
                addBotMessage("Ese correo no parece válido. ¿Me lo repites para asegurar que te llegue la info?");
            }
        } else if (step === 'capturing_leads') {
            // Smart spontaneous capture logic
            if (!userData.name) {
                setUserData(prev => ({ ...prev, name: currentInput }));
                addBotMessage(`¡Qué buen nombre! 😊 ¿Y a qué número de WhatsApp podemos contactarte?`);
            } else if (!userData.phone) {
                if (validatePhone(currentInput)) {
                    setUserData(prev => ({ ...prev, phone: currentInput }));
                    addBotMessage("¡Súper! Y por último, regálame tu correo electrónico para que el equipo tenga toda la base lista.");
                } else {
                    addBotMessage("Porfa, escribe un número de celular válido.");
                }
            } else if (!userData.email) {
                if (validateEmail(currentInput)) {
                    setUserData(prev => ({ ...prev, email: currentInput }));
                    setLeadCaptured(true);
                    setStep('ready');
                    saveGabrielaLead({
                        name: userData.name,
                        phone: userData.phone,
                        email: currentInput,
                        intent: userData.intent || 'spontaneous_lead'
                    });
                    addBotMessage("¡Listo! Ahora sí, sigamos adelante. ¿En qué estábamos? Cuéntame más sobre tu duda.");
                } else {
                    addBotMessage("Ese correo no parece correcto. ¿Lo intentamos de nuevo?");
                }
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
                    id="gabriela-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "fixed bottom-28 right-4 z-[999] w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 md:w-16 md:h-16 md:bottom-8 md:right-8 overflow-hidden border-4 border-white dark:border-slate-800 group",
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
                        initial={isGlobal ? { opacity: 0, scale: 0.95, y: 30 } : { opacity: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className={cn(
                            "z-[500] flex flex-col bg-[var(--theme-bg-surface)] shadow-2xl overflow-hidden border border-brand-primary/10 antialiased",
                            isGlobal 
                                ? "fixed inset-0 md:inset-auto md:bottom-24 md:right-8 w-full md:w-[400px] h-[100dvh] md:h-[650px] md:max-h-[85vh] md:rounded-[2rem] backdrop-blur-xl" 
                                : "w-full h-full rounded-2xl"
                        )}
                        id="gabriela-window"
                    >
                        {/* Persistent Header */}
                        <div className="shrink-0 bg-brand-primary p-5 text-white flex justify-between items-center relative overflow-hidden z-20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 animate-pulse pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center relative shadow-inner rotate-3 overflow-hidden border border-white/10 pointer-events-none">
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
                                        En línea
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition-all active:scale-90"
                                aria-label="Cerrar chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Flexible Scroll Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-grow min-h-0 overflow-y-auto p-5 scroll-smooth custom-scrollbar bg-gradient-to-b from-[var(--theme-bg-base)]/20 directly via-transparent to-[var(--theme-bg-surface)]/20"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            <div className="space-y-6 flex flex-col">
                                {messages.map((msg, idx) => (
                                    <div key={msg.id || idx} className={cn(
                                        "flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        msg.role === 'user' && "flex-row-reverse"
                                    )}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex-shrink-0 overflow-hidden mt-1 border border-brand-primary/5">
                                                <img src="/gabriela-avatar.png?v=2" alt="G" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "flex flex-col gap-1.5 max-w-[85%]",
                                            msg.role === 'user' && "items-end"
                                        )}>
                                            <div className={cn(
                                                "p-4 rounded-2xl text-[13px] font-medium leading-relaxed",
                                                msg.role === 'bot' 
                                                    ? "bg-white dark:bg-slate-900 border border-[var(--theme-border-soft)] rounded-tl-none shadow-sm" 
                                                    : "bg-brand-primary text-white rounded-tr-none shadow-lg shadow-brand-primary/20"
                                            )}>
                                                {msg.content}
                                            </div>
                                            
                                            {msg.type === 'options' && msg.options && (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {msg.options.map((opt, i) => (
                                                        <button 
                                                            key={i}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all bg-white dark:bg-slate-900 shadow-sm"
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
                                        <span className="text-[9px] font-bold uppercase opacity-50">Gabriela está escribiendo...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Persistent Footer */}
                        <div className="shrink-0 p-5 bg-[var(--theme-bg-surface)] border-t border-[var(--theme-border-soft)] z-30 shadow-4k">
                            {/* Suggestions */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-1 px-1">
                                {[
                                    "¿Cuánto vale el Plan Pro?", 
                                    "¿Cómo pago por Nequi?", 
                                    "¿Tienen simulacros gratis?",
                                    "Hablar con un humano"
                                ].map((hint, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setInputValue(hint)}
                                        className="whitespace-nowrap px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-[10px] font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all flex-shrink-0"
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>

                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe tu duda aquí..."
                                    className="flex-1 h-12 bg-white dark:bg-slate-900 rounded-2xl px-5 text-[13px] font-semibold border border-[var(--theme-border-soft)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-[var(--theme-text-quaternary)] shadow-sm"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/25 disabled:opacity-50 shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </form>

                            {/* Contact Links */}
                            <div className="mt-4 flex justify-around items-center border-t border-[var(--theme-border-soft)] pt-3 opacity-90">
                                <button onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank')} className="flex flex-col items-center gap-1 group">
                                    <Phone size={14} className="text-brand-success group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase text-brand-success">Soporte</span>
                                </button>
                                <button onClick={() => window.location.href = `mailto:${CONTACT_EMAIL}`} className="flex flex-col items-center gap-1 group">
                                    <Mail size={14} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase text-brand-primary">Email</span>
                                </button>
                                <button onClick={() => window.open(`https://wa.me/${PAYMENTS_WHATSAPP}`, '_blank')} className="flex flex-col items-center gap-1 group">
                                    <Sparkles size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase text-yellow-600">Plan PRO</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
