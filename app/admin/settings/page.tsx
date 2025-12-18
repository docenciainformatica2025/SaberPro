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
    ShieldAlert,
    Database,
    Globe,
    Zap,
    Info
} from "lucide-react";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { logAdminAction } from "@/lib/adminLogger";
import { useAuth } from "@/context/AuthContext";
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
        institutions: { pricePerSeat: 15000, minSeats: 100, contactEmail: "ventas@saberpro.app" }
    },
    maintenance: { isActive: false, message: "El sistema está en mantenimiento. Volveremos pronto." }
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
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-metal-silver to-white/50 flex items-center gap-3">
                        <Settings className="text-metal-gold" /> Configuración Global
                    </h1>
                    <p className="text-metal-silver/60 text-sm mt-1 flex items-center gap-2">
                        <Database size={14} /> Control maestro de parámetros reactivos y lógica de negocio
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="premium"
                        onClick={handleSave}
                        disabled={saving}
                        className="h-11 px-8 shadow-xl"
                        icon={saving ? RefreshCw : Save}
                    >
                        {saving ? "Sincronizando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </div>

            {/* Simulation Parameters */}
            <Card variant="solid" className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Parámetros del Simulacro</h2>
                        <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-widest leading-none mt-1">Lógica de evaluación y tiempos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Tiempo/Pregunta (s)</label>
                        <Input
                            type="number"
                            value={config.simulation.timePerQuestion}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, timePerQuestion: parseInt(e.target.value) } })}
                            icon={Clock}
                            className="bg-black/40 border-white/5"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Puntaje de Aprobación (%)</label>
                        <Input
                            type="number"
                            value={config.simulation.passingScore}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, passingScore: parseInt(e.target.value) } })}
                            icon={Zap}
                            className="bg-black/40 border-white/5"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest ml-1">Intentos Permitidos</label>
                        <Input
                            type="number"
                            value={config.simulation.maxRetries}
                            onChange={(e) => setConfig({ ...config, simulation: { ...config.simulation, maxRetries: parseInt(e.target.value) } })}
                            icon={RefreshCw}
                            className="bg-black/40 border-white/5"
                        />
                    </div>
                </div>
            </Card>

            {/* Monetization / Strategy */}
            <Card variant="solid" className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Estrategia Comercial</h2>
                            <p className="text-[10px] text-metal-silver/40 font-bold uppercase tracking-widest leading-none mt-1">Gestión de precios y planes regionales</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-2 rounded-xl">
                        <Globe size={14} className="text-metal-silver/40" />
                        <select
                            value={config.monetization.currency}
                            onChange={(e) => setConfig({ ...config, monetization: { ...config.monetization, currency: e.target.value } })}
                            className="bg-transparent text-xs text-metal-gold font-black outline-none cursor-pointer pr-2"
                        >
                            <option value="COP">COP - PESO COLOMBIANO</option>
                            <option value="USD">USD - DÓLAR AMERICANO</option>
                        </select>
                    </div>
                </div>

                {/* Vertical Tabs / Horizontal for desktop */}
                <div className="flex bg-black/20 border-b border-white/5 text-[10px] uppercase font-black tracking-widest">
                    {[
                        { id: 'students', label: 'Estudiantes', icon: Users, color: 'text-metal-gold' },
                        { id: 'teachers', label: 'Docentes', icon: GraduationCap, color: 'text-purple-400' },
                        { id: 'institutions', label: 'Instituciones', icon: School, color: 'text-blue-400' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-5 flex items-center justify-center gap-3 transition-all border-b-2 ${activeTab === tab.id ? 'bg-white/5 border-metal-gold text-white' : 'border-transparent text-metal-silver/40 hover:text-metal-silver hover:bg-white/[0.02]'}`}
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
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Precio Plan Pro Individual</label>
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
                                        className="text-2xl font-black tabular-nums bg-black/40"
                                    />
                                    <p className="text-[9px] text-metal-silver/20 italic">Acceso vitalicio para un único usuario final.</p>
                                </div>

                                <div className="p-6 bg-metal-gold/5 rounded-2xl border border-metal-gold/10 flex items-center justify-between group hover:border-metal-gold/30 transition-all shadow-inner">
                                    <div className="space-y-1">
                                        <div className="font-black text-white text-sm uppercase italic tracking-tighter">Banner Promocional</div>
                                        <div className="text-[10px] text-metal-gold/60 font-medium">Activar oferta relámpago en Dashboard</div>
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
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Texto de la Campaña</label>
                                    <Input
                                        placeholder="Ej: ¡APROVECHA 50% DCTO ESTA SEMANA!"
                                        value={config.monetization.students.promoText}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                students: { ...config.monetization.students, promoText: e.target.value }
                                            }
                                        })}
                                        className="bg-black/40 border-metal-gold/20 italic font-bold"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'teachers' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Suscripción Mensual (SAAS)</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.teachers.priceMonthly}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                teachers: { ...config.monetization.teachers, priceMonthly: parseInt(e.target.value) }
                                            }
                                        })}
                                        icon={Settings}
                                        className="text-2xl font-black bg-black/40"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Límite de Estudiantes / Grupo</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.teachers.maxStudentsPerGroup}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                teachers: { ...config.monetization.teachers, maxStudentsPerGroup: parseInt(e.target.value) }
                                            }
                                        })}
                                        icon={Users}
                                        className="bg-black/40"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'institutions' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                                <Info className="text-blue-400 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-100 font-bold uppercase tracking-tight">Protocolo B2B Institucional</p>
                                    <p className="text-[10px] text-blue-400 leading-relaxed italic">
                                        Las licencias por volumen requieren contrato manual. Estos valores sirven de base para el cotizador automático de ventas.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Precio de Referencia / Silla</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.institutions.pricePerSeat}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                institutions: { ...config.monetization.institutions, pricePerSeat: parseInt(e.target.value) }
                                            }
                                        })}
                                        icon={School}
                                        className="text-2xl font-black bg-black/40"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-metal-silver/40 uppercase tracking-widest">Compra Mínima (Unidades)</label>
                                    <Input
                                        type="number"
                                        value={config.monetization.institutions.minSeats}
                                        onChange={(e) => setConfig({
                                            ...config, monetization: {
                                                ...config.monetization,
                                                institutions: { ...config.monetization.institutions, minSeats: parseInt(e.target.value) }
                                            }
                                        })}
                                        className="bg-black/40"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Danger Zone */}
            <Card variant="solid" className="p-8 border-red-500/20 bg-red-950/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <AlertTriangle size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-red-500 italic uppercase tracking-tighter">Zona de Seguridad Crítica</h2>
                        <p className="text-[10px] text-red-500/40 font-bold uppercase tracking-widest leading-none mt-1">Intervención directa sobre el estado vital del sistema</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-black/40 rounded-2xl border border-red-500/10 gap-6">
                    <div className="max-w-md">
                        <h3 className="font-black text-white uppercase italic text-sm">Bloqueo Maestro (Mantenimiento)</h3>
                        <p className="text-[10px] text-metal-silver/40 mt-1 leading-relaxed">
                            Al activar esto, <strong>todas las conexiones entrantes (excepto Root Admin)</strong> serán redirigidas a una página de espera. Úselo solo bajo protocolos de actualización críticos.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Switch
                            checked={config.maintenance.isActive}
                            onCheckedChange={(val) => setConfig({ ...config, maintenance: { ...config.maintenance, isActive: val } })}
                        />
                        <span className={`text-[9px] font-bold tracking-widest uppercase ${config.maintenance.isActive ? 'text-red-500 animate-pulse' : 'text-green-500/40'}`}>
                            {config.maintenance.isActive ? 'FUERA DE LÍNEA' : 'SISTEMA NOMINAL'}
                        </span>
                    </div>
                </div>
            </Card>

            <div className="flex justify-between items-center text-[10px] text-metal-silver/30 px-2 uppercase font-black tracking-[0.1em]">
                <span>Saber Pro Suite v2.0 - Central Control Page</span>
                <span className="flex items-center gap-1"><ShieldAlert size={10} /> TLS 1.3 / Inmutable Config Pattern</span>
            </div>
        </div>
    );
}
