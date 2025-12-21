const fs = require('fs');
const path = require('path');
const { generateId } = require('./utils/idGenerator');

const TOTAL_QUESTIONS = 200;
const COUNTS = {
    media: Math.floor(TOTAL_QUESTIONS * 0.5),
    media_alta: Math.floor(TOTAL_QUESTIONS * 0.3),
    avanzada: Math.floor(TOTAL_QUESTIONS * 0.2)
};

const TEMPLATES = [
    // --- ORTHOGRAPHY (Homophones/Accents) ---
    {
        type: "orthography",
        difficulty: "media",
        generate: () => {
            const items = [
                { correct: "haya", context: "Espero que _____ llegado bien.", distractors: ["halla", "alla", "aya"] },
                { correct: "halla", context: "No sé dónde se _____ la sede central.", distractors: ["haya", "alla", "aya"] },
                { correct: "valla", context: "Saltó la _____ para entrar al estadio.", distractors: ["vaya", "baya", "balla"] },
                { correct: "vaya", context: "No creo que _____ a llover hoy.", distractors: ["valla", "baya", "balla"] },
                { correct: "hecho", context: "Ya he _____ la tarea.", distractors: ["echo", "ehcho", "hice"] },
                { correct: "echo", context: "Siempre _____ de menos mi ciudad.", distractors: ["hecho", "ehcho", "ecco"] },
                { correct: "cayó", context: "El niño se _____ del columpio.", distractors: ["calló", "calio", "callo"] },
                { correct: "calló", context: "El público se _____ al iniciar la obra.", distractors: ["cayó", "cayo", "calio"] },
                { correct: "bienes", context: "Donó todos sus _____ a la caridad.", distractors: ["vienes", "bénes", "vlenes"] },
                { correct: "vienes", context: "¿Cuándo _____ a visitarme?", distractors: ["bienes", "biénes", "benes"] }
            ];

            const item = items[Math.floor(Math.random() * items.length)];

            return {
                text: `Seleccione la palabra correcta para completar la oración:\n\n"${item.context}"`,
                correct: item.correct,
                distractors: item.distractors,
                explanation: `En este contexto, la forma correcta es "${item.correct}".`
            };
        }
    },
    // --- CONNECTORS (Coherence) ---
    {
        type: "connector_usage",
        difficulty: "media_alta",
        generate: () => {
            const items = [
                { sentence: "Estudió mucho para el examen; _____, aprobó con honores.", correct: "por lo tanto", type: "consecuencia" },
                { sentence: "Quería ir a la fiesta; _____, tenía mucho trabajo pendiente.", correct: "sin embargo", type: "oposición" },
                { sentence: "Debemos ahorrar agua ____ es un recurso limitado.", correct: "ya que", type: "causa" },
                { sentence: "Llegó tarde a la reunión ____ perdió el vuelo.", correct: "porque", type: "causa" },
                { sentence: "No solo es inteligente, ____ trabaja muy duro.", correct: "sino que también", type: "adición" },
                { sentence: "El proyecto es viable, ____ requiere mucha inversión inicial.", correct: "aunque", type: "concesión" }
            ];

            const item = items[Math.floor(Math.random() * items.length)];
            const otherConnectors = ["sin embargo", "por lo tanto", "ya que", "además", "aunque", "pero", "sino que también"].filter(c => c !== item.correct);
            const distractors = otherConnectors.sort(() => 0.5 - Math.random()).slice(0, 3);

            return {
                text: `Complete la oración con el conector lógico más adecuado:\n\n"${item.sentence}"`,
                correct: item.correct,
                distractors: distractors,
                explanation: `La relación lógica entre las oraciones requiere un conector de ${item.type} como "${item.correct}".`
            };
        }
    },
    // --- TEXT ORGANIZATION (Order) ---
    {
        type: "text_order",
        difficulty: "avanzada",
        generate: () => {
            // Arrays of logical steps
            const sequences = [
                ["1. Definición del problema.", "2. Análisis de causas.", "3. Propuesta de soluciones.", "4. Conclusiones finales."],
                ["1. Introducción al tema.", "2. Desarrollo de argumentos.", "3. Presentación de contraargumentos.", "4. Síntesis y cierre."],
                ["1. Recolección de datos.", "2. Procesamiento de la información.", "3. Análisis de resultados.", "4. Publicación del informe."],
                ["1. Identificación de necesidades.", "2. Diseño del prototipo.", "3. Pruebas de usuario.", "4. Lanzamiento del producto."]
            ];

            const selectedSeq = sequences[Math.floor(Math.random() * sequences.length)];
            const correctOrder = selectedSeq.join(" - ");

            // Generate distractors by shuffling
            const d1 = [...selectedSeq].sort(() => Math.random() - 0.5).join(" - ");
            const d2 = [...selectedSeq].reverse().join(" - ");
            const d3 = [selectedSeq[1], selectedSeq[0], selectedSeq[3], selectedSeq[2]].join(" - "); // Swap pairs

            const distractors = [d1, d2, d3].filter(d => d !== correctOrder);
            // Ensure 3 distractors even if filter removed duplicates (unlikely with strings)
            while (distractors.length < 3) distractors.push("Orden incorrecto aleatorio");

            return {
                text: `Organice lógicamente los siguientes apartados para un texto coherente:\n\n${selectedSeq.sort(() => Math.random() - 0.5).join("\n")}`, // Show shuffled in prompt
                correct: correctOrder,
                distractors: distractors.slice(0, 3),
                explanation: `El orden lógico deductivo o cronológico correcto es: ${correctOrder}.`
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    const generateBatch = (count, difficulty) => {
        let pool = TEMPLATES;
        if (difficulty === 'media') pool = TEMPLATES.filter(t => t.type === 'orthography');
        if (difficulty === 'media_alta') pool = TEMPLATES.filter(t => t.type === 'connector_usage');
        if (difficulty === 'avanzada') pool = TEMPLATES.filter(t => t.type === 'text_order');

        if (pool.length === 0) pool = TEMPLATES;

        for (let i = 0; i < count; i++) {
            const template = pool[Math.floor(Math.random() * pool.length)];
            const qData = template.generate();

            const options = [
                { id: "a", text: qData.correct },
                { id: "b", text: qData.distractors[0] },
                { id: "c", text: qData.distractors[1] },
                { id: "d", text: qData.distractors[2] }
            ].sort(() => Math.random() - 0.5);

            const finalOptions = options.map((opt, idx) => ({
                id: ["a", "b", "c", "d"][idx],
                text: opt.text
            }));

            const correctAnswerId = finalOptions.find(o => o.text === qData.correct).id;

            // Generate deterministic ID
            const qId = generateId("comunicacion_escrita", qData.text, qData.correct);

            questions.push({
                id: qId,
                module: "comunicacion_escrita",
                text: qData.text,
                options: finalOptions,
                correctAnswer: correctAnswerId,
                explanation: qData.explanation,
                difficulty: difficulty
            });
        }
    };

    generateBatch(COUNTS.media, 'media');
    generateBatch(COUNTS.media_alta, 'media_alta');
    generateBatch(COUNTS.avanzada, 'avanzada');

    return questions;
}

const data = generateQuestions();
fs.writeFileSync(path.join(__dirname, '../data/questions-communication.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} written communication questions.`);
