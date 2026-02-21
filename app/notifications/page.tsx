"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Bell,
    ArrowLeft,
    Trophy,
    Clock,
    Users,
    ChevronRight,
    MoreVertical,
    Star,
    Sparkles,
    Calendar,
    CheckCircle2,
    User,
    Clock as ClockIcon // Alias if needed, or just keep Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import BottomNav from "@/components/layout/BottomNav";

// Mock Notifications Data
const NOTIFICATIONS_TODAY = [
    {
        id: 1,
        type: 'achievement',
        title: 'Tu constancia está transformando tu futuro, Sofía',
        message: '5 días de compromiso total con tu crecimiento. Sigue alimentando tu curiosidad, el camino es tan valioso como la meta.',
        progress: 80,
        label: 'LOGRO',
        action: 'Celebrar',
        icon: CheckCircle2,
        color: 'text-teal-500',
        bg: 'bg-teal-50',
        accentColor: 'bg-teal-400'
    },
    {
        id: 2,
        type: 'new',
        title: '¿Lista para expandir tus límites hoy?',
        message: "Nuevos horizontes en 'Fundamentos de UX' te esperan. Es el momento perfecto para descubrir nuevas perspectivas y fortalecer tu talento.",
        label: 'NUEVO',
        action: 'Empezar mi transformación',
        icon: Sparkles,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        accentColor: 'bg-orange-500'
    },
    {
        id: 3,
        type: 'social',
        title: 'Mateo valoró tu aporte en el foro de',
        highlight: 'Diseño de Interfaces.',
        message: 'Tu voz inspira a otros a aprender.',
        time: 'Hace 2 horas',
        avatarType: 'male',
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    }
];

const NOTIFICATIONS_PREVIOUS = [
    {
        id: 4,
        type: 'reminder',
        title: 'Prepara tu mente para mañana',
        message: 'Explora el material de tus próxima sesión y llega con la confianza de quien ya está liderando su propio aprendizaje.',
        action: 'Inspirarme ahora',
        icon: Calendar,
        color: 'text-slate-500',
        bg: 'bg-slate-100'
    }
];

const TABS = [
    { id: 'all', label: 'Todas', icon: Bell },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'reminders', label: 'Recordatorios', icon: Clock },
    { id: 'community', label: 'Comunidad', icon: Users },
];

export default function NotificationsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header Section */}
            <div className="bg-[#1e293b] pt-6 pb-12 px-6 rounded-b-[2.5rem] relative shadow-xl overflow-hidden">
                <div className="flex justify-between items-center mb-6 text-white relative z-10">
                    <Link href="/dashboard">
                        <ArrowLeft size={24} className="text-slate-300 hover:text-white transition-colors" />
                    </Link>
                    <h1 className="text-base font-bold text-center">Centro de Notificaciones</h1>
                    <MoreVertical size={24} className="text-slate-300" />
                </div>

                <div className="space-y-3 relative z-10">
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-tight max-w-xs">
                        ¡Vas por buen camino, Sofía!
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        Cada paso que das hoy construye la profesional que serás mañana.
                    </p>
                </div>
            </div>

            {/* Tabs & Content Area */}
            <div className="px-5 -mt-8 relative z-20 space-y-6">

                {/* Tabs */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm
                                ${activeTab === tab.id
                                    ? 'bg-[#ff7e5f] text-white shadow-orange-500/30'
                                    : 'bg-white text-slate-500 hover:bg-slate-50'
                                }
                            `}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* HOY Section */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Hoy</h3>
                        <div className="space-y-4">
                            {NOTIFICATIONS_TODAY.map((notif) => (
                                <NotificationsCard key={notif.id} notif={notif} />
                            ))}
                        </div>
                    </div>

                    {/* ANTERIORES Section */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Anteriores</h3>
                        <div className="space-y-4">
                            {NOTIFICATIONS_PREVIOUS.map((notif) => (
                                <NotificationsCard key={notif.id} notif={notif} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

function NotificationsCard({ notif }: { notif: any }) {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            {/* Left Accent Bar */}
            <div className={`absolute top-4 bottom-4 left-0 w-1.5 rounded-r-full ${notif.accentColor || 'bg-slate-200'}`} />

            <div className="pl-4 flex gap-4">
                {/* Icon Area */}
                <div className="shrink-0">
                    {notif.type === 'social' ? (
                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 overflow-hidden relative bg-[#ffedd5]">
                            {/* Simple Avatar Placeholder */}
                            <User size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-300" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-teal-400 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-[8px] text-white">💬</span>
                            </div>
                        </div>
                    ) : (
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notif.bg} ${notif.color}`}>
                            <notif.icon size={22} />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                        <div className="pr-2">
                            {notif.type === 'social' ? (
                                <p className="text-sm font-bold text-slate-800 leading-tight">
                                    {notif.title} <span className="text-[#14b8a6] italic">{notif.highlight}</span> {notif.message}
                                </p>
                            ) : (
                                <h4 className="font-bold text-slate-800 text-sm leading-tight pr-4">
                                    {notif.title}
                                </h4>
                            )}
                        </div>
                        {notif.label && (
                            <Badge className={`${notif.type === 'achievement' ? 'bg-[#ccfbf1] text-teal-700' : 'bg-[#ffedd5] text-orange-600'} text-[9px] font-bold px-2 py-1 border-0`}>
                                {notif.label}
                            </Badge>
                        )}
                    </div>

                    {/* Body Text */}
                    {notif.type !== 'social' && (
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {notif.message}
                        </p>
                    )}


                    {/* Action & Stats Row */}
                    <div className="pt-2">
                        {notif.type === 'achievement' && (
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${notif.progress}%` }} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 self-end">80% de la meta</span>
                                </div>
                                <Link href="/achievements/celebration">
                                    <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider">
                                        {notif.action}
                                    </button>
                                </Link>
                            </div>
                        )}

                        {notif.type === 'new' && (
                            <Button className="w-full bg-[#ff7e5f] hover:bg-[#eb6f50] text-white font-bold text-xs h-10 shadow-lg shadow-orange-200 rounded-xl">
                                {notif.action}
                            </Button>
                        )}

                        {notif.type === 'reminder' && (
                            <button className="flex items-center gap-1 text-xs font-bold text-[#ff7e5f] hover:text-[#eb6f50] uppercase tracking-wider">
                                {notif.action} <ChevronRight size={14} />
                            </button>
                        )}

                        {notif.type === 'social' && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <Clock size={12} /> {notif.time}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
