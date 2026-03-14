'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Transaction, PaymentStatus } from "@/types/finance";
import { Download, CreditCard, Clock, CheckCircle, AlertCircle, ArrowLeft, Receipt } from "lucide-react";
export default function BillingPage() {
    const { user, subscription, role } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const fetchHistory = async () => {
            try {
                const q = query(
                    collection(db, "transactions"),
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const list: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() } as Transaction);
                });

                // Client-side sort to avoid missing index issues
                list.sort((a, b) => {
                    const timeA = (a.createdAt as any)?.seconds || 0;
                    const timeB = (b.createdAt as any)?.seconds || 0;
                    return timeB - timeA;
                });

                setTransactions(list);
            } catch (error: any) {
                console.error("Error fetching billing history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const handleDownloadInvoice = async (tx: Transaction) => {
        try {
            const { invoiceGenerator } = await import("@/utils/invoiceGenerator");
            invoiceGenerator.generateInvoice(tx, {
                fullName: user?.displayName || "Usuario",
                email: user?.email || "email@example.com",
                uid: user?.uid
            });
        } catch (e) {
            console.error(e);
            alert("Error generando PDF. Intente nuevamente.");
        }
    };

    // Robust Date Formatter
    const formatDate = (dateValue: any) => {
        if (!dateValue) return "Ciclo Anual";
        try {
            const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
            return date.toLocaleDateString("es-CO", { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return "Próxima renovación (Anual)";
        }
    };

    const StatusBadge = ({ status }: { status: PaymentStatus }) => {
        const styles = {
            [PaymentStatus.COMPLETED]: "bg-green-500/10 text-green-400 border-green-500/20",
            [PaymentStatus.PENDING]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            [PaymentStatus.FAILED]: "bg-red-500/10 text-red-400 border-red-500/20",
            [PaymentStatus.REFUNDED]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            [PaymentStatus.DISPUTED]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles[PaymentStatus.PENDING]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg-base)] pb-32 font-sans selection:bg-brand-primary/20 transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-16 space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Header - Elite Typography */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => router.push(role === 'teacher' ? '/teacher' : '/dashboard')}
                            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary/60 hover:text-brand-primary transition-all mb-4"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            VOLVER AL PANEL
                        </button>
                        <h1 className="text-5xl font-black text-[var(--theme-text-primary)] tracking-tightest leading-none">
                            FACTURACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600 uppercase">& PAGOS</span>
                        </h1>
                        <p className="text-xs text-[var(--theme-text-secondary)] opacity-60 font-medium tracking-wide">Gestiona tu estatus de miembro de élite y comprobantes.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                        <Receipt className="text-brand-primary" size={20} />
                        <span className="text-xs font-black uppercase tracking-widest text-white/80">{transactions.length} Transacciones</span>
                    </div>
                </header>

                {/* Subscription Card - Ultra Premium Glass */}
                <div className="bg-gradient-to-br from-brand-primary/20 via-[var(--theme-bg-surface)]/80 to-[var(--theme-bg-surface)]/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 relative overflow-hidden group shadow-[0_32px_80px_-20px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/15 rounded-full blur-[100px] -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-[0_20px_40px_rgba(30,58,138,0.4)] transform hover:rotate-6 transition-transform">
                                <CreditCard className="text-white w-10 h-10 drop-shadow-lg" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/10 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">ESTATUS ACTUAL</span>
                                </div>
                                <h3 className="text-4xl font-black text-white tracking-tightest leading-none mb-4">
                                    {subscription?.plan === 'pro' || subscription?.plan === 'teacher' ? 'MIEMBRO ÉLITE' : (subscription?.plan || 'GRATUITO').toUpperCase()}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-white/50 font-medium tracking-wide">
                                    <Clock size={16} className="text-brand-primary" />
                                    {subscription?.status === 'active'
                                        ? <span>Renovación automática: <b className="text-white">{formatDate(subscription.validUntil)}</b></span>
                                        : 'Sin suscripción activa'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {subscription?.plan !== 'free' ? (
                                <>
                                    <button className="h-14 px-8 rounded-2xl border border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.2em]">
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={() => router.push('/pricing')}
                                        className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black hover:translate-y-[-4px] transition-all text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/40 shimmer-gold"
                                    >
                                        CAMBIAR PLAN
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="h-16 px-12 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-black hover:scale-[1.02] transition-all text-[12px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(30,58,138,0.4)] shimmer-gold"
                                >
                                    ¡MEJORAR AHORA!
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transactions Grid */}
                <div className="space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Historial de Élite</h2>
                        <div className="h-px flex-1 mx-8 bg-white/5" />
                    </div>

                    {loading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 bg-white/[0.03] rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                            <Receipt className="mx-auto w-16 h-16 text-white/10 mb-6" />
                            <p className="text-white/40 font-black uppercase tracking-widest">Sin transacciones registradas</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="group bg-[var(--theme-bg-surface)]/60 backdrop-blur-lg border border-white/5 hover:border-brand-primary/30 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between transition-all duration-500 hover:bg-white/[0.04]">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${tx.status === PaymentStatus.COMPLETED ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {tx.status === PaymentStatus.COMPLETED ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-black text-white text-xl tracking-tight group-hover:text-brand-primary transition-colors uppercase">{tx.description}</div>
                                            <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-white/30">
                                                <span className="bg-black/40 px-3 py-1 rounded-full text-brand-primary border border-white/5">REF: {tx.reference}</span>
                                                <span>•</span>
                                                <span className="uppercase">{formatDate(tx.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 w-full md:w-auto mt-6 md:mt-0 justify-between md:justify-end">
                                        <div className="text-right space-y-1">
                                            <div className="font-black text-white text-2xl tracking-tightest">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                            </div>
                                            <StatusBadge status={tx.status} />
                                        </div>

                                        <button
                                            onClick={() => handleDownloadInvoice(tx)}
                                            className="w-14 h-14 rounded-2xl bg-white/5 text-white/40 hover:bg-brand-primary hover:text-white transition-all flex flex-col items-center justify-center gap-1 group/btn border border-white/5 shadow-xl"
                                            title="Descargar Factura"
                                        >
                                            <Download size={22} className="group-hover/btn:-translate-y-1 transition-transform" />
                                            <span className="text-[8px] font-black uppercase">PDF</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
