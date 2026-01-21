import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { Transaction, PaymentStatus } from "@/types/finance";

const TRANSACTIONS_COLLECTION = "transactions";

export class AuditService {

    /**
     * Creates an immutable transaction record.
     * Conceptually similar to a "Journal Entry" in accounting.
     */
    static async logTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const newTxRef = doc(collection(db, TRANSACTIONS_COLLECTION));

        const transactionRecord: Transaction = {
            ...data,
            id: newTxRef.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await setDoc(newTxRef, transactionRecord);

        // In a real double-entry system, we would also write to a Ledger collection here.
        // For this app, the 'transactions' collection serves as the primary ledger.

        return newTxRef.id;
    }

    static async updateTransactionStatus(txId: string, status: PaymentStatus, metadata?: Record<string, unknown>): Promise<void> {
        const txRef = doc(db, TRANSACTIONS_COLLECTION, txId);

        await updateDoc(txRef, {
            status,
            updatedAt: Date.now(),
            ...(metadata ? { metadata } : {}) // Merge metadata if provided
        });

        console.log(`[AUDIT] Transaction ${txId} updated to ${status}`);
    }

    static async getTransaction(txId: string): Promise<Transaction | null> {
        const snap = await getDoc(doc(db, TRANSACTIONS_COLLECTION, txId));
        if (!snap.exists()) return null;
        return snap.data() as Transaction;
    }
}
