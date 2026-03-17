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
import { doc, getDoc, setDoc, Timestamp, onSnapshot, DocumentData } from "firebase/firestore";
import { db, auth, FIREBASE_READY } from "@/lib/firebase";

// Force Spanish for Firebase Emails
if (auth) {
    auth.languageCode = 'es';
}

import { UserSubscription, UserProfile } from "@/types/user";
import { SubscriptionPlan } from "@/types/finance";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: 'student' | 'teacher' | 'admin' | null;
    subscription: UserSubscription;
    activeActivity: { id: string; type: 'simulation' | 'training' } | null;
    registerActivity: (activity: { id: string; type: 'simulation' | 'training' } | null) => void;
    completedProfile: boolean;
    loading: boolean;
    isSuperAdmin: boolean;
    impersonatedRole: 'student' | 'teacher' | 'admin' | null;
    switchRole: (role: 'student' | 'teacher' | 'admin' | null) => void;
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
    const [activeActivity, setActiveActivity] = useState<{ id: string; type: 'simulation' | 'training' } | null>(null);
    const [impersonatedRole, setImpersonatedRole] = useState<'student' | 'teacher' | 'admin' | null>(null);

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS_OBFUSCATED || "").split(",").map((e: string) => e.trim().toLowerCase());
    const isSuperAdmin = !!(user?.email && adminEmails.includes(user.email.toLowerCase()));

    const switchRole = (newRole: 'student' | 'teacher' | 'admin' | null) => {
        if (!isSuperAdmin) return;
        setImpersonatedRole(newRole);
    };

    useEffect(() => {
        if (!FIREBASE_READY || !auth) {
            setLoading(false);
            return;
        }

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
        if (!user || !FIREBASE_READY || !db) return;

        const unsubscribeSnapshot = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS_OBFUSCATED || "").split(",").map((e: string) => e.trim().toLowerCase());
            const isSuperAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

            if (docSnap.exists()) {
                const data = docSnap.data() as DocumentData;
                setProfile(data as UserProfile);

                if (isSuperAdmin) {
                    setRole('admin');
                    // Optimization: Only update Firestore if stored role is not admin
                    if (data.role !== 'admin') {
                        setDoc(doc(db, "users", user.uid), { role: 'admin' }, { merge: true })
                            .catch(err => console.error("Error auto-setting admin role:", err));
                    }
                } else {
                    // Properly handle null/missing role to avoid fallback to 'student' in onboarding
                    const storedRole = data.role;
                    if (storedRole === null || storedRole === undefined) {
                        setRole(null);
                    } else {
                        setRole(storedRole as 'student' | 'teacher' | 'admin');
                    }
                }

                setCompletedProfile(data.completedProfile || false);
                setSubscription(data.subscription as UserSubscription || defaultSubscription);
            } else {
                setRole(isSuperAdmin ? 'admin' : null); // null forces onboarding
                setSubscription(defaultSubscription);
                setCompletedProfile(false);
            }
            setLoading(false);
        }, (error) => {
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
                        },
                        gamification: {
                            xp: 0,
                            level: 1,
                            badges: [],
                            streak: {
                                current: 0,
                                lastActiveDate: null
                            }
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
        try {
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
            try {
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: email,
                    role: null, // Forces Onboarding Selection
                    subscription: defaultSubscription,
                    createdAt: new Date(),
                    fullName: "", // To be filled in profile
                    completedProfile: false,
                    consentLog: consentLog,
                    gamification: {
                        xp: 0,
                        level: 1,
                        badges: [],
                        streak: {
                            current: 0,
                            lastActiveDate: null
                        }
                    }
                });
            } catch (fsError: any) {
                console.error("Critical: Auth succeeded but Firestore init failed", fsError);
                throw fsError; // Throwing ensures the UI knows something went wrong with the DB
            }

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
                }
            } catch (e) {
                console.error("Error migrating diagnostic data", e);
            }
        } catch (error: any) {
            console.error("Firebase Signup 400/Error Diagnostic:", {
                code: error.code,
                message: error.message,
                email: email
            });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);

            // Full state and cache cleanup for performance and security
            if (typeof window !== 'undefined') {
                // Clear selective storage to avoid resource bloat
                localStorage.removeItem("saberpro_diagnostic_results");
                localStorage.removeItem("saberpro_onboarding_step");
                sessionStorage.clear();

                // Final redirection to anchor clean start
                window.location.href = "/";
            }
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
        <AuthContext.Provider value={{
            user,
            profile,
            role: impersonatedRole || role,
            subscription,
            completedProfile,
            loading,
            isSuperAdmin,
            activeActivity,
            registerActivity: setActiveActivity,
            impersonatedRole,
            switchRole,
            signInWithGoogle,
            login,
            signup,
            logout,
            resetPassword,
            confirmPasswordReset
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
