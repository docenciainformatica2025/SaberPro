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

            if (value === "humano_flow") {
                const contactMsg = user 
                    ? `¡Oye! Claro que sí, ${userName}. Te voy a conectar directo con mi equipo. Son súper amables y te resolverán todo en un segundo. 🚀`
                    : "¡Me encantaría presentarte a uno de mis compañeros! Son expertos en ayudarte a pasar el examen. Primero, ¿cómo te llamas para poder presentarte?";
                
                if (user) {
                    addBotMessage(contactMsg, 'options', [
                        { label: "📲 Hablar por WhatsApp", value: "whatsapp_support" },
                        { label: "🏠 Menú", value: "restart" }
                    ]);
                } else {
                    setStep('asking_name');
                    addBotMessage(contactMsg);
                }
            } else if (lowercaseValue.includes("methodology")) {
                addBotMessage("¡Qué gran pregunta! En SaberPro no solo te damos preguntas, te entrenamos de verdad. 🧠 Nuestro método es: 1. Diagnóstico para ver dónde estás, 2. Entrenamiento diario con IA, y 3. Simulacros reales para pulir tiempo y nervios. ¿Quieres probar?", 'options', [
                    { label: "🚀 Probar Diagnóstico", value: "start_diagnostic" },
                    { label: "💎 Ver Plan Pro", value: "suscripcion" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("simulacro")) {
                const simulacroMsg = isPro 
                    ? `¡A darle con toda, ${userName}! Como eres PRO, tienes rienda suelta a todos los módulos. ¿Hoy vamos por una nueva meta o repasamos los fallos pasados?`
                    : "Nuestros simulacros son iguales a los del ICFES real, ¡sin sorpresas! 🎯 Te súper recomiendo empezar con el Diagnóstico para que la IA sepa exactamente qué temas reforzar contigo.";
                
                addBotMessage(simulacroMsg, 'options', isPro ? [
                    { label: "🚀 Nuevo Simulacro", value: "start_diagnostic" },
                    { label: "📉 Ver mis fallos", value: "progress" },
                    { label: "🏠 Menú", value: "restart" }
                ] : [
                    { label: "🚀 Empezar ahora", value: "start_diagnostic" },
                    { label: "📚 Guías de estudio", value: "help_center" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (lowercaseValue.includes("suscripcion") || lowercaseValue.includes("pro")) {
                if (isPro) {
                    addBotMessage(`¡Ya eres de los nuestros en la élite PRO! ✨ Ya tienes desbloqueado el poder de la IA. ¿Te gustaría que revisáramos tu reporte de hoy para ver qué tal vas?`, 'options', [
                        { label: "📊 Ver mi progreso", value: "progress" },
                        { label: "🏠 Menú", value: "restart" }
                    ]);
                } else {
                    addBotMessage("Con el plan PRO desbloqueas todo: simulacros ilimitados, IA explicándote cada respuesta y acceso a todos los módulos. ¡Es la inversión más segura para tu futuro!", 'options', [
                        { label: "💎 Ver el plan Pro", value: "pricing" },
                        { label: "📲 Preguntar en WhatsApp", value: "whatsapp_payment" },
                        { label: "🏠 Menú", value: "restart" }
                    ]);
                }
            } else if (lowercaseValue.includes("pago")) {
                const paymentMsg = isPro 
                    ? "¡Todo en orden con tu cuenta PRO! 💎 Si necesitas renovar o ayuda con facturación, aquí me tienes." 
                    : "¡Súper fácil! Puedes pagar por Nequi, tarjetas de crédito o PSE. Si prefieres Nequi, te paso los datos por WhatsApp de una vez para activarte manualmente si quieres.";
                
                addBotMessage(paymentMsg, 'options', [
                    { label: isPro ? "🙋 Soporte" : "📲 Pagar por Nequi", value: isPro ? "humano_flow" : "whatsapp_payment" },
                    { label: "💎 Ver Precios", value: "pricing" },
                    { label: "🏠 Menú", value: "restart" }
                ]);
            } else if (value === "progress") {
                window.location.href = "/dashboard";
                addBotMessage(`¡De una! Te llevo a tu dashboard. ¡Espero ver esos gráficos subiendo como espuma! 📈`);
            } else if (value === "final_thanks") {
                addBotMessage("¡No hay nada que agradecer! ✨ Estaré aquí 24/7 si te surge cualquier otra duda. ¡A darle con toda al estudio!", 'options', [
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            } else if (value === "start_diagnostic") {
                window.location.href = "/diagnostic";
                addBotMessage("¡Excelente decisión! Te estoy llevando al diagnóstico. Tómate tu tiempo y lee bien. ¡Tú puedes!");
            } else if (value === "whatsapp_support") {
                const text = userData.name ? `Hola,%20soy%20${userData.name}.%20Necesito%20ayuda%20con%20la%20plataforma%20SaberPro%20🚀` : 'Hola,%20necesito%20ayuda%20con%20SaberPro%20😊';
                window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`, '_blank');
                addBotMessage("¡Listo! Ya se está abriendo el WhatsApp. En un ratito te atiende un humano experto. Mientras tanto, ¿algo más?", 'options', [{ label: "🏠 Menú", value: "restart" }]);
            } else if (value === "whatsapp_payment") {
                window.open(`https://wa.me/${PAYMENTS_WHATSAPP}?text=Hola,%20Gabriela%20me%20atendió.%20Quiero%20pagar%20mi%20suscripción%20Premium%20por%20Nequi%20💎`, '_blank');
                addBotMessage("¡Perfecto! Escríbenos ahí y te mandamos los datos de pago al instante. ¡Bienvenido a la élite!", 'options', [{ label: "🏠 Menú", value: "restart" }]);
            } else if (value === "restart") {
                setStep('initial');
                addBotMessage(`¡Aquí estoy de nuevo! 😊 ¿Qué más tienes en mente? Cualquier cosa por pequeña que sea, pregúntame.`, 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "💎 Plan Pro", value: "suscripcion" },
                    { label: "🙋 Charla Humana", value: "humano_flow" }
                ]);
            } else if (value.startsWith("custom_")) {
                const userQuery = value.replace("custom_", "");
                const intent = matchIntent(userQuery);
                
                if (!user && intent !== "unknown" && !leadCaptured && step === 'initial') {
                    setUserData(prev => ({ ...prev, intent: intent }));
                    setStep('capturing_leads');
                    const intentName = intent === 'pago' ? 'los pagos' : (intent === 'simulacro' ? 'los simulacros' : 'SaberPro');
                    addBotMessage(`¡Oye, qué buena pregunta sobre ${intentName}! 😊 Me encantaría darte una asesoría premium y personalizada. ¿Cómo te llamas para poder ayudarte mejor?`);
                } else if (intent !== "unknown") {
                    processBotResponse(intent);
                } else {
                    addBotMessage("¡Vaya, esa pregunta me puso a pensar! 😊 Aún estoy aprendiendo cosas nuevas cada día, pero puedo guiarte con simulacros, planes PRO o comunicarte con mi equipo de humanos. ¿Qué te parece mejor?", 'options', [
                        { label: "🎯 Simulacros", value: "simulacro" },
                        { label: "💎 Plan Pro", value: "suscripcion" },
                        { label: "🙋 Charla Humana", value: "humano_flow" }
                    ]);
                }
            } else {
                addBotMessage("¡Entendido perfectamente! 😊 ¿Hay alguna otra cosita con la que pueda ayudarte a lograr ese gran puntaje hoy?", 'options', [
                    { label: "🎯 Simulacros", value: "simulacro" },
                    { label: "🏠 Menú principal", value: "restart" }
                ]);
            }
            setIsTyping(false);
        }, 1000); // Slightly more delay for a "thinking" feel
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
            setUserData(prev => ({ ...prev, name: currentInput }));
            setStep('asking_phone');
            setIsTyping(true);
            setTimeout(() => {
                addBotMessage(`¡Mucho gusto, ${currentInput.split(' ')[0]}! ✨ ¿Me regalas tu número de celular o WhatsApp para contactarte?`);
                setIsTyping(false);
            }, 600);
        } else if (step === 'asking_phone') {
            if (validatePhone(currentInput)) {
                setUserData(prev => ({ ...prev, phone: currentInput }));
                setStep('asking_email');
                setIsTyping(true);
                setTimeout(() => {
                    addBotMessage("¡Perfecto! Ya casi terminamos. ¿Cuál es tu mejor correo electrónico?");
                    setIsTyping(false);
                }, 600);
            } else {
                addBotMessage("Parece que ese número no es válido. ¿Me lo escribes de nuevo? (Ej: 3001234567)");
            }
        } else if (step === 'asking_email') {
            if (validateEmail(currentInput)) {
                setUserData(prev => ({ ...prev, email: currentInput }));
                setStep('ready');
                setIsTyping(true);
                setLeadCaptured(true);
                
                // Save lead
                saveGabrielaLead({
                    name: userData.name,
                    phone: userData.phone,
                    email: currentInput,
                    intent: userData.intent || 'general_inquiry'
                });

                setTimeout(() => {
                    addBotMessage("¡Listo! Ya tengo tus datos a salvo. ✨ ¿Por dónde prefieres que te contacte un asesor especializado?", 'options', [
                        { label: "📲 Por WhatsApp", value: "whatsapp_support" },
                        { label: "📧 Por Correo", value: "email_form" },
                        { label: "🏠 Menú principal", value: "restart" }
                    ]);
                    setIsTyping(false);
                }, 600);
            } else {
                addBotMessage("Ese correo no me parece correcto. ¿Podrías escribirlo de nuevo?");
            }
        } else if (step === 'capturing_leads') {
            // New flow for spontaneous capture
            if (!userData.name) {
                setUserData(prev => ({ ...prev, name: currentInput }));
                addBotMessage("¡Genial! Y ahora, ¿a qué número de WhatsApp te puedo escribir?");
            } else if (!userData.phone) {
                if (validatePhone(currentInput)) {
                    setUserData(prev => ({ ...prev, phone: currentInput }));
                    addBotMessage("¡Súper! Y por último, regálame tu correo para enviarte las guías de estudio.");
                } else {
                    addBotMessage("Porfa, escribe un número de WhatsApp válido.");
                }
            } else if (!userData.email) {
                if (validateEmail(currentInput)) {
                    setUserData(prev => ({ ...prev, email: currentInput }));
                    setLeadCaptured(true);
                    setStep('initial');
                    saveGabrielaLead({
                        name: userData.name,
                        phone: userData.phone,
                        email: currentInput,
                        intent: userData.intent || 'spontaneous_lead'
                    });
                    addBotMessage("¡Excelente! Ya estás en mi lista VIP. ✨ ¿En qué estábamos? Cuéntame más sobre tu duda.");
                } else {
                    addBotMessage("Ese correo no parece válido. ¿Me lo repites?");
                }
            }
        } else {
            // Intent handling
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
