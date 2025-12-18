const fs = require('fs');
const path = require('path');

const TOTAL_QUESTIONS = 150;
const COUNTS = {
    media: 100,
    media_alta: 30,
    avanzada: 20
};

// Bases para generar textos "semi-coherentes" proceduralmente para pruebas
const TEMPLATES = [
    {
        type: "argumentation",
        difficulty: "media",
        generate: () => {
            const topics = ["el cambio climático", "la inteligencia artificial", "la democracia digital", "la educación virtual", "la economía colaborativa"];
            const stances = ["es fundamental para el progreso", "plantea riesgos ineludibles", "requiere regulación inmediata", "transformará nuestra sociedad", "es una moda pasajera"];
            const connectors = ["Sin embargo,", "Por consiguiente,", "No obstante,", "Además,", "En contraste,"];

            const topic = topics[Math.floor(Math.random() * topics.length)];
            const stance = stances[Math.floor(Math.random() * stances.length)];
            const connector = connectors[Math.floor(Math.random() * connectors.length)];

            const text = `Muchos expertos afirman que ${topic} ${stance}. ${connector} otros sostienen que sus efectos a largo plazo son impredecibles. La evidencia sugiere que debemos ser cautelosos.`;

            return {
                text: `${text}\n\n¿Cuál es la función del conector "${connector}" en el texto?`,
                correct: "Introducir una idea que contrasta o amplía la anterior",
                distractors: [
                    "Concluir el argumento principal",
                    "Ejemplificar la afirmación inicial",
                    "Negar rotundamente la primera frase"
                ],
                explanation: `El conector "${connector}" se utiliza gramaticalmente para contrastar o añadir matices a la idea previa.`
            };
        }
    },
    {
        type: "inference",
        difficulty: "media_alta",
        generate: () => {
            const subjects = ["El protagonista", "El autor", "El narrador", "El político citado"];
            const actions = ["miró el reloj con ansiedad", "cerró la puerta de un golpe", "suspiró profundamente antes de responder", "evitó el contacto visual"];
            const implications = ["tenía prisa o estaba nervioso", "estaba furioso", "sentía resignación o cansancio", "ocultaba algo"];

            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const implication = implications[Math.floor(Math.random() * implications.length)]; // Note: This logic needs to align, keeping it simple for mass gen

            // Aligning logic for simplicity in script
            let correctImp = "";
            if (action.includes("reloj")) correctImp = "tenía prisa o impaciencia";
            else if (action.includes("golpe")) correctImp = "sentía ira o frustración";
            else if (action.includes("suspiró")) correctImp = "sentía resignación";
            else correctImp = "sentía culpa o evasión";

            return {
                text: `"${subject} ${action} mientras le hablaban."\n\nDel fragmento anterior se puede inferir que ${subject}:`,
                correct: correctImp,
                distractors: [
                    "Estaba muy feliz",
                    "No escuchaba nada",
                    "Tenía hambre"
                ],
                explanation: `La acción de "${action}" típicamente denota que el sujeto ${correctImp}.`
            };
        }
    },
    {
        type: "philosophical",
        difficulty: "avanzada",
        generate: () => {
            const concepts = ["La libertad", "La justicia", "La verdad", "El conocimiento"];
            const definitions = ["no es un fin, sino un medio", "es una construcción social", "reside en la mente del individuo", "es inalcanzable en su totalidad"];

            const concept = concepts[Math.floor(Math.random() * concepts.length)];
            const def = definitions[Math.floor(Math.random() * definitions.length)];

            const text = `Para el autor, ${concept.toLowerCase()} ${def}. Esto implica que no podemos juzgarla bajo parámetros absolutos, sino relativos al contexto histórico.`;

            return {
                text: `${text}\n\n¿Cuál de las siguientes afirmaciones es incompatible con el texto?`,
                correct: `${concept} es un valor absoluto e inmutable.`,
                distractors: [
                    `${concept} depende del contexto histórico.`,
                    `No existen parámetros únicos para ${concept.toLowerCase()}.`,
                    `El autor tiene una visión relativista de ${concept.toLowerCase()}.`
                ],
                explanation: `El texto afirma explícitamente que NO se puede juzgar bajo parámetros absolutos. Por tanto, decir que es "absoluto e inmutable" es incompatible.`
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    const generateBatch = (count, difficulty) => {
        // Filter templates that can support this difficulty (simplification)
        const templates = TEMPLATES.filter(t => t.difficulty === difficulty || (difficulty === 'media' && t.difficulty === 'media'));
        // Fallback if no specific logic
        const pool = templates.length > 0 ? templates : TEMPLATES;

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

            questions.push({
                module: "lectura_critica",
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
fs.writeFileSync(path.join(__dirname, '../data/questions-reading.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} reading questions.`);
