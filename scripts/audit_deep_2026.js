const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const files = [
    'questions-citizenship.json',
    'questions-communication.json',
    'questions-english.json',
    'questions-quantitative.json',
    'questions-reading.json'
];

console.log("🕵️ Iniciando REVISIÓN PROFUNDA (Nivel Forense) - SaberPro 2026");

const globalIds = new Set();
const globalTexts = new Set();
let totalQuestions = 0;
let internalOptionDuplicates = 0;
let semanticConflicts = 0;
let invalidKeys = 0;

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) return;

    let questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const uniqueBatch = [];

    questions.forEach(q => {
        const textNorm = q.text.trim().toLowerCase();

        // 1. Unicidad de IDs y Contenido
        if (globalIds.has(q.id) || globalTexts.has(textNorm)) {
            semanticConflicts++;
            return;
        }

        // 2. VERIFICACIÓN DE RESPUESTAS DUPLICADAS DENTRO DE LA PREGUNTA
        const optionTexts = new Set();
        let hasDuplicateOption = false;
        q.options.forEach(opt => {
            const optNorm = opt.text.trim().toLowerCase();
            if (optionTexts.has(optNorm)) {
                hasDuplicateOption = true;
            }
            optionTexts.add(optNorm);
        });

        if (hasDuplicateOption) {
            internalOptionDuplicates++;
            // Intentar reparar si es posible (no lo hacemos aquí para ver si existen)
            return;
        }

        // 3. Verificación de Formato Estricto (A, B, C, D)
        if (q.options.length !== 4) {
            invalidKeys++;
            return;
        }

        // 4. Verificación de Respuesta Correcta Definida
        if (!q.correctAnswer || !q.options.some(o => o.id === q.correctAnswer)) {
            invalidKeys++;
            return;
        }

        globalIds.add(q.id);
        globalTexts.add(textNorm);
        uniqueBatch.push(q);
    });

    totalQuestions += uniqueBatch.length;
    // Sobreescribimos solo si queremos limpiar, pero ahora solo AUDITAMOS
    // fs.writeFileSync(filePath, JSON.stringify(uniqueBatch, null, 2));
    console.log(`- [${file}] ${uniqueBatch.length} preguntas impecables.`);
});

console.log("\n📊 RESULTADO DE LA REVISIÓN PROFUNDA:");
console.log(`- Total Preguntas Perfectas: ${totalQuestions}`);
console.log(`- Preguntas con Opciones Duplicadas (Descartadas): ${internalOptionDuplicates}`);
console.log(`- Conflictos de Texto/ID (Eliminados): ${semanticConflicts}`);
console.log(`- Errores de Formato/Claves: ${invalidKeys}`);

if (internalOptionDuplicates === 0 && semanticConflicts === 0) {
    console.log("🏆 EXCELENCIA: El banco no tiene errores de redundancia interna.");
} else {
    console.log("⚠️ ATENCIÓN: Se encontraron inconsistencias que han sido filtradas.");
}
