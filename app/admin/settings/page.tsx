"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
    Settings,
    Save,
    RefreshCw,
    AlertTriangle,
    DollarSign,
    Clock,
    Users,
    GraduationCap,
    School,
    Target,
    Edit3,
    Info,
    ShieldAlert,
    Database,
    Globe,
    Zap
} from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { logAdminAction } from "@/lib/adminLogger";
import { useAuth } from "@/context/AuthContext";
import { AUTHOR_NAME, COMPANY_NAME, CONTACT_EMAIL, SALES_EMAIL } from "@/lib/config";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";

interface SystemConfig {
    simulation: {
        timePerQuestion: number;
        passingScore: number;
        maxRetries: number;
    };
    monetization: {
        currency: string;
        students: {
            price: number;
            promoActive: boolean;
            promoText: string;
        };
        teachers: {
            priceMonthly: number;
            promoActive: boolean;
            maxStudentsPerGroup: number;
        };
        institutions: {
            pricePerSeat: number;
            minSeats: number;
            contactEmail: string;
        };
    };
    maintenance: {
        isActive: boolean;
        message: string;
    };
}

const DEFAULT_CONFIG: SystemConfig = {
    simulation: { timePerQuestion: 120, passingScore: 60, maxRetries: 3 },
    monetization: {
        currency: "COP",
        students: { price: 24900, promoActive: false, promoText: "¡50% OFF!" },
        teachers: { priceMonthly: 49900, promoActive: false, maxStudentsPerGroup: 50 },
        institutions: { pricePerSeat: 15000, minSeats: 100, contactEmail: SALES_EMAIL }
    },
    maintenance: { isActive: false, message: `El sistema ${COMPANY_NAME} está en mantenimiento. Volveremos pronto.` }
};

export default function SettingsPage() {
    const { user } = useAuth();
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'institutions'>('students');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "system", "config");
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data() as SystemConfig;
                setConfig({
                    ...DEFAULT_CONFIG,
                    ...data,
                    monetization: {
                        ...DEFAULT_CONFIG.monetization,
                        ...(data.monetization || {})
                    }
                });
            } else {
                await setDoc(docRef, DEFAULT_CONFIG);
                setConfig(DEFAULT_CONFIG);
            }
        } catch (error) {
            console.error("Error loading config:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "system", "config"), {
                ...config,
                updatedAt: serverTimestamp(),
                updatedBy: user?.email
            });
            await logAdminAction(user?.email || "unknown", "UPDATE_SETTINGS", "system/config", "Updated global settings");
        } catch (error) {
            console.error("Error saving config:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !config) return <AIProcessingLoader text="Accediendo al Núcleo" subtext="Obteniendo parámetros globales de configuración..." />;

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase animate-in fade-in slide-in-from-left-8 duration-700">
                        <Settings className="text-brand-primary" size={48} /> Configuración Global
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 flex items-center gap-2 font-black uppercase tracking-widest opacity-70">
                        <Database size={14} className="text-brand-primary" /> Command Center v6.4 • Inmutable Engine
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving}
                        className="shadow-[0_0_30px_rgba(30,64,175,0.2)] px-10 h-14 font-black uppercase tracking-widest text-xs"
                        icon={saving ? RefreshCw : Save}
                    >
                        {saving ? "Sincronizando..." : "Ejecutar Cambios"}
                    </Button>
                </div>
            </div>

            {/* Simulation Parameters */}
            <Card variant="solid" className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <div className="flex items-center gap-3 mb-8 border-b border-[var(--theme-border-soft)] pb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[var(--theme-text-primary)] italic uppercase tracking-tighter">Parámetros del Simulacro</h2>
                        <p className="text-xs text-brand-primary/60 font-black uppercase tracking-widest leading-none mt-1">Lógica de evaluación y tiempos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-theme-text-secondary/60 uppercase tracking-widest ml-1">Límite de Estudiantes / Grupo</label>
                        <Input
                            type="number"
                            value={config.simulation.timePerQuestion}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, timePerQuestion: parseInt(e.target.value) } })}
                            icon={Clock}
                            className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Puntaje de Aprobación (%)</label>
                        <Input
                            type="number"
                            value={config.simulation.passingScore}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, passingScore: parseInt(e.target.value) } })}
                            icon={Zap}
                            className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider ml-1">Intentos Permitidos</label>
                        <Input
                            type="number"
                            value={config.simulation.maxRetries}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, maxRetries: parseInt(e.target.value) } })}
                            icon={RefreshCw}
                            className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)]"
                        />
                    </div>
                </div>
            </Card>

            {/* Monetization / Strategy */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <div className="p-8 border-b border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--theme-bg-surface)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--theme-text-primary)] italic uppercase tracking-tight">Estrategia Comercial</h2>
                            <p className="text-[10px] text-theme-text-secondary/40 font-bold uppercase tracking-wider leading-none mt-1">Gestión de precios y planes regionales</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] p-2 rounded-xl">
                        <Globe size={14} className="text-theme-text-secondary/40" />
                        <select
                            value={config.monetization.currency}
                            onChange={(e) => setConfig({ ...config, monetization: { ...config.monetization, currency: e.target.value } })}
                            className="bg-transparent text-xs text-brand-primary font-semibold outline-none cursor-pointer pr-2"
                        >
                            <option value="COP">COP - PESO COLOMBIANO</option>
                            <option value="USD">USD - DÓLAR AMERICANO</option>
                        </select>
                    </div>
                </div>

                {/* Vertical Tabs / Horizontal for desktop */}
                <div className="flex bg-[var(--theme-bg-base)] border-b border-[var(--theme-border-soft)] text-[10px] uppercase font-semibold tracking-wider">
                    {[
                        { id: 'students', label: 'Estudiantes', icon: Users, color: 'text-brand-primary' },
                        { id: 'teachers', label: 'Docentes', icon: GraduationCap, color: 'text-purple-400' },
                        { id: 'institutions', label: 'Instituciones', icon: School, color: 'text-blue-400' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-5 flex items-center justify-center gap-3 transition-all border-b-2 ${activeTab === tab.id ? 'bg-[var(--theme-bg-surface)] border-brand-primary text-[var(--theme-text-primary)]' : 'border-transparent text-theme-text-secondary/40 hover:text-theme-text-secondary hover:bg-[var(--theme-bg-surface)]/50'}`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? tab.color : 'opacity-20'} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-10 min-h-[300px]">
                    {activeTab === 'students' && (
                        <div className="space-y-8 animate-in fade-in blur-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider">Precio Plan Pro Individual</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.students.price}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                students: { ...config.monetization.students, price: parseInt(e.target.value) }
                                            }
                                        })}
                                        icon={DollarSign}
                                        className="text-2xl font-semibold tabular-nums bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)]"
                                    />
                                    <p className="text-[9px] text-[var(--theme-text-tertiary)] italic">Acceso vitalicio para un único usuario final.</p>
                                </div>

                                <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex items-center justify-between group hover:border-brand-primary/30 transition-all shadow-inner">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-[var(--theme-text-primary)] text-sm uppercase italic tracking-tight">Banner Promocional</div>
                                        <div className="text-[10px] text-brand-primary/60 font-medium">Activar oferta relámpago en Dashboard</div>
                                    </div>
                                    <Switch
                                        checked={config.monetization.students.promoActive}
                                        onCheckedChange={(val) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                students: { ...config.monetization.students, promoActive: val }
                                            }
                                        })}
                                    />
                                </div>
                            </div>

                            {config.monetization.students.promoActive && (
                                <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider flex items-center gap-2">
                                        <Target size={12} className="text-brand-primary" /> Texto de la Campaña
                                    </label>
                                    <div className="relative group">
                                        <Input
                                            placeholder="Ej: ¡APROVECHA 50% DCTO ESTA SEMANA!"
                                            value={config.monetization.students.promoText}
                                            onChange={(e) => setConfig({
                                                ...config, monetization: {
                                                    ...config.monetization,
                                                    students: { ...config.monetization.students, promoText: e.target.value }
                                                }
                                            })}
                                            className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] h-14 pl-12 italic font-bold text-lg text-[var(--theme-text-primary)] shadow-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all rounded-xl"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-brand-primary/10 rounded-lg text-brand-primary">
                                            <Edit3 size={14} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'teachers' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider">Suscripción Mensual (SAAS)</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            value={config.monetization.teachers.priceMonthly}
                                            onChange={(e) => setConfig({
                                                ...config, monetization: {
                                                    ...config.monetization,
                                                    teachers: { ...config.monetization.teachers, priceMonthly: parseInt(e.target.value) }
                                                }
                                            })}
                                            className="text-2xl font-semibold bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] h-14 pl-12 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                                            <Settings size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider">Límite de Estudiantes / Grupo</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            value={config.monetization.teachers.maxStudentsPerGroup}
                                            onChange={(e) => setConfig({
                                                ...config, monetization: {
                                                    ...config.monetization,
                                                    teachers: { ...config.monetization.teachers, maxStudentsPerGroup: parseInt(e.target.value) }
                                                }
                                            })}
                                            className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] h-14 pl-12 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                                            <Users size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'institutions' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4 backdrop-blur-sm">
                                <div className="p-2 bg-blue-500/10 rounded-xl h-fit">
                                    <Info className="text-blue-500" size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-500 font-bold uppercase tracking-tight">Protocolo B2B Institucional</p>
                                    <p className="text-[10px] text-blue-500/70 leading-relaxed font-medium">
                                        Las licencias por volumen requieren contrato manual. Estos valores sirven de base para el cotizador automático de ventas.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider">Precio de Referencia / Silla</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            value={config.monetization.institutions.pricePerSeat}
                                            onChange={(e) => setConfig({
                                                ...config, monetization: {
                                                    ...config.monetization,
                                                    institutions: { ...config.monetization.institutions, pricePerSeat: parseInt(e.target.value) }
                                                }
                                            })}
                                            className="text-2xl font-semibold bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] h-14 pl-12 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                                            <School size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold text-theme-text-secondary/40 uppercase tracking-wider">Compra Mínima (Unidades)</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.institutions.minSeats}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                institutions: { ...config.monetization.institutions, minSeats: parseInt(e.target.value) }
                                            }
                                        })}
                                        className="bg-[var(--theme-bg-base)] border-[var(--theme-border-soft)] h-14 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Danger Zone - Redesigned */}
            <Card variant="solid" className="p-0 overflow-hidden border-red-500/20 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.1)] group hover:shadow-[0_20px_60px_-10px_rgba(239,68,68,0.15)] transition-all duration-500 relative">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

                <div className="p-8 border-b border-[var(--theme-border-soft)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--theme-bg-surface)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                            <AlertTriangle size={24} className="animate-pulse-slow" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--theme-text-primary)] italic uppercase tracking-tight flex items-center gap-2">
                                Zona de Seguridad Crítica
                                <span className="px-2 py-0.5 rounded text-[8px] bg-red-500 text-white font-black tracking-widest">ROOT ONLY</span>
                            </h2>
                            <p className="text-[10px] text-theme-text-secondary/60 font-medium leading-none mt-1.5 uppercase tracking-wider">
                                Intervención directa sobre el estado vital del sistema
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-[var(--theme-bg-base)]/50">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-[var(--theme-bg-surface)] rounded-2xl border border-red-500/10 gap-6 group/item hover:border-red-500/30 transition-all shadow-sm">
                        <div className="max-w-xl space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-[var(--theme-text-primary)] uppercase text-sm">Bloqueo Maestro (Mantenimiento)</h3>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${config.maintenance.isActive ? 'bg-red-500' : 'bg-green-500'}`} />
                            </div>
                            <p className="text-xs text-theme-text-secondary/60 leading-relaxed font-medium">
                                Al activar el <span className="text-red-500 font-bold">Protocolo de Emergencia</span>, todas las conexiones entrantes (excepto Root Admin) serán redirigidas a una página de espera estática.
                                <br /><span className="text-[10px] opacity-70 italic">Úselo solo bajo protocolos de actualización críticos o ataques DDoS.</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 min-w-[140px] p-4 bg-[var(--theme-bg-base)] rounded-xl border border-[var(--theme-border-soft)]">
                            <Switch
                                checked={config.maintenance.isActive}
                                onCheckedChange={(val) => setConfig({ ...config, maintenance: { ...config.maintenance, isActive: val } })}
                                className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-[var(--theme-border-medium)]"
                            />
                            <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${config.maintenance.isActive ? 'text-red-500 animate-pulse' : 'text-green-500/60'}`}>
                                {config.maintenance.isActive ? 'FUERA DE LÍNEA' : 'SISTEMA NOMINAL'}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-theme-text-secondary/30 px-2 uppercase font-semibold tracking-[0.1em]">
                <span>Saber Pro Suite v4.1.29 - Central Control Page</span>
                <span className="flex items-center gap-1"><ShieldAlert size={10} /> TLS 1.3 / Inmutable Config Pattern</span>
            </div>
        </main>
    );
}
