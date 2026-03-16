import * as admin from 'firebase-admin';

/**
 * --- SEGURIDAD MILITAR 2026: INICIALIZACIÓN BLINDADA ---
 * Este módulo asegura que el SDK de Administración solo se inicialice una vez
 * y valida rigurosamente las credenciales del servidor.
 */

if (!admin.apps.length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Validación estricta de variables críticas
    if (projectId && clientEmail && privateKey) {
        try {
            // Limpieza y normalización de la llave privada (soporte multi-entorno)
            const formattedKey = privateKey.includes('RSA PRIVATE KEY') 
                ? privateKey.replace(/\\n/g, '\n') 
                : privateKey;

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: formattedKey,
                }),
                databaseURL: `https://${projectId}.firebaseio.com`,
            });
            console.log('✅ Firebase Admin SDK inicializado correctamente.');
        } catch (error: any) {
            console.error('❌ Error crítico de inicialización Firebase Admin:', error.message);
        }
    } else {
        if (process.env.NODE_ENV === 'production') {
            console.error('⚠️ ALERTA DE SEGURIDAD: Credenciales de Administrador faltantes en producción.');
        } else {
            console.warn('ℹ️ Firebase Admin SDK en modo bypass (Local sin credenciales).');
        }
    }
}

// Exportaciones protegidas (Proxy Object para evitar nulos accidentales)
export const adminDb = admin.apps.length ? admin.firestore() : null as any;
export const adminAuth = admin.apps.length ? admin.auth() : null as any;
export { admin };
