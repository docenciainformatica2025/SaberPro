"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    User
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// Force Spanish for Firebase Emails
auth.languageCode = 'es';

import { SubscriptionPlan } from "@/types/finance";

// Basic subscription types
export interface UserSubscription {
    plan: SubscriptionPlan; // Use shared Type
    status: 'active' | 'expired' | 'cancelled';
    validUntil?: Timestamp; // Timestamp
}

export interface UserProfile {
    fullName?: string;
    email: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: 'student' | 'teacher' | 'admin' | null;
    subscription: UserSubscription;
    completedProfile: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
}

const defaultSubscription: UserSubscription = { plan: SubscriptionPlan.FREE, status: 'active' };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthError {
    code: string;
    message: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<AuthError | null>(null);
    const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
    const [completedProfile, setCompletedProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            if (!authUser) {
                setProfile(null);
                setRole(null);
                setSubscription(defaultSubscription);
                setCompletedProfile(false);
                setLoading(false);
            }
            // If authUser exists, the second useEffect will trigger to fetch firestore data
        });

        return () => unsubscribeAuth();
    }, []);

    // 2. Real-time Firestore Profile Sync
    useEffect(() => {
        if (!user) return;

        const unsubscribeSnapshot = onSnapshot(doc(db, "users", user.uid), async (docSnap: any) => {
            // Check if super admin via env
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e: string) => e.trim().toLowerCase());
            const isSuperAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfile(data as UserProfile);

                // Handle Admin Whitelist enforcement
                if (isSuperAdmin && data.role !== 'admin') {
                    // We don't want to infinite loop here, so careful.
                    // But setDoc is async. We just update state for now locally and fire-and-forget update?
                    // Better to just respect the whitelist locally or trigger update only if needed.
                    if (data.role !== 'admin') {
                        await setDoc(doc(db, "users", user.uid), { role: 'admin' }, { merge: true });
                    }
                    setRole('admin');
                } else {
                    if (data.role === null) {
                        setRole(null);
                    } else {
                        setRole(data.role as 'student' | 'teacher' || 'student');
                    }
                }

                setCompletedProfile(data.completedProfile || false);
                setSubscription(data.subscription as UserSubscription || defaultSubscription);
            } else {
                // Profile doesn't exist yet (e.g. just signed up and trigger hasn't run, or manual create)
                // We can handle creation here or wait. 
                // For now, default values.
                setRole(isSuperAdmin ? 'admin' : 'student');
                setSubscription(defaultSubscription);
                setCompletedProfile(false);
            }
            setLoading(false);
        }, (error: any) => {
            console.error("Error watching user profile:", error);
            setLoading(false);
        });

        return () => unsubscribeSnapshot();
    }, [user]);
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Initialize user document if not exists
            if (result.user) {
                const userRef = doc(db, "users", result.user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        email: result.user.email,
                        role: null, // Forces Onboarding
                        subscription: defaultSubscription,
                        createdAt: new Date(),
                        fullName: result.user.displayName || "",
                        completedProfile: false,
                        consentLog: {
                            acceptedAt: new Date().toISOString(),
                            version: "v1.0-2025-google",
                            type: "Habeas Data + Términos (vía Google)",
                            ipHash: "GOOGLE_AUTH_INIT"
                        }
                    });
                }
            }

            // Migrate Diagnostic Data if exists
            try {
                const diagnosticData = localStorage.getItem("saberpro_diagnostic_results");
                if (diagnosticData && result.user) {
                    const parsed = JSON.parse(diagnosticData);
                    const resultsRef = await import("firebase/firestore").then(mod => mod.collection(db, "results"));
                    const addDoc = await import("firebase/firestore").then(mod => mod.addDoc);

                    await addDoc(resultsRef, {
                        userId: result.user.uid,
                        type: 'diagnostic',
                        score: parsed.score,
                        totalQuestions: 5,
                        answers: parsed.answers,
                        completedAt: new Date(parsed.date || Date.now()),
                        migratedFromPublic: true
                    });

                    localStorage.removeItem("saberpro_diagnostic_results");
                    console.log("Diagnostic data migrated successfully (Google Auth).");
                }
            } catch (e) {
                console.error("Error migrating diagnostic data", e);
            }

        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Check for pre-registration consent
        let consentLog = {
            acceptedAt: new Date().toISOString(),
            version: "v1.0-2025",
            type: "Habeas Data + Términos",
            ipHash: "ANONYMIZED_IP_REGISTER_INIT"
        };

        if (typeof window !== 'undefined') {
            const savedConsent = localStorage.getItem("saberpro_pending_consent");
            if (savedConsent) {
                try {
                    consentLog = JSON.parse(savedConsent);
                    localStorage.removeItem("saberpro_pending_consent"); // Clear after use
                } catch (e) {
                    console.error("Error parsing saved consent", e);
                }
            }
        }

        // Create initial user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            role: null, // Forces Onboarding Selection
            subscription: defaultSubscription,
            createdAt: new Date(),
            fullName: "", // To be filled in profile
            completedProfile: false,
            consentLog: consentLog
        });

        // Migrate Diagnostic Data if exists
        try {
            const diagnosticData = localStorage.getItem("saberpro_diagnostic_results");
            if (diagnosticData) {
                const parsed = JSON.parse(diagnosticData);
                const resultsRef = await import("firebase/firestore").then(mod => mod.collection(db, "results"));
                const addDoc = await import("firebase/firestore").then(mod => mod.addDoc);

                await addDoc(resultsRef, {
                    userId: userCredential.user.uid,
                    type: 'diagnostic',
                    score: parsed.score,
                    totalQuestions: 5,
                    answers: parsed.answers,
                    completedAt: new Date(parsed.date || Date.now()),
                    migratedFromPublic: true
                });

                localStorage.removeItem("saberpro_diagnostic_results");
                console.log("Diagnostic data migrated successfully.");
            }
        } catch (e) {
            console.error("Error migrating diagnostic data", e);
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            // Force redirect to home after logout
            // We can't strictly use router here if it's not imported.
            // But it is a hook.
            // IMPORTANT: I need to verify if useRouter is imported in AuthContext.
            // Looking at previous view_file of AuthContext, it was NOT imported.
            // Usage of window.location.href is safer for full clearance, or standard router.
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const resetPassword = async (email: string) => {
        const { sendPasswordResetEmail } = await import("firebase/auth");
        const { query, collection, where, getDocs } = await import("firebase/firestore");

        // 1. Check if user exists in our database first (to give explicit feedback)
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw { code: 'custom/user-not-found' };
        }

        // 2. If exists, send the email
        await sendPasswordResetEmail(auth, email);
    }

    const confirmPasswordReset = async (oobCode: string, newPassword: string) => {
        const { confirmPasswordReset } = await import("firebase/auth");
        await confirmPasswordReset(auth, oobCode, newPassword);
    }

    return (
        <AuthContext.Provider value={{ user, profile, role, subscription, completedProfile, loading, signInWithGoogle, login, signup, logout, resetPassword, confirmPasswordReset }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
