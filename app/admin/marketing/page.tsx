"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from "firebase/firestore";
import { 
    Users, 
    Mail, 
    MessageSquare, 
    Calendar, 
    MapPin, 
    Search, 
    Filter, 
    Trash2, 
    ExternalLink, 
    CheckCircle2, 
    Clock,
    Sparkles,
    Megaphone,
    Phone
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { CONTACT_EMAIL, SUPPORT_WHATSAPP } from "@/lib/config";

interface LeadData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    intent: string;
    region?: string;
    status: 'pending' | 'converted';
    createdAt: any;
}

export default function MarketingPage() {
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<LeadData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [intentFilter, setIntentFilter] = useState("all");

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "gabriela_leads"), orderBy("createdAt", "desc"), limit(100));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as LeadData));
            setLeads(data);
            setFilteredLeads(data);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Error al cargar los leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        let result = leads;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(l => 
                l.name.toLowerCase().includes(lowerTerm) || 
                l.email.toLowerCase().includes(lowerTerm)
            );
        }
        if (intentFilter !== "all") {
            result = result.filter(l => l.intent === intentFilter);
        }
        setFilteredLeads(result);
    }, [searchTerm, intentFilter, leads]);

    const deleteLead = async (id: string) => {
        if (!confirm("¿Eliminar este lead permanentemente?")) return;
        try {
            await deleteDoc(doc(db, "gabriela_leads", id));
            setLeads(prev => prev.filter(l => l.id !== id));
            toast.success("Lead eliminado");
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "---";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const getContactMessage = (lead: LeadData) => {
        let msg = `Hola ${lead.name}, soy asesor de SaberPro. Vi que consultaste sobre ${lead.intent === 'pago' ? 'medios de pago' : lead.intent === 'pro' ? 'el Plan Pro' : 'nuestros simulacros'} con nuestra IA Gabriela. ¿Te puedo ayudar con algo?`;
        return encodeURIComponent(msg);
    };

    const handleWAContact = (lead: LeadData) => {
        const phone = lead.phone?.replace(/\D/g, '');
        const target = phone && phone.length >= 10 ? phone : SUPPORT_WHATSAPP;
        window.open(`https://wa.me/${target}?text=${getContactMessage(lead)}`, '_blank');
    };

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <Megaphone className="text-brand-primary" size={36} /> Leads de Gabriela
                    </h1>
                    <p className="text-theme-text-secondary/40 text-sm mt-1 flex items-center gap-2 font-medium">
                        <Sparkles className="text-brand-primary" size={14} /> Gestión de interesados capturados por la IA
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={fetchLeads} isLoading={loading} className="font-bold uppercase tracking-wider text-[10px]">
                        Actualizar
                    </Button>
                    <Badge variant="primary" className="px-5 py-2.5 text-[10px] font-semibold tracking-wider uppercase">
                        {filteredLeads.length} INTERESADOS
                    </Badge>
                </div>
            </header>

            {/* Filters */}
            <Card variant="solid" className="p-4 bg-[var(--theme-bg-surface)]/20 border-[var(--theme-border-soft)]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-secondary/40" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)] rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-brand-primary/50 transition-all"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <select
                            value={intentFilter}
                            onChange={(e) => setIntentFilter(e.target.value)}
                            className="w-full bg-[var(--theme-bg-base)]/40 border border-[var(--theme-border-soft)] rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
                        >
                            <option value="all">Todas las intenciones</option>
                            <option value="suscripcion">Interés Plan Pro</option>
                            <option value="pago">Interés en Pagos (Nequi/PSE)</option>
                            <option value="simulacro">Interés en Simulacros</option>
                            <option value="humano_flow">Búsqueda de Asesor</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card variant="solid" className="p-0 overflow-hidden border-[var(--theme-border-soft)]">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <AIProcessingLoader text="Analizando prospectos" subtext="Consultando gabriela_leads..." />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="text-[10px] text-[var(--theme-text-tertiary)] uppercase font-semibold tracking-wider bg-[var(--theme-bg-surface)]/50">
                                    <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Prospecto</th>
                                    <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Contacto</th>
                                    <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Intención / Interés</th>
                                    <th className="px-8 py-6 border-b border-[var(--theme-border-soft)]">Lugar / Fecha</th>
                                    <th className="px-8 py-6 border-b border-[var(--theme-border-soft)] text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--theme-border-soft)]">
                                {filteredLeads.length > 0 ? filteredLeads.map((l) => (
                                    <tr key={l.id} className="group hover:bg-[var(--theme-bg-surface)]/20 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary border border-brand-primary/20">
                                                    {l.name[0].toUpperCase()}
                                                </div>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="font-bold text-[var(--theme-text-primary)]">{l.email}</p>
                                                <p className="text-[10px] text-brand-success font-black uppercase tracking-widest">{l.phone || 'Sin número'}</p>
                                            </div>
                                        </td>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={l.intent === 'suscripcion' || l.intent === 'pro' ? 'premium' : 'default'} className="uppercase text-[9px] font-bold">
                                                {l.intent === 'suscripcion' || l.intent === 'pro' ? '💎 Plan Pro' : 
                                                 l.intent === 'pago' ? '💳 Pago Nequi/PSE' :
                                                 l.intent === 'simulacro' ? '🎯 Simulacros' : '❓ Consulta General'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-theme-text-secondary/60 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                                    <Clock size={10} className="text-brand-primary/50" /> {formatDate(l.createdAt)}
                                                </span>
                                                <span className="text-[9px] text-theme-text-secondary/30 flex items-center gap-1.5 font-bold italic">
                                                    <MapPin size={10} className="text-brand-primary/20" /> {l.region || 'Latam'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="hover:text-brand-success hover:bg-brand-success/10 border-transparent transition-all"
                                                    onClick={() => handleWAContact(l)}
                                                >
                                                    <Phone size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="hover:text-brand-primary hover:bg-brand-primary/10 border-transparent transition-all"
                                                    onClick={() => window.location.href = `mailto:${l.email}?subject=Asesoría SaberPro&body=Hola ${l.name}...`}
                                                >
                                                    <Mail size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="hover:text-red-500 hover:bg-red-500/10 border-transparent transition-all"
                                                    onClick={() => deleteLead(l.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center text-theme-text-secondary/40 font-bold uppercase tracking-widest text-xs">
                                            No hay prospectos detectados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </main>
    );
}
