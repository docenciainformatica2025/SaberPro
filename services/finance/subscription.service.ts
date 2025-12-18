import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

// Types
interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

/**
 * Mocks the payment processing with an external provider (Stripe/Wompi)
 * In a real app, this would call a Cloud Function to keep secrets safe.
 */
export const processPaymentMock = async (token: string, amount: number): Promise<PaymentResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success logic
    if (token) {
        return { success: true, transactionId: `TRX-${Date.now()}` };
    }
    return { success: false, error: "Token inválido" };
};

/**
 * Upgrades the user's role and subscription in Firestore
 */
export const upgradeUserSubscription = async (userId: string, planName: 'pro', transactionId: string, amount: number, riskContextJson?: string) => {
    try {
        const userRef = doc(db, "users", userId);

        // 1. Update User Profile
        await updateDoc(userRef, {
            "subscription.plan": planName,
            "subscription.status": "active",
            "subscription.renewsAt": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
            "subscription.updatedAt": serverTimestamp()
        });

        // 2. Parse Risk Context
        let riskMetadata = {};
        let paymentMethodDesc = 'Credit Card';

        if (riskContextJson) {
            try {
                const parsed = JSON.parse(riskContextJson);
                riskMetadata = {
                    deviceId: parsed.deviceId,
                    ip: parsed.ip,
                    userAgent: parsed.userAgent,
                    riskScore: Math.floor(Math.random() * 10) // Mock Score
                };
                if (parsed.method) {
                    paymentMethodDesc = `${parsed.method.brand.toUpperCase()} **** ${parsed.method.last4}`;
                }
            } catch (e) {
                console.warn("Failed to parse risk context", e);
            }
        }

        // 3. Log Transaction (Audit)
        const transactionRef = doc(db, "transactions", transactionId);
        await setDoc(transactionRef, {
            userId,
            amount,
            currency: 'COP',
            plan: planName,
            status: 'completed',
            provider: 'MockGateway', // In real app: 'Stripe', 'Wompi'
            method: paymentMethodDesc,
            riskContext: riskMetadata, // Detailed Audit Trail
            createdAt: serverTimestamp(),
            security: "TLS_1_3_ENFORCED"
        });

        return true;
    } catch (error) {
        console.error("Error upgrading user:", error);
        throw error;
    }
};
