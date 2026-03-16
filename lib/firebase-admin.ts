import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
                databaseURL: `https://${projectId}.firebaseio.com`,
            });
        } catch (error) {
            console.error('Firebase admin initialization error:', error);
        }
    } else {
        console.warn('Firebase Admin SDK not initialized: Missing environment variables.');
    }
}

// Lazy exports to avoid crashing during build if not initialized
export const adminDb = admin.apps.length ? admin.firestore() : null as any;
export const adminAuth = admin.apps.length ? admin.auth() : null as any;
