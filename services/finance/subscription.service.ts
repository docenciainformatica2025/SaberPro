import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, serverTimestamp, getDoc, runTransaction } from "firebase/firestore";

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
export const upgradeUserSubscription = async (userId: string, planName: 'pro', transactionId: string, amount: number, currency: string = 'COP', riskContextJson?: string) => {
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
            currency,
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

/**
 * Redeems an access code / coupon for a premium plan (Atomic Transaction)
 */
export const redeemCoupon = async (userId: string, code: string) => {
    try {
        const cleanedCode = code.toUpperCase().trim();
        const couponRef = doc(db, "coupons", cleanedCode);
        const userRef = doc(db, "users", userId);

        return await runTransaction(db, async (transaction) => {
            const couponSnap = await transaction.get(couponRef);

            if (!couponSnap.exists()) {
                throw new Error("El código ingresado no existe.");
            }

            const couponData = couponSnap.data();

            if (couponData.isUsed) {
                throw new Error("Este código ya ha sido utilizado.");
            }

            if (couponData.expiresAt && couponData.expiresAt.toDate() < new Date()) {
                throw new Error("Este código ha expirado.");
            }

            // 1. Mark coupon as used in the transaction
            transaction.update(couponRef, {
                isUsed: true,
                usedBy: userId,
                usedAt: serverTimestamp()
            });

            // 2. Upgrade User in the transaction
            transaction.update(userRef, {
                "subscription.plan": couponData.plan,
                "subscription.status": "active",
                "subscription.renewsAt": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
                "subscription.updatedAt": serverTimestamp(),
                "subscription.method": "coupon",
                "subscription.couponCode": cleanedCode
            });

            // 3. Log pseudo-transaction for audit (Atomic set)
            const transactionId = `COUPON-${cleanedCode}-${Date.now()}`;
            const txRef = doc(db, "transactions", transactionId);
            transaction.set(txRef, {
                userId,
                amount: 0,
                currency: 'COP',
                plan: couponData.plan,
                status: 'completed',
                provider: 'PromoSystem',
                method: 'Access Code',
                createdAt: serverTimestamp(),
                metadata: { couponCode: cleanedCode }
            });

            return { success: true, plan: couponData.plan };
        });
    } catch (error: any) {
        console.error("Error redeeming coupon:", error.message);
        throw error;
    }
};

/**
 * Admin: Generate multiple coupons
 */
export const generateCoupons = async (count: number, plan: 'pro' | 'teacher', description: string = "Promo Admin") => {
    const results = [];
    const batchSize = 10;
    for (let i = 0; i < count; i++) {
        try {
            const randomBytes = new Uint8Array(5);
            const cryptoObj = (typeof window !== 'undefined' ? window.crypto : null) || (global as any).crypto || require('crypto');
            if (cryptoObj.getRandomValues) {
                cryptoObj.getRandomValues(randomBytes);
            } else {
                randomBytes.set(require('crypto').randomBytes(5));
            }
            const code = Array.from(randomBytes).map(b => b.toString(36).padStart(2, '0')).join('').substring(0, 8).toUpperCase();
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

            if ((i + 1) % batchSize === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error: any) {
            console.error(` Error generando cupón en iteración ${i}:`, error);
            throw new Error(`Falló la generación masiva: ${error.message}`);
        }
    }
    console.log(`Generación completada: ${results.length} códigos`);
    return results;
};
