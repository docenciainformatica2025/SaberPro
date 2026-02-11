"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, Shield, Activity, Monitor } from "lucide-react";
import { usePathname } from "next/navigation";
import LegalModal from "@/components/ui/LegalModal";
import PrivacyContent from "@/components/legal/PrivacyContent";
import CookieContent from "@/components/legal/CookieContent";

// Types
type CookieConsent = {
    necessary: boolean;
    analytics: boolean;
    functional: boolean;
    timestamp: string;
};

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [activePolicy, setActivePolicy] = useState<'privacy' | 'cookies' | null>(null);
    const pathname = usePathname();

    // Check for existing consent on mount
    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent_saberpro");
        if (!consent) {
            // Small delay for animation entrance
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const acceptAll = () => {
        const consent: CookieConsent = {
            necessary: true,
            analytics: true,
            functional: true,
            timestamp: new Date().toISOString()
        };
        saveConsent(consent);

        // Save detailed consent for carry-over to registration
        if (typeof window !== 'undefined') {
            const consentData = {
                acceptedAt: new Date().toISOString(),
                version: "v1.0-2025",
                type: "Banner (Pre-Registro)",
                ipHash: "ANONYMOUS_PRE_REG"
            };
            localStorage.setItem("saberpro_pending_consent", JSON.stringify(consentData));
        }
    };

    const rejectNonEssential = () => {
        const consent: CookieConsent = {
            necessary: true,
            analytics: false,
            functional: false,
            timestamp: new Date().toISOString()
        };
        saveConsent(consent);
    };

    const saveConsent = (consent: CookieConsent) => {
        localStorage.setItem("cookie_consent_saberpro", JSON.stringify(consent));
        setIsVisible(false);
        setShowPreferences(false);

        // Logic for what happens when saved
        // Logic for what happens when saved
        if (consent.analytics) {
            // Here we would initialize Google Analytics
        } else {
            // Ensure no tracking scripts runs
        }

        if (!consent.functional) {
            // Preferences disabled logic
        }
    };

    // Don't show cookie banner on the policy page itself to avoid clutter (if accessed directly)
    if (pathname === '/cookies' || pathname === '/terms' || pathname === '/privacy') return null;

    if (!isVisible) return null;

    return (
        <>
            {/* STICKY BANNER */}
            <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-700">
                <div className="max-w-7xl mx-auto metallic-card bg-[var(--theme-bg-surface)]/95 backdrop-blur-xl border border-[var(--theme-border-soft)] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-6 md:flex items-center gap-8">

                    {/* Icon & Text */}
                    <div className="flex-1 space-y-3 mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                <Cookie size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--theme-text-primary)]">Uso de Cookies y Tecnologías</h3>
                        </div>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                            En SaberPro utilizamos cookies propias y de terceros para garantizar la seguridad, analizar la navegación y mejorar tu experiencia.
                            ¿Aceptas el procesamiento de datos conforme a nuestra
                            <button onClick={() => setActivePolicy('privacy')} className="mx-1 underline text-[var(--theme-text-primary)] hover:text-brand-primary font-bold">Política de Privacidad</button>
                            y
                            <button onClick={() => setActivePolicy('cookies')} className="ml-1 underline text-[var(--theme-text-primary)] hover:text-brand-primary font-bold">Política de Cookies</button>?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="text-xs font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] underline decoration-[var(--theme-text-secondary)]/30 hover:decoration-[var(--theme-text-primary)] underline-offset-4 transition-all px-4"
                        >
                            CONFIGURAR PREFERENCIAS
                        </button>
                        <button
                            onClick={rejectNonEssential}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)] font-bold text-xs transition-all"
                        >
                            RECHAZAR NO ESENCIALES
                        </button>
                        <button
                            onClick={acceptAll}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-primary text-white font-bold text-xs hover:shadow-gold hover:scale-105 transition-all shadow-sm"
                        >
                            ACEPTAR TODAS
                        </button>
                    </div>
                </div>
            </div>

            {/* PREFERENCES MODAL */}
            {showPreferences && (
                <PreferencesModal
                    onSave={saveConsent}
                    onClose={() => setShowPreferences(false)}
                />
            )}

            {/* POLICY MODALS - Keep user in context !! */}
            <LegalModal
                isOpen={activePolicy === 'privacy'}
                onClose={() => setActivePolicy(null)}
                title="Política de Privacidad"
            >
                <PrivacyContent />
            </LegalModal>

            <LegalModal
                isOpen={activePolicy === 'cookies'}
                onClose={() => setActivePolicy(null)}
                title="Política de Cookies"
            >
                <CookieContent />
            </LegalModal>
        </>
    );
}

function PreferencesModal({ onSave, onClose }: { onSave: (c: CookieConsent) => void, onClose: () => void }) {
    const [preferences, setPreferences] = useState({
        analytics: true,
        functional: true
    });

    const handleSave = () => {
        onSave({
            necessary: true,
            analytics: preferences.analytics,
            functional: preferences.functional,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-[var(--theme-border-soft)] flex justify-between items-center bg-[var(--theme-bg-base)]/50">
                    <h2 className="text-xl font-bold text-[var(--theme-text-primary)] flex items-center gap-3">
                        <Shield className="text-brand-primary" size={24} />
                        Centro de Preferencias de Privacidad
                    </h2>
                    <button onClick={onClose} aria-label="Cerrar banner de cookies" className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                        Este panel le permite gestionar qué tipos de cookies desea autorizar. El bloqueo de ciertos tipos puede afectar su experiencia en el simulador.
                    </p>

                    {/* Section A: Strict */}
                    <div className="p-4 rounded-xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Shield className="text-green-500" size={20} />
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">A. Estrictamente Necesarias</h4>
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Siempre Activo</span>
                                </div>
                            </div>
                            <div className="opacity-50 grayscale cursor-not-allowed">
                                <Switch checked={true} readOnly />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--theme-text-secondary)]/80 leading-relaxed pl-8">
                            Esenciales para que la plataforma funcione (sesión, seguridad, pagos). No almacenan info personal y no pueden desactivarse.
                        </p>
                    </div>

                    {/* Section B: Analytics */}
                    <div className="p-4 rounded-xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Activity className="text-blue-400" size={20} />
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">B. Analítica y Rendimiento</h4>
                                    <span className="text-[10px] text-[var(--theme-text-secondary)] font-bold uppercase tracking-wider">Opcional</span>
                                </div>
                            </div>
                            <button onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}>
                                <Switch checked={preferences.analytics} />
                            </button>
                        </div>
                        <p className="text-xs text-[var(--theme-text-secondary)]/80 leading-relaxed pl-8">
                            Nos permiten contar visitas y fuentes de tráfico para mejorar nuestros servidores. Toda la info es anónima (Google Analytics).
                        </p>
                    </div>

                    {/* Section C: Functional */}
                    <div className="p-4 rounded-xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Monitor className="text-purple-400" size={20} />
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">C. Funcionalidad y Preferencias</h4>
                                    <span className="text-[10px] text-[var(--theme-text-secondary)] font-bold uppercase tracking-wider">Opcional</span>
                                </div>
                            </div>
                            <button onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}>
                                <Switch checked={preferences.functional} />
                            </button>
                        </div>
                        <p className="text-xs text-[var(--theme-text-secondary)]/80 leading-relaxed pl-8">
                            Recuerdan sus elecciones (nombre, modo oscuro, idioma) para ofrecer una experiencia personalizada.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)]/50 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-[var(--theme-text-primary)] text-[var(--theme-bg-base)] font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Check size={18} /> GUARDAR MIS PREFERENCIAS
                    </button>
                </div>
            </div>
        </div>
    );
}

// Simple Custom Switch Component
function Switch({ checked, readOnly }: { checked: boolean, readOnly?: boolean }) {
    return (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? "bg-green-500" : "bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)]"}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0"}`} />
        </div>
    );
}
