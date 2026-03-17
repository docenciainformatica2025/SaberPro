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
            <div className="fixed bottom-0 left-0 w-full z-50 p-3 sm:p-4 md:p-6 animate-in slide-in-from-bottom-full duration-700 pointer-events-none">
                <div className="max-w-7xl mx-auto metallic-card bg-[var(--theme-bg-surface)]/95 backdrop-blur-xl border border-[var(--theme-border-soft)] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] p-4 sm:p-6 md:flex items-center gap-8 pointer-events-auto transition-all">

                    {/* Icon & Text */}
                    <div className="flex-1 space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-1 sm:mb-2">
                            <div className="p-1.5 sm:p-2 bg-brand-primary/10 rounded-lg text-brand-primary shadow-inner">
                                <Cookie className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text-primary)]">Privacidad y Cookies</h3>
                        </div>
                        <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                            Potenciamos tu aprendizaje con tecnología propia y de terceros. Acepta el uso de cookies para una experiencia personalizada y segura conforme a nuestra
                            <button onClick={() => setActivePolicy('privacy')} className="mx-1 underline text-[var(--theme-text-primary)] hover:text-brand-primary font-bold transition-colors">Política de Privacidad</button>
                            y
                            <button onClick={() => setActivePolicy('cookies')} className="ml-1 underline text-[var(--theme-text-primary)] hover:text-brand-primary font-bold transition-colors">Política de Cookies</button>.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="hidden sm:block text-[10px] font-black text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] uppercase tracking-widest transition-all px-4"
                        >
                            Preferencias
                        </button>
                        <button
                            onClick={rejectNonEssential}
                            className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-xl border border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-base)] font-bold text-[10px] sm:text-xs transition-all"
                        >
                            RECHAZAR
                        </button>
                        <button
                            onClick={acceptAll}
                            className="w-full sm:w-auto px-6 py-2 sm:py-2.5 rounded-xl bg-brand-primary text-white font-bold text-[10px] sm:text-xs hover:shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.4)] hover:scale-105 transition-all shadow-lg active:scale-95 organic-border-reverse"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-3xl animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border-soft)] rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-8 border-b border-[var(--theme-border-soft)] flex justify-between items-center bg-[var(--theme-bg-base)]/30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Control de Privacidad</h2>
                            <p className="text-[10px] text-[var(--theme-text-tertiary)] uppercase font-bold tracking-widest">SaberPro Configurator</p>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full text-[var(--theme-text-tertiary)] hover:text-brand-error hover:bg-brand-error/10 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                        Gestiona cómo procesamos tu información. Los ajustes seleccionados garantizan la integridad de tu experiencia en el simulador de alto rendimiento.
                    </p>

                    {/* Section A: Strict */}
                    <div className="p-5 rounded-2xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] group transition-all hover:bg-[var(--theme-bg-base)]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">Escenciales y Seguridad</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider">Siempre Activo</span>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-40 cursor-not-allowed">
                                <Switch checked={true} readOnly />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed mt-4 pl-12">
                            Base técnica vital para autenticación, sesiones y pasarela de pagos. No almacenan datos rastreables y son obligatorias.
                        </p>
                    </div>

                    {/* Section B: Analytics */}
                    <div className="p-5 rounded-2xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] group transition-all hover:bg-[var(--theme-bg-base)]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">Analítica de Rendimiento</h4>
                                    <span className="text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider">Opcional</span>
                                </div>
                            </div>
                            <button onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))} className="active:scale-95 transition-transform">
                                <Switch checked={preferences.analytics} />
                            </button>
                        </div>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed mt-4 pl-12">
                            Nos permite medir la estabilidad técnica y fuentes de tráfico de forma anónima para optimizar la velocidad del simulador.
                        </p>
                    </div>

                    {/* Section C: Functional */}
                    <div className="p-5 rounded-2xl bg-[var(--theme-bg-base)]/50 border border-[var(--theme-border-soft)] group transition-all hover:bg-[var(--theme-bg-base)]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                    <Monitor size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[var(--theme-text-primary)] font-bold text-sm">Preferencias de Interfaz</h4>
                                    <span className="text-[10px] text-[var(--theme-text-tertiary)] font-bold uppercase tracking-wider">Opcional</span>
                                </div>
                            </div>
                            <button onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))} className="active:scale-95 transition-transform">
                                <Switch checked={preferences.functional} />
                            </button>
                        </div>
                        <p className="text-xs text-[var(--theme-text-tertiary)] leading-relaxed mt-4 pl-12">
                            Recuerdan tus ajustes visuales como el modo oscuro, idioma preferido y filtros de búsqueda locales.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-[var(--theme-border-soft)] bg-[var(--theme-bg-base)]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] max-w-[240px] leading-tight">
                        Al guardar, tus preferencias se aplicarán de inmediato en esta sesión de navegación.
                    </p>
                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[var(--theme-text-primary)] text-[var(--theme-bg-surface)] font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/5"
                    >
                        <Check size={18} strokeWidth={3} /> GUARDAR PREFERENCIAS
                    </button>
                </div>
            </div>
        </div>
    );
}

// Simple Custom Switch Component
function Switch({ checked, readOnly }: { checked: boolean, readOnly?: boolean }) {
    return (
        <div className={`w-14 h-7 rounded-full p-1.5 transition-all duration-300 ${checked ? "bg-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]" : "bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)]"}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-elastic ${checked ? "translate-x-7" : "translate-x-0"}`} />
        </div>
    );
}
