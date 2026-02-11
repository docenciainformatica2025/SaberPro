/**
 * SABERPRO - AUDIT BACKUP PROTOCOL 2026
 * 
 * Este script realiza un respaldo completo de las colecciones de Firestore
 * en archivos JSON para auditoría y persistencia pre-despliegue.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// CONFIGURACIÓN
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.join(__dirname, '../backups/audit_db_backup_' + TIMESTAMP);
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../lib/firebase-admin-sdk.json');

const COLLECTIONS = [
    "admin_audit",
    "results",
    "assignments",
    "classrooms",
    "class_members",
    "transactions",
    "notifications",
    "simulations",
    "users",
    "questions"
];

async function initialize() {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error(`❌ ERROR: No se encontró el archivo de credenciales en ${SERVICE_ACCOUNT_PATH}`);
        process.exit(1);
    }

    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    return admin.firestore();
}

async function backupCollection(db, collectionName) {
    console.log(`📦 Respaldando colección: ${collectionName}...`);
    try {
        const snapshot = await db.collection(collectionName).get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
        fs.writeFileSync(path.join(BACKUP_DIR, `${collectionName}.json`), JSON.stringify(data, null, 2));
        console.log(`✅ ${data.length} documentos respaldados.`);
    } catch (e) {
        console.error(`❌ Error respaldando ${collectionName}:`, e.message);
    }
}

async function runBackup() {
    const db = await initialize();
    console.log("🚀 INICIANDO RESPALDO DE AUDITORÍA 2026");

    for (const col of COLLECTIONS) {
        await backupCollection(db, col);
    }

    console.log("\n✨ RESPALDO COMPLETADO CON ÉXITO");
    console.log(`📂 Ubicación: ${BACKUP_DIR}`);
}

runBackup().catch(err => {
    console.error("💥 FALLO EN EL RESPALDO:", err);
    process.exit(1);
});
