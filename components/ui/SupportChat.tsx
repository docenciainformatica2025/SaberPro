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
import { CONTACT_EMAIL, SUPPORT_WHATSAPP, PAYMENTS_WHATSAPP, NEQUI_NUMBER, DIRECT_CONTACT_NUMBER } from "@/lib/config";
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

    const addBotMessage = (content: string, type: 'text' | 'options' = 'text', options?: Message['options']) => {
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
                    addBotMessage("El Plan PRO es nuestra experiencia élite para asegurar tu éxito. 🚀\n\nBeneficios exclusivos:\n- 🤖 IA Explicativa: Análisis profundo de cada respuesta.\n- 🎯 Simulacros Ilimitados: Entrena sin restricciones.\n- 📊 Analítica Predictiva: Reportes de competencia avanzados.\n- 💎 Contenido Total: Acceso a toda la biblioteca SaberPro.\n- 🚀 Soporte VIP 24/7: Atención prioritaria constante.\n\n¿Te gustaría ver los precios o prefieres un upgrade inmediato?", 'options', [
                        { label: "💎 Ver Planes y Precios", value: "pricing" },
                        { label: "📲 Upgrade por Nequi", value: "whatsapp_payment" },
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
                    { label: "📲 Instrucciones Nequi", value: "whatsapp_payment" },
                    { label: "💳 Pagar con Tarjeta", value: "pricing" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (value === "whatsapp_payment") {
                addBotMessage(`¡Excelente decisión, ${userName}! 💎 Para activar tu Plan PRO vía Nequi:\n\n1. Transfiere al número: **${NEQUI_NUMBER}**.\n2. Envía el comprobante al WhatsApp de asistencia: **${SUPPORT_WHATSAPP.replace('57', '')}**.\n3. Recibirás tu código de activación Pro al instante.\n\n¿Te gustaría que te redirija a WhatsApp para enviar el comprobante?`, 'options', [
                    { label: "📲 Enviar Comprobante", value: "whatsapp_support" },
                    { label: "🏠 Menú Principal", value: "restart" }
                ]);
            } else if (value === "pricing") {
                addBotMessage(`¡Perfecto! Te redirijo a nuestra página de planes donde podrás ver todas las opciones y beneficios detallados que te comenté. ✨`);
                setTimeout(() => window.location.href = "/pricing", 1500);
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
                        "fixed bottom-28 right-4 z-[999] w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-4k flex items-center justify-center hover:scale-110 transition-all active:scale-95 md:w-16 md:h-16 md:bottom-8 md:right-8 overflow-hidden border-4 border-[var(--theme-bg-surface)] group animate-pulse",
                        isOpen && "scale-0 opacity-0 pointer-events-none"
                    )}
                >
                    <img 
                        src="/gabriela-avatar-3d.png" 
                        alt="Gabriela" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-success rounded-full border-2 border-[var(--theme-bg-surface)] shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20" />
                    
                    {/* Floating Help Label */}
                    <div className="absolute -top-14 right-0 bg-brand-primary text-black text-[9px] font-black px-4 py-2 rounded-xl whitespace-nowrap shadow-4k animate-bounce md:group-hover:flex uppercase tracking-widest border border-white/20">
                        ¿Hablamos?
                        <div className="absolute bottom-[-4px] right-6 w-2 h-2 bg-brand-primary rotate-45" />
                    </div>
                </button>
            )}

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div 
                        initial={isGlobal ? { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" } : { opacity: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                            "z-[500] flex flex-col bg-[var(--theme-bg-surface)]/80 shadow-4k overflow-hidden border border-brand-primary/10 antialiased backdrop-blur-3xl organic-border",
                            isGlobal 
                                ? "fixed inset-0 md:inset-auto md:bottom-28 md:right-8 w-full md:w-[420px] h-[100dvh] md:h-[700px] md:max-h-[85vh] md:rounded-[2.5rem]" 
                                : "w-full h-full rounded-2xl"
                        )}
                        id="gabriela-window"
                    >
                        {/* Persistent Header - Maestro Style */}
                        <div className="shrink-0 bg-brand-primary p-6 text-black flex justify-between items-center relative overflow-hidden z-20 shadow-xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 animate-pulse pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex-shrink-0 overflow-hidden border border-white/30 shadow-inner group-hover:scale-110 transition-transform">
                                    <img 
                                        src="/gabriela-avatar-3d.png" 
                                        alt="Gabriela" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg uppercase tracking-tightest leading-none mb-1 font-academic italic">Gabriela</h3>
                                    <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        Sincronizada
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                aria-label="Cerrar chat de soporte"
                                className="bg-black/5 hover:bg-black/10 p-3 rounded-2xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Flexible Scroll Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-grow min-h-0 overflow-y-auto p-6 scroll-smooth d-flex flex-col gap-8 custom-scrollbar bg-gradient-to-b from-[var(--theme-bg-base)]/50 to-[var(--theme-bg-surface)]/20"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            <div className="space-y-8 flex flex-col">
                                {messages.map((msg, idx) => (
                                    <div key={msg.id || idx} className={cn(
                                        "flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-500",
                                        msg.role === 'user' && "flex-row-reverse"
                                    )}>
                                        {msg.role === 'bot' && (
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex-shrink-0 overflow-hidden mt-1 border border-[var(--theme-border-soft)] shadow-inner">
                                                <img src="/gabriela-avatar-3d.png" alt="Avatar de Gabriela" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "flex flex-col gap-2.5 max-w-[85%]",
                                            msg.role === 'user' && "items-end"
                                        )}>
                                            <div className={cn(
                                                "p-5 rounded-3xl text-[13px] font-medium leading-[1.6] shadow-2xl",
                                                msg.role === 'bot' 
                                                    ? "bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-tl-none italic text-[var(--theme-text-primary)]" 
                                                    : "bg-brand-primary text-[var(--brand-primary-fg, black)] rounded-tr-none font-black shadow-brand-primary/20"
                                            )}>
                                                {msg.content}
                                            </div>
                                            
                                            {msg.type === 'options' && msg.options && (
                                                <div className="flex flex-wrap gap-2.5 mt-2">
                                                    {msg.options.map((opt, i) => (
                                                        <button 
                                                            key={i}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-2xl border border-[var(--theme-border-medium)] text-[var(--theme-text-primary)] hover:bg-brand-primary hover:text-[var(--brand-primary-fg, #000)] hover:border-brand-primary transition-all bg-[var(--theme-bg-surface)] shadow-lg active:scale-95 shimmer-gold"
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
                                    <div className="flex items-center gap-3 text-brand-primary pl-13">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Sincronizando...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Persistent Footer - Maestro Style */}
                        <div className="shrink-0 p-6 bg-[var(--theme-bg-surface)]/90 border-t border-[var(--theme-border-soft)] z-30 shadow-4k backdrop-blur-xl">
                            {/* Suggestions */}
                            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
                                {[
                                    "¿Cuánto vale el Plan Pro?", 
                                    "¿Cómo pago por Nequi?", 
                                    "¿Tienen simulacros gratis?",
                                    "Soporte VIP"
                                ].map((hint, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setInputValue(hint)}
                                        className="whitespace-nowrap px-5 py-2.5 rounded-3xl bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] hover:border-brand-primary hover:text-brand-primary transition-all flex-shrink-0 shadow-sm"
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>

                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-3"
                            >
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Dialoguemos sobre tu futuro..."
                                    className="flex-1 h-14 bg-[var(--theme-bg-base)] rounded-2xl px-6 text-[13px] font-bold border border-[var(--theme-border-soft)] focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-[var(--theme-text-quaternary)]/40 shadow-inner"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-14 h-14 rounded-2xl bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/25 disabled:opacity-50 shrink-0 organic-border-reverse"
                                >
                                    <Send size={20} strokeWidth={2.5} />
                                </button>
                            </form>

                            {/* Contact Links */}
                            <div className="mt-6 flex justify-around items-center border-t border-[var(--theme-border-soft)] pt-4 opacity-100">
                                <button onClick={() => window.open(`tel:${DIRECT_CONTACT_NUMBER}`, '_self')} className="flex flex-col items-center gap-1.5 group">
                                    <div className="p-2 bg-brand-success/5 rounded-xl group-hover:bg-brand-success/10 transition-colors">
                                        <Phone size={14} className="text-brand-success group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] group-hover:text-brand-success transition-colors">Asistencia</span>
                                </button>
                                <button onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank')} className="flex flex-col items-center gap-1.5 group">
                                    <div className="p-2 bg-brand-primary/5 rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                                        <MessageSquare size={14} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] group-hover:text-brand-primary transition-colors">WhatsApp VIP</span>
                                </button>
                                <button onClick={() => handleOptionClick({ label: 'Upgrade PRO', value: 'whatsapp_payment' })} className="flex flex-col items-center gap-1.5 group">
                                    <div className="p-2 bg-brand-primary/5 rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                                        <Sparkles size={14} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] group-hover:text-brand-primary transition-colors">Upgrade</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
