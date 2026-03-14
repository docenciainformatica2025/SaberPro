/**
 * SABERPRO - AUTO-VERSION SYNC 2026
 * 
 * Este script automatiza la actualización de la versión en Firestore
 * durante el proceso de despliegue (build).
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// RUTAS
const CONFIG_PATH = path.join(__dirname, '../lib/config.ts');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../lib/firebase-admin-sdk.json');

async function syncVersion() {
    console.log("🔄 Iniciando sincronización de versión automática...");

    // 1. EXTRAER VERSIÓN DEL CÓDIGO
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error("❌ ERROR: No se encontró lib/config.ts");
        process.exit(1);
    }

    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const versionMatch = configContent.match(/APP_VERSION\s*=\s*"([^"]+)"/);

    if (!versionMatch || !versionMatch[1]) {
        console.error("❌ ERROR: No se pudo encontrar APP_VERSION en config.ts");
        process.exit(1);
    }

    const currentVersion = versionMatch[1];
    console.log(`📦 Versión detectada en código: ${currentVersion}`);

    // 2. INICIALIZAR FIREBASE ADMIN
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.warn("⚠️ ADVERTENCIA: No se encontró firebase-admin-sdk.json. Saltando sincronización de DB.");
        console.log("Asegúrate de configurar esta actualización manual o vía CI/CD con variables de entorno.");
        process.exit(0);
    }

    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    const db = admin.firestore();

    // 3. ACTUALIZAR FIRESTORE
    try {
        const configRef = db.collection('config').doc('system');
        await configRef.set({
            latestVersion: currentVersion,
            lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
            updateMessage: "Mejoras de rendimiento y seguridad aplicadas automáticamente."
        }, { merge: true });

        console.log(`✅ Firestore actualizado a la versión ${currentVersion} exitosamente.`);
    } catch (error) {
        console.error("❌ ERROR al actualizar Firestore:", error.message);
        process.exit(1);
    }
}

syncVersion().catch(err => {
    console.error("💥 FALLO CRÍTICO EN SYNC:", err);
    process.exit(1);
});
