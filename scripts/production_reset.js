/**
 * SABERPRO - PRODUCTION RESET PROTOCOL 2026
 * 
 * Este script ejecuta una limpieza profunda del clúster de Firestore para salida a producción.
 * REGLAS DE ORO:
 * 1. Mantiene intacto el banco de preguntas (Questions).
 * 2. Preserva únicamente al Administrador Maestro (Root).
 * 3. Realiza un backup preventivo en archivos JSON.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// CONFIGURACIÓN
const ADMIN_EMAIL = "antonio_rburgos@msn.com";
const BACKUP_DIR = path.join(__dirname, '../backups/production_reset_' + Date.now());
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../lib/firebase-admin-sdk.json');

// COLECCIONES A PURGAR (Borrado Total)
const COLLECTIONS_TO_PURGE = [
    "admin_audit",
    "results",
    "assignments",
    "classrooms",
    "class_members",
    "transactions",
    "notifications",
    "simulations"
];

async function initialize() {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error(`❌ ERROR: No se encontró el archivo de credenciales en ${SERVICE_ACCOUNT_PATH}`);
        console.log("Por favor, coloca el archivo 'firebase-admin-sdk.json' en web-app/lib/");
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
    const snapshot = await db.collection(collectionName).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(path.join(BACKUP_DIR, `${collectionName}.json`), JSON.stringify(data, null, 2));
    console.log(`✅ ${data.length} documentos respaldados.`);
}

async function deleteCollection(db, collectionName) {
    console.log(`🔥 Purgando colección: ${collectionName}...`);
    const snapshot = await db.collection(collectionName).get();
    const batchSize = 400;
    let count = 0;

    if (snapshot.empty) return;

    let batch = db.batch();
    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        count++;
        if (count % batchSize === 0) {
            await batch.commit();
            batch = db.batch();
        }
    }
    await batch.commit();
    console.log(`💀 ${count} documentos eliminados.`);
}

async function runReset() {
    const db = await initialize();
    console.log("🚀 INICIANDO PROTOCOLO DE REINICIO PROFESIONAL 2026");

    // 1. BACKUP PREVENTIVO (De todas las colecciones relevantes)
    const allRelevant = [...COLLECTIONS_TO_PURGE, "users", "questions"];
    for (const col of allRelevant) {
        await backupCollection(db, col);
    }

    // 2. IDENTIFICACIÓN Y PROTECCIÓN DEL ADMIN MAESTRO
    console.log(`👤 Validando Administrador Maestro: ${ADMIN_EMAIL}...`);
    const userSnapshot = await db.collection('users').where('email', '==', ADMIN_EMAIL).get();

    if (userSnapshot.empty) {
        console.error("❌ ERROR CRÍTICO: El Administrador Maestro no existe en la base de datos.");
        console.log("Abortando para evitar pérdida de acceso.");
        process.exit(1);
    }

    const adminDoc = userSnapshot.docs[0];
    console.log("✅ Admin localizado. Asegurando privilegios Root...");
    await adminDoc.ref.update({
        role: "admin",
        isSystem: true
    });

    // 3. PURGA DE USUARIOS (Excepto Maestro)
    console.log("🔥 Eliminando usuarios secundarios...");
    const allUsers = await db.collection('users').get();
    let userDeletes = 0;
    let batch = db.batch();

    for (const userDoc of allUsers.docs) {
        if (userDoc.data().email !== ADMIN_EMAIL) {
            batch.delete(userDoc.ref);
            userDeletes++;
        }
    }
    await batch.commit();
    console.log(`💀 ${userDeletes} usuarios eliminados. Solo ${ADMIN_EMAIL} permanece activo.`);

    // 4. PURGA DE COLECCIONES DE NEGOCIO Y LOGS
    for (const col of COLLECTIONS_TO_PURGE) {
        await deleteCollection(db, col);
    }

    console.log("\n✨ REINICIO COMPLETADO CON ÉXITO");
    console.log(`📂 Backup disponible en: ${BACKUP_DIR}`);
    console.log("Banco de preguntas (Questions) preservado al 100%.");
}

runReset().catch(err => {
    console.error("💥 FALLO CATASTRÓFICO:", err);
    process.exit(1);
});
