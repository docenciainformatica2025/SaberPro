import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB02d8Qvi9k4GEGGhxrj2YpdqOvivC2CIk",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "control-gastos-plataforma.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "control-gastos-plataforma",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "control-gastos-plataforma.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "455561355322",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:455561355322:web:e3acebd1025ef311f81503",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E99DBGCSX8"
};

// Initialize Firebase - handle both client and server side
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
    app = null as any;
    auth = null as any;
    db = null as any;
}

export { app, auth, db };

// Initialize analytics only on client side and if supported
export const analytics = typeof window !== 'undefined' && app ?
    isSupported().then(yes => yes ? getAnalytics(app) : null)
    : null;
