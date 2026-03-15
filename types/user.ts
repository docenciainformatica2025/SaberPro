import { Timestamp } from "firebase/firestore";
import { SubscriptionPlan } from "./finance";

export interface UserSubscription {
    plan: SubscriptionPlan;
    status: 'active' | 'expired' | 'cancelled';
    validUntil?: Timestamp | number;
}

export interface UserProfile {
    uid: string;
    email: string;
    fullName?: string;
    role?: 'student' | 'teacher' | 'admin' | null;
    gradeLevel?: string;
    targetCareer?: string;
    dreamUniversity?: string;
    institution?: string;
    city?: string;
    scoreGoal?: string;
    subscription?: UserSubscription;
    onboardingCompleted?: boolean;
    completedProfile?: boolean;
    gamification?: {
        xp?: number;
        streak?: {
            current: number;
            lastActiveDate: string | null;
        };
        badges?: string[];
        level?: number;
    };
    consentLog?: {
        acceptedAt: string;
        version: string;
        type: string;
        ipHash: string;
    };
    createdAt?: any;
    [key: string]: any; // Allow for extensibility
}
