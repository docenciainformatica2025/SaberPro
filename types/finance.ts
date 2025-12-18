export type CurrencyCode = 'COP' | 'USD';

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    DISPUTED = 'DISPUTED'
}

export enum SubscriptionPlan {
    FREE = 'free',
    PRO = 'pro',
    TEACHER_PRO = 'teacher',
    INSTITUTION = 'institution'
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    PSE = 'pse',
    NEQUI = 'nequi',
    MANUAL = 'manual', // For testing/admin overrides
    SIMULATED = 'simulated' // For dev mode
}

/**
 * ISO 20022 inspired Transaction Interface
 * Represents an immutable financial event.
 */
export interface Transaction {
    id: string; // Unique Transaction ID (TXID)
    userId: string;
    reference: string; // Internal Order Reference
    amount: number;
    currency: CurrencyCode;
    status: PaymentStatus;
    method: PaymentMethod;
    description: string;

    // Audit Timestamps
    createdAt: number; // Unix Timestamp
    updatedAt: number;

    // Tax & Compliance Data
    billingDetails?: {
        taxId?: string; // NIT / CC
        name: string;
        email: string;
        address?: string;
        city?: string;
    };

    metadata?: Record<string, any>;
}

/**
 * Subscription State Model
 */
export interface SubscriptionLink {
    plan: SubscriptionPlan;
    status: 'active' | 'canceled' | 'expired' | 'past_due';
    validUntil: number; // Unix Timestamp
    autoRenew: boolean;
    lastPaymentId?: string;
}

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.FREE]: 0,
    [SubscriptionPlan.PRO]: 49900,
    [SubscriptionPlan.TEACHER_PRO]: 89900,
    [SubscriptionPlan.INSTITUTION]: 0 // Custom
};
