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
        if (!dateValue) return "Indefinido";
        try {
            // Handle Firestore Timestamp
            const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
            return date.toLocaleDateString("es-CO", { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return "Fecha Inválida";
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
        <div className="min-h-screen bg-metal-dark p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header with Back Button */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button
                            onClick={() => router.push(role === 'teacher' ? '/teacher' : '/dashboard')}
                            className="group flex items-center gap-2 text-metal-silver hover:text-white mb-4 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al Panel
                        </button>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <CreditCard className="text-metal-gold" /> Facturación
                        </h1>
                        <p className="text-metal-silver mt-1">Gestiona tus pagos y descarga tus comprobantes fiscales.</p>
                    </div>
                </header>

                {/* Subscription Status Card - Premium Design */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black border border-metal-gold rounded-2xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
                    <div className="absolute top-0 right-0 p-32 bg-metal-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-metal-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-metal-gold/20">
                                <CreditCard className="text-black w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-sm text-metal-silver uppercase tracking-widest font-bold mb-1">Tu Plan Actual</h3>
                                <div className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    {subscription?.plan === 'pro' || subscription?.plan === 'teacher' ? 'MIEMBRO ELITE' : (subscription?.plan || 'GRATUITO').toUpperCase()}
                                    {subscription?.status === 'active' && <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full border border-green-500/30">ACTIVO</span>}
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-sm text-metal-silver/80">
                                    <Clock size={14} className="text-metal-gold" />
                                    {subscription?.status === 'active'
                                        ? <span>Renovación automática el <b className="text-white">{formatDate(subscription.validUntil)}</b></span>
                                        : 'No tienes una suscripción activa actualmente.'}
                                </div>
                            </div>
                        </div>
                        {subscription?.plan !== 'free' && (
                            <div className="flex gap-4">
                                <button className="px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-bold flex items-center gap-2">
                                    Cancelar Suscripción
                                </button>
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="px-5 py-2.5 rounded-lg bg-metal-gold text-black font-bold hover:bg-yellow-400 transition-all text-sm shadow-lg shadow-metal-gold/20"
                                >
                                    Cambiar Plan
                                </button>
                            </div>
                        )}
                        {subscription?.plan === 'free' && (
                            <button
                                onClick={() => router.push('/pricing')}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-metal-gold to-yellow-500 text-black font-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            >
                                MEJORAR AHORA
                            </button>
                        )}
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 pb-4 border-b border-white/5">
                        <Receipt size={20} className="text-metal-gold" />
                        Historial de Transacciones
                    </h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <Receipt className="mx-auto w-12 h-12 text-metal-silver/20 mb-4" />
                            <p className="text-metal-silver font-medium">Aún no tienes transacciones registradas.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="group bg-[#0f0f0f] border border-white/5 hover:border-metal-gold/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between transition-all duration-300 hover:bg-[#151515]">
                                    <div className="flex items-center gap-5 w-full md:w-auto">
                                        <div className={`p-3 rounded-xl transition-colors ${tx.status === PaymentStatus.COMPLETED ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {tx.status === PaymentStatus.COMPLETED ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg group-hover:text-metal-gold transition-colors">{tx.description}</div>
                                            <div className="text-xs text-metal-silver font-mono flex items-center gap-2 mt-1">
                                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/70">REF: {tx.reference}</span>
                                                <span>•</span>
                                                <span>{formatDate(tx.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="font-black text-white text-xl tracking-tight">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                            </div>
                                            <div className="flex justify-end mt-1">
                                                <StatusBadge status={tx.status} />
                                            </div>
                                        </div>

                                        <div className="w-px h-10 bg-white/10 hidden md:block"></div>

                                        <button
                                            onClick={() => handleDownloadInvoice(tx)}
                                            className="p-3 rounded-lg bg-white/5 text-metal-silver hover:bg-white/10 hover:text-white transition-all flex flex-col items-center gap-1 group/btn"
                                            title="Descargar Factura"
                                        >
                                            <Download size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                                            <span className="text-[10px] font-medium uppercase">PDF</span>
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
