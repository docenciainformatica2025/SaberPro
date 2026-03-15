"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, limit, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { Ticket, Plus, Trash2, Copy, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import AIProcessingLoader from "@/components/ui/AIProcessingLoader";
import { toast } from "sonner";

interface Coupon {
    id: string;
    code: string;
    plan: string;
    isUsed: boolean;
    description: string;
    createdAt: any;
}

export default function CouponsAdminPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [count, setCount] = useState(10);
    const [plan, setPlan] = useState<'pro' | 'teacher'>('pro');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "coupons"), orderBy("createdAt", "desc"), limit(100));
            const snap = await getDocs(q);
            setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const generateCoupons = async (count: number, plan: 'pro' | 'teacher', description: string) => {
        const results = [];
        for (let i = 0; i < count; i++) {
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            const couponRef = doc(db, "coupons", code);
            const data = {
                code,
                plan,
                isUsed: false,
                createdAt: serverTimestamp(),
                description,
                expiresAt: null
            };
            await setDoc(couponRef, data);
            results.push(data);
        }
        return results;
    };

    const handleGenerate = async () => {
        if (count < 1 || count > 100) {
            toast.error("La cantidad debe ser entre 1 y 100");
            return;
        }
        setGenerating(true);
        try {
            const description = `Promo Admin - ${new Date().toLocaleDateString()}`;
            console.log("Generando", count, "códigos para plan", plan, "-", description);
            
            await generateCoupons(count, plan, description);
            
            toast.success(`${count} códigos generados correctamente`);
            await fetchCoupons();
        } catch (e: any) {
            console.error("Error generando códigos:", e);
            toast.error("Error al generar códigos: " + (e?.message || "Desconocido"));
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple feedback
        alert("¡Código copiado!");
    };

    if (loading && coupons.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <AIProcessingLoader text="Configurando Promociones" subtext="Cargando base de datos de cupones..." />
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto space-y-12 pb-12 p-4 lg:p-0 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-theme-hero flex items-center gap-4 tracking-tighter italic uppercase">
                        <Ticket className="text-brand-primary" size={48} /> Códigos de Acceso
                    </h1>
                    <p className="text-[var(--theme-text-tertiary)] text-xs mt-2 font-black uppercase tracking-widest opacity-70">
                        Generación masiva de accesos premium para marketing y alianzas
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generation Card */}
                <Card variant="solid" className="p-8 lg:col-span-1 border-brand-primary/20 bg-brand-primary/5">
                    <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-brand-primary" /> Generar Nuevos
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)] block mb-2">Cantidad</label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                className="w-full h-12 bg-[var(--theme-bg-base)] border border-[var(--theme-border-soft)] rounded-xl px-4 text-[var(--theme-text-primary)] font-bold focus:border-brand-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-secondary)] block mb-2">Plan a Otorgar</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setPlan('pro')}
                                    className={`h-12 rounded-xl text-[10px] font-bold uppercase transition-all border ${plan === 'pro' ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/20' : 'border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)]'}`}
                                >
                                    Plan Pro
                                </button>
                                <button
                                    onClick={() => setPlan('teacher')}
                                    className={`h-12 rounded-xl text-[10px] font-bold uppercase transition-all border ${plan === 'teacher' ? 'bg-metal-blue text-white border-metal-blue shadow-lg shadow-metal-blue/20' : 'border-[var(--theme-border-soft)] text-[var(--theme-text-secondary)]'}`}
                                >
                                    Plan Docente
                                </button>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 font-black uppercase text-[10px] tracking-[0.2em]"
                            isLoading={generating}
                            onClick={handleGenerate}
                        >
                            Crear {count} Códigos
                        </Button>
                    </div>
                </Card>

                {/* List Card */}
                <Card variant="solid" className="p-0 overflow-hidden lg:col-span-2 border-[var(--theme-border-soft)]">
                    <div className="p-6 bg-[var(--theme-bg-surface)] border-b border-[var(--theme-border-soft)] flex justify-between items-center">
                        <h3 className="font-bold uppercase tracking-tight text-[var(--theme-text-primary)] flex items-center gap-2">
                            <Ticket size={18} className="text-brand-primary" /> Inventario de Accesos
                        </h3>
                        <Badge variant="default" className="text-[9px] px-3 font-bold uppercase">{coupons.length} Códigos</Badge>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--theme-bg-base)] text-[9px] uppercase font-bold text-[var(--theme-text-tertiary)] tracking-widest border-b border-[var(--theme-border-soft)]">
                                <tr>
                                    <th className="px-6 py-4">Código</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Creado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--theme-border-soft)]">
                                {coupons.map(cp => (
                                    <tr key={cp.id} className="group hover:bg-[var(--theme-bg-base)]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold text-[var(--theme-text-primary)] text-sm">{cp.code}</span>
                                                <button onClick={() => copyToClipboard(cp.code)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-brand-primary/10 rounded-lg text-brand-primary transition-all">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={cp.plan === 'teacher' ? 'info' : 'premium'} className="text-[9px] uppercase font-bold px-2">
                                                {cp.plan}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {cp.isUsed ? (
                                                    <span className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                                                        <Clock size={12} /> Usado
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1.5">
                                                        <CheckCircle size={12} /> Disponible
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] text-[var(--theme-text-tertiary)] font-bold">
                                                {cp.createdAt?.seconds ? new Date(cp.createdAt.seconds * 1000).toLocaleDateString() : '---'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="hover:text-red-500">
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </main>
    );
}
